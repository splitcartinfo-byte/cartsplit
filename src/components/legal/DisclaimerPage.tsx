import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';

export const DisclaimerPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme } = useExperience();

  return (
    <div className={`min-h-screen py-10 ${theme.colors.bgPage} ${theme.colors.textPrimary}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase">
            <AlertCircle className="w-4 h-4" /> Platform Boundary
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Disclaimer
          </h1>
          <p className="text-xs text-slate-500">Non-Negotiable Business Boundaries</p>
        </div>

        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-4">
          <div className="flex items-center gap-2 font-black text-amber-900 text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            STRICT SERVICE BOUNDARIES
          </div>

          <ul className="list-disc pl-5 space-y-2 leading-relaxed font-medium">
            <li><strong>Not an E-Commerce Marketplace:</strong> The Platform does NOT sell clothing products, maintain inventory, or process clothing purchase checkouts.</li>
            <li><strong>No Product Delivery or Shipping:</strong> The Platform does NOT handle logistics, shipping, delivery, or returns.</li>
            <li><strong>No Price Splitting Calculations:</strong> The Platform does NOT calculate, split, or enforce how group members divide a store's item prices.</li>
            <li><strong>Direct Physical Store Transactions:</strong> All clothing purchases happen directly between the customer/group and the physical retail store.</li>
            <li><strong>Platform Participation Fee:</strong> The Razorpay fee paid on this site (e.g. ₹10) is exclusively for platform discovery and group coordination services. It is non-refundable and separate from store product pricing.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
