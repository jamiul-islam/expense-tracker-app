/**
 * FilterModal Component - Advanced transaction filtering
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from 'react-native-multi-slider';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';

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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>('month');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialFilters?.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(initialFilters?.dateTo);
  const [amountMin, setAmountMin] = useState<number>(initialFilters?.amountMin || 150);
  const [amountMax, setAmountMax] = useState<number>(initialFilters?.amountMax || 500);

  useEffect(() => {
    if (initialFilters) {
      setType(initialFilters.type || 'all');
      setCategory(initialFilters.category || 'all');
      setAmountMin(initialFilters.amountMin || 150);
      setAmountMax(initialFilters.amountMax || 500);
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
      amountMin: amountMin > 150 ? amountMin : undefined,
      amountMax: amountMax < 500 ? amountMax : undefined,
    };
    onApply(filters);
    onClose();
  }, [type, category, dateFrom, dateTo, amountMin, amountMax, onApply, onClose]);

  const handleClearFilters = useCallback(() => {
    setType('all');
    setCategory('all');
    setCategoryDropdownOpen(false);
    setDateRange('month');
    setAmountMin(150);
    setAmountMax(500);
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
            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateRangeRow}>
                  {DATE_RANGES.slice(0, 3).map(range => (
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
                <View style={styles.dateRangeRow}>
                  {DATE_RANGES.slice(3).map(range => (
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

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <TouchableOpacity
                style={styles.categoryDropdown}
                onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <Text style={styles.categoryDropdownText}>
                  {CATEGORIES.find(cat => cat.id === category)?.name || 'Choose category (s)'}
                </Text>
                <Ionicons
                  name={categoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>

              {categoryDropdownOpen && (
                <View style={styles.categoryDropdownList}>
                  <ScrollView style={styles.categoryScrollView} nestedScrollEnabled>
                    {CATEGORIES.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryDropdownItem,
                          category === cat.id && styles.categoryDropdownItemActive,
                        ]}
                        onPress={() => {
                          setCategory(cat.id);
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        <View style={styles.categoryItemContent}>
                          <Ionicons
                            name={cat.icon as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={category === cat.id ? colors.primary : colors.text.tertiary}
                            style={styles.categoryIcon}
                          />
                          <Text
                            style={[
                              styles.categoryItemText,
                              category === cat.id && styles.categoryItemTextActive,
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </View>
                        {category === cat.id && (
                          <Ionicons name="checkmark" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Amount Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount Range</Text>
              <View style={styles.amountContainer}>
                <MultiSlider
                  values={[amountMin, amountMax]}
                  sliderLength={310}
                  onValuesChange={values => {
                    setAmountMin(values[0]);
                    setAmountMax(values[1]);
                  }}
                  min={150}
                  max={500}
                  step={10}
                  allowOverlap={false}
                  snapped
                  minMarkerOverlapDistance={20}
                  customMarker={e => {
                    return (
                      <View style={styles.sliderMarker}>
                        <View style={styles.sliderThumb} />
                        <Text style={styles.sliderValue}>${e.currentValue}</Text>
                      </View>
                    );
                  }}
                  trackStyle={styles.sliderTrack}
                  selectedStyle={styles.sliderSelected}
                  unselectedStyle={styles.sliderUnselected}
                  containerStyle={styles.sliderContainerStyle}
                  markerContainerStyle={styles.markerContainer}
                />
              </View>
            </View>

            {/* Transaction Type */}
            <View style={[styles.section, styles.lastSection]}>
              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={styles.transactionTypeContainer}>
                {(['all', 'income', 'expense'] as const).map(t => (
                  <View key={t} style={styles.radioContainer}>
                    <TouchableOpacity
                      style={[styles.radioButton, type === t && styles.radioButtonActive]}
                      onPress={() => setType(t)}
                    >
                      {type === t && <View style={styles.radioButtonInner} />}
                    </TouchableOpacity>
                    <Text style={styles.radioLabel}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply filter</Text>
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
    paddingTop: spacing.sm,
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: colors.primaryText,
    borderRadius: 58,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryDropdown: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  categoryDropdownItem: {
    alignItems: 'center',
    borderBottomColor: colors.background.secondary,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  categoryDropdownItemActive: {
    backgroundColor: colors.background.activeTab,
  },
  categoryDropdownList: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.xs,
    maxHeight: 200,
    ...shadows.sm,
  },
  categoryDropdownText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  categoryIcon: {
    marginRight: spacing.sm,
  },
  categoryItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  categoryItemText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  categoryItemTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryScrollView: {
    maxHeight: 180,
  },
  clearButton: {
    alignItems: 'center',
    borderColor: colors.primaryText,
    borderRadius: 58,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  clearButtonText: {
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
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dateRangeButtonActive: {
    backgroundColor: colors.background.activeTab,
    borderColor: colors.primary,
  },
  dateRangeButtonText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  dateRangeButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  dateRangeContainer: {
    gap: spacing.sm,
  },
  dateRangeRow: {
    flexDirection: 'row',
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
  lastSection: {
    marginBottom: spacing.md,
  },
  markerContainer: {
    marginTop: spacing.sm,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: '60%',
    marginTop: 'auto',
    ...shadows.card,
  },
  overlay: {
    backgroundColor: 'rgba(9, 36, 73, 0.21)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  radioButton: {
    alignItems: 'center',
    borderColor: colors.text.tertiary,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 24,
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: spacing['2xl'],
  },
  radioLabel: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  sliderContainerStyle: {
    alignSelf: 'center',
    height: 60,
    marginVertical: spacing.md,
  },
  sliderMarker: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  sliderSelected: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 8,
  },
  sliderThumb: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 28,
    width: 28,
    ...shadows.sm,
  },
  sliderTrack: {
    borderRadius: 4,
    height: 8,
  },
  sliderUnselected: {
    backgroundColor: 'rgba(12, 39, 65, 0.14)',
    borderRadius: 4,
    height: 8,
  },
  sliderValue: {
    color: colors.text.percentage,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  transactionTypeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default FilterModal;
