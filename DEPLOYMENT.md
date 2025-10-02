# 🚀 Deployment Guide

คู่มือการ Deploy โปรเจค DW-G2

---

## 📦 โครงสร้างโปรเจค

```
DW-G2/
├── app/              # Next.js Frontend + API Routes
├── backend/          # NestJS Backend (Optional)
├── components/       # React Components
├── lib/             # Utilities
└── public/          # Static files
```

---

## 🌐 Deployment Options

### 1. Deploy Next.js (Frontend + API Routes)

#### Option A: Vercel (แนะนำ)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**หรือ Deploy ผ่าน Vercel Dashboard:**
1. ไปที่ https://vercel.com
2. Import Git repository
3. Deploy อัตโนมัติ

**Environment Variables:**
```
DATABASE_URL=your_production_db_url
NEXT_PUBLIC_API_URL=https://your-api.com
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

#### Option C: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t dw-g2-frontend .

# Run container
docker run -p 3000:3000 dw-g2-frontend
```

---

### 2. Deploy NestJS Backend

#### Option A: Railway

1. ไปที่ https://railway.app
2. New Project → Deploy from GitHub
3. เลือก `backend` folder
4. ตั้งค่า Environment Variables
5. Deploy

#### Option B: Render

1. ไปที่ https://render.com
2. New Web Service
3. Connect repository
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm run start:prod`

#### Option C: DigitalOcean App Platform

1. สร้าง App ใหม่
2. เชื่อม GitHub repository
3. ตั้งค่า:
   - Source Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm run start:prod`

#### Option D: Docker

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
```

```bash
cd backend
docker build -t dw-g2-backend .
docker run -p 4000:4000 dw-g2-backend
```

---

### 3. Deploy Database (MySQL)

#### Option A: PlanetScale (แนะนำ)

1. https://planetscale.com
2. สร้าง Database ใหม่
3. Copy connection string
4. อัพเดท `.env`

#### Option B: Railway

1. Railway.app → New → MySQL
2. Copy connection string

#### Option C: DigitalOcean Managed Database

1. สร้าง MySQL Database
2. ตั้งค่า Firewall
3. Copy connection string

#### Option D: AWS RDS

1. สร้าง RDS MySQL instance
2. ตั้งค่า Security Group
3. Copy endpoint

---

## 🔧 Production Configuration

### Next.js

```js
// next.config.ts
const nextConfig = {
  output: 'standalone', // สำหรับ Docker
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

### NestJS

```ts
// backend/src/main.ts
const port = process.env.PORT || 4000;
app.enableCors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-domain.com',
  ],
});
```

---

## 🔐 Environment Variables

### Frontend (.env.production)
```bash
DATABASE_URL="mysql://user:pass@host:3306/db"
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

### Backend (backend/.env.production)
```bash
PORT=4000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=database
JWT_SECRET=your-super-secret-key
```

---

## 🐳 Docker Compose (Full Stack)

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=password
      - DB_NAME=dw_g2
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=dw_g2
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
# Run all services
docker-compose up -d

# Stop all services
docker-compose down
```

---

## ✅ Pre-deployment Checklist

- [ ] ทดสอบ build locally: `npm run build`
- [ ] ตรวจสอบ environment variables
- [ ] ตั้งค่า CORS ให้ถูกต้อง
- [ ] อัพเดท Database connection strings
- [ ] ตรวจสอบ API endpoints
- [ ] ทดสอบ production build
- [ ] เพิ่ม error handling
- [ ] ตั้งค่า monitoring/logging
- [ ] Backup database

---

## 📊 Monitoring & Logging

### Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs @sentry/node
```

---

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      # Add deployment steps
```

---

## 📚 Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Docker Documentation](https://docs.docker.com)
- [Vercel Documentation](https://vercel.com/docs)

