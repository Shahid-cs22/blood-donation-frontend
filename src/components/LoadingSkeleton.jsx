import React from 'react';

export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-100 rounded-md w-full" />
              <div className="h-3 bg-slate-100 rounded-md w-5/6" />
            </div>
            <div className="h-10 bg-slate-100 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
      ))}
    </div>
  );
}
