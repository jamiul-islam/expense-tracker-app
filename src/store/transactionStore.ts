/**
 * Transaction Store - Transactions state management
 */

import { create } from 'zustand';
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
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  selectedTransaction: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTransactions: async (filters?: TransactionFilters) => {
    set({ isLoading: true, error: null });
    try {
      // Will be implemented with Supabase API
      console.log('Fetching transactions with filters:', filters);
      set({ isLoading: false, transactions: [] });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch transactions',
      });
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      // Will be implemented with Supabase API
      console.log('Adding transaction:', transaction);
      set({ isLoading: false });
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
      // Will be implemented with Supabase API
      console.log('Updating transaction:', id, transaction);
      set({ isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update transaction',
      });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Will be implemented with Supabase API
      console.log('Deleting transaction:', id);
      set({ isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to delete transaction',
      });
    }
  },

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set({ filters: {} }),
}));

export default useTransactionStore;
