import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50', // Green for farming theme
    secondary: '#8BC34A',
    tertiary: '#FFC107',
    error: '#F44336',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#66BB6A',
    secondary: '#9CCC65',
    tertiary: '#FFD54F',
    error: '#EF5350',
    background: '#121212',
    surface: '#1E1E1E',
  },
};

export default lightTheme;
