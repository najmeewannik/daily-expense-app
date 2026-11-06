# 💰 Daily Expense Tracker (เว็บแอปบันทึกรายจ่ายส่วนบุคคล ฟรี 100%)

เว็บแอปพลิเคชันสำหรับจดบันทึกรายจ่ายประจำวัน คุมงบประมาณวันและเดือน พร้อม Dashboard สรุปผล 7 วันย้อนหลัง, สรุปสัดส่วนหมวดหมู่ประจำเดือน และสถิติภาพรวมทั้งปี โดยใช้ **Google Sheets ใน Google Drive ของคุณเป็นฐานข้อมูล (Database)** ฟรี 100%

---

## ✨ ฟีเจอร์เด่น (Key Features)

- ⚡ **จดรายจ่ายต่อเนื่อง (Continuous Fast Entry):** พิมพ์จำนวนเงิน เลือกหมวดหมู่ด้วย Quick Chips แล้วกด Enter จดรายการถัดไปได้ทันที
- 🎯 **คุมงบประมาณรายวัน & รายเดือน (Budget Limits):** หลอด Progress Bar คำนวณเงินคงเหลือ พร้อมแจ้งเตือนระดับสี (🟢 ปกติ, 🟡 ใกล้เต็ม, 🔴 เกินงบ)
- 📊 **แดชบอร์ดสรุปผล 4 รูปแบบ:**
  - **วันนี้ (Today):** รายการรายจ่ายวันนี้ พร้อมยอดรวม
  - **7 วันล่าสุด (Weekly):** กราฟแท่งแสดงรายจ่ายย้อนหลัง 7 วัน เทียบกับเส้นงบประมาณต่อวัน
  - **ประจำเดือน (Monthly):** กราฟ Donut สัดส่วนหมวดหมู่ พร้อมยอดเฉลี่ยที่แนะนำให้ใช้ต่อวัน
  - **ประจำปี (Yearly):** กราฟแท่งเปรียบเทียบ 12 เดือนของปี
- ☁️ **Google Sheets Database (ฟรีตลอดชีพ):** ข้อมูลวิ่งไปบันทึกใน Spreadsheet บน Google Drive ของคุณ เปิดดูผ่านแอป Google Sheets บนมือถือได้ตลอดเวลา
- ⚡ **Local-First & Offline Ready:** มี Local Cache ในเครื่อง แม้เน็ตหลุดหรือยังไม่ได้ต่อ Google Sheet ก็ใช้งานได้ทันทีใน 0.1 วินาที
- 📱 **PWA Ready:** รองรับการกด **"Add to Home Screen"** บน iOS และ Android เพื่อใช้งานเสมือนแอปจริง
- 💾 **สำรองข้อมูล (Export/Import):** ดาวน์โหลดเป็นไฟล์ Excel (CSV) หรือ JSON ได้ตลอดเวลา

---

## 🚀 วิธีเปิดใช้งานในเครื่อง (Local Development)

```bash
cd /Users/najmee.h/daily-expense-app

# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มรัน Development Server
npm run dev
```
เปิดเบราว์เซอร์ที่ `http://localhost:3000`

---

## 📋 วิธีตั้งค่า Google Sheets Database (ใช้เวลาเพียง 2 นาที)

1. เปิด **Google Drive** ของคุณ แล้วสร้าง **Google Sheet เปล่า** 1 ไฟล์ (ตั้งชื่อว่า `My Daily Expenses`)
2. ที่แถบเมนูด้านบนของ Google Sheet ให้คลิก **Extensions (ส่วนขยาย) > Apps Script**
3. ลบโค้ดเดิมทั้งหมดในหน้าต่าง Apps Script ออก แล้วคัดลอกโค้ดจากไฟล์ `google-apps-script/Code.gs` ไปวางแทนที่
4. กดปุ่มสีน้ำเงินด้านขวาบน **Deploy (ทำให้ใช้งานได้) > New deployment (การทำให้ใช้งานได้ใหม่)**
5. คลิกรูปฟันเฟือง เลือกประเภท **Web app (เว็บแอปพลิเคชัน)**
6. ตั้งค่าดังนี้:
   - **Description:** `Expense API`
   - **Execute as:** `Me (ฉัน)`
   - **Who has access:** `Anyone (ทุกคน)` *(สำคัญมาก)*
7. กด **Deploy** และกดอนุญาตสิทธิ์ (Authorize access)
8. คัดลอก **Web app URL** ที่ได้ (ขึ้นต้นด้วย `https://script.google.com/macros/s/.../exec`)
9. เปิดเว็บแอป Expense Tracker ไปที่เมนู **"ตั้งค่า & เชื่อมต่อ"** แล้ววาง URL ลงในช่อง Google Sheet Web App URL แล้วกด **"ทดสอบ & บันทึกการเชื่อมต่อ"**

---

## 🌐 วิธี Deploy ขึ้น Vercel ฟรี 100% (แนะนำ)

1. Push โค้ดโปรเจกต์นี้ขึ้น GitHub Repository ของคุณ ([`najmeewannik`](https://github.com/najmeewannik))
2. ล็อกอินเข้า [vercel.com](https://vercel.com) ด้วยบัญชี GitHub
3. คลิก **"Add New... > Project"**
4. เลือก Repository `daily-expense-app`
5. Vercel จะตรวจจับเป็น **Vite Framework** อัตโนมัติ กดปุ่ม **"Deploy"**
6. เสร็จสิ้น! คุณจะได้โดเมนฟรี เช่น `https://daily-expense-app-xxx.vercel.app` พร้อม HTTPS ทันที
