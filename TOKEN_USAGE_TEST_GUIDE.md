# 📊 Token Usage Testing Guide - APK

## 🎯 **تست‌های اصلی برای Token Management**

### **1️⃣ تست Free API Limits:**

#### **A. بررسی نمایش محدودیت‌ها:**
```
✅ Dashboard → "Free Monthly Usage" section
✅ باید نمایش دهد: "0/200 tokens, 0/3 requests"
✅ Progress bar سبز باشد
✅ "X days until reset" نمایش دهد
```

#### **B. تست Token Estimation:**
```
✅ Enhancer page → prompt وارد کنید
✅ زیر textbox باید token estimate نمایش دهد
✅ مثال: "Estimated: ~150 tokens"
✅ Suggestions برای بهینه‌سازی نمایش دهد
```

### **2️⃣ تست API Call Process:**

#### **A. اولین API Call:**
```
1. Prompt وارد کنید: "Write about AI"
2. "Enhance Prompt" کلیک کنید
3. باید usage update شود: "~150/200 tokens, 1/3 requests"
4. Progress bar تغییر رنگ دهد
```

#### **B. تست Warning System:**
```
1. Prompts طولانی امتحان کنید تا به 80% برسید
2. باید warning نمایش دهد: "⚠️ Using 80% of monthly tokens"
3. در 90%: "🚨 Almost at limit"
4. در 100%: "❌ Monthly limit reached"
```

### **3️⃣ تست محدودیت‌ها:**

#### **A. Token Limit Exceed:**
```
1. Usage را به نزدیک 200 برسانید
2. Prompt بزرگ وارد کنید (>1000 characters)
3. باید error نمایش دهد: "Would exceed monthly limit"
4. Suggestion برای upgrade یا wait نمایش دهد
```

#### **B. Request Limit Exceed:**
```
1. 3 API call انجام دهید
2. چهارمین call باید block شود
3. Error: "Monthly request limit reached"
4. "Resets on 1st of next month" نمایش دهد
```

### **4️⃣ تست UI Components:**

#### **A. FreeApiIndicator:**
- مکان: Dashboard, Settings
- نمایش: Real-time usage updates
- Progress bars: Color changes (green → orange → red)

#### **B. SmartTokenUsage:**
- مکان: Enhancer page
- نمایش: Token estimates قبل از API call
- Suggestions: بهینه‌سازی prompt

#### **C. FreeApiWidget:**
- مکان: Dashboard sidebar
- نمایش: Quick usage overview
- Actions: "Try Now", "Manage", "Help"

### **5️⃣ تست Settings Management:**

#### **A. Usage Management:**
```
✅ Settings → API Keys → Free API Management
✅ نمایش: Detailed usage breakdown
✅ Charts: Usage over time
✅ Reset button: (فقط در dev mode)
```

#### **B. Pro Plan Integration:**
```
✅ "Upgrade to Pro" buttons کار کنند
✅ Pro plan modal نمایش دهد: "50,000 tokens/month"
✅ Pricing: "$9.99/month" درست نمایش دهد
```

### **6️⃣ تست Security & Anti-Abuse:**

#### **A. Device Fingerprinting:**
```
✅ اولین بار که app باز می‌شود unique fingerprint بسازد
✅ در localStorage ذخیره شود: "secure-usage-*"
✅ Reinstall app → اگر بیش از 3 بار، block شود
```

#### **B. Rate Limiting:**
```
✅ API calls پشت سر هم → block after rate limit
✅ "Please wait before making another request"
✅ 1 minute interval بین requests
```

### **7️⃣ تست Storage & Persistence:**

#### **A. Usage Persistence:**
```
✅ App close/open → usage حفظ شود
✅ Browser refresh → counts باقی بماند
✅ Different tabs → synchronized updates
```

#### **B. Monthly Reset:**
```
✅ تاریخ ماه تغییر کند → auto reset
✅ "Last reset" date درست نمایش دهد
✅ New month → fresh 200 tokens + 3 requests
```

### **8️⃣ تست Error Handling:**

#### **A. Network Issues:**
```
✅ Internet off → graceful error message
✅ "Check connection and try again"
✅ No usage deduction for failed calls
```

#### **B. Invalid Prompts:**
```
✅ Empty prompt → "Please enter a prompt"
✅ Too short → "Prompt too short for enhancement"
✅ Invalid characters → sanitization warning
```

### **9️⃣ تست Business Model:**

#### **A. Freemium Flow:**
```
✅ Free users → limited access clearly shown
✅ Upgrade prompts → at appropriate times
✅ Premium templates → locked with paywall
```

#### **B. Conversion Points:**
```
✅ After 2nd request → "Only 1 request remaining"
✅ At 80% tokens → "Consider upgrading"
✅ Limit reached → "Upgrade for unlimited access"
```

### **🔟 تست Performance:**

#### **A. Real-time Updates:**
```
✅ Usage counters update فوری بعد از API call
✅ Progress bars smooth animation
✅ No UI lag during token calculations
```

#### **B. Memory Usage:**
```
✅ Token estimates سریع محاسبه شوند (<100ms)
✅ Storage operations non-blocking
✅ UI responsive حین API calls
```

## 📱 **Test Scenarios در APK:**

### **Scenario 1: New User Journey**
1. اولین بار app باز کنید
2. Check: 200/200 tokens, 3/3 requests available
3. One API call → verify usage update
4. Check: UI reflects new usage

### **Scenario 2: Power User**
1. Multiple API calls تا limit
2. Verify warnings at 80%, 90%
3. Hit limit → appropriate error handling
4. Upgrade prompts نمایش داده شوند

### **Scenario 3: Abuse Prevention**
1. Rapid API calls → rate limiting
2. App reinstall multiple times → block
3. Suspicious patterns → security warnings

## ✅ **Success Criteria:**

### **Must Work:**
- ✅ Token counting accurate
- ✅ Monthly limits enforced  
- ✅ UI updates real-time
- ✅ Error handling graceful
- ✅ Security measures active

### **Should Work:**
- ✅ Performance optimized
- ✅ User experience smooth
- ✅ Upgrade flow clear
- ✅ Help/guidance available

### **Nice to Have:**
- ✅ Advanced analytics
- ✅ Usage predictions
- ✅ Optimization suggestions
- ✅ Behavioral insights

**اگر همه این تست‌ها pass شوند، Token Management system production-ready است! 🚀** 