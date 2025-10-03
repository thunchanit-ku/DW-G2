# ⚙️ แก้ไขไฟล์ .env

## 📝 ขั้นตอน:

### 1. เปิดไฟล์ `backend/.env` 

คลิกเปิดไฟล์: `backend/.env`

### 2. แก้ไขเป็นดังนี้:

```bash
PORT=4000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=158.108.207.232
DB_PORT=3306
DB_USERNAME=dw_student
DB_PASSWORD=dw_student
DB_NAME=DW-student-g2

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 3. Save ไฟล์

กด `Cmd + S` (Mac) หรือ `Ctrl + S` (Windows)

### 4. Restart Backend

หยุด server เดิม (กด Ctrl+C ใน Terminal)

แล้วรันใหม่:
```bash
cd backend
npm run start:dev
```

---

## ✅ เสร็จแล้ว!

Backend จะเชื่อมต่อกับ MySQL Database แล้ว

ทดสอบได้ที่:
- http://localhost:4000/api/users
- http://localhost:4000/api/products

