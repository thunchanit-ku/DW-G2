# 🚀 Quick Setup - เชื่อม Database

## ✅ สถานะ: เชื่อมต่อสำเร็จแล้ว!

### 📊 Database Info
- **Host:** 158.108.207.232
- **Port:** 3306
- **User:** dw_student
- **Password:** dw_student
- **Database:** DW-student-g2

### 📋 Tables ที่มีใน Database (32 tables)
```
✅ student, teacher, course, subject
✅ program, department, school, province
✅ semester, room, classtime
✅ fact_regis, fact_student, fact_term_summary
✅ และอีก 18 tables
```

## 🔧 สิ่งที่ทำไปแล้ว

1. ✅ ติดตั้ง TypeORM และ MySQL driver
   ```bash
   npm install @nestjs/typeorm typeorm mysql2 @nestjs/config
   ```

2. ✅ ทดสอบการเชื่อมต่อสำเร็จ
   ```bash
   node test-db-connection.js
   ```

3. ✅ เพิ่ม TypeORM config ใน `app.module.ts`

## 📝 สิ่งที่ต้องทำต่อ

### 1. แก้ไขไฟล์ `.env`

เปิดไฟล์ `backend/.env` และแก้เป็น:

```bash
PORT=4000
NODE_ENV=development

DB_HOST=158.108.207.232
DB_PORT=3306
DB_USERNAME=dw_student
DB_PASSWORD=dw_student
DB_NAME=DW-student-g2

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 2. Restart Backend

```bash
cd backend
npm run start:dev
```

## 🎯 เข้าถึง PHPMyAdmin

**URL:** http://158.108.207.232/phpmyadmin (ถ้ามี)  
หรือใช้ MySQL Client:

```bash
mysql -h 158.108.207.232 -u dw_student -p
# Password: dw_student
```

## 📦 ตัวอย่าง Entity (Student)

ไฟล์ `backend/src/students/student.entity.ts` สร้างแล้ว

ถ้าต้องการใช้งาน:

1. สร้าง Module:
   ```bash
   npx @nestjs/cli generate module students
   npx @nestjs/cli generate service students
   npx @nestjs/cli generate controller students
   ```

2. เพิ่มใน Module:
   ```typescript
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { Student } from './student.entity';
   
   @Module({
     imports: [TypeOrmModule.forFeature([Student])],
     ...
   })
   ```

3. ใช้ใน Service:
   ```typescript
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { Student } from './student.entity';
   
   constructor(
     @InjectRepository(Student)
     private studentRepo: Repository<Student>,
   ) {}
   
   async findAll() {
     return await this.studentRepo.find();
   }
   ```

## 🧪 ทดสอบ Query

สร้างไฟล์ `test-query.js`:

```javascript
const mysql = require('mysql2/promise');

async function test() {
  const conn = await mysql.createConnection({
    host: '158.108.207.232',
    port: 3306,
    user: 'dw_student',
    password: 'dw_student',
    database: 'DW-student-g2'
  });
  
  const [students] = await conn.query('SELECT * FROM student LIMIT 5');
  console.log('นักศึกษา 5 คนแรก:', students);
  
  await conn.end();
}

test();
```

## ⚠️ คำเตือน

1. **อย่า `synchronize: true`** ใน production - จะทำให้ตารางหาย!
2. **Database ใช้ร่วมกัน** - ระวังการแก้ไข/ลบข้อมูล
3. **ใช้ transactions** สำหรับการแก้ไขข้อมูลที่สำคัญ

## 📚 Resources

- [TypeORM Documentation](https://typeorm.io)
- [NestJS Database](https://docs.nestjs.com/techniques/database)
- ไฟล์: `backend/DATABASE_CONNECTION.md` สำหรับรายละเอียดเพิ่มเติม

