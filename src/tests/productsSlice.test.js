/**
 * Unit tests for productsSlice Redux reducer and loadProducts thunk
 * Covers: reducers, title-only search, category filtering, sorting, pagination, and error handling
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import productsReducer, {
  setSearchQuery,
  setCategory,
  setSort,
  setPage,
  clearSelectedProduct,
  clearError,
  loadProducts,
  loadProductById,
  loadCategories,
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Synchronous Reducers', () => {
    it('returns default initial state', () => {
      const state = productsReducer(undefined, { type: '@@INIT' });
      expect(state.searchQuery).toBe('');
      expect(state.currentPage).toBe(1);
      expect(state.items).toEqual([]);
    });

    it('setSearchQuery updates query and resets currentPage to 1', () => {
      const state = productsReducer({ ...initialState, currentPage: 3 }, setSearchQuery('laptop'));
      expect(state.searchQuery).toBe('laptop');
      expect(state.currentPage).toBe(1);
    });

    it('setCategory updates category and resets currentPage to 1', () => {
      const state = productsReducer({ ...initialState, currentPage: 2 }, setCategory('smartphones'));
      expect(state.selectedCategory).toBe('smartphones');
      expect(state.currentPage).toBe(1);
    });

    it('setSort updates sortBy and order and resets currentPage to 1', () => {
      const state = productsReducer({ ...initialState, currentPage: 4 }, setSort({ sortBy: 'price', order: 'desc' }));
      expect(state.sortBy).toBe('price');
      expect(state.order).toBe('desc');
      expect(state.currentPage).toBe(1);
    });

    it('setPage updates currentPage', () => {
      const state = productsReducer(initialState, setPage(3));
      expect(state.currentPage).toBe(3);
    });

    it('clearSelectedProduct sets selectedProduct to null', () => {
      const state = productsReducer({ ...initialState, selectedProduct: { id: 1 } }, clearSelectedProduct());
      expect(state.selectedProduct).toBeNull();
    });

    it('clearError sets error to null', () => {
      const state = productsReducer({ ...initialState, error: 'Failed' }, clearError());
      expect(state.error).toBeNull();
    });
  });

  describe('Async Thunk: loadProducts', () => {
    const mockProducts = [
      { id: 1, title: 'iPhone 14', description: 'Apple phone', category: 'smartphones', price: 999, rating: 4.8 },
      { id: 2, title: 'Samsung Galaxy', description: 'Android phone with case', category: 'smartphones', price: 799, rating: 4.5 },
      { id: 3, title: 'MacBook Pro', description: 'Laptop with phone integration', category: 'laptops', price: 1999, rating: 4.9 },
    ];

    it('fetches all products when no query or category is specified', async () => {
      productService.fetchProducts.mockResolvedValue({ products: mockProducts, total: 3 });

      const dispatch = vi.fn();
      const thunk = loadProducts({ page: 1 });
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      expect(productService.fetchProducts).toHaveBeenCalledWith(12, 0, 'id', 'asc');
      expect(result.payload.products).toEqual(mockProducts);
      expect(result.payload.total).toBe(3);
    });

    it('filters search results strictly by title (includes matching title, excludes description match)', async () => {
      productService.searchProducts.mockResolvedValue({ products: mockProducts, total: 3 });

      const dispatch = vi.fn();
      const thunk = loadProducts({ query: 'phone', page: 1 });
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      // Only "iPhone 14" has "phone" in title (iPhone)
      // "Samsung Galaxy" and "MacBook Pro" do NOT contain "phone" in title
      expect(result.payload.products).toHaveLength(1);
      expect(result.payload.products[0].title).toBe('iPhone 14');
      expect(result.payload.total).toBe(1);
    });

    it('combines title search with category filtering when category is selected', async () => {
      const mixedProducts = [
        { id: 1, title: 'Phone Stand Holder', category: 'accessories' },
        { id: 2, title: 'Smart Phone X', category: 'smartphones' },
      ];
      productService.searchProducts.mockResolvedValue({ products: mixedProducts, total: 2 });

      const dispatch = vi.fn();
      const thunk = loadProducts({ query: 'phone', category: 'smartphones', page: 1 });
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      expect(result.payload.products).toEqual([
        { id: 2, title: 'Smart Phone X', category: 'smartphones' },
      ]);
      expect(result.payload.total).toBe(1);
    });

    it('sorts search results client-side when sortBy is passed', async () => {
      const items = [
        { id: 1, title: 'Phone Alpha', price: 500 },
        { id: 2, title: 'Phone Beta', price: 200 },
        { id: 3, title: 'Phone Gamma', price: 800 },
      ];
      productService.searchProducts.mockResolvedValue({ products: items, total: 3 });

      const dispatch = vi.fn();
      const thunk = loadProducts({ query: 'phone', sortBy: 'price', order: 'asc', page: 1 });
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      expect(result.payload.products.map((p) => p.price)).toEqual([200, 500, 800]);
    });

    it('handles rejection when API call fails', async () => {
      productService.fetchProducts.mockRejectedValue(new Error('Network Error'));

      const dispatch = vi.fn();
      const thunk = loadProducts({ page: 1 });
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      expect(result.payload).toBe('Network Error');
    });
  });

  describe('Async Thunk: loadProductById', () => {
    it('fetches single product details successfully', async () => {
      const singleProduct = { id: 1, title: 'iPhone 14' };
      productService.fetchProductById.mockResolvedValue(singleProduct);

      const dispatch = vi.fn();
      const thunk = loadProductById(1);
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      expect(result.payload).toEqual(singleProduct);
    });
  });

  describe('Async Thunk: loadCategories', () => {
    it('fetches categories list successfully', async () => {
      const categories = ['smartphones', 'laptops', 'fragrances'];
      productService.fetchCategories.mockResolvedValue(categories);

      const dispatch = vi.fn();
      const thunk = loadCategories();
      const result = await thunk(dispatch, () => ({ products: initialState }), undefined);

      expect(result.payload).toEqual(categories);
    });
  });
});
