/**
 * BalanceCard Component - Displays total balance with show/hide toggle and income/expense summary
 * Follows tranzo_design_system_doc.md specifications
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '@/theme';
import { Text } from '../common/Text';
import { Icon } from '../common/Icon';

interface BalanceCardProps {
  totalBalance: number;
  income: number;
  expense: number;
  currency?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  income,
  expense,
  currency = 'USD',
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const toggleBalanceVisibility = (): void => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#E0F2FE', '#7DD3FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative circles - matching Figma */}
        <View style={styles.decorativeCircleLeft} />
        <View style={styles.decorativeCircleRight} />

        {/* Total Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
            <TouchableOpacity
              onPress={toggleBalanceVisibility}
              style={styles.visibilityButton}
              activeOpacity={0.7}
            >
              <Icon
                name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size="md"
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {isBalanceVisible ? (
            <View style={styles.balanceAmountContainer}>
              <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
            </View>
          ) : (
            <View style={styles.balanceAmountContainer}>
              <Text style={styles.balanceAmount}>••••••</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Income & Expense Summary */}
        <View style={styles.summaryContainer}>
          {/* Income Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Income</Text>
              <View style={styles.incomeIconCircle}>
                <Text style={styles.incomeArrow}>↑</Text>
              </View>
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(income)}</Text>
          </View>

          {/* Expense Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <View style={styles.expenseIconCircle}>
                <Text style={styles.expenseArrow}>↓</Text>
              </View>
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(expense)}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceAmount: {
    color: colors.primaryText,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 30,
    fontWeight: typography.fontWeight.bold,
  },
  balanceAmountContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: spacing.sm,
    minHeight: 45,
    paddingRight: spacing.lg,
  },
  balanceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  balanceSection: {
    paddingBottom: spacing.md,
    zIndex: 2,
  },
  card: {
    borderColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.xl,
    position: 'relative',
    shadowColor: '#172551',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  decorativeCircleLeft: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 55,
    height: 110,
    left: -9,
    position: 'absolute',
    top: 11,
    width: 110,
  },
  decorativeCircleRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 68,
    height: 136,
    position: 'absolute',
    right: -57,
    top: 24,
    width: 136,
  },
  divider: {
    backgroundColor: colors.white,
    height: 1,
    marginVertical: spacing.lg,
    opacity: 0.3,
    zIndex: 2,
  },
  expenseArrow: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
  },
  expenseIconCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    marginRight: spacing.xs,
    width: 16,
  },
  incomeArrow: {
    color: colors.success,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
  },
  incomeIconCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(22, 194, 84, 0.1)',
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    marginRight: spacing.xs,
    width: 16,
  },
  summaryAmount: {
    color: colors.primaryText,
    flex: 1,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 1,
    flex: 1,
    padding: spacing.md,
    shadowColor: '#1E2C40',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    zIndex: 2,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
  },
  visibilityButton: {
    padding: spacing.xs,
  },
});

export default BalanceCard;
