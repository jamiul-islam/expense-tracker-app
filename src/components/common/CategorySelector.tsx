/**
 * CategorySelector Component - Reusable category selection dropdown
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  placeholder?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelect,
  placeholder = 'Choose category',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCat = categories.find(cat => cat.id === selectedCategory);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryItemContent}>
          {selectedCat && (
            <Ionicons
              name={selectedCat.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={colors.text.primary}
              style={styles.categoryIcon}
            />
          )}
          <Text style={selectedCat ? styles.categoryDropdownText : styles.placeholderText}>
            {selectedCat ? selectedCat.name : placeholder}
          </Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.text.tertiary}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.categoryDropdownList}>
          <ScrollView style={styles.categoryScrollView} showsVerticalScrollIndicator={false}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryDropdownItem,
                  selectedCategory === cat.id && styles.categoryDropdownItemActive,
                ]}
                onPress={() => {
                  onSelect(cat.id);
                  setIsOpen(false);
                }}
              >
                <View style={styles.categoryItemContent}>
                  <Ionicons
                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={selectedCategory === cat.id ? colors.primary : colors.text.tertiary}
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryItemText,
                      selectedCategory === cat.id && styles.categoryItemTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </View>
                {selectedCategory === cat.id && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryDropdownItem: {
    alignItems: 'center',
    borderBottomColor: colors.background.secondary,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  categoryDropdownItemActive: {
    backgroundColor: colors.background.activeTab,
  },
  categoryDropdownList: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.xs,
    maxHeight: 200,
    ...shadows.sm,
  },
  categoryDropdownText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  categoryIcon: {
    marginRight: spacing.sm,
  },
  categoryItemContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  categoryItemText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  categoryItemTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryScrollView: {
    maxHeight: 180,
  },
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdown: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  placeholderText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
});

export default CategorySelector;
