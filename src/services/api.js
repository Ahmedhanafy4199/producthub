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
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
