import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {AuthProvider} from './src/context/AuthContext';
import {CartProvider} from './src/context/CartContext';
import {SettingsProvider} from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';
import {theme} from './src/theme/theme';

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
