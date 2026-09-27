import React, { useState } from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { ArrowLeft, ShieldAlert, Send } from 'lucide-react';

export const ReportPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme } = useExperience();
  const { user } = useAuth();
  const { reportItem } = usePlatform();

  const [type, setType] = useState<'STORE' | 'OFFER' | 'USER'>('STORE');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('Fake store / wrong address');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportItem({
      type,
      targetId: targetId || 'General Report',
      reporterUserId: user ? user.id : 'usr_anon',
      reporterUserName: user ? user.name : 'Anonymous Shopper',
      reason,
      details,
    });
    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen py-10 ${theme.colors.bgPage} ${theme.colors.textPrimary}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase">
            <ShieldAlert className="w-4 h-4" /> Moderation & Trust
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Fake Store, Offer or Abusive User
          </h1>
          <p className="text-xs text-slate-500">We audit all reports within 24 hours to maintain platform integrity.</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
            <h3 className="font-extrabold text-lg">Report Submitted Successfully</h3>
            <p className="text-xs text-slate-600">
              Our admin moderation team has logged your report into the audit system. Thank you for keeping our fashion community safe!
            </p>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl"
            >
              Return to Discovery Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700">What are you reporting?</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 mt-1"
              >
                <option value="STORE">Fake Store / Wrong Address</option>
                <option value="OFFER">Misleading or Expired Offer</option>
                <option value="USER">Abusive Chat Member / Spam</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700">Store Name, Offer or User ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Urban Threads Patia branch"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 mt-1"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Reason</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 mt-1"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Additional Details</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 mt-1 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT REPORT TO ADMIN MODERATORS</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
