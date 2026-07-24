/**
 * Unit tests for ProductCard component
 * Tests: rendering image, title, price, discount badge, rating, and category
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import cartReducer from '../store/cartSlice';
import ProductCard from '../components/products/ProductCard';
import { ToastProvider } from '../components/common/ToastNotification';

// Create a minimal test store with just the cart slice
const createTestStore = (cartItems = []) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: cartItems } },
  });

// A mock product matching DummyJSON structure
const mockProduct = {
  id: 1,
  title: 'iPhone 14 Pro Max',
  description: 'Apple flagship smartphone with ProMotion display.',
  price: 1499,
  discountPercentage: 10,
  rating: 4.5,
  stock: 25,
  category: 'smartphones',
  thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
  images: [],
};

const renderCard = (product = mockProduct, cartItems = []) => {
  const store = createTestStore(cartItems);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ToastProvider>
          <ProductCard product={product} />
        </ToastProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('ProductCard', () => {
  it('renders the product title', () => {
    renderCard();
    expect(screen.getByText('iPhone 14 Pro Max')).toBeTruthy();
  });

  it('renders the product category', () => {
    renderCard();
    expect(screen.getByText('smartphones')).toBeTruthy();
  });

  it('renders the product thumbnail image', () => {
    renderCard();
    const img = screen.getByRole('img', { name: /iphone 14 pro max/i });
    expect(img).toBeTruthy();
    expect(img.src).toContain('thumbnail.jpg');
  });

  it('renders the discounted price', () => {
    renderCard();
    // 10% off $1499 = $1349.10
    expect(screen.getByText('$1,349.10')).toBeTruthy();
  });

  it('renders original strikethrough price when discount exists', () => {
    renderCard();
    expect(screen.getByText('$1,499.00')).toBeTruthy();
  });

  it('renders the discount badge when discount >= 5%', () => {
    renderCard();
    expect(screen.getByText('-10%')).toBeTruthy();
  });

  it('does not render discount badge when discount < 5%', () => {
    renderCard({ ...mockProduct, discountPercentage: 3 });
    expect(screen.queryByText(/-\d+%/)).toBeNull();
  });

  it('shows "Out of Stock" overlay when stock is 0', () => {
    renderCard({ ...mockProduct, stock: 0 });
    expect(screen.getByText('Out of Stock')).toBeTruthy();
  });

  it('shows low stock warning when stock <= 10', () => {
    renderCard({ ...mockProduct, stock: 5 });
    expect(screen.getByText('Only 5 left')).toBeTruthy();
  });

  it('shows "In Cart" button when product is already in cart', () => {
    const cartItems = [{ ...mockProduct, quantity: 1 }];
    renderCard(mockProduct, cartItems);
    expect(screen.getByText('In Cart')).toBeTruthy();
  });
});
