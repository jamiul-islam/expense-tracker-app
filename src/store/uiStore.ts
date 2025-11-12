/**
 * UI Store - Application UI state management
 */

import { create } from 'zustand';

type TabName = 'home' | 'transactions' | 'analytics';
type ModalName =
  | 'addTransaction'
  | 'editTransaction'
  | 'filterTransaction'
  | 'transactionDetails'
  | 'deleteConfirmation';

interface UIState {
  activeTab: TabName;
  openModals: Set<ModalName>;
  balanceVisibility: boolean;
  searchQuery: string;
  setActiveTab: (tab: TabName) => void;
  openModal: (modal: ModalName) => void;
  closeModal: (modal: ModalName) => void;
  toggleBalance: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  openModals: new Set(),
  balanceVisibility: true,
  searchQuery: '',

  setActiveTab: (tab: TabName) => set({ activeTab: tab }),

  openModal: (modal: ModalName) =>
    set((state) => ({
      openModals: new Set(state.openModals).add(modal),
    })),

  closeModal: (modal: ModalName) =>
    set((state) => {
      const modals = new Set(state.openModals);
      modals.delete(modal);
      return { openModals: modals };
    }),

  toggleBalance: () =>
    set((state) => ({ balanceVisibility: !state.balanceVisibility })),

  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));

export default useUIStore;
