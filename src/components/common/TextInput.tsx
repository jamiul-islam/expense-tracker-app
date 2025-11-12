import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors } from '@/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, containerStyle, style, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={colors.text.tertiary}
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text.primary,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
