import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fact_term_summary')
export class FactTermSummary {
  @PrimaryGeneratedColumn()
  termSummaryId: number;

  @Column({ type: 'varchar', length: 10 })
  studentId: string;

  @Column({ type: 'int' })
  studentStatusId: number;

  @Column({ type: 'int' })
  teacherId: number;

  @Column({ type: 'int' })
  creditTerm: number;

  @Column({ type: 'float' })
  gpaTerm: number;

  @Column({ type: 'float' })
  gpaAll: number;

  @Column({ type: 'int' })
  creditAll: number;

  @Column({ type: 'int' })
  studyYear: number;

  @Column({ type: 'int' })
  studyTerm: number;

  @Column({ type: 'varchar', length: 15 })
  planStatus: string;

  @Column({ type: 'int', nullable: true })
  generalSubjectCredit?: number;

  @Column({ type: 'int', nullable: true })
  specificSubjectCredit?: number;

  @Column({ type: 'int', nullable: true })
  freeSubjectCredit?: number;

  @Column({ type: 'int', nullable: true })
  selectSubjectCredit?: number;

  @Column({ type: 'int', nullable: true })
  generalSubjectCreditAll?: number;

  @Column({ type: 'int', nullable: true })
  specificSubjectCreditAll?: number;

  @Column({ type: 'int', nullable: true })
  freeSubjectCreditAll?: number;

  @Column({ type: 'int', nullable: true })
  selectSubjectCreditAll?: number;

  @Column({ type: 'int' })
  gpaStatusId: number;

  @Column({ type: 'int' })
  gpaxStatusId: number;

  @Column({ type: 'int' })
  semesterId: number;

  @Column({ type: 'int' })
  semesterYearInTerm: number;

  @Column({ type: 'varchar', length: 20 })
  semesterPartInTerm: string;
}
