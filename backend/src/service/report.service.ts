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

  async getWFPercentageByCategory(filters: {
    departmentId?: number;
    programId?: number;
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, yearStart, yearEnd } = filters;

    // Convert BE -> CE if needed (e.g., 2560 → 2017)
    const toCE = (y: number) => (y > 2400 ? y - 543 : y);
    const ysCE = toCE(yearStart);
    const yeCE = toCE(yearEnd);

    const qb = this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin(SubjectType, 'st', 'st.subject_type_id = s.subject_type_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .leftJoin(GradeLabel, 'gl', 'gl.grade_label_id = fr.grade_label_id')
      .where('fr.semester_year_in_regis BETWEEN :ys AND :ye', { ys: ysCE, ye: yeCE })

    if (departmentId) {
      qb.andWhere('fs.department_id = :departmentId', { departmentId });
    }
    if (programId) {
      qb.andWhere('fs.program_id = :programId', { programId });
    }

    qb.select([
      'st.name_subject_type AS category',
      'COUNT(*) AS total',
      "SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS w_count",
      "SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS f_count",
    ])
      .groupBy('st.name_subject_type')
      .orderBy('st.name_subject_type', 'ASC');

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

  async getWFBoxplotByCategory(filters: {
    departmentId?: number;
    programId?: number;
    yearStart: number;
    yearEnd: number;
  }) {
    const { departmentId, programId, yearStart, yearEnd } = filters;
    const toCE = (y: number) => (y > 2400 ? y - 543 : y);
    const ysCE = toCE(yearStart);
    const yeCE = toCE(yearEnd);

    const rows = await this.frRepo
      .createQueryBuilder('fr')
      .innerJoin(SubjectCourse, 'sc', 'sc.subject_course_id = fr.subject_course_id')
      .innerJoin(Subject, 's', 's.subject_id = sc.subject_id')
      .innerJoin(SubjectType, 'st', 'st.subject_type_id = s.subject_type_id')
      .leftJoin(FactStudent, 'fs', 'fs.student_id = fr.student_id')
      .leftJoin(GradeLabel, 'gl', 'gl.grade_label_id = fr.grade_label_id')
      .where('fr.semester_year_in_regis BETWEEN :ys AND :ye', { ys: ysCE, ye: yeCE })
      .andWhere(departmentId ? 'fs.department_id = :departmentId' : '1=1', { departmentId })
      .andWhere(programId ? 'fs.program_id = :programId' : '1=1', { programId })
      .select([
        'st.name_subject_type AS category',
        'fr.semester_year_in_regis AS year',
        'fr.semester_part_in_regis AS part',
        'COUNT(*) AS total',
        "SUM(CASE WHEN (UPPER(fr.grade_character) = 'W' OR UPPER(gl.grade_status_name) = 'W') THEN 1 ELSE 0 END) AS w_count",
        "SUM(CASE WHEN (UPPER(fr.grade_character) = 'F' OR UPPER(gl.grade_status_name) = 'F') THEN 1 ELSE 0 END) AS f_count",
      ])
      .groupBy('st.name_subject_type')
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
  async listDepartments() {
    // join กับ fact_student เพื่อเอาเฉพาะภาควิชาที่มีข้อมูล และนับจำนวน
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
      .orderBy('name', 'ASC')
      .getRawMany();
    return rows.map((r) => ({ id: Number(r.id), name: String(r.name), studentCount: Number(r.studentCount) }));
  }

  async listPrograms() {
    // join กับ fact_student เพื่อเอาเฉพาะหลักสูตรที่มีข้อมูล และนับจำนวน
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
      .orderBy('name', 'ASC')
      .getRawMany();
    return rows.map((r) => ({ id: Number(r.id), name: String(r.name), studentCount: Number(r.studentCount) }));
  }
}


