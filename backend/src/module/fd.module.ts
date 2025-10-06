import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FdController } from '../controller/fd.controller';
import { FdService } from '../service/fd.service';
import { Student } from '../entity/test.entity';
import { FactRegis } from '../entity/fact-regis.entity';
import { Semester } from '../entity/semester.entity';
import { CourseList } from '../entity/courselist.entity';
import { TypeRegis } from '../entity/typeregis.entity';
import { FactTermSummary } from '../entity/fact-term-summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, FactRegis, Semester, CourseList, TypeRegis, FactTermSummary])],
  controllers: [FdController],
  providers: [FdService],
  exports: [FdService],
})
export class FdModule {}
