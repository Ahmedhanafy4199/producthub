import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { setSort, selectSortBy, selectOrder } from '../../store/productsSlice';

const SORT_OPTIONS = [
  { label: 'Default Sorting', sortBy: 'id', order: 'asc' },
  { label: 'Price: Low → High', sortBy: 'price', order: 'asc' },
  { label: 'Price: High → Low', sortBy: 'price', order: 'desc' },
  { label: 'Rating: Best First', sortBy: 'rating', order: 'desc' },
  { label: 'Title: A → Z', sortBy: 'title', order: 'asc' },
  { label: 'Title: Z → A', sortBy: 'title', order: 'desc' },
];

const ProductSort = () => {
  const dispatch = useDispatch();
  const sortBy = useSelector(selectSortBy);
  const order = useSelector(selectOrder);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const activeOption = SORT_OPTIONS.find(
    (opt) => opt.sortBy === sortBy && opt.order === order
  ) || SORT_OPTIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    dispatch(setSort({ sortBy: option.sortBy, order: option.order }));
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto" ref={containerRef}>
      {/* Hidden select for accessibility/testing */}
      <select
        id="product-sort"
        aria-label="Sort products"
        value={`${sortBy}_${order}`}
        onChange={(e) => {
          const [sb, o] = e.target.value.split('_');
          dispatch(setSort({ sortBy: sb, order: o }));
        }}
        className="sr-only"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={`${opt.sortBy}_${opt.order}`} value={`${opt.sortBy}_${opt.order}`}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Responsive Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ArrowUpDown className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 shrink-0">Sort:</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
            {activeOption.label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 left-0 sm:left-auto mt-2 w-full sm:w-60 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-40 animate-fade-in p-1.5 overflow-hidden">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = opt.sortBy === sortBy && opt.order === order;
            return (
              <button
                key={`${opt.sortBy}_${opt.order}`}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductSort;
