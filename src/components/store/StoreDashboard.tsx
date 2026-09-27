import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { Product, GenderCategory, OfferTypeLabel } from '../../types';
import {
  Building,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  Bell,
  Users,
  Calendar,
} from 'lucide-react';

export const StoreDashboard: React.FC = () => {
  const { user, store, logout } = useAuth();
  const {
    products,
    stores,
    informRequests,
    submitProduct,
    updateOffer,
    toggleOfferVisibility,
    deleteOffer,
  } = usePlatform();

  // Find store profile
  const currentStore = store || stores.find((s) => s.ownerEmail === user?.email || s.email === user?.email) || stores[0];

  // Store status
  const isApproved = currentStore?.approved || currentStore?.status === 'ACTIVE';
  const isPending = currentStore?.status === 'PENDING';
  const isRejected = currentStore?.rejected || currentStore?.status === 'REJECTED';
  const rejectionReason = currentStore?.rejectionMsg || currentStore?.rejectionReason || 'Store documents did not meet verification guidelines.';

  // Offers belonging to this store
  const storeProducts = products.filter((p) => p.storeId === currentStore?.id || p.storeName === currentStore?.name);

  // Notifications sent to this store by group members
  const storeNotifications = informRequests.filter(
    (r) => r.storeId === currentStore?.id || r.storeName === currentStore?.name
  );

  // Offer Creation/Editing Form State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [offerTitle, setOfferTitle] = useState('');
  const [offerGender, setOfferGender] = useState<GenderCategory>('mens');
  const [offerType, setOfferType] = useState<OfferTypeLabel>('Buy 1 Get 1 Free');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerPrice, setOfferPrice] = useState(1999);
  const [offerStartDate, setOfferStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [offerEndDate, setOfferEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [offerImageUrl, setOfferImageUrl] = useState('');

  const handleSaveOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore) return;

    const img = offerImageUrl.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

    if (editingProductId) {
      updateOffer(editingProductId, {
        name: offerTitle,
        description: offerDesc,
        gender: offerGender,
        price: offerPrice,
        images: [img],
        offer: {
          id: `off_${editingProductId}`,
          storeId: currentStore.id,
          storeName: currentStore.name,
          brandId: currentStore.brandId,
          brandName: currentStore.brandName,
          type: offerType,
          title: offerTitle,
          offerType,
          description: offerDesc,
          gender: offerGender,
          images: [img],
          startDate: new Date(offerStartDate).toISOString(),
          endDate: new Date(offerEndDate).toISOString(),
          isActive: true,
          active: true,
        },
      });
    } else {
      submitProduct({
        storeId: currentStore.id,
        storeName: currentStore.name,
        brandId: currentStore.brandId,
        brandName: currentStore.brandName,
        name: offerTitle,
        description: offerDesc,
        gender: offerGender,
        price: offerPrice,
        images: [img],
        offer: {
          id: `off_${Date.now()}`,
          storeId: currentStore.id,
          storeName: currentStore.name,
          brandId: currentStore.brandId,
          brandName: currentStore.brandName,
          type: offerType,
          title: offerTitle,
          offerType,
          description: offerDesc,
          gender: offerGender,
          images: [img],
          startDate: new Date(offerStartDate).toISOString(),
          endDate: new Date(offerEndDate).toISOString(),
          isActive: true,
          active: true,
        },
      });
    }

    setIsOfferModalOpen(false);
    resetOfferForm();
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setOfferTitle(prod.name);
    setOfferGender(prod.gender);
    setOfferType(prod.offer.type || prod.offer.offerType || 'Buy 1 Get 1 Free');
    setOfferDesc(prod.description);
    setOfferPrice(prod.price);
    setOfferStartDate(prod.offer.startDate.split('T')[0]);
    setOfferEndDate(prod.offer.endDate.split('T')[0]);
    setOfferImageUrl(prod.images[0] || '');
    setIsOfferModalOpen(true);
  };

  const resetOfferForm = () => {
    setEditingProductId(null);
    setOfferTitle('');
    setOfferGender('mens');
    setOfferType('Buy 1 Get 1 Free');
    setOfferDesc('');
    setOfferPrice(1999);
    setOfferStartDate(new Date().toISOString().split('T')[0]);
    setOfferEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setOfferImageUrl('');
  };

  return (
    <div className="min-h-screen bg-white py-8 max-w-full">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Store Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentStore?.name || 'Store Owner Portal'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {currentStore?.brandName ? `Brand Partner: ${currentStore.brandName} • ` : ''}
                {currentStore?.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isApproved && (
              <button
                onClick={() => { resetOfferForm(); setIsOfferModalOpen(true); }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Offer</span>
              </button>
            )}
            <button
              onClick={logout}
              className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STORE APPROVAL STATUS BANNERS */}
        {isPending && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Admin Approval Pending</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Your store application is currently under review by admin. Once approved, your features will unlock and you can create brand offers.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-950">Store Approval Rejected</h4>
              <p className="text-xs text-rose-800 mt-0.5">
                <strong>Rejection Reason: </strong> {rejectionReason}
              </p>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-950">
                Store Approved & Active — All Features Unlocked
              </span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold">
              {storeProducts.length} Active Offers
            </span>
          </div>
        )}

        {/* STORE VISIT NOTIFICATIONS FROM GROUPS */}
        {storeNotifications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-3 p-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Customer Group Visit Notifications ({storeNotifications.length})</span>
            </h3>

            <div className="space-y-3">
              {storeNotifications.map((req) => (
                <div key={req.id} className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-blue-950">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-700" />
                      {req.senderUserName} ({req.groupSize} Members Group)
                    </span>
                    <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {req.plannedDate} @ {req.plannedTime}
                    </span>
                  </div>
                  <p className="text-slate-700 italic">"{req.message}"</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Offer: {req.productName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFERS MANAGEMENT LIST */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Manage Store Offers
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Auto-hides past end date
            </span>
          </div>

          {storeProducts.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {storeProducts.map((prod) => {
                const isHidden = !prod.offer.isActive;
                return (
                  <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-slate-900 text-white rounded">
                            {prod.offer.type || prod.offer.offerType}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 rounded uppercase">
                            {prod.gender}
                          </span>
                          {isHidden && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{prod.name}</h4>
                        <p className="text-xs text-slate-500">
                          Ends: {new Date(prod.offer.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleOfferVisibility(prod.id)}
                        className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          isHidden ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                        }`}
                        title={isHidden ? "Show offer" : "Hide offer"}
                      >
                        {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-all"
                        title="Edit offer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this offer?')) {
                            deleteOffer(prod.id);
                          }
                        }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs transition-all"
                        title="Delete offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No offers created yet. Click <strong>New Offer</strong> to create your first brand discount!
            </div>
          )}
        </div>

        {/* NEW / EDIT OFFER MODAL */}
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto border border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingProductId ? 'Edit Offer' : 'Create New Brand Offer'}
              </h3>

              <form onSubmit={handleSaveOfferSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Sale — Buy 2 Get 1 Free"
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={offerGender}
                      onChange={(e) => setOfferGender(e.target.value as GenderCategory)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="mens">Men's</option>
                      <option value="womens">Women's</option>
                      <option value="children">Children's</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Offer Type</label>
                    <select
                      value={offerType}
                      onChange={(e) => setOfferType(e.target.value as OfferTypeLabel)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Buy 1 Get 1 Free">Buy 1 Get 1 Free</option>
                      <option value="Buy 2 Get 1 Free">Buy 2 Get 1 Free</option>
                      <option value="Flat 20% Off">Flat 20% Off</option>
                      <option value="Flat 30% Off">Flat 30% Off</option>
                      <option value="Flat 50% Off">Flat 50% Off</option>
                      <option value="Up to 70% Off">Up to 70% Off</option>
                      <option value="Free Gift on Purchase">Free Gift on Purchase</option>
                      <option value="Exchange Offer">Exchange Offer</option>
                      <option value="Seasonal Sale">Seasonal Sale</option>
                      <option value="Clearance Sale">Clearance Sale</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the offer rules and group terms..."
                    value={offerDesc}
                    onChange={(e) => setOfferDesc(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={offerStartDate}
                      onChange={(e) => setOfferStartDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={offerEndDate}
                      onChange={(e) => setOfferEndDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={offerImageUrl}
                    onChange={(e) => setOfferImageUrl(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs"
                  >
                    {editingProductId ? 'Update Offer' : 'Save Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
