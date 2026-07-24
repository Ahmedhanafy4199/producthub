/**
 * ProductDetailPage - full product detail view
 * Shows: image gallery, title, description, price, category, rating, stock, reviews
 * Accessible via /products/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, Star, ShoppingCart, Check, Package,
  RefreshCw, Shield, Tag,
} from 'lucide-react';
import {
  loadProductById,
  clearSelectedProduct,
  selectSelectedProduct,
  selectDetailLoading,
  selectProductsError,
} from '../store/productsSlice';
import { addToCart, selectIsInCart } from '../store/cartSlice';
import { formatPrice, getDiscountedPrice, getStarRating } from '../utils/formatters';
import { useToast } from '../components/common/ToastNotification';

const DetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
    <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-8 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl mt-4" />
        <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl mt-4" />
      </div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectProductsError);
  const inCart = useSelector(selectIsInCart(Number(id)));

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(loadProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  useEffect(() => {
    if (product) setActiveImage(0);
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`"${product.title}" added to cart! 🛒`);
  };

  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"><DetailSkeleton /></div>;

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 text-center px-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Product not found</h2>
        <p className="text-slate-500 dark:text-slate-400">{error || 'We could not find the product you are looking for.'}</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const stars = getStarRating(product.rating);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <img
                src={images[activeImage]}
                alt={`${product.title} - image ${activeImage + 1}`}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? 'border-blue-500 shadow-md'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-5">
            {/* Category & Brand */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {product.brand}
                </span>
              )}
              {product.discountPercentage >= 5 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {stars.map((s, i) => (
                  <Star
                    key={i}
                    className={`w-4.5 h-4.5 ${
                      s === 'full'
                        ? 'text-amber-400 fill-amber-400'
                        : s === 'half'
                        ? 'text-amber-400 fill-amber-200'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {product.rating.toFixed(1)}
              </span>
              {product.reviews?.length > 0 && (
                <span className="text-xs text-slate-400">({product.reviews.length} reviews)</span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(discountedPrice)}
              </span>
              {product.discountPercentage >= 1 && (
                <span className="text-lg text-slate-400 line-through mb-0.5">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className={`flex items-center gap-2 text-sm font-medium ${
              product.stock > 10 ? 'text-emerald-600 dark:text-emerald-400'
                : product.stock > 0 ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              <Package className="w-4 h-4" />
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || inCart}
              id="add-to-cart-btn"
              className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                inCart
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 cursor-default'
                  : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {inCart ? (
                <><Check className="w-5 h-5" /> Added to Cart</>
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
              )}
            </button>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: <RefreshCw className="w-4 h-4" />, label: 'Return Policy', val: product.returnPolicy || '30-day returns' },
                { icon: <Shield className="w-4 h-4" />, label: 'Warranty', val: product.warrantyInformation || 'Standard warranty' },
                { icon: <Tag className="w-4 h-4" />, label: 'SKU', val: product.sku || `#${product.id}` },
                { icon: <Package className="w-4 h-4" />, label: 'Shipping', val: product.shippingInformation || 'Standard shipping' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {icon} {label}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {review.reviewerName?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{review.reviewerName}</p>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                  {review.date && (
                    <p className="text-xs text-slate-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
