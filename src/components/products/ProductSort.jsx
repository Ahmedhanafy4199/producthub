/**
 * ProductSort - dropdown to sort products by field and order
 */
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpDown } from 'lucide-react';
import { setSort, selectSortBy, selectOrder } from '../../store/productsSlice';

const SORT_OPTIONS = [
  { label: 'Default', sortBy: 'id', order: 'asc' },
  { label: 'Price: Low → High', sortBy: 'price', order: 'asc' },
  { label: 'Price: High → Low', sortBy: 'price', order: 'desc' },
  { label: 'Rating: Best First', sortBy: 'rating', order: 'desc' },
  { label: 'A → Z', sortBy: 'title', order: 'asc' },
  { label: 'Z → A', sortBy: 'title', order: 'desc' },
];

const ProductSort = () => {
  const dispatch = useDispatch();
  const sortBy = useSelector(selectSortBy);
  const order = useSelector(selectOrder);

  const currentValue = `${sortBy}_${order}`;

  const handleChange = (e) => {
    const [sb, o] = e.target.value.split('_');
    dispatch(setSort({ sortBy: sb, order: o }));
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
      <select
        id="product-sort"
        value={currentValue}
        onChange={handleChange}
        className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={`${opt.sortBy}_${opt.order}`} value={`${opt.sortBy}_${opt.order}`}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSort;
