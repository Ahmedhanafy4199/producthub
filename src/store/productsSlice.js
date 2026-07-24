/**
 * Products Redux Slice
 * Manages: product list, search query, category filter, sorting, and pagination
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchCategories,
  fetchProductsByCategory,
} from '../services/productService';

const PAGE_SIZE = 12;

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async ({ page = 1, sortBy = 'id', order = 'asc', category = '', query = '' }, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * PAGE_SIZE;
      let data;
      if (query) {
        // Fetch matching search results from API (limit=0 to retrieve all for accurate title filtering)
        const searchData = await searchProducts(query, 0, 0);
        const cleanQuery = query.trim().toLowerCase();
        let filteredProducts = (searchData.products || []).filter((product) =>
          product.title ? product.title.toLowerCase().includes(cleanQuery) : false
        );

        if (category) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === category
          );
        }

        if (sortBy && sortBy !== 'id') {
          filteredProducts.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
          });
        }

        const total = filteredProducts.length;
        const paginatedProducts = filteredProducts.slice(skip, skip + PAGE_SIZE);
        data = { products: paginatedProducts, total };
      } else if (category) {
        data = await fetchProductsByCategory(category, PAGE_SIZE, skip, sortBy, order);
      } else {
        data = await fetchProducts(PAGE_SIZE, skip, sortBy, order);
      }
      return { ...data, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadProductById = createAsyncThunk(
  'products/loadProductById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadCategories = createAsyncThunk(
  'products/loadCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategories();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const productsSlice = createSlice({
  name: 'products',
  initialState: {
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
  },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setSort(state, action) {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
      state.currentPage = 1;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearError(state) {
      state.error = null;
    },
    /** Restore all filter/search/sort/page state from URL params at once (no page reset) */
    syncFiltersFromUrl(state, action) {
      const { query, category, sortBy, order, page } = action.payload;
      if (query   !== undefined) state.searchQuery      = query;
      if (category !== undefined) state.selectedCategory = category;
      if (sortBy   !== undefined) state.sortBy           = sortBy;
      if (order    !== undefined) state.order            = order;
      if (page     !== undefined) state.currentPage      = page;
    },
  },
  extraReducers: (builder) => {
    // ── Load Products ──
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = Math.ceil(action.payload.total / PAGE_SIZE);
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Load Single Product ──
    builder
      .addCase(loadProductById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedProduct = action.payload;
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      });

    // ── Load Categories ──
    builder
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setCategory,
  setSort,
  setPage,
  clearSelectedProduct,
  clearError,
  syncFiltersFromUrl,
} = productsSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectProducts = (state) => state.products.items;
export const selectTotal = (state) => state.products.total;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectTotalPages = (state) => state.products.totalPages;
export const selectCategories = (state) => state.products.categories;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSortBy = (state) => state.products.sortBy;
export const selectOrder = (state) => state.products.order;
export const selectProductsLoading = (state) => state.products.loading;
export const selectDetailLoading = (state) => state.products.loadingDetail;
export const selectProductsError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selectedProduct;

export default productsSlice.reducer;
