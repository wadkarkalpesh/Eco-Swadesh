import React, { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from '../constants/translations';
import {
  MOCK_PRODUCTS,
  MOCK_SHIPMENTS,
  MOCK_COMMUNITY_POSTS,
  MOCK_CERTIFICATIONS,
} from '../constants/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Localization & Persona State
  const [language, setLanguage] = useState('en');
  const [persona, setPersona] = useState('farmer'); // 'farmer' | 'consumer' | 'bulkBuyer' | 'seller' | 'expert' | 'admin'
  const [currency, setCurrency] = useState('inr'); // 'inr' | 'usd' | 'eur' | 'aud'
  
  // Platform Order Mode: RETAIL (Kg/Lit) vs BULK (Tons)
  const [orderMode, setOrderMode] = useState('RETAIL'); // 'RETAIL' | 'BULK'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [certFilter, setCertFilter] = useState('ALL'); // 'ALL' | 'NATIONAL' | 'LOCAL_GOV'

  // Dynamic Data Lists
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
  const [communityPosts, setCommunityPosts] = useState(MOCK_COMMUNITY_POSTS);
  const [certifications, setCertifications] = useState(MOCK_CERTIFICATIONS);

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

  const addCommunityPost = (newPost) => {
    setCommunityPosts((prev) => [
      {
        id: `post-${Date.now()}`,
        author: 'Current User',
        role: persona.toUpperCase(),
        verifiedExpert: persona === 'expert',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        upvotes: 0,
        repliesCount: 0,
        date: 'Just now',
        ...newPost,
      },
      ...prev,
    ]);
  };

  const changeLanguage = (langCode) => setLanguage(langCode);
  const changePersona = (newPersona) => setPersona(newPersona);
  const changeCurrency = (newCurrency) => setCurrency(newCurrency);

  return (
    <AppContext.Provider
      value={{
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
        certifications,
        setCertifications,
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
