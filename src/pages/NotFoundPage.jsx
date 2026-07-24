/**
 * NotFoundPage - 404 fallback page
 */
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-950 px-4 text-center">
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center">
      <PackageSearch className="w-10 h-10 text-blue-500" />
    </div>
    <div>
      <h1 className="text-6xl font-extrabold text-slate-200 dark:text-slate-700">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>
    <Link
      to="/products"
      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 shadow-lg transition-all"
    >
      Go to Products
    </Link>
  </div>
);

export default NotFoundPage;
