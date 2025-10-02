# Color Palettes

แนะนำชุดสีสำหรับใช้ในโปรเจค (จาก [Coolors.co](https://coolors.co))

## 🎨 Modern Blue Theme (Default)

```
Primary:   #1677ff (Ant Design Blue)
Success:   #52c41a (Green)
Warning:   #faad14 (Orange)
Error:     #ff4d4f (Red)
Info:      #13c2c2 (Cyan)

Background: #ffffff (White)
Surface:    #f0f2f5 (Light Gray)
Text:       #000000 (Black)
Secondary:  #8c8c8c (Gray)
```

## 🌈 Suggested Color Palettes

### 1. Professional Blue
```css
--primary:    #0066CC;
--secondary:  #004C99;
--accent:     #00A3FF;
--background: #F5F7FA;
--text:       #2C3E50;
```

สำหรับ: เว็บไซต์องค์กร, ธุรกิจการเงิน

### 2. Modern Purple
```css
--primary:    #6366F1;
--secondary:  #4F46E5;
--accent:     #818CF8;
--background: #F8F9FF;
--text:       #1E293B;
```

สำหรับ: แอพเทคโนโลยี, SaaS, Startup

### 3. Vibrant Orange
```css
--primary:    #FF6B35;
--secondary:  #F7931E;
--accent:     #FDB44B;
--background: #FFF9F5;
--text:       #333333;
```

สำหรับ: E-commerce, Food & Beverage

### 4. Fresh Green
```css
--primary:    #10B981;
--secondary:  #059669;
--accent:     #34D399;
--background: #F0FDF4;
--text:       #1F2937;
```

สำหรับ: สุขภาพ, สิ่งแวดล้อม, Organic

### 5. Elegant Dark
```css
--primary:    #3B82F6;
--secondary:  #1E40AF;
--accent:     #60A5FA;
--background: #111827;
--surface:    #1F2937;
--text:       #F9FAFB;
```

สำหรับ: Portfolio, Agency, Premium Brand

### 6. Warm Coral
```css
--primary:    #FF6F61;
--secondary:  #FF9A8B;
--accent:     #FFB6A3;
--background: #FFF5F3;
--text:       #4A4A4A;
```

สำหรับ: แฟชั่น, ความงาม, ไลฟ์สไตล์

## 🎯 การนำไปใช้

### 1. อัพเดทใน Tailwind Config
```ts
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#004C99',
        accent: '#00A3FF',
      },
    },
  },
};
```

### 2. อัพเดทใน Ant Design Theme
```ts
// lib/theme.ts
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#0066CC',
    colorSuccess: '#10B981',
    colorWarning: '#F7931E',
    colorError: '#FF4D4f',
    colorInfo: '#00A3FF',
    colorBgLayout: '#F5F7FA',
  },
};
```

### 3. ใช้ใน CSS/Components
```tsx
// Using Tailwind
<div className="bg-primary text-white">
  <h1>Hello World</h1>
</div>

// Using Ant Design
<Button type="primary">Click Me</Button>
```

## 📱 Color Accessibility

ตรวจสอบ Contrast Ratio ที่:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- WCAG AA: อย่างน้อย 4.5:1 สำหรับข้อความปกติ
- WCAG AAA: อย่างน้อย 7:1 สำหรับข้อความปกติ

## 🔗 Resources

- [Coolors.co](https://coolors.co) - สร้างชุดสี
- [Adobe Color](https://color.adobe.com) - Color Wheel
- [ColorHunt](https://colorhunt.co) - Color Palettes
- [Material Design Colors](https://materialui.co/colors) - Material Design

