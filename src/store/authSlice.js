/**
 * Auth Redux Slice
 * Manages: login, register, logout, and user profile
 * State is persisted in localStorage via cache.js utilities
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../services/authService';
import { saveToken, getToken, removeToken, saveUser, getUser, removeUser } from '../utils/cache';

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const data = await loginUser(username, password);
    // Persist JWT and user profile to localStorage
    saveToken(data.accessToken || data.token);
    saveUser(data);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await registerUser(userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// ─── Slice ───────────────────────────────────────────────────────────────────

// Rehydrate state from cache on app start
const cachedUser = getUser();
const cachedToken = getToken();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: cachedUser || null,
    token: cachedToken || null,
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      removeToken();
      removeUser();
    },
    clearError(state) {
      state.error = null;
    },
    clearRegisterSuccess(state) {
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken || action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Register ──
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearRegisterSuccess } = authSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;

export default authSlice.reducer;
