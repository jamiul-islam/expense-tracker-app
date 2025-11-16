/**
 * Profile Screen - User profile with settings and logout
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { colors, spacing, borderRadius, shadows, typography } from '@/theme';
import { Text, Icon } from '@/components';
import { useUserStore } from '@/store/userStore';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage spending alerts & reminders',
      icon: 'notifications-outline' as const,
      onPress: () => {
        // TODO: Navigate to notifications settings
        Alert.alert('Coming Soon', 'Notification settings will be available soon');
      },
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      subtitle: 'Biometric lock & password',
      icon: 'lock-closed-outline' as const,
      onPress: () => {
        // TODO: Navigate to security settings
        Alert.alert('Coming Soon', 'Security settings will be available soon');
      },
    },
    {
      id: 'currency',
      title: 'Currency',
      subtitle: 'USD - United States Dollar',
      icon: 'cash-outline' as const,
      onPress: () => {
        // TODO: Navigate to currency settings
        Alert.alert('Coming Soon', 'Currency settings will be available soon');
      },
    },
  ];

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.gradientStart, colors.background.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Info Card */}
            <View style={styles.profileCard}>
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size="xl" color={colors.white} />
                </View>
              )}
              <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>

            {/* Settings Card */}
            <View style={styles.settingsCard}>
              {settingsOptions.map((option, index) => (
                <React.Fragment key={option.id}>
                  <TouchableOpacity
                    style={styles.settingsItem}
                    onPress={option.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.settingsIconContainer}>
                      <Ionicons
                        name={option.icon}
                        size={22}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.settingsContent}>
                      <Text style={styles.settingsTitle}>{option.title}</Text>
                      <Text style={styles.settingsSubtitle}>{option.subtitle}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.text.tertiary}
                    />
                  </TouchableOpacity>
                  {index < settingsOptions.length - 1 && (
                    <View style={styles.settingsDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.white} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerVersion}>Version {appVersion}</Text>
              <Text style={styles.footerText}>Made with ❤️ at University of London</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: borderRadius.full,
    height: 80,
    width: 80,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  backButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
    paddingVertical: spacing.lg,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  footerVersion: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerRight: {
    width: 40,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    ...shadows.md,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    paddingVertical: spacing['2xl'],
    ...shadows.card,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.xs,
    ...shadows.card,
  },
  settingsContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  settingsDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginLeft: spacing.lg + 40 + spacing.md,
  },
  settingsIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.iconCircle,
    borderRadius: borderRadius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  settingsItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  settingsSubtitle: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
  },
  settingsTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
  },
  userEmail: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.md,
  },
});
