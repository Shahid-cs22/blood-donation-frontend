import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, subtext, icon: Icon, color = 'red' }) {
  const colorStyles = {
    red: 'bg-brand-light text-brand-red dark:bg-brand-red/20 dark:text-brand-soft',
    dark: 'bg-brand-dark/10 text-brand-dark dark:bg-white/10 dark:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-brand-light dark:border-brand-darkBorder shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {label}
          </span>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {subtext}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorStyles[color] || colorStyles.red}`}>
            <Icon className="w-7 h-7" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

