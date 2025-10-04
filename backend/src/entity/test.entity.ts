// src/student/entities/student.entity.ts
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  studentId: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  studentUsername?: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  personId?: string;

  @Column({ type: 'varchar', length: 50 })
  fisrtNameTh: string;

  @Column({ type: 'varchar', length: 50 })
  lastNameTh: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fisrtNameEng?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastNameEng?: string;

  @Column({ type: 'enum', enum: ['ชาย', 'หญิง'], nullable: true })
  genderTh?: 'ชาย' | 'หญิง';

  @Column({ type: 'enum', enum: ['Male', 'Female'], nullable: true })
  genderEng?: 'Male' | 'Female';

  @Column({ type: 'enum', enum: ['นาย', 'นางสาว', 'นาง'], nullable: true })
  titleTh?: 'นาย' | 'นางสาว' | 'นาง';

  @Column({ type: 'enum', enum: ['Mr.', 'Mrs.', 'Miss'], nullable: true })
  titleEng?: 'Mr.' | 'Mrs.' | 'Miss';

  @Column({ type: 'varchar', length: 10, nullable: true })
  tell?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  parentTell?: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;
}
