import React, { useState, useEffect } from 'react';
import { Calendar, Search, MapPin, CheckCircle2, HeartHandshake } from 'lucide-react';
import CampCard from '../components/CampCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { campService } from '../services/campService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function DonationCamps() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [userRegistrations, setUserRegistrations] = useState([]);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await campService.getCamps({ city: cityFilter || undefined });
      if (res.success) setCamps(res.camps || []);

      if (isLoggedIn) {
        const myRegs = await campService.getMyCampRegistrations();
        if (myRegs.success) {
          const registeredIds = (myRegs.registrations || []).map(r => r.campId?._id || r.campId);
          setUserRegistrations(registeredIds);
        }
      }
    } catch (err) {
      console.error('Error fetching camps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, [isLoggedIn]);

  const handleRegister = async (camp) => {
    if (!isLoggedIn) {
      toast.error('Please log in to register for donation camps.');
      navigate('/login');
      return;
    }

    try {
      const res = await campService.registerForCamp(camp._id);
      if (res.success) {
        toast.success(`You are confirmed for ${camp.campName}!`);
        setUserRegistrations(prev => [...prev, camp._id]);
        fetchCamps();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not register for camp.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCamps();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-red to-brand-red p-8 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Community Drives
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">
            Blood Donation Camps
          </h1>
          <p className="text-xs sm:text-sm text-white/90">
            Join local blood donation camps organized with verified hospitals and welfare societies. 15 minutes of your time creates a lifetime of smiles for patients.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-brand-light dark:border-brand-darkBorder shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter camps by city (e.g. Chennai, Bangalore, Mumbai)..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
          />
        </div>
        <button
          onClick={handleSearchSubmit}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark transition-all"
        >
          Find Camps
        </button>
      </div>

      {/* Camps Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : camps.length === 0 ? (
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-12 text-center border border-brand-light dark:border-brand-darkBorder space-y-2">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            No Upcoming Camps Found
          </h3>
          <p className="text-xs text-slate-500">
            There are currently no camps listed in this location. Please check back soon or search another city.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camps.map((camp) => (
            <CampCard
              key={camp._id}
              camp={camp}
              onRegister={handleRegister}
              isRegistered={userRegistrations.includes(camp._id)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

