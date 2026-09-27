import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { GenderCategory } from '../../types';
import {
  ShieldAlert,
  Building,
  Tag,
  Megaphone,
  Volume2,
  Image,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Edit2,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    stores,
    products,
    groups,
    brands,
    ads,
    tickers,
    landingImages,
    approveStore,
    rejectStore,
    approveBrand,
    addBrand,
    updateBrand,
    deleteBrand,
    addAd,
    toggleAd,
    deleteAd,
    addTicker,
    toggleTicker,
    deleteTicker,
    addLandingImage,
    deleteLandingImage,
  } = usePlatform();

  // Active Tab: 'overview' | 'stores' | 'brands' | 'ads' | 'tickers' | 'landingImages'
  const [activeTab, setActiveTab] = useState<
    'overview' | 'stores' | 'brands' | 'ads' | 'tickers' | 'landingImages'
  >('overview');

  // Store Inspection Modal state
  const [inspectStoreId, setInspectStoreId] = useState<string | null>(null);

  // Reject store modal state
  const [rejectingStoreId, setRejectingStoreId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Brand modal state (Create / Edit)
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [brandNameInput, setBrandNameInput] = useState('');

  // Ad creation state
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [adContent, setAdContent] = useState('');
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');

  // Ticker creation state
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);
  const [tickerText, setTickerText] = useState('');
  const [tickerOrder, setTickerOrder] = useState(1);

  // Landing image state
  const [isLandingModalOpen, setIsLandingModalOpen] = useState(false);
  const [landingBrandName, setLandingBrandName] = useState('');
  const [landingGender, setLandingGender] = useState<GenderCategory>('mens');
  const [landingImageUrl, setLandingImageUrl] = useState('');
  const [landingOrder, setLandingOrder] = useState(1);

  // Overview stats
  const totalStores = stores.length;
  const approvedStores = stores.filter((s) => s.approved || s.status === 'ACTIVE').length;
  const pendingStores = stores.filter((s) => s.status === 'PENDING');
  const totalBrands = brands.length;
  const activeAds = ads.filter((a) => a.active).length;

  const handleApproveStoreClick = (storeId: string) => {
    approveStore(storeId, user?.id || 'admin', user?.name || 'Admin');
  };

  const handleRejectStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingStoreId || !rejectionReason.trim()) return;
    rejectStore(rejectingStoreId, rejectionReason.trim(), user?.id || 'admin', user?.name || 'Admin');
    setRejectingStoreId(null);
    setRejectionReason('');
  };

  const handleCreateAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adContent.trim()) return;
    addAd({
      title: adTitle.trim(),
      content: adContent.trim(),
      linkUrl: adLinkUrl.trim() || '/mens',
      imageUrl: adImageUrl.trim(),
      active: true,
    });
    setIsAdModalOpen(false);
    setAdTitle('');
    setAdContent('');
    setAdLinkUrl('');
    setAdImageUrl('');
  };

  const handleCreateTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerText.trim()) return;
    addTicker(tickerText.trim(), tickerOrder);
    setIsTickerModalOpen(false);
    setTickerText('');
  };

  const handleCreateLandingImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingBrandName.trim() || !landingImageUrl.trim()) return;
    addLandingImage(landingBrandName.trim(), landingImageUrl.trim(), landingGender, landingOrder);
    setIsLandingModalOpen(false);
    setLandingBrandName('');
    setLandingImageUrl('');
  };

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandNameInput.trim()) return;

    if (editingBrandId) {
      updateBrand(editingBrandId, brandNameInput.trim());
    } else {
      addBrand(brandNameInput.trim(), true);
    }
    setIsBrandModalOpen(false);
    setEditingBrandId(null);
    setBrandNameInput('');
  };

  const handleOpenAddBrand = () => {
    setEditingBrandId(null);
    setBrandNameInput('');
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (brandId: string, currentName: string) => {
    setEditingBrandId(brandId);
    setBrandNameInput(currentName);
    setIsBrandModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white py-8 max-w-full">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">BrandTogether Admin Control Panel</h1>
              <p className="text-xs text-slate-300">
                Manage stores, brand approvals, header ads, tickers, & gender landing photos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-full">
              Super Admin Mode
            </span>
          </div>
        </div>

        {/* 6 TABS NAVIGATION */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 p-1.5 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stores' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Stores ({pendingStores.length} Pending)</span>
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'brands' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Brands</span>
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Ads</span>
          </button>
          <button
            onClick={() => setActiveTab('tickers')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'tickers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Tickers</span>
          </button>
          <button
            onClick={() => setActiveTab('landingImages')}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'landingImages' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Landing Photos</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Stores</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalStores}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Approved Stores</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">{approvedStores}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Brands</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalBrands}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Active Ads</span>
                <p className="text-2xl font-black text-amber-950 mt-1">{activeAds}</p>
              </div>
            </div>

            {/* Pending Approvals Alert Box */}
            {pendingStores.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Pending Store Approvals ({pendingStores.length})</span>
                </h3>
                <p className="text-xs text-amber-800">
                  You have pending store registration requests. Review and approve stores to unlock their offer creation.
                </p>
                <button
                  onClick={() => setActiveTab('stores')}
                  className="px-4 py-2 bg-amber-900 text-white text-xs font-bold rounded-lg hover:bg-amber-950 transition-all"
                >
                  Review Pending Stores →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STORES TAB */}
        {activeTab === 'stores' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Store Approvals & Management
              </h3>
            </div>

            <div className="divide-y divide-slate-200">
              {stores.map((s) => {
                const isApp = s.approved || s.status === 'ACTIVE';
                const isRej = s.rejected || s.status === 'REJECTED';
                const isPend = s.status === 'PENDING';

                return (
                  <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{s.name || s.storeName}</h4>
                        {isApp && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">Approved</span>}
                        {isRej && <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded">Rejected</span>}
                        {isPend && <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded">Pending</span>}
                      </div>
                      <p className="text-xs text-slate-500">
                        Owner: {s.ownerName} ({s.email}) • Brand: {s.brandName || 'N/A'} • Address: {s.address}
                      </p>
                      {isRej && s.rejectionMsg && (
                        <p className="text-xs text-rose-700 italic">Rejection Reason: {s.rejectionMsg}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInspectStoreId(s.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Store Data</span>
                      </button>

                      {!isApp && (
                        <button
                          onClick={() => handleApproveStoreClick(s.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {!isRej && (
                        <button
                          onClick={() => setRejectingStoreId(s.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STORE DEEP INSPECTION MODAL */}
        {inspectStoreId && (() => {
          const inspectedStore = stores.find((s) => s.id === inspectStoreId);
          if (!inspectedStore) return null;

          const storeProducts = products.filter((p) => p.storeId === inspectStoreId);
          const nowTime = new Date().getTime();

          const activeOffers = storeProducts.filter((p) => {
            const endMs = new Date(p.offer.endDate).getTime();
            return p.offer.isActive && endMs > nowTime;
          });

          const endedOffers = storeProducts.filter((p) => {
            const endMs = new Date(p.offer.endDate).getTime();
            return !p.offer.isActive || endMs <= nowTime;
          });

          const storeGroups = groups.filter((g) => g.storeId === inspectStoreId);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-auto text-xs space-y-4 max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black uppercase tracking-tight">{inspectedStore.name || inspectedStore.storeName}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        inspectedStore.approved ? 'bg-emerald-400 text-slate-950' : inspectedStore.rejected ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950'
                      }`}>
                        {inspectedStore.approved ? 'Approved' : inspectedStore.rejected ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">Brand Partner: <strong>{inspectedStore.brandName}</strong></p>
                  </div>
                  <button
                    onClick={() => setInspectStoreId(null)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  {/* Store Details Grid */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
                    <p className="flex items-center gap-2 font-semibold">
                      <User className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Owner: {inspectedStore.ownerName || 'Store Manager'}</span>
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Email: {inspectedStore.ownerEmail || inspectedStore.email}</span>
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Phone: {inspectedStore.phone || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>City: {inspectedStore.city || 'Bhubaneswar'}</span>
                    </p>
                    <p className="col-span-1 sm:col-span-2 flex items-start gap-2 font-medium text-slate-700 pt-1 border-t border-slate-200">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>Full Address: {inspectedStore.address}</span>
                    </p>
                  </div>

                  {/* Summary Stats Badges */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Active Offers</span>
                      <p className="text-xl font-black text-emerald-950 mt-0.5">{activeOffers.length}</p>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <span className="text-[10px] font-bold text-rose-800 uppercase">Ended / Hidden Offers</span>
                      <p className="text-xl font-black text-rose-950 mt-0.5">{endedOffers.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <span className="text-[10px] font-bold text-blue-800 uppercase">Shopping Groups Formed</span>
                      <p className="text-xl font-black text-blue-950 mt-0.5">{storeGroups.length}</p>
                    </div>
                  </div>

                  {/* ACTIVE OFFERS SECTION */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active Store Offers ({activeOffers.length})
                    </h4>
                    {activeOffers.length > 0 ? (
                      <div className="space-y-2">
                        {activeOffers.map((p) => (
                          <div key={p.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                            <div>
                              <p className="font-extrabold text-slate-900">{p.offer.title || p.name}</p>
                              <p className="text-slate-600 text-[11px]">{p.offer.description}</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">
                                Category: <strong>{p.gender}</strong> • Price: ₹{p.price} • Valid Until: {new Date(p.offer.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px] uppercase shrink-0">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic bg-slate-50 p-3 rounded-xl border border-slate-200">No active offers listed by this store currently.</p>
                    )}
                  </div>

                  {/* ENDED / HIDDEN OFFERS SECTION */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Ended or Hidden Offers ({endedOffers.length})
                    </h4>
                    {endedOffers.length > 0 ? (
                      <div className="space-y-2">
                        {endedOffers.map((p) => (
                          <div key={p.id} className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-slate-700">{p.offer.title || p.name}</p>
                              <p className="text-slate-500 text-[11px]">{p.offer.description}</p>
                              <p className="text-slate-400 text-[10px] mt-0.5">
                                End Date: {new Date(p.offer.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-300 text-slate-700 font-extrabold rounded-lg text-[10px] uppercase shrink-0">
                              Ended / Expired
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic bg-slate-50 p-3 rounded-xl border border-slate-200">No expired or hidden offers recorded.</p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => setInspectStoreId(null)}
                    className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
                  >
                    Close Store Inspection
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* REJECT MODAL */}
        {rejectingStoreId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <form onSubmit={handleRejectStoreSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Reject Store Application</h3>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter reason for store owner..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingStoreId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BRANDS TAB (With Add & Edit Brand options) */}
        {activeTab === 'brands' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Brand Directory ({brands.length} Total)
                </h3>
                <p className="text-[11px] text-slate-500">Manage Men's, Women's & Kids fashion brands.</p>
              </div>
              <button
                onClick={handleOpenAddBrand}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Brand</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {brands.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{b.name}</p>
                    <span className={`text-[9px] font-semibold uppercase ${b.approvedByAdmin ? 'text-emerald-700' : 'text-amber-700 font-bold'}`}>
                      {b.approvedByAdmin ? 'Approved' : 'Pending Review'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!b.approvedByAdmin && (
                      <button
                        onClick={() => approveBrand(b.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                        title="Approve Brand"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEditBrand(b.id, b.name)}
                      className="p-1 text-slate-700 hover:bg-slate-200 rounded"
                      title="Edit Brand Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBrand(b.id)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD / EDIT BRAND MODAL */}
            {isBrandModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleBrandSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 border border-slate-200 text-xs">
                  <h3 className="text-base font-bold text-slate-900">
                    {editingBrandId ? 'Edit Brand Name' : 'Add New Brand'}
                  </h3>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nike, Zara, Raymond, Biba..."
                      value={brandNameInput}
                      onChange={(e) => setBrandNameInput(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-semibold"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsBrandModalOpen(false)}
                      className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm"
                    >
                      {editingBrandId ? 'Save Changes' : 'Add Brand'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADS TAB */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Header Banner Ads
              </h3>
              <button
                onClick={() => setIsAdModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Create Banner Ad</span>
              </button>
            </div>

            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ad.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{ad.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAd(ad.id)}
                      className={`p-1.5 text-xs font-bold rounded-lg transition-all ${
                        ad.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ad.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteAd(ad.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Ad Modal */}
            {isAdModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleCreateAdSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-3 border border-slate-200 text-xs">
                  <h3 className="text-base font-bold text-slate-900">Create Banner Ad</h3>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ad Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekend Special Group Discount"
                      value={adTitle}
                      onChange={(e) => setAdTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ad Content Text</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Get Flat 50% Off on Zara & Levi's when shopping in groups!"
                      value={adContent}
                      onChange={(e) => setAdContent(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg">Create Ad</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TICKERS TAB */}
        {activeTab === 'tickers' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Bottom Feedback Tickers
              </h3>
              <button
                onClick={() => setIsTickerModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ticker Message</span>
              </button>
            </div>

            <div className="space-y-2">
              {tickers.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-slate-800">#{t.order} • {t.text}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTicker(t.id)}
                      className={`px-2 py-1 text-[10px] font-bold rounded ${
                        t.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t.active ? 'Active' : 'Off'}
                    </button>
                    <button onClick={() => deleteTicker(t.id)} className="p-1 text-rose-600 hover:bg-rose-100 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Ticker Modal */}
            {isTickerModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleCreateTickerSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-3 border border-slate-200 text-xs">
                  <h3 className="text-base font-bold text-slate-900">Add Ticker Message</h3>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ticker Text</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🎉 Rahul saved ₹1,200 at Urban Threads!"
                      value={tickerText}
                      onChange={(e) => setTickerText(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Order Number</label>
                    <input
                      type="number"
                      value={tickerOrder}
                      onChange={(e) => setTickerOrder(parseInt(e.target.value) || 1)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsTickerModalOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg">Save Ticker</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LANDING PHOTOS TAB */}
        {activeTab === 'landingImages' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Section Brand Landing Photos (Max 10 per Section)
              </h3>
              <button
                onClick={() => setIsLandingModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Brand Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {landingImages.map((img) => (
                <div key={img.id} className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group">
                  <img src={img.imageUrl} alt={img.brandName} className="w-full h-24 object-cover" />
                  <div className="p-2 text-[10px] space-y-0.5">
                    <p className="font-bold text-slate-900 truncate">{img.brandName}</p>
                    <span className="uppercase text-slate-500 font-bold block">{img.gender}</span>
                  </div>
                  <button
                    onClick={() => deleteLandingImage(img.id)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Landing Image Modal */}
            {isLandingModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleCreateLandingImageSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-3 border border-slate-200 text-xs">
                  <h3 className="text-base font-bold text-slate-900">Upload Section Brand Photo</h3>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zara, Levi's"
                      value={landingBrandName}
                      onChange={(e) => setLandingBrandName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gender Section</label>
                    <select
                      value={landingGender}
                      onChange={(e) => setLandingGender(e.target.value as GenderCategory)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      <option value="mens">Men's</option>
                      <option value="womens">Women's</option>
                      <option value="children">Children's</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={landingImageUrl}
                      onChange={(e) => setLandingImageUrl(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsLandingModalOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg">Upload Photo</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
