import React, { useState } from 'react';
import { Logo } from './Logo';
import { usePlatform } from '../../context/PlatformContext';
import { useExperience } from '../../context/ExperienceContext';
import { useLocation } from '../../context/LocationContext';
import { Search, Heart, Menu, MapPin, Tag, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNavDrawer: () => void;
  onOpenSearch?: () => void;
  onNavigateWishlist?: () => void;
  onGoHome?: () => void;
  onOpenLocationModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenNavDrawer,
  onOpenSearch,
  onNavigateWishlist,
  onGoHome,
  onOpenLocationModal,
}) => {
  const { wishlist } = usePlatform();
  const { gender, setGender } = useExperience();
  const { location } = useLocation();
  const [searchMode, setSearchMode] = useState<'brand' | 'location'>('brand');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearch) onOpenSearch();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-6 md:px-8 py-2.5 max-w-full mx-auto pointer-events-none transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        {/* LEFT CONTAINER: Logo & Gender Navigation Links */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-sm flex items-center gap-2 sm:gap-4 hover:bg-white transition-all shrink-0">
          <button
            onClick={onGoHome}
            aria-label="BrandTogether Home"
            className="flex items-center gap-1.5 sm:gap-2 focus:outline-none rounded-full"
          >
            <Logo size="md" showText={true} />
          </button>

          {/* Gender Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-3">
            <button
              onClick={() => setGender('mens')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                gender === 'mens' || gender === 'men'
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => setGender('womens')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                gender === 'womens' || gender === 'women'
                  ? 'bg-[#7C3D6E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
              }`}
            >
              Women's
            </button>
            <button
              onClick={() => setGender('children')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                gender === 'children'
                  ? 'bg-[#2E6B4F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
              }`}
            >
              Children's
            </button>
          </div>
        </div>

        {/* RIGHT CONTAINER DESKTOP: Location Pill + Search + Wishlist + Hamburger */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2.5 sm:gap-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-3.5 sm:px-4 py-1.5 shadow-sm hover:bg-white transition-all">
          {/* Location Indicator Pill */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="truncate max-w-[120px] lg:max-w-none">
              Location: <strong className="text-slate-900 font-bold">{location.city}</strong>
            </span>
            {onOpenLocationModal && (
              <button
                onClick={onOpenLocationModal}
                className="text-blue-600 hover:underline font-bold text-[11px] ml-1"
              >
                Change
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Search Bar with Mode Toggle */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="flex items-center text-[10px] font-bold text-slate-500 mr-2 bg-slate-100 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setSearchMode('brand')}
                className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  searchMode === 'brand' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Tag className="w-3 h-3 text-slate-500" />
                <span>Brand</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('location')}
                className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  searchMode === 'location' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>Location</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  searchMode === 'brand'
                    ? "Search Brand (e.g. Zara, Levi's)..."
                    : "Search Location (e.g. Patia, Bhubaneswar)..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 lg:w-52 pl-8 pr-7 py-1 text-xs bg-slate-50 border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </form>

          <div className="h-4 w-px bg-slate-200" />

          {/* Wishlist Button */}
          <button
            onClick={onNavigateWishlist}
            aria-label="View Wishlist"
            className="relative p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <Heart className="w-4 h-4 text-slate-700 hover:text-rose-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <div className="h-4 w-px bg-slate-200" />

          {/* Hamburger Menu */}
          <button
            onClick={onOpenNavDrawer}
            aria-label="Open menu"
            className="p-1.5 sm:p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* MOBILE RIGHT CONTAINER */}
        <div className="pointer-events-auto md:hidden flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-2 sm:px-3 py-1.5 shadow-sm shrink-0">
          <button
            onClick={onOpenSearch || handleSearchSubmit}
            aria-label="Search"
            className="p-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Search className="w-4 h-4 text-slate-800" />
          </button>

          <div className="h-3.5 w-px bg-slate-200" />

          <button
            onClick={onNavigateWishlist}
            aria-label="Wishlist"
            className="relative p-1.5 rounded-full text-slate-700 hover:text-rose-600 transition-all"
          >
            <Heart className="w-4 h-4 text-slate-700" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <div className="h-3.5 w-px bg-slate-200" />

          <button
            onClick={onOpenNavDrawer}
            aria-label="Open navigation menu"
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
