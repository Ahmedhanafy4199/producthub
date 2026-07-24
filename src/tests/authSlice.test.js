/**
 * Unit tests for authSlice Redux reducer
 * Covers: initial state, logout, error clearing, login lifecycle, and register lifecycle
 */
import { describe, it, expect } from 'vitest';
import authReducer, { logout, clearError } from '../store/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    registerSuccess: false,
  };

  it('returns default initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
    expect(state.registerSuccess).toBe(false);
  });

  it('logout action clears user and token state', () => {
    const loggedInState = {
      ...initialState,
      user: { id: 1, username: 'emilys' },
      token: 'jwt-token-xyz',
    };
    const state = authReducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('clearError action resets error to null', () => {
    const stateWithError = { ...initialState, error: 'Invalid login details' };
    const state = authReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  describe('Login Thunk Extra Reducers', () => {
    it('login.pending sets loading to true and clears previous error', () => {
      const previousState = { ...initialState, error: 'Old error' };
      const state = authReducer(previousState, { type: 'auth/login/pending' });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('login.fulfilled sets user and token and stops loading', () => {
      const mockPayload = { id: 1, username: 'emilys', accessToken: 'token-123' };
      const state = authReducer(initialState, { type: 'auth/login/fulfilled', payload: mockPayload });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockPayload);
      expect(state.token).toBe('token-123');
    });

    it('login.rejected sets error message and stops loading', () => {
      const state = authReducer(initialState, {
        type: 'auth/login/rejected',
        payload: 'Invalid credentials',
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('Register Thunk Extra Reducers', () => {
    it('register.pending sets loading to true and resets registerSuccess', () => {
      const state = authReducer(initialState, { type: 'auth/register/pending' });
      expect(state.loading).toBe(true);
      expect(state.registerSuccess).toBe(false);
    });

    it('register.fulfilled sets registerSuccess to true and stops loading', () => {
      const state = authReducer(initialState, {
        type: 'auth/register/fulfilled',
        payload: { id: 101 },
      });
      expect(state.loading).toBe(false);
      expect(state.registerSuccess).toBe(true);
    });

    it('register.rejected sets error message and stops loading', () => {
      const state = authReducer(initialState, {
        type: 'auth/register/rejected',
        payload: 'Username already taken',
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Username already taken');
    });
  });
});
