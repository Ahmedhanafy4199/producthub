/**
 * Product Service - fetch products, categories, search, and details
 *
 * DummyJSON Product Endpoints:
 *   GET /products                          → All products (paginated)
 *   GET /products/:id                      → Single product
 *   GET /products/search?q=:query          → Search products by title
 *   GET /products/categories               → All category list
 *   GET /products/category/:category       → Products in a category
 *
 * Full API docs: https://dummyjson.com/docs/products
 */
import apiFetch from './api';

/** Fetch a paginated list of products */
export const fetchProducts = (limit = 12, skip = 0, sortBy = 'id', order = 'asc') =>
  apiFetch(`/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`);

/** Fetch a single product by its ID */
export const fetchProductById = (id) => apiFetch(`/products/${id}`);

/** Search products by a text query (debounced on caller side) */
export const searchProducts = (query, limit = 12, skip = 0) =>
  apiFetch(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);

/** Fetch all available product categories */
export const fetchCategories = () => apiFetch('/products/categories');

/** Fetch all products under a specific category */
export const fetchProductsByCategory = (category, limit = 12, skip = 0, sortBy = 'id', order = 'asc') =>
  apiFetch(`/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`);
