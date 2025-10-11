import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'fact_term_summary' })
export class FactTermSummary {
  @PrimaryColumn({ name: 'fact_term_summary_id', type: 'int' })
  factTermSummaryId: number;

  @Column({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column({ name: 'teacher_id', type: 'int' })
  teacherId: number;

  @Column({ name: 'credit_term', type: 'int' })
  creditTerm: number;

  @Column({ name: 'credit_all', type: 'int' })
  creditAll: number;

  @Column({ name: 'gpa', type: 'float' })
  gpa: number;

  @Column({ name: 'gpax', type: 'float' })
  gpax: number;

  @Column({ name: 'study_year', type: 'int' })
  studyYear: number;

  @Column({ name: 'study_term', type: 'int' })
  studyTerm: number;

  @Column({ name: 'is_follow_plan', type: 'tinyint', default: 0 })
  isFollowPlan: number;

  @Column({ name: 'semester_year_in_term', type: 'int' })
  semesterYearInTerm: number;

  @Column({ name: 'semester_part_in_term', type: 'varchar', length: 45 })
  semesterPartInTerm: string;

  @Column({ name: 'grade_label_id', type: 'int', nullable: true })
  gradeLabelId?: number;

  @Column({ name: 'is_coop_eligible', type: 'tinyint', default: 0 })
  isCoopEligible: number;
}