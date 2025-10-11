// src/entity/department.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'department' })
export class Department {
  @PrimaryColumn({ name: 'dept_id', type: 'int' })
  deptId: number;

  @Column({ name: 'dept_code', type: 'varchar', length: 10 })
  deptCode: string;

  @Column({ name: 'dept_name', type: 'varchar', length: 30 })
  deptName: string;

  @Column({ name: 'dept_alias_th', type: 'varchar', length: 20 })
  deptAliasTh: string;
}
