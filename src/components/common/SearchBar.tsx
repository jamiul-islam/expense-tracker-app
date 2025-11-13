/**
 * SearchBar Component - Debounced search input for filtering transactions
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  containerStyle,
}) => {
  const [searchText, setSearchText] = useState('');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchText);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchText, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setSearchText('');
    onSearch('');
  }, [onSearch]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search-outline" size={20} color={colors.text.tertiary} style={styles.icon} />
      <RNTextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={searchText}
        onChangeText={setSearchText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    padding: spacing.xs,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    color: colors.text.primary,
    flex: 1,
    fontSize: typography.fontSize.sm,
    height: 24,
    padding: 0,
  },
});

export default SearchBar;
