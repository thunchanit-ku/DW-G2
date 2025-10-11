// src/student/student.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {StudentService}from '../service/test.service'
import { CreateStudentDto } from '../dto/test.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService , private readonly studenasdftService: StudentService  ) {}

  // POST /student
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      return await this.studentService.create(createStudentDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // GET /student
  @Get()
  async findAll() {
    return this.studentService.findAll();
  }
 @Get('Courseplan-checking')
  async getCourseplanCheck() {
    try {
      return await this.studentService.getCourseplanChecking();
    } catch (error) {
      throw new HttpException(
        'Failed to load course plan data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // GET /student/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const student = await this.studentService.findOne(id);
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return student;
  }

  // PATCH /student/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateStudentDto>) {
    return this.studentService.update(id, updateData);
  }

  // DELETE /student/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

//  @Post('data')
//   async getDataFromBody(
//     @Body() body: { semester: string; year: number }
//   ) {
//     const { semester, year } = body;
//     return this.studentService.updatedata(semester, year);
//   }
  // ใช้คำนวณ GPA ภาค / GPA สะสม / ผลต่างเกรด
  @Get('grade-progress/:id')
  async getGradeProgress(@Param('id') id: string) {
    const result = await this.studentService.calculateGradeProgress(id);
    if (!result || result.length === 0) {
      throw new HttpException('No GPA data found for this student', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  // โปรไฟล์นักศึกษา (ตรงตามหน้าจอข้อมูลส่วนตัว)
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    const data = await this.studentService.getStudentProfile(id);
    if (!data) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

}
  



