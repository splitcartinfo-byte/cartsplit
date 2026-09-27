import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Store, FileText, HelpCircle, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onNavigateLegal: (route: 'how-it-works' | 'terms' | 'privacy' | 'disclaimer' | 'report') => void;
  onOpenStoreLogin: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateLegal,
  onOpenStoreLogin,
  onOpenAdminLogin,
}) => {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Block */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Logo size="lg" showText={false} />
              <span className="text-xl font-black tracking-tight text-white">
                Brand<span className="text-amber-400">Together</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
              Branded fashion group buying platform. Find shoppers, form a group, unlock store deals, and experience fashion directly in verified physical store locations.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Store Offers & Direct Purchasing</span>
            </div>
          </div>

          {/* Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Platform & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateLegal('how-it-works')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>How It Works</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateLegal('terms')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateLegal('privacy')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateLegal('report')}
                  className="hover:text-rose-400 transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Report Store / Offer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Stores */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">For Store Owners</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenStoreLogin}
                  className="hover:text-emerald-400 transition-colors text-slate-400 flex items-center gap-1.5 font-bold"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Store Owner Login & Register</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Admin Trigger Link */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            <button
              onClick={onOpenAdminLogin}
              className="text-slate-400 hover:text-white transition-colors font-bold cursor-pointer underline focus:outline-none"
              title="Admin Portal Access"
            >
              © BrandTogether
            </button>{' '}
            2026. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-500">Group Buying Platform for Branded Fashion</p>
        </div>
      </div>
    </footer>
  );
};
