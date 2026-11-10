import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, subtext, icon: Icon, color = 'red' }) {
  const colorStyles = {
    red: 'bg-red-50 text-brand-red border border-red-100',
    dark: 'bg-slate-100 text-slate-800 border border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border border-blue-100'
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {label}
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {subtext}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colorStyles[color] || colorStyles.red}`}>
            <Icon className="w-7 h-7" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
