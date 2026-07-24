/**
 * ProductFilter - search bar + category filter pills
 * Dispatches to Redux store and triggers debounced product fetching
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import {
  setSearchQuery,
  setCategory,
  selectSearchQuery,
  selectSelectedCategory,
  selectCategories,
  loadCategories,
} from '../../store/productsSlice';

const ProductFilter = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const categories = useSelector(selectCategories);

  // Local state for the input (debounce applied)
  const [inputValue, setInputValue] = useState(searchQuery);

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(loadCategories());
    }
  }, [dispatch, categories.length]);

  // Sync inputValue when Redux searchQuery changes externally (e.g. URL hydration on refresh)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounce: wait 400ms after user stops typing before dispatching
  // Skip dispatch if inputValue already equals the Redux state (avoids loop on URL hydration)
  useEffect(() => {
    if (inputValue === searchQuery) return;
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(inputValue));
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, dispatch, searchQuery]);

  const handleClear = () => {
    setInputValue('');
    dispatch(setSearchQuery(''));
  };


  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
        <input
          id="product-search"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm shadow-sm"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
          </span>
          {/* All pill */}
          <button
            onClick={() => dispatch(setCategory(''))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {categories.slice(0, 16).map((cat) => {
            const slug = cat.slug || cat;
            const name = cat.name || cat;
            return (
              <button
                key={slug}
                onClick={() => dispatch(setCategory(slug))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 capitalize ${
                  selectedCategory === slug
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
