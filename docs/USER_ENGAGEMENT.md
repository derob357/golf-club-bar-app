# User Engagement Features Guide

This document outlines strategies and implementation guides for improving user engagement through personalized features, push notifications, and recommendations.

## Table of Contents
1. [Push Notifications](#push-notifications)
2. [Personalized Recommendations](#personalized-recommendations)
3. [Wishlist Feature](#wishlist-feature)
4. [Analytics & Insights](#analytics--insights)
5. [Member Loyalty Program](#member-loyalty-program)

---

## Push Notifications

### Setup Firebase Cloud Messaging (FCM)

#### 1. Install Dependencies
```bash
npm install @react-native-firebase/messaging
```

#### 2. Configure Permissions

**iOS (ios/GolfClubBar/AppDelegate.m)**
```objc
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

// Add UNUserNotificationCenterDelegate
@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end

// In didFinishLaunchingWithOptions
UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
center.delegate = self;
```

**Android (android/app/src/main/AndroidManifest.xml)**
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

#### 3. Implementation

**src/services/NotificationService.js**
```javascript
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {Platform} from 'react-native';

class NotificationService {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async saveFCMToken(userId, token) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          fcmToken: token,
          platform: Platform.OS,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  setupNotificationListeners() {
    // Foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      // Display local notification
    });

    // Background & quit state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });

    // Notification opened app
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      // Navigate to appropriate screen
    });

    // Check if app was opened from notification (quit state)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
        }
      });
  }
}

export default new NotificationService();
```

### Notification Use Cases

#### 1. Order Confirmation
```javascript
// Send to member after order completion
const sendOrderConfirmation = async (memberId, orderDetails) => {
  const notification = {
    title: 'Order Confirmed! 🍹',
    body: \`Your order of \${orderDetails.itemCount} items (\$\${orderDetails.total}) has been recorded.\`,
    data: {
      type: 'order_confirmation',
      orderId: orderDetails.orderId,
    },
  };
  
  await sendNotificationToMember(memberId, notification);
};
```

#### 2. Daily Specials
```javascript
// Send to all active members
const sendDailySpecial = async () => {
  const notification = {
    title: 'Today\'s Special! 🎉',
    body: 'Happy Hour: 2-for-1 on all draft beers from 5-7 PM',
    data: {
      type: 'promotion',
      category: 'beer',
    },
  };
  
  await sendToAllMembers(notification);
};
```

#### 3. Event Reminders
```javascript
const sendEventReminder = async (eventName, date) => {
  const notification = {
    title: \`\${eventName} Tomorrow! ⛳\`,
    body: 'Don\'t forget to join us for the tournament. Pre-order your drinks now!',
    data: {
      type: 'event_reminder',
      eventName,
      date,
    },
  };
  
  await sendToAllMembers(notification);
};
```

---

## Personalized Recommendations

### Implementation Strategy

#### 1. Create Recommendation Engine

**src/services/RecommendationService.js**
```javascript
import firestore from '@react-native-firebase/firestore';

class RecommendationService {
  // Get personalized drink recommendations
  async getRecommendationsForMember(memberId, limit = 5) {
    try {
      // Get member's order history
      const orders = await firestore()
        .collection('orders')
        .where('memberId', '==', memberId)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get();

      // Extract purchased items
      const purchasedItems = {};
      const categories = {};

      orders.docs.forEach(doc => {
        const order = doc.data();
        order.items.forEach(item => {
          purchasedItems[item.name] = (purchasedItems[item.name] || 0) + 1;
          categories[item.category] = (categories[item.category] || 0) + 1;
        });
      });

      // Find favorite category
      const favoriteCategory = Object.entries(categories).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0];

      // Get popular items in favorite category
      const recommendations = await firestore()
        .collection('inventory')
        .where('category', '==', favoriteCategory)
        .where('inStock', '==', true)
        .orderBy('popularity', 'desc')
        .limit(limit)
        .get();

      return recommendations.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reason: 'Based on your preferences',
      }));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Get trending items
  async getTrendingItems(days = 7, limit = 10) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    try {
      const orders = await firestore()
        .collection('orders')
        .where('timestamp', '>=', cutoffDate)
        .get();

      const itemCounts = {};
      orders.docs.forEach(doc => {
        const order = doc.data();
        order.items.forEach(item => {
          itemCounts[item.itemId] = (itemCounts[item.itemId] || 0) + item.quantity;
        });
      });

      const trending = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

      return trending.map(([itemId, count]) => ({itemId, count}));
    } catch (error) {
      console.error('Error getting trending items:', error);
      return [];
    }
  }

  // Similar members who like this
  async getSimilarMemberSuggestions(itemId, memberId) {
    try {
      // Find members who ordered this item
      const orders = await firestore()
        .collection('orders')
        .where('items', 'array-contains', {itemId})
        .limit(50)
        .get();

      const memberItems = {};
      orders.docs.forEach(doc => {
        const order = doc.data();
        if (order.memberId !== memberId) {
          order.items.forEach(item => {
            if (item.itemId !== itemId) {
              memberItems[item.itemId] = (memberItems[item.itemId] || 0) + 1;
            }
          });
        }
      });

      // Return top co-purchased items
      return Object.entries(memberItems)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);
    } catch (error) {
      console.error('Error getting similar suggestions:', error);
      return [];
    }
  }
}

export default new RecommendationService();
```

#### 2. Display Recommendations in UI

**Add to DrinkMenuScreen.js**
```javascript
const [recommendations, setRecommendations] = useState([]);

useEffect(() => {
  loadRecommendations();
}, [currentMember]);

const loadRecommendations = async () => {
  if (currentMember) {
    const recs = await RecommendationService.getRecommendationsForMember(
      currentMember.memberId,
    );
    setRecommendations(recs);
  }
};

// Add recommendations section before main drink list
<Card style={styles.recommendationsCard}>
  <Card.Content>
    <Title>Recommended For You</Title>
    <FlatList
      horizontal
      data={recommendations}
      renderItem={renderRecommendation}
      keyExtractor={item => item.id}
    />
  </Card.Content>
</Card>
```

---

## Wishlist Feature

### Database Schema Addition

**Firestore Collection: wishlists**
```javascript
{
  memberId: string,
  items: array<{
    itemId: string,
    name: string,
    addedAt: Timestamp
  }>,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Implementation

**src/context/WishlistContext.js**
```javascript
import React, {createContext, useState, useContext, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({children}) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = async (memberId, item) => {
    try {
      await firestore()
        .collection('wishlists')
        .doc(memberId)
        .set(
          {
            memberId,
            items: firestore.FieldValue.arrayUnion({
              itemId: item.id,
              name: item.name,
              addedAt: firestore.FieldValue.serverTimestamp(),
            }),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          {merge: true},
        );
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (memberId, itemId) => {
    // Implementation
  };

  const getWishlist = async memberId => {
    try {
      const doc = await firestore()
        .collection('wishlists')
        .doc(memberId)
        .get();
      return doc.exists ? doc.data().items : [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  };

  return (
    <WishlistContext.Provider
      value={{wishlistItems, addToWishlist, removeFromWishlist, getWishlist}}>
      {children}
    </WishlistContext.Provider>
  );
};
```

---

## Analytics & Insights

### Member Analytics Dashboard

**Features to Track:**
- Total spend per member
- Favorite drinks
- Visit frequency
- Peak ordering times
- Average order value
- Category preferences

**Implementation Example:**
```javascript
const getMemberAnalytics = async (memberId) => {
  const orders = await FirebaseService.getOrdersByMember(memberId);
  
  const analytics = {
    totalSpend: orders.reduce((sum, order) => sum + order.total, 0),
    orderCount: orders.length,
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
      : 0,
    favoriteItems: calculateTopItems(orders),
    preferredCategory: calculateTopCategory(orders),
    lastVisit: orders[0]?.timestamp,
  };
  
  return analytics;
};
```

---

## Member Loyalty Program

### Points System

**Database Addition:**
```javascript
// Add to members collection
{
  loyaltyPoints: number,
  rewardsHistory: array<{
    points: number,
    reason: string,
    timestamp: Timestamp
  }>,
  tierLevel: 'bronze' | 'silver' | 'gold' | 'platinum'
}
```

**Points Calculation:**
```javascript
const calculateLoyaltyPoints = (orderTotal) => {
  // $1 spent = 1 point
  const basePoints = Math.floor(orderTotal);
  
  // Bonus points for higher tiers
  const bonusMultiplier = {
    bronze: 1.0,
    silver: 1.2,
    gold: 1.5,
    platinum: 2.0,
  };
  
  return Math.floor(basePoints * bonusMultiplier[memberTier]);
};
```

**Rewards Redemption:**
```javascript
const REWARDS = [
  {name: 'Free Draft Beer', points: 50},
  {name: 'Free Well Cocktail', points: 100},
  {name: 'Free Premium Cocktail', points: 200},
  {name: '20% Off Next Order', points: 150},
];
```

---

## Gamification Features

### Challenges & Achievements

**Examples:**
- **"Explorer"**: Try 10 different drinks
- **"Regular"**: Place 20 orders in a month
- **"Happy Hour Hero"**: Order during happy hour 5 times
- **"Beer Connoisseur"**: Try all 20 popular beers

**Implementation:**
```javascript
const checkAchievements = async (memberId) => {
  const orders = await FirebaseService.getOrdersByMember(memberId);
  
  const uniqueDrinks = new Set();
  orders.forEach(order => {
    order.items.forEach(item => uniqueDrinks.add(item.name));
  });
  
  const achievements = [];
  
  if (uniqueDrinks.size >= 10) {
    achievements.push('explorer');
  }
  
  if (orders.length >= 20) {
    achievements.push('regular');
  }
  
  return achievements;
};
```

---

## Best Practices

1. **Respect User Privacy**: Always get consent for notifications
2. **Personalization Balance**: Don't be too intrusive
3. **A/B Testing**: Test different recommendation algorithms
4. **Performance**: Cache recommendations to reduce API calls
5. **Feedback Loop**: Allow users to rate recommendations
6. **GDPR Compliance**: Provide data export and deletion options

---

## Next Steps

1. Implement notification scheduling for peak times
2. Create admin dashboard for sending custom notifications
3. Build ML model for advanced recommendations
4. Add social features (members can share favorite drinks)
5. Implement referral program with rewards
