/**
 * Icon Component - Wrapper for vector icons
 * Follows tranzo_design_system_doc.md specifications
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: IconSize | number;
  color?: string;
}

const ICON_SIZES: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 56,
};

export const Icon: React.FC<IconProps> = ({ name, size = 'md', color = colors.text.primary }) => {
  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size];

  return <Ionicons name={name} size={iconSize} color={color} />;
};

export default Icon;
