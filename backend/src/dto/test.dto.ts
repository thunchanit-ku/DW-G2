// src/student/dto/create-student.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  studentId: number;

  @IsString()
  @Length(1, 10)
  studentUsername: string;

  @IsOptional()
  @IsEnum(['b', 'g'])
  stdLevel?: 'b' | 'g';

  @IsOptional()
  @IsString()
  @Length(0, 13)
  personId?: string;

  @IsString()
  @Length(1, 50)
  nameTh: string;

  @IsString()
  @Length(1, 50)
  nameEng: string;

  @IsOptional()
  @IsEnum(['ชาย', 'หญิง'])
  genderTh?: 'ชาย' | 'หญิง';

  @IsOptional()
  @IsEnum(['Male', 'Female'])
  genderEng?: 'Male' | 'Female';

  @IsEnum(['นาย', 'นางสาว', 'นาง'])
  titleTh: 'นาย' | 'นางสาว' | 'นาง';

  @IsEnum(['Mr.', 'Mrs.', 'Miss'])
  titleEng: 'Mr.' | 'Mrs.' | 'Miss';

  @IsString()
  @Length(1, 10)
  tell: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  parentPhone?: string;

  @IsEmail()
  @Length(5, 50)
  email: string;
}
