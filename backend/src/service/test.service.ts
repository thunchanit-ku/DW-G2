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

async calculateGradeProgress(studentId: string) {
  const sql = `
    SELECT 
        t.studentId,
        t.ปีการศึกษา,
        t.ภาคการศึกษา,
        t.หน่วยกิตรวม,
        t.GPAภาค,
        t.GPAสะสม,
        ROUND(t.GPAภาค - @prev_gpa, 2) AS ผลต่างเกรด,
        @prev_gpa := t.GPAภาค
    FROM (
        SELECT 
            fr.studentId,
            fr.semesterYearInRegis AS ปีการศึกษา,
            fr.semesterPartInRegis AS ภาคการศึกษา,
            SUM(fr.creditRegis) AS หน่วยกิตรวม,
            ROUND(SUM(fr.creditRegis * fr.gradeNumber) / SUM(fr.creditRegis), 2) AS GPAภาค,
            (
                SELECT 
                    ROUND(SUM(f2.creditRegis * f2.gradeNumber) / SUM(f2.creditRegis), 2)
                FROM fact_regis f2
                WHERE f2.studentId = fr.studentId
                  AND (
                      f2.semesterYearInRegis < fr.semesterYearInRegis OR
                      (f2.semesterYearInRegis = fr.semesterYearInRegis 
                       AND f2.semesterPartInRegis <= fr.semesterPartInRegis)
                  )
            ) AS GPAสะสม
        FROM fact_regis fr
        WHERE fr.studentId = ?
        GROUP BY fr.studentId, fr.semesterYearInRegis, fr.semesterPartInRegis
        ORDER BY fr.semesterYearInRegis, fr.semesterPartInRegis
    ) AS t
    JOIN (SELECT @prev_gpa := NULL) AS vars;
  `;

  const result = await this.fact_regisRepo.query(sql, [studentId]);
  return result;
}

// ดึงข้อมูลโปรไฟล์นักศึกษาให้ตรงกับหน้าจอข้อมูลส่วนตัว/การศึกษา
async getStudentProfile(studentId: string) {
  const sql = `
    SELECT
      s.studentId AS studentId,
      CONCAT_WS(' ', s.titleTh, s.fisrtNameTh, s.lastNameTh) AS nameTh,
      CONCAT_WS(' ', s.titleEng, s.fisrtNameEng, s.lastNameEng) AS nameEn,
      s.personId AS nationalId,
      s.genderTh AS gender,
      s.tell AS phone,
      s.email AS email,
      s.parentTell AS parentPhone,

      -- มิติการศึกษา
      CONCAT_WS(' ', t.titleTecherTh, t.fisrtNameTh, t.lastNameTh) AS advisor,
      d.campus AS campus,
      d.faculty AS faculty,
      d.departmentName AS major,
      p.langProgram AS programType,

      -- สถานภาพและ GPA สะสมจาก fact_term_summary แถวล่าสุดของแต่ละนักศึกษา
      ss.status AS studentStatus,
      fts_latest.gpaAll AS gpa,

      -- ข้อมูลโรงเรียนเดิม
      sch.schoolName AS highSchool,
      prov.provinceName AS highSchoolLocation
    FROM fact_student fs
    JOIN student s           ON s.studentId = fs.studentId
    LEFT JOIN teacher t      ON t.teacherId = fs.teacherId
    LEFT JOIN department d   ON d.departmentId = fs.departmentId
    LEFT JOIN program p      ON p.programId = fs.programId
    LEFT JOIN school sch     ON sch.schoolId = fs.schoolId
    LEFT JOIN province prov  ON prov.provinceId = sch.provinceId
    LEFT JOIN (
      SELECT x.studentId, x.gpaAll, x.studentStatusId
      FROM fact_term_summary x
      JOIN (
        SELECT studentId, MAX(semesterId) AS maxSem
        FROM fact_term_summary
        GROUP BY studentId
      ) m ON m.studentId = x.studentId AND m.maxSem = x.semesterId
    ) fts_latest ON fts_latest.studentId = s.studentId
    LEFT JOIN studentstatus ss ON ss.studentStatusId = fts_latest.studentStatusId
    WHERE s.studentId = ?
    LIMIT 1;
  `;

  const [row] = await this.fact_regisRepo.query(sql, [studentId]);
  return row || null;
}

}
