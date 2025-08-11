@echo off
chcp 65001 >nul
REM 🧪 Prompter Fresh - Test Runner Script
REM اجرای تمام تست‌های برنامه

echo 🚀 شروع اجرای تست‌های Prompter Fresh...
echo 📁 مسیر برنامه: C:\Users\badri\prompter-new\prompter-fresh
echo.

REM تغییر به مسیر برنامه
cd /d "C:\Users\badri\prompter-new\prompter-fresh"

echo 📋 فهرست دستورات تست:
echo.

REM 1. تست‌های Integration
echo 1️⃣ تست‌های Integration (ارتباط بک‌اند و فرانت‌اند):
echo    npm run test:integration
echo.

REM 2. تست‌های Business Logic
echo 2️⃣ تست‌های Business Logic (منطق کسب‌وکار):
echo    npm run test:business
echo.

REM 3. تست‌های End-to-End
echo 3️⃣ تست‌های End-to-End (سناریوهای کامل):
echo    npm run test:e2e
echo.

REM 4. تمام تست‌ها
echo 4️⃣ تمام تست‌ها:
echo    npm run test:all
echo.

REM 5. تست‌ها با Coverage
echo 5️⃣ تست‌ها با Coverage:
echo    npm run test:coverage
echo.

REM 6. تست‌ها در حالت Watch
echo 6️⃣ تست‌ها در حالت Watch:
echo    npm run test:watch
echo.

REM 7. تست‌ها با UI
echo 7️⃣ تست‌ها با UI:
echo    npm run test:ui
echo.

REM 8. تست‌های Debug
echo 8️⃣ تست‌های Debug:
echo    npm run test:debug
echo.

echo 🎯 برای اجرای دستی هر تست، دستور مورد نظر را کپی و اجرا کنید.
echo.

set /p runAuto="❓ آیا می‌خواهید تمام تست‌ها را به صورت خودکار اجرا کنم؟ (y/n): "

if /i "%runAuto%"=="y" (
    echo.
    echo 🔄 شروع اجرای خودکار تست‌ها...
    echo.
    
    REM اجرای تمام تست‌ها
    echo 📊 اجرای تمام تست‌ها...
    npm run test:all
    
    echo.
    echo ✅ اجرای تست‌ها کامل شد!
) else (
    echo.
    echo ℹ️ برای اجرای دستی تست‌ها، دستورات بالا را کپی و اجرا کنید.
)

echo.
echo 📚 راهنمای کامل تست‌ها در فایل TEST_GUIDE.md موجود است.
pause 