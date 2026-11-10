import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Droplet,
  Calendar,
  AlertCircle,
  Bell,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Award,
  Activity,
  LogOut,
  ChevronRight,
  XCircle,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { donorService } from '../services/donorService';
import { donationService } from '../services/donationService';
import { bloodRequestService } from '../services/bloodRequestService';
import { campService } from '../services/campService';
import { contactRequestService } from '../services/contactRequestService';
import StatCard from '../components/StatCard';

export default function UserDashboard() {
  const { user, donorProfile, isDonor, updateDonorLocally, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myCamps, setMyCamps] = useState([]);
  const [contactRequests, setContactRequests] = useState({ incoming: [], outgoing: [] });

  // Schedule Donation Form state
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    bloodGroup: donorProfile?.bloodGroup || 'O+',
    donationDate: '',
    donationLocation: user?.location?.city || '',
    hospitalName: '',
    donationType: 'Whole Blood',
    notes: ''
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [donRes, reqRes, campRes, contactRes] = await Promise.all([
        donationService.getMyDonations().catch(() => ({ donations: [] })),
        bloodRequestService.getMyRequests().catch(() => ({ requests: [] })),
        campService.getMyCampRegistrations().catch(() => ({ registrations: [] })),
        contactRequestService.getMyContactRequests().catch(() => ({ incoming: [], outgoing: [] }))
      ]);

      if (donRes.success) setDonations(donRes.donations || []);
      if (reqRes.success) setMyRequests(reqRes.requests || []);
      if (campRes.success) setMyCamps(campRes.registrations || []);
      if (contactRes.success) setContactRequests(contactRes);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [donorProfile]);

  // Fast 1-click availability toggle
  const handleToggleAvailability = async () => {
    try {
      const res = await donorService.toggleAvailability();
      if (res.success) {
        toast.success(res.message);
        if (donorProfile) {
          updateDonorLocally({ ...donorProfile, isAvailable: res.isAvailable });
        }
      }
    } catch (err) {
      toast.error('Failed to update availability.');
    }
  };

  // Schedule new donation
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await donationService.createDonation(scheduleData);
      if (res.success) {
        toast.success('Donation appointment scheduled!');
        setIsScheduling(false);
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not schedule donation.');
    }
  };

  // Respond to incoming contact request
  const handleContactRespond = async (id, status) => {
    try {
      const res = await contactRequestService.respondToContactRequest(id, status);
      if (res.success) {
        toast.success(`Request ${status.toLowerCase()}!`);
        loadDashboardData();
      }
    } catch (err) {
      toast.error('Failed to update contact request.');
    }
  };

  // Calculate Eligibility (90 days cooldown for whole blood)
  const calculateEligibility = () => {
    if (!donorProfile?.lastDonationDate) return { eligible: true, daysLeft: 0 };
    const last = new Date(donorProfile.lastDonationDate).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays >= 90) return { eligible: true, daysLeft: 0 };
    return { eligible: false, daysLeft: 90 - diffDays };
  };

  const eligibility = calculateEligibility();

  // Metrics
  const completedDonationsCount = donations.filter(d => d.status === 'Completed').length;
  const upcomingDonationsCount = donations.filter(d => d.status === 'Scheduled').length;
  const activeRequestsCount = myRequests.filter(r => ['Pending', 'Approved', 'In Progress'].includes(r.status)).length;

  const sidebarTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'donor', label: 'My Donor Profile', icon: Heart },
    { id: 'donations', label: 'My Donations', icon: Droplet, badge: upcomingDonationsCount || null },
    { id: 'requests', label: 'My Blood Requests', icon: AlertCircle, badge: activeRequestsCount || null },
    { id: 'contact-requests', label: 'Contact Requests', icon: Phone, badge: contactRequests.incoming.filter(r => r.status === 'Pending').length || null },
    { id: 'camps', label: 'My Registered Camps', icon: Calendar }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-red rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white text-slate-900 font-extrabold text-2xl flex items-center justify-center shadow-xs">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold">
                Welcome, {user?.name}!
              </h1>
              {user?.isEmailVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified Account" />
              )}
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              {user?.email} • {user?.location?.city || 'Location not set'}
            </p>
          </div>
        </div>

        {/* Donor Status Pill on Hero */}
        <div className="flex items-center gap-3">
          {isDonor ? (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white/80 block">
                  Donor Status
                </span>
                <span className="text-xs font-black">
                  {donorProfile?.isAvailable ? '🟢 Ready to Donate' : '🟡 Paused'}
                </span>
              </div>
              <button
                onClick={handleToggleAvailability}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-all shadow-xs"
              >
                Toggle
              </button>
            </div>
          ) : (
            <Link
              to="/donor/register"
              className="px-6 py-2.5 rounded-xl bg-white text-brand-red font-bold text-xs hover:bg-slate-50 transition-all shadow-xs"
            >
              Enroll as Donor
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Swipeable Tabs Bar */}
      <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 mb-6 scrollbar-none -mx-4 px-4">
        {sidebarTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-red text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                  isActive ? 'bg-white text-brand-red' : 'bg-brand-red text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigation Sidebar (Desktop only) */}
        <div className="hidden lg:block lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-red text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-brand-red' : 'bg-brand-red text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Schedule Button */}
          <button
            onClick={() => {
              setSearchParams({ tab: 'donations' });
              setIsScheduling(true);
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-red-50 border border-red-200 text-brand-red hover:bg-red-100/60 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-brand-red" />
            <span>Schedule Donation</span>
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  label="Total Donations"
                  value={donations.length}
                  icon={Droplet}
                  color="red"
                />
                <StatCard
                  label="Completed"
                  value={completedDonationsCount}
                  icon={Award}
                  color="emerald"
                />
                <StatCard
                  label="Upcoming"
                  value={upcomingDonationsCount}
                  icon={Clock}
                  color="amber"
                />
                <StatCard
                  label="Active Requests"
                  value={activeRequestsCount}
                  icon={AlertCircle}
                  color="dark"
                />
              </div>

              {/* Eligibility Alert Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                    eligibility.eligible ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}>
                    {eligibility.eligible ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {eligibility.eligible ? 'You Are Eligible to Donate Blood!' : `Next Eligible in ${eligibility.daysLeft} Days`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {eligibility.eligible
                        ? '3+ months elapsed since last donation. Help save lives today.'
                        : 'Standard 90-day recovery interval for voluntary blood donation.'}
                    </p>
                  </div>
                </div>

                {eligibility.eligible && (
                  <button
                    onClick={() => {
                      setSearchParams({ tab: 'donations' });
                      setIsScheduling(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all shrink-0 shadow-xs"
                  >
                    Schedule Appointment
                  </button>
                )}
              </div>

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent Donations */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-brand-red" />
                      Recent Donations
                    </h3>
                    <button
                      onClick={() => setSearchParams({ tab: 'donations' })}
                      className="text-xs font-bold text-brand-red hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {donations.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No donation history yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {donations.slice(0, 3).map((d) => (
                        <div
                          key={d._id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {d.hospitalName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {new Date(d.donationDate).toLocaleDateString()} • {d.donationType}
                            </span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : d.status === 'Scheduled'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Requests */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-brand-red" />
                      My Blood Requests
                    </h3>
                    <button
                      onClick={() => setSearchParams({ tab: 'requests' })}
                      className="text-xs font-bold text-brand-red hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {myRequests.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No blood requests submitted.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.slice(0, 3).map((r) => (
                        <div
                          key={r._id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {r.patientName} ({r.bloodGroup})
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {r.hospitalName} • {r.priority}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-brand-red border border-red-200">
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY DONOR PROFILE */}
          {activeTab === 'donor' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    My Donor Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control your blood donation availability and location details.
                  </p>
                </div>

                {isDonor && (
                  <button
                    onClick={handleToggleAvailability}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      donorProfile?.isAvailable
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {donorProfile?.isAvailable ? '🟢 Available' : 'Paused'}
                  </button>
                )}
              </div>

              {!isDonor ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-16 h-16 rounded-xl bg-red-50 border border-red-200 text-brand-red flex items-center justify-center mx-auto text-2xl">
                    🩸
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    You Have Not Enrolled as a Donor Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Take 1 minute to add your blood type and become a hero in your local area.
                  </p>
                  <Link
                    to="/donor/register"
                    className="inline-block px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all mt-2 shadow-xs"
                  >
                    Enroll Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
                      <p className="text-2xl font-black text-brand-red">{donorProfile.bloodGroup}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Completed</span>
                      <p className="text-2xl font-black text-slate-900">{donorProfile.totalDonations}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">City</span>
                      <p className="text-sm font-bold text-slate-900 mt-1 truncate">{donorProfile.city}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Method</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{donorProfile.preferredContact}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {donorProfile.bio && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Donor Bio</span>
                      <p className="text-xs italic text-slate-600">"{donorProfile.bio}"</p>
                    </div>
                  )}

                  {/* Edit Notice */}
                  <p className="text-xs text-slate-400">
                    Need to update your blood group or address? Contact administrators to verify blood grouping certifications.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY DONATIONS */}
          {activeTab === 'donations' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    My Donation Appointments & History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track your scheduled visits, past life-saving donations, and verified certificates.
                  </p>
                </div>

                <button
                  onClick={() => setIsScheduling(!isScheduling)}
                  className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isScheduling ? 'Cancel' : 'Schedule Donation'}</span>
                </button>
              </div>

              {/* Schedule Form (Toggled) */}
              {isScheduling && (
                <form onSubmit={handleScheduleSubmit} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900">
                    Schedule Blood Donation Appointment
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Donation Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={scheduleData.donationDate}
                        onChange={(e) => setScheduleData({ ...scheduleData, donationDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Hospital / Center *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apollo Blood Bank"
                        value={scheduleData.hospitalName}
                        onChange={(e) => setScheduleData({ ...scheduleData, hospitalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Location / City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chennai"
                        value={scheduleData.donationLocation}
                        onChange={(e) => setScheduleData({ ...scheduleData, donationLocation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsScheduling(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all shadow-xs"
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              )}

              {/* Donations List */}
              {donations.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No donation records found. Click Schedule Donation above to register your appointment!
                </div>
              ) : (
                <div className="space-y-3">
                  {donations.map((d) => (
                    <div
                      key={d._id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {d.hospitalName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            ({d.donationId})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(d.donationDate).toLocaleDateString()} • {d.donationLocation} • {d.donationType} ({d.units} Unit)
                        </p>
                        {d.certificateNumber && (
                          <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <Award className="w-3.5 h-3.5" />
                            <span>Certificate #{d.certificateNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          d.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : d.status === 'Scheduled'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY BLOOD REQUESTS */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    My Submitted Blood Requests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track status and matched donors for your active emergency blood requests.
                  </p>
                </div>

                <Link
                  to="/requests/create"
                  className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Request</span>
                </Link>
              </div>

              {myRequests.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  You have not submitted any blood requests yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((req) => (
                    <div
                      key={req._id}
                      className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-slate-900">
                              {req.patientName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-red-50 text-brand-red font-black text-xs border border-red-200">
                              {req.bloodGroup}
                            </span>
                            <span className="font-mono text-xs text-slate-400">
                              ({req.requestId})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {req.hospitalName}, {req.city} • Needed by {new Date(req.requiredDate).toLocaleDateString()}
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-brand-red border border-red-200">
                          {req.status}
                        </span>
                      </div>

                      {/* Matched Donors Pill Counter */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          Matched Donors: {req.matchedDonors?.length || 0}
                        </span>
                        <Link
                          to={`/donors?bloodGroup=${encodeURIComponent(req.bloodGroup)}`}
                          className="font-bold text-brand-red hover:underline"
                        >
                          Find More Matching Donors →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CONTACT REQUESTS */}
          {activeTab === 'contact-requests' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Direct Contact Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Manage privacy-protected contact inquiries from patients needing your blood type.
                </p>
              </div>

              {/* Incoming Inquiries */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900">
                  Incoming Inquiries for Your Donor Profile ({contactRequests.incoming.length})
                </h4>

                {contactRequests.incoming.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 rounded-xl bg-slate-50 border border-slate-200">
                    No incoming contact requests.
                  </div>
                ) : (
                  contactRequests.incoming.map((cr) => (
                    <div
                      key={cr._id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            From: {cr.requesterName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-brand-red border border-red-200">
                            {cr.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Patient: <strong>{cr.patientName}</strong> • {cr.hospitalName}
                        </p>
                        <p className="text-xs italic text-slate-500">"{cr.message}"</p>
                      </div>

                      {cr.status === 'Pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleContactRespond(cr._id, 'Accepted')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleContactRespond(cr._id, 'Declined')}
                            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-1 border border-slate-200"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cr.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {cr.status}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Outgoing Inquiries */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">
                  Inquiries Sent by You ({contactRequests.outgoing.length})
                </h4>

                {contactRequests.outgoing.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 rounded-xl bg-slate-50 border border-slate-200">
                    You haven't requested contact with any donors yet.
                  </div>
                ) : (
                  contactRequests.outgoing.map((cr) => (
                    <div
                      key={cr._id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Donor: {cr.donorId?.name || 'Volunteer Donor'} ({cr.donorId?.bloodGroup})
                        </span>
                        <p className="text-slate-500 mt-0.5">
                          Patient: {cr.patientName} • {cr.hospitalName}
                        </p>
                        {cr.status === 'Accepted' && (
                          <p className="text-emerald-700 font-bold mt-1">
                            Accepted! Direct Phone: {cr.donorId?.mobileNumber}
                          </p>
                        )}
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cr.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : cr.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {cr.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MY CAMPS */}
          {activeTab === 'camps' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    My Registered Donation Camps
                  </h3>
                  <p className="text-xs text-slate-500">
                    Camps and community drives you signed up to attend.
                  </p>
                </div>
                <Link
                  to="/camps"
                  className="text-xs font-bold text-brand-red hover:underline"
                >
                  Browse More Camps →
                </Link>
              </div>

              {myCamps.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  You haven't registered for any donation camps yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {myCamps.map((reg) => (
                    <div
                      key={reg._id}
                      className="p-5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                          {reg.campId?.campName || 'Community Blood Drive'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {reg.campId?.date ? new Date(reg.campId.date).toLocaleDateString() : 'Date TBD'} • {reg.campId?.venue}, {reg.campId?.city}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {reg.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
