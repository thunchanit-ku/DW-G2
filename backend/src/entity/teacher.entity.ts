// src/entity/teacher.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teacher' })
export class Teacher {
  @PrimaryColumn({ name: 'teacher_id', type: 'int' })
  teacherId: number;

  @Column({ name: 'username', type: 'varchar', length: 20 })
  username: string;

  @Column({ name: 'teacher_code', type: 'varchar', length: 10, nullable: true })
  teacherCode?: string;

  @Column({ name: 'teacher_name_th', type: 'varchar', length: 255 })
  teacherNameTh: string;

  @Column({ name: 'teacher_name_eng', type: 'varchar', length: 255 })
  teacherNameEng: string;

  @Column({ name: 'alias', type: 'varchar', length: 255 })
  alias: string;

  @Column({ name: 'department_id', type: 'int' })
  departmentId: number;

  @Column({ name: 'faculty_check', type: 'int' })
  facultyCheck: number;
}
