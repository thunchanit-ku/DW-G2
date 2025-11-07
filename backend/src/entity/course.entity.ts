// src/entity/course.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'course' })
export class Course {
  @PrimaryColumn({ name: 'course_id', type: 'int' })
  courseId: number;

  @Column({ name: 'name_course_th', type: 'varchar', length: 150 })
  nameCourseTh: string;

  @Column({ name: 'name_course_use', type: 'varchar', length: 50 })
  nameCourseUse: string;

  @Column({ name: 'name_course_eng', type: 'varchar', length: 150 })
  nameCourseEng: string;

  @Column({ name: 'name_full_degree_th', type: 'varchar', length: 150 })
  nameFullDegreeTh: string;

  @Column({ name: 'name_full_degree_eng', type: 'varchar', length: 150 })
  nameFullDegreeEng: string;

  @Column({ name: 'name_initials_degree_th', type: 'varchar', length: 100 })
  nameInitialsDegreeTh: string;

  @Column({ name: 'name_initials_degree_eng', type: 'varchar', length: 100 })
  nameInitialsDegreeEng: string;

  @Column({ name: 'department_id', type: 'int' })
  departmentId: number;
}

