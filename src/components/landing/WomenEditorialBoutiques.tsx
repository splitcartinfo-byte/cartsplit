import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { usePlatform } from '../../context/PlatformContext';
import { Store, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export const WomenEditorialBoutiques: React.FC<{ onSelectStore?: (storeId: string) => void }> = ({
  onSelectStore,
}) => {
  const { stores } = usePlatform();

  // Filter approved/verified stores
  const activeStores = stores.filter((s) => s.status === 'ACTIVE' || s.isVerified).slice(0, 3);

  return (
    <section className="py-12 bg-white border-y border-stone-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-900">
              Local Boutiques & Labels
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal tracking-tight">
              Boutiques Around You
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
            Discover real physical clothing stores in your area offering exclusive group purchase incentives.
          </p>
        </div>

        {/* Boutiques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeStores.map((store, idx) => (
            <div
              key={store.id}
              className="group relative rounded-xl border border-stone-200/90 bg-stone-50/50 overflow-hidden hover:shadow-xl transition-all duration-500 space-y-3 p-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Store Image */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-stone-200">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/90 text-stone-900 border border-stone-200 shadow-sm flex items-center gap-1">
                    <Store className="w-3 h-3 text-rose-800" />
                    <span>{store.city}</span>
                  </div>
                </div>

                {/* Store Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-stone-950 font-medium tracking-tight">
                      {store.name}
                    </h3>
                    {store.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-700" />}
                  </div>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{store.address}, {store.city}</span>
                  </p>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-rose-900">Active Offers Available</span>
                <span className="text-stone-900 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>DISCOVER</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
