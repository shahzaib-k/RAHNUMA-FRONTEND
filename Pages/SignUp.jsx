import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    education: '',
    targetRole: '',
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
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data, then redirect securely to dashboard
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

    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#1b1836,#321a54,#541c81,#321a54,#1b1836)] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8">

      <div className="w-full max-w-md relative z-10">
        {/* Header / Branding */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-[#8c8bfa]">✦</span>{' '}
            <span className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
              Rahnuma
            </span>
          </h1>

          <p className="mt-3 text-purple-200/90 text-lg sm:text-xl font-medium">
            AI-Powered Career Guidance System
          </p>

          <p className="mt-2 text-purple-300/80 text-sm sm:text-base max-w-[600px] mx-auto">
            Discover your ideal career path through intelligent assessments, personalized recommendations, and professional development tools
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          {error && <div className="mb-4 text-red-500 bg-red-100/10 p-2 rounded text-center">{error}</div>}
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40 transition-all duration-200"
              />
            </div>

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
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                placeholder="Education (e.g. BS Computer Science)"
                className="w-full px-4 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40 transition-all duration-200"
              />
            </div>

            <div>
              <input
                type="text"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                required
                placeholder="Target Role (e.g. Software Engineer)"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 bg-gradient-to-r from-[#6964f1] via-[#865ef4] to-[#9a58f6] hover:from-[#7a75f3] hover:via-[#946ef6] hover:to-[#a86af7] text-white font-semibold text-lg rounded-lg shadow-lg shadow-purple-900/40 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Continue →'}
            </button>
            <p className="text-sm text-center text-purple-200 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-purple-300 hover:text-white hover:underline transition"
              >
                Login
              </a>
            </p>
          </form>
        </div>

      </div>

      {/* Subtle overlay for depth (optional – can remove if too dark) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5 pointer-events-none z-0"></div>
    </div>
  );
};

export default SignUp;