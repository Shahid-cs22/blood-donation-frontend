import React from 'react';
import { MapPin, Calendar, Heart, ShieldCheck, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DonorCard({ donor, onRequestContact }) {
  const isAvailable = donor.isAvailable;

  // Format last donation date
  const lastDonationText = donor.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString([], { month: 'short', year: 'numeric' })
    : 'New Volunteer';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        
        {/* Top Header: Avatar, Name, Blood Group Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-lg shadow-xs">
              {donor.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                  {donor.name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Volunteer" />
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                {donor.age} yrs • {donor.gender}
              </p>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-center shadow-xs shrink-0">
            <span className="text-base font-black tracking-tight">{donor.bloodGroup}</span>
          </div>
        </div>

        {/* Location & Status Chips */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="truncate">{donor.city}, {donor.district}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Availability:</span>
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Available Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Temporarily Paused
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Last Donated:</span>
            <span className="text-[11px] font-semibold text-slate-700">
              {lastDonationText}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Contact (Protected):</span>
            <span className="text-[11px] font-mono text-slate-600" title="Contact masked for donor privacy">
              {donor.mobileNumber}
            </span>
          </div>
        </div>

        {/* Bio (if any) */}
        {donor.bio && (
          <p className="text-[11px] italic text-slate-600 line-clamp-2 mb-4 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
            "{donor.bio}"
          </p>
        )}
      </div>

      {/* Action: Request Contact */}
      <button
        onClick={() => onRequestContact(donor)}
        disabled={!isAvailable}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
          isAvailable
            ? 'bg-brand-red text-white hover:bg-red-700 shadow-xs active:scale-98'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
        }`}
      >
        <Phone className="w-3.5 h-3.5" />
        {isAvailable ? 'Request Contact' : 'Unavailable'}
      </button>
    </div>
  );
}
