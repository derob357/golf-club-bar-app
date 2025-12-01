const admin = require('firebase-admin');
const serviceAccount = require('../docs/golf-club-bar-firebase-adminsdk-fbsvc-0264f792a3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const newRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    match /members/{memberId} {
      allow read, write: if request.auth != null;
    }
    
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    match /products/{productId} {
      allow read, write: if request.auth != null;
    }
    
    match /inventory/{itemId} {
      allow read, write: if request.auth != null;
    }
    
    match /settings/{settingId} {
      allow read, write: if request.auth != null;
    }
  }
}
`;

async function updateRules() {
  try {
    console.log('Updating Firestore security rules...');
    
    const result = await admin.securityRules().releaseFirestoreRulesetFromSource(newRules);
    
    console.log('✅ Successfully updated Firestore rules');
    console.log('Ruleset name:', result.name);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating rules:', error);
    process.exit(1);
  }
}

updateRules();
