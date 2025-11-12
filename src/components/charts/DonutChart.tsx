/**
 * DonutChart Component - Displays spending breakdown in a donut chart
 * Placeholder - will be implemented with proper victory-native setup
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { Text } from '../common/Text';
import { Card } from '../common/Card';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: CategoryData[];
  totalSpent: number;
  title?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  totalSpent,
  title = 'Top Spending Overview',
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Chart Placeholder */}
      <View style={styles.chartContainer}>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.centerAmount}>{formatCurrency(totalSpent)}</Text>
          <Text style={styles.centerText}>Total Spent</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendCategory}>{item.category}</Text>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.legendAmount}>{formatCurrency(item.amount)}</Text>
              <Text style={styles.legendPercentage}>{item.percentage.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  centerAmount: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  centerText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  chartPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 125,
    height: 250,
    justifyContent: 'center',
    width: 250,
  },
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  legendAmount: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
  },
  legendCategory: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.sm,
  },
  legendContainer: {
    marginTop: spacing.md,
  },
  legendDot: {
    borderRadius: borderRadius.full,
    height: 12,
    width: 12,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  legendLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  legendPercentage: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
  },
});

export default DonutChart;
