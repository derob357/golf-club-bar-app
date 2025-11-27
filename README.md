# Golf Club Bar Management App

A comprehensive React Native mobile application for tracking golf club membership drink purchases with real-time order management, reporting, and analytics.

## 🎯 Overview

This enterprise-grade mobile app enables golf club bartenders to efficiently track and manage member drink purchases using a simple 4-digit member ID system. Managers can access detailed sales reports, analytics, and export data for accounting purposes.

## ✨ Features

### Core Functionality
- **Member Management**: Support for up to 50,000 members with 4-digit ID validation
- **Order Management**: Intuitive cart-based ordering system with real-time updates
- **Extensive Drink Library**: 
  - 100 pre-loaded classic and contemporary cocktails
  - 20 most popular beer brands
  - Wine and spirits selection
  - Custom drink entry for unique orders
- **Role-Based Access Control**: Separate interfaces for bartenders and managers
- **Advanced Reporting**: Time-filtered sales reports with PDF export and printing
- **Real-time Sync**: Firebase Firestore backend with offline support
- **Cross-Platform**: iOS and Android support for phones and tablets

### For Bartenders
- Quick member lookup with 4-digit ID
- Browse drinks by category (cocktails, beer, wine, spirits)
- Search functionality across all drinks
- Shopping cart with quantity management
- Event-based order tracking
- Order history

### For Managers
- Sales analytics dashboard
- Time-based reporting (today, week, month, custom)
- Event-based reporting
- Top-selling items analysis
- Export reports as PDF
- Print reports directly
- User management

## 🛠 Tech Stack

- **Framework**: React Native 0.72.6
- **Backend**: Firebase (Auth, Firestore, Cloud Messaging)
- **Navigation**: React Navigation 6
- **UI Library**: React Native Paper (Material Design)
- **State Management**: React Context API with Provider pattern
- **Date Handling**: date-fns
- **PDF Generation**: react-native-html-to-pdf
- **Printing**: react-native-print
- **Local Storage**: AsyncStorage

## 📁 Project Structure

```
golf-club-bar-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/
│   │   ├── auth/           # Login, Signup screens
│   │   └── main/           # Main app screens
│   ├── navigation/         # React Navigation setup
│   ├── context/            # Global state management
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── SettingsContext.js
│   ├── services/           # Firebase services
│   │   ├── AuthService.js
│   │   └── FirebaseService.js
│   ├── constants/          # Static data (drinks menu)
│   ├── theme/              # App theming
│   └── config/             # Firebase config
├── android/                # Android native code
├── ios/                    # iOS native code
├── docs/                   # Documentation
│   ├── INSTALLATION.md
│   ├── FIREBASE_SETUP.md
│   ├── DEPLOYMENT.md
│   ├── USER_ENGAGEMENT.md
│   └── API_DOCUMENTATION.md
└── assets/                 # Images, fonts, etc.
```

## 🚀 Quick Start

### Prerequisites

Before running the project on your Mac, you need:

