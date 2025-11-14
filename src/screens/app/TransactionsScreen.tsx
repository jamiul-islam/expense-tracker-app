/**
 * TransactionsScreen - Complete transaction management
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, SectionList, RefreshControl, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, shadows, borderRadius } from '@/theme';
import { useTransactionStore, useUIStore, useUserStore } from '@/store';
import type { Transaction } from '@/types/database';
import { LoadingSpinner, ScreenHeader } from '@/components';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterButton } from '@/components/common/FilterButton';
import { FAB } from '@/components/common/FAB';
import { FilterModal, FilterOptions } from '@/components/modals/FilterModal';
import { TransactionDetailsModal } from '@/components/modals/TransactionDetailsModal';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { EditTransactionModal } from '@/components/modals/EditTransactionModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { TransactionItem } from '@/components/sections/TransactionItem';

interface TransactionSection {
  date: string;
  total: number;
  data: Transaction[];
}

export const TransactionsScreen: React.FC = () => {
  const {
    transactions,
    isLoading,
    filters,
    selectedTransaction,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setSelectedTransaction,
    setFilters,
    clearFilters: _clearFilters,
  } = useTransactionStore();

  const { openModals, searchQuery, openModal, closeModal, setSearchQuery } = useUIStore();
  const { user } = useUserStore();

  const [_isDeleting, setIsDeleting] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  // Convert FilterOptions to TransactionFilters
  const convertFilterOptions = useCallback((filterOptions: FilterOptions) => {
    return {
      type: filterOptions.type === 'all' ? undefined : filterOptions.type,
      category: filterOptions.category === 'all' ? undefined : filterOptions.category,
      dateFrom: filterOptions.dateFrom,
      dateTo: filterOptions.dateTo,
      amountMin: filterOptions.amountMin,
      amountMax: filterOptions.amountMax,
    };
  }, []);

  // Handle filter application
  const handleApplyFilters = useCallback((filterOptions: FilterOptions) => {
    const transactionFilters = convertFilterOptions(filterOptions);
    setFilters(transactionFilters);
  }, [convertFilterOptions, setFilters]);

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Refetch when filters change
  useEffect(() => {
    fetchTransactions();
  }, [filters, fetchTransactions]);

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;

    const query = searchQuery.toLowerCase();
    return transactions.filter(
      t =>
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.note?.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  // Group transactions by date
  const sections = useMemo<TransactionSection[]>(() => {
    const grouped = new Map<string, Transaction[]>();

    filteredTransactions.forEach(transaction => {
      const date = transaction.date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(transaction);
    });

    return Array.from(grouped.entries())
      .map(([date, data]) => {
        const total = data.reduce((sum, t) => {
          return sum + (t.type === 'income' ? t.amount : -t.amount);
        }, 0);
        return { date, total, data };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredTransactions]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.type ||
      filters.category ||
      filters.dateFrom ||
      filters.dateTo ||
      (filters.amountMin !== undefined && filters.amountMin > 0) ||
      (filters.amountMax !== undefined && filters.amountMax < 10000)
    );
  }, [filters]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, [fetchTransactions]);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      openModal('transactionDetails');
    },
    [setSelectedTransaction, openModal]
  );

  const handleEditPress = useCallback(() => {
    closeModal('transactionDetails');
    openModal('editTransaction');
  }, [closeModal, openModal]);

  const handleDeletePress = useCallback(() => {
    closeModal('transactionDetails');
    openModal('deleteConfirmation');
  }, [closeModal, openModal]);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedTransaction) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(selectedTransaction.id);
      closeModal('deleteConfirmation');
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedTransaction, deleteTransaction, closeModal, setSelectedTransaction]);

  const renderSectionHeader = useCallback(({ section }: { section: TransactionSection }) => {
    const date = new Date(section.date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();

    let dateLabel = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (isToday) dateLabel = 'Today';
    else if (isYesterday) dateLabel = 'Yesterday';

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionDate}>{dateLabel}</Text>
        <Text
          style={[
            styles.sectionTotal,
            section.total >= 0 ? styles.sectionTotalPositive : styles.sectionTotalNegative,
          ]}
        >
          {section.total >= 0 ? '+' : ''}${Math.abs(section.total).toFixed(2)}
        </Text>
      </View>
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem transaction={item} onPress={handleTransactionPress} />
    ),
    [handleTransactionPress]
  );

  const renderEmptyState = useCallback(() => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {searchQuery
            ? 'No transactions found'
            : hasActiveFilters
              ? 'No transactions match your filters'
              : 'No transactions yet'}
        </Text>
        <Text style={styles.emptyStateSubtext}>
          {searchQuery || hasActiveFilters
            ? 'Try adjusting your search or filters'
            : 'Tap the + button to add your first transaction'}
        </Text>
      </View>
    );
  }, [isLoading, searchQuery, hasActiveFilters]);

  if (isLoading && transactions.length === 0) {
    return (
      <LinearGradient
        colors={[colors.background.gradientStart, colors.background.gradientEnd]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <ScreenHeader
            userName="Transactions"
            avatarUrl={user?.avatar_url}
            hasNotification={false}
            hideGreeting
          />
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          userName="Transactions"
          avatarUrl={user?.avatar_url}
          hasNotification={false}
          hideGreeting
        />

        {/* Search & Filter */}
        <View style={styles.searchContainer}>
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search transaction by title or category"
            containerStyle={styles.searchBar}
          />
          <FilterButton
            hasActiveFilters={hasActiveFilters}
            onPress={() => openModal('filterTransaction')}
          />
        </View>

        {/* Transactions Card */}
        <View style={styles.transactionsCard}>
          <Text style={styles.cardTitle}>Transactions</Text>
          {/* Transactions List */}
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
          />
        </View>

        {/* Floating Action Button */}
        <FAB icon="add" onPress={() => openModal('addTransaction')} />
      </SafeAreaView>

      {/* Modals */}
      <FilterModal
        visible={openModals.has('filterTransaction')}
        onClose={() => closeModal('filterTransaction')}
        onApply={handleApplyFilters}
        initialFilters={{
          type: filters.type || 'all',
          category: filters.category || 'all',
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          amountMin: filters.amountMin,
          amountMax: filters.amountMax,
        }}
      />

      <TransactionDetailsModal
        visible={openModals.has('transactionDetails')}
        transaction={selectedTransaction}
        onClose={() => closeModal('transactionDetails')}
        onEdit={handleEditPress}
        onDelete={handleDeletePress}
      />

      <AddTransactionModal
        visible={openModals.has('addTransaction')}
        onClose={() => closeModal('addTransaction')}
        onAdd={addTransaction}
        userId={user?.id || ''}
      />

      <EditTransactionModal
        visible={openModals.has('editTransaction')}
        transaction={selectedTransaction}
        onClose={() => closeModal('editTransaction')}
        onUpdate={updateTransaction}
      />

      <DeleteConfirmationModal
        visible={openModals.has('deleteConfirmation')}
        onClose={() => closeModal('deleteConfirmation')}
        onConfirm={handleConfirmDelete}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.primaryText,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  container: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
  },
  emptyStateSubtext: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  gradient: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionDate: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTotal: {
    color: colors.text.dailyTotal,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  sectionTotalNegative: {
    color: colors.text.dailyTotal,
  },
  sectionTotalPositive: {
    color: colors.text.dailyTotal,
  },
  transactionsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    flex: 1,
    marginBottom: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.lg,
    ...shadows.card,
  },
});

export default TransactionsScreen;
