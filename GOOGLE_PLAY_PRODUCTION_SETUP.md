# 🚀 Google Play Console Production Setup - راهنمای کامل تولید

## 📋 **Pre-Launch Checklist - چک‌لیست قبل از انتشار**

### **✅ مراحل تکمیل شده:**
- [x] Product IDs یکپارچه شدند
- [x] Security validation پیاده‌سازی شد
- [x] Error handling بهبود یافت
- [x] TypeScript errors رفع شدند

### **🎯 مراحل باقی‌مانده:**

---

## **1️⃣ Google Play Console - Product Setup**

### **A. ورود به Console:**
```
https://play.google.com/console/
```

### **B. Navigation Path:**
```
Your App → Monetize with Play → Products → In-app products / Subscriptions
```

### **C. ایجاد Products - دقیقاً با همین IDs:**

#### **🛒 In-App Product (Remove Ads):**
```json
{
  "product_id": "com.prompterfresh.app.remove_ads",
  "product_type": "Managed product",
  "name": "Remove Ads + Premium Templates",
  "description": "Remove all advertisements and unlock premium templates",
  "default_price": "7.99 USD",
  "status": "Active"
}
```

**مراحل ایجاد:**
1. Products → In-app products → Create product
2. Product ID: `com.prompterfresh.app.remove_ads`
3. Name: `Remove Ads + Premium Templates`
4. Description: `Remove all advertisements and unlock premium templates`
5. Set default price: `$7.99`
6. Add countries and prices
7. Save → Activate

#### **📅 Subscription Product (Pro Plan):**
```json
{
  "product_id": "com.prompterfresh.app.pro_plan_monthly",
  "product_type": "Subscription",
  "name": "Pro Plan Monthly",
  "description": "50,000 tokens per month + unlimited features",
  "base_plan": {
    "billing_period": "P1M",
    "price": "9.99 USD",
    "renewal_type": "auto_renewing"
  },
  "status": "Active"
}
```

**مراحل ایجاد:**
1. Products → Subscriptions → Create subscription
2. Product ID: `com.prompterfresh.app.pro_plan_monthly`
3. Name: `Pro Plan Monthly`
4. Description: `50,000 tokens per month + unlimited features`
5. Create base plan:
   - Billing period: Monthly (P1M)
   - Auto-renewing: Yes
   - Price: $9.99
   - Eligibility: Available to new subscribers
6. Configure offers (optional):
   - Free trial: 7 days
   - Introductory price: $4.99 for first month
7. Save → Activate

---

## **2️⃣ App Bundle Preparation**

### **A. Build Production APK/AAB:**
```bash
# در Android Studio:
cd android
./gradlew bundleRelease

# یا via Capacitor:
npx cap run android --prod
```

### **B. Sign App Bundle:**
```bash
# Create keystore (if not exists):
keytool -genkey -v -keystore prompter-fresh.keystore -alias prompter-fresh -keyalg RSA -keysize 2048 -validity 10000

# Sign bundle:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore prompter-fresh.keystore app-release.aab prompter-fresh
```

**⚠️ نکات مهم:**
- Keystore را در جای امن نگه دارید
- Password را یادداشت کنید  
- برای آپدیت‌های آینده لازم است

### **C. آپلود به Google Play:**
1. Play Console → Your App → Release → Testing → Internal testing
2. Create new release
3. Upload AAB file
4. Add release notes
5. Review → Start rollout to internal testing

---

## **3️⃣ Store Listing Optimization**

### **A. App Information:**
```
App Name: Prompter Fresh
Short Description: AI-powered prompt enhancement and template library
Full Description: [See below]
```

### **B. تنظیمات Category:**
```
Category: Productivity
Content Rating: Everyone
Target Audience: Adults (18+)
```

### **C. Store Description (Persian + English):**

