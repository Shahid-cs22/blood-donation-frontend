import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Droplet,
  Search,
  Calendar,
  AlertCircle,
  Bell,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Heart,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, isDonor, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donors', path: '/donors' },
    { name: 'Blood Requests', path: '/requests' },
    { name: 'Donation Camps', path: '/camps' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-brand-red flex items-center justify-center shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform shrink-0">
              <Droplet className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Blood<span className="text-brand-red">Hero</span>
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-brand-red tracking-wider uppercase">
                Save Lives, Spread Smiles
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-red-50 text-brand-red shadow-xs font-bold'
                    : 'text-slate-600 hover:text-brand-red hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Bell (Only if Logged In) */}
            {isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="relative p-2.5 rounded-full text-slate-600 hover:text-brand-red bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/60"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-red" />
                        <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-brand-red font-semibold hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-2">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => markAsRead(n._id)}
                            className={`py-3 px-2 rounded-xl text-left cursor-pointer transition-colors ${
                              n.isRead ? 'opacity-70' : 'bg-red-50/50 hover:bg-red-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs text-slate-900">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/80"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-red text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-brand-red truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-brand-red" />
                        User Dashboard
                      </Link>

                      {!isDonor ? (
                        <Link
                          to="/donor/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-brand-red hover:bg-red-50/60"
                        >
                          <Heart className="w-4 h-4 fill-brand-red text-brand-red" />
                          Register as Donor
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard?tab=donor"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Donor Profile Active
                        </Link>
                      )}

                      <Link
                        to="/requests/create"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Request Blood
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-brand-red bg-red-50/50 hover:bg-red-50"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold text-slate-700 hover:text-brand-red hover:bg-slate-100 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold bg-brand-red text-white hover:bg-red-700 transition-all shadow-md shadow-brand-red/25 hover:shadow-lg transform active:scale-95 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Become a Donor</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-2xl text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-red-50 text-brand-red font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl text-sm font-bold text-brand-red bg-red-50"
              >
                Go to Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl text-sm font-bold text-amber-700 bg-amber-50"
                >
                  Admin Console
                </Link>
              )}
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-xs font-bold bg-brand-red text-white hover:bg-red-700 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
