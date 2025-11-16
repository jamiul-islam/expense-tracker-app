/**
 * Dashboard Screen - Home screen with balance, spending overview, and recent transactions
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '@/theme';
import {
  ScreenHeader,
  BalanceCard,
  DonutChart,
  TransactionItem,
  LoadingSpinner,
  Text,
  Card,
} from '@/components';
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

  const handleNotificationPress = () => {
    // TODO: Open notifications
    console.log('Notification pressed');
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Calculate top spending categories from actual transaction data
  const calculateTopSpending = () => {
    const categoryTotals: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const categoryArray = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));

    categoryArray.sort((a, b) => b.amount - a.amount);

    const top3 = categoryArray.slice(0, 3);
    const totalOfTop3 = top3.reduce((sum, item) => sum + item.amount, 0);

    // Map categories to their designated colors from Figma
    const colorMap: { [key: string]: string } = {
      Grocery: colors.chart.grocery, // Yellow #F5CD47
      Transport: colors.chart.transport, // Blue #3D8BFD
      Entertainment: colors.chart.entertainment, // Purple #B18DFD
      Medicine: colors.chart.medicine,
      Education: colors.chart.education,
      Dining: colors.chart.shopping, // Use shopping color for dining
      Utilities: colors.chart.others,
      // Add more mappings as needed
    };

    return top3.map(item => ({
      category: item.category,
      amount: item.amount,
      percentage: totalOfTop3 > 0 ? (item.amount / totalOfTop3) * 100 : 0,
      color: colorMap[item.category] || colors.chart.others, // Default to others color
    }));
  };

  const topSpendingData = calculateTopSpending();
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
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.gradientStart, colors.background.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }} // Approximates 170deg angle from Figma
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
              onNotificationPress={handleNotificationPress}
            />

            {/* Balance Card */}
            <BalanceCard totalBalance={totalBalance} income={totalIncome} expense={totalExpense} />

            {/* Top Spending Overview */}
            <DonutChart data={topSpendingData} totalSpent={totalSpent} />

            {/* Recent Transactions */}
            <Card style={styles.recentCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
              </View>

              {recentTransactionSections.length > 0 ? (
                <View style={styles.transactionsContent}>
                  {recentTransactionSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.dateGroup}>
                      {/* Date Header */}
                      <View style={styles.dateHeader}>
                        <Text style={styles.dateText}>{section.title}</Text>
                        <Text style={styles.dateTotalText}>
                          {formatCurrency(
                            section.data.reduce(
                              (sum, t) => sum + (t.type === 'expense' ? -t.amount : t.amount),
                              0
                            )
                          )}
                        </Text>
                      </View>

                      {/* Transactions for this date */}
                      {section.data.map((transaction, index) => (
                        <React.Fragment key={transaction.id}>
                          <TransactionItem transaction={transaction} onPress={() => {}} />
                          {index < section.data.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                      ))}
                    </View>
                  ))}

                  {/* See More Button */}
                  <TouchableOpacity style={styles.seeMoreButton} onPress={() => {}}>
                    <Text style={styles.seeMoreText}>See more transactions</Text>
                    <View style={styles.arrowIcon}>
                      <Text style={styles.arrowText}>›</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No recent transactions</Text>
                  <Text style={styles.emptySubtext}>
                    Your transactions will appear here once you add them
                  </Text>
                </View>
              )}
            </Card>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));
};

const styles = StyleSheet.create({
  arrowIcon: {
    alignItems: 'center',
    // height: 14,
    justifyContent: 'center',
    marginLeft: spacing.xs,
    width: 14,
  },
  arrowText: {
    color: colors.infoBlue,
    fontSize: 24,
    fontWeight: '600',
    transform: [{ rotate: '90deg' }],
  },
  container: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: spacing.md,
  },
  dateHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dateText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dateTotalText: {
    color: colors.text.dailyTotal,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginLeft: spacing['3xl'] + spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptySubtext: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  gradient: {
    flex: 1,
  },
  recentCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: spacing['3xl'],
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingBottom: spacing.md,
    shadowColor: '#172551',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  safeArea: {
    flex: 1,
  },
  sectionHeader: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  seeMoreButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingLeft: spacing.lg,
  },
  seeMoreText: {
    color: colors.infoBlue,
    fontSize: 12,
    fontWeight: '400',
  },
  transactionsContent: {
    paddingHorizontal: spacing.lg,
  },
});
