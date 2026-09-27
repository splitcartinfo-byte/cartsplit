import React from 'react';
import { Product } from '../../types';
import { MapPin, Users, Calendar, Clock, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  openCount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  openCount = 0,
}) => {
  const { theme } = useExperience();

  // Calculate days remaining
  const calculateDaysRemaining = (endDateStr: string): number => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining(product.offer.endDate);
  const isUrgent = daysRemaining > 0 && daysRemaining <= 3;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Card Header Image & Badges */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Offer Type Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white rounded-md shadow-sm">
              {product.offer.type || product.offer.offerType || 'Special Offer'}
            </span>
          </div>

          {/* Days Remaining Badge (Red if <= 3 days) */}
          <div className="absolute top-2 right-2 z-10">
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md flex items-center gap-1 shadow-sm ${
                isUrgent
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-white/90 text-slate-800 backdrop-blur-xs border border-slate-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Ending today'}</span>
            </span>
          </div>

          {/* Active Open Groups Count Badge */}
          {openCount > 0 && (
            <div className="absolute bottom-2 left-2 z-10">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-md shadow-xs flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{openCount} Open Group{openCount > 1 ? 's' : ''}</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Body Info */}
        <div className="p-3 sm:p-4 space-y-2">
          {/* Brand & Store Name */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-widest text-slate-900 text-[11px] truncate">
              {product.brandName || product.offer.brandName || 'Brand Store'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {product.city}
            </span>
          </div>

          {/* Offer Title & Product Name */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-blue-900 transition-colors">
            {product.offer.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span className="font-semibold text-slate-800 text-[11px] truncate">
              {product.storeName}
            </span>
            <span className="font-bold text-slate-900 text-sm">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Card CTA Footer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Group Deal</span>
        </span>

        <button className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-xs ${theme.colors.accent}`}>
          View Deal & Groups →
        </button>
      </div>
    </div>
  );
};
