/**
 * Color System - Tranzo Design System
 * Based on tranzo_design_system_doc.md + Figma design specifications
 */

export const colors = {
  // Semantic Colors (from design system)
  primary: '#1A1F4B', // Dark Navy (design system)
  primaryDark: '#092449', // From Figma
  primaryText: '#1E1852', // Dark primary text from Figma
  secondary: '#5B4EFF',
  success: '#16C254', // Updated from Figma
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  light: '#F3F4F6',
  white: '#FFFFFF',

  // Text Colors (Figma-based with fallbacks)
  text: {
    primary: '#0F0D27', // Black text from Figma
    secondary: '#52515D', // Text grey from Figma
    tertiary: '#6A697A', // Inactive text from Figma
    light: '#9CA3AF',
    percentage: '#565E7F', // Percentage text color from Figma
    dailyTotal: '#8B8E99', // Daily total grey from Figma
  },

  // Background Colors
  background: {
    primary: '#F9FAFB', // Light gray
    secondary: '#F3F4F6',
    card: '#FFFFFF',
    iconCircle: '#E8E8E8', // From Figma
    activeTab: '#EDF7F7', // Active tab background from Figma
  },

  // Gradient Colors
  gradient: {
    balance: {
      start: '#E0F2FE',
      end: '#60A5FA',
    },
    success: '#10B981',
    warning: '#F59E0B',
    secondary: '#8B5CF6',
  },

  // Chart/Category Colors (Updated from Figma)
  chart: {
    grocery: '#F5CD47', // Yellow from Figma
    transport: '#3D8BFD', // Blue from Figma
    entertainment: '#B18DFD', // Purple from Figma
    medicine: '#EC4899',
    education: '#3B82F6',
    rent: '#1E40AF',
    shopping: '#FB7185',
    others: '#94A3B8',
  },

  // Utility Colors
  border: '#E5E7EB',
  divider: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  infoBlue: '#3B5A80', // From Figma
};

export default colors;
