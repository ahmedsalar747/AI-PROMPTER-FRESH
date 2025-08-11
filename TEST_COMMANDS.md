# 🧪 راهنمای کامل دستورات تست Prompter Fresh

## 📁 مسیر برنامه
```
C:\Users\badri\prompter-new\prompter-fresh
```

## 🚀 دستورات اصلی تست

### 1️⃣ تست‌های Integration (ارتباط بک‌اند و فرانت‌اند)
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:integration
```

### 2️⃣ تست‌های Business Logic (منطق کسب‌وکار)
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:business
```

### 3️⃣ تست‌های End-to-End (سناریوهای کامل)
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:e2e
```

### 4️⃣ تمام تست‌ها
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:all
```

### 5️⃣ تست‌ها با Coverage
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:coverage
```

### 6️⃣ تست‌ها در حالت Watch
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:watch
```

### 7️⃣ تست‌ها با UI
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:ui
```

### 8️⃣ تست‌های Debug
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:debug
```

## 📋 دستورات اضافی

### تست‌های پایه
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm test
```

### تست‌های با اجرای کامل
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:run
```

### تست‌های خاص فایل
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npx vitest run src/test/integration.test.ts
npx vitest run src/test/business-logic.test.ts
npx vitest run src/test/end-to-end.test.ts
```

## 🎯 اجرای خودکار

### با PowerShell Script
```powershell
.\run-all-tests.ps1
```

### با Batch Script
```cmd
run-all-tests.bat
```

## 📊 نتایج تست

### مشاهده Coverage
بعد از اجرای `npm run test:coverage`، فایل‌های coverage در پوشه `coverage/` ذخیره می‌شوند.

### مشاهده نتایج در مرورگر
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test:ui
```

## 🔧 عیب‌یابی

### نصب Dependencies
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm install
```

### پاک کردن Cache
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npm run test -- --clearCache
```

### اجرای تست‌های خاص
```powershell
cd "C:\Users\badri\prompter-new\prompter-fresh"
npx vitest run --reporter=verbose
```

## 📚 فایل‌های مهم

- `src/test/integration.test.ts` - تست‌های Integration
- `src/test/business-logic.test.ts` - تست‌های Business Logic  
- `src/test/end-to-end.test.ts` - تست‌های End-to-End
- `TEST_GUIDE.md` - راهنمای کامل تست‌ها
- `run-all-tests.ps1` - اسکریپت PowerShell
- `run-all-tests.bat` - اسکریپت Batch

## 🎯 نکات مهم

1. **قبل از اجرا**: مطمئن شوید که در مسیر صحیح برنامه هستید
2. **Dependencies**: تمام dependencies نصب شده باشند
3. **Node.js**: نسخه Node.js سازگار باشد
4. **PowerShell**: برای اجرای اسکریپت‌های PowerShell از Execution Policy مناسب استفاده کنید

## 🚨 خطاهای رایج

### خطای Module Not Found
```powershell
npm install
```

### خطای Permission
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### خطای Path
مطمئن شوید که در مسیر صحیح هستید:
```powershell
pwd
# باید C:\Users\badri\prompter-new\prompter-fresh باشد
``` 