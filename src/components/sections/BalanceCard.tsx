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
    <LinearGradient
      colors={[colors.gradient.balance.start, colors.gradient.balance.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
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
          <View>
            <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
          </View>
        ) : (
          <View>
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
          <View style={styles.summaryIconContainer}>
            <Icon name="arrow-down-outline" size="sm" color={colors.success} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(income)}</Text>
          </View>
        </View>

        {/* Expense Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="arrow-up-outline" size="sm" color={colors.danger} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(expense)}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  balanceAmount: {
    color: colors.primaryText,
    fontSize: 30,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm,
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
  },
  card: {
    borderColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.xl,
    shadowColor: '#172551',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  divider: {
    backgroundColor: colors.white,
    height: 1,
    marginVertical: spacing.lg,
    opacity: 0.3,
  },
  summaryAmount: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    padding: spacing.md,
    shadowColor: '#1E2C40',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    width: '48%',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
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
