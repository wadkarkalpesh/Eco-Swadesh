import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../constants/translations';
import {
  MOCK_PRODUCTS,
  MOCK_SHIPMENTS,
  MOCK_COMMUNITY_POSTS,
  MOCK_CERTIFICATIONS,
  MOCK_COMMODITY_PRICES,
} from '../constants/mockData';
import apiClient from '../utils/apiClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication Guard State (Requires Login to view Home Page)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Localization & Persona State
  const [language, setLanguage] = useState('en');
  const [persona, setPersona] = useState('farmer'); // 'farmer' | 'consumer' | 'bulkBuyer' | 'seller' | 'expert' | 'admin'

  const loginUser = (userPayload) => {
    setIsAuthenticated(true);
    setCurrentUser(userPayload);
    if (userPayload?.persona) {
      setPersona(userPayload.persona);
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  const [currency, setCurrency] = useState('inr'); // 'inr' | 'usd' | 'eur' | 'aud'
  
  // Platform Order Mode: RETAIL (Kg/Lit) vs BULK (Tons)
  const [orderMode, setOrderMode] = useState('RETAIL'); // 'RETAIL' | 'BULK'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [certFilter, setCertFilter] = useState('ALL'); // 'ALL' | 'NATIONAL' | 'LOCAL_GOV'

  // Dynamic Data Lists with Initial Fallbacks
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
  const [communityPosts, setCommunityPosts] = useState(MOCK_COMMUNITY_POSTS);
  const [certifications, setCertifications] = useState(MOCK_CERTIFICATIONS);
  const [commodityTrends, setCommodityTrends] = useState(MOCK_COMMODITY_PRICES);
  const [orders, setOrders] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  // i18n Translation helper
  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  // Currency Converter helper
  const formatPrice = (amountInINR, isBulk = false, unit = 'Kg') => {
    let rate = 1;
    let symbol = '₹';

    if (currency === 'usd') {
      rate = 0.012;
      symbol = '$';
    } else if (currency === 'eur') {
      rate = 0.011;
      symbol = '€';
    } else if (currency === 'aud') {
      rate = 0.018;
      symbol = 'A$';
    }

    const converted = Math.round(amountInINR * rate);
    if (isBulk) {
      return `${symbol}${converted.toLocaleString()} / Ton`;
    }
    return `${symbol}${converted.toLocaleString()} / ${unit}`;
  };

  // Fetch Live Data from Backend API on Boot
  const fetchAllLiveData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await apiClient.products.getProducts().catch(() => null);
      if (prodRes && prodRes.products && prodRes.products.length > 0) {
        setProducts(prodRes.products);
        setServerOnline(true);
      }

      // 2. Fetch Commodity Trends
      const trendRes = await apiClient.products.getCommodityTrends().catch(() => null);
      if (trendRes && trendRes.trends && trendRes.trends.length > 0) {
        setCommodityTrends(trendRes.trends);
      }

      // 3. Fetch Certifications
      const certRes = await apiClient.trust.getCertifications().catch(() => null);
      if (certRes && certRes.certifications && certRes.certifications.length > 0) {
        setCertifications(certRes.certifications);
      }

      // 4. Fetch Community Posts
      const postRes = await apiClient.community.getPosts().catch(() => null);
      if (postRes && postRes.posts && postRes.posts.length > 0) {
        setCommunityPosts(postRes.posts);
      }

      // 5. Fetch Orders
      const orderRes = await apiClient.orders.getOrders().catch(() => null);
      if (orderRes && orderRes.orders) {
        setOrders(orderRes.orders);
      }

      // 6. Fetch Admin Overview
      const adminRes = await apiClient.admin.getOverview().catch(() => null);
      if (adminRes && adminRes.metrics) {
        setAdminMetrics(adminRes.metrics);
      }
    } catch (err) {
      console.warn('[AppContext] Live sync notice:', err.message);
      setServerOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLiveData();
  }, [fetchAllLiveData]);

  // Cart Functions
  const addToCart = (product, isBulk = false, quantity = 1) => {
    setCart((prev) => {
      const itemKey = `${product.id}-${isBulk ? 'bulk' : 'retail'}`;
      const existing = prev.find((i) => i.itemKey === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.itemKey === itemKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          itemKey,
          product,
          isBulk,
          quantity,
          unitPrice: isBulk ? product.bulkPricePerTon : product.retailPrice,
          unit: isBulk ? 'Ton' : product.retailUnit,
        },
      ];
    });
  };

  const removeFromCart = (itemKey) => {
    setCart((prev) => prev.filter((i) => i.itemKey !== itemKey));
  };

  const updateCartQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.itemKey === itemKey ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  // Live Mutations
  const createEscrowOrder = async (orderData) => {
    try {
      const res = await apiClient.orders.createEscrowOrder(orderData);
      if (res && res.orderId) {
        setOrders((prev) => [res, ...prev]);
        clearCart();
      }
      return res;
    } catch (err) {
      console.warn('[AppContext] createEscrowOrder fallback:', err.message);
      clearCart();
      return { success: true, orderId: `ORD-${Date.now()}` };
    }
  };

  const publishProductListing = async (newProduct) => {
    try {
      const res = await apiClient.products.createProduct(newProduct);
      if (res && res.product) {
        setProducts((prev) => [res.product, ...prev]);
      }
      return res;
    } catch (err) {
      const fallbackProd = { id: `prod-${Date.now()}`, ...newProduct };
      setProducts((prev) => [fallbackProd, ...prev]);
      return { success: true, product: fallbackProd };
    }
  };

  const addCommunityPost = async (newPost) => {
    const optimisticPost = {
      id: `post-${Date.now()}`,
      author: 'Current User',
      role: persona.toUpperCase(),
      verifiedExpert: persona === 'expert',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      upvotes: 0,
      repliesCount: 0,
      date: 'Just now',
      ...newPost,
    };
    setCommunityPosts((prev) => [optimisticPost, ...prev]);

    try {
      const res = await apiClient.community.createPost(newPost);
      if (res && res.post) {
        setCommunityPosts((prev) => [res.post, ...prev.filter((p) => p.id !== optimisticPost.id)]);
      }
      return res;
    } catch (_err) {
      return { success: true, post: optimisticPost };
    }
  };

  const upvoteCommunityPost = async (postId) => {
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p))
    );
    try {
      await apiClient.community.upvotePost(postId);
    } catch (_err) {}
  };

  const changeLanguage = (langCode) => setLanguage(langCode);
  
  const changePersona = async (newPersona) => {
    setPersona(newPersona);
    try {
      await apiClient.auth.switchPersona(newPersona);
    } catch (_err) {}
  };

  const changeCurrency = (newCurrency) => setCurrency(newCurrency);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        loginUser,
        logoutUser,
        language,
        changeLanguage,
        t,
        persona,
        changePersona,
        currency,
        changeCurrency,
        formatPrice,
        orderMode,
        setOrderMode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        certFilter,
        setCertFilter,
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        shipments,
        setShipments,
        communityPosts,
        setCommunityPosts,
        addCommunityPost,
        upvoteCommunityPost,
        certifications,
        setCertifications,
        commodityTrends,
        orders,
        createEscrowOrder,
        publishProductListing,
        adminMetrics,
        isLoading,
        serverOnline,
        refreshAllData: fetchAllLiveData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
