/**
 * ProductsPage - the main product listing page
 * Contains: filter bar, sort dropdown, product grid, and pagination
 * Syncs search/filter/sort/page state with URL search params for refresh persistence
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  loadProducts,
  syncFiltersFromUrl,
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
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);
  const order = useSelector(selectOrder);
  const currentPage = useSelector(selectCurrentPage);

  // ── hydrated: false until URL params have been synced into Redux ──
  // Using useState (not useRef) so that setting it to true triggers a re-render
  // and the fetch useEffect below can run with the correct filter values.
  const [hydrated, setHydrated] = useState(false);

  // ── Step 1: Read URL params once on mount and hydrate Redux state ──
  useEffect(() => {
    const q         = searchParams.get('q')        || '';
    const category  = searchParams.get('category') || '';
    const urlSortBy = searchParams.get('sortBy')   || 'id';
    const urlOrder  = searchParams.get('order')    || 'asc';
    const page      = parseInt(searchParams.get('page'), 10) || 1;

    const hasParams = q || category || urlSortBy !== 'id' || urlOrder !== 'asc' || page > 1;
    if (hasParams) {
      // Restore all filter state from URL — this triggers a Redux state update
      dispatch(syncFiltersFromUrl({ query: q, category, sortBy: urlSortBy, order: urlOrder, page }));
    }

    // Mark hydration done — triggers re-render so Step 3 can fire with correct state
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step 2: Write URL params whenever Redux filter state changes (skip before hydrated) ──
  useEffect(() => {
    if (!hydrated) return;

    // Check current values in URL to avoid redundant updates
    const currentQ = searchParams.get('q') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentSortBy = searchParams.get('sortBy') || 'id';
    const currentOrder = searchParams.get('order') || 'asc';
    const currentPageStr = searchParams.get('page') || '1';

    const hasMismatch =
      searchQuery !== currentQ ||
      selectedCategory !== currentCategory ||
      sortBy !== currentSortBy ||
      order !== currentOrder ||
      String(currentPage) !== currentPageStr;

    if (!hasMismatch) return;

    const params = {};
    if (searchQuery)      params.q        = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (sortBy !== 'id')  params.sortBy   = sortBy;
    if (order !== 'asc')  params.order    = order;
    if (currentPage > 1)  params.page     = String(currentPage);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, sortBy, order, currentPage, hydrated, searchParams, setSearchParams]);

  // ── Step 3: Fetch products — only after hydration is done ──
  // On refresh: waits for Step 1 to restore filter state, then fetches with correct values.
  // On normal navigation: hydrated=true immediately, so this runs normally.
  useEffect(() => {
    if (!hydrated) return;
    dispatch(loadProducts({ page: currentPage, sortBy, order, category: selectedCategory, query: searchQuery }));
  }, [dispatch, hydrated, currentPage, sortBy, order, selectedCategory, searchQuery]);

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

