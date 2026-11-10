import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';

const BLOOD_GROUPS_DATA = [
  {
    group: 'A+',
    rh: 'Positive',
    giveTo: ['A+', 'AB+'],
    receiveFrom: ['A+', 'A-', 'O+', 'O-'],
    rarity: 'Common (34%)'
  },
  {
    group: 'A-',
    rh: 'Negative',
    giveTo: ['A+', 'A-', 'AB+', 'AB-'],
    receiveFrom: ['A-', 'O-'],
    rarity: 'Rare (6%)'
  },
  {
    group: 'B+',
    rh: 'Positive',
    giveTo: ['B+', 'AB+'],
    receiveFrom: ['B+', 'B-', 'O+', 'O-'],
    rarity: 'Moderate (9%)'
  },
  {
    group: 'B-',
    rh: 'Negative',
    giveTo: ['B+', 'B-', 'AB+', 'AB-'],
    receiveFrom: ['B-', 'O-'],
    rarity: 'Rare (2%)'
  },
  {
    group: 'AB+',
    rh: 'Positive',
    giveTo: ['AB+'],
    receiveFrom: ['All Types'],
    rarity: 'Universal Recipient (3%)'
  },
  {
    group: 'AB-',
    rh: 'Negative',
    giveTo: ['AB+', 'AB-'],
    receiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    rarity: 'Rarest (1%)'
  },
  {
    group: 'O+',
    rh: 'Positive',
    giveTo: ['O+', 'A+', 'B+', 'AB+'],
    receiveFrom: ['O+', 'O-'],
    rarity: 'Most Common (38%)'
  },
  {
    group: 'O-',
    rh: 'Negative',
    giveTo: ['All Types'],
    receiveFrom: ['O-'],
    rarity: 'Universal Donor (7%)'
  }
];

export default function BloodGroupMatrix() {
  const [selectedGroup, setSelectedGroup] = useState(BLOOD_GROUPS_DATA[6]); // Default O+
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
          Compatibility Matrix
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Explore All 8 Blood Groups
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tap any blood type to discover compatibility rules, recipient eligibility, and find available matching donors.
        </p>
      </div>

      {/* 8 Blood Group Buttons */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {BLOOD_GROUPS_DATA.map((item) => {
          const isSelected = selectedGroup.group === item.group;
          return (
            <button
              key={item.group}
              onClick={() => setSelectedGroup(item)}
              className={`py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'bg-brand-red text-white shadow-xs scale-102 font-bold'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-red-200 hover:bg-white'
              }`}
            >
              <span className="text-base sm:text-lg font-black">{item.group}</span>
              <span className={`text-[9px] sm:text-[10px] font-medium mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                {item.rh}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Group Detail Card */}
      <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        
        {/* Blood Group Badge & Rarity */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-slate-900 to-brand-red text-white flex flex-col items-center justify-center shadow-xs">
            <span className="text-2xl font-black">{selectedGroup.group}</span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-white/80">{selectedGroup.rh}</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Blood Type {selectedGroup.group}
            </h4>
            <p className="text-xs font-semibold text-brand-red mt-0.5">
              {selectedGroup.rarity}
            </p>
          </div>
        </div>

        {/* Can Give To / Can Receive From */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-lg">
          
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Can Donate Red Cells To:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedGroup.giveTo.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Can Receive Red Cells From:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedGroup.receiveFrom.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Find Matching Donors Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={() => navigate(`/donors?bloodGroup=${encodeURIComponent(selectedGroup.group)}`)}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-brand-red text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xs"
          >
            Find {selectedGroup.group} Donors
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
