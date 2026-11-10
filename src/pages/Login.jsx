import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        toast.success(res.message || 'Login successful!');
        loginUser(res.user, res.token, res.donorProfile);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data && data.isEmailVerified === false) {
        toast.error('Please verify your email to log in. OTP sent.');
        navigate('/verify-otp', { state: { email: data.email || email } });
      } else {
        toast.error(data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('moh.shahid2004@gmail.com');
    setPassword('shahidrt@ety');
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-gradient-to-b from-[#FFE8E8]/40 to-transparent dark:from-brand-darkBg">
      <div className="max-w-md w-full bg-white dark:bg-brand-darkCard rounded-3xl p-8 border border-brand-light dark:border-brand-darkBorder shadow-2xl space-y-6">
        
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/20">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <span className="text-2xl font-black text-brand-dark dark:text-white">
              Blood<span className="text-brand-red">Hero</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to manage your donations, blood requests, and donor profile.
          </p>
        </div>

        {/* Admin Quick Fill Helper */}
        <div className="p-3 bg-brand-light/50 dark:bg-brand-darkBorder/40 rounded-2xl border border-brand-soft/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Admin Access
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillAdmin}
            className="py-1.5 px-3 rounded-xl bg-white dark:bg-brand-darkCard border border-brand-soft/40 text-[11px] font-bold text-brand-red hover:bg-brand-light transition-all shadow-sm"
          >
            Fill Admin Credentials
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand-red font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark shadow-md shadow-brand-red/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-4"
          >
            <span>{loading ? 'Signing In...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-red hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}

