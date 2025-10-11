// src/student/entities/student.entity.ts
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'student' })
export class Student {
  @PrimaryColumn({ name: 'student_id', type: 'varchar', length: 10 })
  studentId: string;

  @Column({ name: 'student_username', type: 'varchar', length: 11, nullable: true })
  studentUsername?: string;

  @Column({ name: 'person_id', type: 'varchar', length: 13, nullable: true })
  personId?: string;

  @Column({ name: 'first_name_th', type: 'varchar', length: 50 })
  firstNameTh: string; // เดิมสะกดผิด

  @Column({ name: 'last_name_th', type: 'varchar', length: 50 })
  lastNameTh: string;

  @Column({ name: 'first_name_eng', type: 'varchar', length: 50, nullable: true })
  firstNameEng?: string; // เดิมสะกดผิด

  @Column({ name: 'last_name_eng', type: 'varchar', length: 50, nullable: true })
  lastNameEng?: string;

  @Column({ name: 'gender_th', type: 'enum', enum: ['ชาย', 'หญิง'], nullable: true })
  genderTh?: 'ชาย' | 'หญิง';

  @Column({ name: 'gender_eng', type: 'enum', enum: ['Male', 'Female'], nullable: true })
  genderEng?: 'Male' | 'Female';

  @Column({ name: 'title_th', type: 'enum', enum: ['นาย', 'นางสาว', 'นาง'], nullable: true })
  titleTh?: 'นาย' | 'นางสาว' | 'นาง';

  @Column({ name: 'title_eng', type: 'enum', enum: ['Mr.', 'Mrs.', 'Miss'], nullable: true })
  titleEng?: 'Mr.' | 'Mrs.' | 'Miss';

  @Column({ name: 'tell', type: 'varchar', length: 10, nullable: true })
  tell?: string;

  @Column({ name: 'parent_phone', type: 'varchar', length: 10, nullable: true })
  parentPhone?: string; // ชื่อพร็อพในโค้ดจะเปลี่ยนได้ แต่ map ไปคอลัมน์เดิม

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;
}
