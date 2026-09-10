import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/hospitalL.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Authentication Request sent for: ${email}`);
  };

  return (
    <div className="bg-slate-50 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">

        {/* Logo Section */}
        <div className="flex justify-start mb-6">
          <img
            src={logo}
            alt="Portal Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Portal Sign In
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Please enter your credentials to log in
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Password
              </label>

              <a
                href="#"
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot?
              </a>
            </div>

            {/* Password Input + Eye Button */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition [&::-ms-reveal]:hidden"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <FaEye className="w-4 h-4" />
                ) : (
                  <FaEyeSlash className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-100 mt-2 text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6 text-sm">
          <span className="font-medium text-slate-700">
            Don't have an account?
          </span>{' '}

          <Link
            to="/register"
            className="text-red-600 font-bold hover:underline"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;