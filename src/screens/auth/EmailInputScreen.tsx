import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TextInput } from '@/components';
import { colors } from '@/theme';
import { authService } from '@/services/authService';

type Props = NativeStackScreenProps<any, 'EmailInput'>;

export function EmailInputScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.sendOTP(email.trim());

      if (response.success) {
        // Navigate to OTP screen
        navigation.navigate('OTPVerification', { email: email.trim() });
      } else {
        setError(response.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💰</Text>
          </View>
          <Text style={styles.title}>Welcome to Tranzo</Text>
          <Text style={styles.subtitle}>
            Enter your email to get started with tracking your expenses
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.form}>
          <TextInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (error) setError('');
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={handleContinue}
            editable={!isLoading}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          We&apos;ll send you a verification code to confirm your email
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 40,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.secondary + '20',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
    width: 80,
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
});
