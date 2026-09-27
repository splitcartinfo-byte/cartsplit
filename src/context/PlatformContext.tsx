import React, { createContext, useContext, useState } from 'react';
import {
  Product,
  StoreProfile,
  Group,
  GroupChatMessage,
  InformStoreRequest,
  PaymentTransaction,
  AuditLog,
  PlatformSettings,
  Report,
  Brand,
  Ad,
  Ticker,
  LandingImage,
  Review,
  GenderCategory,
} from '../types';
import {
  MOCK_PRODUCTS,
  MOCK_STORES,
  MOCK_GROUPS,
  MOCK_CHAT_MESSAGES,
  MOCK_INFORM_REQUESTS,
  MOCK_PAYMENTS,
  MOCK_AUDIT_LOGS,
  INITIAL_PLATFORM_SETTINGS,
  MOCK_BRANDS,
  MOCK_ADS,
  MOCK_TICKERS,
  MOCK_LANDING_IMAGES,
  MOCK_REVIEWS,
} from '../data/mockData';

interface PlatformContextType {
  stores: StoreProfile[];
  products: Product[];
  groups: Group[];
  brands: Brand[];
  ads: Ad[];
  tickers: Ticker[];
  landingImages: LandingImage[];
  reviews: Review[];
  chatMessages: Record<string, GroupChatMessage[]>;
  informRequests: InformStoreRequest[];
  payments: PaymentTransaction[];
  auditLogs: AuditLog[];
  settings: PlatformSettings;
  wishlist: string[];
  interestedProducts: Record<string, boolean>;
  selectedBrandFilter: string | null;
  setSelectedBrandFilter: (brand: string | null) => void;

  // Actions - Group System
  createGroup: (productId: string, userId: string, userName: string, userEmail?: string, avatar?: string) => Promise<Group>;
  joinGroup: (groupId: string, userId: string, userName: string, userEmail?: string, avatar?: string) => Promise<boolean>;
  leaveGroup: (groupId: string, userId: string) => void;
  closeGroup: (groupId: string, userId: string) => boolean;
  reopenGroup: (groupId: string, userId: string) => boolean;

  // Chat & Inform
  sendChatMessage: (groupId: string, senderId: string, senderName: string, text: string) => void;
  sendInformStore: (
    groupId: string,
    plannedDate: string,
    plannedTime: string,
    groupSize: number,
    message: string,
    senderUserId: string,
    senderUserName: string
  ) => void;

  // Engagement & Reviews
  toggleWishlist: (productId: string) => void;
  toggleInterest: (productId: string) => void;
  addReview: (offerId: string, userId: string, userName: string, rating: number, text: string, avatar?: string) => void;

  // Store Management
  registerStore: (storeData: Partial<StoreProfile>) => StoreProfile;
  submitProduct: (productData: Partial<Product>) => Product;
  updateOffer: (productId: string, offerData: Partial<Product>) => void;
  toggleOfferVisibility: (productId: string) => void;
  deleteOffer: (productId: string) => void;

  // Admin Management
  approveStore: (storeId: string, adminId: string, adminName: string) => void;
  rejectStore: (storeId: string, reason: string, adminId: string, adminName: string) => void;
  addBrand: (name: string, approvedByAdmin?: boolean) => Brand;
  updateBrand: (brandId: string, name: string) => void;
  approveBrand: (brandId: string) => void;
  deleteBrand: (brandId: string) => void;
  
  // Admin Ads, Tickers, Landing Images
  addAd: (ad: Omit<Ad, 'id' | 'createdAt'>) => void;
  toggleAd: (adId: string) => void;
  deleteAd: (adId: string) => void;
  
  addTicker: (text: string, order: number) => void;
  toggleTicker: (tickerId: string) => void;
  deleteTicker: (tickerId: string) => void;

  addLandingImage: (brandName: string, imageUrl: string, gender: GenderCategory, order: number) => void;
  deleteLandingImage: (id: string) => void;

