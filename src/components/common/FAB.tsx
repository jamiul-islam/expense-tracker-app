/**
 * FAB (Floating Action Button) - Add new transaction button
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows } from '@/theme';

interface FABProps {
  onPress: () => void;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const FAB: React.FC<FABProps> = ({ onPress, style, icon = 'add' }) => {
  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={28} color={colors.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 34,
    bottom: 30,
    // elevation: 8,
    height: 68,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing['2xl'],
    width: 68,
    ...shadows.md,
  },
});

export default FAB;
