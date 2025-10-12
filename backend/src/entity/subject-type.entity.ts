import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'subject_type' })
export class SubjectType {
  @PrimaryColumn({ name: 'subject_type_id', type: 'int' })
  subjectTypeId: number;

  @Column({ name: 'name_subject_type', type: 'varchar', length: 50 })
  nameSubjectType: string;

  @Column({ name: 'is_visible', type: 'tinyint', default: 1 })
  isVisible: number;
}

