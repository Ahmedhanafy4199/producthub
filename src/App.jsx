/**
 * App.jsx - Root component
 * Sets up routing, Redux Provider, dark mode, and toast system
 */
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ToastProvider } from './components/common/ToastNotification';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent = () => {
  // Persist dark mode preference in localStorage
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('producthub_theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('producthub_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('producthub_theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode((d) => !d)} />

        <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </Provider>
);

export default App;
