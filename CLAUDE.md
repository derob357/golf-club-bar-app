# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this project.

## Project Overview

DHGC (Druid Hills Golf Club) is a mobile app for golf club bar operations. Bartenders use it to look up members by 4-digit ID, take drink orders, and process checkouts. Managers get sales analytics and reporting. Built with bare React Native (not Expo) using Firebase as the backend.

## Tech Stack

- **Framework**: React Native 0.73.9 (bare, not Expo)
- **React**: 18.2.0
- **Language**: JavaScript (TypeScript available but not enforced)
- **Navigation**: React Navigation 6.1.9 (stack + bottom tabs)
- **UI**: React Native Paper 5.11.1 (Material Design)
- **Backend**: Firebase (Auth, Firestore, Storage, Messaging)
- **State**: React Context API (3 contexts: Auth, Cart, Settings)
- **Local Storage**: AsyncStorage
- **Forms**: Formik 2.4.5 + Yup 1.3.3
- **Reporting**: react-native-html-to-pdf, react-native-print, react-native-share

## Common Commands

```bash
npm start                # Start Metro bundler
npm run ios              # Build & run on iOS Simulator
npm run android          # Build & run on Android Emulator
npm test                 # Run Jest tests (none written yet)
npm run lint             # ESLint
```

## Architecture

### Screen Flow

```
Auth Stack (logged out)
├── LoginScreen
└── SignUpScreen

Main Tabs (logged in)
├── Home (HomeScreen — dashboard with quick actions)
├── Orders (Stack)
│   ├── MemberLookup (4-digit ID validation → Firestore lookup)
│   ├── DrinkMenu (categorized: Cocktails, Beer, Wine, Spirits, Custom)
│   ├── Cart (review, edit quantities, tax calculation)
│   └── Checkout (order confirmation)
├── Reports (ReportsScreen — manager role only)
└── Settings (SettingsScreen)
```

### Key Directories

| Path | Purpose |
|------|---------|
| `src/screens/auth/` | Login, SignUp screens |
| `src/screens/main/` | Home, MemberLookup, DrinkMenu, Cart, Checkout, Reports, Settings |
| `src/context/` | AuthContext, CartContext, SettingsContext |
| `src/services/` | AuthService (Firebase auth wrapper), FirebaseService (Firestore CRUD) |
| `src/constants/drinks.js` | Pre-loaded drink catalog (100 cocktails, 20 beers, wines, spirits) |
| `src/theme/theme.js` | Material Design theme (DHGC green #1B5E20, gold #D4AF37) |
| `src/navigation/AppNavigator.js` | React Navigation config (role-based tab visibility) |

### State Management

Three context providers wrapping the app (in `App.js`):

1. **AuthContext** — Firebase Auth + Firestore user profile. Methods: `signIn`, `signUp`, `signOut`, `isManager()`, `isBartender()`
2. **CartContext** — Shopping cart with AsyncStorage persistence. Methods: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`, `getTaxAmount`, `getGrandTotal`
3. **SettingsContext** — App preferences (taxRate, theme). Helper: `getDateRangeForTimeframe()` for report filtering

### Firebase Collections

| Collection | Purpose |
|------------|---------|
| `users` | Bartender/manager accounts with roles |
| `members` | Golf club members (up to 50K, 4-digit IDs) |
| `orders` | Drink purchase transactions |
| `inventory` | Available drinks, pricing, popularity |
| `settings` | App-wide configuration |
| `events` | Special events for event-based reporting |

### Roles

- **Bartender** — Member lookup, drink ordering, checkout
- **Manager** — All bartender features + Reports tab (analytics, PDF export, printing)

## Environment & Firebase Setup

Firebase config is in `src/config/firebase.js` (currently placeholder — needs real credentials).

Firebase config files for native platforms are in `docs/`:
- `docs/google-services.json` — Android
- `docs/GoogleService-Info.plist` — iOS
- `docs/serviceAccountKey.json` — Admin SDK (contains secrets, do not commit)

## Theme

- **Primary**: #2C5F2D (DHGC Dark Green)
- **Accent**: #D4AF37 (DHGC Gold)
- **Fonts**: Crimson Text (body), Cormorant Infant (headings)
- **Border radius**: 12dp

## Documentation

| File | Topic |
|------|-------|
| `docs/INSTALLATION.md` | Step-by-step setup |
| `docs/FIREBASE_SETUP.md` | Database schema, security rules, Cloud Functions |
| `docs/DEPLOYMENT.md` | App Store & Play Store submission |
| `docs/RUNNING_THE_APP.md` | Quick start |
| `docs/API_DOCUMENTATION.md` | Firestore CRUD patterns |
| `docs/CODE_QUALITY_AUDIT.md` | Code review findings |
| `PROJECT_SUMMARY.md` | Detailed feature documentation |
| `NEXT_STEPS.md` | Implementation roadmap |

## Known Issues

- **Firebase config placeholder** — `src/config/firebase.js` needs real credentials before the app will work.
- **No automated tests** — Jest is configured but no test files exist.
- **serviceAccountKey in docs/** — Admin SDK credentials should not be committed to git.
