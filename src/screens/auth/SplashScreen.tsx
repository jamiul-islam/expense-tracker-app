import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useUserStore } from '@/store';
import { authService } from '@/services/authService';
import { colors } from '@/theme';

export function SplashScreen() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      // Check authentication status
      const authResponse = await authService.checkAuthStatus();

      if (authResponse.success && authResponse.user) {
        setUser(authResponse.user);
      }
      // If no user, RootNavigator will show EmailInput automatically
    };

    checkAuth();
  }, [setUser]);

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
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 60,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 128,
    justifyContent: 'center',
    marginBottom: 16,
    width: 128,
  },
  loader: {
    marginTop: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 18,
  },
  title: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
