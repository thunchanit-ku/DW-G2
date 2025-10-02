# DW-G2 Project

โปรเจค Next.js พร้อมระบบที่ครบครันสำหรับการพัฒนา Full-Stack Application

## 🚀 เทคโนโลยีที่ใช้

### Front-end
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Component Library:** Ant Design
- **Icons:** Lucide React (แนะนำ) + Ant Design Icons
- **Loading Animations:** Ant Design Spin + LottieFiles
- **Styling:** Tailwind CSS
- **Font:** Kanit (Google Fonts)
- **TypeScript:** Full type safety

### Back-end
- **Framework:** Next.js API Routes (สำหรับโปรเจคเล็ก-กลาง)
- **NestJS:** สำหรับโปรเจคขนาดใหญ่ (ติดตั้งแยก)

### Database
- **Database:** MySQL
- **Design Tool:** drawDB (สำหรับออกแบบ Schema)

### Design Resources
- **Color Palettes:** [Coolors.co](https://coolors.co)

## 📦 การติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd DW-G2
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. ตั้งค่า environment variables:
```bash
# คัดลอก .env.local และแก้ไขค่าตามต้องการ
cp .env.local .env.local
```

4. รัน development server:
```bash
npm run dev
```

5. เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจค

```
DW-G2/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   └── example/        # ตัวอย่าง API endpoint
│   ├── layout.tsx          # Root layout with Ant Design & Kanit font
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/              # React Components
│   ├── ExampleCard.tsx     # ตัวอย่าง component
│   └── LottieAnimation.tsx # Lottie animation component
├── lib/                     # Utility functions
│   ├── api.ts              # API helper functions
│   ├── db.ts               # Database connection
│   └── theme.ts            # Ant Design theme configuration
├── types/                   # TypeScript type definitions
│   └── index.ts            # Common types
├── public/                  # Static files
├── .env.local              # Environment variables (ไม่ commit)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎨 การใช้งาน Components

### Ant Design Components
```tsx
import { Button, Card, Modal } from 'antd';

export default function Example() {
  return (
    <Card title="Example">
      <Button type="primary">Click me</Button>
    </Card>
  );
}
```

### Lucide Icons (แนะนำ)
```tsx
import { Home, User, Settings } from 'lucide-react';

export default function IconExample() {
  return (
    <div>
      <Home className="w-6 h-6" />
      <User className="w-6 h-6" />
      <Settings className="w-6 h-6" />
    </div>
  );
}
```

### Lottie Animations
```tsx
import Lottie from 'lottie-react';
import animationData from './animation.json';

export default function LottieExample() {
  return <Lottie animationData={animationData} loop />;
}
```

## 🎨 ฟอนต์ Kanit

ฟอนต์ Kanit ถูกตั้งค่าไว้แล้วใน `layout.tsx` และสามารถใช้งานได้ทันทีผ่าน Tailwind:

```tsx
<h1 className="font-kanit">ข้อความภาษาไทย</h1>
```

## 🗄️ การตั้งค่า Database

### 1. ติดตั้ง MySQL
```bash
# macOS
brew install mysql

# Ubuntu/Debian
sudo apt-get install mysql-server
```

### 2. สร้าง Database
```sql
CREATE DATABASE your_database_name;
```

### 3. ตั้งค่า connection ใน `.env.local`
```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
```

### 4. ติดตั้ง MySQL client (แนะนำ Prisma)
```bash
npm install prisma @prisma/client
npx prisma init
```

## 🎨 Color Scheme

ใช้ [Coolors.co](https://coolors.co) ในการเลือกชุดสีที่เข้ากัน แล้วนำมาตั้งค่าใน `lib/theme.ts`:

```ts
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff', // เปลี่ยนเป็นสีหลักของคุณ
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
  },
};
```

## 📝 Scripts

```bash
# Development
npm run dev          # รัน development server

# Production
npm run build        # Build สำหรับ production
npm run start        # รัน production server

# Linting
npm run lint         # ตรวจสอบ code quality
```

## 🔧 การตั้งค่า NestJS (สำหรับโปรเจคขนาดใหญ่)

หากต้องการใช้ NestJS เป็น Backend แยกต่างหาก:

```bash
# สร้างโปรเจค NestJS ใหม่
npx @nestjs/cli new backend

# ติดตั้ง dependencies ที่จำเป็น
cd backend
npm install @nestjs/typeorm typeorm mysql2
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Ant Design Components](https://ant.design/components/overview)
- [Lucide Icons](https://lucide.dev/icons)
- [LottieFiles](https://lottiefiles.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [drawDB](https://drawdb.vercel.app) - ออกแบบ Database Schema

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
