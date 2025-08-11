# 🎨 Icon Replacement Guide - راهنمای جایگزینی ایکون‌ها

## 📁 **فایل‌های مورد نیاز:**

### **🌐 Web Application:**
```
public/
├── favicon.ico (32x32)
├── icon-192.png (192x192) 
├── icon-512.png (512x512)
└── manifest.json (آپدیت theme_color)
```

### **📱 iOS Application:**
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── AppIcon-512@2x.png (1024x1024)
└── Contents.json (آپدیت شده)
```

### **🤖 Android Application:**
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
├── mipmap-xxxhdpi/ic_launcher.png (192x192)
└── mipmap-*hdpi/ic_launcher_round.png (همه سایزها)
```

### **⚡ PWA Configuration:**
```
vite.config.ts:
├── pwa-192x192.png (192x192)
├── pwa-512x512.png (512x512)
└── theme_color: "#2563eb" (آبی ایکون)
```

## 🔧 **مراحل جایگزینی:**

### **مرحله 1: تبدیل ایکون به سایزهای مختلف**
```bash
# از ایکون 1024x1024 اصلی:
- 1024x1024 (iOS App Store)
- 512x512 (Web, PWA)
- 192x192 (Web, Android)
- 144x144 (Android xxhdpi)
- 96x96 (Android xhdpi)
- 72x72 (Android hdpi)
- 48x48 (Android mdpi)
- 32x32 (favicon)
```

### **مرحله 2: جایگزینی فایل‌ها**
```bash
# Web files
cp new-icon-192.png public/icon-192.png
cp new-icon-512.png public/icon-512.png
cp new-favicon.ico public/favicon.ico

# iOS files  
cp new-icon-1024.png ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png

# Android files
cp new-icon-48.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp new-icon-72.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp new-icon-96.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp new-icon-144.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp new-icon-192.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### **مرحله 3: آپدیت تنظیمات**
```bash
# آپدیت theme color در:
- vite.config.ts
- public/manifest.json
- android/app/src/main/res/values/colors.xml
- capacitor.config.ts
```

## 🎨 **Color Palette از ایکون:**
```css
Primary Blue: #2563eb
Secondary Blue: #3b82f6  
Accent Orange: #f59e0b
White: #ffffff
```

## 🛠️ **ابزارهای پیشنهادی:**

### **تبدیل سایز:**
- **Online**: realfavicongenerator.net
- **Desktop**: GIMP, Photoshop
- **CLI**: ImageMagick
```bash
# ImageMagick example:
convert icon-1024.png -resize 192x192 icon-192.png
```

### **تست کردن:**
```bash
# پس از جایگزینی:
npm run dev  # تست web
npm run android  # تست Android
npm run ios  # تست iOS
```

## ✅ **Checklist جایگزینی:**

- [ ] فایل‌های Web (public/) 
- [ ] فایل‌های iOS (Assets.xcassets/)
- [ ] فایل‌های Android (mipmap-*/)
- [ ] فایل‌های PWA (vite.config.ts)
- [ ] آپدیت theme colors
- [ ] تست در تمام پلتفرم‌ها
- [ ] Clear cache browser/device
- [ ] تست در سایزهای مختلف

## 🚀 **نتیجه نهایی:**
پس از جایگزینی، ایکون جدید در تمام جاها نمایش داده می‌شود:
- 🌐 Web browser (favicon, PWA)
- 📱 iOS app (home screen, app store)
- 🤖 Android app (home screen, play store)
- 💻 Desktop PWA (taskbar, dock) 