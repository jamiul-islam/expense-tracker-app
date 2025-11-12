/**
 * Dashboard Screen - Home screen with balance, spending overview, and recent transactions
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { colors, spacing } from '@/theme';
import { ScreenHeader, BalanceCard, DonutChart, LoadingSpinner, Text } from '@/components';
import { useUserStore } from '@/store/userStore';
import { useTransactionStore } from '@/store/transactionStore';
import type { Transaction } from '@/types/database';

export default function DashboardScreen() {
  const user = useUserStore(state => state.user);
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Top spending categories (mock data for now)
  const topSpendingData = [
    {
      category: 'Grocery',
      amount: 612.3,
      percentage: 16.6,
      color: colors.chart.grocery,
    },
    {
      category: 'Transport',
      amount: 478.55,
      percentage: 21.2,
      color: colors.chart.transport,
    },
    {
      category: 'Entertainment',
      amount: 395.2,
      percentage: 13.7,
      color: colors.chart.entertainment,
    },
  ];

  const totalSpent = topSpendingData.reduce((sum, item) => sum + item.amount, 0);

  // Group recent transactions by date
  const groupTransactionsByDate = (trans: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};

    trans.slice(0, 6).forEach(transaction => {
      const date = new Date(transaction.date);
      const dateKey = date
        .toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
        .toUpperCase();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  };

  const recentTransactionSections = groupTransactionsByDate(transactions);

  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <ScreenHeader
          greeting="Good Morning 👋"
          userName={user?.full_name || 'User'}
          avatarUrl={user?.avatar_url}
          hasNotification={false}
        />

        {/* Balance Card */}
        <BalanceCard totalBalance={totalBalance} income={totalIncome} expense={totalExpense} />

        {/* Top Spending Overview */}
        <DonutChart data={topSpendingData} totalSpent={totalSpent} />

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>
          {recentTransactionSections.length > 0 ? (
            <View style={styles.transactionsContainer}>
              {recentTransactionSections.map(section => (
                <View key={section.title}>
                  <Text style={styles.dateHeader}>{section.title}</Text>
                  {section.data.map(transaction => (
                    <View key={transaction.id} style={styles.transactionWrapper}>
                      {/* Transaction item will go here */}
                      <Text style={styles.transactionText}>
                        {transaction.title} - ${transaction.amount}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recent transactions</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    flex: 1,
  },
  dateHeader: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  recentSection: {
    marginTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  transactionText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  transactionWrapper: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  transactionsContainer: {
    marginTop: spacing.sm,
  },
});
