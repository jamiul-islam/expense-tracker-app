/**
 * Analytics Store - Analytics data state management
 */

import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { colors } from '@/theme';

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface TrendData {
  month: string;
  income: number;
  expense: number;
}

interface AnalyticsState {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categorySpending: CategorySpending[];
  spendingTrend: TrendData[];
  timeRange: string;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (timeRange?: string) => Promise<void>;
  updateTimeRange: (range: string) => void;
}

// Category color mapping based on Figma design
const categoryColorMap: { [key: string]: string } = {
  Grocery: colors.chart.grocery,
  'Food & Lifestyle': '#F2994A', // Orange from Figma
  Transport: colors.chart.transport,
  Entertainment: colors.chart.entertainment,
  'Rent & Utilities': '#5889E4', // Blue from Figma
  Shopping: '#FF94F3', // Pink from Figma
  Medicine: colors.chart.medicine,
  Education: colors.chart.education,
  Others: colors.chart.others,
};

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  totalIncome: 0,
  totalExpense: 0,
  netBalance: 0,
  categorySpending: [],
  spendingTrend: [],
  timeRange: 'thisMonth',
  isLoading: false,
  error: null,

  fetchAnalytics: async (timeRange?: string) => {
    set({ isLoading: true, error: null });
    try {
      const range = timeRange || get().timeRange;

      // Calculate date range based on selection
      const now = new Date();
      let startDate: Date;

      switch (range) {
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
        case 'last3Months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'thisMonth':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      // Fetch transactions from Supabase
      const { data: transactions, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', now.toISOString())
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;

      // Calculate totals
      const income =
        transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;

      const expense =
        transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;

      // Calculate category spending
      const categoryTotals: { [key: string]: number } = {};
      transactions
        ?.filter(t => t.type === 'expense')
        .forEach(t => {
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });

      const totalCategorySpending = Object.values(categoryTotals).reduce(
        (sum, val) => sum + val,
        0
      );
      const categorySpending = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalCategorySpending > 0 ? (amount / totalCategorySpending) * 100 : 0,
          color: categoryColorMap[category] || colors.chart.others,
        }))
        .sort((a, b) => b.amount - a.amount);

      // Calculate spending trend (6-month data)
      const trendData: TrendData[] = [];
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const monthIncome =
          transactions
            ?.filter(
              t =>
                t.type === 'income' &&
                new Date(t.date) >= monthStart &&
                new Date(t.date) <= monthEnd
            )
            .reduce((sum, t) => sum + t.amount, 0) || 0;

        const monthExpense =
          transactions
            ?.filter(
              t =>
                t.type === 'expense' &&
                new Date(t.date) >= monthStart &&
                new Date(t.date) <= monthEnd
            )
            .reduce((sum, t) => sum + t.amount, 0) || 0;

        trendData.push({
          month: monthNames[monthDate.getMonth()],
          income: monthIncome,
          expense: monthExpense,
        });
      }

      set({
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        categorySpending,
        spendingTrend: trendData,
        timeRange: range,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch analytics',
      });
    }
  },

  updateTimeRange: (range: string) => {
    set({ timeRange: range });
    get().fetchAnalytics(range);
  },
}));

export default useAnalyticsStore;
