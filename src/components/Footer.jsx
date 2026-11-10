import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, PhoneCall, ShieldAlert, Heart, Mail, MapPin, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-brand-darkCard border-t border-brand-light dark:border-brand-darkBorder pt-16 pb-24 md:pb-12 text-slate-600 dark:text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-dark to-brand-red flex items-center justify-center text-white shadow-md">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <span className="text-2xl font-black text-brand-dark dark:text-white tracking-tight">
                Blood<span className="text-brand-red">Hero</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              A secure, privacy-first community platform connecting voluntary blood donors with patients and hospitals in urgent need across the nation.
            </p>

            {/* Emergency Hotline Banner */}
            <div className="inline-flex items-center gap-3 bg-brand-light/70 dark:bg-brand-red/20 border border-brand-soft/40 px-4 py-2.5 rounded-2xl">
              <div className="p-2 rounded-xl bg-brand-red text-white animate-bounce">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-red block">
                  24/7 Emergency Helpline
                </span>
                <span className="text-sm font-extrabold text-brand-dark dark:text-white">
                  +91 94440 12345 / 1800-HERO
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/donors" className="hover:text-brand-red transition-colors">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-brand-red transition-colors">
                  Urgent Blood Requests
                </Link>
              </li>
              <li>
                <Link to="/camps" className="hover:text-brand-red transition-colors">
                  Donation Camps
                </Link>
              </li>
              <li>
                <Link to="/donor/register" className="hover:text-brand-red transition-colors">
                  Register as Donor
                </Link>
              </li>
              <li>
                <Link to="/requests/create" className="hover:text-brand-red transition-colors">
                  Request Blood
                </Link>
              </li>
            </ul>
          </div>

          {/* Blood Compatibility Guide */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Universal Types
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-brand-light/50 dark:bg-brand-darkBorder/40 border border-brand-soft/20">
                <span className="font-bold text-brand-red">O- (Negative)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Universal Red Cell Donor: Can give to all 8 blood groups!
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-light/50 dark:bg-brand-darkBorder/40 border border-brand-soft/20">
                <span className="font-bold text-brand-dark dark:text-brand-soft">AB+ (Positive)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Universal Recipient: Can safely receive red cells from all blood types.
                </p>
              </div>
            </div>
          </div>

          {/* Important Medical Disclaimer */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-brand-red" />
              Notice
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Blood Hero is a voluntary coordination network. We do not maintain physical blood storage. Always verify cross-matching and safety testing with certified hospitals and blood banks before transfusion.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Blood Hero Organization. All rights reserved.</p>
          {/* Creator Profile Hover Popover */}
          <div className="relative group">
            <a
              href="https://shahidinfo.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-red transition-colors font-medium group-hover:underline cursor-pointer"
            >
              <span>Built with care for humanity</span>
              <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red animate-pulse" />
            </a>

            {/* Hover Floating Card */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-72 bg-white dark:bg-brand-darkCard rounded-2xl p-4 shadow-2xl border border-brand-light dark:border-brand-darkBorder opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-dark to-brand-red text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                  MS
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      Mohammed Shahid
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" title="Available" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                    Software Developer
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-brand-light/40 dark:bg-brand-darkBorder/40 mb-3 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-left">
                <Globe className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span className="font-mono truncate">www.shahidinfo.com</span>
              </div>

              <a
                href="https://shahidinfo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-brand-red text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-brand-dark transition-all shadow-md shadow-brand-red/25"
              >
                <span>Visit Portfolio Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Arrow pointer */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-brand-darkCard" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

