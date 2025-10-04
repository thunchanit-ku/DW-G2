import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entity/test.entity';
import { StudentService } from '../service/test.service';
import { StudentController } from '../controller/test.controller';

@Module ({
   imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentController],
  providers: [StudentService],
})

export class TestModule{}




