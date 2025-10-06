// src/regis/entities/regis.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { CourseList } from './courselist.entity';
import { Semester } from './semester.entity';
import { TypeRegis } from './typeregis.entity';

@Entity('fact_regis')
export class FactRegis {
    @PrimaryGeneratedColumn()
    regisId: number;

    @Column({ type: 'varchar', length: 10 })
    studentId: string;

    @ManyToOne(() => Semester)
    @JoinColumn({ name: 'semesterId' })
    semester: Semester;

    @ManyToOne(() => CourseList)
    @JoinColumn({ name: 'courseListId' })
    courseList: CourseList;

    @Column({ type: 'varchar', length: 10 })
    subjectCodeInRegis: string;

    @Column({ type: 'int' })
    secLecture: number;

    @Column({ type: 'int', nullable: true })
    secLab?: number;

    @Column({ type: 'varchar', length: 2, nullable: true })
    gradeCharacter?: string;

    @Column({ type: 'float', nullable: true })
    gradeNumber?: number;

    @Column({ type: 'int' })
    creditRegis: number;

    @ManyToOne(() => TypeRegis)
    @JoinColumn({ name: 'typeRegisId' })
    typeRegis: TypeRegis;

    @Column({ type: 'int' })
    studyYearInRegis: number;

    @Column({ type: 'int' })
    studyTermInRegis: number;

    @Column({ type: 'int' })
    semesterYearInRegis: number;

    @Column({ type: 'varchar', length: 20 })
    semesterPartInRegis: string;
}
