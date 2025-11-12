import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import { authService } from '@/services/authService';
import { useUserStore } from '@/store';

type Props = NativeStackScreenProps<any, 'OTPVerification'>;

export function OTPVerificationScreen({ navigation, route }: Props) {
  const { email } = route.params as { email: string };
  const setUser = useUserStore(state => state.setUser);

  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    // Handle paste - if multiple characters, split across inputs
    if (text.length > 1) {
      const pastedCode = text.slice(0, 8).split('');
      const newOtp = [...otp];
      pastedCode.forEach((char, i) => {
        if (index + i < 8 && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      setError('');

      // Auto-verify if we have 8 digits
      if (newOtp.every(digit => digit !== '')) {
        handleVerify(newOtp.join(''));
      } else {
        // Focus on next empty input
        const nextEmpty = newOtp.findIndex(digit => digit === '');
        if (nextEmpty !== -1 && nextEmpty < 8) {
          inputRefs.current[nextEmpty]?.focus();
        }
      }
      return;
    }

    // Only allow numbers
    if (text && !/^\d$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (text && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (text && index === 7 && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('');

    if (otpCode.length !== 8) {
      setError('Please enter all 8 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await authService.verifyOTP(email, otpCode);

      if (response.success && response.user) {
        setUser(response.user);
        console.log('✓ OTP verified, user set in store');
        // Navigation handled automatically by RootNavigator
      } else {
        setError(response.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await authService.sendOTP(email);

      if (response.success) {
        Alert.alert('Success', 'Verification code sent!');
        setOtp(['', '', '', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(response.error || 'Failed to resend code');
      }
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📧</Text>
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent an 8-digit code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                error && styles.otpInputError,
              ]}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.button, isVerifying && styles.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={isVerifying || otp.some(digit => !digit)}
          activeOpacity={0.8}
        >
          {isVerifying ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text style={[styles.resendLink, isResending && styles.resendLinkDisabled]}>
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Change Email */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeEmailButton}>
          <Text style={styles.changeEmailText}>Change Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  changeEmailButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeEmailText: {
    color: colors.text.secondary,
    fontSize: 14,
    textDecorationLine: 'underline',
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
  email: {
    color: colors.secondary,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
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
  otpContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginBottom: 16,
  },
  otpInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 2,
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '600',
    height: 56,
    textAlign: 'center',
    width: 42,
  },
  otpInputError: {
    borderColor: colors.error,
  },
  otpInputFilled: {
    borderColor: colors.secondary,
  },
  resendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resendLink: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: colors.text.secondary,
    fontSize: 14,
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
