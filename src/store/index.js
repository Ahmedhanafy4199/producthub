/**
 * Redux Store - combines all slices
 * Adds cart persistence middleware to save cart to localStorage on every cart action
 */
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';

/** Middleware: persists cart items to localStorage after every cart-related action */
const cartPersistenceMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if (action.type && action.type.startsWith('cart/')) {
    try {
      const cartItems = storeAPI.getState().cart.items;
      localStorage.setItem('producthub_cart', JSON.stringify(cartItems));
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