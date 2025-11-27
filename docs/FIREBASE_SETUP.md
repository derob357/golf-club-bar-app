# Firebase Setup Guide

Complete guide for setting up Firebase for the Golf Club Bar Management App.

## Prerequisites

- Firebase account (https://console.firebase.google.com)
- Google account
- Node.js installed
- React Native development environment setup

---

## Part 1: Firebase Console Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: `golf-club-bar-app`
4. Enable/Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Add iOS App

1. In Project Overview, click iOS icon
2. Enter iOS Bundle ID: `com.golfclub.barapp`
3. Enter App Nickname: `Golf Club Bar`
4. Download `GoogleService-Info.plist`
5. Add file to `ios/GolfClubBar/` directory
6. Run: `cd ios && pod install`

### Step 3: Add Android App

1. In Project Overview, click Android icon
2. Enter Android package name: `com.golfclub.barapp`
3. Enter App Nickname: `Golf Club Bar`
4. Download `google-services.json`
5. Add file to `android/app/` directory

### Step 4: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Click "Save"

### Step 5: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select Cloud Firestore location (choose closest to users)
4. Click "Enable"

### Step 6: Setup Storage (Optional)

1. Go to **Storage** → **Get Started**
2. Use default security rules
3. Click "Done"

### Step 7: Enable Cloud Messaging

1. Go to **Cloud Messaging**
2. Note the **Server Key** for backend notifications

---

## Part 2: Security Rules

### Firestore Security Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isManager() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager';
    }
    
    function isBartender() {
      return isAuthenticated() && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'bartender' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        (request.auth.uid == userId || isManager());
      allow delete: if isManager();
    }
    
    // Members collection
    match /members/{memberId} {
      allow read: if isAuthenticated();
      allow write: if isBartender();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isBartender();
      allow update: if isManager();
      allow delete: if isManager();
    }
    
    // Inventory collection
    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Settings collection
    match /settings/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Wishlists collection
    match /wishlists/{wishlistId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```

### Storage Security Rules

Go to **Storage** → **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'manager';
    }
    
    match /receipts/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Part 3: Initial Data Setup

### Create Initial Collections and Documents

Use Firebase Console **Firestore Database** → **Start collection**:

#### 1. App Settings
```javascript
Collection: settings
Document ID: app_settings

{
  taxRate: 0.08,
  reportTimeframes: ["today", "yesterday", "last7days", "last30days"],
  notificationsEnabled: true,
  autoSyncInterval: 300000,
  defaultEventName: "",
  version: "1.0.0"
}
```

#### 2. Sample Member (for testing)
```javascript
Collection: members
Document ID: (Auto-generated)

{
  memberId: "1234",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Golf Course Rd",
  membershipType: "Premium",
  joinDate: (Timestamp - now),
  active: true,
  totalPurchases: 0,
  lastPurchaseDate: null,
  favoriteItems: [],
  createdAt: (Timestamp - now),
  updatedAt: (Timestamp - now)
}
```

#### 3. Load Inventory Data

Use the Firebase Admin SDK or console to bulk import inventory:

**inventory_import.json**
```json
{
  "inventory": [
    {
      "name": "Margarita",
      "category": "cocktail",
      "ingredients": ["Tequila", "Triple Sec", "Lime Juice"],
      "price": 12,
      "inStock": true,
      "popularity": 100
    },
    // Add more items from src/constants/drinks.js
  ]
}
```

---

## Part 4: Firebase SDK Configuration

### Update firebase.js with your config

```javascript
// src/config/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "golf-club-bar-app.firebaseapp.com",
  projectId: "golf-club-bar-app",
  storageBucket: "golf-club-bar-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;
```

Get these values from:
- Firebase Console → Project Settings → General → Your apps

---

## Part 5: Firestore Indexes

Create composite indexes for efficient queries:

Go to **Firestore Database** → **Indexes** → **Composite**

#### 1. Orders by Time and Member
```
Collection: orders
Fields: 
  - timestamp (Descending)
  - memberId (Ascending)
Query scope: Collection
```

#### 2. Orders by Event and Time
```
Collection: orders
Fields:
  - eventName (Ascending)
  - timestamp (Descending)
Query scope: Collection
```

#### 3. Inventory by Category and Popularity
```
Collection: inventory
Fields:
  - category (Ascending)
  - popularity (Descending)
  - inStock (Ascending)
Query scope: Collection
```

#### 4. Members by Active Status
```
Collection: members
Fields:
  - active (Ascending)
  - lastName (Ascending)
Query scope: Collection
```

---

## Part 6: Cloud Functions (Optional)

Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Useful Cloud Functions

**functions/index.js**
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Send order confirmation notification
exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Get member's FCM token
    const memberDoc = await admin.firestore()
      .collection('members')
      .where('memberId', '==', order.memberId)
      .limit(1)
      .get();
    
    if (!memberDoc.empty) {
      const member = memberDoc.docs[0].data();
      
      if (member.fcmToken) {
        const message = {
          notification: {
            title: 'Order Confirmed!',
            body: `Your order of ${order.items.length} items has been recorded.`,
          },
          token: member.fcmToken,
        };
        
        await admin.messaging().send(message);
      }
    }
  });

// Update member statistics
exports.updateMemberStats = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    const memberQuery = await admin.firestore()
      .collection('members')
      .where('memberId', '==', order.memberId)
      .limit(1)
      .get();
    
    if (!memberQuery.empty) {
      const memberRef = memberQuery.docs[0].ref;
      
      await memberRef.update({
        totalPurchases: admin.firestore.FieldValue.increment(order.total),
        lastPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

// Daily backup
exports.dailyBackup = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const bucket = admin.storage().bucket();
    const date = new Date().toISOString().split('T')[0];
    
    // Backup orders
    const ordersSnapshot = await admin.firestore()
      .collection('orders')
      .get();
    
    const ordersData = ordersSnapshot.docs.map(doc => doc.data());
    
    await bucket.file(`backups/${date}/orders.json`).save(
      JSON.stringify(ordersData)
    );
    
    return null;
  });
```

Deploy functions:
```bash
firebase deploy --only functions
```

---

## Part 7: Environment Setup

Create `.env` file in project root:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=golf-club-bar-app.firebaseapp.com
FIREBASE_PROJECT_ID=golf-club-bar-app
FIREBASE_STORAGE_BUCKET=golf-club-bar-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

---

## Part 8: Testing

### Test Authentication
```bash
# Create test user in Firebase Console
Authentication → Users → Add user
Email: test@golfclub.com
Password: Test123456
```

### Test Firestore
1. Add test member with ID 1234
2. Run app and try to lookup member
3. Create test order
4. Verify order appears in Firestore

### Test Security Rules
Use Firebase Console → Firestore → Rules Playground to test

---

## Part 9: Production Checklist

Before going live:

- [ ] Change Firestore rules from test mode to production
- [ ] Enable Firebase App Check for security
- [ ] Setup Firebase Performance Monitoring
- [ ] Configure Firebase Crashlytics
- [ ] Setup automated backups
- [ ] Enable audit logging
- [ ] Configure budget alerts
- [ ] Add custom domain for Auth
- [ ] Setup error monitoring
- [ ] Create backup admin account

---

## Troubleshooting

### Common Issues

**iOS: GoogleService-Info.plist not found**
```bash
cd ios
pod install
```

**Android: google-services.json not found**
- Ensure file is in `android/app/` directory
- Rebuild: `cd android && ./gradlew clean`

**Firestore permission denied**
- Check security rules
- Verify user is authenticated
- Check user role in database

**Cloud Messaging not working**
- iOS: Check APNs certificates
- Android: Verify google-services.json
- Check device has granted notification permissions

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules Guide](https://firebase.google.com/docs/rules)
