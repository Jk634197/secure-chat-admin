// Theme color constants for the application
export const themeColors = {
  // Primary colors
  primary: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  
  // Secondary colors
  secondary: {
    main: '#9C27B0',
    light: '#BA68C8',
    dark: '#7B1FA2',
    contrastText: '#FFFFFF',
  },

  // Error colors
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },

  // Warning colors
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },

  // Info colors
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },

  // Success colors
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },

  // Grey palette
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Common colors
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },

  // Background colors
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },

  // Text colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

// You can create custom color palettes for specific features
export const customPalettes = {
  sidebar: {
    background: themeColors.grey[100],
    textColor: themeColors.text.primary,
    activeItem: themeColors.primary.main,
  },
  header: {
    background: themeColors.common.white,
    textColor: themeColors.text.primary,
  },
  // Add more custom palettes as needed
};

// Function to get color with opacity
export const getColorWithOpacity = (color, opacity) => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
