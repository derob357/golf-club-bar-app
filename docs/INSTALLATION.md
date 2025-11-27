# Installation Guide

Complete step-by-step installation guide for the Golf Club Bar Management App.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** or **Yarn**
   - Comes with Node.js
   - Verify: `npm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

### For iOS Development

4. **Xcode** (macOS only)
   - Download from Mac App Store
   - Version 14.0 or higher
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

5. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

### For Android Development

6. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API level 31+)
   - Set up environment variables:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

7. **Java Development Kit (JDK)**
   - JDK 11 or higher
   - Verify: `java -version`

---

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/golf-club-bar-app.git
cd golf-club-bar-app
```

Or if starting from scratch with the files:
```bash
cd /Users/drob/Documents/DHGC
```

---

### Step 2: Install Dependencies

```bash
npm install
```

Or with Yarn:
```bash
yarn install
```

This will install all required packages including:
- React Native
- Firebase SDK
- React Navigation
- React Native Paper
- And all other dependencies

---

### Step 3: iOS Setup (macOS only)

#### Install iOS Pods

```bash
cd ios
pod install
cd ..
```

If you encounter issues:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### Configure Firebase for iOS

1. Go to Firebase Console
2. Add iOS app to your project
3. Download `GoogleService-Info.plist`
4. Place it in `ios/GolfClubBar/`
5. Open Xcode:
   ```bash
   open ios/GolfClubBar.xcworkspace
   ```
6. Drag `GoogleService-Info.plist` into the project (check "Copy items if needed")

---

### Step 4: Android Setup

#### Configure Firebase for Android

1. Go to Firebase Console
2. Add Android app to your project
3. Download `google-services.json`
4. Place it in `android/app/`

#### Update Gradle (if needed)

**android/build.gradle**
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

**android/app/build.gradle**
```gradle
apply plugin: 'com.google.gms.google-services'
```

---

### Step 5: Configure Environment

Create `.env` file in project root:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# App Configuration
APP_ENV=development
API_URL=https://your-api.com
```

Update `src/config/firebase.js` with your Firebase credentials.

---

### Step 6: Initialize Firebase

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database (Test mode for development)
4. Follow instructions in `docs/FIREBASE_SETUP.md`

---

### Step 7: Run the App

#### iOS

```bash
# Run on simulator
npx react-native run-ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"

# Run on physical device
npx react-native run-ios --device "Your iPhone Name"
```

#### Android

```bash
# Start Metro bundler (in one terminal)
npm start

# Run on emulator (in another terminal)
npx react-native run-android

# Or run on physical device (with USB debugging enabled)
npx react-native run-android --deviceId=your_device_id
```

---

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues

**Clear cache:**
```bash
npm start -- --reset-cache
```

**or**
```bash
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf node_modules
npm install
```

#### 2. iOS Build Fails

**Clean build:**
```bash
cd ios
rm -rf build
xcodebuild clean
pod deintegrate
pod install
cd ..
```

**Reset Metro:**
```bash
watchman watch-del-all
rm -rf /tmp/metro-*
```

#### 3. Android Build Fails

**Clean gradle:**
```bash
cd android
./gradlew clean
cd ..
```

**Delete build folders:**
```bash
rm -rf android/app/build
rm -rf android/build
```

#### 4. Firebase Issues

**iOS: GoogleService-Info.plist not found**
- Ensure file is in `ios/GolfClubBar/`
- Rebuild: `cd ios && pod install && cd ..`

**Android: google-services.json not found**
- Ensure file is in `android/app/`
- Rebuild: `cd android && ./gradlew clean && cd ..`

#### 5. Permission Errors

**iOS: Camera/Photos permissions**
- Update `Info.plist` with usage descriptions

**Android: Runtime permissions**
- Check `AndroidManifest.xml` has required permissions

---

## Verification

After installation, verify everything works:

### 1. Check Dependencies
```bash
npm list react-native
npm list @react-native-firebase/app
```

### 2. Test Metro Bundler
```bash
npm start
```
Should start without errors

### 3. Test iOS Build
```bash
npx react-native run-ios
```
App should launch in simulator

### 4. Test Android Build
```bash
npx react-native run-android
```
App should launch in emulator

### 5. Test Firebase Connection
- Launch app
- Try to sign up/login
- Check Firebase Console for new user

---

## Development Setup

### VS Code Extensions (Recommended)

Install these extensions for better development experience:

- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Firebase Explorer
- GitLens

### Enable Hot Reload

In-app developer menu (⌘D on iOS, ⌘M on Android):
- Enable Fast Refresh
- Enable Live Reload

---

## Database Initialization

### Load Initial Data

1. **Create Sample Members**
   ```bash
   # Use Firebase Console or run initialization script
   node scripts/initializeData.js
   ```

2. **Load Inventory**
   - Data is already in `src/constants/drinks.js`
   - Import to Firestore using Firebase Console

3. **Create Test User**
   - Go to Firebase Console → Authentication
   - Add user manually or use signup in app

---

## Optional Setup

### Analytics

```bash
npm install @react-native-firebase/analytics
cd ios && pod install && cd ..
```

### Crashlytics

```bash
npm install @react-native-firebase/crashlytics
cd ios && pod install && cd ..
```

### Performance Monitoring

```bash
npm install @react-native-firebase/perf
cd ios && pod install && cd ..
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Building for Production

### iOS

```bash
# Archive in Xcode
# Product → Archive
```

### Android

```bash
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

See `docs/DEPLOYMENT.md` for complete deployment guide.

---

## Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update React Native
npx react-native upgrade

# Update iOS Pods
cd ios
pod update
cd ..
```

---

## Uninstall

### Remove from Device

**iOS:**
- Long press app icon → Remove App

**Android:**
```bash
adb uninstall com.golfclub.barapp
```

### Clean Project

```bash
# Remove dependencies
rm -rf node_modules
rm package-lock.json

# Remove iOS
cd ios
rm -rf Pods Podfile.lock
cd ..

# Remove Android
rm -rf android/app/build
rm -rf android/build
```

---

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs:
   - iOS: Xcode Console
   - Android: `adb logcat`
3. Check React Native documentation: https://reactnative.dev/
4. Check Firebase documentation: https://firebase.google.com/docs
5. Open an issue on GitHub

---

## Next Steps

After successful installation:

1. Review `README.md` for project overview
2. Read `docs/FIREBASE_SETUP.md` for Firebase configuration
3. Explore `docs/USER_ENGAGEMENT.md` for engagement features
4. Check `docs/API_DOCUMENTATION.md` for API reference
5. Start developing! 🚀
