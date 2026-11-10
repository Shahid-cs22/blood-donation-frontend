import React from 'react';
import { Calendar, Clock, MapPin, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CampCard({ camp, onRegister, isRegistered }) {
  const percentFilled = Math.min(100, Math.round((camp.registeredCount / camp.registrationLimit) * 100));

  return (
    <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-brand-light dark:border-brand-darkBorder shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        
        {/* Date & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-red dark:bg-brand-red/20 dark:text-brand-soft">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(camp.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
            {camp.status}
          </span>
        </div>

        {/* Camp Title */}
        <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-red transition-colors mb-2">
          {camp.campName}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {camp.description}
        </p>

        {/* Details: Venue, Time, Organizer */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>{camp.startTime} - {camp.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="truncate">{camp.venue}, {camp.city}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Users className="w-3.5 h-3.5 text-brand-soft shrink-0" />
            <span className="truncate">Organized by {camp.organizer}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1.5 mb-5 bg-brand-light/30 dark:bg-brand-darkBorder/30 p-3 rounded-2xl">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500 dark:text-slate-400">Donor Registrations:</span>
            <span className="text-brand-dark dark:text-brand-soft">
              {camp.registeredCount} / {camp.registrationLimit} ({percentFilled}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-red h-full rounded-full transition-all duration-500"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

      </div>

      {/* CTA Button */}
      {isRegistered ? (
        <div className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          You Are Registered
        </div>
      ) : (
        <button
          onClick={() => onRegister(camp)}
          disabled={camp.registeredCount >= camp.registrationLimit}
          className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-brand-red text-white hover:bg-brand-dark transition-all shadow-md shadow-brand-red/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <HeartHandshake className="w-4 h-4" />
          Register to Donate
        </button>
      )}
    </div>
  );
}

