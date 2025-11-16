/**
 * TransactionDetailsModal - Display transaction details (Redesigned to match Figma)
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';
import type { Transaction } from '@/types/database';

interface TransactionDetailsModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
      month: 'short',
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
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Main Transaction Card */}
            <View style={styles.mainCard}>
              <View style={styles.mainCardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={iconName as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.mainInfoContent}>
                  <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
                  <Text style={styles.merchantName}>{transaction.title}</Text>
                </View>
                <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
              </View>
            </View>

            {/* Transaction Overview Card */}
            <View style={styles.overviewCard}>
              <Text style={styles.overviewTitle}>Transaction Overview</Text>

              {/* Transaction Type */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Transaction type</Text>
                <Text style={styles.fieldValue}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Text>
              </View>
              <View style={styles.divider} />

              {/* Category */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Category</Text>
                <Text style={styles.fieldValue}>{transaction.category}</Text>
              </View>
              <View style={styles.divider} />

              {/* Note */}
              {transaction.note && (
                <>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Note</Text>
                  </View>
                  <Text style={styles.noteText}>{transaction.note}</Text>
                </>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edit Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  amount: {
    color: colors.primaryText,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  dateText: {
    color: '#515771',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(231, 55, 55, 0.1)',
    borderColor: '#FF2929',
    borderRadius: 58,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    minWidth: 118,
  },
  deleteButtonText: {
    color: '#DD1212',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  divider: {
    backgroundColor: '#F0F0F0',
    height: 1,
    marginVertical: spacing.sm,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.primaryText,
    borderRadius: 58,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  fieldContainer: {
    marginBottom: spacing.xs,
  },
  fieldLabel: {
    color: '#515771',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  fieldValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.iconCircle,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  mainCard: {
    backgroundColor: colors.white,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  mainCardContent: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  mainInfoContent: {
    flex: 1,
  },
  merchantName: {
    color: '#515771',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: '64%',
    marginTop: 'auto',
  },
  noteText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  overlay: {
    backgroundColor: 'rgba(9, 36, 73, 0.21)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  overviewTitle: {
    color: '#3C404B',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});

export default TransactionDetailsModal;
