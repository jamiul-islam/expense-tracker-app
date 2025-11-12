import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput as RNTextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { TextInput } from '@/components/common/TextInput';
import { useUserStore } from '@/store';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';
import { colors } from '@/theme';

type RootStackParamList = {
  App: undefined;
  SignUp: undefined;
};

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const setUser = useUserStore(state => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef<RNTextInput>(null);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (response.success && response.user) {
        // Set user in store - navigation will handle automatically
        setUser(response.user);
        console.log('✓ Login successful, user set in store');

        if (rememberMe) {
          await storage.setRememberMe(true);
          await storage.setUserId(response.user.id);
        }
      } else {
        setErrors({
          email: response.error || 'Login failed',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        email: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💰</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Tranzo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!isLoading}
          />

          <TextInput
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            error={errors.password}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!isLoading}
          />

          {/* Remember Me */}
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={isLoading}
          >
            <View style={styles.checkbox}>
              {rememberMe && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={isLoading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginRight: 8,
    width: 20,
  },
  checkboxInner: {
    backgroundColor: colors.secondary,
    borderRadius: 2,
    height: 12,
    width: 12,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  form: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  icon: {
    fontSize: 40,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  rememberMeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  rememberMeText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  signUpContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpLink: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  signUpText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
