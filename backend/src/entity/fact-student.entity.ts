// src/entity/fact-student.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'fact_student' })
export class FactStudent {
  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column({ name: 'school_id', type: 'int' })
  schoolId: number;

  @Column({ name: 'department_id', type: 'int' })
  departmentId: number;

  @Column({ name: 'program_id', type: 'int' })
  programId: number;

  @Column({ name: 'teacher_id', type: 'int' })
  teacherId: number;

  @Column({ name: 'course_plan_id', type: 'int' })
  coursePlanId: number;

  @Column({ name: 'admission_round_id', type: 'int' })
  admissionRoundId: number;

  @Column({ name: 'student_status_id', type: 'int' })
  studentStatusId: number;

  @Column({ name: 'admission_year', type: 'int' })
  admissionYear: number;

  @Column({ name: 'study_generation', type: 'int' })
  studyGeneration: number;
}
