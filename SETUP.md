# 🚀 Setup Guide - راهنمای راه‌اندازی

## مرحله 1: نصب Dependencies

```bash
npm install
```

## مرحله 2: تنظیم Environment Variables

1. **کپی کردن فایل .env**
   ```bash
   cp .env.example .env
   ```

2. **تنظیم API Key**
   - فایل `.env` را باز کنید
   - `VITE_OPENAI_API_KEY=your-openai-api-key-here` را با API key واقعی خود جایگزین کنید

## مرحله 3: دریافت OpenAI API Key

1. به [platform.openai.com](https://platform.openai.com) بروید
2. حساب ایجاد کنید یا وارد شوید
3. به بخش "API Keys" بروید
4. یک API key جدید ایجاد کنید
5. آن را در فایل `.env` قرار دهید

## مرحله 4: اجرای پروژه

```bash
# برای development
npm run dev

# برای production build
npm run build
```

## مرحله 5: تست اپ

- برای تست Free API: به تنظیمات بروید و Free API را امتحان کنید
- برای تست Enhanced features: API key خود را اضافه کنید

---

## 🔒 نکات امنیتی

- **هرگز API key خود را در کد قرار ندهید**
- **فایل .env را به git commit نکنید**
- **از environment variables استفاده کنید**

## 🐛 رفع مشکلات

### خطا: "Free API service is not configured"
- API key در فایل `.env` را بررسی کنید
- مطمئن شوید فایل `.env` در root directory قرار دارد

### خطا: "API authentication error"
- API key شما صحیح نیست
- حساب OpenAI شما credit دارد

---

## 📱 راه‌اندازی برای موبایل

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## 🆘 پشتیبانی

اگر مشکلی پیش آمد، یک Issue در GitHub ایجاد کنید. 