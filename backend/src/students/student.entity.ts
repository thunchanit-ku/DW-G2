import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryColumn()
  studentID: string;

  @Column({ nullable: true })
  titleName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  provinceID: number;

  @Column({ nullable: true })
  schoolID: number;

  @Column({ nullable: true })
  programID: number;

  @Column({ nullable: true })
  studentStatusID: number;

  // เพิ่ม columns อื่นๆ ตามที่มีใน database
}

