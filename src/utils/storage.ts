import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@tranzo:auth_token',
  REFRESH_TOKEN: '@tranzo:refresh_token',
  USER_ID: '@tranzo:user_id',
  REMEMBER_ME: '@tranzo:remember_me',
  THEME: '@tranzo:theme',
  BIOMETRIC_ENABLED: '@tranzo:biometric_enabled',
} as const;

/**
 * Storage utility for secure data persistence
 */
class Storage {
  /**
   * Save a string value
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  /**
   * Get a string value
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  /**
   * Remove a value
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  }

  /**
   * Save an object as JSON
   */
  async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage setObject error:', error);
      throw error;
    }
  }

  /**
   * Get an object from JSON
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  /**
   * Save auth tokens
   */
  async saveAuthTokens(authToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, authToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
    } catch (error) {
      console.error('Save auth tokens error:', error);
      throw error;
    }
  }

  /**
   * Get auth tokens
   */
  async getAuthTokens(): Promise<{ authToken: string | null; refreshToken: string | null }> {
    try {
      const keys = [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN];
      const values = await AsyncStorage.multiGet(keys);

      return {
        authToken: values[0][1],
        refreshToken: values[1][1],
      };
    } catch (error) {
      console.error('Get auth tokens error:', error);
      return { authToken: null, refreshToken: null };
    }
  }

  /**
   * Clear auth tokens
   */
  async clearAuthTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_ID,
      ]);
    } catch (error) {
      console.error('Clear auth tokens error:', error);
      throw error;
    }
  }

  /**
   * Save remember me preference
   */
  async setRememberMe(value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, value.toString());
    } catch (error) {
      console.error('Set remember me error:', error);
      throw error;
    }
  }

  /**
   * Get remember me preference
   */
  async getRememberMe(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return value === 'true';
    } catch (error) {
      console.error('Get remember me error:', error);
      return false;
    }
  }

  /**
   * Save user ID
   */
  async setUserId(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    } catch (error) {
      console.error('Set user ID error:', error);
      throw error;
    }
  }

  /**
   * Get user ID
   */
  async getUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('Get user ID error:', error);
      return null;
    }
  }
}

export const storage = new Storage();
