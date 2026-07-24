/**
 * Base API client - DummyJSON public API
 * Attaches JWT token to every request automatically
 * API Docs: https://dummyjson.com/docs
 */
import { getToken } from '../utils/cache';

export const BASE_URL = 'https://dummyjson.com';

/**
 * Core fetch wrapper that injects Authorization header when a token exists
 * and throws a structured error on non-OK responses.
 */
const apiFetch = async (path, options = {}) => {
  const token = getToken();
  
  // Only attach auth token for endpoints that require it (e.g., /auth/me)
  // Public endpoints like /products do not need it, allowing them to be cached by CDNs/browsers.
  const requiresAuth = path.startsWith('/auth/') && path !== '/auth/login';

  const headers = {
    'Content-Type': 'application/json',
    ...(token && requiresAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export default apiFetch;
