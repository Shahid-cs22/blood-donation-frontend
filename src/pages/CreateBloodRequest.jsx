import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, PlusCircle, ShieldAlert, ArrowLeft, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { bloodRequestService } from '../services/bloodRequestService';
import { useAuth } from '../context/AuthContext';

export default function CreateBloodRequest() {
  const { isLoggedIn, isVerified } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsRequired: 1,
    hospitalName: '',
    hospitalLocation: '',
    district: '',
    city: '',
    requiredDate: '',
    requiredTime: 'Immediate',
    contactPerson: '',
    contactNumber: '',
    emergencyDescription: '',
    priority: 'Urgent',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Please log in to submit a blood request.');
      navigate('/login');
      return;
    }

    if (!isVerified) {
      toast.error('Please verify your email address before creating blood requests.');
      return;
    }

    setLoading(true);
    try {
      const res = await bloodRequestService.createRequest(formData);
      if (res.success) {
        toast.success(`Request created! ${res.matchedDonorsCount || 0} nearby donors notified.`);
        confetti({ particleCount: 50, spread: 60 });
        navigate('/requests');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit blood request.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-red transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-brand-red flex items-center justify-center shadow-xs">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Create Blood Request
            </h1>
            <p className="text-xs text-slate-500">
              Submit patient details. Our automated matching system alerts verified donors in your vicinity.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
          <p>
            Please provide genuine, verifiable hospital details. False or fraudulent blood requests will result in immediate account termination.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Row 1: Patient Name & Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Blood Group Required *
            </label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-brand-red focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Units Required & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Units Required *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={formData.unitsRequired}
              onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority Urgency *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none font-bold"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical (Immediate Emergency)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Hospital Name & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hospital / Donation Center *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apollo Hospital"
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hospital Location / Street Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Greams Road, Thousand Lights"
              value={formData.hospitalLocation}
              onChange={(e) => setFormData({ ...formData, hospitalLocation: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>
        </div>

        {/* Row 4: District & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              District *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chennai"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chennai"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>
        </div>

        {/* Row 5: Required Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Required Date *
            </label>
            <input
              type="date"
              required
              value={formData.requiredDate}
              onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Required Time Window
            </label>
            <input
              type="text"
              placeholder="e.g. Before 2:00 PM / Immediate"
              value={formData.requiredTime}
              onChange={(e) => setFormData({ ...formData, requiredTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>
        </div>

        {/* Row 6: Contact Person & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Person *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Suresh (Father)"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98400 12345"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>
        </div>

        {/* Emergency Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Emergency Condition / Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe reason for transfusion (e.g. Scheduled open heart surgery, dengue platelet drop, accident trauma...)"
            value={formData.emergencyDescription}
            onChange={(e) => setFormData({ ...formData, emergencyDescription: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 text-center transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            {loading ? 'Submitting & Matching Donors...' : 'Submit Blood Request'}
          </button>
        </div>

      </form>
    </div>
  );
}
