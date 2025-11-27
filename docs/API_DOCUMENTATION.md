# Golf Club Bar Management App - API Documentation

## Overview

This document provides the API reference for integrating with the Golf Club Bar Management App.

---

## Firebase Firestore Collections

### Users

**Endpoint:** `/users/{userId}`

**Structure:**
```javascript
{
  uid: string,
  email: string,
  role: 'bartender' | 'manager',
  name: string,
  phone: string,
  active: boolean,
  fcmToken: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Operations:**

**Get User by ID**
```javascript
const user = await firestore()
  .collection('users')
  .doc(userId)
  .get();
```

**Update User**
```javascript
await firestore()
  .collection('users')
  .doc(userId)
  .update({
    name: 'New Name',
    updatedAt: firestore.FieldValue.serverTimestamp()
  });
```

---

### Members

**Endpoint:** `/members/{memberId}`

**Structure:**
```javascript
{
  memberId: string, // 4-digit ID
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  membershipType: string,
  joinDate: Timestamp,
  active: boolean,
  totalPurchases: number,
  lastPurchaseDate: Timestamp,
  favoriteItems: array<string>,
  loyaltyPoints: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Operations:**

**Get Member by 4-digit ID**
```javascript
const members = await firestore()
  .collection('members')
  .where('memberId', '==', '1234')
  .limit(1)
  .get();

const member = members.docs[0]?.data();
```

**Create New Member**
```javascript
await firestore()
  .collection('members')
  .add({
    memberId: '1234',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    membershipType: 'Premium',
    active: true,
    totalPurchases: 0,
    loyaltyPoints: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp()
  });
```

**Update Member**
```javascript
await firestore()
  .collection('members')
  .doc(memberDocId)
  .update({
    phone: '+0987654321',
    updatedAt: firestore.FieldValue.serverTimestamp()
  });
```

---

### Orders

**Endpoint:** `/orders/{orderId}`

**Structure:**
```javascript
{
  orderId: string,
  memberId: string,
  memberName: string,
  bartenderId: string,
  bartenderName: string,
  items: array<{
    itemId: string,
    name: string,
    category: string,
    brand: string,
    price: number,
    quantity: number,
    notes: string
  }>,
  subtotal: number,
  tax: number,
  total: number,
  eventName: string,
  timestamp: Timestamp,
  paymentStatus: 'pending' | 'completed' | 'cancelled',
  notes: string
}
```

**Operations:**

**Create Order**
```javascript
const orderRef = await firestore()
  .collection('orders')
  .add({
    memberId: '1234',
    memberName: 'John Doe',
    bartenderId: currentUser.uid,
    bartenderName: currentUser.name,
    items: [
      {
        itemId: 'c1',
        name: 'Margarita',
        category: 'cocktail',
        brand: '',
        price: 12,
        quantity: 2
      }
    ],
    subtotal: 24,
    tax: 1.92,
    total: 25.92,
    eventName: '',
    timestamp: firestore.FieldValue.serverTimestamp(),
    paymentStatus: 'completed'
  });

return orderRef.id;
```

**Get Orders by Timeframe**
```javascript
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');

const orders = await firestore()
  .collection('orders')
  .where('timestamp', '>=', startDate)
  .where('timestamp', '<=', endDate)
  .orderBy('timestamp', 'desc')
  .get();

const orderList = orders.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

**Get Orders by Member**
```javascript
const orders = await firestore()
  .collection('orders')
  .where('memberId', '==', '1234')
  .orderBy('timestamp', 'desc')
  .limit(50)
  .get();
```

**Get Orders by Event**
```javascript
const orders = await firestore()
  .collection('orders')
  .where('eventName', '==', 'Tournament 2024')
  .orderBy('timestamp', 'desc')
  .get();
```

---

### Inventory

**Endpoint:** `/inventory/{itemId}`

**Structure:**
```javascript
{
  itemId: string,
  name: string,
  category: 'cocktail' | 'beer' | 'wine' | 'spirits' | 'custom',
  brand: string,
  type: string,
  price: number,
  description: string,
  ingredients: array<string>,
  inStock: boolean,
  popularity: number,
  imageUrl: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Operations:**

**Get All Inventory**
```javascript
const inventory = await firestore()
  .collection('inventory')
  .where('inStock', '==', true)
  .orderBy('category')
  .get();
```

**Get by Category**
```javascript
const cocktails = await firestore()
  .collection('inventory')
  .where('category', '==', 'cocktail')
  .where('inStock', '==', true)
  .get();
```

**Update Popularity**
```javascript
await firestore()
  .collection('inventory')
  .doc(itemId)
  .update({
    popularity: firestore.FieldValue.increment(1)
  });
```

---

## REST API Endpoints (Cloud Functions)

If you implement Cloud Functions, here are recommended endpoints:

### Authentication

**POST /api/auth/register**
```javascript
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "bartender"
}

Response:
{
  "success": true,
  "userId": "abc123",
  "token": "jwt_token"
}
```

**POST /api/auth/login**
```javascript
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "role": "bartender",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

---

### Members

**GET /api/members/:memberId**
```javascript
Response:
{
  "success": true,
  "member": {
    "memberId": "1234",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "active": true
  }
}
```

**POST /api/members**
```javascript
Request:
{
  "memberId": "1234",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "memberId": "firestore_doc_id"
}
```

---

### Orders

**POST /api/orders**
```javascript
Request:
{
  "memberId": "1234",
  "items": [
    {
      "itemId": "c1",
      "name": "Margarita",
      "price": 12,
      "quantity": 2
    }
  ],
  "eventName": "Tournament 2024"
}

Response:
{
  "success": true,
  "orderId": "order_123",
  "total": 25.92
}
```

**GET /api/orders?startDate=2024-01-01&endDate=2024-01-31**
```javascript
Response:
{
  "success": true,
  "orders": [
    {
      "orderId": "order_123",
      "memberId": "1234",
      "memberName": "John Doe",
      "total": 25.92,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "summary": {
    "totalOrders": 150,
    "totalSales": 3500.00,
    "avgOrderValue": 23.33
  }
}
```

---

### Reports

**GET /api/reports/sales?timeframe=last7days**
```javascript
Response:
{
  "success": true,
  "timeframe": {
    "start": "2024-01-01",
    "end": "2024-01-07"
  },
  "stats": {
    "totalSales": 5000.00,
    "totalOrders": 200,
    "avgOrderValue": 25.00
  },
  "topItems": [
    {
      "name": "Margarita",
      "quantity": 50,
      "revenue": 600.00
    }
  ]
}
```

**POST /api/reports/generate**
```javascript
Request:
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "format": "pdf",
  "eventName": "Tournament 2024"
}

Response:
{
  "success": true,
  "reportUrl": "https://storage.googleapis.com/.../report.pdf",
  "expiresAt": "2024-02-01T00:00:00Z"
}
```

---

## Webhooks

### Order Created
```javascript
POST https://your-webhook-url.com/order-created

Payload:
{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "orderId": "order_123",
    "memberId": "1234",
    "total": 25.92,
    "items": []
  }
}
```

### Member Updated
```javascript
POST https://your-webhook-url.com/member-updated

Payload:
{
  "event": "member.updated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "memberId": "1234",
    "changes": {
      "phone": "+0987654321"
    }
  }
}
```

---

## Rate Limits

- Authentication: 10 requests/minute
- Read operations: 1000 requests/minute
- Write operations: 100 requests/minute
- Report generation: 5 requests/minute

---

## Error Codes

```javascript
{
  "success": false,
  "error": {
    "code": "MEMBER_NOT_FOUND",
    "message": "Member with ID 1234 not found",
    "status": 404
  }
}
```

Common error codes:
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `VALIDATION_ERROR` - 400
- `INTERNAL_ERROR` - 500
- `RATE_LIMIT_EXCEEDED` - 429

---

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/firestore
npm install @react-native-firebase/auth
```

### Usage Example
```javascript
import firestore from '@react-native-firebase/firestore';

// Get member
const getMember = async (memberId) => {
  const snapshot = await firestore()
    .collection('members')
    .where('memberId', '==', memberId)
    .get();
  
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
};

// Create order
const createOrder = async (orderData) => {
  const ref = await firestore()
    .collection('orders')
    .add({
      ...orderData,
      timestamp: firestore.FieldValue.serverTimestamp()
    });
  
  return ref.id;
};
```

---

## Authentication

All API requests require authentication via Firebase Auth token:

```javascript
const idToken = await auth().currentUser.getIdToken();

fetch('https://your-api.com/endpoint', {
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Pagination

For large datasets, use pagination:

```javascript
// First page
const firstPage = await firestore()
  .collection('orders')
  .orderBy('timestamp', 'desc')
  .limit(25)
  .get();

// Next page
const lastDoc = firstPage.docs[firstPage.docs.length - 1];
const nextPage = await firestore()
  .collection('orders')
  .orderBy('timestamp', 'desc')
  .startAfter(lastDoc)
  .limit(25)
  .get();
```

---

## Real-time Updates

Subscribe to real-time changes:

```javascript
// Listen to order changes
const unsubscribe = firestore()
  .collection('orders')
  .where('memberId', '==', '1234')
  .onSnapshot(snapshot => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Updated orders:', orders);
  });

// Unsubscribe when done
unsubscribe();
```

---

## Best Practices

1. **Use Batch Writes** for multiple operations
2. **Implement Caching** to reduce reads
3. **Use Indexes** for complex queries
4. **Handle Offline State** gracefully
5. **Implement Retry Logic** for failed operations
6. **Validate Data** before writing
7. **Use Transactions** for critical operations
8. **Monitor Quota Usage** in Firebase Console

---

## Support

For API support, contact: support@golfclubbar.com
