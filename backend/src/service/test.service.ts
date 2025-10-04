// src/student/student.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/test.entity';
import { CreateStudentDto } from '../dto/test.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async create(data: CreateStudentDto) {
    const student = this.studentRepo.create(data);
    return await this.studentRepo.save(student);
  }

  async findAll() {
    return await this.studentRepo.find();
  }

  async findOne(id: string) {
    return await this.studentRepo.findOne({ where: { studentId: id } });
  }

  async update(id: string, data: Partial<CreateStudentDto>) {
    await this.studentRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.studentRepo.delete(id);
  }
}
