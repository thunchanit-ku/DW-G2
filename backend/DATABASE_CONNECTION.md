# 🗄️ Database Connection Guide

## ✅ ข้อมูลการเชื่อมต่อ

```
Host: 158.108.207.232
Port: 3306
User: dw_student
Password: dw_student
Database: DW-student-g2
```

## 📝 ขั้นตอนการตั้งค่า

### 1. แก้ไขไฟล์ `.env`

เปิดไฟล์ `backend/.env` และแก้ไขเป็น:

```bash
PORT=4000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=158.108.207.232
DB_PORT=3306
DB_USERNAME=dw_student
DB_PASSWORD=dw_student
DB_NAME=DW-student-g2

# JWT Secret
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 2. Install Dependencies (✅ ติดตั้งแล้ว)

```bash
npm install @nestjs/typeorm typeorm mysql2 @nestjs/config
```

### 3. Import DatabaseModule

แก้ไข `backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,  // เพิ่มบรรทัดนี้
    UsersModule, 
    ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 🔍 ทดสอบการเชื่อมต่อ

```bash
# รันไฟล์ทดสอบ
cd backend
node test-db-connection.js
```

## 📊 PHPMyAdmin

**URL:** http://158.108.207.232/phpmyadmin  
**Username:** dw_student  
**Password:** dw_student  

## 🏗️ สร้าง Entity (TypeORM)

### ตัวอย่าง User Entity

สร้างไฟล์ `backend/src/users/user.entity.ts`:

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### ตัวอย่าง Product Entity

สร้างไฟล์ `backend/src/products/product.entity.ts`:

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @Column('text')
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 🔄 แก้ไข Service ให้ใช้ Database

### Users Service (ตัวอย่าง)

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }
}
```

## 📌 สำคัญ!

1. ⚠️ **อย่า commit ไฟล์ `.env`** (ถูก gitignore แล้ว)
2. 🔒 Database นี้ใช้ร่วมกับทีมอื่น ระวังการลบข้อมูล
3. 📝 ใช้ `synchronize: false` ใน production
4. 🔐 เปลี่ยน JWT_SECRET ในการใช้งานจริง

## 🆘 Troubleshooting

### ไม่สามารถเชื่อมต่อได้

1. ตรวจสอบว่า VPN เปิดอยู่หรือไม่ (ถ้าจำเป็น)
2. ตรวจสอบ firewall
3. Ping test: `ping 158.108.207.232`
4. รันไฟล์ทดสอบ: `node test-db-connection.js`

### Database ไม่มี tables

ใช้ PHPMyAdmin สร้าง tables หรือ import ไฟล์ SQL

