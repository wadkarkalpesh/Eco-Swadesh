/**
 * Eco Swadesh Supabase Service Layer
 * Encapsulates PostgreSQL CRUD, PostGIS queries, Auth, Certifications,
 * Escrow order lifecycles, and Supabase Realtime subscriptions.
 */

import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const supabaseService = {
  // ==========================================
  // 1. AUTHENTICATION & PROFILES
  // ==========================================
  async getCurrentUser() {
    if (!isSupabaseConfigured()) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  },

  async getProfile(userId) {
    if (!isSupabaseConfigured() || !userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[SupabaseService] getProfile error:', error.message);
      return null;
    }
    return data;
  },

  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured()) return { success: false, fallback: true };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  async signInWithPhoneOtp(phone) {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'Simulated OTP sent to ' + phone };
    }
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return { success: true, data };
  },

  async verifyPhoneOtp(phone, token) {
    if (!isSupabaseConfigured()) {
      return { success: true, session: { user: { phone } } };
    }
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return { success: true, data };
  },

  async signOut() {
    if (!isSupabaseConfigured()) return { success: true };
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  // ==========================================
  // 2. PRODUCTS & MARKETPLACE CATALOG
  // ==========================================
  async getProducts(options = {}) {
    if (!isSupabaseConfigured()) return null; // Let app use mock fallback
    
    let query = supabase
      .from('products')
      .select('*, seller:profiles(id, name, state, district, trust_score, verified)')
      .eq('in_stock', true);

    if (options.category && options.category !== 'All') {
      query = query.eq('category', options.category);
    }
    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }
    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }
    if (options.certScheme) {
      query = query.ilike('cert_scheme', `%${options.certScheme}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('[SupabaseService] getProducts error:', error.message);
      return null;
    }
    return data;
  },

  async getProductById(productId) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('products')
      .select('*, seller:profiles(*)')
      .eq('id', productId)
      .single();

    if (error) {
      console.warn('[SupabaseService] getProductById error:', error.message);
      return null;
    }
    return data;
  },

  async createProduct(productData) {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { id: `prod_${Date.now()}`, ...productData } };
    }
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  // ==========================================
  // 3. CERTIFICATIONS & TRUST REGISTER
  // ==========================================
  async verifyCertificate(certNumber) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('certifications')
      .select('*, user:profiles(name, state, district, trust_score)')
      .eq('cert_number', certNumber)
      .single();

    if (error) {
      console.warn('[SupabaseService] verifyCertificate error:', error.message);
      return null;
    }
    return data;
  },

  // ==========================================
  // 4. ORDERS & ESCROW LIFECYCLE
  // ==========================================
  async createEscrowOrder(orderData) {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        order: {
          id: `ord_${Date.now()}`,
          order_code: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          escrow_status: 'LOCKED_IN_ESCROW',
          ...orderData,
        },
      };
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_code: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        escrow_status: 'LOCKED_IN_ESCROW',
        ...orderData,
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, order: data };
  },

  async getUserOrders(userId) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(title, image_url), seller:profiles(name), buyer:profiles(name)')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[SupabaseService] getUserOrders error:', error.message);
      return null;
    }
    return data;
  },

  // ==========================================
  // 5. COMMUNITY AGRONOMY DISCUSSIONS
  // ==========================================
  async getCommunityPosts() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, author:profiles(name, persona, state, verified, trust_score), answers:community_answers(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[SupabaseService] getCommunityPosts error:', error.message);
      return null;
    }
    return data;
  },

  async createCommunityPost(postData) {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { id: `post_${Date.now()}`, ...postData } };
    }
    const { data, error } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  },

  // ==========================================
  // 6. REALTIME SUBSCRIPTIONS (IoT & Disputes)
  // ==========================================
  subscribeToIoTTelemetry(orderId, onRecord) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`iot_telemetry_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'iot_telemetry',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          if (onRecord) onRecord(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

export default supabaseService;
