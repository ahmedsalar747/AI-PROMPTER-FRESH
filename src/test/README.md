# 🧪 **راهنمای تست‌های جامع Prompter Fresh**

## 📋 **فهرست تست‌ها**

### **1. 🔗 Integration Tests (`integration.test.ts`)**
تست‌های ارتباط بین بک‌اند و فرانت‌اند

**پوشش:**
- ✅ AI Service Integration (OpenAI, Anthropic, Google)
- ✅ Billing Integration (Google Play Billing)
- ✅ Authentication Integration (API Key Management)
- ✅ Template Access Integration (Premium/Free Logic)
- ✅ Cross-Platform Integration (Android/iOS)
- ✅ Error Handling Integration
- ✅ Performance Integration

**اجرا:**
```bash
npm run test:integration
```

---

### **2. 🏢 Business Logic Tests (`business-logic.test.ts`)**
تست‌های منطق کسب‌وکار و قوانین برنامه

**پوشش:**
- ✅ Authentication & Authorization Logic
- ✅ Subscription & Billing Logic
- ✅ Product & Pricing Logic
- ✅ Access Control Logic
- ✅ Template Management Logic
- ✅ Error Handling Logic
- ✅ Performance & Optimization Logic
- ✅ Internationalization Logic
- ✅ Security Logic
- ✅ Mobile-Specific Logic

**اجرا:**
```bash
npm run test:business
```

---

### **3. 🔄 End-to-End Tests (`end-to-end.test.ts`)**
تست‌های کامل سناریوهای کاربر

**پوشش:**
- ✅ User Registration & Login Flow
- ✅ API Key Configuration Flow
- ✅ Prompt Enhancement Flow
- ✅ Template Usage Flow
- ✅ Subscription Purchase Flow
- ✅ Search & Filter Flow
- ✅ Template Creation Flow
- ✅ Mobile Responsiveness Flow
- ✅ Language Switching Flow
- ✅ Error Recovery Flow
- ✅ Performance Flow

**اجرا:**
```bash
npm run test:e2e
```

---

## 🚀 **اجرای تست‌ها**

### **تست‌های فردی:**
```bash
# تست‌های Integration
npm run test:integration

# تست‌های Business Logic
npm run test:business

# تست‌های End-to-End
npm run test:e2e
```

### **تست‌های کامل:**
```bash
# تمام تست‌ها
npm run test:all

# تست‌ها با coverage
npm run test:coverage

# تست‌ها در حالت watch
npm run test:watch

# تست‌ها با UI
npm run test:ui
```

---

## 📊 **نحوه کارکرد تست‌ها**

### **1. Mocking Strategy:**
```javascript
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock fetch
global.fetch = vi.fn();

// Mock React hooks
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useState: vi.fn(),
  useEffect: vi.fn(),
  useContext: vi.fn()
}));
```

### **2. Test Data Setup:**
```javascript
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
});
```

### **3. Assertion Patterns:**
```javascript
// API calls
expect(fetch).toHaveBeenCalledWith(
  'https://api.openai.com/v1/chat/completions',
  expect.objectContaining({
    headers: expect.objectContaining({
      'Authorization': `Bearer ${testApiKey}`
    })
  })
);

// localStorage operations
expect(localStorageMock.setItem).toHaveBeenCalledWith(
  'premium-subscription',
  expect.stringContaining('pro_plan_monthly')
);

// UI interactions
await waitFor(() => {
  expect(screen.getByText('Enhanced prompt response')).toBeInTheDocument();
});
```

---

## 🎯 **سناریوهای تست شده**

### **🔐 Authentication:**
- ✅ تشخیص API key شخصی
- ✅ ذخیره و بازیابی API key
- ✅ اعتبارسنجی API key
- ✅ پیام‌های مناسب برای انواع مختلف API key

### **💰 Billing:**
- ✅ خرید اشتراک
- ✅ بازیابی خریدها
- ✅ بررسی وضعیت اشتراک
- ✅ انقضای اشتراک

### **📝 Templates:**
- ✅ محدودیت‌های free tier
- ✅ دسترسی نامحدود premium
- ✅ ردیابی استفاده
- ✅ بازنشانی ماهانه

### **🤖 AI Integration:**
- ✅ OpenAI API
- ✅ Anthropic API
- ✅ Google Gemini API
- ✅ مدیریت خطاها
- ✅ پاسخ‌های نامعتبر

### **📱 Mobile:**
- ✅ تشخیص پلتفرم
- ✅ Product IDs مناسب
- ✅ Responsive design

---

## 🔧 **Troubleshooting**

### **مشکلات رایج:**

#### **1. Test Environment:**
```bash
# اگر تست‌ها اجرا نمی‌شوند
npm install @testing-library/react @testing-library/jest-dom
```

#### **2. Mock Issues:**
```javascript
// اگر mock ها کار نمی‌کنند
vi.clearAllMocks();
vi.restoreAllMocks();
```

#### **3. Async Issues:**
```javascript
// برای تست‌های async
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

---

## 📈 **Coverage Report**

### **هدف Coverage:**
- **Integration Tests**: 85%+
- **Business Logic Tests**: 90%+
- **End-to-End Tests**: 80%+

### **نحوه مشاهده Coverage:**
```bash
npm run test:coverage
```

فایل coverage در `coverage/` ذخیره می‌شود.

---

## 🎯 **Best Practices**

### **1. Test Organization:**
- هر تست یک سناریو مشخص
- نام‌گذاری واضح تست‌ها
- گروه‌بندی منطقی تست‌ها

### **2. Mock Management:**
- Mock کردن external dependencies
- استفاده از realistic test data
- Cleanup بعد از هر تست

### **3. Assertion Quality:**
- Assertion های specific
- تست کردن edge cases
- Error scenarios

---

## 🚀 **نتیجه‌گیری**

این تست‌ها پوشش کاملی از:
- ✅ **ارتباطات بک‌اند و فرانت‌اند**
- ✅ **منطق کسب‌وکار**
- ✅ **سناریوهای کاربر**
- ✅ **Error handling**
- ✅ **Performance**

**برای اجرای تست‌ها:**
```bash
npm run test:all
``` 