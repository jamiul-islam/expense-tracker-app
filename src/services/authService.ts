import { supabase } from './supabase';
import { User } from '@/types/database';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * AuthService - Handles all authentication operations with Supabase
 */
class AuthService {
  /**
   * Sign in with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Login attempt:', { email: credentials.email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Login error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'No user returned from authentication',
        };
      }

      console.log('Login successful, fetching profile...');
      
      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return {
          success: false,
          error: 'Failed to fetch user profile',
        };
      }

      console.log('Profile fetched successfully');
      
      return {
        success: true,
        user: profile as User,
      };
    } catch (error) {
      console.error('Login exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Sign up with email, password, and full name
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      console.log('Sign up attempt:', { email: credentials.email, fullName: credentials.fullName });
      
      // Create auth user with metadata
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up auth error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        console.error('No user returned from authentication');
        return {
          success: false,
          error: 'No user returned from authentication',
        };
      }

      console.log('Auth user created, ID:', data.user.id);
      console.log('User profile should be created automatically by trigger');

      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch the created user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return {
          success: false,
          error: 'Failed to create user profile',
        };
      }

      console.log('User profile fetched successfully:', profile);

      return {
        success: true,
        user: profile as User,
      };
    } catch (error) {
      console.error('Sign up exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

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
   * Refresh the current session
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (error || !session) {
        return {
          success: false,
          error: error?.message || 'Failed to refresh session',
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
        error: error instanceof Error ? error.message : 'Token refresh failed',
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
