# Local Development Setup Guide
**Platform:** macOS  
**Last Updated:** November 26, 2025

---

## 📋 Prerequisites

Before you can run this project on your Mac, you need to install several tools.

### 1. **Install Homebrew** (if not already installed)

```bash
# Check if Homebrew is installed
brew --version

# If not installed, run:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. **Install Node.js** (v18 or higher)

```bash
# Check current version
node --version

# Install Node.js via Homebrew
brew install node

# Verify installation
node --version  # Should show v18 or higher
npm --version   # Should show v9 or higher
```

### 3. **Install Watchman** (file watcher for React Native)

```bash
brew install watchman
```

### 4. **Install Xcode** (for iOS development)

1. Open the Mac App Store
2. Search for "Xcode"
3. Click "Get" or "Install" (it's large ~15GB)
4. After installation, open Xcode once to agree to the license
5. Install Xcode Command Line Tools:

```bash
xcode-select --install
```

### 5. **Install CocoaPods** (iOS dependency manager)

```bash
# Check if installed
pod --version

# If not installed, run:
sudo gem install cocoapods

# Verify installation
pod --version  # Should show 1.12+ or higher
```

### 6. **Install Android Studio** (for Android development - Optional)

1. Download from: https://developer.android.com/studio
2. Run the installer
3. Open Android Studio and complete the setup wizard
4. Install Android SDK (API level 33 or higher)
5. Set up environment variables in `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 🚀 Setting Up the Project

### Step 1: Clone the Repository

If you haven't already:

```bash
git clone https://github.com/derob357/golf-club-bar-app.git
cd golf-club-bar-app
```

Or if you're already in the project directory (`/Users/drob/Documents/DHGC`), skip this step.

### Step 2: Install Node Dependencies

```bash
npm install
```

This will install all JavaScript dependencies listed in `package.json`.

**Expected time:** 2-5 minutes

### Step 3: Install iOS Dependencies (CocoaPods)

```bash
cd ios
pod install
cd ..
```

**What this does:**
- `cd ios` - Enters the iOS native code directory
- `pod install` - Downloads and links iOS native libraries (Firebase, navigation, etc.)
- `cd ..` - Returns to project root

**Expected time:** 3-7 minutes (first time)

