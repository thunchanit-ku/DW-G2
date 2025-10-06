// src/student/student.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/test.entity';
import { CreateStudentDto } from '../dto/test.dto';
import * as fs from 'fs/promises'; 
import * as path from 'path';
import { FactRegis } from 'src/entity/fact-regis.entity';
import { Semester } from 'src/entity/semester.entity';
import { CourseList } from 'src/entity/courselist.entity';
import { TypeRegis } from 'src/entity/typeregis.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>
    ,
     @InjectRepository(FactRegis)
    private fact_regisRepo: Repository<FactRegis>

    ,
      @InjectRepository(Semester)
    private semesterRepo: Repository<Semester>
    ,
    @InjectRepository(CourseList)
    private courseListRepo: Repository<CourseList>
    ,
    @InjectRepository(TypeRegis)
    private typeRegisRepo: Repository<TypeRegis>,
  ) {}

  async create(data: CreateStudentDto) {
    const student = this.studentRepo.create(data);
    return await this.studentRepo.save(student);
  }

  async findAll() {
    return await this.studentRepo.find();
  }

  async findOne(id: string) {
    return await this.studentRepo.findOne({ where: { studentId: id } });
  }

  async update(id: string, data: Partial<CreateStudentDto>) {
    await this.studentRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.studentRepo.delete(id);
  }

 async updatedata(semester: string, year: number) {
  const filePath = path.resolve(__dirname, '../../../register_2students_2terms.json');
  const file = await fs.readFile(filePath, 'utf-8');
  const allRegis = JSON.parse(file);

  // ✅ กรองตามเงื่อนไขที่ต้องการ
  const filtered = allRegis.filter((item: any) => {
    return (
      item.semesterPartInRegis === semester &&
      item.semesterYearInRegis === year
    );
  });

  // ✅ DEBUG: ตรวจสอบว่า semesterId มีอยู่
  filtered.forEach((item: any, index: number) => {
    if (item.semesterId === undefined) {
      console.error(`❌ Record at index ${index} missing semesterId`, item);
    }
  });

  const toSave: FactRegis[] = [];

  for (const item of filtered) {
    const semesterEntity = await this.semesterRepo.findOne({ where: { semesterId: item.semesterId } });
    const courseListEntity = await this.courseListRepo.findOne({ where: { courseListId: item.courseListId } });
    const typeRegisEntity = await this.typeRegisRepo.findOne({ where: { typeRegisId: item.typeRegisId } });

    if (!semesterEntity || !courseListEntity || !typeRegisEntity) {
      console.warn(`❗ ข้อมูลไม่ครบสำหรับ studentId=${item.studentId}, ข้าม`);
      continue;
    }

    const newRegis = this.fact_regisRepo.create({
      studentId: item.studentId,
      subjectCodeInRegis: item.subjectCodeInRegis,
      secLecture: item.secLecture,
      secLab: item.secLab,
      gradeCharacter: item.gradeCharacter,
      gradeNumber: item.gradeNumber,
      creditRegis: item.creditRegis,
      studyYearInRegis: item.studyYearInRegis,
      studyTermInRegis: item.studyTermInRegis,
      semesterYearInRegis: item.semesterYearInRegis,
      semesterPartInRegis: item.semesterPartInRegis,

      // ✅ ความสัมพันธ์ Foreign Key
      semester: semesterEntity,
      courseList: courseListEntity,
      typeRegis: typeRegisEntity,
    });

    toSave.push(newRegis);
  }

  await this.fact_regisRepo.save(toSave);

  console.log(`✅ บันทึกข้อมูลสำเร็จ ${toSave.length} รายการ`);
  return toSave;
}

}
