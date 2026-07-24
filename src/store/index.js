/**
 * Redux Store - combines all slices
 * Adds cart persistence middleware to save cart to localStorage on every cart action
 */
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';

/** Middleware: persists cart items to localStorage under a user-specific key after every cart action */
const cartPersistenceMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if (action.type && action.type.startsWith('cart/')) {
    try {
      const state = storeAPI.getState();
      const user = state.auth.user;
      if (user) {
        const userId = user.id || user.username;
        const cartItems = state.cart.items;
        localStorage.setItem(`producthub_cart_${userId}`, JSON.stringify(cartItems));
      }
    } catch (e) {
      console.warn('Cart persistence failed:', e);
    }
  }
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
});

export default store;