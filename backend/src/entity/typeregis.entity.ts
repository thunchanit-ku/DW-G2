// src/entity/type-regis.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('typeregis')
export class TypeRegis {
  @PrimaryColumn()
  typeRegisId: number;

  @Column({ length: 10 })
  type: string;
}
