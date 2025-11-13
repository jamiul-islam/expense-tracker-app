/**
 * TransactionItem Component - Individual transaction list item
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Text } from '../common/Text';
import { Icon } from '../common/Icon';
import type { Transaction } from '@/types/database';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

// Map category to icon name
const getCategoryIcon = (
  category: string
): keyof typeof import('@expo/vector-icons').Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof import('@expo/vector-icons').Ionicons.glyphMap> = {
    Grocery: 'cart-outline',
    Transport: 'car-outline',
    Entertainment: 'game-controller-outline',
    Medicine: 'medkit-outline',
    Education: 'school-outline',
    Rent: 'home-outline',
    Shopping: 'bag-outline',
    Income: 'trending-up-outline',
    Salary: 'cash-outline',
  };
  return iconMap[category] || 'ellipse-outline';
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(transaction)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={getCategoryIcon(transaction.category)} size="md" color={colors.primary} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={isIncome ? styles.incomeAmount : styles.expenseAmount}>
          {isIncome ? '+' : '-'}
          {formatCurrency(Math.abs(transaction.amount))}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  category: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  expenseAmount: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.iconCircle,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 40,
  },
  incomeAmount: {
    color: colors.success,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
  },
});

export default TransactionItem;
