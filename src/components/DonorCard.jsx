import React from 'react';
import { MapPin, Calendar, Heart, ShieldCheck, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DonorCard({ donor, onRequestContact }) {
  const isAvailable = donor.isAvailable;

  // Format last donation date
  const lastDonationText = donor.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString([], { month: 'short', year: 'numeric' })
    : 'New Volunteer';

  return (
    <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-brand-light dark:border-brand-darkBorder shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        
        {/* Top Header: Avatar, Name, Blood Group Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-light to-brand-soft/40 dark:from-brand-darkBorder dark:to-brand-red/30 flex items-center justify-center text-brand-dark dark:text-brand-soft font-black text-lg border border-brand-soft/20 shadow-sm">
              {donor.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white line-clamp-1">
                  {donor.name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" title="Verified Volunteer" />
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                {donor.age} yrs • {donor.gender}
              </p>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="px-3 py-1.5 rounded-2xl bg-brand-red text-white text-center shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform shrink-0">
            <span className="text-base font-black tracking-tight">{donor.bloodGroup}</span>
          </div>
        </div>

        {/* Location & Status Chips */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="truncate">{donor.city}, {donor.district}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Availability:</span>
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Available Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                Temporarily Paused
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Last Donated:</span>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {lastDonationText}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Contact (Protected):</span>
            <span className="text-[11px] font-mono text-slate-500" title="Contact masked for donor privacy">
              {donor.mobileNumber}
            </span>
          </div>
        </div>

        {/* Bio (if any) */}
        {donor.bio && (
          <p className="text-[11px] italic text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 bg-brand-light/30 dark:bg-brand-darkBorder/20 p-2 rounded-xl">
            "{donor.bio}"
          </p>
        )}
      </div>

      {/* Action: Request Contact */}
      <button
        onClick={() => onRequestContact(donor)}
        disabled={!isAvailable}
        className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
          isAvailable
            ? 'bg-brand-red text-white hover:bg-brand-dark shadow-md shadow-brand-red/20 active:scale-95'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Phone className="w-3.5 h-3.5" />
        {isAvailable ? 'Request Contact' : 'Unavailable'}
      </button>
    </div>
  );
}

