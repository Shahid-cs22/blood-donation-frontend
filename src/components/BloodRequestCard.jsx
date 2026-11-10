import React from 'react';
import { AlertCircle, MapPin, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BloodRequestCard({ request }) {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-brand-red text-white animate-pulse shadow-md shadow-brand-red/30';
      case 'Urgent':
        return 'bg-rose-100 text-brand-red dark:bg-brand-red/20 dark:text-brand-soft border border-brand-red/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-brand-light dark:border-brand-darkBorder shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        
        {/* Top Header: Hospital & Priority Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Emergency Request
            </span>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-red transition-colors">
              {request.hospitalName}
            </h4>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shrink-0 ${getPriorityStyle(request.priority)}`}>
            {request.priority}
          </span>
        </div>

        {/* Blood Group & Units */}
        <div className="my-3 p-3 bg-brand-light/40 dark:bg-brand-darkBorder/30 rounded-2xl flex items-center justify-between border border-brand-soft/20">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Blood Type Needed:
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-brand-dark dark:text-brand-soft">
                {request.bloodGroup}
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                ({request.unitsRequired} {request.unitsRequired > 1 ? 'Units' : 'Unit'})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Patient:
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {request.patientName}
            </span>
          </div>
        </div>

        {/* Location & Time Info */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="truncate">{request.hospitalLocation}, {request.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>Needed by {new Date(request.requiredDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Emergency Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic mb-4">
          "{request.emergencyDescription}"
        </p>

      </div>

      {/* Action CTA */}
      <Link
        to={`/donors?bloodGroup=${encodeURIComponent(request.bloodGroup)}`}
        className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-brand-light text-brand-dark hover:bg-brand-red hover:text-white dark:bg-brand-red/20 dark:text-brand-soft dark:hover:bg-brand-red dark:hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <span>View Matched Donors</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

