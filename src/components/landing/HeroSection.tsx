import React, { useState, useEffect } from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { useLocation } from '../../context/LocationContext';
import { usePlatform } from '../../context/PlatformContext';
import { MapPin, ArrowRight, ShieldCheck, Users, Sparkles, Tag, X, Volume2 } from 'lucide-react';
import { GenderCategory } from '../../types';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenLocation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOpenLocation,
}) => {
  const { gender } = useExperience();
  const { location } = useLocation();
  const { ads, tickers, landingImages, selectedBrandFilter, setSelectedBrandFilter } = usePlatform();

  // Ad dismissal persistence in sessionStorage
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isAdDismissed, setIsAdDismissed] = useState(() => {
    return sessionStorage.getItem('brandtogether_ad_dismissed') === 'true';
  });

  // Ticker rotation
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  const activeAds = ads.filter((a) => a.active);
  const activeTickers = tickers.filter((t) => t.active).sort((a, b) => a.order - b.order);

  // Filter landing images for active section
  const normGender: GenderCategory =
    gender === 'men' || gender === 'mens'
      ? 'mens'
      : gender === 'women' || gender === 'womens'
      ? 'womens'
      : 'children';

  const activeLandingImages = landingImages
    .filter(
      (img) =>
        img.active &&
        (img.gender === normGender ||
          img.gender === (normGender === 'mens' ? 'men' : normGender === 'womens' ? 'women' : 'children'))
    )
    .sort((a, b) => a.order - b.order)
    .slice(0, 10);

  useEffect(() => {
    if (activeAds.length > 1) {
      const timer = setInterval(() => {
        setActiveAdIndex((prev) => (prev + 1) % activeAds.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [activeAds.length]);

  useEffect(() => {
    if (activeTickers.length > 1) {
      const timer = setInterval(() => {
        setActiveTickerIndex((prev) => (prev + 1) % activeTickers.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [activeTickers.length]);

  const handleDismissAd = () => {
    setIsAdDismissed(true);
    sessionStorage.setItem('brandtogether_ad_dismissed', 'true');
  };

  const isMens = normGender === 'mens';
  const isWomens = normGender === 'womens';

  const bannerBg = isMens
    ? 'bg-[#1B2A4A]'
    : isWomens
    ? 'bg-[#7C3D6E]'
    : 'bg-[#2E6B4F]';

  const sectionTitle = isMens
    ? "Men's Branded Fashion"
    : isWomens
    ? "Women's Fashion Editorial"
    : "Children's Brand Collection";

  const heroImage = isMens
    ? "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=80"
    : isWomens
    ? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
    : "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1600&q=80";

  // 3-second auto-sliding brand carousel for hero right side banner
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    if (activeLandingImages.length > 1) {
      const timer = setInterval(() => {
        setHeroSlideIndex((prev) => (prev + 1) % activeLandingImages.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [activeLandingImages.length]);

  const currentSlideImage =
    activeLandingImages[heroSlideIndex]?.imageUrl || heroImage;
  const currentSlideBrand =
    activeLandingImages[heroSlideIndex]?.brandName || sectionTitle;

  return (
    <div className="bg-white max-w-full">
      {/* 1. DISMISSIBLE ROTATING AD BANNER */}
      {!isAdDismissed && activeAds.length > 0 && (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-between shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-hidden text-center sm:text-left">
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold rounded text-[9px] uppercase tracking-wider shrink-0">
              FEATURED AD
            </span>
            <p className="truncate font-medium text-slate-200">
              <strong className="text-white font-bold">{activeAds[activeAdIndex]?.title}: </strong>
              {activeAds[activeAdIndex]?.content}
            </p>
          </div>
          <button
            onClick={handleDismissAd}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all shrink-0 ml-2"
            title="Dismiss ad for this session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. HERO BANNER COLORED STRIP (ONLY BANNER COLORED, REST OF PAGE PURE WHITE) */}
      <div className={`${bannerBg} text-white transition-colors duration-500 py-10 md:py-14 shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="uppercase tracking-wider">{sectionTitle}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
                BUY BRANDED FASHION TOGETHER.<br />
                <span className="text-amber-300">UNLOCK EXCLUSIVE STORE DEALS.</span>
              </h1>

              <p className="text-white/90 text-sm sm:text-base font-normal max-w-xl leading-relaxed">
                Browse verified store offers from top brands in {location.city}. Join or create a shopping group, unlock store details, coordinate visit with members, and save big in-store.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onExploreClick}
                  className="px-6 py-3.5 bg-white text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 shadow-lg transition-all flex items-center gap-2"
                >
                  <span>BROWSE OFFERS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-white/80 border-t border-white/10">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Approved Stores & Brands
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-4 h-4 text-amber-300" /> Group Buying System
                </span>
              </div>
            </div>

            {/* Hero Right Auto-Sliding 3-Sec Brand Carousel */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 group">
                <img
                  key={currentSlideImage}
                  src={currentSlideImage}
                  alt={`${currentSlideBrand} Banner`}
                  className="w-full h-[320px] sm:h-[380px] object-cover object-center animate-fadeIn transition-all duration-700"
                />

                {/* Brand Badge Overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {currentSlideBrand}
                  </span>
                </div>

                {/* Slide Indicators */}
                {activeLandingImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                    {activeLandingImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === heroSlideIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LANDING IMAGES BRAND ROW (Up to 10 admin brand photos per section) */}
      {activeLandingImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>Explore Featured Brands ({sectionTitle})</span>
            </h3>
            {selectedBrandFilter && (
              <button
                onClick={() => setSelectedBrandFilter(null)}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                Clear Brand Filter ({selectedBrandFilter}) ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {activeLandingImages.map((img) => {
              const isSelected = selectedBrandFilter === img.brandName;
              return (
                <button
                  key={img.id}
                  onClick={() => setSelectedBrandFilter(isSelected ? null : img.brandName)}
                  className={`relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border-2 transition-all group ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-400 shadow-md' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.brandName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] font-bold text-white truncate">
                      {img.brandName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. BOTTOM FEEDBACK TICKER */}
      {activeTickers.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 py-2 px-4 text-xs font-medium text-slate-700">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider shrink-0">Live Updates:</span>
            <p className="truncate text-slate-800 font-semibold">
              {activeTickers[activeTickerIndex]?.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
