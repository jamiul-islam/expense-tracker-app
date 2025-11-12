/**
 * Design Tokens - Spacing, Typography, Shadows
 * Based on tranzo_design_system_doc.md
 */

// Spacing Scale (4px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

// Border Radius (Figma-based)
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 10, // Summary boxes (Figma)
  lg: 20, // Cards (Figma)
  pill: 40, // Active tab (Figma)
  full: 999,
};

// Typography (Figma-based: Inter Display)
export const typography = {
  fontFamily: {
    regular: 'Inter Display',
    medium: 'Inter Display',
    semibold: 'Inter Display',
    bold: 'Inter Display',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 30, // Updated from Figma (balance amount)
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    xs: 18,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
  },
};

// Shadows (React Native - Figma-based)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  card: {
    // Figma: 0px 4px 6px rgba(23,37,81,0.07)
    shadowColor: '#172551',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryBox: {
    // Figma: 0px 1px 0px rgba(30,44,64,0.05)
    shadowColor: '#1E2C40',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,
    elevation: 1,
  },
  bottomNav: {
    // Figma: 0px 1px 4px rgba(15,14,51,0.04)
    shadowColor: '#0F0E33',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Layout Constants
export const layout = {
  screenPadding: 16,
  gap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  maxWidth: 600,
  headerHeight: 60,
  tabBarHeight: 60,
};

export default {
  spacing,
  borderRadius,
  typography,
  shadows,
  layout,
};
