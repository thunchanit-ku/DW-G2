// src/student/dto/create-student.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  Length,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @Length(1, 10)
  studentId: string;

  @IsOptional()
  @IsString()
  @Length(0, 11)
  studentUsername?: string;

  @IsOptional()
  @IsString()
  @Length(0, 13)
  personId?: string;

  @IsString()
  @Length(1, 50)
  firstNameTh: string;

  @IsString()
  @Length(1, 50)
  lastNameTh: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  firstNameEng?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  lastNameEng?: string;

  @IsOptional()
  @IsEnum(['ชาย', 'หญิง'])
  genderTh?: 'ชาย' | 'หญิง';

  @IsOptional()
  @IsEnum(['Male', 'Female'])
  genderEng?: 'Male' | 'Female';

  @IsOptional()
  @IsEnum(['นาย', 'นางสาว', 'นาง'])
  titleTh?: 'นาย' | 'นางสาว' | 'นาง';

  @IsOptional()
  @IsEnum(['Mr.', 'Mrs.', 'Miss'])
  titleEng?: 'Mr.' | 'Mrs.' | 'Miss';

  @IsOptional()
  @IsString()
  @Length(0, 10)
  tell?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  parentTell?: string;

  @IsEmail()
  @Length(5, 50)
  email: string;
}
