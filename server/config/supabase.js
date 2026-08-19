/**
 * Eco Swadesh Server-Side Supabase Admin Client
 * Provides privileged administrative database operations using SUPABASE_SERVICE_ROLE_KEY
 * for Razorpay webhooks, dispute settlements, trust scoring, and background workers.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseAdmin = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY && !SUPABASE_URL.includes('placeholder')) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('[Supabase Server] Initialized administrative client for:', SUPABASE_URL);
} else {
  console.log('[Supabase Server] No active Supabase URL/Service Key detected. Running in resilient hybrid mode.');
}

module.exports = {
  supabaseAdmin,
  isSupabaseEnabled: () => !!supabaseAdmin,
};
