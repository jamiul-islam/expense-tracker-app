/**
 * Analytics Store - Analytics data state management
 */

import { create } from 'zustand';

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

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
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
      // Will be implemented with Supabase API
      console.log('Fetching analytics for:', timeRange);
      set({ isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch analytics',
      });
    }
  },

  updateTimeRange: (range: string) => {
    set({ timeRange: range });
  },
}));

export default useAnalyticsStore;
