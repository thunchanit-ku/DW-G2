# 🚀 Backend API Documentation

โปรเจคนี้มี Backend 2 ส่วน:
1. **Next.js API Routes** - สำหรับ API เบื้องต้น (port 3000)
2. **NestJS Backend** - สำหรับโปรเจคขนาดใหญ่ (port 4000)

---

## 📍 Next.js API Routes (Port 3000)

### Base URL: `http://localhost:8002/api`

### 1. Example API
```bash
GET  /api/example?query=test
POST /api/example
```

### 2. Users API
```bash
# Get all users
GET  /api/users?page=1&limit=10

# Create user
POST /api/users
Body: {
  "name": "ชื่อ",
  "email": "email@example.com",
  "password": "password",
  "role": "user"
}
```

### 3. Products API
```bash
# Get all products
GET  /api/products?category=electronics&search=laptop

# Create product
POST /api/products
Body: {
  "name": "ชื่อสินค้า",
  "price": 100,
  "category": "electronics",
  "stock": 10,
  "description": "รายละเอียด"
}
```

### 4. Auth API
```bash
# Login
POST /api/auth
Body: {
  "email": "admin@example.com",
  "password": "password"
}

# Demo credentials:
# Email: admin@example.com
# Password: password
```

---

## 🏗️ NestJS Backend (Port 4000)

### Base URL: `http://localhost:3002/api`

### การรัน NestJS

```bash
# Development
cd backend
npm run start:dev

# Production
npm run build
npm run start:prod
```

### API Endpoints

#### 1. Users Module

```bash
# Get all users (with pagination)
GET  http://localhost:3002/api/users?page=1&limit=10

# Get user by ID
GET  http://localhost:3002/api/users/:id

# Create user
POST http://localhost:3002/api/users
Body: {
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "role": "user"
}

# Update user
PUT  http://localhost:3002/api/users/:id
Body: {
  "name": "ชื่อใหม่"
}

# Delete user
DELETE http://localhost:3002/api/users/:id
```

#### 2. Products Module

```bash
# Get all products (with filters)
GET  http://localhost:3002/api/products?category=electronics&search=laptop

# Get product by ID
GET  http://localhost:3002/api/products/:id

# Create product
POST http://localhost:3002/api/products
Body: {
  "name": "แล็ปท็อป",
  "price": 45900,
  "category": "electronics",
  "stock": 15,
  "description": "รายละเอียดสินค้า"
}

# Update product
PUT  http://localhost:3002/api/products/:id
Body: {
  "price": 42900
}

# Delete product
DELETE http://localhost:3002/api/products/:id
```

---

## 🔧 การใช้งานใน Next.js Frontend

### 1. เรียก Next.js API (Same Server)

```tsx
// app/page.tsx
const response = await fetch('/api/users');
const data = await response.json();
```

### 2. เรียก NestJS API (Different Server)

```tsx
// lib/api.ts
const API_URL = 'http://localhost:3002/api';

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
}

export async function createUser(userData: any) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
}
```

### 3. ตัวอย่างการใช้งาน

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from 'antd';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // เรียก NestJS API
    fetch('http://localhost:3002/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.data));
  }, []);

  const createUser = async () => {
    const response = await fetch('http://localhost:3002/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User ใหม่',
        email: 'newuser@example.com',
        role: 'user',
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Users</h1>
      <Button onClick={createUser}>Create User</Button>
      {/* แสดงรายการ users */}
    </div>
  );
}
```

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🔐 CORS Configuration

NestJS Backend อนุญาต CORS จาก:
- `http://localhost:3000` (Next.js dev)
- `http://localhost:3001` (Next.js alternative port)

แก้ไขได้ที่: `backend/src/main.ts`

---

## 🗄️ Database Integration

### เพิ่ม Prisma (แนะนำ)

```bash
cd backend
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Edit prisma/schema.prisma
# Then run:
npx prisma migrate dev
npx prisma generate
```

### เพิ่ม TypeORM

```bash
cd backend
npm install @nestjs/typeorm typeorm mysql2

# ดูตัวอย่างการตั้งค่าใน NestJS docs
```

---

## 🧪 ทดสอบ API

### ใช้ cURL

```bash
# Get users
curl http://localhost:3002/api/users

# Create user
curl -X POST http://localhost:3002/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### ใช้ Postman / Insomnia

Import collection หรือสร้าง requests ตาม endpoints ข้างบน

---

## 📚 เพิ่ม Modules ใหม่

```bash
cd backend

# Generate module, controller, service พร้อมกัน
npx @nestjs/cli generate resource orders

# หรือแยก
npx @nestjs/cli generate module orders
npx @nestjs/cli generate controller orders
npx @nestjs/cli generate service orders
```

---

## 🎯 Best Practices

1. **Validation**: ใช้ `class-validator` และ `class-transformer`
2. **DTOs**: สร้าง Data Transfer Objects สำหรับ type safety
3. **Guards**: ใช้สำหรับ authentication/authorization
4. **Interceptors**: สำหรับ logging, transform response
5. **Exception Filters**: จัดการ errors แบบ global

---

## 📖 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Docs](https://www.prisma.io/docs)

