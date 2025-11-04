import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactRegister } from '../entity/fact-register.entity';
import { SubjectCourse } from '../entity/subject-course.entity';
import { Subject } from '../entity/subject.entity';
import { SubjectType } from '../entity/subject-type.entity';
import { FactStudent } from '../entity/fact-student.entity';
import { Department } from '../entity/department.entity';
import { Program } from '../entity/program.entity';
import { GradeLabel } from '../entity/grade-label.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(FactRegister) private readonly frRepo: Repository<FactRegister>,
    @InjectRepository(SubjectCourse) private readonly scRepo: Repository<SubjectCourse>,
    @InjectRepository(Subject) private readonly sRepo: Repository<Subject>,
    @InjectRepository(SubjectType) private readonly stRepo: Repository<SubjectType>,
    @InjectRepository(FactStudent) private readonly fsRepo: Repository<FactStudent>,
    @InjectRepository(Department) private readonly depRepo: Repository<Department>,
    @InjectRepository(Program) private readonly progRepo: Repository<Program>,
    @InjectRepository(GradeLabel) private readonly glRepo: Repository<GradeLabel>,
  ) {}

  // ========================== WF PERCENTAGE ==========================
  async getWFPercentageByCategory(filters: {
    departmentId?: number;
    programId?: number;
    departmentIds?: number[];
    programIds?: number[];
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, departmentIds, programIds, yearStart, yearEnd } = filters;

    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin('subject_category', 'sca', 'sca.subject_category_id = s.subject_category_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .leftJoin(GradeLabel, 'gl', 'gl.grade_label_id = fr.grade_label_id')
      .where(
        `fr.semester_year_in_regis BETWEEN 
         (CASE WHEN :ys > 2400 THEN :ys - 543 ELSE :ys END) AND 
         (CASE WHEN :ye > 2400 THEN :ye - 543 ELSE :ye END)`,
        { ys: yearStart, ye: yearEnd },
      )

    // ใช้ if block เพื่อเพิ่มเงื่อนไขการกรอง (วิธีดั้งเดิม)
    if (departmentIds && departmentIds.length) {
      qb.andWhere('fs.department_id IN (:...departmentIds)', { departmentIds });
    } else if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programIds && programIds.length) {
      qb.andWhere('fs.program_id IN (:...programIds)', { programIds });
    } else if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    qb.select([
      'sca.category_name AS category',
      'COUNT(*) AS total',
      "SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS w_count",
      "SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS f_count",
    ])
      .groupBy('sca.category_name')
      .orderBy('sca.category_name', 'ASC');

    const rows = await qb.getRawMany();

    return rows.map((r) => {
      const total = Number(r.total) || 0;
      const w = Number(r.w_count) || 0;
      const f = Number(r.f_count) || 0;
      return {
        category: r.category as string,
        total,
        percentW: total > 0 ? (w / total) * 100 : 0,
        percentF: total > 0 ? (f / total) * 100 : 0,
      };
    });
  }

  // ========================== WF BOXPLOT ==========================
  async getWFBoxplotByCategory(filters: {
    departmentId?: number;
    programId?: number;
    departmentIds?: number[];
    programIds?: number[];
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, departmentIds, programIds, yearStart, yearEnd } = filters;
    
    // ** การแก้ไข: เปลี่ยนการใช้ andWhere ให้ใช้ if block เหมือนฟังก์ชันด้านบนเพื่อความสม่ำเสมอและชัดเจน
    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin('subject_category', 'sca', 'sca.subject_category_id = s.subject_category_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .leftJoin(GradeLabel, 'gl', 'gl.grade_label_id = fr.grade_label_id')
      .where(
        `fr.semester_year_in_regis BETWEEN 
         (CASE WHEN :ys > 2400 THEN :ys - 543 ELSE :ys END) AND 
         (CASE WHEN :ye > 2400 THEN :ye - 543 ELSE :ye END)`,
        { ys: yearStart, ye: yearEnd },
      );
    
    // ใช้ if block เพื่อเพิ่มเงื่อนไขการกรอง (แก้ไขจากโค้ดเดิม)
    if (departmentIds && departmentIds.length) {
      qb.andWhere('fs.department_id IN (:...departmentIds)', { departmentIds });
    } else if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programIds && programIds.length) {
      qb.andWhere('fs.program_id IN (:...programIds)', { programIds });
    } else if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    const rows = await qb
      .select([
        'sca.category_name AS category',
        'fr.semester_year_in_regis AS year',
        'fr.semester_part_in_regis AS part',
        'COUNT(*) AS total',
        "SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS w_count",
        "SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS f_count",
      ])
      .groupBy('sca.category_name')
      .addGroupBy('fr.semester_year_in_regis')
      .addGroupBy('fr.semester_part_in_regis')
      .getRawMany();

    // build distributions per category
    const byCat: Record<string, { w: number[]; f: number[] }> = {};
    for (const r of rows as any[]) {
      const category = String(r.category);
      const total = Number(r.total) || 0;
      const w = Number(r.w_count) || 0;
      const f = Number(r.f_count) || 0;
      if (!byCat[category]) byCat[category] = { w: [], f: [] };
      if (total > 0) {
        byCat[category].w.push((w / total) * 100);
        byCat[category].f.push((f / total) * 100);
      }
    }

    const quantiles = (arr: number[]) => {
      if (!arr.length) return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
      const a = [...arr].sort((x, y) => x - y);
      const q = (p: number) => {
        const idx = (a.length - 1) * p;
        const lo = Math.floor(idx);
        const hi = Math.ceil(idx);
        if (lo === hi) return a[lo];
        const frac = idx - lo;
        return a[lo] * (1 - frac) + a[hi] * frac;
      };
      return { min: a[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: a[a.length - 1] };
    };

    return Object.entries(byCat).map(([category, { w, f }]) => ({
      category,
      W: quantiles(w),
      F: quantiles(f),
    }));
  }
  
  // ========================== LIST DEPARTMENTS ==========================
  async listDepartments() {
    // left join เพื่อให้โชว์ทุกภาควิชา แม้ไม่มีข้อมูลใน fact_student และนับจำนวนถ้ามี
    const rows = await this.depRepo
      .createQueryBuilder('d')
      .leftJoin(FactStudent, 'fs', 'fs.department_id = d.dept_id')
      .select([
        'd.dept_id AS id',
        'COALESCE(d.dept_alias_th, d.dept_name) AS name',
        'COUNT(DISTINCT fs.student_id) AS studentCount',
      ])
      .groupBy('d.dept_id')
      .addGroupBy('d.dept_alias_th')
      .addGroupBy('d.dept_name')
      .orderBy('name', 'ASC')
      .getRawMany();
    return rows.map((r) => ({ id: Number(r.id), name: String(r.name), studentCount: Number(r.studentCount) }));
  }

  // ========================== LIST PROGRAMS ==========================
  async listPrograms() {
    // เปลี่ยนเป็นดึงข้อมูลจากตาราง course โดยนับจำนวนนิสิตผ่าน course_plan -> fact_student
    const rows = await this.progRepo.manager.query(
      `
      SELECT
        c.course_id AS id,
        c.name_course_use AS name,
        COUNT(DISTINCT fs.student_id) AS studentCount
      FROM course c
      LEFT JOIN course_plan cp ON cp.course_id = c.course_id
      LEFT JOIN fact_student fs ON fs.course_plan_id = cp.course_plan_id
      GROUP BY c.course_id, c.name_course_use
      ORDER BY name ASC
      `
    );
    return rows.map((r: any) => ({ id: Number(r.id), name: String(r.name), studentCount: Number(r.studentCount) }));
  }

  // ========================== LIST SEMESTERS ==========================
  async listSemesters() {
    // คืนค่าทุกภาคการศึกษาเสมอ โดยไม่ขึ้นกับข้อมูลในตาราง
    return [
      { value: 1, label: 'ภาคต้น' },
      { value: 2, label: 'ภาคปลาย' },
      { value: 0, label: 'ฤดูร้อน' },
    ];
  }

  // ========================== SUBJECT GRADE COUNTS (F/W/P) ==========================
  async getSubjectGradeCounts(filters: {
    departmentId?: number;
    programId?: number;
    yearStart: number;
    yearEnd: number;
    semesterParts?: number[];
  }) {
    const params: any[] = [];
    const where: string[] = [];

    // แปลงปี พ.ศ. เป็น ค.ศ. สำหรับ query (ถ้า yearStart > 2400 แสดงว่าเป็น พ.ศ.)
    const yearStartCE = filters.yearStart > 2400 ? filters.yearStart - 543 : filters.yearStart;
    const yearEndCE = filters.yearEnd > 2400 ? filters.yearEnd - 543 : filters.yearEnd;
    where.push(`fr.semester_year_in_regis BETWEEN ? AND ?`);
    params.push(yearStartCE, yearEndCE);

    if (filters.departmentId) {
      where.push(`fs.department_id = ?`);
      params.push(filters.departmentId);
    }
    if (filters.programId) {
      where.push(`fs.program_id = ?`);
      params.push(filters.programId);
    }
    if (filters.semesterParts && filters.semesterParts.length) {
      where.push(`fr.semester_part_in_regis IN (${filters.semesterParts.map(() => '?').join(',')})`);
      params.push(...filters.semesterParts);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT
        fr.subject_code_in_regis AS subjectCode,
        fr.semester_year_in_regis AS year,
        fr.semester_part_in_regis AS semesterPart,
        COUNT(*) AS total,
        SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS countF,
        SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS countW
      FROM fact_register fr
      LEFT JOIN fact_student fs ON fs.student_id = fr.student_id
      LEFT JOIN grade_label gl ON gl.grade_label_id = fr.grade_label_id
      ${whereSql}
      GROUP BY fr.subject_code_in_regis, fr.semester_year_in_regis, fr.semester_part_in_regis
    `;

    const rows: any[] = await this.progRepo.manager.query(sql, params);

    return rows.map((r) => {
      const total = Number(r.total) || 0;
      const countF = Number(r.countF) || 0;
      const countW = Number(r.countW) || 0;
      const countP = Math.max(0, total - countF - countW);
      const yearCE = Number(r.year);
      // แปลงปี ค.ศ. เป็น พ.ศ. สำหรับ response (ถ้า year < 2200 แสดงว่าเป็น ค.ศ.)
      const yearBE = yearCE < 2200 ? yearCE + 543 : yearCE;
      return {
        subjectCode: String(r.subjectCode),
        year: yearBE,
        semesterPart: Number(r.semesterPart),
        total,
        countF,
        countW,
        countP,
      };
    });
  }

  // ========================== AVG GPA BY CATEGORY ==========================
  async getAvgGpaByCategory(filters: {
    departmentId?: number;
    programId?: number;
    departmentIds?: number[];
    programIds?: number[];
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, departmentIds, programIds, yearStart, yearEnd } = filters;

    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin('subject_category', 'sca', 'sca.subject_category_id = s.subject_category_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .where(
        `fr.semester_year_in_regis BETWEEN 
         (CASE WHEN :ys > 2400 THEN :ys - 543 ELSE :ys END) AND 
         (CASE WHEN :ye > 2400 THEN :ye - 543 ELSE :ye END)`,
        { ys: yearStart, ye: yearEnd },
      )
      .andWhere('fr.grade_number IS NOT NULL');

    if (departmentIds && departmentIds.length) {
      qb.andWhere('fs.department_id IN (:...departmentIds)', { departmentIds });
    } else if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programIds && programIds.length) {
      qb.andWhere('fs.program_id IN (:...programIds)', { programIds });
    } else if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    const rows = await qb
      .select([
        'sca.category_name AS category',
        'AVG(fr.grade_number) AS avg_gpa',
        'COUNT(*) AS n',
      ])
      .groupBy('sca.category_name')
      .orderBy('sca.category_name', 'ASC')
      .getRawMany();

    return rows.map((r: any) => ({
      category: String(r.category),
      avgGpa: r.avg_gpa != null ? Number(r.avg_gpa) : null,
      count: Number(r.n) || 0,
    }));
  }

  // ========================== GPA BOXPLOT BY CATEGORY ==========================
  async getGpaBoxplotByCategory(filters: {
    departmentId?: number;
    programId?: number;
    departmentIds?: number[];
    programIds?: number[];
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, departmentIds, programIds, yearStart, yearEnd } = filters;

    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin('subject_category', 'sca', 'sca.subject_category_id = s.subject_category_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .where(
        `fr.semester_year_in_regis BETWEEN 
         (CASE WHEN :ys > 2400 THEN :ys - 543 ELSE :ys END) AND 
         (CASE WHEN :ye > 2400 THEN :ye - 543 ELSE :ye END)`,
        { ys: yearStart, ye: yearEnd },
      )
      .andWhere('fr.grade_number IS NOT NULL');

    if (departmentIds && departmentIds.length) {
      qb.andWhere('fs.department_id IN (:...departmentIds)', { departmentIds });
    } else if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programIds && programIds.length) {
      qb.andWhere('fs.program_id IN (:...programIds)', { programIds });
    } else if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    const rows = await qb
      .select([
        'sca.category_name AS category',
        'fr.grade_number AS grade',
      ])
      .getRawMany();

    const byCat: Record<string, number[]> = {};
    for (const r of rows as any[]) {
      const category = String(r.category);
      const g = Number(r.grade);
      if (!Number.isFinite(g)) continue;
      if (!byCat[category]) byCat[category] = [];
      byCat[category].push(g);
    }

    const quantiles = (arr: number[]) => {
      if (!arr.length) return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
      const a = [...arr].sort((x, y) => x - y);
      const q = (p: number) => {
        const idx = (a.length - 1) * p;
        const lo = Math.floor(idx);
        const hi = Math.ceil(idx);
        if (lo === hi) return a[lo];
        const frac = idx - lo;
        return a[lo] * (1 - frac) + a[hi] * frac;
      };
      return { min: a[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: a[a.length - 1] };
    };

    return Object.entries(byCat).map(([category, values]) => ({
      category,
      GPA: quantiles(values),
    }));
  }

  // ========================== GPA SCATTER BY TIME ==========================
  async getAvgGpaScatter(filters: {
    departmentId?: number;
    programId?: number;
    yearStart: number;
    yearEnd: number;
    semesterParts?: number[]; // 0,1,2
  }) {
    const params: any[] = [];
    const where: string[] = [];

    where.push(`fr.study_year_in_regis BETWEEN ? AND ?`);
    params.push(filters.yearStart, filters.yearEnd);

    if (filters.departmentId) {
      where.push(`fs.department_id = ?`);
      params.push(filters.departmentId);
    }
    if (filters.programId) {
      where.push(`fs.program_id = ?`);
      params.push(filters.programId);
    }
    if (filters.semesterParts && filters.semesterParts.length) {
      // แปลง semester_part_in_regis เป็น number ก่อนเปรียบเทียบ (รองรับทั้ง string และ number)
      where.push(`CAST(fr.semester_part_in_regis AS UNSIGNED) IN (${filters.semesterParts.map(() => '?').join(',')})`);
      params.push(...filters.semesterParts);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Select avg GPA per subject/year/semester/class with any available classtime info
    const sql = `
      SELECT
        fr.subject_code_in_regis       AS subjectCode,
        fr.study_year_in_regis         AS year,
        fr.semester_part_in_regis      AS semesterPart,
        fr.class_id                    AS classId,
        AVG(fr.grade_number)           AS avgGpa,
        MIN(fru.classtime1)            AS classtime1,
        MIN(fru.class_hr)              AS classHr
      FROM fact_register fr
      LEFT JOIN fact_student fs ON fs.student_id = fr.student_id
      LEFT JOIN fact_room_usage fru ON fru.class_id = fr.class_id
      ${whereSql}
      GROUP BY fr.subject_code_in_regis, fr.study_year_in_regis, fr.semester_part_in_regis, fr.class_id
    `;

    const rows: any[] = await this.progRepo.manager.query(sql, params);

    // Assumptions for decoding classtime1 bitstring
    const SLOT_MIN = 30; // minutes per slot
    const BASE_HOUR = 8; // first slot starts at 08:00

    function computeMeanHour(bitString?: string | null, classHr?: number | null): number | null {
      if (!bitString || !/1/.test(bitString)) return null;
      const idx = bitString.indexOf('1');
      if (idx < 0) return null;
      const startHour = BASE_HOUR + (idx * SLOT_MIN) / 60;
      const dur = typeof classHr === 'number' ? classHr : 0;
      if (!dur) return startHour; // fallback to start if duration unknown
      return startHour + dur / 2;
    }

    return rows.map((r) => ({
      subjectCode: String(r.subjectCode),
      year: Number(r.year),
      semesterPart: Number(r.semesterPart),
      classId: r.classId != null ? Number(r.classId) : null,
      avgGpa: r.avgGpa != null ? Number(r.avgGpa) : null,
      meanHour: computeMeanHour(r.classtime1 as string | null, r.classHr != null ? Number(r.classHr) : null),
    }));
  }

  // ========================== SUBJECT GPA TABLE ==========================
  async getSubjectGpaTable(filters: {
    departmentId?: number;
    programId?: number;
    departmentIds?: number[];
    programIds?: number[];
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, departmentIds, programIds, yearStart, yearEnd } = filters;

    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin('subject_category', 'sca', 'sca.subject_category_id = s.subject_category_id')
      .innerJoin('subject_type', 'st', 'st.subject_type_id = s.subject_type_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .leftJoin(GradeLabel, 'gl', 'gl.grade_label_id = fr.grade_label_id')
      .where(
        `fr.semester_year_in_regis BETWEEN 
         (CASE WHEN :ys > 2400 THEN :ys - 543 ELSE :ys END) AND 
         (CASE WHEN :ye > 2400 THEN :ye - 543 ELSE :ye END)`,
        { ys: yearStart, ye: yearEnd },
      )
      .andWhere("(UPPER(fr.grade_character) <> 'W' AND (gl.grade_status_name IS NULL OR UPPER(gl.grade_status_name) <> 'W'))")
      .andWhere('fr.grade_number IS NOT NULL');

    if (departmentIds && departmentIds.length) {
      qb.andWhere('fs.department_id IN (:...departmentIds)', { departmentIds });
    } else if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programIds && programIds.length) {
      qb.andWhere('fs.program_id IN (:...programIds)', { programIds });
    } else if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    const rows = await qb
      .select([
        'sca.category_name AS category',
        'st.name_subject_type AS type',
        's.subject_code AS subjectCode',
        's.name_subject_thai AS subjectName',
        'fr.semester_year_in_regis AS year',
        'AVG(fr.grade_number) AS avgGpa',
        'COUNT(*) AS studentCount',
      ])
      .groupBy('sca.category_name')
      .addGroupBy('st.name_subject_type')
      .addGroupBy('s.subject_code')
      .addGroupBy('s.name_subject_thai')
      .addGroupBy('fr.semester_year_in_regis')
      .orderBy('sca.category_name', 'ASC')
      .addOrderBy('st.name_subject_type', 'ASC')
      .addOrderBy('s.subject_code', 'ASC')
      .addOrderBy('fr.semester_year_in_regis', 'ASC')
      .getRawMany();

    return rows.map((r: any) => ({
      category: String(r.category),
      type: String(r.type),
      subjectCode: String(r.subjectCode),
      subjectName: String(r.subjectName),
      year: Number(r.year),
      avgGpa: r.avgGpa != null ? Number(r.avgGpa) : null,
      studentCount: Number(r.studentCount) || 0,
    }));
  }

  // ========================== HEATMAP: CATEGORY × TEACHING MODE ==========================
  async getCategoryTeachingModeHeatmap(filters: {
    departmentId?: number;
    programId?: number;
    departmentIds?: number[];
    programIds?: number[];
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, departmentIds, programIds, yearStart, yearEnd } = filters;

    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin('subject_category', 'sca', 'sca.subject_category_id = s.subject_category_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .leftJoin(GradeLabel, 'gl', 'gl.grade_label_id = fr.grade_label_id')
      .where(
        `fr.semester_year_in_regis BETWEEN 
         (CASE WHEN :ys > 2400 THEN :ys - 543 ELSE :ys END) AND 
         (CASE WHEN :ye > 2400 THEN :ye - 543 ELSE :ye END)`,
        { ys: yearStart, ye: yearEnd },
      )
      .andWhere('fr.grade_number IS NOT NULL')
      .andWhere("(UPPER(fr.grade_character) <> 'W' AND (gl.grade_status_name IS NULL OR UPPER(gl.grade_status_name) <> 'W'))");

    if (departmentIds && departmentIds.length) {
      qb.andWhere('fs.department_id IN (:...departmentIds)', { departmentIds });
    } else if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programIds && programIds.length) {
      qb.andWhere('fs.program_id IN (:...programIds)', { programIds });
    } else if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    const modeCase = `CASE 
      WHEN fr.sec_lecture IS NOT NULL AND fr.sec_lab IS NOT NULL AND fr.sec_lecture <> 0 AND fr.sec_lab <> 0 THEN 'บรรยายและปฏิบัติ'
      WHEN fr.sec_lecture IS NOT NULL AND fr.sec_lecture <> 0 AND (fr.sec_lab IS NULL OR fr.sec_lab = 0) THEN 'ภาคบรรยาย'
      WHEN fr.sec_lab IS NOT NULL AND fr.sec_lab <> 0 AND (fr.sec_lecture IS NULL OR fr.sec_lecture = 0) THEN 'ปฏิบัติ'
      ELSE 'อื่นๆ'
    END`;

    const rows = await qb
      .select([
        'sca.category_name AS category',
        `${modeCase} AS mode`,
        'AVG(fr.grade_number) AS avgGpa',
        'COUNT(*) AS studentCount',
      ])
      .groupBy('sca.category_name')
      .addGroupBy('mode')
      .orderBy('sca.category_name', 'ASC')
      .addOrderBy('mode', 'ASC')
      .getRawMany();

    return rows.map((r: any) => ({
      category: String(r.category),
      mode: String(r.mode),
      avgGpa: r.avgGpa != null ? Number(r.avgGpa) : null,
      studentCount: Number(r.studentCount) || 0,
    }));
  }
}