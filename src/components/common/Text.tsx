/**
 * Text Component - Reusable text with preset styles
 * Follows tranzo_design_system_doc.md specifications
 */

import React, { ReactNode } from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '@/theme';

type TextPreset = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';

interface TextProps {
  children: ReactNode;
  preset?: TextPreset;
  style?: TextStyle;
  color?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const Text: React.FC<TextProps> = ({
  children,
  preset = 'body',
  style,
  color,
  numberOfLines,
  ellipsizeMode,
}) => {
  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [];

    if (preset === 'h1') baseStyles.push(styles.h1);
    if (preset === 'h2') baseStyles.push(styles.h2);
    if (preset === 'h3') baseStyles.push(styles.h3);
    if (preset === 'body') baseStyles.push(styles.body);
    if (preset === 'label') baseStyles.push(styles.label);
    if (preset === 'caption') baseStyles.push(styles.caption);

    if (color) baseStyles.push({ color });
    if (style) baseStyles.push(style);

    return baseStyles;
  };

  return (
    <RNText style={getTextStyle()} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  body: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.base,
  },
  caption: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.xs,
  },
  h1: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight['3xl'],
  },
  h2: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight['2xl'],
  },
  h3: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.xl,
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.sm,
  },
});

export default Text;