  approveProduct: (productId: string, adminId: string, adminName: string) => void;
  rejectProduct: (productId: string, reason: string, adminId: string, adminName: string) => void;
  verifyStore: (storeId: string, adminId: string, adminName: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>, adminId: string, adminName: string) => void;
  reportItem: (report: Omit<Report, 'id' | 'status' | 'createdAt'>) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<StoreProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS);
  const [ads, setAds] = useState<Ad[]>([]);
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [landingImages, setLandingImages] = useState<LandingImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, GroupChatMessage[]>>({});
  const [informRequests, setInformRequests] = useState<InformStoreRequest[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [interestedProducts, setInterestedProducts] = useState<Record<string, boolean>>({});
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);

  // Group Create
  const createGroup = async (
    productId: string,
    userId: string,
    userName: string,
    userEmail?: string,
    avatar?: string
  ): Promise<Group> => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) throw new Error('Product offer not found');

    const newGroupId = `grp_${Date.now()}`;
    const now = new Date().toISOString();
    const expiry = new Date(Date.now() + settings.groupDurationDays * 24 * 60 * 60 * 1000).toISOString();

    const newGroup: Group = {
      id: newGroupId,
      offerId: prod.offer.id,
      productId: prod.id,
      productName: prod.name,
      productImage: prod.images[0],
      productPrice: prod.price,
      offerTitle: prod.offer.title,
      storeId: prod.storeId,
      storeName: prod.storeName,
      brandName: prod.brandName || prod.offer.brandName || 'Brand',
      gender: prod.gender,
      storeCity: prod.city,
      creatorId: userId,
      creatorUid: userId,
      creatorName: userName,
      creatorEmail: userEmail,
      maxCapacity: 10, // Default capacity 10 per requirements
      status: 'OPEN',
      closed: false,
      completed: false,
      createdAt: now,
      expiresAt: expiry,
      lat: prod.lat,
      lng: prod.lng,
      members: [
        {
          userId,
          userName,
          userEmail,
          userAvatar: avatar,
          joinedAt: now,
          role: 'creator',
        },
      ],
    };

    const newTxn: PaymentTransaction = {
      id: `pay_${Date.now()}`,
      userId,
      userName,
      groupId: newGroupId,
      productName: prod.name,
      storeName: prod.storeName,
      type: 'GROUP_CREATE',
      amount: settings.createGroupFee,
      currency: 'INR',
      provider: 'RAZORPAY',
      paymentId: `pay_rzp_${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: `order_rzp_${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'success',
      createdAt: now,
      verifiedAt: now,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setPayments((prev) => [newTxn, ...prev]);

    setChatMessages((prev) => ({
      ...prev,
      [newGroupId]: [
        {
          id: `msg_init_${Date.now()}`,
          groupId: newGroupId,
          senderId: 'system',
          senderName: 'System',
          text: `Group created by ${userName}. Offer details unlocked!`,
          isSystem: true,
          createdAt: now,
        },
      ],
    }));

    return newGroup;
  };

  // Group Join
  const joinGroup = async (
    groupId: string,
    userId: string,
    userName: string,
    userEmail?: string,
    avatar?: string
  ): Promise<boolean> => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return false;
    if (group.status !== 'OPEN' || group.closed || group.completed) return false;

    if (group.members.some((m) => m.userId === userId)) return true;

    const now = new Date().toISOString();
    const updatedMembers = [
      ...group.members,
      {
        userId,
        userName,
        userEmail,
        userAvatar: avatar,
        joinedAt: now,
        role: 'member' as const,
      },
    ];

    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, members: updatedMembers } : g))
    );

    const newTxn: PaymentTransaction = {
      id: `pay_${Date.now()}`,
      userId,
      userName,
      groupId: group.id,
      productName: group.productName,
      storeName: group.storeName,
      type: 'GROUP_JOIN',
      amount: settings.joinGroupFee,
      currency: 'INR',
      provider: 'RAZORPAY',
      paymentId: `pay_rzp_${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: `order_rzp_${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'success',
      createdAt: now,
      verifiedAt: now,
    };

    setPayments((prev) => [newTxn, ...prev]);
    sendChatMessage(groupId, 'system', 'System', `${userName} joined the group!`);

    return true;
  };

  // Leave Group
  const leaveGroup = (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;

        const updatedMembers = group.members.filter((m) => m.userId !== userId);
        if (updatedMembers.length === 0) {
          return { ...group, members: [], status: 'CANCELLED' };
        }

        let newCreatorId = group.creatorId;
        if (group.creatorId === userId) {
          updatedMembers[0].role = 'creator';
          newCreatorId = updatedMembers[0].userId;
        }

        return {
          ...group,
          creatorId: newCreatorId,
          creatorUid: newCreatorId,
          members: updatedMembers,
        };
      })
    );

    sendChatMessage(groupId, 'system', 'System', `A member left the group.`);
  };

  // Close Group (Creator action - sets status to Closed & Complete)
  const closeGroup = (groupId: string, userId: string): boolean => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return false;
    if (group.creatorId !== userId && group.creatorUid !== userId) return false;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, status: 'CLOSED', closed: true, completed: true }
          : g
      )
    );

    sendChatMessage(groupId, 'system', 'System', `Group was locked & closed by creator. Status: COMPLETE.`);
    return true;
  };

  // Reopen Group
  const reopenGroup = (groupId: string, userId: string): boolean => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return false;
    if (group.creatorId !== userId && group.creatorUid !== userId) return false;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, status: 'OPEN', closed: false, completed: false, reopenedAt: new Date().toISOString() }
          : g
      )
    );

    sendChatMessage(groupId, 'system', 'System', `Group was reopened by creator.`);
    return true;
  };

  // Group Chat Message
  const sendChatMessage = (
    groupId: string,
    senderId: string,
    senderName: string,
    text: string
  ) => {
    const newMsg: GroupChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      groupId,
      senderId,
      senderName,
      text,
      isSystem: senderId === 'system',
      createdAt: new Date().toISOString(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newMsg],
    }));
  };

  // Inform Store
  const sendInformStore = (
    groupId: string,
    plannedDate: string,
    plannedTime: string,
    groupSize: number,
    message: string,
    senderUserId: string,
    senderUserName: string
  ) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const newReq: InformStoreRequest = {
      id: `inf_${Date.now()}`,
      groupId,
      productId: group.productId,
      productName: group.productName,
      storeId: group.storeId,
      storeName: group.storeName,
      plannedDate,
      plannedTime,
      groupSize,
      message,
      senderUserId,
      senderUserName,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    setInformRequests((prev) => [newReq, ...prev]);

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              storeNotified: true,
              storeNotificationMsg: `Visit planned for ${plannedDate} at ${plannedTime} with ${groupSize} members.`,
            }
          : g
      )
    );

    sendChatMessage(
      groupId,
      'system',
      'System',
      `Store notified for visit on ${plannedDate} at ${plannedTime} (${groupSize} members).`
    );
  };

  // Reviews
  const addReview = (
    offerId: string,
    userId: string,
    userName: string,
    rating: number,
    text: string,
    avatar?: string
  ) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      uid: userId,
      userName,
      userAvatar: avatar,
      offerId,
      rating,
      text,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // Wishlist & Interest
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleInterest = (productId: string) => {
    setInterestedProducts((prev) => {
      const isCurrentlyInterested = !!prev[productId];
      const nextState = !isCurrentlyInterested;

      setProducts((prods) =>
        prods.map((p) =>
          p.id === productId
            ? { ...p, interestCount: Math.max(0, p.interestCount + (nextState ? 1 : -1)) }
            : p
        )
      );

      return { ...prev, [productId]: nextState };
    });
  };

  // Store Registration Flow
  const registerStore = (storeData: Partial<StoreProfile>): StoreProfile => {
    const newStore: StoreProfile = {
      id: `store_${Date.now()}`,
      name: storeData.name || storeData.storeName || 'New Store',
      storeName: storeData.name || storeData.storeName || 'New Store',
      ownerName: storeData.ownerName || 'Store Owner',
      email: storeData.email || 'storeowner@example.com',
      ownerEmail: storeData.email || 'storeowner@example.com',
      brandId: storeData.brandId,
      brandName: storeData.brandName,
      phone: storeData.phone || '+91 90000 00000',
      address: storeData.address || 'Local Street',
      city: storeData.city || 'Bhubaneswar',
      lat: storeData.lat || 20.35,
      lng: storeData.lng || 85.81,
      isVerified: false,
      rating: 5.0,
      reviewCount: 0,
      status: 'PENDING',
      approved: false,
      rejected: false,
      createdAt: new Date().toISOString(),
    };

    setStores((prev) => [newStore, ...prev]);
    return newStore;
  };

  // Store Product / Offer submission
  const submitProduct = (productData: Partial<Product>): Product => {
    const newProd: Product = {
      id: `prod_${Date.now()}`,
      storeId: productData.storeId || 'store_01',
      storeName: productData.storeName || 'Urban Threads & Co.',
      brandId: productData.brandId || 'b_01',
      brandName: productData.brandName || 'Zara',
      storeRating: productData.storeRating || 4.8,
      storeVerified: true,
      name: productData.name || 'New Fashion Item',
      description: productData.description || 'No description provided.',
      category: productData.category || 'Casual',
      gender: productData.gender || 'mens',
      price: productData.price || 1999,
      images: productData.images || [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      ],
      offer: productData.offer || {
        id: `off_${Date.now()}`,
        storeId: productData.storeId || 'store_01',
        storeName: productData.storeName || 'Urban Threads & Co.',
        brandId: productData.brandId || 'b_01',
        brandName: productData.brandName || 'Zara',
        type: 'Buy 1 Get 1 Free',
        title: productData.name || 'SPECIAL STORE OFFER',
        offerType: 'Buy 1 Get 1 Free',
        description: productData.description || 'Exclusive group deal at physical store.',
        gender: productData.gender || 'mens',
        images: productData.images || [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isVerified: true,
        isActive: true,
        active: true,
        createdAt: new Date().toISOString(),
      },
      status: 'APPROVED',
      lat: productData.lat || 20.358,
      lng: productData.lng || 85.818,
      city: productData.city || 'Bhubaneswar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      interestCount: 0,
    };

    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateOffer = (productId: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedData } : p))
    );
  };

  const toggleOfferVisibility = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newActive = !p.offer.isActive;
        return {
          ...p,
          offer: { ...p.offer, isActive: newActive, active: newActive },
        };
      })
    );
  };

  const deleteOffer = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Admin Actions - Store Approval
  const approveStore = (storeId: string, adminId: string, adminName: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? { ...s, status: 'ACTIVE', approved: true, rejected: false, isVerified: true }
          : s
      )
    );

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      adminId,
      adminName,
      action: 'STORE_APPROVED',
      target: `Store ID: ${storeId}`,
      newValue: 'APPROVED',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const rejectStore = (storeId: string, reason: string, adminId: string, adminName: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              status: 'REJECTED',
              approved: false,
              rejected: true,
              rejectionMsg: reason,
              rejectionReason: reason,
            }
          : s
      )
    );

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      adminId,
      adminName,
      action: 'STORE_REJECTED',
      target: `Store ID: ${storeId}`,
      newValue: `REJECTED (${reason})`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Brand management
  const addBrand = (name: string, approvedByAdmin: boolean = true): Brand => {
    const newBrand: Brand = {
      id: `b_${Date.now()}`,
      name,
      approvedByAdmin,
      addedAt: new Date().toISOString(),
    };
    setBrands((prev) => [newBrand, ...prev]);
    return newBrand;
  };

  const updateBrand = (brandId: string, name: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, name } : b))
    );
  };

  const approveBrand = (brandId: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, approvedByAdmin: true } : b))
    );
  };

  const deleteBrand = (brandId: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
  };

  // Ads management
  const addAd = (adData: Omit<Ad, 'id' | 'createdAt'>) => {
    const newAd: Ad = {
      ...adData,
      id: `ad_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAds((prev) => [newAd, ...prev]);
  };

  const toggleAd = (adId: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAd = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
  };

  // Tickers management
  const addTicker = (text: string, order: number) => {
    const newTicker: Ticker = {
      id: `t_${Date.now()}`,
      text,
      order,
      active: true,
    };
    setTickers((prev) => [...prev, newTicker]);
  };

  const toggleTicker = (tickerId: string) => {
    setTickers((prev) =>
      prev.map((t) => (t.id === tickerId ? { ...t, active: !t.active } : t))
    );
  };

  const deleteTicker = (tickerId: string) => {
    setTickers((prev) => prev.filter((t) => t.id !== tickerId));
  };

  // Landing Images management
  const addLandingImage = (brandName: string, imageUrl: string, gender: GenderCategory, order: number) => {
    const newLandingImg: LandingImage = {
      id: `li_${Date.now()}`,
      brandName,
      imageUrl,
      gender,
      order,
      active: true,
    };
    setLandingImages((prev) => [...prev, newLandingImg]);
  };

  const deleteLandingImage = (id: string) => {
    setLandingImages((prev) => prev.filter((li) => li.id !== id));
  };

  // Legacy compatibility helpers
  const approveProduct = (productId: string, adminId: string, adminName: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: 'APPROVED' } : p))
    );
  };

  const rejectProduct = (productId: string, reason: string, adminId: string, adminName: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, status: 'REJECTED', rejectionReason: reason } : p
      )
    );
  };

  const verifyStore = (storeId: string, adminId: string, adminName: string) => {
    approveStore(storeId, adminId, adminName);
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>, adminId: string, adminName: string) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const reportItem = (reportData: Omit<Report, 'id' | 'status' | 'createdAt'>) => {
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      adminId: 'system',
      adminName: 'Report Engine',
      action: `NEW_REPORT_${reportData.type}`,
      target: reportData.targetId,
      details: reportData.reason,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  return (
    <PlatformContext.Provider
      value={{
        stores,
        products,
        groups,
        brands,
        ads,
        tickers,
        landingImages,
        reviews,
        chatMessages,
        informRequests,
        payments,
        auditLogs,
        settings,
        wishlist,
        interestedProducts,
        selectedBrandFilter,
        setSelectedBrandFilter,
        createGroup,
        joinGroup,
        leaveGroup,
        closeGroup,
        reopenGroup,
        sendChatMessage,
        sendInformStore,
        toggleWishlist,
        toggleInterest,
        addReview,
        registerStore,
        submitProduct,
        updateOffer,
        toggleOfferVisibility,
        deleteOffer,
        approveStore,
        rejectStore,
        addBrand,
        updateBrand,
        approveBrand,
        deleteBrand,
        addAd,
        toggleAd,
        deleteAd,
        addTicker,
        toggleTicker,
        deleteTicker,
        addLandingImage,
        deleteLandingImage,
        approveProduct,
        rejectProduct,
        verifyStore,
        updateSettings,
        reportItem,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within PlatformProvider');
  return context;
};
