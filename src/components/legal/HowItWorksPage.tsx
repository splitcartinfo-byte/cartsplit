import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { Compass, Tag, Users, Lock, Store, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
  onExplore: () => void;
}

export const HowItWorksPage: React.FC<LegalPageProps> = ({ onBack, onExplore }) => {
  const { theme } = useExperience();

  const steps = [
    {
      num: '1',
      title: 'Discover Local Offers',
      desc: 'Browse verified clothing products and active store deals based on your selected location and gender preference.',
      icon: Compass,
    },
    {
      num: '2',
      title: 'Choose a Product',
      desc: 'Open the product page to see offer terms, physical store ratings, approximate distance, and active groups.',
      icon: Tag,
    },
    {
      num: '3',
      title: 'Form or Join a Group',
      desc: 'Start a new group or join an existing open group for that product (dynamic capacity, no hardcoded limit).',
      icon: Users,
    },
    {
      num: '4',
      title: 'Pay Platform Participation Fee',
      desc: 'Pay the small platform fee (₹10) via Razorpay. This fee covers platform discovery & group coordination services.',
      icon: ShieldCheck,
    },
    {
      num: '5',
      title: 'Unlock Store Details',
      desc: 'After verified payment, the store’s phone number, WhatsApp contact, full street address, and directions unlock.',
      icon: Lock,
    },
    {
      num: '6',
      title: 'Group Chat & Planning',
      desc: 'Use real-time group chat to coordinate visit date and timing with other members.',
      icon: Users,
    },
    {
      num: '7',
      title: 'Inform Store (Optional)',
      desc: 'Optionally send a visit notification to the store with your planned visit date, time, and group size.',
      icon: Store,
    },
    {
      num: '8',
      title: 'Shop Directly at the Store',
      desc: 'Visit the physical store together, present the offer, and complete your purchase directly with the store.',
      icon: Store,
    },
  ];

  return (
    <div className={`min-h-screen py-10 ${theme.colors.bgPage} ${theme.colors.textPrimary}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full border border-blue-200">
            PLATFORM GUIDE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Fashion Group Discovery Works
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            We bridge online group formation with real offline physical store shopping.
          </p>
        </div>

        {/* Core Philosophy Banner */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2 shadow-xl">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Core Philosophy</p>
          <p className="text-lg font-black italic">
            "Find people. Form a group. Discover better offers. Shop directly from the store."
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            The platform does NOT sell clothing products, handle shipping, process product checkout payments, or split item prices. All product purchases happen directly at the physical store.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm">
                    {step.num}
                  </div>
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-6 text-center">
          <button
            onClick={onExplore}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
          >
            EXPLORE LOCAL OFFERS NOW
          </button>
        </div>
      </div>
    </div>
  );
};
