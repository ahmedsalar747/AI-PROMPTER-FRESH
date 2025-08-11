# 🍎 **iOS App Store Connect Setup Guide**

## **مقدمه**
راهنمای کامل راه‌اندازی iOS App Store subscriptions برای اپ Prompter Fresh

---

## **📋 پیش‌نیازها**

### **1️⃣ Apple Developer Account**
- حساب Apple Developer فعال ($99/سال)
- Bundle ID: `com.prompterfresh.app`
- App Store Connect access

### **2️⃣ Revenue Cat Account**
- حساب RevenueCat (رایگان تا 10K MAU)
- iOS API Key
- Product configuration

---

## **🏗️ App Store Connect Setup**

### **مرحله 1: ایجاد App در App Store Connect**

```bash
1. وارد App Store Connect شوید
2. My Apps > + (Add New App)
3. Platform: iOS
4. Name: Prompter Fresh
5. Bundle ID: com.prompterfresh.app
6. Language: English (Primary)
7. SKU: com.prompterfresh.app.ios
```

### **مرحله 2: تنظیم Subscription Groups**

```bash
App Store Connect > Your App > Features > In-App Purchases

1. Create Subscription Group:
   - Reference Name: Prompter Fresh Subscriptions
   - Display Name: Premium Access

2. Localization (English):
   - Display Name: Premium Access
   - Custom App Name: Prompter Fresh
```

### **مرحله 3: ایجاد Subscription Products**

#### **🟦 Basic Plan - $4.99/سال**
```bash
Product ID: com.prompterfresh.app.basic.yearly
Reference Name: Basic Annual Subscription
Duration: 1 Year
Price: $4.99 USD

Display Name: Basic Subscription
Description: Access to Beginner + Intermediate levels and basic templates
```

#### **🟨 Premium Plan - $9.99/سال**
```bash
Product ID: com.prompterfresh.app.premium.yearly
Reference Name: Premium Annual Subscription  
Duration: 1 Year
Price: $9.99 USD

Display Name: Premium Subscription
Description: Access to Beginner + Intermediate + Advanced levels with premium templates
```

#### **🟥 Expert Plan - $19.99/سال**
```bash
Product ID: com.prompterfresh.app.expert.yearly
Reference Name: Expert Annual Subscription
Duration: 1 Year  
Price: $19.99 USD

Display Name: Expert Subscription
Description: Full access to all levels, templates, and exclusive expert features
```

### **مرحله 4: Subscription Settings**

برای هر subscription:

```bash
Subscription Details:
✅ Auto-Renewable: Yes
✅ Available in All Territories: Yes

Family Sharing:
✅ Enable Family Sharing: Yes

Subscription Pricing:
- Base Territory: United States ($)
- Price Tier: Custom
- Auto-renew: Enabled

Review Information:
- Screenshot: App interface showing premium features
- Review Notes: Subscription unlocks premium content
```

---

## **🔧 RevenueCat Configuration**

### **مرحله 1: Create iOS App in RevenueCat**

```bash
1. RevenueCat Dashboard > Apps > + New
2. Platform: iOS
3. App Name: Prompter Fresh iOS
4. Bundle ID: com.prompterfresh.app
5. Copy iOS API Key
```

### **مرحله 2: Product Setup**

```bash
RevenueCat > Products > + Create

Product 1 - Basic:
- Store Product ID: com.prompterfresh.app.basic.yearly
- Display Name: Basic Annual
- Identifier: basic_yearly

Product 2 - Premium:  
- Store Product ID: com.prompterfresh.app.premium.yearly
- Display Name: Premium Annual
- Identifier: premium_yearly

Product 3 - Expert:
- Store Product ID: com.prompterfresh.app.expert.yearly  
- Display Name: Expert Annual
- Identifier: expert_yearly
```

### **مرحله 3: Entitlements**

```bash
RevenueCat > Entitlements > + Create

Entitlement: premium_access
Products: [basic_yearly, premium_yearly, expert_yearly]
```

### **مرحله 4: Offerings**

```bash
RevenueCat > Offerings > Create Offering

Offering ID: default
Display Name: Prompter Fresh Subscriptions

Packages:
1. Package ID: basic
   Product: basic_yearly
   
2. Package ID: premium  
   Product: premium_yearly
   
3. Package ID: expert
   Product: expert_yearly
```

---

## **📱 iOS Implementation**

### **مرحله 1: Install Dependencies**

```bash
npm install @capacitor-community/purchases
npm install @capacitor/app
```

### **مرحله 2: Update capacitor.config.ts**

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prompterfresh.app',
  appName: 'Prompter Fresh',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Purchases: {
      apiKey: process.env.REVENUECAT_IOS_API_KEY
    }
  }
};

export default config;
```

### **مرحله 3: iOS Project Settings**

```bash
ios/App/App/Info.plist میں اضافه کریں:

