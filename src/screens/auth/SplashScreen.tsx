import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '@/store';
import { authService } from '@/services/authService';
import { colors } from '@/theme';
import type { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  App: undefined;
};

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait minimum 3 seconds for splash screen
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 3000);
      });

      // Check authentication status
      const authResponse = await authService.checkAuthStatus();

      if (authResponse.success && authResponse.user) {
        setUser(authResponse.user);
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💰</Text>
        </View>
        <Text style={styles.title}>Tranzo</Text>
        <Text style={styles.subtitle}>Track Your Expenses</Text>
      </View>

      {/* Loading Indicator */}
      <ActivityIndicator 
        size="large" 
        color={colors.secondary} 
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  loader: {
    marginTop: 32,
  },
});
