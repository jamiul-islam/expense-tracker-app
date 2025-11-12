/**
 * User Store - Authentication state management
 */

import { create } from 'zustand';
import type { User } from '@/types/database';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Will be implemented in authService
      console.log('Login:', email, password);
      // Temporary mock
      set({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          email,
          full_name: 'John Doe',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Will be implemented in authService
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Will be implemented in authService
      // Check if session exists
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
