import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Droplet,
  AlertCircle,
  Calendar,
  Download,
  Shield,
  CheckCircle,
  XCircle,
  PlusCircle,
  Search,
  Activity,
  Layers,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';
import { campService } from '../services/campService';
import { bloodRequestService } from '../services/bloodRequestService';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: overview, users, donors, requests, camps
  const [tab, setTab] = useState('overview');

  // Sub-lists
  const [userList, setUserList] = useState([]);
  const [donorList, setDonorList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [campList, setCampList] = useState([]);

  // Camp Creation Modal state
  const [showCampModal, setShowCampModal] = useState(false);
  const [campForm, setCampForm] = useState({
    campName: '',
    description: '',
    date: '',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    venue: '',
    address: '',
    city: '',
    district: '',
    organizer: '',
    contactPhone: '',
    registrationLimit: 100
  });

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setBloodGroups(res.bloodGroupDistribution || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin analytics.');
    } finally {
      setLoading(false);
    }
  };

  const loadTabContent = async () => {
    try {
      if (tab === 'users') {
        const res = await adminService.getUsers();
        if (res.success) setUserList(res.users || []);
      } else if (tab === 'donors') {
        const res = await adminService.getDonors();
        if (res.success) setDonorList(res.donors || []);
      } else if (tab === 'requests') {
        const res = await bloodRequestService.getAllRequests({ limit: 50 });
        if (res.success) setRequestList(res.requests || []);
      } else if (tab === 'camps') {
        const res = await campService.getCamps({ limit: 50 });
        if (res.success) setCampList(res.camps || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  useEffect(() => {
    if (tab !== 'overview') {
      loadTabContent();
    }
  }, [tab]);

  // Toggle user suspension
  const handleToggleSuspend = async (userId) => {
    try {
      const res = await adminService.toggleUserSuspension(userId);
      if (res.success) {
        toast.success(res.message);
        loadTabContent();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user.');
    }
  };

  // Toggle user role
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        toast.success(res.message);
        loadTabContent();
      }
    } catch (err) {
      toast.error('Could not update role.');
    }
  };

  // Approve or update blood request status
  const handleRequestStatus = async (reqId, status) => {
    try {
      const res = await bloodRequestService.updateRequestStatus(reqId, status);
      if (res.success) {
        toast.success(`Request status updated to ${status}.`);
        loadTabContent();
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  // Create Camp
  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      const res = await campService.createCamp(campForm);
      if (res.success) {
        toast.success('Donation camp created successfully!');
        setShowCampModal(false);
        loadTabContent();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create camp.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview & KPIs', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'donors', label: 'Donor Records', icon: Heart },
    { id: 'requests', label: 'Blood Requests', icon: AlertCircle },
    { id: 'camps', label: 'Donation Camps', icon: Calendar }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-red rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Security Level: Administrator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            Platform Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Real-time management of users, donors, emergency requests, camps, and CSV report export.
          </p>
        </div>

        {/* CSV Export Dropdown / Buttons */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
          <a
            href={adminService.exportCsvUrl('donors')}
            download="blood_donors.csv"
            className="px-2.5 sm:px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-center"
          >
            <Download className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="hidden sm:inline">Donors CSV</span>
            <span className="sm:hidden">Donors</span>
          </a>
          <a
            href={adminService.exportCsvUrl('requests')}
            download="blood_requests.csv"
            className="px-2.5 sm:px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-center"
          >
            <Download className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="hidden sm:inline">Requests CSV</span>
            <span className="sm:hidden">Requests</span>
          </a>
          <a
            href={adminService.exportCsvUrl('donations')}
            download="donations.csv"
            className="px-2.5 sm:px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-center"
          >
            <Download className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="hidden sm:inline">Donations CSV</span>
            <span className="sm:hidden">Donations</span>
          </a>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                active
                  ? 'bg-brand-red text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & KPIS */}
      {tab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* 8 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Registered Users" value={stats?.totalUsers || 0} icon={Users} color="dark" />
            <StatCard label="Active Donors" value={stats?.activeDonors || 0} icon={Heart} color="red" />
            <StatCard label="Total Requests" value={stats?.totalRequests || 0} icon={AlertCircle} color="amber" />
            <StatCard label="Completed Donations" value={stats?.completedDonations || 0} icon={CheckCircle} color="emerald" />
            <StatCard label="Pending Requests" value={stats?.pendingRequests || 0} icon={Clock} color="amber" />
            <StatCard label="Total Donations" value={stats?.totalDonations || 0} icon={Droplet} color="red" />
            <StatCard label="Total Donors Enrolled" value={stats?.totalDonors || 0} icon={Heart} color="emerald" />
            <StatCard label="Upcoming Camps" value={stats?.upcomingCamps || 0} icon={Calendar} color="blue" />
          </div>

          {/* Blood Group Distribution Grid */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Registered Donors by Blood Group
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
                const found = bloodGroups.find(b => b._id === bg);
                const count = found ? found.count : 0;
                return (
                  <div
                    key={bg}
                    className="p-4 rounded-xl bg-slate-50 text-center border border-slate-200"
                  >
                    <span className="text-2xl font-black text-brand-red block">
                      {bg}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 mt-1 block">
                      {count} {count === 1 ? 'Donor' : 'Donors'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 2. USER MANAGEMENT */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Registered Users ({userList.length})
            </h3>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full text-xs text-left min-w-[650px]">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3 text-slate-500">{u.mobileNumber}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.isEmailVerified ? (
                        <span className="text-emerald-700 font-bold">Yes</span>
                      ) : (
                        <span className="text-rose-600 font-bold">No</span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">Suspended</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Active</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleSuspend(u._id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                          u.isSuspended
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {u.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold border border-slate-200"
                      >
                        {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DONOR RECORDS */}
      {tab === 'donors' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Donor Directory (Admin Unmasked View - {donorList.length})
            </h3>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full text-xs text-left min-w-[650px]">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-3">Donor Name</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Direct Phone</th>
                  <th className="p-3">City / District</th>
                  <th className="p-3">Donations</th>
                  <th className="p-3">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donorList.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{d.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-brand-red font-bold border border-red-200">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-700">{d.mobileNumber}</td>
                    <td className="p-3 text-slate-500">{d.city}, {d.district}</td>
                    <td className="p-3 font-bold">{d.totalDonations}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        d.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {d.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. BLOOD REQUESTS */}
      {tab === 'requests' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Manage Blood Requests ({requestList.length})
            </h3>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full text-xs text-left min-w-[650px]">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Blood Type</th>
                  <th className="p-3">Hospital</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requestList.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-700">{r.requestId}</td>
                    <td className="p-3 font-bold text-slate-900">{r.patientName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-red-50 text-brand-red font-bold border border-red-200">
                        {r.bloodGroup} ({r.unitsRequired}U)
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{r.hospitalName}, {r.city}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        r.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-red-50 text-brand-red border border-red-200'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-700">{r.status}</td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleRequestStatus(r._id, 'Approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestStatus(r._id, 'Fulfilled')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px] hover:bg-blue-100"
                      >
                        Fulfilled
                      </button>
                      <button
                        onClick={() => handleRequestStatus(r._id, 'Rejected')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] hover:bg-slate-200"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DONATION CAMPS */}
      {tab === 'camps' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Manage Donation Camps ({campList.length})
              </h3>
              <p className="text-xs text-slate-500">Add, view, and organize life-saver community camps.</p>
            </div>
            <button
              onClick={() => setShowCampModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Camp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {campList.map((c) => (
              <div
                key={c._id}
                className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-red">
                    {new Date(c.date).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{c.campName}</h4>
                <p className="text-xs text-slate-500">{c.venue}, {c.city}</p>
                <p className="text-xs font-bold text-slate-700">
                  Registrations: {c.registeredCount} / {c.registrationLimit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CAMP MODAL */}
      {showCampModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Add New Blood Donation Camp
            </h3>
            <form onSubmit={handleCreateCamp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Camp Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Cross Annual Mega Blood Drive"
                  value={campForm.campName}
                  onChange={(e) => setCampForm({ ...campForm, campName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Details about camp..."
                  value={campForm.description}
                  onChange={(e) => setCampForm({ ...campForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={campForm.date}
                    onChange={(e) => setCampForm({ ...campForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={campForm.city}
                    onChange={(e) => setCampForm({ ...campForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Venue Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Auditorium"
                    value={campForm.venue}
                    onChange={(e) => setCampForm({ ...campForm, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Venue Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full street address"
                    value={campForm.address}
                    onChange={(e) => setCampForm({ ...campForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Organizer Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotary Club"
                    value={campForm.organizer}
                    onChange={(e) => setCampForm({ ...campForm, organizer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98401 12345"
                    value={campForm.contactPhone}
                    onChange={(e) => setCampForm({ ...campForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCampModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 shadow-xs"
                >
                  Create Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
