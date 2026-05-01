import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setDevResetLink('');

    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message || "Reset link generated successfully");
      if (data.devResetLink) {
        setDevResetLink(data.devResetLink);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b3b] bg-gradient-to-br from-[#1a0b3b] via-[#2d145c] to-[#1a0b3b] flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        
        <div className="mb-8">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 text-sm flex items-center hover:text-white transition-colors cursor-pointer mb-6"
          >
            <span className="mr-2 mb-1 text-lg">←</span> Back to Login
          </button>
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-gray-400">Enter your email address and we'll process your request.</p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-200 text-sm flex flex-col gap-3">
            <span>{message}</span>
            {devResetLink && (
              <a 
                href={devResetLink} 
                className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-center hover:opacity-90 transition-opacity"
              >
                Open Reset Link
              </a>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white font-semibold shadow-lg transition-all cursor-pointer"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;