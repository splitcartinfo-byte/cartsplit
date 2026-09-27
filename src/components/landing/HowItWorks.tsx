import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { Compass, Tag, Users, Lock, Store } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { theme } = useExperience();

  const steps = [
    {
      num: '01',
      title: 'Discover Local Offers',
      desc: 'Browse approved clothing products and active store deals based on your selected location and gender.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Select Offer & Product',
      desc: 'Explore offer details, store ratings, distance, and see existing active groups formed around that offer.',
      icon: Tag,
    },
    {
      num: '03',
      title: 'Create or Join Group',
      desc: 'Pay the small platform fee to start a new group or join an existing open group (flexible group size).',
      icon: Users,
    },
    {
      num: '04',
      title: 'Unlock Store & Chat',
      desc: 'Store phone, WhatsApp, full address, and directions unlock. Chat with group members and inform store.',
      icon: Lock,
    },
    {
      num: '05',
      title: 'Shop Directly at Store',
      desc: 'Visit the physical store together, avail the offer, and pay the store directly. Zero middleman fees.',
      icon: Store,
    },
  ];

  return (
    <div id="how-it-works" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            SIMPLE 5-STEP EXPERIENCE
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            How Fashion Group Discovery Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            We bridge online group formation with real offline store visits. No e-commerce cart, no delivery wait.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-left space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${theme.colors.accentSecondary} transition-colors`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 group-hover:text-slate-900 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
