// src/entity/semester.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('semester')
export class Semester {
  @PrimaryColumn()
  semesterId: number;

  @Column()
  semesterYear: number;

  @Column({ length: 10 })
  semesterPart: string;
}
