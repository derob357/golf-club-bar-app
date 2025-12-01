import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2C5F2D', // DHGC Dark Green
    accent: '#D4AF37', // DHGC Gold
    background: '#F8F9F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    error: '#C62828',
    success: '#2C5F2D',
    warning: '#F57C00',
    info: '#1976D2',
    disabled: '#9E9E9E',
    placeholder: '#757575',
    backdrop: 'rgba(44, 95, 45, 0.5)',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Crimson Text',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Crimson Text',
      fontWeight: '600',
    },
    light: {
      fontFamily: 'Crimson Text',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Crimson Text',
      fontWeight: '200',
    },
  },
  roundness: 12,
};

// Custom fonts for headings (Cormorant Infant)
export const headingFont = {
  fontFamily: 'Cormorant Infant',
  fontWeight: 'bold',
};

export const headingFontRegular = {
  fontFamily: 'Cormorant Infant',
  fontWeight: '400',
};
