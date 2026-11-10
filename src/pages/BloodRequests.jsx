import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, AlertCircle, Droplet, Filter, RotateCcw } from 'lucide-react';
import BloodRequestCard from '../components/BloodRequestCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { bloodRequestService } from '../services/bloodRequestService';

export default function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        priority: priorityFilter !== 'All' ? priorityFilter : undefined,
        bloodGroup: bloodGroupFilter !== 'All' ? bloodGroupFilter : undefined,
        search: search || undefined
      };
      const res = await bloodRequestService.getAllRequests(params);
      if (res.success) {
        setRequests(res.requests || []);
        setTotal(res.total || 0);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching blood requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [priorityFilter, bloodGroupFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const priorities = ['All', 'Critical', 'Urgent', 'Normal'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner with Post Request CTA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-brand-dark via-brand-red to-brand-red p-8 sm:p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Live Emergency Board
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">
            Urgent Blood Donation Requests
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl">
            Real-time transfusion requirements from hospitals and families. If you are eligible, your single donation can save a life today.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link
            to="/requests/create"
            className="px-8 py-4 rounded-full bg-white text-brand-dark hover:bg-brand-light font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-brand-red" />
            <span>Post a Blood Request</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-brand-light dark:border-brand-darkBorder shadow-md space-y-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Hospital, City, Patient, or Request ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-sm focus:ring-2 focus:ring-brand-red outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark shadow-md transition-all"
          >
            Search Requests
          </button>
        </form>

        {/* Priority Filter and Blood Groups */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          
          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Urgency:</span>
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => { setPriorityFilter(p); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  priorityFilter === p
                    ? 'bg-brand-red text-white'
                    : 'bg-slate-100 dark:bg-brand-darkBorder/40 text-slate-600 dark:text-slate-300 hover:bg-brand-light'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Blood Groups */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Blood Type:</span>
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => { setBloodGroupFilter(bg); setPage(1); }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                  bloodGroupFilter === bg
                    ? 'bg-brand-red text-white'
                    : 'bg-slate-100 dark:bg-brand-darkBorder/40 text-slate-600 dark:text-slate-300 hover:bg-brand-light'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-12 text-center border border-brand-light dark:border-brand-darkBorder space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            No Requests Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            There are currently no active requests matching your filter. You can create a new request if someone requires blood.
          </p>
          <Link
            to="/requests/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-dark transition-all mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Blood Request</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <BloodRequestCard key={req._id} request={req} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-brand-darkBorder text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-bold px-3 text-slate-600 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-brand-darkBorder text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

