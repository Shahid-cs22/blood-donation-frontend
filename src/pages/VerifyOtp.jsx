import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Droplet, Mail, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
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
    <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-gradient-to-b from-[#FFE8E8]/40 to-transparent dark:from-brand-darkBg">
      <div className="max-w-md w-full bg-white dark:bg-brand-darkCard rounded-3xl p-8 border border-brand-light dark:border-brand-darkBorder shadow-2xl space-y-6 text-center">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-3xl bg-brand-light dark:bg-brand-red/20 text-brand-red flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            We sent a 6-digit verification code to
          </p>
          <p className="text-xs font-bold text-brand-red mt-0.5">
            {email || 'your registered email'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          {!location.state?.email && (
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 text-left">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 rounded-2xl border-2 border-brand-soft/50 dark:border-brand-darkBorder bg-brand-light/20 dark:bg-brand-darkBg text-center text-3xl font-black tracking-[0.4em] text-brand-dark dark:text-white outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark shadow-md shadow-brand-red/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Resend Link */}
        <div className="pt-2 text-xs text-slate-500">
          Didn't receive code?{' '}
          {timer > 0 ? (
            <span className="font-bold text-slate-400">Resend in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-brand-red hover:underline"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

