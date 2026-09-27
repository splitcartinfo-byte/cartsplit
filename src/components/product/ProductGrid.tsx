import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useExperience } from '../../context/ExperienceContext';
import { ProductCard } from './ProductCard';
import { Product, GenderCategory } from '../../types';
import { AlertCircle, Tag, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onOpenLocationModal: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery,
  onSelectProduct,
  onOpenLocationModal,
}) => {
  const { products, groups, selectedBrandFilter, setSelectedBrandFilter } = usePlatform();
  const { gender } = useExperience();

  // Normalize gender
  const currentGender: GenderCategory =
    gender === 'men' || gender === 'mens'
      ? 'mens'
      : gender === 'women' || gender === 'womens'
      ? 'womens'
      : 'children';

  // Filter offers
  const filteredProducts = products.filter((prod) => {
    // 1. Status & Active check
    if (prod.status !== 'APPROVED') return false;
    if (!prod.offer || !prod.offer.isActive) return false;

    // 2. Automatic Behavior: Hide expired offers past end date
    const endDate = new Date(prod.offer.endDate).getTime();
    if (isNaN(endDate) || endDate < Date.now()) return false;

    // 3. Gender section match
    const prodGender =
      prod.gender === 'men' || prod.gender === 'mens'
        ? 'mens'
        : prod.gender === 'women' || prod.gender === 'womens'
        ? 'womens'
        : 'children';

    if (prodGender !== currentGender) return false;

    // 4. Selected Brand Landing Image Filter
    if (selectedBrandFilter) {
      const brandMatch =
        (prod.brandName && prod.brandName.toLowerCase() === selectedBrandFilter.toLowerCase()) ||
        (prod.offer.brandName && prod.offer.brandName.toLowerCase() === selectedBrandFilter.toLowerCase());
      if (!brandMatch) return false;
    }

    // 5. Header Search Query (Brand, Location, Store, Category, Title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBrand = (prod.brandName || prod.offer.brandName || '').toLowerCase().includes(q);
      const matchName = prod.name.toLowerCase().includes(q);
      const matchOffer = prod.offer.title.toLowerCase().includes(q);
      const matchStore = prod.storeName.toLowerCase().includes(q);
      const matchCity = (prod.city || '').toLowerCase().includes(q);
      const matchCategory = (prod.category || '').toLowerCase().includes(q);

      return matchBrand || matchName || matchOffer || matchStore || matchCity || matchCategory;
    }

    return true;
  });

  return (
    <section className="bg-white py-8 max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white">
                {currentGender === 'mens' ? "Men's Section" : currentGender === 'womens' ? "Women's Section" : "Children's Section"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredProducts.length} Store Offers Available
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Active Store Offers & Shopping Groups
            </h2>
          </div>

          {/* Active Brand Filter Tag */}
          {selectedBrandFilter && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-950 rounded-full text-xs font-bold">
              <Tag className="w-3.5 h-3.5 text-amber-700" />
              <span>Brand: {selectedBrandFilter}</span>
              <button
                onClick={() => setSelectedBrandFilter(null)}
                className="text-slate-500 hover:text-slate-900 ml-1 font-extrabold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Mobile Offer Grid, 3/4-Column Desktop Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => {
              const openCount = groups.filter(
                (g) => g.productId === product.id && g.status === 'OPEN' && !g.closed
              ).length;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  openCount={openCount}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-3 max-w-xl mx-auto">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No Offers Found {searchQuery ? `matching "${searchQuery}"` : ''}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery
                ? `We couldn't find any approved store offers for "${searchQuery}" in ${currentGender === 'mens' ? "Men's" : currentGender === 'womens' ? "Women's" : "Children's"} section. Try searching for another brand name or location.`
                : 'No active store offers available right now for this section.'}
            </p>
            {(searchQuery || selectedBrandFilter) && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (setSelectedBrandFilter) setSelectedBrandFilter(null);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-sm flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Clear Search & Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
