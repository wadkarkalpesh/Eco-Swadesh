/**
 * Eco Swadesh Supabase Client (React Native / Expo SDK 54 & Web SSR Safe)
 * Configured with AsyncStorage session persistence, auto-refresh tokens,
 * SSR-safe storage adapter, and resilient offline/local mode fallback.
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Retrieve credentials from Expo Constants or environment variables
const extra = Constants?.expoConfig?.extra || {};
const SUPABASE_URL = 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  extra.supabaseUrl || 
  'https://placeholder-project.supabase.co';

const SUPABASE_ANON_KEY = 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  extra.supabaseAnonKey || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('placeholder-project') &&
    !SUPABASE_ANON_KEY.includes('placeholder-anon-key')
  );
};

// SSR-safe storage adapter preventing "window is not defined" in Node.js / Expo Router SSR
const isServerEnvironment = Platform.OS === 'web' && typeof window === 'undefined';

const SSRSafeStorage = {
  getItem: async (key) => {
    if (isServerEnvironment) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch (_err) {
      return null;
    }
  },
  setItem: async (key, value) => {
    if (isServerEnvironment) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch (_err) {}
  },
  removeItem: async (key) => {
    if (isServerEnvironment) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch (_err) {}
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: SSRSafeStorage,
    autoRefreshToken: !isServerEnvironment,
    persistSession: !isServerEnvironment,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'EcoSwadesh-Mobile-Expo',
    },
  },
});

export default supabase;
