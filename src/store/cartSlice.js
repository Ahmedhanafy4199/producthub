/**
 * Cart Redux Slice
 * Manages: add to cart, remove, increment/decrement quantity
 * Cart state is persisted in localStorage via cartPersistenceMiddleware in store/index.js
 */
import { createSlice } from '@reduxjs/toolkit';
import { getUser } from '../utils/cache';

/** Load saved cart items from localStorage on app startup (based on cached user) */
const loadSavedCart = () => {
  try {
    const user = getUser();
    if (user) {
      const userId = user.id || user.username;
      const raw = localStorage.getItem(`producthub_cart_${userId}`);
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadSavedCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('auth/login/fulfilled', (state, action) => {
        const user = action.payload;
        if (user) {
          const userId = user.id || user.username;
          try {
            const raw = localStorage.getItem(`producthub_cart_${userId}`);
            state.items = raw ? JSON.parse(raw) : [];
          } catch {
            state.items = [];
          }
        }
      })
      .addCase('auth/logout', (state) => {
        state.items = [];
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

export const selectIsInCart = (id) => (state) =>
  state.cart.items.some((item) => item.id === id);

export default cartSlice.reducer;