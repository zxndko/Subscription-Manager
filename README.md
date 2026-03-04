# 🚀 Project Name

โปรเจกต์นี้พัฒนาขึ้นโดยเน้นประสิทธิภาพความเร็วด้วย Vite และความเข้มงวดของ Type เพื่อความยั่งยืนของโค้ด

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Library** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) |
| **UI Component** | ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white) |
| **CSS Framework** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) |

---

## 🏗 Development Workflow

### 1. การตั้งค่า Theme & Layout
* **Styling:** ปรับแต่งธีมหลักได้ที่ `src/index.css` และ `tailwind.config.ts` ให้สอดคล้องกับ Design System
* **Structure:** แบ่งหน้าจอ (Pages) ตาม User Requirements ที่ได้รับ

### 2. การสร้างเพจและระบบ Routing
* สร้างโฟลเดอร์แยกตามหน้าใน `src/pages/` โดยมี `Index.tsx` เป็นไฟล์ทางเข้าหลัก
* ลงทะเบียน Route ใน `App.tsx` เพื่อเชื่อมต่อหน้าต่าง ๆ เข้าด้วยกัน

### 3. การจัดการ Logic (Code Structure)
หากฟังก์ชันมีความซับซ้อน ให้แยกโมดูลตามโครงสร้างดังนี้:
src/pages/[page-name]/
├── Index.tsx           # ไฟล์หลัก (Entry Point)
├── /components/        # ส่วนประกอบย่อย (UI Components)
├── /hooks/             # Custom Hooks สำหรับ Logic
└── /stores/            # State Management (แนะนำ Zustand)

## 🔌 Backend & Data Integration
เราเน้นความถูกต้องของข้อมูลเป็นอันดับหนึ่ง (Data Integrity):

API Layer: เพิ่ม API ใหม่หรือใช้งาน Supabase โดยสร้างไฟล์ใน src/api

Strict Typing: ข้อมูลระหว่าง Frontend และ Supabase ต้องตรงตาม Data Type ที่กำหนดไว้ 100% * ⚠️ ข้อควรระวัง: หลีกเลี่ยงการแก้ไข Type ที่ตกลงกันไว้แล้ว หากจำเป็นต้องแก้ไข ต้องตรวจสอบไฟล์ที่เกี่ยวข้องทั้งหมด (Global Reference Check)

## 🧪 Quality Assurance (Checklist)
ก่อนส่งงานหรือทำ Pull Request ให้รันคำสั่งตรวจสอบความเรียบร้อยดังนี้:

Bash
### 1. ติดตั้ง Dependencies
pnpm i

### 2. ตรวจสอบคุณภาพโค้ด (Linting)
npm run lint

### 3. ตรวจสอบ Type Errors (ต้องไม่มี Error)
npx tsc --noEmit -p tsconfig.app.json --strict

## 💡 Best Practices
ใช้ Zustand สำหรับจัดการ Global State ที่มีความซับซ้อน

หากฟังก์ชันไม่ซับซ้อน สามารถเขียนจบใน Index.tsx ได้เพื่อความรวดเร็ว

รักษาความสะอาดของโค้ดและปฏิบัติตามมาตรฐาน TypeScript อย่างเคร่งครัด
