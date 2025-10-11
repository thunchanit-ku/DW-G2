import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FdController } from '../controller/fd.controller';
import { FdService } from '../service/fd.service';
import { Student } from '../entity/student.entity';
import { FactRegister } from '../entity/fact-register.entity';
import { Subject } from 'src/entity/subject.entity';
import { SubjectCourse } from 'src/entity/subject-course.entity';
import { SubjectType } from 'src/entity/subject-type.entity';
import { FactTermSummary } from 'src/entity/fact-term-summary.entity';
import { GradeLabel } from 'src/entity/grade-label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      FactRegister,
      Subject,
      SubjectCourse,
      SubjectType,
      FactTermSummary,
      GradeLabel,
    ]),
  ],
  controllers: [FdController],
  providers: [FdService],
  exports: [FdService],
})
export class FdModule {}