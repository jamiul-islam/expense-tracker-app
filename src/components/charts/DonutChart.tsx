/**
 * DonutChart Component - Displays spending breakdown in a donut chart
 * Uses react-native-svg for chart visualization
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
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

  // Chart dimensions
  const size = 222;
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke offsets for each segment
  let currentOffset = 0;
  const segments = data.map(item => {
    const segmentLength = (item.percentage / 100) * circumference;
    const segment = {
      color: item.color,
      offset: currentOffset,
      length: segmentLength,
    };
    currentOffset += segmentLength;
    return segment;
  });

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              {segments.map((segment, index) => (
                <Circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${segment.length} ${circumference}`}
                  strokeDashoffset={-segment.offset}
                  fill="transparent"
                  strokeLinecap="butt"
                />
              ))}
            </G>
          </Svg>
          {/* Center Label */}
          <View style={styles.centerLabel}>
            <Text style={styles.centerAmount}>{formatCurrency(totalSpent)}</Text>
            <Text style={styles.centerText}>Total Spent</Text>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendCategory}>{item.category}</Text>
              <Text style={styles.legendPercentage}>{item.percentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.legendAmount}>{formatCurrency(item.amount)}</Text>
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
  centerLabel: {
    alignItems: 'center',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateX: -60 }, { translateY: -20 }],
  },
  centerText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    height: 218,
    justifyContent: 'center',
    position: 'relative',
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
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
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
  },
  legendLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  legendPercentage: {
    color: colors.text.percentage,
    fontSize: 12,
    fontWeight: typography.fontWeight.regular,
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
    marginBottom: spacing.sm,
  },
});

export default DonutChart;
