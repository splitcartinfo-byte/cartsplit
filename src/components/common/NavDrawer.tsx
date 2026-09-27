import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExperience } from '../../context/ExperienceContext';
import { useLocation } from '../../context/LocationContext';
import {
  X,
  Home,
  Compass,
  Heart,
  Users,
  MapPin,
  User,
  HelpCircle,
  FileText,
  AlertTriangle,
  Store,
  Bell,
  Sparkles,
} from 'lucide-react';

export interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLocation?: () => void;
  onOpenWishlist?: () => void;
  onOpenAuth?: () => void;
  onOpenMyGroups?: () => void;
  onNavigateLegal?: (route: 'how-it-works' | 'terms' | 'privacy' | 'disclaimer' | 'report') => void;
  onGoHome?: () => void;
  onOpenExplore?: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenLocation,
  onOpenWishlist,
  onOpenAuth,
  onOpenMyGroups,
  onNavigateLegal,
  onGoHome,
  onOpenExplore,
}) => {
  const { user } = useAuth();
  const { gender, setGender } = useExperience();
  const { location } = useLocation();

  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow || 'auto';
        document.documentElement.style.overflow = originalHtmlOverflow || 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white h-[100dvh] shadow-2xl z-10 flex flex-col overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="font-black text-base text-slate-900 tracking-tight">
              Brand<span className="text-amber-500">Together</span>
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* Gender Category Switcher (3 Sections) */}
          <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                setGender('mens');
                if (onGoHome) onGoHome();
                onClose();
              }}
              className={`py-2 rounded-xl font-extrabold text-[11px] transition-all ${
                gender === 'mens' || gender === 'men'
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => {
                setGender('womens');
                if (onGoHome) onGoHome();
                onClose();
              }}
              className={`py-2 rounded-xl font-extrabold text-[11px] transition-all ${
                gender === 'womens' || gender === 'women'
                  ? 'bg-[#7C3D6E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Women's
            </button>
            <button
              onClick={() => {
                setGender('children');
                if (onGoHome) onGoHome();
                onClose();
              }}
              className={`py-2 rounded-xl font-extrabold text-[11px] transition-all ${
                gender === 'children'
                  ? 'bg-[#2E6B4F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Children's
            </button>
          </div>

          {/* Location Selector */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate max-w-[200px]">
              <MapPin className="w-4 h-4 text-slate-700 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Store Location</p>
                <p className="font-extrabold text-slate-900 truncate">{location.city}</p>
              </div>
            </div>
            {onOpenLocation && (
              <button
                onClick={() => {
                  onOpenLocation();
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-extrabold text-[11px] hover:bg-slate-300"
              >
                Change
              </button>
            )}
          </div>

          {/* Main Discover Options */}
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">Navigation</p>

            {onGoHome && (
              <button
                onClick={() => {
                  onGoHome();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Home Page</span>
              </button>
            )}

            {onOpenExplore && (
              <button
                onClick={() => {
                  onOpenExplore();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Browse Offers</span>
              </button>
            )}
          </div>

          {/* Personal Options */}
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">Account & Groups</p>

            {onOpenAuth && (
              <button
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Profile & Account</span>
              </button>
            )}

            {onOpenWishlist && (
              <button
                onClick={() => {
                  onOpenWishlist();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Wishlist</span>
              </button>
            )}

            {user && onOpenMyGroups && (
              <button
                onClick={() => {
                  onOpenMyGroups();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>My Groups</span>
              </button>
            )}
          </div>

          {/* Store Owner Entry */}
          <div className="pt-3 border-t border-slate-100">
            {onOpenAuth && (
              <button
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold hover:bg-emerald-100 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Store Owner Portal</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full uppercase font-bold">
                  Partner
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
