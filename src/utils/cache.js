/**
 * Cache utility - handles localStorage with expiration timestamps
 * Used for JWT tokens and API response caching
 */

const CACHE_PREFIX = 'producthub_';

/**
 * Set item in cache with optional TTL (time to live) in milliseconds
 */
export const setCache = (key, value, ttlMs = null) => {
  const item = {
    value,
    timestamp: Date.now(),
    expiry: ttlMs ? Date.now() + ttlMs : null,
  };
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
};

/**
 * Get item from cache - returns null if expired or missing
 */
export const getCache = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return item.value;
  } catch (e) {
    return null;
  }
};

/**
 * Remove an item from cache
 */
export const removeCache = (key) => {
  localStorage.removeItem(CACHE_PREFIX + key);
};

/**
 * Clear all producthub cache entries
 */
export const clearCache = () => {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
};

// Token specific helpers - JWT expires in 1 hour
const TOKEN_TTL = 60 * 60 * 1000;

export const saveToken = (token) => setCache('access_token', token, TOKEN_TTL);
export const getToken = () => getCache('access_token');
export const removeToken = () => removeCache('access_token');

export const saveUser = (user) => setCache('user', user, TOKEN_TTL);
export const getUser = () => getCache('user');
export const removeUser = () => removeCache('user');
