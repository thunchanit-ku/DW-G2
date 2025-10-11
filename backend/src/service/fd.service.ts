import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/student.entity';
import { FactRegister } from '../entity/fact-register.entity';
import { Subject } from '../entity/subject.entity';
import { SubjectType } from '../entity/subject-type.entity';
import { FactTermSummary } from '../entity/fact-term-summary.entity';
import { GradeLabel } from '../entity/grade-label.entity';

export interface CompletedSemester {
  year: number;
  semester: string;
  semesterPartInRegis: string;
  totalCourses: number;
  totalCredits: number;
  semesterGPA: number;
  isCompleted: number;
}

export interface StudentCourse {
  regisId: number;
  studentId: number;
  subjectCode: string;
  subjectNameThai: string;
  subjectNameEng: string;
  credit: number;
  gradeCharacter: string;
  gradeNumber: number;
  creditRegis: number;
  semesterYear: number;
  semesterPart: string;
  typeRegis: string;
  secLecture: number;
  secLab: number;
  gradeStatus: string;
}

export interface UpdateGradeResult {
  success: boolean;
  affectedRows: number;
  message: string;
  updatedCourse?: StudentCourse;
}

@Injectable()
export class FdService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(FactRegister)
    private factRegisterRepo: Repository<FactRegister>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
    @InjectRepository(FactTermSummary)
    private factTermSummaryRepo: Repository<FactTermSummary>,
    @InjectRepository(GradeLabel)
    private gradeLabelRepo: Repository<GradeLabel>,
  ) {}

  // ดึงข้อมูลนิสิตจาก student_username
  async getStudentByUsername(studentUsername: string): Promise<Student | null> {
    return await this.studentRepo.findOne({
      where: { studentUsername },
    });
  }

  // ดึงข้อมูลภาคการศึกษาที่นิสิตเรียนจบแล้ว
  async getCompletedSemesters(studentId: number): Promise<CompletedSemester[]> {
    const sql = `
      SELECT DISTINCT 
        fr.semester_year_in_regis AS year,
        CASE fr.semester_part_in_regis
          WHEN '0' THEN 'ภาคต้น'
          WHEN '1' THEN 'ภาคปลาย'
          WHEN '2' THEN 'ฤดูร้อน'
        END AS semester,
        fr.semester_part_in_regis,
        COUNT(fr.regis_id) AS totalCourses,
        SUM(fr.credit_regis) AS totalCredits,
        ROUND(SUM(fr.credit_regis * fr.grade_number) / SUM(fr.credit_regis), 2) AS semesterGPA,
        CASE 
          WHEN COUNT(fr.regis_id) > 0 THEN 1 
          ELSE 0 
        END AS isCompleted
      FROM fact_register fr
      WHERE fr.student_id = ? 
        AND fr.grade_number IS NOT NULL
        AND fr.grade_character != 'P'
      GROUP BY fr.semester_year_in_regis, fr.semester_part_in_regis
      ORDER BY fr.semester_year_in_regis DESC, 
               CASE fr.semester_part_in_regis 
                 WHEN '0' THEN 1
                 WHEN '1' THEN 2
                 WHEN '2' THEN 3
               END DESC
    `;

    const result = await this.factRegisterRepo.query(sql, [studentId]);
    return result;
  }

  // ดึงรายวิชาและเกรดของนิสิตตามปีและภาคการศึกษา
  async getStudentCoursesBySemester(
    studentId: number,
    year: number,
    semesterPart: string,
  ): Promise<StudentCourse[]> {
    try {
      console.log('getStudentCoursesBySemester called with:', { studentId, year, semesterPart });

      // ใช้ SQL query เพื่อดึงข้อมูล sec_lecture และ sec_lab โดยตรงจาก fact_register
      const sql = `
        SELECT
          fr.regis_id AS regisId,
          fr.student_id AS studentId,
          fr.subject_code_in_regis AS subjectCode,
          s.name_subject_thai AS subjectNameThai,
          s.name_subject_eng AS subjectNameEng,
          st.name_subject_type AS subjectType,
          fr.credit_regis AS credit,
          fr.grade_character AS gradeCharacter,
          fr.grade_number AS gradeNumber,
          fr.credit_regis AS creditRegis,
          fr.semester_year_in_regis AS semesterYear,
          CASE fr.semester_part_in_regis
            WHEN '0' THEN 'ภาคต้น'
            WHEN '1' THEN 'ภาคปลาย'
            WHEN '2' THEN 'ฤดูร้อน'
          END AS semesterPart,
          fr.type_regis AS typeRegis,
          COALESCE(fr.sec_lecture, 0) AS secLecture,
          COALESCE(fr.sec_lab, 0) AS secLab,
          CASE
            WHEN fr.grade_number IS NOT NULL AND fr.grade_character != 'P' THEN 'has_grade'
            ELSE 'no_grade'
          END AS gradeStatus
        FROM fact_register fr
        LEFT JOIN subject_course sc ON fr.subject_course_id = sc.subject_course_id
        LEFT JOIN subject s ON sc.subject_id = s.subject_id
        LEFT JOIN subject_type st ON s.subject_type_id = st.subject_type_id
        WHERE fr.student_id = ?
          AND fr.semester_year_in_regis = ?
          AND fr.semester_part_in_regis = ?
        ORDER BY fr.subject_code_in_regis
      `;

      console.log('SQL Query:', sql);
      console.log('Parameters:', [studentId, year, semesterPart]);
      const result = await this.factRegisterRepo.query(sql, [studentId, year, semesterPart]);
      console.log('Student courses result:', result);
      
      // Debug: ตรวจสอบข้อมูล sec_lecture และ sec_lab
      if (result && result.length > 0) {
        console.log('First record sec_lecture:', result[0].secLecture);
        console.log('First record sec_lab:', result[0].secLab);
        console.log('First record full data:', JSON.stringify(result[0], null, 2));
      }
      return result || [];
    } catch (error) {
      console.error('Error fetching student courses:', error);
      return [];
    }
  }

  // อัปเดตเกรดของนิสิต
  async updateStudentGrade(
    regisId: number,
    gradeCharacter: string,
    gradeNumber: number,
  ): Promise<UpdateGradeResult> {
    try {
      console.log('updateStudentGrade called with:', { regisId, gradeCharacter, gradeNumber });
      
      // อัปเดตเกรดใน fact_register
      const sql = `
        UPDATE fact_register 
        SET grade_character = ?, grade_number = ?
        WHERE regis_id = ?
      `;

      const result = await this.factRegisterRepo.query(sql, [gradeCharacter, gradeNumber, regisId]);
      console.log('Update grade result:', result);

      // ดึงข้อมูลการลงทะเบียนที่อัปเดต
      const updatedRegis = await this.factRegisterRepo.findOne({
        where: { regisId },
      });

      if (!updatedRegis) {
        throw new Error('ไม่พบข้อมูลการลงทะเบียน');
      }

      // คำนวณและอัปเดต GPA ใหม่
      await this.recalculateAndUpdateGPA(
        updatedRegis.studentId!,
        updatedRegis.semesterYearInRegis!,
        updatedRegis.semesterPartInRegis!,
      );

      // ดึงข้อมูลรายวิชาที่อัปเดตแล้ว
      const updatedCourse = await this.getUpdatedCourseData(regisId);

      return { 
        success: true, 
        affectedRows: result.affectedRows,
        message: 'อัปเดตเกรดและคำนวณ GPA ใหม่สำเร็จ',
        updatedCourse: updatedCourse || undefined
      };
    } catch (error) {
      console.error('Error updating student grade:', error);
      throw error;
    }
  }

  // ดึงข้อมูลรายวิชาหลังจากอัปเดตเกรด
  async getUpdatedCourseData(regisId: number): Promise<StudentCourse | null> {
    try {
      const sql = `
        SELECT
          fr.regis_id AS regisId,
          fr.student_id AS studentId,
          fr.subject_code_in_regis AS subjectCode,
          s.name_subject_thai AS subjectNameThai,
          s.name_subject_eng AS subjectNameEng,
          st.name_subject_type AS subjectType,
          fr.credit_regis AS credit,
          fr.grade_character AS gradeCharacter,
          fr.grade_number AS gradeNumber,
          fr.credit_regis AS creditRegis,
          fr.semester_year_in_regis AS semesterYear,
          CASE fr.semester_part_in_regis
            WHEN '0' THEN 'ภาคต้น'
            WHEN '1' THEN 'ภาคปลาย'
            WHEN '2' THEN 'ฤดูร้อน'
          END AS semesterPart,
          fr.type_regis AS typeRegis,
          COALESCE(fr.sec_lecture, 0) AS secLecture,
          COALESCE(fr.sec_lab, 0) AS secLab,
          CASE
            WHEN fr.grade_number IS NOT NULL AND fr.grade_character != 'P' THEN 'has_grade'
            ELSE 'no_grade'
          END AS gradeStatus
        FROM fact_register fr
        LEFT JOIN subject_course sc ON fr.subject_course_id = sc.subject_course_id
        LEFT JOIN subject s ON sc.subject_id = s.subject_id
        LEFT JOIN subject_type st ON s.subject_type_id = st.subject_type_id
        WHERE fr.regis_id = ?
      `;

      const [result] = await this.factRegisterRepo.query(sql, [regisId]);
      console.log('Updated course data:', result);
      return result || null;
    } catch (error) {
      console.error('Error fetching updated course data:', error);
      return null;
    }
  }

  // คำนวณและอัปเดต GPA ใหม่
  async recalculateAndUpdateGPA(
    studentId: number,
    year: number,
    semesterPart: string,
  ): Promise<void> {
    try {
      // คำนวณ GPA ภาคใหม่
      const semesterGPA = await this.calculateSemesterGPA(studentId, year, semesterPart);
      
      // คำนวณ GPA สะสมใหม่
      const cumulativeGPA = await this.calculateCumulativeGPA(studentId, year, semesterPart);
      
      // คำนวณหน่วยกิตรวม
      const totalCredits = await this.calculateTotalCredits(studentId, year, semesterPart);
      
      // คำนวณหน่วยกิตรวมทั้งหมด
      const totalCreditsAll = await this.calculateTotalCreditsAll(studentId, year, semesterPart);

      // อัปเดต fact_term_summary
      await this.updateFactTermSummary(studentId, year, semesterPart, {
        semesterGPA,
        cumulativeGPA,
        totalCredits,
        totalCreditsAll,
      });

      console.log(`✅ อัปเดต GPA สำหรับ ${studentId} ภาค ${semesterPart} ${year}: GPA ภาค=${semesterGPA}, GPA สะสม=${cumulativeGPA}`);
      
    } catch (error) {
      console.error('Error recalculating GPA:', error);
      throw new Error('ไม่สามารถคำนวณ GPA ใหม่ได้');
    }
  }

  // คำนวณ GPA ภาค
  async calculateSemesterGPA(studentId: number, year: number, semesterPart: string): Promise<number> {
    const sql = `
      SELECT 
        SUM(credit_regis) as totalCredits,
        SUM(credit_regis * grade_number) as weightedGPA
      FROM fact_register 
      WHERE student_id = ? 
        AND semester_year_in_regis = ? 
        AND semester_part_in_regis = ?
        AND grade_character != 'P'
        AND grade_number IS NOT NULL
    `;
    
    const [result] = await this.factRegisterRepo.query(sql, [studentId, year, semesterPart]);
    
    if (!result || result.totalCredits === 0) {
      return 0;
    }
    
    return Number((result.weightedGPA / result.totalCredits).toFixed(2));
  }

  // คำนวณ GPA สะสม
  async calculateCumulativeGPA(studentId: number, year: number, semesterPart: string): Promise<number> {
    const sql = `
      SELECT 
        SUM(credit_regis) as totalCredits,
        SUM(credit_regis * grade_number) as weightedGPA
      FROM fact_register 
      WHERE student_id = ? 
        AND grade_character != 'P'
        AND grade_number IS NOT NULL
        AND (
          semester_year_in_regis < ? OR
          (semester_year_in_regis = ? AND semester_part_in_regis <= ?)
        )
    `;
    
    const [result] = await this.factRegisterRepo.query(sql, [studentId, year, year, semesterPart]);
    
    if (!result || result.totalCredits === 0) {
      return 0;
    }
    
    return Number((result.weightedGPA / result.totalCredits).toFixed(2));
  }

  // คำนวณหน่วยกิตรวมของภาค
  async calculateTotalCredits(studentId: number, year: number, semesterPart: string): Promise<number> {
    const sql = `
      SELECT SUM(credit_regis) as totalCredits
      FROM fact_register 
      WHERE student_id = ? 
        AND semester_year_in_regis = ? 
        AND semester_part_in_regis = ?
        AND grade_character != 'P'
        AND grade_number IS NOT NULL
    `;
    
    const [result] = await this.factRegisterRepo.query(sql, [studentId, year, semesterPart]);
    return result?.totalCredits || 0;
  }

  // คำนวณหน่วยกิตรวมทั้งหมด
  async calculateTotalCreditsAll(studentId: number, year: number, semesterPart: string): Promise<number> {
    const sql = `
      SELECT SUM(credit_regis) as totalCredits
      FROM fact_register 
      WHERE student_id = ? 
        AND grade_character != 'P'
        AND grade_number IS NOT NULL
        AND (
          semester_year_in_regis < ? OR
          (semester_year_in_regis = ? AND semester_part_in_regis <= ?)
        )
    `;
    
    const [result] = await this.factRegisterRepo.query(sql, [studentId, year, year, semesterPart]);
    return result?.totalCredits || 0;
  }

  // อัปเดต fact_term_summary
  async updateFactTermSummary(
    studentId: number,
    year: number,
    semesterPart: string,
    gpaData: {
      semesterGPA: number;
      cumulativeGPA: number;
      totalCredits: number;
      totalCreditsAll: number;
    },
  ): Promise<void> {
    const updateData = {
      gpa: gpaData.semesterGPA,
      gpax: gpaData.cumulativeGPA,
      creditTerm: gpaData.totalCredits,
      creditAll: gpaData.totalCreditsAll,
    };

    await this.factTermSummaryRepo.update(
      {
        studentId,
        semesterYearInTerm: year,
        semesterPartInTerm: semesterPart,
      },
      updateData,
    );
  }
}