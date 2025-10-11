// src/entity/student-status.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'student_status' })
export class StudentStatus {
  @PrimaryColumn({ name: 'student_status_id', type: 'int' })
  studentStatusId: number;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;
}
