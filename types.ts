// Types for the application
export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stock: number;
  relatedIds?: string[];
  reviewsList?: Review[];
  returnPolicy?: '7 Days' | 'No Return';
  status?: 'published' | 'draft';
  listingConfirmed?: boolean;
  imageConfirmed?: boolean;
  brand?: string;
  model?: string;
  capacity?: string;
  inputSpec?: string;
  outputSpec?: string;
}

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  photo?: string;
}

export interface BuyingGuide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  updatedAt: string;
  sections: {
    heading: string;
    body: string;
    checklist?: string[];
  }[];
}

export interface StoreSettings {
  businessName: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  businessHours: string;
  shippingSummary: string;
  deliveryTimeline: string;
  returnPolicySummary: string;
  refundTimeline: string;
  cancellationPolicy: string;
  warrantySummary: string;
  registrationDetails: string;
  adsenseEnabled: boolean;
  adsenseGuideSlotId?: string;
  adsenseFaqSlotId?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ReturnInfo {
  status: 'None' | 'Requested' | 'Approved' | 'Rejected' | 'Completed';
  reason?: string;
  date?: string;
  adminNote?: string;
}

export interface Order {
  id: string;
  firebaseId?: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  houseNo: string;
  society: string;
  landmark: string;
  village: string;
  taluka: string;
  district: string;
  pincode: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  date: string;
  status: 'Pending' | 'Received' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD' | 'UPI' | 'Razorpay';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentScreenshot?: string;
  location?: { lat: number; lng: number; address?: string };
  trackingHistory: { status: string; date: string }[];
  estimatedDelivery?: string;
  trackingLink?: string;
  returnInfo?: ReturnInfo;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