<key>ITSAppUsesNonExemptEncryption</key>
<false/>

<key>SKStoreKitConfigFile</key>
<string>Configuration</string>
```

### **مرحله 4: StoreKit Configuration (Testing)**

فایل `ios/App/App/Configuration.storekit` ایجاد کنید:

```json
{
  "identifier" : "Configuration",
  "nonRenewingSubscriptions" : [],
  "products" : [],
  "settings" : {
    "compatibilityRangeMode" : "current",
    "hasStoreKitConfigFile" : true
  },
  "subscriptionGroups" : [
    {
      "id" : "21482820",
      "localizations" : [],
      "name" : "Prompter Fresh Subscriptions",
      "subscriptions" : [
        {
          "adHocOffers" : [],
          "displayPrice" : "4.99",
          "familyShareable" : true,
          "id" : "com.prompterfresh.app.basic.yearly",
          "introductoryOffer" : null,
          "localizations" : [
            {
              "description" : "Access to Beginner + Intermediate levels",
              "displayName" : "Basic Subscription",
              "locale" : "en_US"
            }
          ],
          "productId" : "com.prompterfresh.app.basic.yearly",
          "recurringSubscriptionPeriod" : "P1Y",
          "referenceName" : "Basic Annual",
          "subscriptionGroupId" : "21482820",
          "type" : "RecurringSubscription"
        },
        {
          "adHocOffers" : [],
          "displayPrice" : "9.99", 
          "familyShareable" : true,
          "id" : "com.prompterfresh.app.premium.yearly",
          "introductoryOffer" : null,
          "localizations" : [
            {
              "description" : "Access to Beginner + Intermediate + Advanced levels",
              "displayName" : "Premium Subscription", 
              "locale" : "en_US"
            }
          ],
          "productId" : "com.prompterfresh.app.premium.yearly",
          "recurringSubscriptionPeriod" : "P1Y",
          "referenceName" : "Premium Annual",
          "subscriptionGroupId" : "21482820", 
          "type" : "RecurringSubscription"
        },
        {
          "adHocOffers" : [],
          "displayPrice" : "19.99",
          "familyShareable" : true, 
          "id" : "com.prompterfresh.app.expert.yearly",
          "introductoryOffer" : null,
          "localizations" : [
            {
              "description" : "Full access to all levels and features",
              "displayName" : "Expert Subscription",
              "locale" : "en_US"
            }
          ],
          "productId" : "com.prompterfresh.app.expert.yearly", 
          "recurringSubscriptionPeriod" : "P1Y",
          "referenceName" : "Expert Annual",
          "subscriptionGroupId" : "21482820",
          "type" : "RecurringSubscription"
        }
      ]
    }
  ],
  "version" : {
    "major" : 2,
    "minor" : 0
  }
}
```

---

## **🧪 Testing Strategy**

### **Development Testing**

```bash
# 1. Simulator Testing
- Use StoreKit Configuration File
- Test purchase flows
- Test restore purchases  
- Test subscription status

# 2. Device Testing  
- Use Sandbox Apple ID
- Test real StoreKit integration
- Verify RevenueCat webhook
```

### **Sandbox Testing**

```bash
1. Create Sandbox Apple ID:
   - App Store Connect > Users & Access > Sandbox Testers
   - Add new sandbox user

2. Device Setup:
   - Settings > App Store > Sign Out
   - Install test build
   - Sign in with Sandbox Apple ID during purchase

3. Test Scenarios:
   ✅ Purchase each subscription tier
   ✅ Restore purchases on new device  
   ✅ Cancel subscription in Settings
   ✅ Family Sharing functionality
   ✅ Network interruption handling
```

### **TestFlight Testing**

```bash
1. Upload build to App Store Connect
2. Create TestFlight group
3. Add internal/external testers
4. Test with real Apple ID payments (charged)
```

---

## **🚀 Production Deployment**

### **مرحله 1: App Review Preparation**

```bash
App Store Connect > App Review Information:

Contact Information:
- First Name: [Your Name]
- Last Name: [Your Name]  
- Phone: [Your Phone]
- Email: [Your Email]

Demo Account (if needed):
- Username: demo@prompterfresh.com
- Password: Demo123!

Notes:
"This app offers premium AI prompt templates and writing assistance through in-app subscriptions. All subscription tiers provide value through different access levels to our content library."
```

### **مرحله 2: App Store Metadata**

```bash
App Information:
- Name: Prompter Fresh
- Subtitle: AI Writing & Prompt Assistant  
- Category: Productivity
- Content Rating: 4+

App Preview and Screenshots:
- 6.7" iPhone screenshots (1290x2796)
- 5.5" iPhone screenshots (1242x2208)  
- iPad Pro screenshots (2048x2732)

Description:
"Transform your writing with AI-powered prompts and templates. Prompter Fresh offers curated prompts for creative writing, business communication, and content creation.

