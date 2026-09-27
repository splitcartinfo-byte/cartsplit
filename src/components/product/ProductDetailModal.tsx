import React, { useState } from 'react';
import { Product, Group, Review } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { useExperience } from '../../context/ExperienceContext';
import {
  X,
  MapPin,
  Users,
  Clock,
  Plus,
  Star,
  MessageSquare,
  ShieldCheck,
  Building,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectGroup: (group: Group) => void;
  onTriggerCreateGroup: (product: Product) => void;
  onTriggerJoinGroup: (group: Group) => void;
  onOpenAuthModal?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectGroup,
  onTriggerCreateGroup,
  onTriggerJoinGroup,
  onOpenAuthModal,
}) => {
  const { groups, reviews, addReview } = usePlatform();
  const { user, isAuthenticated } = useAuth();
  const { theme } = useExperience();

  // 3 Tabs: 'groups' | 'details' | 'reviews'
  const [activeTab, setActiveTab] = useState<'groups' | 'details' | 'reviews'>('groups');
  const [showAllGroups, setShowAllGroups] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  if (!product) return null;

  // Filter groups for this offer/product
  const offerGroups = groups.filter((g) => g.productId === product.id);
  const visibleGroups = showAllGroups ? offerGroups : offerGroups.slice(0, 5);

  // Filter reviews for this offer
  const offerReviews = reviews.filter((r) => r.offerId === product.offer.id || r.offerId === product.id);

  const calculateDaysRemaining = (endDateStr: string): number => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining(product.offer.endDate);

  const handleJoinClick = (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    onTriggerJoinGroup(group);
  };

  const handleCreateGroupClick = () => {
    if (!isAuthenticated) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    onTriggerCreateGroup(product);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    if (!newReviewText.trim()) return;

    addReview(
      product.offer.id,
      user.id,
      user.name,
      newRating,
      newReviewText.trim(),
      user.avatar
    );
    setNewReviewText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Modal Header */}
        <div className="relative p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-md">
              {product.brandName || product.offer.brandName || 'Brand Store'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1">
              {product.offer.title}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>{product.storeName} ({product.city})</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 TABS NAVIGATION BAR */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'groups'
                ? `${theme.colors.borderActive} text-slate-900 bg-slate-50/60`
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Groups ({offerGroups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'details'
                ? `${theme.colors.borderActive} text-slate-900 bg-slate-50/60`
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Details</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews'
                ? `${theme.colors.borderActive} text-slate-900 bg-slate-50/60`
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Reviews ({offerReviews.length})</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {/* TAB 1: GROUPS TAB */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Open Shopping Groups
                </span>
                <button
                  onClick={handleCreateGroupClick}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1 ${theme.colors.accent}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Group</span>
                </button>
              </div>

              {visibleGroups.length > 0 ? (
                <div className="space-y-3">
                  {visibleGroups.map((group) => {
                    const isClosedOrComplete = group.status === 'CLOSED' || group.closed || group.completed;
                    return (
                      <div
                        key={group.id}
                        onClick={() => onSelectGroup(group)}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {group.creatorName || 'Group Creator'}
                            </span>
                            {isClosedOrComplete ? (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded">
                                Complete
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-900 rounded">
                                Open
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {group.members.length} / {group.maxCapacity || 10} members
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              Created recently
                            </span>
                          </div>
                        </div>

                        {!isClosedOrComplete ? (
                          <button
                            onClick={(e) => handleJoinClick(group, e)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all shadow-xs"
                          >
                            Join Group
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <span>View</span> <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Show More Button if > 5 groups */}
                  {offerGroups.length > 5 && (
                    <button
                      onClick={() => setShowAllGroups(!showAllGroups)}
                      className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-all"
                    >
                      {showAllGroups ? 'Show Less' : `Show More Groups (${offerGroups.length - 5} hidden)`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No active groups yet</p>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3">
                    Be the first to create a group for this offer and invite friends or local shoppers!
                  </p>
                  <button
                    onClick={handleCreateGroupClick}
                    className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all ${theme.colors.accent}`}
                  >
                    Create First Group
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">{product.name}</h4>
                <p className="mt-1 text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Offer Type</span>
                  <p className="font-bold text-slate-900">{product.offer.type || product.offer.offerType}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Validity</span>
                  <p className="font-bold text-slate-900">
                    {daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Expires Today'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Store Location</h5>
                <p className="font-medium text-slate-800">{product.storeName}</p>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {product.city}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Review Submission Form */}
              {isAuthenticated ? (
                <form onSubmit={handleAddReviewSubmit} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900">Write a Review</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Share your experience with this offer/store..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg">
                  Please sign in to post a review for this offer.
                </p>
              )}

              {/* Reviews List */}
              {offerReviews.length > 0 ? (
                <div className="space-y-3">
                  {offerReviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{rev.userName}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'text-amber-500 fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500 text-xs">
                  No reviews yet for this offer.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
