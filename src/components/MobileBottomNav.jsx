import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MapPin, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Donors', path: '/donors', icon: Search },
    { label: 'Camps', path: '/camps', icon: MapPin },
    { label: 'Dashboard', path: isLoggedIn ? '/dashboard' : '/login', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
      <div className="bg-white/95 text-slate-600 rounded-full shadow-xl px-6 py-2.5 flex items-center justify-around border border-slate-200 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center transition-all ${
                active ? 'text-brand-red font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-red-50 text-brand-red' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
