import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Success, save user token in cookie, then redirect to dashboard
      Cookies.set('token', data.token, { expires: 1 });
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#1b1836,#321a54,#541c81,#321a54,#1b1836)] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-purple-300">✦</span>{" "}
            <span className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
              Rahnuma
            </span>
          </h1>

          <p className="mt-3 text-purple-200/90 text-lg sm:text-xl font-medium">
            Welcome Back
          </p>

          <p className="mt-2 text-purple-300/80 text-sm sm:text-base max-w-[600px] mx-auto">
            Continue your journey with AI-powered career guidance and explore the best path for your future
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          {error && <div className="mb-4 text-red-500 bg-red-100/10 p-2 rounded text-center">{error}</div>}
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full px-4 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40 transition-all duration-200"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full px-4 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40 transition-all duration-200"
              />
            </div>

            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-purple-300 hover:text-white text-sm transition underline underline-offset-2 hover:no-underline"
              >
                Forgot password?
              </Link>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 bg-gradient-to-r from-[#6964f1] via-[#865ef4] to-[#9a58f6] hover:from-[#7a75f3] hover:via-[#946ef6] hover:to-[#a86af7] text-white font-semibold text-lg rounded-lg shadow-lg shadow-purple-900/40 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p className="text-sm text-center text-purple-200 mt-6">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-purple-300 hover:text-white hover:underline transition"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;