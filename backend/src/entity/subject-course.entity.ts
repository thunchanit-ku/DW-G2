import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'subject_course' })
export class SubjectCourse {
  @PrimaryColumn({ name: 'subject_course_id', type: 'int' })
  subjectCourseId: number;

  @Column({ name: 'course_plan_id', type: 'int' })
  coursePlanId: number;

  @Column({ name: 'subject_id', type: 'int' })
  subjectId: number;

  @Column({ name: 'is_require', type: 'tinyint', default: 1 })
  isRequire: number;

  @Column({ name: 'part_year', type: 'int' })
  partYear: number;

  @Column({ name: 'std_term', type: 'int' })
  stdTerm: number;
}

