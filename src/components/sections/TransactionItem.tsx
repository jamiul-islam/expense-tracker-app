/**
 * TransactionItem Component - Individual transaction list item
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(transaction)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconWrapper, { backgroundColor: colors.light }]}>
          <Icon name={getCategoryIcon(transaction.category)} size="md" color={colors.primary} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={isIncome ? styles.incomeAmount : styles.expenseAmount}>
          {isIncome ? '+' : '-'}
          {formatCurrency(Math.abs(transaction.amount))}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  amountContainer: {
    alignItems: 'flex-end',
  },
  category: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  date: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  expenseAmount: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  incomeAmount: {
    color: colors.success,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});

export default TransactionItem;
