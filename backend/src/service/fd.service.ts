// src/student/student.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/student.entity';
import { CreateStudentDto } from '../dto/test.dto';
import * as fs from 'fs/promises'; 
import * as path from 'path';
import { FactRegis } from 'src/entity/fact-register.entity';
import { Semester } from 'src/entity/semester.entity';
import { CourseList } from 'src/entity/courselist.entity';
import { TypeRegis } from 'src/entity/typeregis.entity';
import { FactTermSummary } from 'src/entity/fact-term-summary.entity';

@Injectable()
export class FdService {
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
    @InjectRepository(FactTermSummary)
    private factTermSummaryRepo: Repository<FactTermSummary>,
  ) {}

  async create(data: CreateStudentDto) {
    const student = this.studentRepo.create(data);
    return await this.studentRepo.save(student);
  }

  async findAll() {
    return await this.studentRepo.find();
  }

  async findOne(id: string) {
    // ใช้ SQL query เพื่อดึงข้อมูลนิสิตจาก fact_register
    const sql = `
      SELECT DISTINCT
        fr.studentId,
        s.fisrtNameTh,
        s.lastNameTh,
        s.fisrtNameEng,
        s.lastNameEng,
        s.parentTell,
        s.email,
        s.titleTh
      FROM fact_register fr
      LEFT JOIN student s ON s.studentId = fr.studentId
      WHERE fr.studentId = ?
      LIMIT 1
    `;
    
    const [result] = await this.fact_regisRepo.query(sql, [id]);
    return result || null;
  }

  async update(id: string, data: Partial<CreateStudentDto>) {
    await this.studentRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.studentRepo.delete(id);
  }

//  async updatedata(semester: string, year: number) {
//   const filePath = path.resolve(__dirname, '../../../register_2students_2terms.json');
//   const file = await fs.readFile(filePath, 'utf-8');
//   const allRegis = JSON.parse(file);

//   // ✅ กรองตามเงื่อนไขที่ต้องการ
//   const filtered = allRegis.filter((item: any) => {
//     return (
//       item.semesterPartInRegis === semester &&
//       item.semesterYearInRegis === year
//     );
//   });

//   // ✅ DEBUG: ตรวจสอบว่า semesterId มีอยู่
//   filtered.forEach((item: any, index: number) => {
//     if (item.semesterId === undefined) {
//       console.error(`❌ Record at index ${index} missing semesterId`, item);
//     }
//   });

//   const toSave: FactRegis[] = [];

//   for (const item of filtered) {
//     const semesterEntity = await this.semesterRepo.findOne({ where: { semesterId: item.semesterId } });
//     const courseListEntity = await this.courseListRepo.findOne({ where: { courseListId: item.courseListId } });
//     const typeRegisEntity = await this.typeRegisRepo.findOne({ where: { typeRegisId: item.typeRegisId } });

//     if (!semesterEntity || !courseListEntity || !typeRegisEntity) {
//       console.warn(`❗ ข้อมูลไม่ครบสำหรับ studentId=${item.studentId}, ข้าม`);
//       continue;
//     }

//     const newRegis = this.fact_regisRepo.create({
//       studentId: item.studentId,
//       subjectCodeInRegis: item.subjectCodeInRegis,
//       secLecture: item.secLecture,
//       secLab: item.secLab,
//       gradeCharacter: item.gradeCharacter,
//       gradeNumber: item.gradeNumber,
//       creditRegis: item.creditRegis,
//       studyYearInRegis: item.studyYearInRegis,
//       studyTermInRegis: item.studyTermInRegis,
//       semesterYearInRegis: item.semesterYearInRegis,
//       semesterPartInRegis: item.semesterPartInRegis,

//       // ✅ ความสัมพันธ์ Foreign Key
//       semester: semesterEntity,
//       courseList: courseListEntity,
//       typeRegis: typeRegisEntity,
//     });

//     toSave.push(newRegis);
//   }

//   await this.fact_regisRepo.save(toSave);

