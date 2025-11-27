import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [eventName, setEventName] = useState('');

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cartItems, currentMember, eventName]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('@cart_data');
      if (!cartData || typeof cartData !== 'string' || cartData.trim() === '') {
        return; // No data to load
      }

      let parsed;
      try {
        parsed = JSON.parse(cartData);
      } catch (parseError) {
        console.error('Failed to parse cart data, resetting cart:', parseError);
        // Clear corrupted data
        await AsyncStorage.removeItem('@cart_data').catch(() => {});
        return;
      }

      if (!parsed || typeof parsed !== 'object') {
        console.error('Invalid cart data structure');
        return;
      }

      // Validate and sanitize items
      const items = Array.isArray(parsed.items) ? parsed.items.filter(item => {
        return item && 
               typeof item === 'object' && 
               item.id && 
               item.name && 
               typeof item.price === 'number' && 
               typeof item.quantity === 'number' &&
               item.price >= 0 &&
               item.quantity > 0;
      }) : [];

      setCartItems(items);
      setCurrentMember(parsed.member && typeof parsed.member === 'object' ? parsed.member : null);
      setEventName(typeof parsed.eventName === 'string' ? parsed.eventName : '');
    } catch (error) {
      console.error('Error loading cart:', error);
      // Reset cart on any error to prevent crashes
      setCartItems([]);
      setCurrentMember(null);
      setEventName('');
    }
  };

  const saveCart = async () => {
    try {
      const cartData = {
        items: cartItems || [],
        member: currentMember || null,
        eventName: eventName || '',
      };
      
      let serialized;
      try {
        serialized = JSON.stringify(cartData);
      } catch (stringifyError) {
        console.error('Failed to stringify cart data:', stringifyError);
        return; // Don't save if we can't serialize
      }

      await AsyncStorage.setItem('@cart_data', serialized);
    } catch (error) {
      console.error('Error saving cart:', error);
      // Non-critical error - don't crash the app
    }
  };

  const addToCart = item => {
    try {
      // Validate item
      if (!item || typeof item !== 'object') {
        console.error('Invalid item to add to cart');
        return;
      }
      if (!item.id || !item.name) {
        console.error('Item must have id and name');
        return;
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        console.error('Item must have valid price');
        return;
      }

      const existingItemIndex = cartItems.findIndex(
        cartItem => cartItem && cartItem.id === item.id && cartItem.name === item.name,
      );

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const updatedCart = [...cartItems];
        const currentQty = updatedCart[existingItemIndex].quantity || 0;
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: currentQty + 1,
        };
        setCartItems(updatedCart);
      } else {
        // New item, add to cart with validated data
        const newItem = {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          category: item.category || 'custom',
          brand: item.brand || '',
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = itemId => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    try {
      if (!itemId) {
        console.error('Item ID is required');
        return;
      }
      
      const parsedQuantity = Number(newQuantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        console.error('Invalid quantity');
        return;
      }

      if (parsedQuantity === 0) {
        removeFromCart(itemId);
        return;
      }

      // Limit quantity to reasonable maximum
      const safeQuantity = Math.min(parsedQuantity, 999);

      const updatedCart = cartItems.map(item =>
        item && item.id === itemId ? {...item, quantity: safeQuantity} : item,
      );
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCurrentMember(null);
    setEventName('');
  };

  const setMember = member => {
    setCurrentMember(member);
  };

  const getCartTotal = () => {
    try {
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return 0;
      }
      return cartItems.reduce((total, item) => {
        if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
          return total;
        }
        return total + (item.price * item.quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  };

  const getCartItemCount = () => {
    try {
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return 0;
      }
      return cartItems.reduce((count, item) => {
        if (!item || typeof item.quantity !== 'number') {
          return count;
        }
        return count + item.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating item count:', error);
      return 0;
    }
  };

  const getTaxAmount = (taxRate = 0.08) => {
    try {
      const rate = Number(taxRate);
      if (isNaN(rate) || rate < 0 || rate > 1) {
        console.error('Invalid tax rate, using default 0.08');
        return getCartTotal() * 0.08;
      }
      return getCartTotal() * rate;
    } catch (error) {
      console.error('Error calculating tax:', error);
      return 0;
    }
  };

  const getGrandTotal = (taxRate = 0.08) => {
    try {
      return getCartTotal() + getTaxAmount(taxRate);
    } catch (error) {
      console.error('Error calculating grand total:', error);
      return 0;
    }
  };

  const value = {
    cartItems,
    currentMember,
    eventName,
    setEventName,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setMember,
    getCartTotal,
    getCartItemCount,
    getTaxAmount,
    getGrandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