**Common Issues:**
- If you get "command not found: pod", install CocoaPods (see Prerequisites #5)
- If you get permission errors, try: `sudo gem install cocoapods`

---

## ▶️ Running the Project

### Option A: Run on iOS Simulator (Recommended for Mac)

#### **Quick Start:**

```bash
npm run ios
```

This will:
1. Start the Metro bundler (JavaScript packager)
2. Build the iOS app
3. Launch the iOS Simulator
4. Install and run the app

**Expected time:** 3-5 minutes (first build)

#### **Choose Specific iPhone Model:**

```bash
# iPhone 15 Pro
npm run ios -- --simulator="iPhone 15 Pro"

# iPhone 14
npm run ios -- --simulator="iPhone 14"

# iPad Air
npm run ios -- --simulator="iPad Air (5th generation)"

# List all available simulators
xcrun simctl list devices
```

#### **Using Xcode (Alternative Method):**

1. Open the project in Xcode:
```bash
open ios/DHGC.xcworkspace
```
⚠️ **Important:** Open the `.xcworkspace` file, NOT the `.xcodeproj` file!

2. Select a simulator from the device menu (top left)
3. Click the "Play" button (▶️) or press `Cmd + R`

### Option B: Run on Physical iPhone

1. Connect your iPhone via USB
2. Open Xcode:
```bash
open ios/DHGC.xcworkspace
```
3. Select your iPhone from device menu
4. Click "Play" (▶️) or press `Cmd + R`

**Note:** First time requires:
- Apple ID signing (free for development)
- Trusting the developer certificate on your iPhone
- Settings → General → VPN & Device Management → Trust

### Option C: Run on Android Emulator

#### **Start Android Emulator:**

```bash
# Open Android Studio and start an emulator
# Or from command line:
emulator -avd Pixel_5_API_33
```

#### **Run the app:**

```bash
npm run android
```

**Expected time:** 5-10 minutes (first build)

---

## 🔧 Development Workflow

### Start Metro Bundler Manually

If you want to start the JavaScript bundler separately:

```bash
npm start
```

Then in another terminal:

```bash
# For iOS
npm run ios

# For Android
npm run android
```

### Clear Cache (if things break)

```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# Or clear everything
watchman watch-del-all
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

### Hot Reload

- **iOS/Android:** Press `Cmd + D` (iOS) or `Cmd + M` (Android) to open developer menu
- Select "Enable Fast Refresh" for automatic reloading on code changes

---

## 🔥 Firebase Configuration (Required)

**Before the app will work, you MUST configure Firebase:**

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Follow the setup wizard

### Step 2: Add iOS App

1. In Firebase Console, click "Add app" → iOS
2. iOS bundle ID: `com.golfclubbar.app` (or your custom bundle ID)
3. Download `GoogleService-Info.plist`
4. Place it here: `ios/DHGC/GoogleService-Info.plist`

### Step 3: Add Android App (if needed)

1. Click "Add app" → Android
2. Android package name: `com.golfclubbar.app`
3. Download `google-services.json`
4. Place it here: `android/app/google-services.json`

### Step 4: Enable Firebase Services

In Firebase Console:
1. **Authentication** → Enable Email/Password
2. **Firestore Database** → Create database (start in test mode)
3. **Storage** → Enable (for PDF reports)
4. **Cloud Messaging** → Enable (for notifications)

**See `docs/FIREBASE_SETUP.md` for detailed instructions**

---

## 📱 Testing the App Locally

### 1. **Start the App**

```bash
npm run ios
```

### 2. **Test Basic Flow**

- App should show login screen
- Try signing up with test credentials
- After Firebase is configured, login should work

### 3. **Test Without Firebase**

The app will show errors without Firebase configuration. To test UI only:
- Comment out Firebase initialization in `src/config/firebase.js`
- UI components will still render

---

## 🐛 Common Issues & Solutions

### Issue: "pod install" fails

**Solution:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clean and reinstall
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Issue: "Metro bundler already running"

**Solution:**
```bash
# Kill existing Metro process
killall -9 node

# Or find and kill specific process
lsof -i :8081  # Find process using port 8081
kill -9 <PID>  # Kill that process

# Restart
npm start
```

### Issue: Build fails in Xcode

**Solution:**
```bash
# Clean build folder in Xcode
# Product → Clean Build Folder (Cmd + Shift + K)

# Or from terminal:
cd ios
xcodebuild clean
cd ..
```

### Issue: "Unable to resolve module"

**Solution:**
```bash
# Reset cache
npm start -- --reset-cache
```

### Issue: iOS app crashes on launch

**Solution:**
1. Check Firebase config files are present
2. Check Bundle ID matches Firebase
3. Rebuild:
```bash
cd ios
pod install
cd ..
npm run ios
```

### Issue: Android emulator not found

**Solution:**
```bash
# List available emulators
emulator -list-avds

# Create new emulator in Android Studio
# Tools → Device Manager → Create Device
```

---

## 📊 Performance Tips

### Faster Builds

1. **Use Hermes** (JavaScript engine - already enabled)
2. **Enable New Architecture** (optional, experimental):
   - Edit `ios/Podfile`
   - Set `newArchEnabled` to `true`
3. **Close unused apps** - Xcode uses a lot of RAM

### Faster Metro Bundler

```bash
# Use SSD for node_modules (if possible)
# Exclude node_modules from antivirus scanning
```

---

## 🔍 Verifying Installation

Run this checklist to ensure everything is set up:

```bash
# Check Node.js
node --version  # Should be v18+

# Check npm
npm --version  # Should be v9+

# Check Watchman
watchman --version

# Check Xcode
xcodebuild -version

# Check CocoaPods
pod --version  # Should be v1.12+

# Check if dependencies are installed
ls node_modules  # Should have many folders

# Check iOS dependencies
ls ios/Pods  # Should have many folders

# Check Metro bundler can start
npm start  # Should start without errors
```

---

## 📖 Additional Resources

- **React Native Docs:** https://reactnative.dev/docs/environment-setup
- **Firebase Setup:** See `docs/FIREBASE_SETUP.md`
- **Troubleshooting:** See `docs/INSTALLATION.md`
- **API Documentation:** See `docs/API_DOCUMENTATION.md`

---

## 🎯 Quick Reference Commands

```bash
# Install dependencies
npm install
cd ios && pod install && cd ..

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Start Metro bundler only
npm start

# Clear cache and restart
npm start -- --reset-cache

# Run on specific iPhone model
npm run ios -- --simulator="iPhone 15 Pro"

# Check for errors
npm run lint

# Run tests
npm test

# Clean everything
rm -rf node_modules ios/Pods package-lock.json ios/Podfile.lock
npm install
cd ios && pod install && cd ..
```

---

## ✅ Success Checklist

- [ ] Homebrew installed
- [ ] Node.js v18+ installed
- [ ] Watchman installed
- [ ] Xcode installed and licensed
- [ ] CocoaPods installed
- [ ] Node modules installed (`npm install`)
- [ ] iOS pods installed (`pod install`)
- [ ] Firebase project created
- [ ] Firebase config files added
- [ ] App runs on iOS simulator
- [ ] Login screen appears

---

## 🆘 Getting Help

If you're stuck:

1. Check `docs/INSTALLATION.md` for detailed troubleshooting
2. Check Firebase setup in `docs/FIREBASE_SETUP.md`
3. Create an issue on GitHub with error details
4. Include console output and error screenshots

---

## 🎉 You're Ready!

Once you've completed the setup, you should see:
- App running in iOS Simulator
- Login screen displayed
- No red error screens
- Metro bundler running without errors

**Next Steps:**
1. Configure Firebase (required for login/data)
2. Load sample data
3. Start developing!

---

*Last Updated: November 26, 2025*  
*For macOS users*