- **Node.js v18+** - JavaScript runtime ([Download](https://nodejs.org/))
- **Watchman** - File watcher (`brew install watchman`)
- **Xcode** - For iOS development (from Mac App Store)
- **CocoaPods** - iOS dependency manager (`sudo gem install cocoapods`)
- **Android Studio** - For Android development (optional)
- **Firebase account** - Backend services ([console.firebase.google.com](https://console.firebase.google.com))

### Installation (macOS)

#### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/derob357/golf-club-bar-app.git
cd golf-club-bar-app

# Install JavaScript dependencies
npm install
```

#### Step 2: Install iOS Dependencies

```bash
# Navigate to iOS folder and install CocoaPods dependencies
cd ios
pod install
cd ..
```

**What this does:** Downloads and links all iOS native libraries (Firebase, navigation components, etc.)

**Troubleshooting:** If `pod install` fails, make sure CocoaPods is installed:
```bash
sudo gem install cocoapods
```

#### Step 3: Run the App

```bash
# Run on iOS Simulator (Mac only)
npm run ios

# Run on specific iPhone model
npm run ios -- --simulator="iPhone 15 Pro"

# Run on Android Emulator
npm run android
```

**First build takes 3-5 minutes.** Subsequent builds are faster.

### What Happens When You Run

1. **Metro Bundler starts** - JavaScript packager (port 8081)
2. **App builds** - Native code compiles
3. **Simulator launches** - iOS Simulator opens
4. **App installs and runs** - You'll see the login screen

### 📖 Detailed Setup Guide

**New to React Native?** See our complete setup guide:
- **[Local Setup Guide](docs/LOCAL_SETUP_GUIDE.md)** - Step-by-step Mac setup with troubleshooting

**Quick references:**
- [Installation Guide](docs/INSTALLATION.md) - Full installation with troubleshooting
- [Firebase Setup](docs/FIREBASE_SETUP.md) - Configure backend (required for login)

## 🔥 Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Download configuration files:
   - `google-services.json` for Android
   - `GoogleService-Info.plist` for iOS
5. Update `src/config/firebase.js` with your credentials

For complete Firebase setup, see [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).

## 📊 Database Schema

### Collections

- **users**: User accounts (bartenders and managers)
- **members**: Golf club members (up to 50,000)
- **orders**: Drink purchase transactions
- **inventory**: Available drinks and pricing
- **settings**: App configuration
- **events**: Special events for reporting

See [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) for detailed schema documentation.

## 🎨 Key Screens

1. **Login/Signup**: User authentication
2. **Home**: Dashboard with quick actions
3. **Member Lookup**: 4-digit ID validation
4. **Drink Menu**: Categorized drink selection
5. **Cart**: Order review and editing
6. **Checkout**: Order completion
7. **Reports**: Sales analytics (Manager only)
8. **Settings**: App preferences

## 📱 Platform Support

- ✅ iOS 12.0+
- ✅ Android 5.0+ (API level 21+)
- ✅ iPhone and iPad
- ✅ Android phones and tablets

## 🔒 Security

- Firebase Authentication with email/password
- Role-based access control (bartender/manager)
- Firestore security rules
- Member ID validation (4-digit format)
- Secure data transmission

## 📈 Analytics & Engagement

The app includes features to improve user engagement:

- Push notifications for promotions and events
- Personalized drink recommendations
- Order history tracking
- Loyalty points system (optional)
- Wishlist functionality

See [USER_ENGAGEMENT.md](docs/USER_ENGAGEMENT.md) for implementation details.

## 🚢 Deployment

Ready to deploy to production?

- **iOS**: Submit to App Store via TestFlight
- **Android**: Publish to Google Play Store

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md) - Setup instructions
- [Firebase Setup](docs/FIREBASE_SETUP.md) - Database configuration
- [Deployment Guide](docs/DEPLOYMENT.md) - App Store & Play Store submission
- [User Engagement](docs/USER_ENGAGEMENT.md) - Push notifications & recommendations
- [API Documentation](docs/API_DOCUMENTATION.md) - Backend API reference

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 🤝 Contributing

This is a private project for golf club internal use. For questions or support, contact the development team.

## 📄 License

Private - Golf Club Internal Use Only

## 🆘 Support

For technical support or questions:
- Check the documentation in the `docs/` folder
- Review troubleshooting guides in [INSTALLATION.md](docs/INSTALLATION.md)
- Contact: support@golfclub.com

## 🎯 Future Enhancements

- [ ] Member self-service portal
- [ ] Integration with club management system
- [ ] Inventory management and alerts
- [ ] Advanced analytics and ML recommendations
- [ ] Social features (share favorite drinks)
- [ ] Referral program with rewards
- [ ] Multi-location support
- [ ] Integration with payment processors

---

**Built with ❤️ for golf clubs worldwide**
