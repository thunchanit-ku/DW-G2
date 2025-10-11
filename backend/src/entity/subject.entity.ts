import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'subject' })
export class Subject {
  @PrimaryColumn({ name: 'subject_id', type: 'int' })
  subjectId: number;

  @Column({ name: 'course_id', type: 'int' })
  courseId: number;

  @Column({ name: 'subject_type_id', type: 'int' })
  subjectTypeId: number;

  @Column({ name: 'subject_category_id', type: 'int' })
  subjectCategoryId: number;

  @Column({ name: 'sub_credit_id', type: 'int' })
  subCreditId: number;

  @Column({ name: 'subject_code', type: 'varchar', length: 20 })
  subjectCode: string;

  @Column({ name: 'name_subject_thai', type: 'varchar', length: 100 })
  nameSubjectThai: string;

  @Column({ name: 'name_subject_eng', type: 'varchar', length: 100 })
  nameSubjectEng: string;

  @Column({ name: 'credit', type: 'int' })
  credit: number;

  @Column({ name: 'is_visible', type: 'tinyint', default: 1 })
  isVisible: number;
}