#### **English Description:**
```
🤖 Prompter Fresh - Professional AI Prompt Enhancement

Transform your writing with AI-powered prompts and templates designed for content creators, marketers, and professionals.

✨ KEY FEATURES:
• Prompt Enhancer: Turn simple ideas into professional prompts
• Template Gallery: 1000+ professionally crafted templates
• Multi-AI Support: Works with ChatGPT, Claude, Gemini, and more
• Prompt Library: Save and organize your favorite prompts
• Offline Mode: Works without internet connection

🎯 PERFECT FOR:
• Content creators and bloggers
• Marketing professionals  
• Students and researchers
• Business communications
• Creative writing projects

💎 TWO TIERS:
• Remove Ads ($7.99): Ad-free experience + premium templates
• Pro Plan ($9.99/month): 50,000 AI tokens + unlimited features

🚀 GET STARTED:
1. Enter your simple prompt idea
2. AI enhances it professionally
3. Copy and use with any AI platform
4. Save successful prompts for later

Download Prompter Fresh today and unlock the power of professional AI prompting!
```

#### **Persian Description:**
```
🤖 پرامپتر فرش - بهینه‌سازی حرفه‌ای پرامپت‌های هوش مصنوعی

نوشته‌های خود را با پرامپت‌ها و قالب‌های هوش مصنوعی که برای تولیدکنندگان محتوا، بازاریاب‌ها و متخصصان طراحی شده‌اند، متحول کنید.

✨ ویژگی‌های کلیدی:
• بهبود‌دهنده پرامپت: ایده‌های ساده را به پرامپت‌های حرفه‌ای تبدیل کنید
• گالری قالب: بیش از ۱۰۰۰ قالب طراحی شده توسط متخصصان
• پشتیبانی چند هوش مصنوعی: با ChatGPT، Claude، Gemini و غیره کار می‌کند
• کتابخانه پرامپت: پرامپت‌های مورد علاقه خود را ذخیره و سازماندهی کنید
• حالت آفلاین: بدون نیاز به اینترنت کار می‌کند

🎯 مناسب برای:
• تولیدکنندگان محتوا و وبلاگ‌نویسان
• متخصصان بازاریابی
• دانشجویان و محققان
• ارتباطات تجاری
• پروژه‌های نویسندگی خلاق

💎 دو سطح دسترسی:
• حذف تبلیغات (۷.۹۹ دلار): تجربه بدون تبلیغ + قالب‌های پرمیوم
• برنامه پرو (۹.۹۹ دلار/ماه): ۵۰،۰۰۰ توکن هوش مصنوعی + ویژگی‌های نامحدود

🚀 شروع کنید:
۱. ایده ساده پرامپت خود را وارد کنید
۲. هوش مصنوعی آن را به صورت حرفه‌ای بهبود می‌دهد
۳. کپی کرده و با هر پلتفرم هوش مصنوعی استفاده کنید
۴. پرامپت‌های موفق را برای استفاده بعدی ذخیره کنید

همین امروز Prompter Fresh را دانلود کنید و قدرت پرامپت‌سازی حرفه‌ای هوش مصنوعی را آزاد کنید!
```

### **D. Screenshots Requirements:**
```
Phone Screenshots (Required):
- 1080 x 1920 px or 1080 x 2340 px
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Format: PNG or JPEG

Tablet Screenshots (Optional):
- 1200 x 1920 px  
- Format: PNG or JPEG

Feature Graphic (Required):
- 1024 x 500 px
- PNG or JPEG
- No text overlays recommended
```

**پیشنهاد Screenshots:**
1. **Main Dashboard** - صفحه اصلی اپ
2. **Prompt Enhancer** - نمایش بهبود پرامپت
3. **Template Gallery** - گالری قالب‌ها
4. **Results Screen** - نمایش نتایج
5. **Settings** - صفحه تنظیمات

---

## **4️⃣ Privacy & Compliance**

### **A. Privacy Policy:**
- ✅ آماده شده در `PRIVACY_POLICY.md`
- Upload to website or include in app
- Link در store listing

### **B. Content Rating:**
```
Target Age Group: Adults
Violence: None
Sexual Content: None
Language: Mild
Gambling: None
Drug/Alcohol: None
```

