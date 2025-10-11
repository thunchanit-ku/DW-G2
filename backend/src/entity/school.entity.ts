// src/entity/school.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'school' })
export class School {
  @PrimaryColumn({ name: 'school_id', type: 'int' })
  schoolId: number;

  @Column({ name: 'school_name', type: 'varchar', length: 150 })
  schoolName: string;

  @Column({ name: 'province_id', type: 'int' })
  provinceId: number;
}
