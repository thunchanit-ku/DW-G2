// src/entity/province.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'province' })
export class Province {
  @PrimaryColumn({ name: 'province_id', type: 'int' })
  provinceId: number;

  @Column({ name: 'province_name', type: 'varchar', length: 50 })
  provinceName: string;

  @Column({ name: 'region_id', type: 'int' })
  regionId: number;
}
