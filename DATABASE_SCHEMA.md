# Database Schema Design

ใช้ [drawDB](https://drawdb.vercel.app) ในการออกแบบ Schema

## ตัวอย่าง Schema สำหรับระบบพื้นฐาน

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### Example: Products Table
```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_category (category_id)
);
```

### Example: Categories Table
```sql
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
);
```

### Example: Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);
```

### Example: Order Items Table
```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);
```

## การใช้งาน Prisma (แนะนำ)

### 1. ติดตั้ง Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. แก้ไข schema.prisma
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]

  @@index([email])
}

enum Role {
  ADMIN
  USER
}

model Product {
  id          String      @id @default(uuid())
  name        String
  description String?     @db.Text
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  categoryId  String?
  category    Category?   @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([categoryId])
}

model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([slug])
}

model Order {
  id          String      @id @default(uuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  totalAmount Decimal     @db.Decimal(10, 2)
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now())

  @@index([orderId])
  @@index([productId])
}
```

### 3. สร้าง Migration และ Generate Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. ใช้งาน Prisma Client
```ts
import { prisma } from '@/lib/db';

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: 'hashed_password',
    name: 'John Doe',
  },
});

// Read
const users = await prisma.user.findMany();

// Update
const updatedUser = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: '123' },
});
```

## Tips สำหรับการออกแบบ Database

1. ใช้ UUID แทน Auto-increment ID เพื่อความปลอดภัย
2. เพิ่ม Index ในคอลัมน์ที่ใช้ค้นหาบ่อยๆ
3. ใช้ ENUM สำหรับค่าที่มีตัวเลือกจำกัด
4. เพิ่ม created_at และ updated_at ในทุก table
5. ตั้งค่า Foreign Key Constraints อย่างเหมาะสม
6. ใช้ Soft Delete แทน Hard Delete ในบางกรณี

