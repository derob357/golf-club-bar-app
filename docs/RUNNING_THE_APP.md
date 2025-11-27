# Running the Project - Simple Visual Guide

## 🎯 What You Need to Understand

### The Command Explained:

```bash
cd ios && pod install && cd ..
```

Is actually **three commands** chained together:

```
┌──────────────────────────────────────────────────┐
│  cd ios          →    Go INTO the ios folder     │
│  &&              →    Then (if successful)       │
│  pod install     →    Install iOS dependencies   │
│  &&              →    Then (if successful)       │
│  cd ..           →    Go BACK to parent folder   │
└──────────────────────────────────────────────────┘
```

### Why You Need This:

```
Your Project
├── 📁 ios/                  ← Native iOS code
│   ├── Podfile              ← Lists what iOS libraries you need
│   └── Pods/                ← Where libraries are installed (created by pod install)
├── 📁 android/              ← Native Android code
├── 📁 src/                  ← Your JavaScript code
└── 📄 package.json          ← Lists what JavaScript libraries you need
```

**Think of it like this:**
- `npm install` → Downloads JavaScript stuff
- `pod install` → Downloads iOS native stuff (like Firebase)

---

## 🚀 Step-by-Step: Running on Your Mac

### Starting from Scratch

```bash
# 1. Open Terminal
# (Applications → Utilities → Terminal)

# 2. Navigate to your project
cd /Users/drob/Documents/DHGC

# 3. Install JavaScript dependencies
npm install
# ⏱️ Takes: 2-3 minutes

# 4. Install iOS dependencies
cd ios
pod install
cd ..
# ⏱️ Takes: 3-5 minutes

# 5. Run the app!
npm run ios
# ⏱️ First time: 3-5 minutes
# ⏱️ After that: 30 seconds
```

---

## 📱 What Happens When You Run

### Visual Flow:

```
You type: npm run ios
         ↓
┌────────────────────────────────┐
│ 1. Metro Bundler Starts        │ ← JavaScript packager
│    Port 8081                    │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 2. Xcode Builds App            │ ← Compiles native code
│    (First time is slow)        │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 3. iOS Simulator Opens         │ ← Virtual iPhone
│    Looks like a real iPhone    │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 4. App Installs & Launches     │ ← You see your app!
│    Login screen appears         │
└────────────────────────────────┘
```

---

## 🖥️ Your Terminal Will Look Like This:

### When you run `npm run ios`:

```
$ npm run ios

> golf-club-bar-app@1.0.0 ios
> react-native run-ios

info Found Xcode workspace "DHGC.xcworkspace"
info Building...
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░ 60%

(Wait 3-5 minutes first time...)

success Successfully built the app
info Installing the app...
info Launching iPhone 15...
✔ App launched successfully!
```

### New Window Opens:

```
┌─────────────────────────────────┐
│  Metro Bundler                  │
│  Loading...████████░░░░ 80%     │
│                                 │
│  http://localhost:8081          │
└─────────────────────────────────┘
```

### iOS Simulator Opens:

```
     ┌──────────────┐
     │ 📱 iPhone    │
     │              │
     │  ┌────────┐  │
     │  │ DHGC   │  │
     │  │  🏌️    │  │
     │  └────────┘  │
     │              │
     │  [Login]     │
     │              │
     └──────────────┘
```

---

## 🔧 Common Scenarios

### Scenario 1: First Time Setup

```bash
# You're in: /Users/drob/Documents/DHGC

# Step 1: Install JavaScript stuff
npm install

# Step 2: Go to iOS folder
cd ios

# Step 3: Install iOS stuff
pod install

# You should see:
# Installing Firebase (9.6.0)
# Installing RNGestureHandler (2.29.1)
# ...
# Pod installation complete! 25 pods installed.

# Step 4: Go back
cd ..

# Step 5: Run!
npm run ios
```

### Scenario 2: You Already Ran It Before

```bash
# Just this:
npm run ios

# That's it! Much faster now (30 seconds)
```

### Scenario 3: Something Changed (new dependencies)

```bash
# Reinstall everything
npm install
cd ios && pod install && cd ..
npm run ios
```

---

## 🐛 If Something Goes Wrong

### Error: "pod: command not found"

**Fix:**
```bash
sudo gem install cocoapods
```

### Error: "Metro bundler already running"

**Fix:**
```bash
# Kill it
killall -9 node

# Restart
npm run ios
```

### Error: Build fails

**Fix:**
```bash
# Clean everything
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

### Error: Can't find Xcode

**Fix:**
1. Install Xcode from Mac App Store
2. Open it once
3. Agree to license
4. Try again

---

## 📍 Where Are You in the Terminal?

### Check your location:

```bash
pwd
# Shows: /Users/drob/Documents/DHGC
```

### Your project structure:

```
/Users/drob/Documents/DHGC/     ← You start here
├── ios/                         ← cd ios takes you here
│   ├── Podfile
│   └── DHGC.xcworkspace
├── android/
├── src/
└── package.json
```

### Navigation commands:

```bash
pwd           # Where am I?
ls            # What's in this folder?
cd ios        # Go into ios folder
cd ..         # Go back to parent folder
cd ~          # Go to home folder
```

---

## 🎯 Quick Reference Card

### Essential Commands:

| Command | What It Does | When To Use |
|---------|-------------|-------------|
| `npm install` | Install JavaScript dependencies | First time, after pulling updates |
| `cd ios && pod install && cd ..` | Install iOS dependencies | First time, after pulling updates |
| `npm run ios` | Run app on iPhone Simulator | Every time you want to run the app |
| `npm run android` | Run app on Android Emulator | If you have Android setup |
| `npm start` | Start Metro bundler only | If you want to start bundler separately |

### Keyboard Shortcuts in Simulator:

| Shortcut | Action |
|----------|--------|
| `Cmd + D` | Open developer menu |
| `Cmd + R` | Reload app |
| `Cmd + K` | Toggle keyboard |
| `Cmd + Shift + H` | Go to home screen |

---

## ✅ Success Looks Like:

### You know it's working when:

1. ✅ Terminal shows "success Successfully built the app"
2. ✅ iOS Simulator window opens
3. ✅ You see a virtual iPhone
4. ✅ App launches and shows login screen
5. ✅ No red error screens
6. ✅ Metro bundler shows "Loading..." then 100%

### Console output should end with:

```
✔ Build completed successfully
✔ App installed on iPhone 15
✔ Launching app...
✔ App launched successfully!
```

---

## 📚 Learn More

- **Detailed Guide:** `docs/LOCAL_SETUP_GUIDE.md`
- **Troubleshooting:** `docs/INSTALLATION.md`
- **Firebase Setup:** `docs/FIREBASE_SETUP.md`

---

## 💡 Pro Tips

1. **Keep Terminal Open**: Don't close the Metro bundler terminal
2. **Hot Reload**: Save files and see changes instantly
3. **Developer Menu**: Press `Cmd + D` for debugging options
4. **Logs**: Check Terminal for error messages
5. **Simulator**: Use `Hardware → Shake Gesture` to open dev menu

---

*Need help? Check the full guide: `docs/LOCAL_SETUP_GUIDE.md`*
