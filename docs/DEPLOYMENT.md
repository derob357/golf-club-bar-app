# Deployment Guide

Complete guide for deploying the Golf Club Bar Management App to iOS App Store and Google Play Store.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [iOS Deployment](#ios-deployment)
3. [Android Deployment](#android-deployment)
4. [Testing](#testing)
5. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### Code Preparation

- [ ] Update version numbers
  - `package.json`: Update version
  - iOS: `ios/GolfClubBar/Info.plist` - CFBundleShortVersionString
  - Android: `android/app/build.gradle` - versionName and versionCode

- [ ] Environment Configuration
  - [ ] Update Firebase configuration for production
  - [ ] Remove all console.logs (or use proper logging)
  - [ ] Disable debug mode
  - [ ] Update API endpoints to production

- [ ] Code Quality
  - [ ] Run linter: `npm run lint`
  - [ ] Fix all warnings
  - [ ] Test on multiple devices
  - [ ] Test on different screen sizes

- [ ] Assets
  - [ ] App icons (all sizes)
  - [ ] Splash screens
  - [ ] Screenshots for store listings
  - [ ] Promotional graphics

---

## iOS Deployment

### Prerequisites

- Apple Developer Account ($99/year)
- Mac with Xcode installed
- Valid certificates and provisioning profiles

### Step 1: Configure App in Xcode

```bash
cd ios
open GolfClubBar.xcworkspace
```

1. **Update Bundle Identifier**
   - Select project in navigator
   - Select target
   - General → Bundle Identifier: `com.golfclub.barapp`

2. **Update Display Name**
   - General → Display Name: `Golf Club Bar`

3. **Set Version and Build Number**
   - General → Version: `1.0.0`
   - General → Build: `1`

4. **Configure Signing**
   - Signing & Capabilities
   - Team: Select your team
   - Enable "Automatically manage signing"

### Step 2: Configure Capabilities

1. **Add Push Notifications**
   - Signing & Capabilities → + Capability
   - Add "Push Notifications"

2. **Add Background Modes** (if using background tasks)
   - Add "Background Modes"
   - Check "Remote notifications"

### Step 3: Update Info.plist

```xml
<key>CFBundleDisplayName</key>
<string>Golf Club Bar</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>NSCameraUsageDescription</key>
<string>This app requires camera access for scanning QR codes</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app requires photo library access to save receipts</string>
```

### Step 4: Build and Archive

1. **Select Scheme**
   - Product → Scheme → Edit Scheme
   - Run → Build Configuration → Release

2. **Archive**
   - Product → Archive
   - Wait for archive to complete

3. **Distribute**
   - Window → Organizer
   - Select archive
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow prompts

### Step 5: App Store Connect Setup

1. **Create App**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - My Apps → + → New App
   - Platform: iOS
   - Name: Golf Club Bar Management
   - Primary Language: English
   - Bundle ID: com.golfclub.barapp
   - SKU: GolfClubBar001

2. **App Information**
   - Privacy Policy URL
   - Category: Business
   - Subcategory: Restaurant/Bar

3. **Pricing and Availability**
   - Price: Free
   - Availability: Select countries

4. **Prepare for Submission**
   - Screenshots (all required sizes):
     - 6.5" Display (1242 x 2688)
     - 5.5" Display (1242 x 2208)
     - iPad Pro (2048 x 2732)
   - App Preview videos (optional)
   - Description
   - Keywords
   - Support URL
   - Marketing URL

5. **Build**
   - Select the uploaded build
   - Export Compliance: No encryption

6. **Submit for Review**

### iOS Build Commands

```bash
# Clean build
cd ios
rm -rf build
rm -rf Pods
pod install

# Build for device
cd ..
npx react-native run-ios --configuration Release --device

# Create IPA
xcodebuild -workspace ios/GolfClubBar.xcworkspace \
  -scheme GolfClubBar \
  -configuration Release \
  -archivePath ./build/GolfClubBar.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/GolfClubBar.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```

---

## Android Deployment

### Prerequisites

- Google Play Console Account ($25 one-time fee)
- Android Studio
- Signing key

### Step 1: Generate Signing Key

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore golfclub-release.keystore \
  -alias golfclub-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

**Save the password securely!**

### Step 2: Configure Gradle

**android/gradle.properties**
```properties
MYAPP_RELEASE_STORE_FILE=golfclub-release.keystore
MYAPP_RELEASE_KEY_ALIAS=golfclub-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

**Add to .gitignore:**
```
android/app/golfclub-release.keystore
```

**android/app/build.gradle**
```gradle
android {
    ...
    defaultConfig {
        applicationId "com.golfclub.barapp"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
    
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Update AndroidManifest.xml

**android/app/src/main/AndroidManifest.xml**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.golfclub.barapp">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
      
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

### Step 4: Build APK/AAB

**Build APK (for testing):**
```bash
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

**Build AAB (for Play Store):**
```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Step 5: Google Play Console Setup

1. **Create Application**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create app
   - App name: Golf Club Bar Management
   - Default language: English
   - App or game: App
   - Free or paid: Free

2. **Store Listing**
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots:
     - Phone: 2-8 screenshots (16:9 or 9:16 ratio)
     - 7" Tablet: 1-8 screenshots
     - 10" Tablet: 1-8 screenshots
   - Feature graphic: 1024 x 500
   - App icon: 512 x 512

3. **Content Rating**
   - Complete questionnaire
   - Select "Business" category

4. **Target Audience**
   - Target age group: 21+
   - Alcohol content: Yes

5. **App Content**
   - Privacy policy URL
   - Data safety form
   - Government apps: No

6. **Release**
   - Production → Create new release
   - Upload AAB file
   - Release name: 1.0.0
   - Release notes
   - Save and review
   - Start rollout to production

---

## Testing

### iOS Testing

**TestFlight**
1. Upload build via Xcode
2. App Store Connect → TestFlight
3. Add internal testers
4. Distribute build
5. Testers receive email invitation

**Test Checklist:**
- [ ] Login/Signup flow
- [ ] Member lookup (4-digit ID)
- [ ] Add drinks to cart
- [ ] Complete order
- [ ] View reports (manager)
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Different device sizes

### Android Testing

**Internal Testing Track**
1. Play Console → Testing → Internal testing
2. Create release
3. Upload AAB
4. Add testers (email addresses)
5. Save and publish

**Test Checklist:**
- [ ] Login/Signup flow
- [ ] Member lookup
- [ ] Cart functionality
- [ ] Order completion
- [ ] Reports generation
- [ ] Notifications
- [ ] Different screen sizes
- [ ] Tablet layout

---

## Post-Deployment

### Monitoring

**Firebase Crashlytics**
```bash
npm install @react-native-firebase/crashlytics
```

**Setup Analytics**
```javascript
import analytics from '@react-native-firebase/analytics';

// Log events
await analytics().logEvent('order_completed', {
  total: orderTotal,
  items: itemCount,
});
```

### App Store Optimization (ASO)

**Keywords Research:**
- Golf club management
- Bar ordering system
- Member management
- POS system
- Golf course bar

**Monitor Metrics:**
- Downloads
- Ratings and reviews
- Retention rate
- Crash-free rate
- Active users

### Version Updates

**Semantic Versioning:**
- MAJOR.MINOR.PATCH (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

**Update Process:**
1. Increment version numbers
2. Update changelogs
3. Build and test
4. Submit to stores
5. Monitor rollout

### Marketing

**Launch Checklist:**
- [ ] Press release
- [ ] Social media announcement
- [ ] Email to existing members
- [ ] In-club signage
- [ ] Staff training
- [ ] Demo videos
- [ ] User documentation

---

## Troubleshooting

### iOS Issues

**Archive fails:**
- Clean build folder: Product → Clean Build Folder
- Update Podfile.lock: `cd ios && pod update`
- Check signing certificates

**Upload to App Store fails:**
- Verify App Store Connect credentials
- Check bundle identifier matches
- Ensure all required icons are present

### Android Issues

**Build fails:**
```bash
cd android
./gradlew clean
rm -rf ~/.gradle/caches/
./gradlew assembleRelease
```

**Signing issues:**
- Verify keystore path in gradle.properties
- Check passwords are correct
- Ensure keystore file is not in .gitignore

---

## Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [React Native Publishing](https://reactnative.dev/docs/publishing-to-app-store)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)

---

## Rollback Plan

If issues occur after deployment:

### iOS
1. App Store Connect → My Apps
2. Select version
3. Remove from sale (temporary)
4. Or: Submit new version with fixes

### Android
1. Play Console → Production
2. Stop rollout
3. Or: Create new release with fixes
4. Gradual rollout: 1% → 5% → 10% → 50% → 100%
