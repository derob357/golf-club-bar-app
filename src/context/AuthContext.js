import React, {createContext, useState, useEffect, useContext} from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged(async authUser => {
      setLoading(true);
      if (authUser && authUser.uid && typeof authUser.uid === 'string' && authUser.uid.trim()) {
        try {
          const data = await AuthService.getUserData(authUser.uid);
          if (data && typeof data === 'object') {
            setUser(authUser);
            setUserData(data);
          } else {
            console.error('Invalid user data received');
            setUser(null);
            setUserData(null);
            setError('Failed to load user profile');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError(err?.message || 'Failed to load user data');
          setUser(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const authUser = await AuthService.signIn(email, password);
      if (authUser && authUser.uid && typeof authUser.uid === 'string' && authUser.uid.trim()) {
        const data = await AuthService.getUserData(authUser.uid);
        setUser(authUser);
        setUserData(data);
        return authUser;
      } else {
        throw new Error('Invalid user authentication data');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, additionalData) => {
    try {
      setError(null);
      setLoading(true);
      const authUser = await AuthService.signUp(email, password, additionalData);
      if (authUser && authUser.uid && typeof authUser.uid === 'string' && authUser.uid.trim()) {
        const data = await AuthService.getUserData(authUser.uid);
        setUser(authUser);
        setUserData(data);
        return authUser;
      } else {
        throw new Error('Invalid user authentication data');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await AuthService.signOut();
      setUser(null);
      setUserData(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async email => {
    try {
      setError(null);
      await AuthService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isManager = () => {
    try {
      return userData && typeof userData === 'object' && userData.role === 'manager';
    } catch (error) {
      console.error('Error checking manager role:', error);
      return false;
    }
  };

  const isBartender = () => {
    try {
      return userData && typeof userData === 'object' && userData.role === 'bartender';
    } catch (error) {
      console.error('Error checking bartender role:', error);
      return false;
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isManager,
    isBartender,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
