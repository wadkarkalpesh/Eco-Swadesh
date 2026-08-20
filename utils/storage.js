// Client-side storage persistence utility for Deccan Origin Front-End App

const STORAGE_KEYS = {
  CART: '@eco_swadesh_cart',
  PERSONA: '@eco_swadesh_persona',
  LANGUAGE: '@eco_swadesh_language',
  CURRENCY: '@eco_swadesh_currency',
  SCAN_HISTORY: '@eco_swadesh_scan_history',
};

export const saveStorageData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, jsonValue);
    }
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const getStorageData = async (key, fallbackValue = null) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const jsonValue = window.localStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : fallbackValue;
    }
    return fallbackValue;
  } catch (e) {
    console.error('Storage load error:', e);
    return fallbackValue;
  }
};

export const removeStorageData = async (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.error('Storage remove error:', e);
  }
};

export { STORAGE_KEYS };
