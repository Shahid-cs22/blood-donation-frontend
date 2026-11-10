import React from 'react';
import { AlertCircle, MapPin, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BloodRequestCard({ request }) {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-600 text-white shadow-xs';
      case 'Urgent':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        
        {/* Top Header: Hospital & Priority Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Emergency Request
            </span>
            <h4 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-brand-red transition-colors">
              {request.hospitalName}
            </h4>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${getPriorityStyle(request.priority)}`}>
            {request.priority}
          </span>
        </div>

        {/* Blood Group & Units */}
        <div className="my-3 p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">
              Blood Type Needed:
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-brand-red">
                {request.bloodGroup}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                ({request.unitsRequired} {request.unitsRequired > 1 ? 'Units' : 'Unit'})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-medium text-slate-500 block">
              Patient:
            </span>
            <span className="text-xs font-bold text-slate-900">
              {request.patientName}
            </span>
          </div>
        </div>

        {/* Location & Time Info */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
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
        <p className="text-xs text-slate-600 line-clamp-2 italic mb-4 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
          "{request.emergencyDescription}"
        </p>

      </div>

      {/* Action CTA */}
      <Link
        to={`/donors?bloodGroup=${encodeURIComponent(request.bloodGroup)}`}
        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-50 text-brand-red border border-red-200 hover:bg-brand-red hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <span>View Matched Donors</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
