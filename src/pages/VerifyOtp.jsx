import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyEmail(email, otp.trim());
      if (res.success) {
        toast.success('Email verified successfully! Welcome to Blood Hero.');
        confetti({ particleCount: 70, spread: 70 });
        loginUser(res.user, res.token, res.donorProfile);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      const res = await authService.resendOtp(email, 'VERIFY_EMAIL');
      if (res.success) {
        toast.success(res.message);
        setTimer(60);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 space-y-6 text-center">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mx-auto shadow-sm border border-red-100">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-brand-red mt-0.5">
            {email || 'your registered email'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          {!location.state?.email && (
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-left">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-center text-3xl font-black tracking-[0.4em] text-slate-900 outline-none focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-red hover:bg-[#a62422] text-white text-sm font-semibold shadow-md shadow-brand-red/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Resend Link */}
        <div className="pt-2 text-xs text-slate-500">
          Didn't receive code?{' '}
          {timer > 0 ? (
            <span className="font-semibold text-slate-400">Resend in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-brand-red hover:underline"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
