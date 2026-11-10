import React from 'react';
import { Calendar, Clock, MapPin, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CampCard({ camp, onRegister, isRegistered }) {
  const percentFilled = Math.min(100, Math.round((camp.registeredCount / camp.registrationLimit) * 100));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        
        {/* Date & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-brand-red border border-red-200">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(camp.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {camp.status}
          </span>
        </div>

        {/* Camp Title */}
        <h4 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-brand-red transition-colors mb-2">
          {camp.campName}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {camp.description}
        </p>

        {/* Details: Venue, Time, Organizer */}
        <div className="space-y-2 text-xs text-slate-600 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>{camp.startTime} - {camp.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="truncate">{camp.venue}, {camp.city}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Organized by {camp.organizer}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1.5 mb-5 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Donor Registrations:</span>
            <span className="text-slate-900">
              {camp.registeredCount} / {camp.registrationLimit} ({percentFilled}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-red h-full rounded-full transition-all duration-300"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

      </div>

      {/* CTA Button */}
      {isRegistered ? (
        <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          You Are Registered
        </div>
      ) : (
        <button
          onClick={() => onRegister(camp)}
          disabled={camp.registeredCount >= camp.registrationLimit}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-red text-white hover:bg-red-700 transition-all shadow-xs active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <HeartHandshake className="w-4 h-4" />
          Register to Donate
        </button>
      )}
    </div>
  );
}
