// src/entity/course-list.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('courselist')
export class CourseList {
  @PrimaryColumn()
  courseListId: number;

  @Column()
  courseId: number;

  @Column()
  courseGroupId: number;

  @Column()
  studyYear: number;

  @Column()
  term: number;

  @Column({ length: 150 })
  subjectCode: string;

  @Column({ length: 150 })
  subjectNameTh: string;

  @Column({ length: 150 })
  subjectNameEng: string;

  @Column()
  credit: number;

  @Column()
  lecture: number;

  @Column()
  lab: number;

  @Column()
  selfStudy: number;

  @Column()
  factCheck: number;
}
