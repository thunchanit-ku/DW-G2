// src/entity/course-plan.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'course_plan' })
export class CoursePlan {
  @PrimaryColumn({ name: 'course_plan_id', type: 'int' })
  coursePlanId: number;

  @Column({ name: 'course_id', type: 'int' })
  courseId: number;

  @Column({ name: 'plan_course', type: 'varchar', length: 50 })
  planCourse: string;

  @Column({ name: 'credit_intern', type: 'int' })
  creditIntern: number;

  @Column({ name: 'total_credit', type: 'int' })
  totalCredit: number;

  @Column({ name: 'internship_hours', type: 'int', nullable: true })
  internshipHours?: number;

  @Column({ name: 'is_visible', type: 'tinyint', default: 1 })
  isVisible: number;
}

