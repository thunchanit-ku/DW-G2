import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entity/student.entity';
import { StudentService } from '../service/test.service';
import { StudentController } from '../controller/test.controller';
import { FactRegister } from 'src/entity/fact-register.entity';
import { Semester } from 'src/entity/semester.entity';
import { TypeRegis } from 'src/entity/typeregis.entity';
import { CourseList } from 'src/entity/courselist.entity';
import { FactStudent } from 'src/entity/fact-student.entity';
import { Teacher } from 'src/entity/teacher.entity';
import { Department } from 'src/entity/department.entity';
import { Program } from 'src/entity/program.entity';
import { School } from 'src/entity/school.entity';
import { Province } from 'src/entity/province.entity';
import { StudentStatus } from 'src/entity/student-status.entity';
import { FactTermSummary } from 'src/entity/fact-term-summary.entity';

@Module ({
   imports: [TypeOrmModule.forFeature([
     Student, 
     FactRegister, 
     Semester, 
     TypeRegis, 
     CourseList,
     FactStudent,
     Teacher,
     Department,
     Program,
     School,
     Province,
     StudentStatus,
     FactTermSummary
   ])],
  controllers: [StudentController],
  providers: [StudentService],
   exports: [StudentService],
})

export class TestModule{}




