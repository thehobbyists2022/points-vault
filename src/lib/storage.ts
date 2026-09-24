import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Durable key/value storage.
 * - On iOS/Android (Capacitor) it uses native storage (@capacitor/preferences),
 *   which is not evicted like WebView localStorage can be.
 * - On the web it falls back to localStorage so the site behaves as before.
 */
export const nativeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      return value ?? null;
    }
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value });
      return;
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key });
      return;
    }
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  },
};
