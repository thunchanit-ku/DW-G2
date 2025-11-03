import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from '../controller/report.controller';
import { ReportService } from '../service/report.service';
import { FactRegister } from '../entity/fact-register.entity';
import { SubjectCourse } from '../entity/subject-course.entity';
import { Subject } from '../entity/subject.entity';
import { SubjectType } from '../entity/subject-type.entity';
import { FactStudent } from '../entity/fact-student.entity';
import { Department } from '../entity/department.entity';
import { Program } from '../entity/program.entity';
import { GradeLabel } from '../entity/grade-label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FactRegister,
      SubjectCourse,
      Subject,
      SubjectType,
      FactStudent,
      Department,
      Program,
      GradeLabel,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}


