/**
 * Transaction Store - Transactions state management
 */

import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import type { Transaction } from '@/types/database';

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
    transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
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

      // Apply filters
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('date', filters.dateTo);
      }
      if (filters?.amountMin !== undefined) {
        query = query.gte('amount', filters.amountMin);
      }
      if (filters?.amountMax !== undefined) {
        query = query.lte('amount', filters.amountMax);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (
        supabase.from('transactions').insert([transaction as any]) as any
      ).select();

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (
        supabase.from('transactions').update(transaction as any) as any
      )
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
