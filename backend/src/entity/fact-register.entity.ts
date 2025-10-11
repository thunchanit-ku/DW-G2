// src/regis/entities/regis.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'fact_register' })
export class FactRegis {
  @PrimaryGeneratedColumn({ name: 'regis_id', type: 'int' })
  regisId: number;

  @Column({ name: 'student_id', type: 'varchar', length: 10 })
  studentId: string;

  @Column({ name: 'subject_code_in_regis', type: 'varchar', length: 10 })
  subjectCodeInRegis: string;

  @Column({ name: 'class_id', type: 'int', nullable: true })
  classId?: number;

  @Column({ name: 'sec_lecture', type: 'int' })
  secLecture: number;

  @Column({ name: 'sec_lab', type: 'int', nullable: true })
  secLab?: number;

  @Column({ name: 'grade_character', type: 'varchar', length: 2, nullable: true })
  gradeCharacter?: string;

  @Column({ name: 'grade_number', type: 'float', nullable: true })
  gradeNumber?: number;

  @Column({ name: 'credit_regis', type: 'int' })
  creditRegis: number;

  // ตารางจริงเป็น enum('0','1') ไม่ได้อ้างตาราง type_regis
  @Column({ name: 'type_regis', type: 'enum', enum: ['0', '1'] })
  typeRegis: '0' | '1';

  @Column({ name: 'study_year_in_regis', type: 'int' })
  studyYearInRegis: number;

  @Column({ name: 'study_term_in_regis', type: 'int' })
  studyTermInRegis: number;

  @Column({ name: 'semester_year_in_regis', type: 'int' })
  semesterYearInRegis: number;

  // ตารางจริงเป็น enum('0','1','2')
  @Column({ name: 'semester_part_in_regis', type: 'enum', enum: ['0', '1', '2'] })
  semesterPartInRegis: '0' | '1' | '2';

  // FK อื่น ๆ ในตาราง (ตามรูป)
  @Column({ name: 'subject_course_id', type: 'int', nullable: true })
  subjectCourseId?: number;

  @Column({ name: 'grade_label_id', type: 'int', nullable: true })
  gradeLabelId?: number;

  @Column({ name: 'credit_require_id', type: 'int', nullable: true })
  creditRequireId?: number;
}
