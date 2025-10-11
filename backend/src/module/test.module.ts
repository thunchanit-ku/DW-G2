import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entity/student.entity';
import { StudentService } from '../service/test.service';
import { StudentController } from '../controller/test.controller';
import { FactRegis } from 'src/entity/fact-register.entity';
import { Semester } from 'src/entity/semester.entity';
import { TypeRegis } from 'src/entity/typeregis.entity';
import { CourseList } from 'src/entity/courselist.entity';


@Module ({
   imports: [TypeOrmModule.forFeature([Student , FactRegis , Semester , TypeRegis , CourseList])],
  controllers: [StudentController],
  providers: [StudentService],
   exports: [StudentService],
})

export class TestModule{}