//   console.log(`✅ บันทึกข้อมูลสำเร็จ ${toSave.length} รายการ`);
//   return toSave;
// }

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
                FROM fact_register f2
                WHERE f2.studentId = fr.studentId
                  AND f2.gradeCharacter != 'P'
                  AND (
                      f2.semesterYearInRegis < fr.semesterYearInRegis OR
                      (f2.semesterYearInRegis = fr.semesterYearInRegis 
                       AND f2.semesterPartInRegis <= fr.semesterPartInRegis)
                  )
            ) AS GPAสะสม
        FROM fact_register fr
        WHERE fr.studentId = ?
          AND fr.gradeCharacter != 'P'
        GROUP BY fr.studentId, fr.semesterYearInRegis, fr.semesterPartInRegis
        ORDER BY fr.semesterYearInRegis, fr.semesterPartInRegis
    ) AS t
    JOIN (SELECT @prev_gpa := NULL) AS vars;
  `;

  try{
  const result = await this.fact_regisRepo.query(sql, [studentId]);
  console.log(result);
  return result;

  }
  catch(err){
    console.group(err);
  }
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

-- สถานภาพนักศึกษา และ GPA สะสมคำนวณจาก fact_register
      ss.status AS studentStatus,
      (
        SELECT ROUND(SUM(fr.creditRegis * fr.gradeNumber) / SUM(fr.creditRegis), 2)
        FROM fact_register fr
        WHERE fr.studentId = s.studentId
      ) AS gpa,

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
      SELECT x.studentId, x.studentStatusId
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

// ดึงข้อมูล semester และ year ที่นิสิตเรียนจบแล้ว
async getCompletedSemesters(studentId: string) {
  const sql = `
    SELECT DISTINCT 
        fr.semesterYearInRegis AS year,
        fr.semesterPartInRegis AS semester,
        fr.semesterId,
        COUNT(fr.regisId) AS totalCourses,
        SUM(fr.creditRegis) AS totalCredits,
        ROUND(SUM(fr.creditRegis * fr.gradeNumber) / SUM(fr.creditRegis), 2) AS semesterGPA,
        CASE 
          WHEN COUNT(fr.regisId) > 0 THEN 1 
          ELSE 0 
        END AS isCompleted
    FROM fact_register fr
    WHERE fr.studentId = ? 
      AND fr.gradeNumber IS NOT NULL
      AND fr.gradeCharacter != 'P'
    GROUP BY fr.semesterYearInRegis, fr.semesterPartInRegis, fr.semesterId
    ORDER BY fr.semesterYearInRegis DESC, 
             CASE fr.semesterPartInRegis 
               WHEN 'ภาคต้น' THEN 1
               WHEN 'ภาคปลาย' THEN 2
               WHEN 'ภาคฤดูร้อน' THEN 3
             END DESC
  `;

  const result = await this.fact_regisRepo.query(sql, [studentId]);
  return result;
}

// ดึงรายวิชาและเกรดของนิสิตตามปีและภาคการศึกษา
async getStudentCoursesBySemester(studentId: string, year: number, semester: string) {
  try {
    console.log('getStudentCoursesBySemester called with:', { studentId, year, semester });
    
    const sql = `
      SELECT 
          fr.regisId,
          fr.studentId,
          fr.subjectCodeInRegis AS subjectCode,
          cl.subjectNameTh AS subjectNameTh,
          cl.subjectNameEng AS subjectNameEng,
          cl.credit AS credit,
          fr.gradeCharacter AS gradeCharacter,
          fr.gradeNumber AS gradeNumber,
          fr.creditRegis AS creditRegis,
          fr.semesterYearInRegis AS semesterYear,
          fr.semesterPartInRegis AS semesterPart,
          tr.type AS typeRegis,
          CASE 
            WHEN fr.gradeNumber IS NOT NULL AND fr.gradeCharacter != 'P' THEN 'has_grade'
            ELSE 'no_grade'
          END AS gradeStatus
      FROM fact_register fr
      LEFT JOIN courselist cl ON fr.courseListId = cl.courseListId
      LEFT JOIN typeregis tr ON fr.typeRegisId = tr.typeRegisId
      WHERE fr.studentId = ? 
        AND fr.semesterYearInRegis = ?
        AND fr.semesterPartInRegis = ?
        AND fr.gradeCharacter != 'P'
      ORDER BY fr.subjectCodeInRegis
    `;

    const result = await this.fact_regisRepo.query(sql, [studentId, year, semester]);
    console.log('Student courses result:', result);
    return result || [];
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return [];
  }
}

// อัปเดตเกรดของนิสิต
async updateStudentGrade(regisId: number, gradeCharacter: string, gradeNumber: number) {
  try {
    console.log('updateStudentGrade called with:', { regisId, gradeCharacter, gradeNumber });
    
    // อัปเดตเกรดใน fact_register
    const sql = `
      UPDATE fact_register 
      SET gradeCharacter = ?, gradeNumber = ?
      WHERE regisId = ?
    `;

    const result = await this.fact_regisRepo.query(sql, [gradeCharacter, gradeNumber, regisId]);
    console.log('Update grade result:', result);

    // ดึงข้อมูลการลงทะเบียนที่อัปเดต
    const updatedRegis = await this.fact_regisRepo.findOne({
      where: { regisId },
    });

    if (!updatedRegis) {
      throw new Error('ไม่พบข้อมูลการลงทะเบียน');
    }

    // คำนวณและอัปเดต GPA ใหม่
    await this.recalculateAndUpdateGPA(updatedRegis.studentId, updatedRegis.semesterYearInRegis, updatedRegis.semesterPartInRegis);

    return { 
      success: true, 
      affectedRows: result.affectedRows,
      message: 'อัปเดตเกรดและคำนวณ GPA ใหม่สำเร็จ'
    };
  } catch (error) {
    console.error('Error updating student grade:', error);
    throw error;
  }
}

// คำนวณและอัปเดต GPA ใหม่
async recalculateAndUpdateGPA(studentId: string, year: number, semester: string) {
  try {
    // คำนวณ GPA ภาคใหม่
    const semesterGPA = await this.calculateSemesterGPA(studentId, year, semester);
    
    // คำนวณ GPA สะสมใหม่
    const cumulativeGPA = await this.calculateCumulativeGPA(studentId, year, semester);
    
    // คำนวณหน่วยกิตรวม
    const totalCredits = await this.calculateTotalCredits(studentId, year, semester);
    
    // คำนวณหน่วยกิตรวมทั้งหมด
    const totalCreditsAll = await this.calculateTotalCreditsAll(studentId, year, semester);

    // อัปเดต fact_term_summary
    await this.updateFactTermSummary(studentId, year, semester, {
      semesterGPA,
      cumulativeGPA,
      totalCredits,
      totalCreditsAll,
    });

    console.log(`✅ อัปเดต GPA สำหรับ ${studentId} ภาค ${semester} ${year}: GPA ภาค=${semesterGPA}, GPA สะสม=${cumulativeGPA}`);
    
    return {
      semesterGPA,
      cumulativeGPA,
      totalCredits,
      totalCreditsAll,
    };
  } catch (error) {
    console.error('Error recalculating GPA:', error);
    throw new Error('ไม่สามารถคำนวณ GPA ใหม่ได้');
  }
}

// คำนวณ GPA ภาค
async calculateSemesterGPA(studentId: string, year: number, semester: string) {
  const sql = `
    SELECT 
      SUM(creditRegis) as totalCredits,
      SUM(creditRegis * gradeNumber) as weightedGPA
    FROM fact_register 
    WHERE studentId = ? 
      AND semesterYearInRegis = ? 
      AND semesterPartInRegis = ?
      AND gradeCharacter != 'P'
      AND gradeNumber IS NOT NULL
  `;
  
  const [result] = await this.fact_regisRepo.query(sql, [studentId, year, semester]);
  
  if (!result || result.totalCredits === 0) {
    return 0;
  }
  
  return Number((result.weightedGPA / result.totalCredits).toFixed(2));
}

// คำนวณ GPA สะสม
async calculateCumulativeGPA(studentId: string, year: number, semester: string) {
  const sql = `
    SELECT 
      SUM(creditRegis) as totalCredits,
      SUM(creditRegis * gradeNumber) as weightedGPA
    FROM fact_register 
    WHERE studentId = ? 
      AND gradeCharacter != 'P'
      AND gradeNumber IS NOT NULL
      AND (
        semesterYearInRegis < ? OR
        (semesterYearInRegis = ? AND semesterPartInRegis <= ?)
      )
  `;
  
  const [result] = await this.fact_regisRepo.query(sql, [studentId, year, year, semester]);
  
  if (!result || result.totalCredits === 0) {
    return 0;
  }
  
  return Number((result.weightedGPA / result.totalCredits).toFixed(2));
}

// คำนวณหน่วยกิตรวมของภาค
async calculateTotalCredits(studentId: string, year: number, semester: string) {
  const sql = `
    SELECT SUM(creditRegis) as totalCredits
    FROM fact_register 
    WHERE studentId = ? 
      AND semesterYearInRegis = ? 
      AND semesterPartInRegis = ?
      AND gradeCharacter != 'P'
      AND gradeNumber IS NOT NULL
  `;
  
  const [result] = await this.fact_regisRepo.query(sql, [studentId, year, semester]);
  return result?.totalCredits || 0;
}

// คำนวณหน่วยกิตรวมทั้งหมด
async calculateTotalCreditsAll(studentId: string, year: number, semester: string) {
  const sql = `
    SELECT SUM(creditRegis) as totalCredits
    FROM fact_register 
    WHERE studentId = ? 
      AND gradeCharacter != 'P'
      AND gradeNumber IS NOT NULL
      AND (
        semesterYearInRegis < ? OR
        (semesterYearInRegis = ? AND semesterPartInRegis <= ?)
      )
  `;
  
  const [result] = await this.fact_regisRepo.query(sql, [studentId, year, year, semester]);
  return result?.totalCredits || 0;
}

// อัปเดต fact_term_summary
async updateFactTermSummary(studentId: string, year: number, semester: string, gpaData: any) {
  const updateData = {
    gpaTerm: gpaData.semesterGPA,
    gpaAll: gpaData.cumulativeGPA,
    creditTerm: gpaData.totalCredits,
    creditAll: gpaData.totalCreditsAll,
  };

  await this.factTermSummaryRepo.update(
    {
      studentId,
      semesterYearInTerm: year,
      semesterPartInTerm: semester,
    },
    updateData
  );
}

}
