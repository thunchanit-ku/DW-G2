# 🚀 Quick Start Guide

## การเริ่มต้นใช้งานโปรเจค DW-G2

### 1. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่: **http://localhost:3000**

### 2. คำสั่งที่สำคัญ

```bash
# Development
npm run dev          # รัน dev server (port 3000)

# Production
npm run build        # Build โปรเจค
npm run start        # รัน production server

# Code Quality
npm run lint         # ตรวจสอบ ESLint
```

### 3. สิ่งที่ต้องทำต่อ

#### ✅ ตั้งค่า Database
```bash
# 1. สร้าง MySQL database
mysql -u root -p
CREATE DATABASE your_db_name;

# 2. แก้ไข .env.local
DATABASE_URL="mysql://user:password@localhost:3306/your_db_name"

# 3. (Optional) ติดตั้ง Prisma
npm install prisma @prisma/client
npx prisma init
```

#### ✅ ปรับแต่งสี Theme
```ts
// lib/theme.ts
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#YOUR_COLOR', // เปลี่ยนสีหลัก
  },
};
```

ดูตัวอย่างชุดสีได้ที่ `COLOR_PALETTES.md`

#### ✅ สร้างหน้าใหม่

```bash
# สร้าง folder ใหม่
mkdir app/about

# สร้างไฟล์ page.tsx
touch app/about/page.tsx
```

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">เกี่ยวกับเรา</h1>
    </div>
  );
}
```

เข้าดูที่: http://localhost:3000/about

#### ✅ สร้าง API Endpoint ใหม่

```bash
mkdir -p app/api/users
touch app/api/users/route.ts
```

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ];
  
  return NextResponse.json({ users });
}
```

ทดสอบที่: http://localhost:3000/api/users

### 4. โครงสร้างโปรเจค

```
app/           → หน้าเว็บและ API routes
components/    → React components
lib/           → Helper functions และ config
types/         → TypeScript types
public/        → ไฟล์ static (รูปภาพ, ฟอนต์)
```

### 5. การใช้งาน Components

#### Ant Design Button
```tsx
import { Button } from 'antd';

<Button type="primary">คลิก</Button>
<Button type="default">ยกเลิก</Button>
```

#### Lucide Icons (แนะนำ)
```tsx
import { Home, User, Settings } from 'lucide-react';

<Home className="w-6 h-6" />
<User className="w-6 h-6 text-blue-500" />
```

#### Lottie Animation
```tsx
import Lottie from 'lottie-react';
import animationData from './animation.json';

<Lottie animationData={animationData} loop />
```

### 6. Styling

#### Tailwind CSS
```tsx
<div className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg">
  Content
</div>
```

#### Ant Design Components
```tsx
import { Card, Space } from 'antd';

<Card title="หัวข้อ">
  <Space direction="vertical">
    <p>เนื้อหา</p>
  </Space>
</Card>
```

### 7. TypeScript

สร้าง type ใหม่ใน `types/index.ts`:
```ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}
```

ใช้งาน:
```tsx
import { Product } from '@/types';

const product: Product = {
  id: '1',
  name: 'สินค้า',
  price: 100,
};
```

### 8. เอกสารเพิ่มเติม

- 📖 **README.md** - คู่มือหลัก
- 📖 **PROJECT_STRUCTURE.md** - โครงสร้างโปรเจคละเอียด
- 📖 **DATABASE_SCHEMA.md** - ตัวอย่าง Database Schema
- 📖 **COLOR_PALETTES.md** - แนะนำชุดสี

### 9. Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Ant Design](https://ant.design)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)

### 10. ปัญหาที่พบบ่อย

**Q: Port 3000 ถูกใช้งานแล้ว**
```bash
# เปลี่ยน port
npm run dev -- -p 3001
```

**Q: ติดตั้ง package ใหม่**
```bash
npm install package-name
```

**Q: ล้าง cache**
```bash
rm -rf .next
npm run dev
```

---

## 🎉 พร้อมแล้ว! เริ่มพัฒนาได้เลย

หากมีคำถาม ดูเอกสารเพิ่มเติมใน `README.md` หรือโครงสร้างโปรเจคใน `PROJECT_STRUCTURE.md`

