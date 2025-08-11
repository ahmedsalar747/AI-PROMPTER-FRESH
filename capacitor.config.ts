import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prompterfresh.app',
  appName: 'Prompter Fresh',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2563eb",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "default",
      backgroundColor: "#2563eb"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    App: {
      deepLinkingEnabled: true
    },
    // Google Play Billing - Product IDs must match Google Play Console exactly
    GooglePlayBilling: {
      productIds: [
        'com.prompterfresh.app.remove_ads',
        'com.prompterfresh.app.pro_plan_monthly',
        'com.prompterfresh.app.pro_plan_yearly'
      ]
    }
  }
};

export default config; 