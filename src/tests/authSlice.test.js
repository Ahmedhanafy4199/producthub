/**
 * Unit tests for authSlice Redux reducer
 * Tests: initial state, logout action, error clearing
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

  it('should return the default initial state', () => {
    // When no state is passed, the reducer should return a valid initial state
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.registerSuccess).toBe(false);
  });

  it('logout action should clear user and token', () => {
    const loggedInState = {
      ...initialState,
      user: { id: 1, username: 'emilys' },
      token: 'mock-jwt-token',
    };
    const state = authReducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('clearError action should set error to null', () => {
    const stateWithError = { ...initialState, error: 'Invalid credentials' };
    const state = authReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  it('login.pending should set loading to true and clear error', () => {
    const state = authReducer(initialState, { type: 'auth/login/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('login.fulfilled should set user and token and stop loading', () => {
    const mockPayload = { id: 1, username: 'emilys', accessToken: 'abc123' };
    const state = authReducer(initialState, { type: 'auth/login/fulfilled', payload: mockPayload });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockPayload);
    expect(state.token).toBe('abc123');
  });

  it('login.rejected should set error and stop loading', () => {
    const state = authReducer(initialState, {
      type: 'auth/login/rejected',
      payload: 'Invalid username or password',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Invalid username or password');
  });

  it('register.pending should set loading to true', () => {
    const state = authReducer(initialState, { type: 'auth/register/pending' });
    expect(state.loading).toBe(true);
    expect(state.registerSuccess).toBe(false);
  });

  it('register.fulfilled should set registerSuccess to true', () => {
    const state = authReducer(initialState, {
      type: 'auth/register/fulfilled',
      payload: { id: 200 },
    });
    expect(state.loading).toBe(false);
    expect(state.registerSuccess).toBe(true);
  });
});
