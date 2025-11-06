# คำแนะนำการ Deploy

## สิ่งที่แก้ไขแล้ว:
✅ แก้ไข docker-compose.yml ให้ใช้ port 13363 (frontend) และ 23363 (backend)
✅ แก้ไข config.ts ให้รองรับ environment variable
✅ เปลี่ยนหน้า principal ให้เป็น 6520503363
✅ ลบไฟล์/โฟลเดอร์ที่ไม่ใช้แล้ว

## สิ่งที่ลบไปแล้ว:

### 1. โฟลเดอร์ที่ลบแล้ว:
- ✅ `app/6520501000/` - หน้าเก่า
- ✅ `app/dashboard/home/` - ไม่ใช้
- ✅ `app/dashboard/info/` - ไม่ใช้
- ✅ `app/dashboard/formGPA/` - ไม่ใช้
- ✅ `app/dashboard/report/` - ไม่ใช้
- ✅ `app/dashboard/update-grades/` - ไม่ใช้
- ✅ `app/api/` - API routes ที่ไม่ใช้

### 2. Service files ที่ลบแล้ว:
- ✅ `app/dashboard/service/home.service.ts`
- ✅ `app/dashboard/service/student.service.ts`
- ✅ `app/dashboard/service/update-grades.service.ts`
- ✅ `app/dashboard/service/report.service.ts`

### 3. Components ที่ลบแล้ว:
- ✅ `components/charts/CategoryChart.tsx`
- ✅ `components/charts/CategoryTeachingHeatmap.tsx`
- ✅ `components/charts/DonutChart.tsx`
- ✅ `components/charts/GpaBoxPlot.tsx`
- ✅ `components/charts/SemesterChart.tsx`
- ✅ `components/DashboardNavCards.tsx`
- ✅ `components/ExampleCard.tsx`
- ✅ `components/LottieAnimation.tsx`

### 4. Backend files ที่ลบแล้ว:
- ✅ `backend/src/controller/fd.controller.ts`
- ✅ `backend/src/controller/test.controller.ts`
- ✅ `backend/src/service/fd.service.ts`
- ✅ `backend/src/service/test.service.ts`
- ✅ `backend/src/module/fd.module.ts`
- ✅ `backend/src/module/test.module.ts`
- ✅ `backend/src/dto/test.dto.ts`
- ✅ `backend/src/app.controller.ts`
- ✅ `backend/src/app.controller.spec.ts`
- ✅ `backend/src/app.service.ts`

### 5. ไฟล์อื่นๆ ที่ลบแล้ว:
- ✅ `lib/api.ts` - ไม่ใช้
- ✅ `lib/db.ts` - ไม่ใช้
- ✅ SQL backup files
- ✅ JSON mock files

**ไฟล์ที่เก็บไว้:**
- `app/6520503363/` - หน้าที่ใช้
- `app/dashboard/service/config.ts`, `lookup.service.ts`, `wf-report.service.ts`
- `components/DashboardLayout.tsx`, `components/charts/WFBoxPlot.tsx`, `components/charts/WFYearCategoryHeatmap.tsx`
- `lib/theme.ts` - ใช้ใน layout

## ขั้นตอนการ Deploy:

1. **ลบไฟล์ที่ไม่ใช้** (ตามด้านบน)

2. **Zip folder งาน:**
   ```bash
   zip -r DW-G2-deploy.zip . -x "node_modules/*" ".git/*" "*.log" ".next/*" "backend/dist/*" "backend/node_modules/*"
   ```

3. **Upload ไปยัง server:**
   ```bash
   scp DW-G2-deploy.zip g2@158.108.207.232:~
   ```

4. **Remote เข้า server:**
   ```bash
   ssh g2@158.108.207.232
   ```

5. **Unzip และ deploy:**
   ```bash
   unzip -o DW-G2-deploy.zip
   cd DW-G2
   docker-compose up --build -d
   ```

6. **ตรวจสอบ logs:**
   ```bash
   docker-compose logs -f
   ```

## Port ที่ใช้:
- Frontend: http://158.108.207.232:13363
- Backend API: http://158.108.207.232:23363/api

## ตรวจสอบการทำงาน:
- Frontend: เปิดเบราว์เซอร์ไปที่ http://158.108.207.232:13363
- Backend: ทดสอบ API ที่ http://158.108.207.232:23363/api/report/departments

