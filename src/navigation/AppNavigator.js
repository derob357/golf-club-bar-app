import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import MemberLookupScreen from '../screens/main/MemberLookupScreen';
import DrinkMenuScreen from '../screens/main/DrinkMenuScreen';
import CartScreen from '../screens/main/CartScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import ReportsScreen from '../screens/main/ReportsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

import {useAuth} from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#1B5E20'},
      headerTintColor: '#fff',
      headerTitleStyle: {fontWeight: 'bold'},
    }}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{title: 'Create Account'}}
    />
  </Stack.Navigator>
);

const MainTabs = () => {
  const {isManager} = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Orders':
              iconName = 'cart';
              break;
            case 'Reports':
              iconName = 'chart-bar';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1B5E20',
        tabBarInactiveTintColor: '#757575',
        headerStyle: {backgroundColor: '#1B5E20'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Orders"
        component={OrderStack}
        options={{headerShown: false}}
      />
      {isManager() && (
        <Tab.Screen name="Reports" component={ReportsScreen} />
      )}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const OrderStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#1B5E20'},
      headerTintColor: '#fff',
      headerTitleStyle: {fontWeight: 'bold'},
    }}>
    <Stack.Screen
      name="MemberLookup"
      component={MemberLookupScreen}
      options={{title: 'Member Lookup'}}
    />
    <Stack.Screen
      name="DrinkMenu"
      component={DrinkMenuScreen}
      options={{title: 'Select Drinks'}}
    />
    <Stack.Screen name="Cart" component={CartScreen} options={{title: 'Cart'}} />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{title: 'Complete Order'}}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return null; // Or a loading screen component
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
