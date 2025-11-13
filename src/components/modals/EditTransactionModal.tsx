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
import { Button } from '@/components/common/Button';
import { TextInput } from '@/components/common/TextInput';
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
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setTitle(transaction.title);
      setNote(transaction.note || '');
      setDate(transaction.date);
    }
  }, [transaction]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, title, category]);

  const handleSubmit = useCallback(() => {
    if (!validate() || !transaction) return;

    const updatedTransaction: Database['public']['Tables']['transactions']['Update'] = {
      type,
      amount: parseFloat(amount),
      category,
      title,
      note: note.trim() || null,
      date,
    };

    onUpdate(transaction.id, updatedTransaction);
    onClose();
  }, [validate, transaction, type, amount, category, title, note, date, onUpdate, onClose]);

  if (!transaction) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Type Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
                  onPress={() => setType('expense')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === 'expense' && styles.typeButtonTextActive,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
                  onPress={() => setType('income')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === 'income' && styles.typeButtonTextActive,
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
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <RNTextInput
                  style={[styles.amountInput, errors.amount && styles.inputError]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="decimal-pad"
                />
              </View>
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* Title */}
            <View style={styles.section}>
              <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Enter transaction title"
                error={errors.title}
              />
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={category === cat.id ? colors.primary : colors.text.tertiary}
                    />
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat.id && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Date */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date</Text>
              <View style={styles.dateButton}>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
                <Text style={styles.dateText}>{date}</Text>
              </View>
            </View>

            {/* Note */}
            <View style={styles.section}>
              <TextInput
                label="Note (Optional)"
                value={note}
                onChangeText={setNote}
                placeholder="Add a note"
                multiline
                numberOfLines={3}
                style={styles.noteInput}
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onClose}
              style={styles.actionButton}
            />
            <Button
              title="Save Changes"
              variant="primary"
              onPress={handleSubmit}
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
  amountInput: {
    color: colors.text.primary,
    flex: 1,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    padding: 0,
    textAlign: 'center',
  },
  amountInputContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: '48%',
  },
  categoryButtonActive: {
    backgroundColor: colors.background.activeTab,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  categoryButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dateText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
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
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },
  inputError: {
    borderColor: colors.danger,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    height: '90%',
    marginTop: 'auto',
    ...shadows.card,
  },
  noteInput: {
    height: 80,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
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
  typeButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.md,
  },
  typeButtonActive: {
    backgroundColor: colors.background.activeTab,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

export default EditTransactionModal;
