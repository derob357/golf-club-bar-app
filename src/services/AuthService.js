import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class AuthService {
  // Sign up new user
  async signUp(email, password, userData) {
    try {
      // Input validation
      if (!email || typeof email !== 'string') {
        throw new Error('Valid email is required');
      }
      if (!password || typeof password !== 'string' || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (!userData || typeof userData !== 'object') {
        throw new Error('User data is required');
      }
      if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length === 0) {
        throw new Error('Valid name is required');
      }

      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = userData.name.trim();
      const sanitizedPhone = userData.phone ? String(userData.phone).trim() : '';
      const role = ['bartender', 'manager'].includes(userData.role) ? userData.role : 'bartender';

      const userCredential = await auth().createUserWithEmailAndPassword(
        sanitizedEmail,
        password,
      );
      
      if (!userCredential || !userCredential.user || !userCredential.user.uid) {
        throw new Error('Failed to create user account');
      }
      
      const {uid} = userCredential.user;

      // Create user document in Firestore with validated data
      await firestore().collection('users').doc(uid).set({
        uid,
        email: sanitizedEmail,
        name: sanitizedName,
        phone: sanitizedPhone,
        role: role,
        active: true,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      // Input validation
      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        throw new Error('Valid email is required');
      }
      if (!password || typeof password !== 'string' || password.length === 0) {
        throw new Error('Password is required');
      }

      const sanitizedEmail = email.trim().toLowerCase();
      
      const userCredential = await auth().signInWithEmailAndPassword(
        sanitizedEmail,
        password,
      );
      
      if (!userCredential || !userCredential.user || !userCredential.user.uid) {
        throw new Error('Authentication failed');
      }
      
      // Check if user is active
      const userDoc = await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .get();

      if (!userDoc || !userDoc.exists) {
        await this.signOut().catch(() => {}); // Silent cleanup
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      if (!userData || typeof userData !== 'object') {
        await this.signOut().catch(() => {});
        throw new Error('Invalid user data');
      }
      
      if (userData.active === false) {
        await this.signOut().catch(() => {});
        throw new Error('Account is inactive. Contact administrator.');
      }

      return {
        ...userCredential.user,
        role: userData.role || 'bartender',
        name: userData.name || 'Unknown',
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut() {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
        console.error('Invalid UID provided to getUserData');
        return null;
      }
      
      const userDoc = await firestore().collection('users').doc(uid).get();
      
      if (!userDoc) {
        console.error('No user document returned');
        return null;
      }
      
      if (userDoc.exists) {
        const data = userDoc.data();
        if (data && typeof data === 'object') {
          return {id: userDoc.id, ...data};
        }
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null; // Return null instead of throwing to prevent app crashes
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        throw new Error('Valid email is required');
      }
      
      const sanitizedEmail = email.trim().toLowerCase();
      await auth().sendPasswordResetEmail(sanitizedEmail);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      await firestore().collection('users').doc(uid).update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Check if user has role
  async checkUserRole(uid, requiredRole) {
    try {
      const userData = await this.getUserData(uid);
      return userData && userData.role === requiredRole;
    } catch (error) {
      console.error('Check role error:', error);
      return false;
    }
  }

  // Auth state observer
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  // Handle auth errors
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('Email address is already in use');
      case 'auth/invalid-email':
        return new Error('Invalid email address');
      case 'auth/operation-not-allowed':
        return new Error('Operation not allowed');
      case 'auth/weak-password':
        return new Error('Password is too weak');
      case 'auth/user-disabled':
        return new Error('User account is disabled');
      case 'auth/user-not-found':
        return new Error('User not found');
      case 'auth/wrong-password':
        return new Error('Invalid email or password');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Try again later.');
      default:
        return error;
    }
  }
}

export default new AuthService();
