/**
 * CartPage - displays products added to the cart
 * Enables modifying quantities, removing items, and clearing the cart
 */
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, RefreshCw, ShoppingCart
} from 'lucide-react';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart
} from '../store/cartSlice';
import { formatPrice } from '../utils/formatters';
import { useToast } from '../components/common/ToastNotification';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const handleCheckout = () => {
    toast.success('Order placed successfully! Thank you for shopping with us. 🎉');
    dispatch(clearCart());
    navigate('/products');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.info('Cart cleared');
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Animated Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-600/10 dark:bg-blue-600/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-md w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/85 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Looks like you haven't added any products to your cart yet. Let's find something special!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-95 shadow-md shadow-blue-500/20 transition-all w-full justify-center"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
            <ShoppingCart className="w-8 h-8" /> Your Shopping Cart
          </h1>
          <p className="text-blue-100 text-base max-w-xl mx-auto">
            You have <strong className="text-white">{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'} in your cart.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm transition-all hover:shadow-md"
              >
                {/* Product Info */}
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center p-1 shrink-0 overflow-hidden border border-slate-200/40 dark:border-slate-800">
                    <img
                      src={item.thumbnail || (item.images && item.images[0])}
                      alt={item.title}
                      className="w-full h-full object-contain object-center rounded-lg"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.id}`}
                      className="text-base font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors block truncate"
                    >
                      {item.title}
                    </Link>
                    <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2 sm:hidden">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                {/* Right Side: Quantity & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => dispatch(decrementQuantity(item.id))}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(incrementQuantity(item.id))}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pricing (Desktop) */}
                  <div className="hidden sm:block text-right min-w-[80px]">
                    <div className="text-sm text-slate-400 dark:text-slate-500">{formatPrice(item.price)} each</div>
                    <div className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Pricing (Mobile Subtotal) */}
                  <div className="sm:hidden text-right">
                    <div className="text-base font-bold text-slate-800 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      dispatch(removeFromCart(item.id));
                      toast.info(`"${item.title}" removed from cart`);
                    }}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Order Summary</h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Tax</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">$0.00</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex justify-between text-base font-bold text-slate-850 dark:text-white">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-95 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all text-sm"
              >
                <CreditCard className="w-4 h-4" /> Proceed to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
