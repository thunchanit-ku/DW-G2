// src/entity/program.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'program' })
export class Program {
  @PrimaryColumn({ name: 'program_id', type: 'int' })
  programId: number;

  @Column({ name: 'lang_program', type: 'varchar', length: 20 })
  langProgram: string;

  @Column({ name: 'name_program', type: 'varchar', length: 20 })
  nameProgram: string;
}
