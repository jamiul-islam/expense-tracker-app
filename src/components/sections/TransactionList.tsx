/**
 * TransactionList Component - List of transactions with date grouping
 */

import React from 'react';
import { View, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Text } from '../common/Text';
import { TransactionItem } from './TransactionItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Transaction } from '@/types/database';

interface TransactionSection {
  title: string;
  data: Transaction[];
}

interface TransactionListProps {
  sections: TransactionSection[];
  onTransactionPress?: (transaction: Transaction) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  sections,
  onTransactionPress,
  onRefresh,
  refreshing = false,
  loading = false,
  emptyMessage = 'No transactions found',
}) => {
  if (loading && sections.length === 0) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} onPress={onTransactionPress} />}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
  },
  sectionHeader: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  separator: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: spacing['3xl'] + spacing.lg,
  },
});

export default TransactionList;
