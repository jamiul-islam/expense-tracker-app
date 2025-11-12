/**
 * DonutChart Component - Displays spending breakdown in a donut chart
 * Placeholder - will be implemented with proper victory-native setup
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';
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
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
  },
  centerText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  chartPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 109,
    height: 218,
    justifyContent: 'center',
    width: 222,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.lg,
    shadowColor: '#172551',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  legendAmount: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'right',
  },
  legendCategory: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.sm,
  },
  legendContainer: {
    marginTop: spacing.sm,
  },
  legendDot: {
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  legendLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  legendPercentage: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
  },
  legendRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.md,
  },
});

export default DonutChart;
