/**
 * EditTransactionModal - Edit existing transaction
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { CategorySelector } from '@/components/common/CategorySelector';
import type { Transaction, Database } from '@/types/database';

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    transaction: Database['public']['Tables']['transactions']['Update']
  ) => void;
}

const CATEGORIES = [
  { id: 'Grocery', name: 'Grocery', icon: 'cart' },
  { id: 'Transport', name: 'Transport', icon: 'car' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'musical-notes' },
  { id: 'Medicine', name: 'Medicine', icon: 'medkit' },
  { id: 'Education', name: 'Education', icon: 'school' },
  { id: 'Shopping', name: 'Shopping', icon: 'bag-handle' },
  { id: 'Income', name: 'Income', icon: 'cash' },
];

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  visible,
  transaction,
  onClose,
  onUpdate,
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setNote(transaction.note || '');
      setDate(transaction.date);
    }
  }, [transaction]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, category]);

  const handleSubmit = useCallback(() => {
    if (!validate() || !transaction) return;

    const updatedTransaction: Database['public']['Tables']['transactions']['Update'] = {
      type,
      amount: parseFloat(amount),
      category,
      title: category, // Use category as title
      note: note.trim() || null,
      date,
    };

    onUpdate(transaction.id, updatedTransaction);
    onClose();
  }, [validate, transaction, type, amount, category, note, date, onUpdate, onClose]);

  if (!transaction) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Type */}
            <View style={styles.section}>
              <View style={styles.transactionTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.transactionTypeButton,
                    type === 'expense' && styles.transactionTypeButtonActive,
                  ]}
                  onPress={() => setType('expense')}
                >
                  <Text
                    style={[
                      styles.transactionTypeText,
                      type === 'expense' && styles.transactionTypeTextActive,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.transactionTypeButton,
                    type === 'income' && styles.transactionTypeButtonActive,
                  ]}
                  onPress={() => setType('income')}
                >
                  <Text
                    style={[
                      styles.transactionTypeText,
                      type === 'income' && styles.transactionTypeTextActive,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <RNTextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="540.00"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="decimal-pad"
                />
              </View>
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <CategorySelector
                categories={CATEGORIES}
                selectedCategory={category}
                onSelect={setCategory}
                placeholder="Choose category"
              />
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Date */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date</Text>
              <View style={styles.datePickerButton}>
                <Text style={styles.datePickerValue}>{date}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.tertiary} />
              </View>
            </View>

            {/* Note */}
            <View style={[styles.section, styles.lastSection]}>
              <Text style={styles.sectionTitle}>Note</Text>
              <RNTextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Write a note here"
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  amountContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  amountInput: {
    color: colors.text.primary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.semibold,
    includeFontPadding: false,
    padding: 0,
    textAlign: 'center',
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.primaryText,
    borderRadius: 58,
    borderWidth: 1,
    flex: 1,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  cancelButtonText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  currencySymbol: {
    color: colors.text.primary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.semibold,
    includeFontPadding: false,
    marginRight: spacing.xs,
  },
  datePickerButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  datePickerValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.xs,
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
  lastSection: {
    marginBottom: spacing.md,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: '70%',
    marginTop: 'auto',
    ...shadows.card,
  },
  noteInput: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    height: 92,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  overlay: {
    backgroundColor: 'rgba(9, 36, 73, 0.21)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 58,
    flex: 1,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  transactionTypeButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  transactionTypeButtonActive: {
    backgroundColor: colors.background.activeTab,
    borderColor: colors.primary,
  },
  transactionTypeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  transactionTypeText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  transactionTypeTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default EditTransactionModal;
