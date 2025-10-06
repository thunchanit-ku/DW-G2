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

 @Post('data')
  async getDataFromBody(
    @Body() body: { semester: string; year: number }
  ) {
    const { semester, year } = body;
    return this.studentService.updatedata(semester, year);
  }

  //kong
}
