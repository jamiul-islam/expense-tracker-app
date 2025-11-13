/**
 * FilterModal Component - Advanced transaction filtering
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { Button } from '@/components/common/Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  type?: 'all' | 'income' | 'expense';
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'apps' },
  { id: 'Grocery', name: 'Grocery', icon: 'cart' },
  { id: 'Transport', name: 'Transport', icon: 'car' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'musical-notes' },
  { id: 'Medicine', name: 'Medicine', icon: 'medkit' },
  { id: 'Education', name: 'Education', icon: 'school' },
  { id: 'Shopping', name: 'Shopping', icon: 'bag-handle' },
  { id: 'Income', name: 'Income', icon: 'cash' },
];

const DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'last3months', label: 'Last 3 Months' },
  { id: 'custom', label: 'Custom Range' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [type, setType] = useState<'all' | 'income' | 'expense'>(initialFilters?.type || 'all');
  const [category, setCategory] = useState<string>(initialFilters?.category || 'all');
  const [dateRange, setDateRange] = useState<string>('month');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialFilters?.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(initialFilters?.dateTo);
  const [amountMin, setAmountMin] = useState<number>(initialFilters?.amountMin || 0);
  const [amountMax, setAmountMax] = useState<number>(initialFilters?.amountMax || 5000);

  useEffect(() => {
    if (initialFilters) {
      setType(initialFilters.type || 'all');
      setCategory(initialFilters.category || 'all');
      setAmountMin(initialFilters.amountMin || 0);
      setAmountMax(initialFilters.amountMax || 5000);
      setDateFrom(initialFilters.dateFrom);
      setDateTo(initialFilters.dateTo);
    }
  }, [initialFilters]);

  const handleDateRangeChange = useCallback((rangeId: string) => {
    setDateRange(rangeId);
    const today = new Date();
    let from: Date | undefined;
    const to: Date | undefined = today;

    switch (rangeId) {
      case 'today':
        from = new Date(today.setHours(0, 0, 0, 0));
        break;
      case 'week':
        from = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'month':
        from = new Date(today.setMonth(today.getMonth() - 1));
        break;
      case 'last3months':
        from = new Date(today.setMonth(today.getMonth() - 3));
        break;
      case 'custom':
        // User will select custom dates
        return;
      default:
        break;
    }

    setDateFrom(from);
    setDateTo(to);
  }, []);

  const handleApply = useCallback(() => {
    const filters: FilterOptions = {
      type: type === 'all' ? undefined : type,
      category: category === 'all' ? undefined : category,
      dateFrom,
      dateTo,
      amountMin: amountMin > 0 ? amountMin : undefined,
      amountMax: amountMax < 5000 ? amountMax : undefined,
    };
    onApply(filters);
    onClose();
  }, [type, category, dateFrom, dateTo, amountMin, amountMax, onApply, onClose]);

  const handleClearFilters = useCallback(() => {
    setType('all');
    setCategory('all');
    setDateRange('month');
    setAmountMin(0);
    setAmountMax(5000);
    setDateFrom(undefined);
    setDateTo(undefined);
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter Transactions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={styles.typeContainer}>
                {(['all', 'income', 'expense'] as const).map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, type === t && styles.typeButtonActive]}
                    onPress={() => setType(t)}
                  >
                    <Text
                      style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
            </View>

            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                {DATE_RANGES.map(range => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.dateRangeButton,
                      dateRange === range.id && styles.dateRangeButtonActive,
                    ]}
                    onPress={() => handleDateRangeChange(range.id)}
                  >
                    <Text
                      style={[
                        styles.dateRangeButtonText,
                        dateRange === range.id && styles.dateRangeButtonTextActive,
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {dateRange === 'custom' && (
                <View style={styles.customDateContainer}>
                  <View style={styles.datePickerButton}>
                    <Text style={styles.datePickerLabel}>From:</Text>
                    <Text style={styles.datePickerValue}>{formatDate(dateFrom)}</Text>
                  </View>
                  <View style={styles.datePickerButton}>
                    <Text style={styles.datePickerLabel}>To:</Text>
                    <Text style={styles.datePickerValue}>{formatDate(dateTo)}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Amount Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount Range</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>
                  ${amountMin.toFixed(0)} - ${amountMax.toFixed(0)}
                </Text>
                <View style={styles.amountInputContainer}>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.amountInputLabel}>Min: ${amountMin}</Text>
                  </View>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.amountInputLabel}>Max: ${amountMax}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Clear Filters"
              variant="secondary"
              onPress={handleClearFilters}
              style={styles.actionButton}
            />
            <Button
              title="Apply Filters"
              variant="primary"
              onPress={handleApply}
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
  amountContainer: {
    paddingTop: spacing.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  amountInputLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  amountInputWrapper: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  amountLabel: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
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
  customDateContainer: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  datePickerButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  datePickerLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  datePickerValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  dateRangeButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dateRangeButtonActive: {
    backgroundColor: colors.background.activeTab,
    borderColor: colors.primary,
  },
  dateRangeButtonText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  dateRangeButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    height: '85%',
    marginTop: 'auto',
    ...shadows.card,
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
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default FilterModal;
