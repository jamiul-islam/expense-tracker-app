/**
 * Analytics Screen - Financial analytics with charts and statistics
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Line, Text as SvgText, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/theme';
import { ScreenHeader, Text, LoadingSpinner } from '@/components';
import { useAnalyticsStore } from '@/store/analyticsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const CHART_HEIGHT = 220;
const CHART_PADDING = 40;

export default function AnalyticsScreen() {
  const {
    totalIncome,
    totalExpense,
    netBalance,
    categorySpending,
    spendingTrend,
    timeRange,
    isLoading,
    fetchAnalytics,
    updateTimeRange,
  } = useAnalyticsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed - open profile');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeRangeLabel = () => {
    const labels: { [key: string]: string } = {
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      last3Months: 'Last 3 Months',
      thisYear: 'This Year',
    };
    return labels[timeRange] || 'This Month';
  };

  const renderSpendingTrendChart = () => {
    if (spendingTrend.length === 0) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No trend data available</Text>
        </View>
      );
    }

    // Calculate max value for scaling
    const allValues = spendingTrend.flatMap(d => [d.income, d.expense]);
    const maxValue = Math.max(...allValues, 3000); // Minimum scale 3000
    const roundedMax = Math.ceil(maxValue / 500) * 500;

    // Y-axis labels (7 levels from $0 to max)
    const yLabels = Array.from({ length: 7 }, (_, i) => {
      const value = roundedMax - (roundedMax / 6) * i;
      return Math.round(value);
    });

    // Calculate chart dimensions
    const chartInnerWidth = CHART_WIDTH - CHART_PADDING * 2;
    const chartInnerHeight = CHART_HEIGHT - CHART_PADDING * 2;

    // Calculate points for income and expense lines
    const incomePoints = spendingTrend.map((data, index) => {
      const x = CHART_PADDING + (chartInnerWidth / (spendingTrend.length - 1)) * index;
      const y = CHART_PADDING + chartInnerHeight * (1 - data.income / roundedMax);
      return { x, y };
    });

    const expensePoints = spendingTrend.map((data, index) => {
      const x = CHART_PADDING + (chartInnerWidth / (spendingTrend.length - 1)) * index;
      const y = CHART_PADDING + chartInnerHeight * (1 - data.expense / roundedMax);
      return { x, y };
    });

    // Create path strings with smooth curves
    const createSmoothPath = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';

      let path = `M ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const controlX = (current.x + next.x) / 2;

        path += ` Q ${controlX} ${current.y}, ${controlX} ${(current.y + next.y) / 2}`;
        path += ` Q ${controlX} ${next.y}, ${next.x} ${next.y}`;
      }

      return path;
    };

    const incomePath = createSmoothPath(incomePoints);
    const expensePath = createSmoothPath(expensePoints);

    return (
      <View style={styles.chartWrapper}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          {yLabels.map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              ${label >= 1000 ? `${(label / 1000).toFixed(1)}k` : label}
            </Text>
          ))}
        </View>

        {/* Chart SVG */}
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Horizontal grid lines */}
          {yLabels.map((_, index) => {
            const y = CHART_PADDING + (chartInnerHeight / 6) * index;
            return (
              <Line
                key={`grid-${index}`}
                x1={CHART_PADDING}
                y1={y}
                x2={CHART_WIDTH - CHART_PADDING / 2}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          })}

          {/* Income line (green) */}
          <Path
            d={incomePath}
            fill="none"
            stroke={colors.success}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Expense line (pink) */}
          <Path
            d={expensePath}
            fill="none"
            stroke="#D291BC"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* X-axis labels */}
          {spendingTrend.map((data, index) => {
            const x = CHART_PADDING + (chartInnerWidth / (spendingTrend.length - 1)) * index;
            return (
              <SvgText
                key={`label-${index}`}
                x={x}
                y={CHART_HEIGHT - 10}
                fontSize="11"
                fill={colors.text.percentage}
                textAnchor="middle"
              >
                {data.month}
              </SvgText>
            );
          })}
        </Svg>

        {/* Legend */}
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.expenseLegendDot]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryDonutChart = () => {
    if (categorySpending.length === 0) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No category data available</Text>
        </View>
      );
    }

    const size = 222;
    const strokeWidth = 35;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const totalSpent = categorySpending.reduce((sum, item) => sum + item.amount, 0);

    let currentOffset = 0;
    const gapSize = circumference * 0.04;
    const segments = categorySpending.map(item => {
      const segmentLength = (item.percentage / 100) * circumference;
      const segment = {
        color: item.color,
        offset: currentOffset,
        length: segmentLength - gapSize,
      };
      currentOffset += segmentLength;
      return segment;
    });

    return (
      <View style={styles.categoryChartContainer}>
        <View style={styles.donutChartWrapper}>
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
                  strokeLinecap="round"
                />
              ))}
            </G>
          </Svg>
          <View style={styles.donutCenterLabel}>
            <Text style={styles.donutTotalLabel}>TOTAL SPENT</Text>
            <Text style={styles.donutTotalAmount}>{formatCurrency(totalSpent)}</Text>
          </View>
        </View>

        {/* Category list */}
        <View style={styles.categoryList}>
          {categorySpending.map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem} activeOpacity={0.7}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.category}</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={[colors.background.gradientStart, colors.background.gradientEnd]}
          style={styles.gradient}
        >
          <ScreenHeader
            title="Analytics"
            onAvatarPress={handleAvatarPress}
            onNotificationPress={handleNotificationPress}
            showBackButton={false}
          />
          <LoadingSpinner />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={[colors.background.gradientStart, colors.background.gradientEnd]}
        style={styles.gradient}
      >
        <ScreenHeader
          title="Analytics"
          onAvatarPress={handleAvatarPress}
          onNotificationPress={handleNotificationPress}
          showBackButton={false}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Time Range Selector */}
          <TouchableOpacity
            style={styles.timeRangeSelector}
            onPress={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
            activeOpacity={0.7}
          >
            <Text style={styles.timeRangeText}>{getTimeRangeLabel()}</Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.text.primary}
              style={{ transform: [{ rotate: showTimeRangeDropdown ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {/* Time Range Dropdown */}
          {showTimeRangeDropdown && (
            <View style={styles.timeRangeDropdown}>
              {['thisMonth', 'lastMonth', 'last3Months', 'thisYear'].map(range => (
                <TouchableOpacity
                  key={range}
                  style={styles.timeRangeOption}
                  onPress={() => {
                    updateTimeRange(range);
                    setShowTimeRangeDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.timeRangeOptionText,
                      timeRange === range && styles.timeRangeOptionTextActive,
                    ]}
                  >
                    {getTimeRangeLabel()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Statistics Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="arrow-down-outline" size={16} color={colors.success} />
              </View>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.statValue}>{formatCurrency(totalIncome)}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="arrow-up-outline" size={16} color={colors.danger} />
              </View>
              <Text style={styles.statLabel}>Total Expense</Text>
              <Text style={styles.statValue}>{formatCurrency(totalExpense)}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="wallet-outline" size={16} color={colors.info} />
              </View>
              <Text style={styles.statLabel}>Net Balance</Text>
              <Text style={styles.statValue}>{formatCurrency(netBalance)}</Text>
            </View>
          </View>

          {/* Spending Trend Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending Trend</Text>
            {renderSpendingTrendChart()}
          </View>

          {/* Spending by Category */}
          <View style={styles.categoryCard}>
            <Text style={styles.chartTitle}>Spending by Category</Text>
            {renderCategoryDonutChart()}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryAmount: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    marginBottom: spacing['3xl'],
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    ...shadows.analyticsCard,
  },
  categoryChartContainer: {
    marginTop: spacing.md,
  },
  categoryDot: {
    borderRadius: 4,
    height: 18,
    marginRight: spacing.md,
    width: 18,
  },
  categoryItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  categoryLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  categoryList: {
    marginTop: spacing.lg,
  },
  categoryName: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
  },
  categoryRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  chartLegend: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  chartTitle: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
  },
  chartWrapper: {
    marginTop: spacing.md,
  },
  contentContainer: {
    paddingBottom: spacing['3xl'],
  },
  donutCenterLabel: {
    alignItems: 'center',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateX: -60 }, { translateY: -20 }],
  },
  donutChartWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 222,
    justifyContent: 'center',
    position: 'relative',
    width: 222,
  },
  donutTotalAmount: {
    color: colors.primaryText,
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
  },
  donutTotalLabel: {
    color: 'rgba(60, 64, 75, 0.69)',
    fontSize: 16,
    fontWeight: typography.fontWeight.regular,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  emptyChartContainer: {
    alignItems: 'center',
    height: CHART_HEIGHT,
    justifyContent: 'center',
  },
  emptyChartText: {
    color: colors.text.tertiary,
    fontSize: 14,
  },
  expenseLegendDot: {
    backgroundColor: '#D291BC',
  },
  gradient: {
    flex: 1,
  },
  legendDot: {
    borderRadius: 4,
    height: 14,
    marginRight: spacing.sm,
    width: 14,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legendText: {
    color: colors.text.primary,
    fontSize: 10,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statCard: {
    alignItems: 'flex-start',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  statDivider: {
    backgroundColor: colors.border,
    height: '100%',
    width: 1,
  },
  statIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.iconCircle,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 24,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.fontWeight.regular,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  statValue: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
  },
  statsContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  timeRangeDropdown: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    overflow: 'hidden',
    ...shadows.md,
  },
  timeRangeOption: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  timeRangeOptionText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  timeRangeOptionTextActive: {
    color: colors.primaryText,
    fontWeight: typography.fontWeight.semibold,
  },
  timeRangeSelector: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.analyticsCard,
  },
  timeRangeText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  yAxisLabel: {
    color: colors.text.percentage,
    fontSize: 11,
    textAlign: 'right',
  },
  yAxisLabels: {
    height: CHART_HEIGHT - CHART_PADDING,
    justifyContent: 'space-between',
    left: 0,
    paddingRight: spacing.sm,
    position: 'absolute',
    top: CHART_PADDING,
    width: CHART_PADDING - spacing.sm,
  },
});
