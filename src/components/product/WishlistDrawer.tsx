import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useExperience } from '../../context/ExperienceContext';
import { Product } from '../../types';
import { X, Heart, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { wishlist, products, toggleWishlist } = usePlatform();
  const { theme } = useExperience();

  if (!isOpen) return null;

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-white text-slate-900 border-l border-slate-200 flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="text-base font-extrabold text-slate-900">Saved Wishlist ({savedProducts.length})</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {savedProducts.length > 0 ? (
            savedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all group"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-amber-700 uppercase">{prod.offer.title}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">₹{prod.price.toLocaleString()} • {prod.storeName}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Your wishlist is currently empty.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Save offers you want to keep track of or join groups for later!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white font-extrabold rounded-xl text-xs hover:bg-slate-800"
          >
            Close Wishlist Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
