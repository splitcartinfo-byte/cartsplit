import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WomenEditorialPromotionProps {
  onExploreClick: () => void;
}

export const WomenEditorialPromotion: React.FC<WomenEditorialPromotionProps> = ({ onExploreClick }) => {
  return (
    <section className="py-12 bg-stone-100/70 border-y border-stone-200/80 font-sans max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Promotion Block 1: Occasion Edit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm p-6 lg:p-8">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-900 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/60 inline-block">
              CURATED SELECTION
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal tracking-tight leading-tight">
              The Occasion & Evening Edit
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md">
              Form shopping groups around elegant ethnic wear, party wear dresses, and couture silhouettes from verified fashion houses in your neighborhood.
            </p>
            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white font-sans text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md"
              >
                <span>EXPLORE OCCASION DEALS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/10] overflow-hidden rounded-xl bg-stone-200">
            <img
              src="https.images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80";
              }}
              alt="Occasion fashion editorial edit"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Promotion Block 2: Weekend Edit (Reversed Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm p-6 lg:p-8">
          <div className="lg:col-span-6 order-2 lg:order-1 relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/10] overflow-hidden rounded-xl bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80"
              alt="Weekend fashion editorial edit"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-900 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/60 inline-block">
              CASUAL & WEEKEND
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal tracking-tight leading-tight">
              The Contemporary Casual Edit
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md">
              Discover effortless everyday staples, denim fits, and contemporary designer tops available with group visit benefits at local boutique stores.
            </p>
            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white font-sans text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md"
              >
                <span>DISCOVER CASUAL OFFERS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
