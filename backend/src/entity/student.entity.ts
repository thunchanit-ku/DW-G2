import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'student' })
export class Student {
  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column({ name: 'student_username', type: 'varchar', length: 10 })
  studentUsername: string;

  @Column({ 
    name: 'std_level', 
    type: 'enum', 
    enum: ['b', 'g'],
    nullable: true 
  })
  stdLevel?: 'b' | 'g';

  @Column({ name: 'person_id', type: 'varchar', length: 13, nullable: true })
  personId?: string;

  @Column({ name: 'name_th', type: 'varchar', length: 50 })
  nameTh: string;

  @Column({ name: 'name_eng', type: 'varchar', length: 50 })
  nameEng: string;

  @Column({ 
    name: 'gender_th', 
    type: 'enum', 
    enum: ['ชาย', 'หญิง'],
    nullable: true 
  })
  genderTh?: 'ชาย' | 'หญิง';

  @Column({ 
    name: 'gender_eng', 
    type: 'enum', 
    enum: ['Male', 'Female'],
    nullable: true 
  })
  genderEng?: 'Male' | 'Female';

  @Column({ 
    name: 'title_th', 
    type: 'enum', 
    enum: ['นาย', 'นางสาว', 'นาง']
  })
  titleTh: 'นาย' | 'นางสาว' | 'นาง';

  @Column({ 
    name: 'title_eng', 
    type: 'enum', 
    enum: ['Mr.', 'Mrs.', 'Miss']
  })
  titleEng: 'Mr.' | 'Mrs.' | 'Miss';

  @Column({ name: 'tell', type: 'varchar', length: 10 })
  tell: string;

  @Column({ name: 'parent_phone', type: 'varchar', length: 10, nullable: true })
  parentPhone?: string;

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;
}