FEATURES:
• Extensive prompt library organized by difficulty
• AI-powered writing assistance
• Professional templates for business use
• Creative prompts for storytelling
• Academic and research templates

SUBSCRIPTION TIERS:
• Basic ($4.99/year): Beginner + Intermediate levels
• Premium ($9.99/year): Advanced prompts + premium templates  
• Expert ($19.99/year): Full access + exclusive expert content

All subscriptions auto-renew and can be managed in your Apple ID account settings."

Keywords: writing, prompts, AI, templates, productivity, creative, business
```

### **مرحله 3: Submission Process**

```bash
1. Build Upload:
   - Xcode > Product > Archive
   - Upload to App Store Connect
   - Select for release

2. App Review:
   - Submit for Review
   - Response time: 24-48 hours
   - Address any feedback

3. Release:
   - Manual release vs Automatic
   - Monitor crash reports
   - Track subscription metrics
```

---

## **📊 Analytics & Monitoring**

### **Key Metrics to Track**

```bash
Revenue Metrics:
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)  
- Customer Lifetime Value (LTV)
- Churn Rate

Conversion Metrics:
- Trial-to-paid conversion
- Paywall conversion rate
- Platform-specific performance
- Subscription tier popularity

Technical Metrics:
- Purchase success rate
- Restore success rate  
- StoreKit error rates
- RevenueCat webhook delivery
```

### **Monitoring Tools**

```bash
1. App Store Connect Analytics
2. RevenueCat Dashboard  
3. Firebase/Google Analytics
4. Crashlytics for error tracking
5. Custom analytics in app
```

---

## **🔐 Security Best Practices**

### **API Key Management**

```bash
# Environment Variables
REVENUECAT_IOS_API_KEY=your_ios_api_key_here
REVENUECAT_SHARED_SECRET=your_shared_secret_here

# Never commit API keys to repository
# Use Capacitor environment plugin
# Validate receipts server-side
```

### **Receipt Validation**

```bash
# Server-side validation recommended
POST https://buy.itunes.apple.com/verifyReceipt

Headers:
- Content-Type: application/json

Body:
{
  "receipt-data": "base64_receipt_data",
  "password": "your_shared_secret"
}
```

---

## **🛠️ Troubleshooting**

### **Common Issues**

```bash
❌ "Cannot connect to iTunes Store"
✅ Check network connection, try different Apple ID

❌ "This item is temporarily unavailable"  
✅ Verify product is approved in App Store Connect

❌ "Your purchase could not be completed"
✅ Check Apple ID payment method, try signing out/in

❌ StoreKit errors in development
✅ Use StoreKit Configuration file, check product IDs

❌ RevenueCat webhook not receiving events
✅ Verify webhook URL, check SSL certificate
```

### **Debug Commands**

```bash
# iOS Simulator logs
xcrun simctl spawn booted log stream --predicate 'subsystem contains "com.apple.StoreKit"'

# Device logs  
idevicesyslog | grep StoreKit

# RevenueCat debug
await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
```

---

## **📅 Launch Timeline**

### **Week 1-2: Setup**
- [ ] Apple Developer account verification
- [ ] App Store Connect app creation
- [ ] RevenueCat account setup
- [ ] Product configuration

### **Week 3-4: Development**  
- [ ] iOS billing service implementation
- [ ] StoreKit integration
- [ ] Testing framework setup
- [ ] Error handling implementation

### **Week 5-6: Testing**
- [ ] Simulator testing with StoreKit config
- [ ] Device testing with Sandbox Apple ID
- [ ] TestFlight beta testing
- [ ] Performance optimization

### **Week 7-8: Launch**
- [ ] App Store review submission
- [ ] Marketing preparation
- [ ] Production monitoring setup
- [ ] Launch day execution

---

## **💡 Advanced Features**

### **Promotional Offers**
```bash
# Introductory pricing
- Free trial: 7 days free
- Discount pricing: 50% off first year
- Pay up front: 3 months for price of 2
```

### **Family Sharing**
```bash
# Enable in App Store Connect
- Subscription Groups > Family Sharing: On
- Benefits shared across family members
- Primary subscriber manages subscription
```

### **Server-to-Server Notifications**
```bash
# App Store Connect > App Information > App Store Server Notifications
Endpoint: https://yourserver.com/apple-webhook
Events: Subscription events, billing issues, refunds
```

---

## **📞 Support Resources**

- **Apple Developer Documentation**: [StoreKit Documentation](https://developer.apple.com/documentation/storekit)
- **RevenueCat Documentation**: [iOS Implementation Guide](https://docs.revenuecat.com/docs/ios)  
- **WWDC Sessions**: StoreKit best practices
- **Apple Developer Forums**: Community support
- **RevenueCat Slack**: Real-time help

---

**🎉 آماده برای راه‌اندازی iOS App Store subscriptions هستید!** 