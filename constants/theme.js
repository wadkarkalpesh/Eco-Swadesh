import { Platform } from 'react-native';

export const COLORS = {
  // Brand Palette
  primary: '#1E4D2B', // Deep Forest Green
  primaryDark: '#12361C',
  primaryLight: '#2E7D32', // Vibrant Leaf Green
  accent: '#4CAF50', // Emerald Green
  accentLight: '#E8F5E9', // Soft Mint Background
  
  // Secondary Earth Colors
  earth: '#5D4037', // Warm Soil Brown
  earthLight: '#8D6E63',
  sunGold: '#FFA000', // Sun Harvest Amber
  govGold: '#C5A059', // Official Government Seal Gold
  
  // Specialty Status & Functional
  trustBlue: '#1976D2', // Certified Trust Blue
  logisticsPurple: '#673AB7', // Freight & Logistics Purple
  terracotta: '#D84315', // Bulk Direct Trade Orange/Red
  
  // Neutral Surfaces
  background: '#F4F7F4',
  card: '#FFFFFF',
  cardAlt: '#F9FBF9',
  border: '#E2E8E2',
  borderDark: '#C8D4C8',
  
  // Typography Colors
  textPrimary: '#1A2E1E',
  textSecondary: '#5A6E5D',
  textMuted: '#8A9E8C',
  textLight: '#FFFFFF',
  
  // Statuses
  success: '#2E7D32',
  warning: '#F57C00',
  danger: '#D32F2F',
  info: '#0288D1',

  // Dark Surface Overlays
  overlay: 'rgba(18, 30, 21, 0.5)',
};

// Backward-compatibility export for Expo starter hooks (use-theme-color)
export const Colors = {
  light: {
    text: '#1A2E1E',
    background: '#F4F7F4',
    tint: '#1E4D2B',
    icon: '#5A6E5D',
    tabIconDefault: '#8A9E8C',
    tabIconSelected: '#1E4D2B',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121E15',
    tint: '#4CAF50',
    icon: '#8A9E8C',
    tabIconDefault: '#8A9E8C',
    tabIconSelected: '#4CAF50',
  },
};

export const SHADOWS = {
  small: Platform.select({
    web: {
      boxShadow: '0 2px 4px rgba(30, 77, 43, 0.08)',
    },
    default: {
      shadowColor: '#1E4D2B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  }),
  medium: Platform.select({
    web: {
      boxShadow: '0 4px 8px rgba(30, 77, 43, 0.12)',
    },
    default: {
      shadowColor: '#1E4D2B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  }),
  large: Platform.select({
    web: {
      boxShadow: '0 8px 16px rgba(30, 77, 43, 0.16)',
    },
    default: {
      shadowColor: '#1E4D2B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
  }),
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export default {
  COLORS,
  Colors,
  SHADOWS,
  SPACING,
  RADIUS,
};
