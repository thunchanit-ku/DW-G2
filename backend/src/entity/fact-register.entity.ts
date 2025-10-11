import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'fact_register' })
export class FactRegister {
  @PrimaryColumn({ name: 'regis_id', type: 'int' })
  regisId: number;

  @Column({ name: 'student_id', type: 'int', nullable: true })
  studentId?: number;

  @Column({ name: 'subject_code_in_regis', type: 'varchar', length: 10, nullable: true })
  subjectCodeInRegis?: string;

  @Column({ name: 'class_id', type: 'int', nullable: true })
  classId?: number;

  @Column({ name: 'sec_lecture', type: 'int', nullable: true })
  secLecture?: number;

  @Column({ name: 'sec_lab', type: 'int', nullable: true })
  secLab?: number;

  @Column({ name: 'grade_character', type: 'varchar', length: 2, nullable: true })
  gradeCharacter?: string;

  @Column({ name: 'grade_number', type: 'float', nullable: true })
  gradeNumber?: number;

  @Column({ name: 'credit_regis', type: 'int', nullable: true })
  creditRegis?: number;

  @Column({ 
    name: 'type_regis', 
    type: 'enum', 
    enum: ['0', '1'],
    nullable: true 
  })
  typeRegis?: '0' | '1';

  @Column({ name: 'study_year_in_regis', type: 'int', nullable: true })
  studyYearInRegis?: number;

  @Column({ name: 'study_term_in_regis', type: 'int', nullable: true })
  studyTermInRegis?: number;

  @Column({ name: 'semester_year_in_regis', type: 'int', nullable: true })
  semesterYearInRegis?: number;

  @Column({ 
    name: 'semester_part_in_regis', 
    type: 'enum', 
    enum: ['0', '1', '2'],
    nullable: true 
  })
  semesterPartInRegis?: '0' | '1' | '2';

  @Column({ name: 'subject_course_id', type: 'int', nullable: true })
  subjectCourseId?: number;

  @Column({ name: 'grade_label_id', type: 'int', nullable: true })
  gradeLabelId?: number;

  @Column({ name: 'credit_require_id', type: 'int', nullable: true })
  creditRequireId?: number;

  @Column({ name: 'register_time', type: 'int', default: 1 })
  registerTime: number;
}