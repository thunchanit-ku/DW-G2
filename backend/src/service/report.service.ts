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

  // ========================== WF HEATMAP: YEAR × CATEGORY ==========================
  async getWFHeatmapByYearCategory(filters: {
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
      );

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
        'COUNT(*) AS total',
        "SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS w_count",
        "SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS f_count",
      ])
      .groupBy('sca.category_name')
      .addGroupBy('fr.semester_year_in_regis')
      .orderBy('fr.semester_year_in_regis', 'ASC')
      .addOrderBy('sca.category_name', 'ASC')
      .getRawMany();

    return rows.map((r: any) => {
      const total = Number(r.total) || 0;
      const w = Number(r.w_count) || 0;
      const f = Number(r.f_count) || 0;
      const yearInDb = Number(r.year); // ปีใน database เป็น คศ.
      // แปลงคศ. เป็นพศ. สำหรับการแสดงผล (database เป็นคศ. แต่ต้องแสดงเป็นพศ.)
      const yearDisplay = yearInDb + 543;
      return {
        category: String(r.category),
        year: yearDisplay, // ส่งกลับเป็นพศ. เพื่อให้ frontend แสดงได้ทันที
        total,
        percentW: total > 0 ? (w / total) * 100 : 0,
        percentF: total > 0 ? (f / total) * 100 : 0,
      };
    });
  }
  
  // ========================== LIST DEPARTMENTS ==========================
  async listDepartments() {
    // inner join เพื่อแสดงเฉพาะภาควิชาที่มีข้อมูลจริงใน fact_student
    const rows = await this.depRepo
      .createQueryBuilder('d')
      .innerJoin(FactStudent, 'fs', 'fs.department_id = d.dept_id')
      .select([
        'd.dept_id AS id',
        'COALESCE(d.dept_alias_th, d.dept_name) AS name',
        'COUNT(DISTINCT fs.student_id) AS studentCount',
      ])
      .groupBy('d.dept_id')
      .addGroupBy('d.dept_alias_th')
      .addGroupBy('d.dept_name')
      .having('COUNT(DISTINCT fs.student_id) > 0')
      .orderBy('name', 'ASC')
      .getRawMany();
    return rows.map((r) => ({ id: Number(r.id), name: String(r.name), studentCount: Number(r.studentCount) }));
  }

  // ========================== LIST PROGRAMS ==========================
  async listPrograms() {
    // inner join เพื่อแสดงเฉพาะหลักสูตรที่มีข้อมูลจริงใน fact_student
    const rows = await this.progRepo
      .createQueryBuilder('p')
      .innerJoin(FactStudent, 'fs', 'fs.program_id = p.program_id')
      .select([
        'p.program_id AS id',
        'p.name_program AS name',
        'COUNT(DISTINCT fs.student_id) AS studentCount',
      ])
      .groupBy('p.program_id')
      .addGroupBy('p.name_program')
      .having('COUNT(DISTINCT fs.student_id) > 0')
      .orderBy('name', 'ASC')
      .getRawMany();
    return rows.map((r) => ({ id: Number(r.id), name: String(r.name), studentCount: Number(r.studentCount) }));
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

  // ========================== WF SUBJECT TABLE ==========================
  async getWFSubjectTable(filters: {
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
      );

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
         "SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS w_count",
         "SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS f_count",
       ])
       .groupBy('sca.category_name')
       .addGroupBy('st.name_subject_type')
       .addGroupBy('s.subject_code')
       .addGroupBy('s.name_subject_thai')
       .addGroupBy('fr.semester_year_in_regis')
       .having(
         "(SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) > 0 OR SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) > 0)"
       )
       .orderBy('sca.category_name', 'ASC')
       .addOrderBy('st.name_subject_type', 'ASC')
       .addOrderBy('s.subject_code', 'ASC')
       .addOrderBy('fr.semester_year_in_regis', 'ASC')
       .getRawMany();

     return rows.map((r: any) => {
       const yearInDb = Number(r.year); // ปีใน database เป็น คศ.
       const yearDisplay = yearInDb + 543; // แปลงเป็นพศ.
       const wCount = Number(r.w_count) || 0;
       const fCount = Number(r.f_count) || 0;
       return {
         category: String(r.category),
         type: String(r.type),
         subjectCode: String(r.subjectCode),
         subjectName: String(r.subjectName),
         year: yearDisplay,
         wCount,
         fCount,
         total: wCount + fCount, // รวม W + F เท่านั้น
       };
     });
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