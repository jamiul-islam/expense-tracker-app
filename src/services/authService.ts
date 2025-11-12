import { supabase } from './supabase';
import { User } from '@/types/database';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * AuthService - Simplified magic link OTP authentication
 */
class AuthService {
  /**
   * Send OTP to email (magic link)
   */
  async sendOTP(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Sending OTP to:', email);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('Send OTP error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log('OTP sent successfully');
      return {
        success: true,
      };
    } catch (error) {
      console.error('Send OTP exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, token: string): Promise<AuthResponse> {
    try {
      console.log('Verifying OTP for:', email);

      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'email',
      });

      if (error) {
        console.error('Verify OTP error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'No user returned from verification',
        };
      }

      console.log('OTP verified, user ID:', data.user.id);
      console.log('Session established:', !!data.session);

      // Wait for trigger to create profile
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);

        // Retry once
        console.log('Retrying profile fetch...');
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));

        const { data: retryProfile, error: retryError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (retryError || !retryProfile) {
          console.error('Profile fetch retry error:', retryError);
          return {
            success: false,
            error: 'Failed to load user profile',
          };
        }

        console.log('Profile fetched on retry');
        return {
          success: true,
          user: retryProfile as User,
        };
      }

      console.log('Profile fetched successfully');
      return {
        success: true,
        user: profile as User,
      };
    } catch (error) {
      console.error('Verify OTP exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  /**
   * Sign out current user
   */
  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  /**
   * Check if user is authenticated and return user data
   */
  async checkAuthStatus(): Promise<AuthResponse> {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        return {
          success: false,
          error: 'No active session',
        };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        return {
          success: false,
          error: 'Failed to fetch user profile',
        };
      }

      return {
        success: true,
        user: profile as User,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Auth check failed',
      };
    }
  }

  /**
   * Setup auth state change listener
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        callback(profile as User | null);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
