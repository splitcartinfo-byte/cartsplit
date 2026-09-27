import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase">
            <FileText className="w-4 h-4" /> Legal Policy
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Last updated: September 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-6 leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">1. Platform Service Overview</h2>
            <p>
              Fashion Group Discovery Platform is a location-based discovery and group coordination service connecting consumers with physical, approved retail clothing stores. The Platform is NOT an e-commerce marketplace and does not sell, package, store, process payment for, or deliver any physical clothing products.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">2. Platform Fees & Razorpay Payments</h2>
            <p>
              When creating or joining a group on the Platform, users pay a platform discovery and group participation fee (e.g. ₹10) via Razorpay. This fee is non-refundable and pays solely for digital group coordination, real-time chat, store contact detail unlocking, and visit notifications. It is completely distinct from the physical store's product pricing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">3. Direct Store Transactions</h2>
            <p>
              All physical clothing purchases, size fitting, returns, exchanges, product quality guarantees, and payment settlements take place directly between the customer/group members and the physical store. The Platform assumes zero liability for transactions occurring inside retail stores.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">4. Group Lifecycle & Code of Conduct</h2>
            <p>
              Users agree to maintain civil, respectful communication in group chats. The Platform reserves the right to suspend or block users or stores attempting spam, harassment, fake store listings, or fraudulent offer reporting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">5. Store Responsibilities</h2>
            <p>
              Store partners must provide accurate offer terms, valid store hours, and real product pricing. Admin moderators reserve the right to reject or remove offers that violate platform standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
