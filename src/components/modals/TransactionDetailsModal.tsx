/**
 * TransactionDetailsModal - Display transaction details
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { Button } from '@/components/common/Button';
import type { Transaction } from '@/types/database';

interface TransactionDetailsModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Grocery: 'cart',
  Transport: 'car',
  Entertainment: 'musical-notes',
  Medicine: 'medkit',
  Education: 'school',
  Shopping: 'bag-handle',
  Income: 'cash',
};

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  visible,
  transaction,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const iconName = CATEGORY_ICONS[transaction.category] || 'pricetag';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Transaction Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Icon and Amount */}
            <View style={styles.mainInfo}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={iconName as keyof typeof Ionicons.glyphMap}
                  size={32}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.amount, transaction.type === 'income' && styles.amountIncome]}>
                {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
              </Text>
              <Text style={styles.category}>{transaction.category}</Text>
              <Text style={styles.date}>{formatDate(transaction.date)}</Text>
            </View>

            {/* Transaction Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Overview</Text>
              <View style={styles.overviewCard}>
                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Type</Text>
                  <Text style={styles.overviewValue}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Text>
                </View>
                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Title</Text>
                  <Text style={styles.overviewValue}>{transaction.title}</Text>
                </View>
                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Category</Text>
                  <Text style={styles.overviewValue}>{transaction.category}</Text>
                </View>
                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      styles[
                        `status${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}`
                      ],
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Text>
                  </View>
                </View>
                {transaction.note && (
                  <View style={styles.overviewRow}>
                    <Text style={styles.overviewLabel}>Note</Text>
                    <Text style={styles.overviewValueNote}>{transaction.note}</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Delete"
              variant="danger"
              onPress={() => onDelete(transaction)}
              style={styles.actionButton}
            />
            <Button
              title="Edit"
              variant="primary"
              onPress={() => onEdit(transaction)}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
  },
  actions: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  amount: {
    color: colors.danger,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md,
  },
  amountIncome: {
    color: colors.success,
  },
  category: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  date: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.iconCircle,
    borderRadius: 50,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  mainInfo: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    height: '75%',
    marginTop: 'auto',
    ...shadows.card,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  overviewLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  overviewRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  overviewValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  overviewValueNote: {
    color: colors.text.secondary,
    flex: 1,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  statusBadge: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default TransactionDetailsModal;
