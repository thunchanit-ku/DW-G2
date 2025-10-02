# โครงสร้างโปรเจค DW-G2

## 📂 Directory Structure

```
DW-G2/
├── 📁 app/                          # Next.js App Router (Main Application)
│   ├── 📁 api/                     # API Routes
│   │   └── 📁 example/            # ตัวอย่าง API endpoint
│   │       └── route.ts           # GET, POST handlers
│   ├── layout.tsx                 # Root layout (Ant Design + Kanit font)
│   ├── page.tsx                   # Homepage
│   └── globals.css                # Global styles
│
├── 📁 components/                   # React Components
│   ├── ExampleCard.tsx            # ตัวอย่าง Card component
│   └── LottieAnimation.tsx        # Lottie animation component
│
├── 📁 lib/                          # Utility Functions & Configurations
│   ├── api.ts                     # API helper functions (GET, POST, PUT, DELETE)
│   ├── db.ts                      # Database connection utilities
│   └── theme.ts                   # Ant Design theme configuration
│
├── 📁 types/                        # TypeScript Type Definitions
│   └── index.ts                   # Common interfaces and types
│
├── 📁 public/                       # Static Assets (images, fonts, etc.)
│
├── 📁 node_modules/                 # Dependencies (auto-generated)
│
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 postcss.config.mjs           # PostCSS configuration
├── 📄 .eslintrc.json              # ESLint rules
├── 📄 .gitignore                  # Git ignore patterns
├── 📄 package.json                 # Dependencies and scripts
│
├── 📖 README.md                    # Main documentation
├── 📖 DATABASE_SCHEMA.md           # Database schema examples
├── 📖 COLOR_PALETTES.md            # Color scheme suggestions
└── 📖 PROJECT_STRUCTURE.md         # This file
```

## 🎯 Key Files Explained

### Application Files

#### `app/layout.tsx`
- Root layout component
- Ant Design ConfigProvider setup
- Kanit font configuration
- Global providers

#### `app/page.tsx`
- Homepage component
- Showcases all technologies
- Example implementations

#### `app/globals.css`
- Global CSS styles
- Tailwind directives
- Custom CSS variables

### Configuration Files

#### `next.config.ts`
```ts
// Next.js configuration
// Add redirects, rewrites, environment variables, etc.
```

#### `tailwind.config.ts`
```ts
// Tailwind CSS configuration
// Custom colors, fonts, spacing, etc.
// Preflight disabled for Ant Design compatibility
```

#### `lib/theme.ts`
```ts
// Ant Design theme customization
// Colors, typography, component styles
```

### API Routes

#### `app/api/example/route.ts`
- Example GET and POST handlers
- TypeScript-safe request/response
- Error handling examples

### Components

#### `components/ExampleCard.tsx`
- Reusable card component
- Props interface with TypeScript
- Lucide icon integration

#### `components/LottieAnimation.tsx`
- Lottie animation example
- Can replace with any Lottie JSON

### Utilities

#### `lib/api.ts`
- Fetch wrapper functions
- GET, POST, PUT, DELETE methods
- TypeScript generics for type safety

#### `lib/db.ts`
- Database connection template
- Prisma setup examples
- MySQL connection examples

### Types

#### `types/index.ts`
- Common TypeScript interfaces
- API response types
- Pagination and filter types

## 🚀 How to Add New Features

### 1. Add a New Page
```bash
# Create new folder in app/
mkdir app/dashboard

# Create page component
touch app/dashboard/page.tsx
```

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard</div>;
}
```

### 2. Add a New API Route
```bash
# Create new API folder
mkdir -p app/api/users

# Create route handler
touch app/api/users/route.ts
```

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Your logic here
  return NextResponse.json({ users: [] });
}
```

### 3. Add a New Component
```bash
touch components/MyComponent.tsx
```

```tsx
// components/MyComponent.tsx
'use client'; // If using hooks/interactivity

import { Button } from 'antd';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <Button>{title}</Button>;
}
```

### 4. Add a New Type
```ts
// types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

## 📝 Best Practices

### File Naming
- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `page.tsx` (Next.js convention)
- API Routes: `route.ts` (Next.js convention)

### Component Structure
```tsx
// 1. Imports
import { Button } from 'antd';
import { Home } from 'lucide-react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export default function Component({ title }: Props) {
  // 4. State & Hooks
  // 5. Functions
  // 6. Render
  return <div>{title}</div>;
}
```

### Code Organization
- Keep components small and focused
- Extract reusable logic to `lib/`
- Define types in `types/`
- Use TypeScript for type safety
- Follow ESLint rules

## 🔧 Common Tasks

### Install New Package
```bash
npm install package-name
```

### Add New Environment Variable
```bash
# Add to .env.local
NEW_VARIABLE="value"

# Use in code
process.env.NEW_VARIABLE
```

### Update Theme Colors
```ts
// lib/theme.ts
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#YOUR_COLOR',
  },
};
```

### Add Custom Tailwind Class
```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'custom-blue': '#1677ff',
    },
  },
}
```

## 📚 Related Documentation

- [README.md](./README.md) - Getting started & overview
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database design
- [COLOR_PALETTES.md](./COLOR_PALETTES.md) - Color schemes

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Ant Design Components](https://ant.design/components/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

