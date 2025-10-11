import {
  Controller,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Query,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FdService } from '../service/fd.service';

@Controller('fd')
export class FdController {
  constructor(private readonly fdService: FdService) {}

  // GET /fd/student/:username - ดึงข้อมูลนิสิตจาก student_username
  @Get('student/:username')
  async getStudentByUsername(@Param('username') username: string, @Res() res: Response) {
    try {
      const student = await this.fdService.getStudentByUsername(username);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      
      // ตั้งค่า header สำหรับ UTF-8
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.json(student);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // GET /fd/completed-semesters/:username - ดึงข้อมูลภาคการศึกษาที่นิสิตเรียนจบแล้ว
  @Get('completed-semesters/:username')
  async getCompletedSemesters(@Param('username') username: string, @Res() res: Response) {
    try {
      // ดึงข้อมูลนิสิตจาก username ก่อน
      const student = await this.fdService.getStudentByUsername(username);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const result = await this.fdService.getCompletedSemesters(student.studentId);
      if (!result || result.length === 0) {
        throw new HttpException('No completed semesters found for this student', HttpStatus.NOT_FOUND);
      }
      
      // ตั้งค่า header สำหรับ UTF-8
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // GET /fd/courses/:username - ดึงรายวิชาและเกรดของนิสิตตามปีและภาคการศึกษา
  @Get('courses/:username')
  async getStudentCoursesBySemester(
    @Param('username') username: string,
    @Query('year') year: string,
    @Query('semester') semester: string,
    @Res() res: Response,
  ) {
    try {
      console.log('Controller called with:', { username, year, semester });

      if (!year || !semester) {
        throw new HttpException('Year and semester parameters are required', HttpStatus.BAD_REQUEST);
      }

      // ดึงข้อมูลนิสิตจาก username ก่อน
      const student = await this.fdService.getStudentByUsername(username);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const yearNum = parseInt(year);
      if (isNaN(yearNum)) {
        throw new HttpException('Invalid year', HttpStatus.BAD_REQUEST);
      }

      // แปลงภาคการศึกษาเป็น enum value
      let semesterPart: string;
      switch (semester) {
        case 'ภาคต้น':
        case '0':
          semesterPart = '0';
          break;
        case 'ภาคปลาย':
        case '1':
          semesterPart = '1';
          break;
        case 'ฤดูร้อน':
        case '2':
          semesterPart = '2';
          break;
        default:
          throw new HttpException('Invalid semester. Must be ภาคต้น/0, ภาคปลาย/1, or ฤดูร้อน/2', HttpStatus.BAD_REQUEST);
      }

      const result = await this.fdService.getStudentCoursesBySemester(student.studentId, yearNum, semesterPart);
      console.log('Controller result:', result);
      
      // ตั้งค่า header สำหรับ UTF-8
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // PATCH /fd/grade/:regisId - อัปเดตเกรดของนิสิต
  @Patch('grade/:regisId')
  async updateStudentGrade(
    @Param('regisId') regisId: string,
    @Body() body: { gradeCharacter: string; gradeNumber: number },
    @Res() res: Response,
  ) {
    try {
      const { gradeCharacter, gradeNumber } = body;

      if (!gradeCharacter || gradeNumber === undefined) {
        throw new HttpException('Grade character and grade number are required', HttpStatus.BAD_REQUEST);
      }

      const regisIdNum = parseInt(regisId);
      if (isNaN(regisIdNum)) {
        throw new HttpException('Invalid registration ID', HttpStatus.BAD_REQUEST);
      }

      // ตรวจสอบเกรดที่ถูกต้อง
      const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
      if (!validGrades.includes(gradeCharacter)) {
        throw new HttpException('Invalid grade character', HttpStatus.BAD_REQUEST);
      }

      if (gradeNumber < 0 || gradeNumber > 4) {
        throw new HttpException('Grade number must be between 0 and 4', HttpStatus.BAD_REQUEST);
      }

      const result = await this.fdService.updateStudentGrade(regisIdNum, gradeCharacter, gradeNumber);
      
      // ตั้งค่า header สำหรับ UTF-8
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}