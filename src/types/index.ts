export type GenderCategory = 'mens' | 'womens' | 'children' | 'men' | 'women';

export type ProductStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'EXPIRED';

export type GroupStatus = 'OPEN' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';

export type OfferTypeLabel =
  | 'Buy 1 Get 1 Free'
  | 'Buy 2 Get 1 Free'
  | 'Flat 20% Off'
  | 'Flat 30% Off'
  | 'Flat 50% Off'
  | 'Up to 70% Off'
  | 'Free Gift on Purchase'
  | 'Exchange Offer'
  | 'Seasonal Sale'
  | 'Clearance Sale'
  | 'BUY_X_GET_Y'
  | 'PERCENTAGE_DISCOUNT'
  | 'FLAT_DISCOUNT'
  | 'COMBO'
  | 'MINIMUM_PURCHASE';

export type UserRole = 'USER' | 'STORE' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  genderPreference: GenderCategory;
  location?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  wishlistProductIds: string[];
  interestedProductIds: string[];
  joinedGroupIds: string[];
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  approvedByAdmin: boolean;
  addedAt: string;
}

export interface StoreProfile {
  id: string;
  name: string; // alias storeName
  storeName?: string;
  ownerUid?: string;
  ownerName: string;
  email: string;
  ownerEmail?: string;
  brandId?: string;
  brandName?: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  lat: number;
  lng: number;
  image?: string;
  logo?: string;
  openingHours?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'WARNING' | 'SUSPENDED' | 'BLOCKED' | 'PENDING' | 'REJECTED';
  approved?: boolean;
  rejected?: boolean;
  rejectionMsg?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  storeId: string;
  storeName: string;
  brandId?: string;
  brandName?: string;
  title: string;
  description: string;
  offerType: OfferTypeLabel;
  type?: OfferTypeLabel;
  gender: GenderCategory;
  images: string[];
  startDate: string;
  endDate: string;
  isVerified?: boolean;
  verifiedAt?: string;
  isActive: boolean;
  active?: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  brandId?: string;
  brandName?: string;
  storeRating: number;
  storeVerified: boolean;
  name: string;
  description: string;
  category: string;
  gender: GenderCategory;
  price: number;
  images: string[];
  offer: Offer;
  status: ProductStatus;
  rejectionReason?: string;
  lat: number;
  lng: number;
  city: string;
  createdAt: string;
  updatedAt: string;
  interestCount: number;
}

export interface GroupMember {
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  joinedAt: string;
  role: 'creator' | 'member';
}

export interface Group {
  id: string;
  offerId?: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  offerTitle: string;
  storeId: string;
  storeName: string;
  brandName?: string;
  gender?: GenderCategory;
  storeCity: string;
  creatorId: string;
  creatorUid?: string;
  creatorName?: string;
  creatorEmail?: string;
  members: GroupMember[];
  maxCapacity: number;
  status: GroupStatus;
  closed?: boolean;
  completed?: boolean;
  storeNotified?: boolean;
  storeNotificationMsg?: string;
  createdAt: string;
  expiresAt: string;
  reopenedAt?: string;
  lat: number;
  lng: number;
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  isSystem?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  uid: string;
  userName: string;
  userAvatar?: string;
  offerId: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}

export interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface Ticker {
  id: string;
  text: string;
  active: boolean;
  order: number;
}

export interface LandingImage {
  id: string;
  brandName: string;
  imageUrl: string;
  gender: GenderCategory;
  order: number;
  active: boolean;
}

export interface InformStoreRequest {
  id: string;
  groupId: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  plannedDate: string;
  plannedTime: string;
  groupSize: number;
  message: string;
  senderUserId: string;
  senderUserName: string;
  createdAt: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'COMPLETED';
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  groupId: string;
  productName: string;
  storeName: string;
  type: 'GROUP_CREATE' | 'GROUP_JOIN';
  amount: number;
  currency: string;
  provider: 'RAZORPAY';
  paymentId: string;
  orderId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt: string;
  verifiedAt?: string;
}

export interface Report {
  id: string;
  type: 'STORE' | 'OFFER' | 'USER' | 'CHAT_MESSAGE';
  targetId: string;
  reporterUserId: string;
  reporterUserName: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface PlatformSettings {
  createGroupFee: number;
  joinGroupFee: number;
  defaultRadiusKm: number;
  groupDurationDays: number;
  autoApproveProducts: boolean;
  storeVerificationRequired: boolean;
}

export interface UserLocation {
  address: string;
  city: string;
  lat: number;
  lng: number;
  isCustom: boolean;
  radiusKm: number;
}
