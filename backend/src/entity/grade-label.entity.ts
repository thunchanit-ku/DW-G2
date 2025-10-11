import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'grade_label' })
export class GradeLabel {
  @PrimaryColumn({ name: 'grade_label_id', type: 'int' })
  gradeLabelId: number;

  @Column({ name: 'grade_status_name', type: 'varchar', length: 20, nullable: true })
  gradeStatusName?: string;

  @Column({ name: 'grade_min_in_status', type: 'float', nullable: true })
  gradeMinInStatus?: number;

  @Column({ name: 'grade_max_status', type: 'float', nullable: true })
  gradeMaxStatus?: number;
}
