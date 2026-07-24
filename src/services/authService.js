/**
 * Auth Service - Login, Registration, and Profile
 *
 * DummyJSON Auth Endpoints:
 *   POST /auth/login       → { token, refreshToken, id, username, email, ... }
 *   POST /users/add        → Register a new user
 *   GET  /auth/me          → Get current authenticated user profile
 *
 * Note: DummyJSON API returns a mock response for POST /users/add, but does not persist
 * new users in its backend database. To support registering and immediately logging in,
 * we store locally registered users in localStorage as a fallback.
 */
import apiFetch from './api';

const LOCAL_USERS_KEY = 'producthub_local_users';

/**
 * Get locally registered users from localStorage
 */
const getLocalUsers = () => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Save a newly registered user to local storage
 */
const saveLocalUser = (userData) => {
  try {
    const users = getLocalUsers();
    users.push(userData);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save local user:', e);
  }
};

/**
 * Login with username + password
 * Tries DummyJSON /auth/login first; if it fails (e.g. for a newly registered user),
 * checks local storage fallback.
 */
export const loginUser = async (username, password) => {
  // Intercept built-in admin demo credentials
  if (username?.trim().toLowerCase() === 'admin' && password === 'admin123') {
    const mockToken = `mock-jwt-admin-${Date.now()}`;
    return {
      id: 9999,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      gender: 'neutral',
      image: 'https://dummyjson.com/icon/emilys/128',
      accessToken: mockToken,
      token: mockToken,
    };
  }

  try {
    // 1. Try real API login with DummyJSON
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    return data;
  } catch (apiError) {
    // 2. If API fails, check if user exists in locally registered users
    const localUsers = getLocalUsers();
    const matchedUser = localUsers.find(
      (u) => u.username?.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      // Generate a mock JWT accessToken for the local user session
      const mockToken = `mock-jwt-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      return {
        id: matchedUser.id || Date.now(),
        username: matchedUser.username,
        email: matchedUser.email || `${matchedUser.username}@example.com`,
        firstName: matchedUser.firstName || matchedUser.username,
        lastName: matchedUser.lastName || 'User',
        gender: matchedUser.gender || 'neutral',
        image: matchedUser.image || 'https://dummyjson.com/icon/emilys/128',
        accessToken: mockToken,
        token: mockToken,
      };
    }

    // Neither DummyJSON nor local storage matched
    throw apiError;
  }
};

/**
 * Register a new user (Calls DummyJSON /users/add + stores in local fallback)
 */
export const registerUser = async (userData) => {
  const data = await apiFetch('/users/add', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // Save full user data (including password for local login match)
  saveLocalUser({
    ...data,
    username: userData.username,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  });

  return data;
};

/**
 * Fetch the currently authenticated user profile
 */
export const getAuthenticatedUser = () => apiFetch('/auth/me');
