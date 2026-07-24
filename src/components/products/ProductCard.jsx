/**
 * ProductCard - displays a single product in the grid
 * Shows: image, category badge, title, rating, price, discount, and add-to-cart button
 */
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { addToCart, selectIsInCart } from '../../store/cartSlice';
import { formatPrice, getDiscountedPrice, truncateText } from '../../utils/formatters';
import { useToast } from '../common/ToastNotification';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const inCart = useSelector(selectIsInCart(product.id));

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

  const handleAddToCart = (e) => {
    // Prevent navigating to detail page when clicking the button
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`"${truncateText(product.title, 30)}" added to cart!`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
      aria-label={`View details for ${product.title}`}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-52 bg-slate-50 dark:bg-slate-900">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Discount Badge */}
        {product.discountPercentage >= 5 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white shadow">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category */}
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 flex-1">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i <= Math.round(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPercentage >= 1 && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              inCart
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" /> In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
