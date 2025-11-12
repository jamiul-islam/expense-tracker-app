/**
 * ScreenHeader Component - App header with greeting, username, notification, and avatar
 * Follows tranzo_design_system_doc.md specifications
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { Text } from '../common/Text';
import { Icon } from '../common/Icon';

interface ScreenHeaderProps {
  greeting?: string;
  userName: string;
  avatarUrl?: string | null;
  hasNotification?: boolean;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  greeting = 'Good Morning 👋',
  userName,
  avatarUrl,
  hasNotification = false,
  onNotificationPress,
  onAvatarPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.rightSection}>
        {/* Notification Bell */}
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
          <Icon name="notifications-outline" size="md" color={colors.text.primary} />
          {hasNotification && <View style={styles.notificationBadge} />}
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity style={styles.avatarButton} onPress={onAvatarPress}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size="md" color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: borderRadius.full,
    height: 40,
    width: 40,
  },
  avatarButton: {
    marginLeft: spacing.md,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greeting: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  leftSection: {
    flex: 1,
  },
  notificationBadge: {
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    height: 8,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 8,
  },
  notificationButton: {
    padding: spacing.xs,
  },
  rightSection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.xs,
  },
});

export default ScreenHeader;
