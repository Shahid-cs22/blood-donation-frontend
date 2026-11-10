import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartHandshake, Droplet, Calendar, MapPin, Phone, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { donorService } from '../services/donorService';
import { useAuth } from '../context/AuthContext';

export default function DonorRegistration() {
  const { user, isDonor, donorProfile, updateDonorLocally } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || 'Male',
    mobileNumber: user?.mobileNumber || '',
    state: user?.location?.state || '',
    district: user?.location?.district || '',
    city: user?.location?.city || '',
    area: user?.location?.address || '',
    lastDonationDate: '',
    isAvailable: true,
    preferredContact: 'In-App Request',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  // If already registered as donor
  if (isDonor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-8 border border-brand-light dark:border-brand-darkBorder shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            You Are Already a Registered Donor!
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your profile with blood group <span className="font-bold text-brand-red">{donorProfile?.bloodGroup}</span> is active. You can manage your availability, history, and appointments in your dashboard.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/dashboard?tab=donor"
              className="px-6 py-3 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark transition-all"
            >
              Manage Donor Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dateOfBirth) {
      toast.error('Date of birth is required to confirm donation eligibility.');
      return;
    }

    setLoading(true);
    try {
      const res = await donorService.createDonor(formData);
      if (res.success) {
        toast.success('Congratulations! You are officially registered as a Blood Hero.');
        confetti({ particleCount: 80, spread: 80 });
        updateDonorLocally(res.donor);
        navigate('/dashboard?tab=donor');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register as donor.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-red rounded-3xl p-8 text-white shadow-xl space-y-2">
        <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
          Hero Enrollment
        </span>
        <h1 className="text-2xl sm:text-3xl font-black">
          Register as a Voluntary Blood Donor
        </h1>
        <p className="text-xs sm:text-sm text-white/90">
          Your willingness to donate creates a lifeline for trauma casualties, emergency surgeries, and cancer patients.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 sm:p-8 border border-brand-light dark:border-brand-darkBorder shadow-lg space-y-6">
        
        {/* Blood Group Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Select Your Blood Group *
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {bloodGroups.map((bg) => {
              const isSelected = formData.bloodGroup === bg;
              return (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                  className={`py-3 rounded-2xl font-black text-sm transition-all ${
                    isSelected
                      ? 'bg-brand-red text-white scale-105 shadow-md shadow-brand-red/30'
                      : 'bg-slate-100 dark:bg-brand-darkBorder/40 text-slate-700 dark:text-slate-300 hover:bg-brand-light hover:text-brand-red'
                  }`}
                >
                  {bg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Date of Birth (Must be 18+) *
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Location: District & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              District / Region *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chennai"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              City / Town *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chennai"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>
        </div>

        {/* Last Donation Date & Preferred Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Last Blood Donation Date (If Any)
            </label>
            <input
              type="date"
              value={formData.lastDonationDate}
              onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Leave blank if this will be your first time.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Preferred Contact Channel
            </label>
            <select
              value={formData.preferredContact}
              onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            >
              <option value="In-App Request">In-App Verified Request (Most Private)</option>
              <option value="Phone">Phone Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        {/* Bio / Message */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Donor Bio / Availability Note
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Regular whole blood donor. Available on weekends in Central Chennai area."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
          />
        </div>

        {/* Available Toggle */}
        <div className="p-4 bg-brand-light/40 dark:bg-brand-darkBorder/30 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white block">
              Available for Immediate Donation
            </span>
            <span className="text-[11px] text-slate-500">
              When enabled, your profile appears as ready in search results.
            </span>
          </div>
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-5 h-5 rounded text-brand-red focus:ring-brand-red accent-brand-red cursor-pointer"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark shadow-md shadow-brand-red/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{loading ? 'Registering Hero Profile...' : 'Complete Donor Registration'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

