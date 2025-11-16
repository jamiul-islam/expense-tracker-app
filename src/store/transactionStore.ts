/**
 * Transaction Store - Transactions state management
 */

import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import type { Transaction, Database } from '@/types/database';

interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  filters: TransactionFilters;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  addTransaction: (
    transaction: Database['public']['Tables']['transactions']['Insert']
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Database['public']['Tables']['transactions']['Update']
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionState>(set => ({
  transactions: [],
  selectedTransaction: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTransactions: async (filters?: TransactionFilters) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('transactions').select('*').order('date', { ascending: false });

      // Use provided filters or fall back to store filters
      const state = useTransactionStore.getState();
      const activeFilters = filters || state.filters;

      // Apply filters
      if (activeFilters?.type) {
        query = query.eq('type', activeFilters.type);
      }
      if (activeFilters?.category) {
        query = query.eq('category', activeFilters.category);
      }
      if (activeFilters?.dateFrom) {
        query = query.gte('date', activeFilters.dateFrom);
      }
      if (activeFilters?.dateTo) {
        query = query.lte('date', activeFilters.dateTo);
      }
      if (activeFilters?.amountMin !== undefined) {
        query = query.gte('amount', activeFilters.amountMin);
      }
      if (activeFilters?.amountMax !== undefined) {
        query = query.lte('amount', activeFilters.amountMax);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ isLoading: false, transactions: data || [] });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch transactions',
        transactions: [],
      });
    }
  },

  addTransaction: async transaction => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction as unknown as never])
        .select();

      if (error) throw error;

      set(state => ({
        isLoading: false,
        transactions:
          data && data.length > 0 ? [data[0], ...state.transactions] : state.transactions,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to add transaction',
      });
    }
  },

  updateTransaction: async (id, transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction as unknown as never)
        .eq('id', id)
        .select();

      if (error) throw error;

      set(state => ({
        isLoading: false,
        transactions: state.transactions.map(t =>
          t.id === id && data && data.length > 0 ? data[0] : t
        ),
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update transaction',
      });
    }
  },

  deleteTransaction: async id => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;

      set(state => ({
        isLoading: false,
        transactions: state.transactions.filter(t => t.id !== id),
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to delete transaction',
      });
    }
  },

  setSelectedTransaction: transaction => set({ selectedTransaction: transaction }),

  setFilters: filters => set({ filters }),

  clearFilters: () => set({ filters: {} }),
}));

export default useTransactionStore;
