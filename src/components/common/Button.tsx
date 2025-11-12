/**
 * Button Component - Reusable button with multiple variants
 * Follows tranzo_design_system_doc.md specifications
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  ...props
}) => {
  const isDisabled = disabled || loading;

  // Build button style based on variant and size
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.base];

    if (variant === 'primary') baseStyles.push(styles.primary);
    if (variant === 'secondary') baseStyles.push(styles.secondary);
    if (variant === 'danger') baseStyles.push(styles.danger);
    if (variant === 'text') baseStyles.push(styles.textVariant);

    if (size === 'sm') baseStyles.push(styles.sm);
    if (size === 'md') baseStyles.push(styles.md);
    if (size === 'lg') baseStyles.push(styles.lg);

    if (isDisabled) baseStyles.push(styles.disabled);
    if (style) baseStyles.push(style);

    return baseStyles;
  };

  // Build text style based on variant and size
  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [styles.baseText];

    if (variant === 'primary' || variant === 'danger') {
      baseStyles.push(styles.whiteText);
    } else {
      baseStyles.push(styles.coloredText);
    }

    if (size === 'sm') baseStyles.push(styles.smText);
    if (size === 'md') baseStyles.push(styles.mdText);
    if (size === 'lg') baseStyles.push(styles.lgText);

    if (isDisabled) baseStyles.push(styles.disabledText);
    if (textStyle) baseStyles.push(textStyle);

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: typography.fontWeight.semibold,
  },
  coloredText: {
    color: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  mdText: {
    fontSize: typography.fontSize.base,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.white,
    borderColor: colors.light,
    borderWidth: 1,
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },
  textVariant: {
    backgroundColor: 'transparent',
  },
  whiteText: {
    color: colors.white,
  },
});

export default Button;
