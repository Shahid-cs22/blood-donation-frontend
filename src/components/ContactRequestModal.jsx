import React, { useState } from 'react';
import { X, Send, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactRequestService } from '../services/contactRequestService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ContactRequestModal({ donor, isOpen, onClose }) {
  const { isLoggedIn, isVerified } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroupRequired: donor?.bloodGroup || 'A+',
    hospitalName: '',
    urgency: 'Urgent',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !donor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Please log in to request donor contact.');
      navigate('/login');
      return;
    }

    if (!isVerified) {
      toast.error('Please verify your email before requesting donor contact.');
      return;
    }

    setLoading(true);
    try {
      const res = await contactRequestService.createContactRequest({
        donorId: donor._id,
        ...formData
      });

      if (res.success) {
        toast.success(`Contact request sent to ${donor.name}! You will be notified when they accept.`);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit contact request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-brand-light dark:border-brand-darkBorder relative max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-light dark:bg-brand-red/20 text-brand-red flex items-center justify-center font-black text-xl">
            {donor.bloodGroup}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Request Contact
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send a verified inquiry to donor <span className="font-bold text-brand-dark dark:text-brand-soft">{donor.name}</span>
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-brand-light/50 dark:bg-brand-red/10 rounded-2xl border border-brand-soft/30 flex items-start gap-2.5 mb-6 text-xs text-brand-dark dark:text-brand-soft">
          <ShieldCheck className="w-4 h-4 shrink-0 text-brand-red mt-0.5" />
          <p>
            To protect donor privacy from spam, your request and patient details are forwarded securely. Once accepted, direct phone and WhatsApp coordinates are revealed in your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Patient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Blood Group *
              </label>
              <select
                value={formData.bloodGroupRequired}
                onChange={(e) => setFormData({ ...formData, bloodGroupRequired: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none font-bold text-brand-red"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Urgency Level *
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Hospital / Donation Center *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apollo Hospital, Greams Road, Chennai"
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Message to Donor *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Briefly describe the emergency condition and transfusion schedule..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark shadow-md shadow-brand-red/25 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

