// src/student/student.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/student.entity';
import { CreateStudentDto } from '../dto/test.dto';
import * as fs from 'fs/promises'; 
import * as path from 'path';
import { FactRegister } from 'src/entity/fact-register.entity';
import { Semester } from 'src/entity/semester.entity';
import { CourseList } from 'src/entity/courselist.entity';
import { TypeRegis } from 'src/entity/typeregis.entity';
import { FactStudent } from 'src/entity/fact-student.entity';
import { Teacher } from 'src/entity/teacher.entity';
import { Department } from 'src/entity/department.entity';
import { Program } from 'src/entity/program.entity';
import { School } from 'src/entity/school.entity';
import { Province } from 'src/entity/province.entity';
import { StudentStatus } from 'src/entity/student-status.entity';
import { FactTermSummary } from 'src/entity/fact-term-summary.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(FactRegister)
    private fact_regisRepo: Repository<FactRegister>,
    @InjectRepository(Semester)
    private semesterRepo: Repository<Semester>,
    @InjectRepository(CourseList)
    private courseListRepo: Repository<CourseList>,
    @InjectRepository(TypeRegis)
    private typeRegisRepo: Repository<TypeRegis>,
    @InjectRepository(FactStudent)
    private factStudentRepo: Repository<FactStudent>,
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    @InjectRepository(Program)
    private programRepo: Repository<Program>,
    @InjectRepository(School)
    private schoolRepo: Repository<School>,
    @InjectRepository(Province)
    private provinceRepo: Repository<Province>,
    @InjectRepository(StudentStatus)
    private studentStatusRepo: Repository<StudentStatus>,
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
    return await this.studentRepo.findOne({ where: { studentId: parseInt(id) } });
  }

  async update(id: string, data: Partial<CreateStudentDto>) {
    await this.studentRepo.update(parseInt(id), data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.studentRepo.delete(parseInt(id));
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
      t.student_id,
      t.ปีการศึกษา,
      t.ภาคการศึกษา,
      t.หน่วยกิตรวม,
      t.GPAภาค,
      
      -- คำนวณ GPA สะสม (Running Total)
      -- กำหนดค่าสะสมแต้มเกรด (@running_gpa_points) และหน่วยกิต (@running_credits) พร้อมกับการคำนวณ
      ROUND((@running_gpa_points := @running_gpa_points + t.GPA_POINTS) / 
            (@running_credits := @running_credits + t.หน่วยกิตรวม), 2) AS GPAสะสม,

      -- คำนวณ ผลต่างเกรด และอัปเดต GPA ก่อนหน้า
      ROUND(t.GPAภาค - @prev_gpa, 2) AS ผลต่างเกรด,
      @prev_gpa := t.GPAภาค AS GPAก่อนหน้า
    FROM (
      -- Inner Query: กรองข้อมูล, หา GPA ภาค และแต้มเกรดรวมของภาค
      SELECT
        fr.student_id,
        fr.semester_year_in_regis AS ปีการศึกษา,
        CASE fr.semester_part_in_regis
          WHEN '0' THEN 'ภาคต้น'
          WHEN '1' THEN 'ภาคปลาย'
          WHEN '2' THEN 'ฤดูร้อน'
        END AS ภาคการศึกษา,
        SUM(fr.credit_regis) AS หน่วยกิตรวม,
        -- ต้องคำนวณ GPA_POINTS (แต้มเกรดรวม) เพื่อใช้ในการหา GPA สะสม
        SUM(fr.credit_regis * fr.grade_number) AS GPA_POINTS, 
        ROUND(SUM(fr.credit_regis * fr.grade_number) / NULLIF(SUM(fr.credit_regis), 0), 2) AS GPAภาค
      FROM fact_register fr
      -- JOIN student เพื่อใช้ student_username ในการกรอง
      JOIN student s ON fr.student_id = s.student_id
      -- กรองด้วย student_username ซึ่งคาดว่าเป็นค่าที่ส่งมาจากพารามิเตอร์ studentId
      WHERE s.student_username = ? 
        AND fr.grade_number IS NOT NULL
      GROUP BY fr.student_id, fr.semester_year_in_regis, fr.semester_part_in_regis
      -- ORDER BY สำคัญมากเพื่อให้ Running Total ถูกต้องตามลำดับเวลา
      ORDER BY fr.semester_year_in_regis, fr.semester_part_in_regis
    ) AS t
    -- กำหนดค่าเริ่มต้นตัวแปรทั้งหมดในคำสั่งเดียว
    JOIN (
      SELECT 
        @prev_gpa := NULL, 
        @running_credits := 0, 
        @running_gpa_points := 0
    ) AS vars;
  `;
  
  const result = await this.fact_regisRepo.query(sql, [studentId]);
  return result;
}


async getStudentProfile(studentId: string) {
  const sql = `
  SELECT
  s.student_username AS studentId,
  s.name_th AS nameTh,
  s.name_eng AS nameEn,
  s.person_id AS nationalId,
  s.gender_th AS gender,
  s.tell AS phone,
  s.email AS email,
  s.parent_phone AS parentPhone,

  -- มิติการศึกษา
  CONCAT_WS(' ', t.teacher_name_th) AS advisor,
  'กำแพงแสน' AS campus,
  'วิศวกรรมศาสตร์' AS faculty,
  d.dept_name AS major,
  p.lang_program AS programType,
  p.name_program AS programName,

  -- สถานภาพล่าสุด และ GPA สะสม
  ss.status AS studentStatus,
  (
    SELECT ROUND(
             SUM(fr.credit_regis * fr.grade_number) / NULLIF(SUM(fr.credit_regis), 0), 2
           )
    FROM fact_register fr
    WHERE fr.student_id = s.student_id
      AND fr.grade_number IS NOT NULL
  ) AS gpa,

  -- ข้อมูลโรงเรียนเดิม
  sch.school_name AS highSchool,
  prov.province_name AS highSchoolLocation
FROM fact_student fs
JOIN student s          ON s.student_id     = fs.student_id
LEFT JOIN teacher t     ON t.teacher_id     = fs.teacher_id
LEFT JOIN department d  ON d.dept_id        = fs.department_id
LEFT JOIN program p     ON p.program_id     = fs.program_id
LEFT JOIN school sch    ON sch.school_id   = fs.school_id
LEFT JOIN province prov ON prov.province_id = sch.province_id
LEFT JOIN student_status ss ON ss.student_status_id = fs.student_status_id
WHERE s.student_username = ?
LIMIT 1;

  `;

  const [row] = await this.fact_regisRepo.query(sql, [studentId]);
  return row ?? null;
}


  // ✅ อ่านไฟล์ mock_api_term_summary.json (อยู่นอก src)
  async getCourseplanChecking() {
  try {
    // 1️⃣ path ไปที่ root project
    const filePath = path.resolve(__dirname, '../../../mock_api_term_summary.json');
    

    // 2️⃣ ตรวจสอบว่ามีไฟล์อยู่ไหม
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 3️⃣ อ่านไฟล์ JSON
    const fileData = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);

    // 4️⃣ ดึง subjectCourseId ทั้งหมดจาก JSON
    const subjectCourseIds = jsonData
      .map((item: any) => item.subjectCourseId)
      .filter((id: any) => id !== undefined);

    if (subjectCourseIds.length === 0) {
      throw new Error('ไม่พบ subjectCourseId ในไฟล์ JSON');
    }



    // 5️⃣ เขียน SQL JOIN query (ใช้ query เดิมของคุณ)
    const sql = `
      SELECT 
    s.nameSubjectThai , scg.subjectCategoryName , s.credit , s.subjectCategoryId , sc.subjectCourseId , s.subjectCode
    FROM subjectCourse as sc
    JOIN subject s ON sc.subjectId = s.subjectId
	  JOIN subjectCategory scg ON scg.subjectCategoryId = s.subjectCategoryId
      WHERE sc.subjectCourseId IN (?)
    `;

    // 6️⃣ รัน query ผ่าน Repository ที่เกี่ยวข้อง เช่น courseListRepo
    const dbResult = await this.courseListRepo.query(sql, [subjectCourseIds]);
    // 7️⃣ รวมข้อมูล JSON เดิมกับข้อมูลจากฐานข้อมูล
   const mergedData = jsonData.map((item: any) => {
      const match = dbResult.find(
        (r: any) => r.subjectCourseId === item.subjectCourseId
      );
      return {
        stdPlanId: item.stdPlanId,
        studentId: item.studentId,
        courseCode: item.subjectCourseId,
        courseName: match.nameSubjectThai || '-',
        credits: match.credit || '-',
        category: match.subjectCategoryName || '-',
        semester: item.semester,
        semesterPartInYear: item.semesterPartInYear,
        status: item.note || item.grade || '-',
        isPass: item.isPass,
        subjectCode: match.subjectCode || '-'
      };
    });


    // ✅ แยกข้อมูลตามสถานะ (ผ่าน / ไม่ผ่าน)
    const passedCourses = mergedData.filter((i) => i.isPass);
    const failedCourses = mergedData.filter((i) => !i.isPass);

    // ✅ ส่งผลลัพธ์กลับ
    return {
      message: 'Course plan and subject data merged successfully',
      totalJson: jsonData.length,
      totalMatched: dbResult.length,
      passedCourses,
      failedCourses,
    };
  
    } catch (error) {
    console.error('❌ Error in getCourseplanChecking:', error.message);
    throw new Error('Cannot process course plan data: ' + error.message);
  }
}
}