import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(email, otp.trim(), newPassword);
      if (res.success) {
        toast.success(res.message);
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mx-auto shadow-sm border border-red-100">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Set New Password
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter the 6-digit OTP code sent to your email and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {!location.state?.email && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              6-Digit Reset Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-center text-xl font-bold tracking-widest focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-red hover:bg-[#a62422] text-white text-sm font-semibold shadow-md shadow-brand-red/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-4"
          >
            <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
