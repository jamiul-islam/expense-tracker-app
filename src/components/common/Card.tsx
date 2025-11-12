/**
 * Card Component - Reusable card container with variants
 * Follows tranzo_design_system_doc.md specifications
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';

type CardVariant = 'default' | 'gradient' | 'outline';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
  const getCardStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.base];

    if (variant === 'default') baseStyles.push(styles.defaultVariant);
    if (variant === 'gradient') baseStyles.push(styles.gradientVariant);
    if (variant === 'outline') baseStyles.push(styles.outlineVariant);

    if (style) baseStyles.push(style);

    return baseStyles;
  };

  return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  defaultVariant: {
    backgroundColor: colors.background.card,
    ...shadows.sm,
  },
  gradientVariant: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.md,
  },
  outlineVariant: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
});

export default Card;
