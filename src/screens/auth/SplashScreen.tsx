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
