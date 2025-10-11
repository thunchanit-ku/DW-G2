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
import { FdService } from '../service/fd.service';
import { CreateStudentDto } from '../dto/test.dto';

@Controller('fd')
export class FdController {
  constructor(private readonly fdService: FdService) {}

  // POST /fd
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      return await this.fdService.create(createStudentDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // GET /fd
  @Get()
  async findAll() {
    return this.fdService.findAll();
  }

  // GET /fd/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const student = await this.fdService.findOne(id);
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return student;
  }

  // PATCH /fd/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateStudentDto>) {
    return this.fdService.update(id, updateData);
  }

  // DELETE /fd/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.fdService.remove(id);
  }

  // @Post('data')
  // async getDataFromBody(
  //   @Body() body: { semester: string; year: number }
  // ) {
  //   const { semester, year } = body;
  //   return this.fdService.updatedata(semester, year);
  // }

  // ใช้คำนวณ GPA ภาค / GPA สะสม / ผลต่างเกรด
  @Get('grade-progress/:id')
  async getGradeProgress(@Param('id') id: string) {
    const result = await this.fdService.calculateGradeProgress(id);
    if (!result || result.length === 0) {
      throw new HttpException('No GPA data found for this student', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  // โปรไฟล์นักศึกษา (ตรงตามหน้าจอข้อมูลส่วนตัว)
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    const data = await this.fdService.getStudentProfile(id);
    if (!data) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  // ดึงข้อมูล semester ที่นิสิตเรียนจบแล้ว
  @Get('completed-semesters/:id')
  async getCompletedSemesters(@Param('id') id: string) {
    const result = await this.fdService.getCompletedSemesters(id);
    if (!result || result.length === 0) {
      throw new HttpException('No completed semesters found for this student', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  // ดึงรายวิชาและเกรดของนิสิตตามปีและภาคการศึกษา
  @Get('courses/:id')
  async getStudentCoursesBySemester(
    @Param('id') id: string,
    @Query('year') year: string,
    @Query('semester') semester: string
  ) {
    console.log('Controller called with:', { id, year, semester });

    if (!year || !semester) {
      throw new HttpException('Year and semester parameters are required', HttpStatus.BAD_REQUEST);
    }

    const result = await this.fdService.getStudentCoursesBySemester(id, parseInt(year), semester);
    console.log('Controller result:', result);
    return result;
  }

  // อัปเดตเกรดของนิสิต
  @Patch('grade/:regisId')
  async updateStudentGrade(
    @Param('regisId') regisId: string,
    @Body() body: { gradeCharacter: string; gradeNumber: number }
  ) {
    const { gradeCharacter, gradeNumber } = body;

    if (!gradeCharacter || gradeNumber === undefined) {
      throw new HttpException('Grade character and grade number are required', HttpStatus.BAD_REQUEST);
    }

    const result = await this.fdService.updateStudentGrade(parseInt(regisId), gradeCharacter, gradeNumber);
    return result;
  }
}
