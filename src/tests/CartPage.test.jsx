/**
 * Unit tests for CartPage component
 * Tests: empty cart view, cart items list, and order summary
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import cartReducer from '../store/cartSlice';
import CartPage from '../pages/CartPage';
import { ToastProvider } from '../components/common/ToastNotification';

const createTestStore = (cartItems = []) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: cartItems } },
  });

const renderCart = (cartItems = []) => {
  const store = createTestStore(cartItems);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ToastProvider>
          <CartPage />
        </ToastProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('CartPage', () => {
  it('renders empty cart message when cart is empty', () => {
    renderCart([]);
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    expect(screen.getByText(/Looks like you haven't added/i)).toBeTruthy();
    expect(screen.getByText('Start Shopping')).toBeTruthy();
  });

  it('renders cart items when products are in the cart', () => {
    const cartItems = [
      {
        id: 1,
        title: 'iPhone 14 Pro Max',
        price: 1499,
        category: 'smartphones',
        quantity: 2,
        thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
      },
    ];
    renderCart(cartItems);

    expect(screen.getByText('iPhone 14 Pro Max')).toBeTruthy();
    expect(screen.getByText('smartphones')).toBeTruthy();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0); // quantity & banner count
    expect(screen.getByText('Order Summary')).toBeTruthy();
    // Subtotal: 2 * 1499 = 2998 -> formatted: $2,998.00
    expect(screen.getAllByText('$2,998.00').length).toBeGreaterThan(0);
  });
});
