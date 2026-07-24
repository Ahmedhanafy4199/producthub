/**
 * ProductsPage - the main product listing page
 * Contains: filter bar, sort dropdown, product grid, and pagination
 * Triggers data fetch whenever search, category, sort, or page changes
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadProducts,
  selectProducts, selectProductsLoading, selectProductsError,
  selectSearchQuery, selectSelectedCategory,
  selectSortBy, selectOrder, selectCurrentPage,
} from '../store/productsSlice';
import ProductFilter from '../components/products/ProductFilter';
import ProductSort from '../components/products/ProductSort';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/products/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);
  const order = useSelector(selectOrder);
  const currentPage = useSelector(selectCurrentPage);

  // Re-fetch whenever any filter/sort/page state changes
  useEffect(() => {
    dispatch(loadProducts({ page: currentPage, sortBy, order, category: selectedCategory, query: searchQuery }));
  }, [dispatch, currentPage, sortBy, order, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Explore Products
          </h1>
          <p className="text-blue-100 text-base max-w-xl mx-auto">
            Discover thousands of products — search, filter, sort, and find what you love.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter & Sort toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <ProductFilter />
            </div>
            <ProductSort />
          </div>
        </div>

        {/* Results count */}
        {!loading && products.length > 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-700 dark:text-slate-200">{products.length}</strong> products
            {searchQuery && <> for &ldquo;<em>{searchQuery}</em>&rdquo;</>}
            {selectedCategory && <> in <em className="capitalize">{selectedCategory}</em></>}
          </p>
        )}

        {/* Product Grid */}
        {loading ? (
          <LoadingSkeleton count={12} />
        ) : (
          <ProductGrid products={products} loading={loading} error={error} />
        )}

        {/* Pagination */}
        {!loading && !error && <Pagination />}
      </div>
    </main>
  );
};

export default ProductsPage;
