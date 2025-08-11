# 🧪 Prompter Fresh - Test Runner Script
# اجرای تمام تست‌های برنامه

Write-Host "🚀 شروع اجرای تست‌های Prompter Fresh..." -ForegroundColor Green
Write-Host "📁 مسیر برنامه: C:\Users\badri\prompter-new\prompter-fresh" -ForegroundColor Cyan
Write-Host ""

# تغییر به مسیر برنامه
Set-Location "C:\Users\badri\prompter-new\prompter-fresh"

Write-Host "📋 فهرست دستورات تست:" -ForegroundColor Yellow
Write-Host ""

# 1. تست‌های Integration
Write-Host "1️⃣ تست‌های Integration (ارتباط بک‌اند و فرانت‌اند):" -ForegroundColor Magenta
Write-Host "   npm run test:integration" -ForegroundColor White
Write-Host ""

# 2. تست‌های Business Logic
Write-Host "2️⃣ تست‌های Business Logic (منطق کسب‌وکار):" -ForegroundColor Magenta
Write-Host "   npm run test:business" -ForegroundColor White
Write-Host ""

# 3. تست‌های End-to-End
Write-Host "3️⃣ تست‌های End-to-End (سناریوهای کامل):" -ForegroundColor Magenta
Write-Host "   npm run test:e2e" -ForegroundColor White
Write-Host ""

# 4. تمام تست‌ها
Write-Host "4️⃣ تمام تست‌ها:" -ForegroundColor Magenta
Write-Host "   npm run test:all" -ForegroundColor White
Write-Host ""

# 5. تست‌ها با Coverage
Write-Host "5️⃣ تست‌ها با Coverage:" -ForegroundColor Magenta
Write-Host "   npm run test:coverage" -ForegroundColor White
Write-Host ""

# 6. تست‌ها در حالت Watch
Write-Host "6️⃣ تست‌ها در حالت Watch:" -ForegroundColor Magenta
Write-Host "   npm run test:watch" -ForegroundColor White
Write-Host ""

# 7. تست‌ها با UI
Write-Host "7️⃣ تست‌ها با UI:" -ForegroundColor Magenta
Write-Host "   npm run test:ui" -ForegroundColor White
Write-Host ""

# 8. تست‌های Debug
Write-Host "8️⃣ تست‌های Debug:" -ForegroundColor Magenta
Write-Host "   npm run test:debug" -ForegroundColor White
Write-Host ""

Write-Host "🎯 برای اجرای دستی هر تست، دستور مورد نظر را کپی و اجرا کنید." -ForegroundColor Green
Write-Host ""

# پرسیدن از کاربر برای اجرای خودکار
$runAuto = Read-Host "❓ آیا می‌خواهید تمام تست‌ها را به صورت خودکار اجرا کنم؟ (y/n)"

if ($runAuto -eq "y" -or $runAuto -eq "Y") {
    Write-Host ""
    Write-Host "🔄 شروع اجرای خودکار تست‌ها..." -ForegroundColor Green
    Write-Host ""
    
    # اجرای تمام تست‌ها
    Write-Host "📊 اجرای تمام تست‌ها..." -ForegroundColor Yellow
    npm run test:all
    
    Write-Host ""
    Write-Host "✅ اجرای تست‌ها کامل شد!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ℹ️ برای اجرای دستی تست‌ها، دستورات بالا را کپی و اجرا کنید." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📚 راهنمای کامل تست‌ها در فایل TEST_GUIDE.md موجود است." -ForegroundColor Blue 