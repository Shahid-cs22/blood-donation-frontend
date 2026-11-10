import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Search,
  HeartHandshake,
  AlertCircle,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  Activity,
  CheckCircle,
  ChevronDown,
  PhoneCall,
  Heart,
  Star,
  Quote,
  Mail,
  MapPin,
  Send
} from 'lucide-react';
import BloodGroupMatrix from '../components/BloodGroupMatrix';
import BloodRequestCard from '../components/BloodRequestCard';
import CampCard from '../components/CampCard';
import { bloodRequestService } from '../services/bloodRequestService';
import { campService } from '../services/campService';
import { contactService } from '../services/contactService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Home() {
  const { isLoggedIn, isDonor } = useAuth();
  const navigate = useNavigate();

  const [urgentRequests, setUrgentRequests] = useState([]);
  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [reqRes, campRes] = await Promise.all([
          bloodRequestService.getAllRequests({ limit: 3, priority: 'Critical' }),
          campService.getCamps({ limit: 3 })
        ]);
        if (reqRes.success) setUrgentRequests(reqRes.requests || []);
        if (campRes.success) setUpcomingCamps(campRes.camps || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleCampRegister = async (camp) => {
    if (!isLoggedIn) {
      toast.error('Please log in to register for donation camps.');
      navigate('/login');
      return;
    }
    try {
      const res = await campService.registerForCamp(camp._id);
      if (res.success) {
        toast.success(`Registered for ${camp.campName}!`);
        const refreshed = await campService.getCamps({ limit: 3 });
        if (refreshed.success) setUpcomingCamps(refreshed.camps);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not register for camp.');
    }
  };

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      const res = await contactService.submitInquiry(contactForm);
      if (res.success) {
        toast.success(res.message || 'Thank you! Your message has been received.');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message. Please try again.');
    } finally {
      setSubmittingContact(false);
    }
  };

  const successStories = [
    {
      name: 'Priya Narayanan',
      role: 'Recipient Mother',
      bloodGroup: 'O-',
      city: 'Chennai',
      quote: 'When my 6-year-old son required 2 units of rare O- blood for emergency dengue treatment at midnight, Blood Hero connected us with an eligible voluntary donor in just 22 minutes. You literally saved my child’s life.',
      date: 'March 2026',
      rating: 5
    },
    {
      name: 'Karthik Sundaram',
      role: 'Voluntary Donor (18x)',
      bloodGroup: 'B+',
      city: 'Coimbatore',
      quote: 'I love how Blood Hero protects donor privacy. I receive alerts only when my specific blood type is needed nearby, and the appointment booking takes seconds. Donating blood is the easiest way to be a real-life hero.',
      date: 'February 2026',
      rating: 5
    },
    {
      name: 'Dr. Aruna Sengupta',
      role: 'Senior Hematologist',
      bloodGroup: 'AB+',
      city: 'Bangalore',
      quote: 'Having voluntary donors coordinate through verified real-time alerts bridges the critical golden hour for accident trauma cases. Blood Hero has become an indispensable network for healthcare providers.',
      date: 'January 2026',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'Who can donate blood?',
      a: 'Any healthy individual between 18 and 65 years of age weighing at least 50 kg is eligible. Hemoglobin level must be at least 12.5 g/dl, and at least 3 months must have elapsed since your last whole blood donation.'
    },
    {
      q: 'How does Blood Hero protect my privacy?',
      a: 'Your phone number and email are never displayed publicly. When someone requires your blood group, they submit a verified in-app Contact Request. Only after you review and accept do they receive your contact coordinates.'
    },
    {
      q: 'How long does a blood donation take?',
      a: 'The actual blood donation takes just 8 to 15 minutes! The entire appointment—including registration, quick health screening, donation, and refreshments—takes approximately 30 to 45 minutes.'
    },
    {
      q: 'Can I donate if I recently had a fever or cold?',
      a: 'You should be completely free of symptoms, fever, and antibiotics for at least 7 days before donating blood.'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION - CLASSIC MEDICAL DESIGN */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50/70 via-white to-slate-50/50">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-12 left-10 w-20 h-20 rounded-full bg-red-100/60 blur-xl pointer-events-none" />
        <div className="absolute top-40 right-12 w-32 h-32 rounded-full bg-red-100/40 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-brand-red">
                  Voluntary Life-Saving Network
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] break-words">
                EVERYONE COULD <br />
                <span className="text-brand-red relative inline-block">
                  BE A HERO
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-red-200 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q50 0 100 15" stroke="currentColor" strokeWidth="6" fill="transparent" />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg font-normal text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Saving Lives, Spreading Smiles. Connect directly with voluntary blood donors, locate emergency requests, and join community blood drives.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/donors"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-red text-white text-sm font-bold shadow-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Donor</span>
                </Link>

                {!isDonor ? (
                  <Link
                    to="/donor/register"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-slate-800 border border-slate-300 text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <HeartHandshake className="w-4 h-4 text-brand-red" />
                    <span>Become a Donor</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Donor Profile Active</span>
                  </Link>
                )}
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Donors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-red" />
                  <span>Instant Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-brand-red fill-brand-red" />
                  <span>100% Free Forever</span>
                </div>
              </div>

            </div>

            {/* Right Card Representation */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 overflow-hidden">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-brand-red font-bold text-xs">
                      🩸
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      Easy To Save People
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-brand-red border border-red-200">
                    Live
                  </span>
                </div>

                {/* Banner */}
                <div className="relative rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-red text-white p-5 shadow-xs overflow-hidden mb-5">
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                      Blood Donation Drive
                    </span>
                    <h3 className="text-xl font-bold mt-1 leading-snug">
                      15 Minutes Is All That's Needed
                    </h3>
                    <p className="text-[11px] text-white/90 mt-1">
                      To save someone's life today.
                    </p>
                  </div>
                </div>

                {/* Services Row */}
                <div className="mb-5">
                  <span className="text-xs font-bold text-slate-400 block mb-2">Quick Services</span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Link
                      to="/donors"
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-white transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-red text-white flex items-center justify-center shadow-xs">
                        <Search className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Find Donor</span>
                    </Link>

                    <Link
                      to="/requests/create"
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-white transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Need Blood</span>
                    </Link>

                    <Link
                      to="/camps"
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-white transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Camps</span>
                    </Link>
                  </div>
                </div>

                {/* Next Upcoming Donation Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                      Next Featured Camp
                    </span>
                    <span className="text-[10px] text-slate-400">Open for all</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    COMMUNITY HEALTH CENTER
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-brand-red" />
                    <span>24 April | 10:00 AM • Free Health Checkup</span>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE DONATION STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-brand-red rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
            <div>
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black block tracking-tight">1,250+</span>
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
                Registered Donors
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black block tracking-tight">3,400+</span>
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
                Lives Saved
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black block tracking-tight">98.4%</span>
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
                Fulfillment Rate
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black block tracking-tight">45+</span>
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
                Donation Camps
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOOD GROUP COMPATIBILITY MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BloodGroupMatrix />
      </section>

      {/* 4. LIVE URGENT BLOOD REQUESTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              Emergency Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Urgent Blood Requests
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Patients requiring immediate transfusion assistance. Every donor counts.
            </p>
          </div>

          <Link
            to="/requests"
            className="text-xs font-bold text-brand-red hover:text-red-700 flex items-center gap-1 group"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {urgentRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-800">
              No Pending Critical Requests
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All critical requests have matching donors in progress. You can still browse other open requests.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgentRequests.map((req) => (
              <BloodRequestCard key={req._id} request={req} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How Blood Hero Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bridging the gap between voluntary heroes and emergency requirements smoothly and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-brand-red font-black text-lg flex items-center justify-center mx-auto mb-4">
              01
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              Register & Verify
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create an account and verify your email with a secure 6-digit OTP code in under 60 seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-brand-red font-black text-lg flex items-center justify-center mx-auto mb-4">
              02
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              Enroll as Donor
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add your blood type, location, and donation history. You can pause or resume availability at any time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-brand-red font-black text-lg flex items-center justify-center mx-auto mb-4">
              03
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              Smart Matching
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When someone nearby urgently requires your blood type, you receive instant alerts while your phone stays private.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-brand-red font-black text-lg flex items-center justify-center mx-auto mb-4">
              04
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              Save a Life
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visit the hospital or camp, complete your 15-minute donation, and receive your digital Hero certificate.
            </p>
          </div>

        </div>
      </section>

      {/* 6. UPCOMING DONATION CAMPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              Community Drives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Upcoming Blood Donation Camps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Join certified blood donation drives in your city organized with premier healthcare centers.
            </p>
          </div>

          <Link
            to="/camps"
            className="text-xs font-bold text-brand-red hover:text-red-700 flex items-center gap-1 group"
          >
            <span>View All Camps</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingCamps.map((camp) => (
            <CampCard
              key={camp._id}
              camp={camp}
              onRegister={handleCampRegister}
              isRegistered={false}
            />
          ))}
        </div>
      </section>

      {/* 7. SUCCESS STORIES & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            Real Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Stories That Warm the Heart
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real testimonies from patients whose lives were saved and donors who made it possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {successStories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 relative flex flex-col justify-between group"
            >
              <div>
                {/* 5-Star Rating & Blood Group Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-brand-red font-bold text-xs">
                    {story.bloodGroup}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{story.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {story.name}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500">
                    {story.role} • {story.city}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {story.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-red shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CONTACT US & VOLUNTEER INQUIRY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Contact Coordinates */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  We're Here For You
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Have Questions or Want to Organize a Camp?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Reach out to the Blood Hero volunteer coordination team. Whether you need immediate transfusion guidance, want to register as an institutional partner, or host a corporate blood drive, we are ready to assist.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-brand-red text-white flex items-center justify-center shrink-0 shadow-xs">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Emergency Hotline (24/7)
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      +91 94440 12345 / 1800-HERO
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Official Support Email
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      support@bloodhero.org
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Coordination Headquarters
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      Central Healthcare Hub, Anna Salai, Chennai, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                Send Us a Direct Message
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Our support desk usually responds within 15 to 30 minutes.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98401 23456"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blood Camp Inquiry / Hospital Support"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you today? Please provide any relevant details..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingContact ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 10. EMERGENCY CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50/70 rounded-2xl p-6 sm:p-8 border border-red-200 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Do You Need Blood Right Now?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Post an emergency blood request immediately. Our matching engine will notify eligible donors in your city.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/requests/create"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-all shadow-xs text-center"
            >
              Post Emergency Request
            </Link>
            <a
              href="tel:+919444012345"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-800 border border-slate-300 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-red" />
              <span>Call 24/7 Helpline</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
