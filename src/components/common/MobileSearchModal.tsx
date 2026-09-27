import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useExperience } from '../../context/ExperienceContext';
import { usePlatform } from '../../context/PlatformContext';
import { Search, MapPin, Tag, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { GenderCategory } from '../../types';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenLocationModal: () => void;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  onOpenLocationModal,
}) => {
  const { location, radiusKm, setRadiusKm } = useLocation();
  const { gender } = useExperience();
  const { products } = usePlatform();
  const [searchMode, setSearchMode] = useState<'brand' | 'location'>('brand');

  if (!isOpen) return null;

  // Normalized current gender
  const currentGender: GenderCategory =
    gender === 'men' || gender === 'mens'
      ? 'mens'
      : gender === 'women' || gender === 'womens'
      ? 'womens'
      : 'children';

  // Calculate live matching count
  const matchingOffersCount = searchQuery.trim()
    ? products.filter((prod) => {
        if (prod.status !== 'APPROVED' || !prod.offer || !prod.offer.isActive) return false;
        const prodGender =
          prod.gender === 'men' || prod.gender === 'mens'
            ? 'mens'
            : prod.gender === 'women' || prod.gender === 'womens'
            ? 'womens'
            : 'children';
        if (prodGender !== currentGender) return false;

        const q = searchQuery.toLowerCase();
        if (searchMode === 'location') {
          return (
            (prod.city || '').toLowerCase().includes(q) ||
            prod.storeName.toLowerCase().includes(q)
          );
        } else {
          return (
            (prod.brandName || prod.offer.brandName || '').toLowerCase().includes(q) ||
            prod.name.toLowerCase().includes(q) ||
            prod.offer.title.toLowerCase().includes(q)
          );
        }
      }).length
    : products.filter((p) => p.status === 'APPROVED' && p.offer?.isActive).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden mt-6 my-auto">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-black text-slate-900">Search Brand & Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Search Mode Toggle (Brand vs Location) */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
              Search Mode
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSearchMode('brand')}
                className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                  searchMode === 'brand'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-slate-600" />
                <span>Brand Search</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('location')}
                className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                  searchMode === 'location'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                <span>Location Search</span>
              </button>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
              {searchMode === 'brand' ? 'Search by Brand Name' : 'Search by Store / City Location'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder={
                  searchMode === 'brand'
                    ? "Enter Brand (e.g. Zara, Levi's, Nike)..."
                    : "Enter Store Location (e.g. Patia, Bhubaneswar)..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Live Result Feedback Banner */}
          {searchQuery.trim() && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                matchingOffersCount > 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {matchingOffersCount > 0 ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Found {matchingOffersCount} matching store offer{matchingOffersCount > 1 ? 's' : ''}!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>No offers found matching "{searchQuery}"</span>
                </>
              )}
            </div>
          )}

          {/* Discovery Location */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-500 uppercase text-[10px]">Active Location</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenLocationModal();
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Change Location
              </button>
            </div>
            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
              <MapPin className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="truncate">{location.city} ({location.address})</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById('discovery-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg transition-all"
            >
              VIEW OFFERS ({matchingOffersCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
