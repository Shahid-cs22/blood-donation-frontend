import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Droplet, MapPin, CheckCircle2, RotateCcw } from 'lucide-react';
import DonorCard from '../components/DonorCard';
import ContactRequestModal from '../components/ContactRequestModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { donorService } from '../services/donorService';

export default function FindDonors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGroup = searchParams.get('bloodGroup') || 'All';

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [searchLocation, setSearchLocation] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  // Contact Modal
  const [selectedDonorForContact, setSelectedDonorForContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        bloodGroup: selectedGroup !== 'All' ? selectedGroup : undefined,
        search: searchLocation || undefined,
        isAvailable: onlyAvailable ? 'true' : undefined
      };
      const res = await donorService.getDonors(params);
      if (res.success) {
        setDonors(res.donors || []);
        setTotal(res.total || 0);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedGroup, onlyAvailable, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonors();
  };

  const handleResetFilters = () => {
    setSelectedGroup('All');
    setSearchLocation('');
    setOnlyAvailable(true);
    setPage(1);
  };

  const handleOpenContactModal = (donor) => {
    setSelectedDonorForContact(donor);
    setIsModalOpen(true);
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
          Verified Donor Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Find a Blood Donor Near You
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Browse verified voluntary blood donors. Contact details are protected to safeguard privacy—submit a verified contact request to connect instantly.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        
        {/* Search Input & Availability Toggle */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by City, District, Area, or Donor Name..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="flex-1 md:flex-initial px-6 sm:px-8 py-3 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 shadow-xs transition-all text-center"
            >
              Search Donors
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-red hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Blood Group Pills & Availability Switch */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-brand-red" />
              Blood Group:
            </span>
            {bloodGroups.map((bg) => {
              const active = selectedGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => {
                    setSelectedGroup(bg);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    active
                      ? 'bg-brand-red text-white shadow-xs font-bold'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-red-200 hover:bg-white'
                  }`}
                >
                  {bg}
                </button>
              );
            })}
          </div>

          {/* Toggle Available Only */}
          <label className="flex items-center gap-2 cursor-pointer shrink-0 text-xs font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-brand-red focus:ring-brand-red accent-brand-red"
            />
            <span>Only Available Donors</span>
          </label>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Found {total} donor{total !== 1 ? 's' : ''} matching criteria</span>
        {selectedGroup !== 'All' && (
          <span className="text-brand-red font-bold">Filtered by {selectedGroup}</span>
        )}
      </div>

      {/* Donors Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : donors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-xl bg-red-50 border border-red-200 text-brand-red flex items-center justify-center mx-auto text-2xl">
            🩸
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No Donors Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any donors matching your current filter combination. Try clearing your filters or searching a nearby city.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all mt-2 shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <DonorCard
              key={donor._id}
              donor={donor}
              onRequestContact={handleOpenContactModal}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-xs font-bold px-3 text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Contact Request Modal */}
      <ContactRequestModal
        donor={selectedDonorForContact}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDonorForContact(null);
        }}
      />

    </div>
  );
}
