# 📝 Git Guide

## ไฟล์ที่ควร Commit

### ✅ ควร Commit (Track)
- `package.json` - Dependencies list
- `package-lock.json` - Lock file for exact versions
- Source code files (`.ts`, `.tsx`, `.js`)
- Configuration files (`next.config.ts`, `tailwind.config.ts`)
- Documentation (`.md` files)
- Public assets (`public/`)

### ❌ ไม่ควร Commit (Ignore)
- `node_modules/` - Dependencies (ติดตั้งใหม่ได้จาก package.json)
- `.next/` - Next.js build output
- `dist/`, `build/` - Build output
- `.env`, `.env.local` - Environment variables (sensitive data)
- `*.log` - Log files
- `.DS_Store` - macOS system files

---

## 🔧 .gitignore ที่ตั้งไว้

```gitignore
# Dependencies - สำคัญ!
node_modules/          # Root และทุก subfolder
**/node_modules/       # ทุก node_modules ในทุก directory

# Backend specific
backend/dist/          # NestJS build output
backend/node_modules/  # Backend dependencies
backend/.env*          # Backend env files

# Frontend specific
/.next/                # Next.js build
/out/                  # Next.js static export
*.tsbuildinfo          # TypeScript build info

# Environment
.env
.env*.local
.env.production

# Logs
*.log

# OS
.DS_Store
```

---

## 🚀 คำสั่ง Git พื้นฐาน

### เช็คสถานะ
```bash
git status              # ดูไฟล์ที่เปลี่ยนแปลง
git status --short      # แบบสั้น
git diff                # ดูการเปลี่ยนแปลงละเอียด
```

### เพิ่มไฟล์
```bash
git add .               # เพิ่มทุกไฟล์
git add app/            # เพิ่มเฉพาะ folder
git add package.json    # เพิ่มเฉพาะไฟล์
```

### Commit
```bash
git commit -m "Add feature X"
git commit -am "Update code"  # Add + Commit พร้อมกัน
```

### Push
```bash
git push                # Push ไปยัง remote
git push origin main    # Push ไป branch main
```

### Pull
```bash
git pull                # ดึงการเปลี่ยนแปลงล่าสุด
```

---

## 🔍 ถ้า node_modules โผล่ขึ้นมาอีก

### วิธีที่ 1: ลบออกจาก Git Cache
```bash
# ลบ node_modules ทั้งหมดจาก git
git rm -r --cached node_modules
git rm -r --cached backend/node_modules

# Commit การเปลี่ยนแปลง
git commit -m "Remove node_modules from git"
```

### วิธีที่ 2: ตรวจสอบ .gitignore
```bash
# ตรวจสอบว่า .gitignore ทำงานไหม
git check-ignore -v node_modules/
git check-ignore -v backend/node_modules/
```

### วิธีที่ 3: Re-apply .gitignore
```bash
# ลบทุกอย่างจาก cache แล้ว add ใหม่
git rm -r --cached .
git add .
git commit -m "Apply .gitignore properly"
```

---

## 📦 First Commit Checklist

เมื่อเริ่มต้นโปรเจคใหม่:

```bash
# 1. ตรวจสอบ .gitignore
cat .gitignore

# 2. เช็คว่า node_modules ถูก ignore
git status

# 3. Add ไฟล์ที่ต้องการ
git add .

# 4. ตรวจสอบอีกครั้งก่อน commit
git status

# 5. Commit
git commit -m "Initial commit: Next.js + NestJS project setup"

# 6. Push
git push origin main
```

---

## 🎯 Best Practices

1. **อย่า commit node_modules/**
   - ขนาดใหญ่มาก
   - สามารถติดตั้งใหม่ได้จาก `package.json`
   - ทำให้ repo ช้า

2. **อย่า commit .env files**
   - มี sensitive data (API keys, passwords)
   - แต่ละคนควรมี .env ของตัวเอง

3. **Commit message ที่ดี**
   ```bash
   # ✅ ดี
   git commit -m "Add user authentication API"
   git commit -m "Fix login validation bug"
   
   # ❌ ไม่ดี
   git commit -m "update"
   git commit -m "fix"
   ```

4. **Pull ก่อน Push**
   ```bash
   git pull          # ดึงการเปลี่ยนแปลงล่าสุด
   git push          # แล้วค่อย push
   ```

5. **ใช้ branches**
   ```bash
   git checkout -b feature/new-feature
   git checkout -b fix/bug-name
   ```

---

## 🆘 เคล็ดลับเพิ่มเติม

### ดูขนาดของ repository
```bash
du -sh .git
```

### ลบ node_modules ที่ commit ไปแล้ว (ใหม่ทั้งหมด)
```bash
git filter-branch --tree-filter 'rm -rf node_modules' HEAD
```

### ดู ignored files
```bash
git status --ignored
```

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [.gitignore Templates](https://github.com/github/gitignore)

