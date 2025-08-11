# Google Play Billing Setup Guide

This guide explains how to set up Google Play Billing for in-app purchases and subscriptions in your PromptCraft application.

## 🔧 Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Google Play Billing Configuration
VITE_GOOGLE_PLAY_PACKAGE_NAME=com.promptcraft.app
VITE_GOOGLE_PLAY_SERVICE_KEY=your_service_account_key_here
VITE_GOOGLE_PLAY_PUBLIC_KEY=your_public_key_here
VITE_GOOGLE_PLAY_OBFUSCATED_ID=your_obfuscated_account_id
VITE_GOOGLE_PLAY_PROFILE_ID=your_obfuscated_profile_id
VITE_GOOGLE_PLAY_VERIFY_URL=http://localhost:5000/api/billing/verify
```

### Google Play Console Setup

1. **Create App in Google Play Console**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create a new app or select existing app
   - Note down your package name (e.g., `com.promptcraft.app`)

2. **Configure In-App Products**:
   - Go to "Monetization" → "Products" → "In-app products"
   - Create the following products:
     - `remove_ads_lifetime` - Remove Ads (Lifetime) - $4.99
     - `tokens_1000_pack` - 1,000 Tokens Pack - $1.99
     - `tokens_5000_pack` - 5,000 Tokens Pack - $7.99
     - `tokens_10000_pack` - 10,000 Tokens Pack - $14.99

3. **Configure Subscriptions**:
   - Go to "Monetization" → "Products" → "Subscriptions"
   - Create the following subscriptions:
     - `pro_monthly_subscription` - Pro Monthly - $9.99/month
     - `pro_yearly_subscription` - Pro Yearly - $99.99/year

4. **Set up Service Account**:
   - Go to "Setup" → "API access"
   - Create or link a service account
   - Download the service account key (JSON)
   - Grant "Finance" permissions to the service account

5. **Get License Key**:
   - Go to "Setup" → "Licensing"
   - Copy your app's license key (Base64 encoded RSA public key)

## 📱 Mobile App Integration

### Capacitor Plugin

Install the Capacitor Google Play Billing plugin:

```bash
npm install @capawesome/capacitor-google-play-billing
npx cap sync
```

### Android Configuration

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

### iOS Configuration (if supporting iOS)

Google Play Billing is Android-only. For iOS, you'll need Apple's In-App Purchase system.

## 🔐 Security Setup

### Server-Side Verification

The backend should verify purchases server-side using Google Play Developer API:

1. **Setup Google Cloud Project**:
   - Enable Google Play Developer API
   - Create service account with proper permissions
   - Download service account key

2. **Backend Verification Endpoint**:
```typescript
   // Example backend verification
   app.post('/api/billing/verify-android', async (req, res) => {
     const { packageName, productId, purchaseToken, signature, originalJson } = req.body;
     
     // Verify signature using your app's license key
     const isValid = verifySignature(originalJson, signature, LICENSE_KEY);
     
     if (isValid) {
       // Additional server-side verification with Google Play API
       const verificationResult = await verifyWithGooglePlay(
         packageName, 
         productId, 
         purchaseToken
       );
       
       if (verificationResult.valid) {
         // Update user's subscription/purchase status
         await updateUserPurchase(userId, productId, purchaseToken);
         res.json({ success: true });
       }
     }
     
     res.status(400).json({ success: false });
   });
   ```

## 🧪 Testing

### Testing in Development

1. **Mock Mode**: Set `VITE_MOCK_MODE=true` for development testing without real purchases
2. **Test Products**: Google Play Console provides test products for development
3. **Test Accounts**: Add test Gmail accounts in Google Play Console

### Testing Flow

1. Build and upload APK to Google Play Console (Internal Testing)
2. Add test users to internal testing track
3. Install app from Play Store on test device
4. Test purchase flows with test accounts

## 📊 Available Products & Subscriptions

### In-App Products
- **Remove Ads**: `remove_ads_lifetime` - $4.99 (one-time)
- **1K Tokens**: `tokens_1000_pack` - $1.99 (one-time)
- **5K Tokens**: `tokens_5000_pack` - $7.99 (one-time, 20% bonus)
- **10K Tokens**: `tokens_10000_pack` - $14.99 (one-time, 30% bonus)

### Subscriptions
- **Pro Monthly**: `pro_monthly_subscription` - $9.99/month
- **Pro Yearly**: `pro_yearly_subscription` - $99.99/year (2 months free)

## 🔄 Implementation Details

### Key Features Implemented

1. **Product Management**: Automatic loading of available products
2. **Purchase Flow**: Complete purchase handling with verification
3. **Subscription Management**: Support for recurring subscriptions
4. **Receipt Verification**: Server-side verification for security
5. **Error Handling**: Comprehensive error handling and user feedback
6. **Mock Mode**: Development-friendly mock implementation

### Code Structure

- `GooglePlayBillingService.ts`: Main billing service
- `PaymentService.ts`: Unified payment interface
- `PaymentModal.tsx`: UI for payment selection
- `Pricing.tsx`: Pricing page with Google Play integration

## 🚀 Production Deployment

### Before Going Live

1. **Upload Signed APK**: Upload production-signed APK to Google Play Console
2. **Configure Products**: Ensure all products are active and properly priced
3. **Test Thoroughly**: Test all purchase flows with test accounts
4. **Server Setup**: Ensure backend verification is properly configured
5. **Security Review**: Review all security implementations

### Environment Variables for Production

```bash
# Production Configuration
NODE_ENV=production
VITE_MOCK_MODE=false
VITE_GOOGLE_PLAY_PACKAGE_NAME=com.yourcompany.promptcraft
VITE_GOOGLE_PLAY_SERVICE_KEY=your_production_service_key
VITE_GOOGLE_PLAY_VERIFY_URL=https://yourapi.com/api/billing/verify
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Item not available"**: Product not properly configured in Google Play Console
2. **"Developer Error"**: Wrong package name or signing certificate
3. **"Service Unavailable"**: Network issues or Google Play Services problems
4. **"User Canceled"**: Normal user cancellation, handle gracefully

### Debug Steps

1. Check package name matches exactly
2. Verify products are active in Google Play Console
3. Ensure app is signed with correct certificate
4. Test with valid test accounts
5. Check server-side verification logs

## 📚 Additional Resources

- [Google Play Billing Documentation](https://developer.android.com/google/play/billing)
- [Capacitor Google Play Billing Plugin](https://github.com/capawesome-team/capacitor-google-play-billing)
- [Google Play Console](https://play.google.com/console)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Note**: Google Play Billing is only available for Android apps distributed through Google Play Store. For iOS, you'll need to implement Apple's In-App Purchase system separately. 