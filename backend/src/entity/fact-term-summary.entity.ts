// src/fact-term-summary/entities/fact-term-summary.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'fact_term_summary' })
export class FactTermSummary {
  @PrimaryGeneratedColumn({ name: 'term_summary_id', type: 'int' })
  termSummaryId: number;

  @Column({ name: 'student_id', type: 'varchar', length: 10 })
  studentId: string;

  @Column({ name: 'teacher_id', type: 'int', nullable: true })
  teacherId?: number;

  @Column({ name: 'credit_term', type: 'int', nullable: true })
  creditTerm?: number;

  @Column({ name: 'credit_all', type: 'int', nullable: true })
  creditAll?: number;

  @Column({ name: 'gpa', type: 'float', nullable: true })
  gpa?: number;

  @Column({ name: 'gpax', type: 'float', nullable: true })
  gpax?: number;

  @Column({ name: 'study_year', type: 'int', nullable: true })
  studyYear?: number;

  @Column({ name: 'study_term', type: 'int', nullable: true })
  studyTerm?: number;

  // tinyint(1) → boolean ได้ (เก็บเป็น 0/1 ใน MySQL)
  @Column({ name: 'is_follow_plan', type: 'tinyint', width: 1, default: () => '0' })
  isFollowPlan: boolean;

  // ใน DB เป็น ENUM (ค่าจริงยาวและเป็นภาษาไทย)
  // เพื่อความยืดหยุ่นและไม่ให้ชนกับ enum ของ DB ระหว่างอ่าน/เขียน
  // เรา map เป็น string (varchar) แทน
  @Column({ name: 'student_status', type: 'varchar', length: 100, nullable: true })
  studentStatus?: string;

  @Column({ name: 'general_subject_credit', type: 'int', nullable: true })
  generalSubjectCredit?: number;

  @Column({ name: 'specific_subject_credit', type: 'int', nullable: true })
  specificSubjectCredit?: number;

  @Column({ name: 'free_subject_credit', type: 'int', nullable: true })
  freeSubjectCredit?: number;

  @Column({ name: 'select_subject_credit', type: 'int', nullable: true })
  selectSubjectCredit?: number;

  @Column({ name: 'general_subject_credit_all', type: 'int', nullable: true })
  generalSubjectCreditAll?: number;

  @Column({ name: 'specific_subject_credit_all', type: 'int', nullable: true })
  specificSubjectCreditAll?: number;

  @Column({ name: 'free_subject_credit_all', type: 'int', nullable: true })
  freeSubjectCreditAll?: number;

  @Column({ name: 'select_subject_credit_all', type: 'int', nullable: true })
  selectSubjectCreditAll?: number;

  @Column({ name: 'semester_year_in_term', type: 'int', nullable: true })
  semesterYearInTerm?: number;

  @Column({ name: 'semester_part_in_term', type: 'varchar', length: 45, nullable: true })
  semesterPartInTerm?: string;

  @Column({ name: 'grade_label_id', type: 'int', nullable: true })
  gradeLabelId?: number;

  @Column({ name: 'is_coop_eligible', type: 'tinyint', width: 1, default: () => '0' })
  isCoopEligible: boolean;
}
