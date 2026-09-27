import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { ArrowLeft, Lock } from 'lucide-react';

export const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase">
            <Lock className="w-4 h-4" /> Privacy Notice
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: September 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-6 leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect user account data (name, email, profile avatar), gender preference (Men/Women experience context), location search preferences (city, coordinates, radius), wishlist saves, group membership history, and group chat messages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">2. How We Use Information</h2>
            <p>
              Your data is used solely to display nearby fashion store offers, enable group coordination, unlock store contact details upon verified platform fee payment, and send visit notifications to store dashboards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">3. Store Details Access Protection</h2>
            <p>
              Physical store phone numbers and street addresses are kept backend-protected and revealed only to users who are active, verified paid members of a group for that specific store offer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">4. Payment Information Security</h2>
            <p>
              All Razorpay payment transactions are processed over encrypted HTTPS channels. Secret keys and webhook signatures are handled exclusively by secure backend servers and never exposed to browser client code.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
