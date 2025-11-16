/**
 * FilterButton Component - Icon button to open filter modal
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '@/theme';

interface FilterButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  hasActiveFilters?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onPress,
  style,
  hasActiveFilters = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, hasActiveFilters && styles.active, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name="options-outline"
        size={24}
        color={hasActiveFilters ? colors.primary : colors.text.tertiary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.background.activeTab,
    borderColor: colors.primary,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
});

export default FilterButton;
