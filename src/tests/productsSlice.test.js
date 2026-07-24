/**
 * Unit tests for productsSlice Redux reducer and title search filtering
 */
import { describe, it, expect, vi } from 'vitest';
import productsReducer, {
  setSearchQuery,
  setCategory,
  setSort,
  setPage,
  clearError,
  loadProducts,
} from '../store/productsSlice';
import * as productService from '../services/productService';

vi.mock('../services/productService');

describe('productsSlice', () => {
  const initialState = {
    items: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    categories: [],
    selectedCategory: '',
    searchQuery: '',
    sortBy: 'id',
    order: 'asc',
    loading: false,
    loadingDetail: false,
    error: null,
    selectedProduct: null,
  };

  it('should return initial state', () => {
    const state = productsReducer(undefined, { type: '@@INIT' });
    expect(state.searchQuery).toBe('');
    expect(state.currentPage).toBe(1);
  });

  it('setSearchQuery action should update searchQuery and reset page to 1', () => {
    const stateWithPage2 = { ...initialState, currentPage: 2 };
    const state = productsReducer(stateWithPage2, setSearchQuery('phone'));
    expect(state.searchQuery).toBe('phone');
    expect(state.currentPage).toBe(1);
  });

  it('setCategory action should update selectedCategory and reset page to 1', () => {
    const state = productsReducer(initialState, setCategory('smartphones'));
    expect(state.selectedCategory).toBe('smartphones');
    expect(state.currentPage).toBe(1);
  });

  it('loadProducts should filter search results strictly by title', async () => {
    const mockProducts = [
      { id: 1, title: 'iPhone 13', description: 'A great smartphone', category: 'smartphones' },
      { id: 2, title: 'Samsung Galaxy', description: 'Includes phone case', category: 'smartphones' },
      { id: 3, title: 'MacBook Pro', description: 'Best laptop with phone integration feature', category: 'laptops' },
    ];

    productService.searchProducts.mockResolvedValue({ products: mockProducts, total: 3 });

    const dispatch = vi.fn();
    const thunk = loadProducts({ query: 'phone', page: 1 });

    const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

    // Only "iPhone 13" has "phone" in title ("iPhone")
    // "Samsung Galaxy" and "MacBook Pro" do not contain "phone" in their title
    expect(result.payload.products).toEqual([
      { id: 1, title: 'iPhone 13', description: 'A great smartphone', category: 'smartphones' },
    ]);
    expect(result.payload.total).toBe(1);
  });
});