### **C. App Access:**
```
Sensitive Permissions: None required
Special App Access: None
Restricted Content: None
```

---

## **5️⃣ Testing Strategy**

### **A. Internal Testing:**
```bash
1. Upload AAB to Internal Testing
2. Add test users (max 100)
3. Test core functionality:
   - Free API calls
   - Remove Ads purchase  
   - Pro Plan subscription
   - Error handling
   - Persian UI
4. Verify billing integration
5. Test on different devices
```

### **B. Closed Testing (Alpha):**
```bash
1. Create closed testing track
2. Add 20-50 external testers
3. Test for 1-2 weeks
4. Collect feedback
5. Fix critical issues
6. Prepare for production
```

### **C. Production Release:**
```bash
1. Create production release
2. Set rollout percentage: 5% → 20% → 50% → 100%
3. Monitor for crashes/issues
4. Respond to user reviews
5. Track conversion metrics
```

---

## **6️⃣ Monetization Setup**

### **A. Payment Methods:**
```
Supported: Credit/Debit Cards, PayPal, Google Pay, Carrier Billing
Countries: All available Google Play countries
Currency: Local currency automatic conversion
```

### **B. Tax Settings:**
```
1. Go to: Play Console → Settings → Developer account → Tax settings
2. Complete tax interview
3. Verify business information
4. Set up payment profile
```

### **C. Revenue Tracking:**
```
Tools to setup:
- Google Play Console Analytics
- Firebase Analytics
- Custom revenue tracking
- Monthly revenue reports
```

---

## **7️⃣ Production Configuration**

### **A. Environment Variables:**
```bash
# Production .env
VITE_OPENAI_API_KEY=your_production_openai_key
VITE_FREE_API_MAX_TOKENS=500
VITE_FREE_API_MAX_REQUESTS=2
VITE_ENVIRONMENT=production
VITE_ENABLE_ANALYTICS=true
VITE_PURCHASE_VALIDATION_URL=https://your-server.com/validate
```

### **B. Security Configuration:**
```typescript
// Update in production
const PRODUCTION_CONFIG = {
  enableReceiptValidation: true,
  enableServerValidation: true, // Enable when server ready
  enableAnalytics: true,
  logLevel: 'error', // Reduce logging
  enableDevFeatures: false
};
```

### **C. Performance Optimization:**
```bash
# Final build optimization
npm run build -- --mode production

# Verify bundle size
npm run analyze

# Test PWA functionality
npm run preview
```

---

## **8️⃣ Launch Day Checklist**

### **Pre-Launch (1 day before):**
- [ ] Final testing on real devices
- [ ] Verify all Product IDs are active
- [ ] Check pricing in all countries
- [ ] Prepare customer support responses
- [ ] Setup monitoring dashboards

### **Launch Day:**
- [ ] Set release to 100% rollout
- [ ] Monitor crash reports
- [ ] Track download numbers
- [ ] Respond to user reviews
- [ ] Watch revenue metrics
- [ ] Check error logs

### **Post-Launch (1 week):**
- [ ] Analyze user feedback
- [ ] Plan first update
- [ ] Optimize conversion funnel
- [ ] Scale successful ad campaigns
- [ ] Prepare iOS version

---

## **9️⃣ Success Metrics**

### **Key Performance Indicators:**
```
Downloads: Target 1,000+ in first month
Conversion Rate: Target 5%+ for Remove Ads
Retention: Target 40%+ Day 7 retention
Revenue: Target $500+ in first month
Ratings: Target 4.2+ stars average
```

### **Monitoring Tools:**
- Google Play Console Analytics
- Firebase Crashlytics
- Custom revenue dashboard
- User feedback tracking

---

## **🎯 Ready for Launch!**

با تکمیل این مراحل، اپ شما آماده انتشار در Google Play Store خواهد بود. همه جنبه‌های فنی، قانونی و تجاری در نظر گرفته شده‌اند.

**Next Step:** شروع از Internal Testing و به تدریج به سمت Production Release حرکت کنید. 