/**
 * ProductGrid - renders a responsive grid of product cards
 * Handles empty state and error messaging
 */
import { PackageX } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error }) => {
  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <PackageX className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Failed to load products</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <PackageX className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No products found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
