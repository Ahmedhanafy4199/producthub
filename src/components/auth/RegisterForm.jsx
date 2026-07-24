/**
 * RegisterForm component
 * Submits to DummyJSON /users/add endpoint
 * After success, redirects to login page with success toast
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Package2 } from 'lucide-react';
import {
  register,
  clearError,
  clearRegisterSuccess,
  selectAuthLoading,
  selectAuthError,
  selectRegisterSuccess,
  selectIsAuthenticated,
} from '../../store/authSlice';
import { useToast } from '../common/ToastNotification';

/* Reusable Field in first name , last name , Email and UserName 
 except password field which has show/hide functionality and different placeholder text.
*/

const Field = ({
  id,
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-200 mb-1.5"
    >
      {label}
    </label>

    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
    />
  </div>
);


const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const registerSuccess = useSelector(selectRegisterSuccess);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  useEffect(() => {
    if (registerSuccess) {
      toast.success('Account created! Please sign in.');
      dispatch(clearRegisterSuccess());
      navigate('/login');
    }
  }, [registerSuccess, toast, navigate, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, username, password } = form;

    if (!firstName || !lastName || !email || !username || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    dispatch(
      register({
        firstName,
        lastName,
        email,
        username,
        password,
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 px-4 py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl animate-glow pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-xl mb-4">
              <Package2 className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-sm text-slate-300 mt-1">
              Join ProductHub today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}

            <div className="grid grid-cols-2 gap-3">

              <Field
                id="reg-firstname"
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
              />

              <Field
                id="reg-lastname"
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />

            </div>

            <Field
              id="reg-email"
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />

            <Field
              id="reg-username"
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe99"
            />

            {/* Password */}

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-slate-200 mb-1.5"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 pr-11 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 shadow-xl shadow-violet-900/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>

                  Creating...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;