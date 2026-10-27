import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ShoppingCart,
  X,
  Star,
  Search,
  MessageSquare,
  ShieldCheck,
  Plus,
  Lock,
  Package,
  CheckCircle2,
  Home,
  Settings,
  TrendingUp,
  Send,
  Database,
  Trash2,
  Heart,
  Menu,
  User,
  Filter,
  ChevronRight,
  ArrowLeft,
  Pencil,
  MapPin,
  Printer,
  Download,
  LogOut,
  UserCircle,
  Eye,
  CreditCard,
  Camera,
  ThumbsUp,
} from "lucide-react";
import { Product, CartItem, Message, Order, Category, StoreSettings, BuyingGuide } from "./types";
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS, INITIAL_BUYING_GUIDES } from "./constants";
import { getAssistantResponse } from "./services/geminiService";
import {
  saveOrderToFirebase,
  getOrdersFromFirebase,
  updateOrderInFirebase,
  signIn,
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthChanges,
  saveUserProfile,
  getUserProfile,
  getProductsFromFirebase,
  getProductFromFirebase,
  saveProductToFirebase,
  deleteProductFromFirebase,
  deleteOrderFromFirebase,
  saveCategoryToFirebase,
  getCategoriesFromFirebase,
  deleteCategoryFromFirebase,
  addReviewToProduct,
  deleteReviewFromProduct,
  getStoreSettingsFromFirebase,
  getBuyingGuidesFromFirebase,
  saveBuyingGuideToFirebase,
} from "./services/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import {
  isPubliclyVisibleProduct,
  getValidDiscount,
  getVerifiedReviewStats,
  getProductQualityWarnings,
  SafeProductImage,
  parseProductDescription,
} from "./utils/productQuality";
import {
  AboutPage,
  ContactPage,
  ShippingDeliveryPage,
  ReturnsRefundsPage,
  TermsPage,
  PrivacyPolicyPage,
  FaqPage,
  BuyingGuidesPage,
  BuyingGuideDetailPage,
  SiteFooter,
  usePageMeta,
} from "./components/InfoPages";
import { AdminStoreSettingsTab } from "./components/AdminStoreSettings";

const MobileAccountMenu = ({
  user,
  close,
  openOrders,
  openAdmin,
  openProfile,
  logout,
}: any) => (
  <div
    className="fixed inset-0 z-[600] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-500"
    onClick={close}
  >
    <div
      className="bg-white w-full rounded-t-[2rem] shadow-2xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 pb-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-black text-2xl shadow-sm">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h3 className="font-bold text-xl text-slate-900">
            {user.email?.split("@")[0] || "User"}
          </h3>
          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            openProfile();
            close();
          }}
          className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-slate-700 flex items-center gap-4 transition-colors"
        >
          <div className="p-2 bg-white rounded-full shadow-sm">
            <UserCircle size={20} className="text-orange-600" />
          </div>{" "}
          My Profile
        </button>

        <button
          onClick={() => {
            openOrders();
            close();
          }}
          className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-slate-700 flex items-center gap-4 transition-colors"
        >
          <div className="p-2 bg-white rounded-full shadow-sm">
            <Package size={20} className="text-orange-600" />
          </div>{" "}
          My Orders
        </button>

        {user.email === "admin@mobigear.local" && (
          <button
            onClick={() => {
              openAdmin();
              close();
            }}
            className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-slate-700 flex items-center gap-4 transition-colors"
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <ShieldCheck size={20} className="text-orange-600" />
            </div>{" "}
            Admin Panel
          </button>
        )}

        <button
          onClick={() => {
            logout();
            close();
          }}
          className="w-full text-left p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl font-bold text-rose-600 flex items-center gap-4 transition-colors mt-4"
        >
          <div className="p-2 bg-white rounded-full shadow-sm">
            <LogOut size={20} />
          </div>{" "}
          Logout
        </button>
      </div>
    </div>
  </div>
);

const ProfileModal = ({ user, customerInfo, setCustomerInfo, close }: any) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveUserProfile(user.uid, customerInfo);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCircle className="text-orange-600" /> My Profile
          </h2>
          <button
            onClick={close}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
          {success && (
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-sm font-bold text-center mb-4 animate-in fade-in">
              Profile saved successfully!
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              Full Name
            </label>
            <input
              required
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              Mobile Number
            </label>
            <input
              required
              type="tel"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              Address (House No, Society)
            </label>
            <input
              required
              value={customerInfo.society}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, society: e.target.value })
              }
              placeholder="House No, Society..."
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              Village / City
            </label>
            <input
              required
              value={customerInfo.village}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, village: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              Pincode
            </label>
            <input
              required
              value={customerInfo.pincode}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, pincode: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80",
  },
  {
    id: "2",
    name: "Charger",
    image:
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=100&q=80",
  },
  {
    id: "3",
    name: "Cable",
    image:
      "https://images.unsplash.com/photo-1619190165532-6804a1b023f9?w=100&q=80",
  },
  {
    id: "4",
    name: "Battery",
    image:
      "https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=100&q=80",
  },
  {
    id: "5",
    name: "Glass",
    image:
      "https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=100&q=80",
  },
  {
    id: "6",
    name: "Phone Cases",
    image: "https://picsum.photos/seed/phonecase/100/100",
  },
  {
    id: "7",
    name: "Power Banks",
    image: "https://picsum.photos/seed/powerbank/100/100",
  },
  {
    id: "8",
    name: "Headphones",
    image: "https://picsum.photos/seed/headphones/100/100",
  },
  {
    id: "9",
    name: "Bluetooth Speakers",
    image: "https://picsum.photos/seed/speaker/100/100",
  },
  {
    id: "10",
    name: "Phone Stands",
    image: "https://picsum.photos/seed/phonestand/100/100",
  },
];

const MyOrdersModal = ({
  orders,
  close,
  setSelectedOrder,
  initiateReturn,
  handleCancelOrder,
}: any) => {
  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
          <button
            onClick={close}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-bold">No orders found</p>
            </div>
          ) : (
            orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "Cancelled"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">
                      Total Amount
                    </span>
                    <span className="font-black text-orange-600">
                      ₹{order.finalAmount}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={14} /> View Order Details
                  </button>

                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="w-full py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status === "Delivered" &&
                    (!order.returnInfo ||
                      order.returnInfo.status === "None") && (
                      <button
                        onClick={() => initiateReturn(order)}
                        className="w-full py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                      >
                        Return/Refund
                      </button>
                    )}
                  {order.returnInfo && order.returnInfo.status !== "None" && (
                    <div className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 text-center">
                      Return Status: {order.returnInfo.status}
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        <TrendingUp size={14} className="text-orange-600" />{" "}
                        Tracking Status
                      </div>
                      <p className="text-sm font-bold text-slate-800 mb-2">
                        {order.trackingHistory?.[
                          order.trackingHistory.length - 1
                        ]?.status || "Processing"}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>
                          Estimated Delivery: {order.estimatedDelivery}
                        </span>
                        {order.trackingLink && (
                          <a
                            href={order.trackingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline flex items-center gap-1"
                          >
                            Track Link <ChevronRight size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(true);
  const [dbStatus, setDbStatus] = useState<"Online" | "Offline" | "Syncing">(
    "Offline",
  );

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminPassword] = useState("admin123");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");
  const [animateCart, setAnimateCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isMobileAccountMenuOpen, setIsMobileAccountMenuOpen] = useState(false);

  // Derived state for categories - REMOVED as we now have state
  // const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "model",
      text: "નમસ્તે! હું MyshopMyhome એક્સપર્ટ છું. હું તમારી શું મદદ કરી શકું?",
    },
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    houseNo: "",
    society: "",
    landmark: "",
    village: "",
    taluka: "",
    district: "",
    pincode: "",
  });

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false); // test
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] =
    useState<any>(null);

  const submitReturn = async (orderId: string, reason: string) => {
    const order = userOrders.find((o: any) => o.id === orderId);
    if (!order) return;

    const updatedOrder = {
      ...order,
      returnInfo: {
        status: "Requested",
        reason,
        date: new Date().toISOString(),
      },
    };

    try {
      await updateOrderInFirebase(order.firebaseId, updatedOrder);
      setUserOrders(
        userOrders.map((o: any) => (o.id === orderId ? updatedOrder : o)),
      );
      setIsReturnModalOpen(false);
      setSelectedOrderForReturn(null);
    } catch (error) {
      console.error("Error submitting return:", error);
      alert("Failed to submit return request");
    }
  };

  const initiateReturn = (order: any) => {
    setSelectedOrderForReturn(order);
    setIsReturnModalOpen(true);
  };

  const ReturnRequestModal = ({ order, close, submitReturn }: any) => {
    const [reason, setReason] = useState("");
    return (
      <div className="fixed inset-0 z-[700] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-4">Return/Refund Request</h2>
          <p className="text-sm text-slate-600 mb-4">Order #{order.id}</p>
          <textarea
            placeholder="Reason for return"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-xl border mb-4 h-32"
          />
          <div className="flex gap-4">
            <button
              onClick={close}
              className="flex-1 py-3 bg-slate-100 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => submitReturn(order.id, reason)}
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(
    DEFAULT_STORE_SETTINGS,
  );
  const [buyingGuides, setBuyingGuides] = useState<BuyingGuide[]>(
    INITIAL_BUYING_GUIDES,
  );

  usePageMeta(
    "MyshopMyhome.shop — Mobile Accessories, Chargers, Audio & Smart Gadgets",
    "Shop verified mobile chargers, fast charging cables, earbuds, neckbands, power banks, and protective cases at MyshopMyhome.shop.",
  );

  const handleCancelOrder = async (order: any) => {
    if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      try {
        if (order.firebaseId) {
          await updateOrderInFirebase(order.firebaseId, {
            status: "Cancelled",
          });
          setUserOrders(
            userOrders.map((o: any) =>
              o.id === order.id ? { ...o, status: "Cancelled" } : o,
            ),
          );
          alert("Order cancelled successfully");
        } else {
          alert("Cannot cancel: Order ID not found in database.");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Cancellation failed");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsConnecting(true);
        try {
          const [orders, profile] = await Promise.all([
            getOrdersFromFirebase(currentUser.uid),
            getUserProfile(currentUser.uid),
          ]);
          setUserOrders(orders);
          if (profile) {
            setCustomerInfo((prev) => ({ ...prev, ...profile }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsConnecting(false);
        }
      } else {
        setUserOrders([]);
        setCustomerInfo({
          name: "",
          phone: "",
          houseNo: "",
          society: "",
          landmark: "",
          village: "",
          taluka: "",
          district: "",
          pincode: "",
        });
        setIsConnecting(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Removed the hardcoded timeout useEffect

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          fetchedOrders,
          fetchedProducts,
          fetchedCategories,
          fetchedSettings,
          fetchedGuides,
        ] = await Promise.all([
          getOrdersFromFirebase(),
          getProductsFromFirebase(),
          getCategoriesFromFirebase(),
          getStoreSettingsFromFirebase(),
          getBuyingGuidesFromFirebase(),
        ]);
        setOrders(fetchedOrders);

        if (fetchedSettings) {
          setStoreSettings((prev) => ({ ...prev, ...fetchedSettings }));
        }

        if (fetchedGuides && fetchedGuides.length > 0) {
          setBuyingGuides(fetchedGuides);
        } else {
          for (const g of INITIAL_BUYING_GUIDES) {
            await saveBuyingGuideToFirebase(g);
          }
          setBuyingGuides(INITIAL_BUYING_GUIDES);
        }

        // Seeding logic for products
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else if (fetchedProducts && fetchedProducts.length === 0) {
          console.log("Seeding database with initial products...");
          for (const p of INITIAL_PRODUCTS) {
            await saveProductToFirebase(p);
          }
          setProducts(INITIAL_PRODUCTS);
        }

        // Seeding logic for categories
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        } else if (fetchedCategories && fetchedCategories.length === 0) {
          console.log("Seeding database with initial categories...");
          for (const c of INITIAL_CATEGORIES) {
            await saveCategoryToFirebase(c);
          }
          setCategories(INITIAL_CATEGORIES);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const addToCart = (p: Product, qty: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === p.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === p.id ? { ...item, quantity: item.quantity + qty } : item,
        );
      }
      return [...prevCart, { ...p, quantity: qty }];
    });
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 400);
  };

  const updateCartQuantity = (idx: number, delta: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const newQty = newCart[idx].quantity + delta;
      if (newQty > 0) {
        newCart[idx] = { ...newCart[idx], quantity: newQty };
      } else {
        newCart.splice(idx, 1);
      }
      return newCart;
    });
  };

  const removeFromCart = (idx: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart.splice(idx, 1);
      return newCart;
    });
  };

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!isPubliclyVisibleProduct(p)) return false;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRazorpayPayment = async (
    amount: number,
    orderId: string,
    customerInfo: any,
  ) => {
    try {
      // Check if Razorpay script is loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        const scriptLoaded = new Promise((resolve) => {
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
        });
        document.body.appendChild(script);
        const success = await scriptLoaded;
        if (!success) {
          throw new Error(
            "Razorpay SDK failed to load. Please check your internet connection.",
          );
        }
      }

      const apiUrl = "/api/create-razorpay-order";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR", receipt: orderId }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `URL: ${apiUrl} | Status: ${response.status}`;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const orderData = await response.json();

      const options = {
        key: orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Tprh049e7AQJkZ", // Public Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MyshopMyhome.shop",
        description: `Order #${orderId}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          // Payment successful
          const finalOrder: Order = {
            id: orderId,
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            houseNo: customerInfo.houseNo || "",
            society: customerInfo.society || "",
            landmark: customerInfo.landmark || "",
            village: customerInfo.village || "",
            taluka: customerInfo.taluka || "",
            district: customerInfo.district || "",
            pincode: customerInfo.pincode || "",
            address: "",
            items: cart.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
            })),
            totalAmount: amount,
            discountAmount: 0,
            finalAmount: amount,
            date: new Date().toLocaleDateString("gu-IN"),
            status: "Pending",
            paymentMethod: "Razorpay",
            razorpayOrderId: orderData.id,
            razorpayPaymentId: response.razorpay_payment_id,
            trackingHistory: [
              {
                status: "ઓર્ડર મળ્યો છે (Paid)",
                date: new Date().toLocaleString(),
              },
            ],
            estimatedDelivery: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000,
            ).toLocaleDateString("gu-IN"),
          };

          setDbStatus("Syncing");
          try {
            const firebaseId = await saveOrderToFirebase(finalOrder);
            if (user) await saveUserProfile(user.uid, customerInfo);
            setOrders([{ ...finalOrder, firebaseId }, ...orders]);
            setDbStatus("Online");
            setLastOrderId(orderId);
            setCart([]);
            setIsCheckoutFormOpen(false);
            setIsCartOpen(false);
            setIsSuccessModalOpen(true);
          } catch (error) {
            console.error("Error saving order after payment:", error);
            alert(
              "Payment successful but order saving failed. Please contact support.",
            );
          }
        },
        prefill: {
          name: customerInfo.name,
          contact: customerInfo.phone,
        },
        theme: { color: "#ea580c" },
      };

      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not found. Please refresh the page.");
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Razorpay Error:", error);
      alert(`Razorpay Error: ${error.message}`);
    }
  };

  const handleCheckout = async (
    e: React.FormEvent,
    selectedPaymentMethod?: string,
  ) => {
    e.preventDefault();
    const orderId =
      "MG-" + Math.random().toString(36).substr(2, 5).toUpperCase();
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    const finalPaymentMethod =
      selectedPaymentMethod || customerInfo.paymentMethod || "COD";

    if (finalPaymentMethod === "Razorpay" || finalPaymentMethod === "UPI") {
      await handleRazorpayPayment(subtotal, orderId, {
        ...customerInfo,
        paymentMethod: "Razorpay",
      });
      return;
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    const newOrder: Order = {
      id: orderId,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      houseNo: customerInfo.houseNo,
      society: customerInfo.society,
      landmark: customerInfo.landmark,
      village: customerInfo.village,
      taluka: customerInfo.taluka,
      district: customerInfo.district,
      pincode: customerInfo.pincode,
      address: "",
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount: subtotal,
      discountAmount: 0,
      finalAmount: subtotal,
      date: new Date().toLocaleDateString("gu-IN"),
      status: "Pending",
      paymentMethod: finalPaymentMethod as any,
      location: customerInfo.location,
      trackingHistory: [
        { status: "ઓર્ડર મળ્યો છે", date: new Date().toLocaleString() },
      ],
      estimatedDelivery: estimatedDate.toLocaleDateString("gu-IN"),
    };

    setDbStatus("Syncing");

    saveOrderToFirebase(newOrder)
      .then(async (firebaseId) => {
        if (user) {
          await saveUserProfile(user.uid, customerInfo);
        }
        setOrders([{ ...newOrder, firebaseId }, ...orders]);
        setDbStatus("Online");
        setLastOrderId(orderId);
        setCart([]);
        setIsCheckoutFormOpen(false);
        setIsCartOpen(false);
        setIsSuccessModalOpen(true);
      })
      .catch((error) => {
        console.error("Error saving order:", error);
        setDbStatus("Offline");
        alert("ઓર્ડર સેવ કરવામાં ભૂલ થઈ છે. કૃપા કરીને ફરી પ્રયાસ કરો.");
      });
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Home
              size={32}
              className="text-blue-600 animate-bounce"
              fill="currentColor"
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Myshop<span className="text-orange-600">Myhome</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm tracking-[0.3em] uppercase animate-pulse">
            Loading Experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-24 md:pb-0 overflow-x-hidden">
      <nav className="sticky top-0 z-40 bg-blue-600 shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <div className="h-14 md:h-16 flex justify-between items-center gap-2">
            <div
              className="flex items-center gap-2 cursor-pointer group min-w-fit"
              onClick={() => {
                navigate("/");
                setIsAdminOpen(false);
                setIsWishlistOpen(false);
                setIsCartOpen(false);
              }}
            >
              <div className="bg-white p-1.5 md:p-2 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Home size={20} className="text-blue-600 md:w-6 md:h-6" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-base md:text-2xl tracking-tight">
                  Myshop<span className="text-orange-400">Myhome</span>
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-blue-100 opacity-80 uppercase tracking-widest hidden sm:inline">
                  Premium Store
                </span>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-grow max-w-2xl relative group px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-sm text-slate-900 p-2.5 pl-4 pr-10 rounded-[2px] shadow-sm outline-none focus:ring-0"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600"
                  size={20}
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 md:gap-8 min-w-fit">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 font-bold text-white hover:text-slate-100">
                    <User size={20} />
                    <span>{user.email?.split("@")[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                    >
                      <UserCircle size={16} /> My Profile
                    </button>
                    <button
                      onClick={() => setIsMyOrdersOpen(true)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                    >
                      <Package size={16} /> My Orders
                    </button>
                    {user.email === "admin@mobigear.local" && (
                      <button
                        onClick={() => setIsAdminOpen(true)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                      >
                        <ShieldCheck size={16} /> Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsAdminOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2 border-t"
                    >
                      <User size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-white text-[#2874f0] px-8 py-1 font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors rounded-[2px]"
                >
                  Login
                </button>
              )}

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="text-white font-bold text-base flex items-center gap-1 hover:text-slate-100"
              >
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="bg-[#ffe500] text-[#2874f0] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="text-white font-bold text-base flex items-center gap-2 hover:text-slate-100"
              >
                <ShoppingCart size={20} />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="bg-[#ffe500] text-[#2874f0] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="bg-white/10 text-white px-4 py-1.5 font-bold text-sm hover:bg-white/20 transition-colors rounded-[2px] flex items-center gap-2 border border-white/20"
              >
                <Download size={16} /> Install App
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2 text-white">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart size={20} className={wishlist.length > 0 ? "fill-orange-400 text-orange-400" : ""} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-400 text-slate-900 text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Cart"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Second Row Search Bar */}
          <div className="pb-2.5 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs text-slate-900 p-2 pl-3 pr-8 rounded-[4px] shadow-sm outline-none"
              />
              <Search
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-600"
                size={16}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              isAdminOpen ? (
                <AdminPanel
                  orders={orders}
                  setOrders={setOrders}
                  products={products}
                  setProducts={setProducts}
                  categories={categories}
                  setCategories={setCategories}
                  close={() => setIsAdminOpen(false)}
                  adminPassword={adminPassword}
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                  storeSettings={storeSettings}
                  setStoreSettings={setStoreSettings}
                  buyingGuides={buyingGuides}
                  setBuyingGuides={setBuyingGuides}
                />
              ) : isWishlistOpen ? (
                <WishlistView
                  wishlist={wishlist}
                  products={products}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                  close={() => setIsWishlistOpen(false)}
                />
              ) : (
                <div className="animate-in fade-in duration-700">
                  {/* Categories Strip */}
                  <div className="bg-white shadow-sm mb-4">
                    <div className="max-w-7xl mx-auto px-2 py-3 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar justify-start md:justify-center">
                      <button
                        onClick={() => setActiveCategory("All")}
                        className={`flex flex-col items-center gap-2 min-w-[64px] group transition-all ${activeCategory === "All" ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-100 overflow-hidden p-2 group-hover:scale-105 transition-transform flex items-center justify-center">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                            alt="All"
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <span
                          className={`text-xs md:text-sm font-bold ${activeCategory === "All" ? "text-[#2874f0]" : "text-slate-700"}`}
                        >
                          Top Offers
                        </span>
                      </button>
                      {categories.map((cat, idx) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.name)}
                          className={`flex flex-col items-center gap-2 min-w-[64px] group transition-all ${activeCategory === cat.name ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                        >
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-100 overflow-hidden p-0 group-hover:scale-105 transition-transform">
                            <SafeProductImage
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                              fallbackClassName="w-full h-full"
                            />
                          </div>
                          <span
                            className={`text-xs md:text-sm font-bold ${activeCategory === cat.name ? "text-[#2874f0]" : "text-slate-700"}`}
                          >
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="max-w-7xl mx-auto px-2 md:px-4 pb-16">
                    <div className="bg-white p-3 md:p-4 shadow-sm rounded-sm mb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b pb-3">
                        <h3 className="text-lg md:text-xl font-bold text-slate-800">
                          Best of Electronics
                        </h3>
                        <Link
                          to="/buying-guides"
                          className="text-[11px] md:text-xs font-bold text-blue-600 hover:text-orange-600 transition-colors"
                        >
                          Read Buying Guides →
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {filteredProducts.map((p) => {
                          const reviewStats = getVerifiedReviewStats(p);
                          const discountInfo = getValidDiscount(
                            p.price,
                            p.oldPrice,
                          );
                          return (
                            <div
                              key={p.id}
                              onClick={() => navigate(`/product/${p.id}`)}
                              className="group relative bg-white hover:shadow-xl transition-shadow duration-300 p-2.5 md:p-4 border border-slate-100 hover:border-slate-200 rounded-sm cursor-pointer flex flex-col items-center text-center"
                            >
                              {/* Wishlist Heart */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(p.id);
                                }}
                                className="absolute top-2 right-2 z-10 p-1.5 text-slate-300 hover:text-[#ff4343] transition-colors"
                              >
                                <Heart
                                  size={18}
                                  className={
                                    wishlist.includes(p.id)
                                      ? "fill-[#ff4343] text-[#ff4343]"
                                      : ""
                                  }
                                />
                              </button>

                              <div className="h-24 md:h-40 w-full mb-2 flex items-center justify-center relative overflow-hidden">
                                <SafeProductImage
                                  src={p.image}
                                  alt={p.name}
                                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                  fallbackClassName="w-full h-full rounded-lg"
                                />
                              </div>

                              <h3 className="font-medium text-slate-900 text-xs md:text-sm mb-1.5 line-clamp-2 h-8 md:h-10 hover:text-[#2874f0]">
                                {p.name}
                              </h3>

                              <div className="mt-auto pt-1 w-full flex flex-col items-center">
                                {reviewStats.hasVerifiedReviews && (
                                  <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <span className="bg-[#388e3c] text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] flex items-center gap-0.5">
                                      {reviewStats.averageRating}{" "}
                                      <Star size={8} fill="white" />
                                    </span>
                                    <span className="text-slate-400 text-[10px] md:text-xs">
                                      ({reviewStats.reviewCount})
                                    </span>
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1.5">
                                  <span className="text-sm md:text-base font-bold text-slate-900">
                                    ₹{p.price}
                                  </span>
                                  {discountInfo.isValidDiscount && (
                                    <>
                                      <span className="text-[11px] md:text-xs text-slate-400 line-through">
                                        ₹{p.oldPrice}
                                      </span>
                                      <span className="text-[11px] md:text-xs font-bold text-[#388e3c]">
                                        {discountInfo.discountPercent}% off
                                      </span>
                                    </>
                                  )}
                                </div>

                                <div className="mb-2.5">
                                  <span
                                    className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full ${p.returnPolicy === "No Return" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
                                  >
                                    {p.returnPolicy === "No Return"
                                      ? "No Return"
                                      : "7 Days Return"}
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p);
                                  }}
                                  className="w-full py-2 bg-[#ff9f00] text-white text-xs md:text-sm font-bold uppercase rounded-[2px] hover:shadow-md transition-shadow active:scale-95"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-20 bg-white shadow-sm">
                        <p className="font-bold text-lg">No products found</p>
                        <p className="text-slate-500">
                          Try searching for something else!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductPage
                products={products}
                setProducts={setProducts}
                addToCart={addToCart}
                setIsCartOpen={setIsCartOpen}
                storeSettings={storeSettings}
              />
            }
          />
          <Route
            path="/about"
            element={<AboutPage settings={storeSettings} />}
          />
          <Route
            path="/contact"
            element={<ContactPage settings={storeSettings} />}
          />
          <Route
            path="/shipping-delivery"
            element={<ShippingDeliveryPage settings={storeSettings} />}
          />
          <Route
            path="/returns-refunds"
            element={<ReturnsRefundsPage settings={storeSettings} />}
          />
          <Route
            path="/terms"
            element={<TermsPage settings={storeSettings} />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicyPage settings={storeSettings} />}
          />
          <Route
            path="/faq"
            element={<FaqPage settings={storeSettings} />}
          />
          <Route
            path="/buying-guides"
            element={
              <BuyingGuidesPage
                guides={buyingGuides}
                settings={storeSettings}
              />
            }
          />
          <Route
            path="/buying-guides/:slug"
            element={
              <BuyingGuideDetailPage
                guides={buyingGuides}
                settings={storeSettings}
              />
            }
          />
        </Routes>
      </main>

      <SiteFooter settings={storeSettings} />

      {/* Floating Chat Button (Desktop) */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsChatOpen(true)}
          className="p-4 bg-white text-[#2874f0] rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all flex items-center gap-2 font-bold"
        >
          <MessageSquare size={24} />
          <span className="pr-2">Chat</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => {
            navigate("/");
            setIsAdminOpen(false);
            setIsWishlistOpen(false);
          }}
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${!isAdminOpen && !isWishlistOpen ? "text-[#2874f0]" : "text-slate-500"}`}
        >
          <Home
            size={20}
            strokeWidth={!isAdminOpen && !isWishlistOpen ? 2.5 : 2}
          />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex-1 py-3 flex flex-col items-center gap-1 text-slate-500">
          <Package size={20} />
          <span className="text-[10px] font-medium">Categories</span>
        </button>
        <button
          onClick={() => setIsWishlistOpen(true)}
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${isWishlistOpen ? "text-[#2874f0]" : "text-slate-500"}`}
        >
          <Heart size={20} strokeWidth={isWishlistOpen ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Wishlist</span>
        </button>
        <button
          onClick={() =>
            user ? setIsMobileAccountMenuOpen(true) : setIsLoginOpen(true)
          }
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${isMobileAccountMenuOpen ? "text-[#2874f0]" : "text-slate-500"}`}
        >
          <User size={20} strokeWidth={isMobileAccountMenuOpen ? 2.5 : 2} />
          <span className="text-[10px] font-medium">
            {user ? "Account" : "Login"}
          </span>
        </button>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 py-3 flex flex-col items-center gap-1 text-slate-500 relative"
        >
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute top-2 right-4 bg-[#d32f2f] text-white text-[9px] font-bold h-3 w-3 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </div>

      {isChatOpen && (
        <AIChatModal
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          close={() => setIsChatOpen(false)}
        />
      )}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          close={() => setIsCartOpen(false)}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          checkout={() => {
            if (!user) {
              setPendingCheckout(true);
              setIsLoginOpen(true);
            } else {
              setIsCheckoutFormOpen(true);
            }
          }}
        />
      )}
      {isCheckoutFormOpen && (
        <CheckoutForm
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          handleCheckout={handleCheckout}
          close={() => setIsCheckoutFormOpen(false)}
        />
      )}
      {isSuccessModalOpen && (
        <SuccessModal
          orderId={lastOrderId}
          close={() => setIsSuccessModalOpen(false)}
        />
      )}
      {isLoginOpen && (
        <LoginModal
          close={() => setIsLoginOpen(false)}
          onLogin={() => {
            setIsLoginOpen(false);
            if (pendingCheckout) {
              setIsCheckoutFormOpen(true);
              setPendingCheckout(false);
            }
          }}
        />
      )}
      {isMyOrdersOpen && (
        <MyOrdersModal
          orders={userOrders}
          close={() => setIsMyOrdersOpen(false)}
          setSelectedOrder={setSelectedOrder}
          initiateReturn={initiateReturn}
          handleCancelOrder={handleCancelOrder}
        />
      )}
      {isReturnModalOpen && selectedOrderForReturn && (
        <ReturnRequestModal
          order={selectedOrderForReturn}
          close={() => setIsReturnModalOpen(false)}
          submitReturn={submitReturn}
        />
      )}
      {selectedOrder && !isAdminOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          close={() => setSelectedOrder(null)}
        />
      )}
      {isProfileOpen && user && (
        <ProfileModal
          user={user}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          close={() => setIsProfileOpen(false)}
        />
      )}
      {isInstallModalOpen && (
        <InstallModal close={() => setIsInstallModalOpen(false)} />
      )}
      {isMobileAccountMenuOpen && user && (
        <MobileAccountMenu
          user={user}
          close={() => setIsMobileAccountMenuOpen(false)}
          openOrders={() => setIsMyOrdersOpen(true)}
          openAdmin={() => setIsAdminOpen(true)}
          openProfile={() => setIsProfileOpen(true)}
          logout={() => {
            logoutUser();
            setIsAdminOpen(false);
          }}
        />
      )}
    </div>
  );
};

const InstallModal = ({ close }: any) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        close();
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative p-6 text-center">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Download size={40} className="text-orange-600" />
        </div>

        {!showInstructions ? (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Install MyshopMyhome App
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              Get the best shopping experience by installing our app on your
              device.
            </p>

            <button
              onClick={handleInstall}
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Download size={18} /> Install Now
            </button>
            <p className="mt-4 text-xs text-slate-400">
              Works on Android & iOS
            </p>
            <button
              onClick={() => setShowInstructions(true)}
              className="mt-2 text-xs text-orange-600 font-bold underline"
            >
              Having trouble? See manual instructions
            </button>
          </>
        ) : (
          <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="font-bold text-lg text-slate-900 mb-3">
              How to Install Manually:
            </h3>
            <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl mb-4">
              <div className="flex gap-3">
                <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs shrink-0">
                  1
                </span>
                <p>
                  Tap the browser menu (three dots <b>⋮</b> or Share icon).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs shrink-0">
                  2
                </span>
                <p>
                  Scroll down and select <b>"Add to Home Screen"</b>.
                </p>
              </div>
              <div className="bg-amber-50 text-amber-800 p-2 rounded-lg text-xs border border-amber-100 mt-2">
                <b>Note:</b> If you see "Unsafe app blocked", please use{" "}
                <b>"Add to Home Screen"</b> instead of "Install App".
              </div>
            </div>
            <button
              onClick={close}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Got it, thanks!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginModal = ({ close, onLogin }: any) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await registerUser(mobile, password);
      } else {
        await loginUser(mobile, password);
      }
      onLogin();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This username is already taken. Please Login instead.");
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError(
          "Incorrect password or user not found. Please Sign Up if you are new.",
        );
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Email/Password login is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.",
        );
      } else {
        setError(err.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 mb-6">
            {isRegistering
              ? "Sign up to start shopping"
              : "Login to access your orders"}
          </p>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Mobile Number / Username
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                placeholder="Enter mobile number or 'admin'"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-bold text-orange-600 hover:underline"
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium">
                Admin Access: Use mobile 'admin'
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({
  orders,
  setOrders,
  products,
  setProducts,
  categories,
  setCategories,
  close,
  adminPassword,
  selectedOrder,
  setSelectedOrder,
  storeSettings,
  setStoreSettings,
  buyingGuides,
  setBuyingGuides,
}: any) => {
  const [passInput, setPassInput] = useState("");
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "orders" | "products" | "categories" | "returns" | "reviews" | "settings"
  >("orders");
  const [brokenImageMap, setBrokenImageMap] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedReviewProduct, setSelectedReviewProduct] = useState("");
  const [isAddAdminReviewOpen, setIsAddAdminReviewOpen] = useState(false);
  const [adminReviewPhoto, setAdminReviewPhoto] = useState("");
  const adminReviewFileRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    oldPrice: "",
    image: "",
    images: [] as string[],
    rating: "0",
    reviews: "0",
    description: "",
    category: "Accessories",
    returnPolicy: "7 Days",
    status: "published" as "published" | "draft",
    listingConfirmed: false,
    imageConfirmed: false,
    brand: "",
    model: "",
    capacity: "",
    inputSpec: "",
    outputSpec: "",
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!auth)
    return (
      <div className="max-w-md mx-auto my-32 p-10 bg-white rounded-3xl shadow-xl text-center border animate-in zoom-in duration-300">
        <div className="bg-slate-100 text-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-8">Admin Access</h2>
        <input
          type="password"
          placeholder="પાસવર્ડ"
          value={passInput}
          onChange={(e) => setPassInput(e.target.value)}
          className="w-full p-4 bg-slate-50 rounded-xl border mb-6 text-center text-xl font-bold outline-none focus:border-orange-600"
        />
        <button
          onClick={() =>
            passInput === adminPassword ? setAuth(true) : alert("ખોટો પાસવર્ડ")
          }
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95"
        >
          લોગિન
        </button>
        <button
          onClick={close}
          className="w-full text-slate-400 font-bold mt-4 hover:text-slate-600 transition-colors"
        >
          પાછા જાઓ
        </button>
      </div>
    );

  const updateReturnStatus = async (orderId: string, status: string) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (!order) return;

    const updatedOrder = {
      ...order,
      returnInfo: {
        ...order.returnInfo,
        status: status,
      },
    };

    try {
      await updateOrderInFirebase(order.firebaseId, updatedOrder);
      setOrders(orders.map((o: any) => (o.id === orderId ? updatedOrder : o)));
    } catch (error) {
      console.error("Error updating return status:", error);
      alert("Failed to update return status");
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    const category: Category = editingCategory
      ? {
          ...editingCategory,
          name: newCategory.name,
          image: newCategory.image || editingCategory.image,
        }
      : {
          id: String(Date.now()),
          name: newCategory.name,
          image:
            newCategory.image ||
            `https://picsum.photos/seed/${Date.now()}/100/100`,
        };

    try {
      await saveCategoryToFirebase(category);
      if (editingCategory) {
        setCategories(
          categories.map((c: any) =>
            c.id === editingCategory.id ? category : c,
          ),
        );
        setEditingCategory(null);
      } else {
        setCategories([...categories, category]);
      }
      setNewCategory({ name: "", image: "" });
      setIsAddCategoryOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryFromFirebase(categoryId);
        setCategories(categories.filter((c: any) => c.id !== categoryId));
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Delete failed");
      }
    }
  };

  const handleCategoryImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditCategory = (c: any) => {
    setEditingCategory(c);
    setNewCategory({ name: c.name, image: c.image });
    setIsAddCategoryOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Please enter product name and price");
      return;
    }

    const numericPrice = Number(newProduct.price);
    const numericOldPrice = newProduct.oldPrice
      ? Number(newProduct.oldPrice)
      : undefined;

    if (
      numericOldPrice !== undefined &&
      (!Number.isFinite(numericOldPrice) || numericOldPrice <= numericPrice)
    ) {
      alert(
        "Old/Compare-at price must be greater than the current sale price, or left empty.",
      );
      return;
    }

    setIsSaving(true);
    const currentImages = Array.isArray(newProduct.images)
      ? newProduct.images
      : [];
    const mainImage = newProduct.image || currentImages[0] || "";
    const allImages =
      currentImages.length > 0
        ? currentImages
        : mainImage
          ? [mainImage]
          : [];

    const existingReviewsList = editingProduct?.reviewsList || [];
    const verifiedCount = existingReviewsList.length;
    const verifiedAvg =
      verifiedCount > 0
        ? Number(
            (
              existingReviewsList.reduce(
                (sum: number, r: any) => sum + Number(r.rating || 0),
                0,
              ) / verifiedCount
            ).toFixed(1),
          )
        : 0;

    const product: Product = editingProduct
      ? {
          ...editingProduct,
          name: newProduct.name.trim(),
          price: numericPrice,
          oldPrice: numericOldPrice,
          image: mainImage,
          images: allImages,
          rating: verifiedAvg,
          reviews: verifiedCount,
          description: newProduct.description,
          category: newProduct.category as any,
          returnPolicy: newProduct.returnPolicy as any,
          status: newProduct.status || "published",
          listingConfirmed: Boolean(newProduct.listingConfirmed),
          imageConfirmed: Boolean(newProduct.imageConfirmed),
          brand: newProduct.brand?.trim() || undefined,
          model: newProduct.model?.trim() || undefined,
          capacity: newProduct.capacity?.trim() || undefined,
          inputSpec: newProduct.inputSpec?.trim() || undefined,
          outputSpec: newProduct.outputSpec?.trim() || undefined,
        }
      : {
          id: String(Date.now()),
          name: newProduct.name.trim(),
          price: numericPrice,
          oldPrice: numericOldPrice,
          image: mainImage,
          images: allImages,
          description: newProduct.description || "",
          category: newProduct.category as any,
          rating: 0,
          reviews: 0,
          reviewsList: [],
          stock: 10,
          returnPolicy: newProduct.returnPolicy as any,
          status: newProduct.status || "published",
          listingConfirmed: true,
          imageConfirmed: Boolean(mainImage && mainImage.startsWith("/uploads/")),
          brand: newProduct.brand?.trim() || undefined,
          model: newProduct.model?.trim() || undefined,
          capacity: newProduct.capacity?.trim() || undefined,
          inputSpec: newProduct.inputSpec?.trim() || undefined,
          outputSpec: newProduct.outputSpec?.trim() || undefined,
        };

    try {
      await saveProductToFirebase(product);
      if (editingProduct) {
        setProducts(
          products.map((p: any) => (p.id === editingProduct.id ? product : p)),
        );
        setEditingProduct(null);
      } else {
        setProducts([...products, product]);
      }
      setNewProduct({
        name: "",
        price: "",
        oldPrice: "",
        image: "",
        images: [],
        rating: "0",
        reviews: "0",
        description: "",
        category: "Accessories",
        returnPolicy: "7 Days",
        status: "published",
        listingConfirmed: false,
        imageConfirmed: false,
      });
      setIsAddProductOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Product save failed. Please check your internet connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickProductUpdate = async (
    productId: string,
    updates: Partial<Product>,
  ) => {
    const target = products.find((p: Product) => p.id === productId);
    if (!target) return;
    const updatedProduct: Product = { ...target, ...updates };
    try {
      await saveProductToFirebase(updatedProduct);
      setProducts(
        products.map((p: Product) =>
          p.id === productId ? updatedProduct : p,
        ),
      );
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductFromFirebase(productId);
        setProducts(products.filter((p: any) => p.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Delete failed");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const existingImages = Array.isArray(newProduct.images) ? newProduct.images : [];
    if (existingImages.length + files.length > 8) {
      alert("Maximum 8 images total allowed per product.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 2 * 1024 * 1024) {
        alert(`File ${files[i].name} exceeds 2MB limit.`);
        return;
      }
      formData.append("images", files[i]);
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("admin_token") || "mock-admin-token";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to upload images");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        const mergedImages = [...existingImages, ...data.urls].slice(0, 8);
        const primaryImage = newProduct.image || mergedImages[0] || "";

        setNewProduct((prev) => ({
          ...prev,
          image: primaryImage,
          images: mergedImages,
          imageConfirmed: true,
        }));
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Image upload failed");
    } finally {
      setIsSaving(false);
      // Reset file input value so same files can be chosen again if needed
      e.target.value = "";
    }
  };

  const handleUpdateProductPolicy = async (
    productId: string,
    policy: "7 Days" | "No Return",
  ) => {
    try {
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        const updatedProduct = { ...product, returnPolicy: policy };
        await saveProductToFirebase(updatedProduct);
        setProducts(
          products.map((p: any) => (p.id === productId ? updatedProduct : p)),
        );
      }
    } catch (error) {
      console.error("Error updating product policy:", error);
    }
  };

  const startEdit = (p: any) => {
    setEditingProduct(p);
    const existingImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
    setNewProduct({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      image: p.image || existingImages[0] || "",
      images: existingImages,
      rating: String(p.rating || 0),
      reviews: String(p.reviews || 0),
      description: p.description,
      category: p.category,
      returnPolicy: p.returnPolicy || "7 Days",
      status: p.status || "published",
      listingConfirmed: Boolean(p.listingConfirmed),
      imageConfirmed: Boolean(p.imageConfirmed),
      brand: p.brand || "",
      model: p.model || "",
      capacity: p.capacity || "",
      inputSpec: p.inputSpec || "",
      outputSpec: p.outputSpec || "",
    });
    setIsAddProductOpen(true);
  };

  const handleDeleteOrder = async (order: any) => {
    if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
      try {
        if (order.firebaseId) {
          await deleteOrderFromFirebase(order.firebaseId);
          setOrders(orders.filter((o: any) => o.id !== order.id));
        } else {
          alert("Cannot delete: Order ID not found in database.");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Delete failed");
      }
    }
  };

  const updateOrder = (id: string, updates: any) => {
    const order = orders.find((o: any) => o.id === id);
    if (order && order.firebaseId) {
      const finalUpdates = { ...updates };
      if (updates.status && updates.status !== order.status) {
        finalUpdates.trackingHistory = [
          ...(order.trackingHistory || []),
          { status: updates.status, date: new Date().toLocaleString() },
        ];
      }

      updateOrderInFirebase(order.firebaseId, finalUpdates)
        .then(() => {
          setOrders(
            orders.map((o: any) =>
              o.id === id ? { ...o, ...finalUpdates } : o,
            ),
          );
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, ...finalUpdates });
          }
        })
        .catch((err) => {
          console.error("Failed to update order", err);
          alert("Update failed");
        });
    } else {
      setOrders(
        orders.map((o: any) => (o.id === id ? { ...o, ...updates } : o)),
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom duration-500">
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          close={() => setSelectedOrder(null)}
          isAdmin={true}
          onUpdate={updateOrder}
        />
      )}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-6">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-orange-600" /> Admin Panel
          </h2>
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "orders" ? "bg-white shadow-sm text-orange-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "products" ? "bg-white shadow-sm text-orange-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "categories" ? "bg-white shadow-sm text-orange-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "returns" ? "bg-white shadow-sm text-orange-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Returns
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "reviews" ? "bg-white shadow-sm text-orange-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "settings" ? "bg-white shadow-sm text-orange-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Store & Guides
            </button>
          </div>
        </div>
        <button
          onClick={close}
          className="px-5 py-2.5 bg-slate-100 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <X size={16} /> Close
        </button>
      </div>

      {activeTab === "orders" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm hover:shadow-lg transition-shadow">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">
                Total Orders
              </p>
              <p className="text-4xl font-black text-slate-900">
                {orders.length}
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm hover:shadow-lg transition-shadow">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">
                Total Revenue
              </p>
              <p className="text-4xl font-black text-orange-600">
                ₹{orders.reduce((s: any, o: any) => s + o.finalAmount, 0)}
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm hover:shadow-lg transition-shadow">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">
                Total Reviews
              </p>
              <p className="text-4xl font-black text-blue-600">
                {products.reduce(
                  (acc: number, p: any) => acc + (p.reviewsList?.length || 0),
                  0,
                )}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden animate-in fade-in delay-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Order ID
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Customer
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Amount
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Status
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-24 text-center text-slate-300 font-black italic text-xl"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o: any, i: number) => (
                      <tr
                        key={o.id}
                        className="border-b hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-6 font-bold text-orange-600">
                          {o.id}
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-900">
                            {o.customerName}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {o.customerPhone}
                          </p>
                          {o.location && (
                            <a
                              href={`https://www.google.com/maps?q=${o.location.lat},${o.location.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-orange-600 flex items-center gap-1 mt-1 hover:underline"
                            >
                              <MapPin size={10} /> View Location
                            </a>
                          )}
                        </td>
                        <td className="p-6 font-black text-slate-900">
                          ₹{o.finalAmount}
                        </td>
                        <td className="p-6">
                          <div className="relative">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                updateOrder(o.id, { status: e.target.value })
                              }
                              className={`appearance-none border-none text-xs font-bold rounded-full py-2 pl-4 pr-8 outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all
                                     ${o.status === "Pending" ? "bg-amber-100 text-amber-700 focus:ring-amber-500" : ""}
                                     ${o.status === "Confirmed" ? "bg-blue-100 text-blue-700 focus:ring-blue-500" : ""}
                                     ${o.status === "Shipped" ? "bg-purple-100 text-purple-700 focus:ring-purple-500" : ""}
                                     ${o.status === "Delivered" ? "bg-emerald-100 text-emerald-700 focus:ring-emerald-500" : ""}
                                     ${o.status === "Cancelled" ? "bg-rose-100 text-rose-700 focus:ring-rose-500" : ""}
                                   `}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Eye size={14} /> View Details
                          </button>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-3 text-orange-600 hover:bg-orange-50 rounded-xl transition-all active:scale-75"
                            title="Order Settings"
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(o)}
                            className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-75"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              const printWindow = window.open("", "_blank");
                              if (printWindow) {
                                printWindow.document.write(`
                                       <html>
                                         <head>
                                           <title>Invoice #${o.id}</title>
                                           <style>
                                             body { font-family: sans-serif; padding: 20px; }
                                             .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                                             .title { font-size: 24px; font-weight: bold; color: #333; }
                                             .details { margin-bottom: 30px; }
                                             .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                                             .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                             .table th { background-color: #f8f9fa; }
                                             .total { text-align: right; font-size: 18px; font-weight: bold; }
                                             .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
                                           </style>
                                         </head>
                                         <body>
                                           <div class="header">
                                             <div class="title">MyshopMyhome Invoice</div>
                                             <p>Order ID: ${o.id}</p>
                                             <p>Date: ${new Date(o.date).toLocaleDateString()}</p>
                                           </div>
                                           <div class="details">
                                             <h3>Customer Details</h3>
                                             <p><strong>Name:</strong> ${o.customerName}</p>
                                             <p><strong>Phone:</strong> ${o.customerPhone}</p>
                                             <p><strong>Address:</strong> ${o.society}, ${o.village}, ${o.pincode}</p>
                                             ${o.location ? `<p><strong>Location:</strong> <a href="https://www.google.com/maps?q=${o.location.lat},${o.location.lng}">View on Map</a></p>` : ""}
                                           </div>
                                           <table class="table">
                                             <thead>
                                               <tr>
                                                 <th>Item</th>
                                                 <th>Qty</th>
                                                 <th>Price</th>
                                                 <th>Total</th>
                                               </tr>
                                             </thead>
                                             <tbody>
                                               ${o.items
                                                 .map(
                                                   (item: any) => `
                                                 <tr>
                                                   <td>${item.name}</td>
                                                   <td>${item.quantity}</td>
                                                   <td>₹${item.price}</td>
                                                   <td>₹${item.price * item.quantity}</td>
                                                 </tr>
                                               `,
                                                 )
                                                 .join("")}
                                             </tbody>
                                           </table>
                                           <div class="total">
                                             Total Amount: ₹${o.finalAmount}
                                           </div>
                                           <div class="footer">
                                             <p>Thank you for shopping with MyshopMyhome!</p>
                                           </div>
                                           <script>window.print();</script>
                                         </body>
                                       </html>
                                     `);
                                printWindow.document.close();
                              }
                            }}
                            className="p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:scale-75"
                          >
                            <Printer size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(o)}
                            className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-75"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === "categories" ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">
              Category Management
            </h3>
            <button
              onClick={() => {
                setEditingCategory(null);
                setNewCategory({ name: "", image: "" });
                setIsAddCategoryOpen(true);
              }}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} /> Add Category
            </button>
          </div>

          {isAddCategoryOpen && (
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-orange-100 animate-in slide-in-from-top-4 fade-in">
              <h4 className="font-bold text-lg mb-6">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h4>
              <form
                onSubmit={handleSaveCategory}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <input
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                  required
                />

                <div className="">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-2">
                    Category Icon/Image
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    {newCategory.image && (
                      <img
                        src={newCategory.image}
                        className="h-12 w-12 rounded-lg object-cover border"
                      />
                    )}
                  </div>
                  <input
                    placeholder="Or Image URL"
                    value={newCategory.image}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, image: e.target.value })
                    }
                    className="mt-2 w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 text-xs"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    {editingCategory ? "Update Category" : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((c: any) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col items-center text-center"
              >
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-500 rounded-full shadow-sm hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => startEditCategory(c)}
                  className="absolute top-2 left-2 p-1.5 bg-white/90 text-orange-600 rounded-full shadow-sm hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Pencil size={14} />
                </button>
                <div className="w-16 h-16 rounded-full bg-slate-50 mb-3 overflow-hidden">
                  <img
                    src={c.image}
                    className="w-full h-full object-cover"
                    onError={(e: any) =>
                      (e.target.src = "https://via.placeholder.com/64")
                    }
                  />
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate w-full">
                  {c.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "returns" ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Return Requests
          </h3>
          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Order ID
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Customer
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Product Policy
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Reason
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Status
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(
                    (o: any) => o.returnInfo && o.returnInfo.status !== "None",
                  ).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-24 text-center text-slate-300 font-black italic text-xl"
                      >
                        No return requests.
                      </td>
                    </tr>
                  ) : (
                    orders
                      .filter(
                        (o: any) =>
                          o.returnInfo && o.returnInfo.status !== "None",
                      )
                      .map((o: any) => (
                        <tr
                          key={o.id}
                          className="border-b hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-6 font-bold text-orange-600">
                            {o.id}
                          </td>
                          <td className="p-6">
                            <p className="font-bold text-slate-900">
                              {o.customerName}
                            </p>
                            <p className="text-xs font-medium text-slate-400">
                              {o.customerPhone}
                            </p>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col gap-2 max-w-[200px]">
                              {o.items?.map((item: any) => {
                                const product = products.find(
                                  (p: any) => p.id === item.id,
                                );
                                return (
                                  <div
                                    key={item.id}
                                    className="text-xs border-b border-slate-50 pb-2 last:border-0 hover:bg-slate-50/80 p-1 rounded transition-colors"
                                  >
                                    <p className="font-semibold text-slate-700 truncate mb-1">
                                      {item.name}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      <button
                                        onClick={() =>
                                          handleUpdateProductPolicy(
                                            item.id,
                                            "7 Days",
                                          )
                                        }
                                        className={`px-2 py-0.5 rounded text-[8px] font-bold border cursor-pointer transition-all ${
                                          product?.returnPolicy === "7 Days"
                                            ? "bg-emerald-600 text-white border-emerald-600"
                                            : "bg-white text-slate-400 border-slate-200 hover:border-emerald-600"
                                        }`}
                                      >
                                        7D Return
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleUpdateProductPolicy(
                                            item.id,
                                            "No Return",
                                          )
                                        }
                                        className={`px-2 py-0.5 rounded text-[8px] font-bold border cursor-pointer transition-all ${
                                          product?.returnPolicy === "No Return"
                                            ? "bg-rose-600 text-white border-rose-600"
                                            : "bg-white text-slate-400 border-slate-200 hover:border-rose-600"
                                        }`}
                                      >
                                        No Return
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td className="p-6">
                            <p className="text-sm text-slate-600 max-w-xs truncate">
                              {o.returnInfo.reason}
                            </p>
                          </td>
                          <td className="p-6">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                  ${o.returnInfo.status === "Requested" ? "bg-amber-100 text-amber-600" : ""}
                                  ${o.returnInfo.status === "Approved" ? "bg-emerald-100 text-emerald-600" : ""}
                                  ${o.returnInfo.status === "Rejected" ? "bg-rose-100 text-rose-600" : ""}
                                  ${o.returnInfo.status === "Completed" ? "bg-blue-100 text-blue-600" : ""}
                                `}
                            >
                              {o.returnInfo.status}
                            </span>
                          </td>
                          <td className="p-6 text-right space-x-2">
                            <button
                              onClick={() =>
                                updateReturnStatus(o.id, "Approved")
                              }
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                updateReturnStatus(o.id, "Rejected")
                              }
                              className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={() =>
                                updateReturnStatus(o.id, "Completed")
                              }
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                            >
                              <Package size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === "reviews" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              Manage Customer Reviews
            </h3>
            <div className="flex gap-4">
              <select
                className="p-2 border rounded-lg text-sm outline-none focus:border-orange-600"
                onChange={(e) => setSelectedReviewProduct(e.target.value)}
                value={selectedReviewProduct}
              >
                <option value="">All Products</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsAddAdminReviewOpen(true)}
                className="px-6 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Add Review
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Product
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      User
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Rating
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Comment
                    </th>
                    <th className="p-6 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .flatMap((p: any) =>
                      (p.reviewsList || []).map((r: any) => ({
                        ...r,
                        productId: p.id,
                        productName: p.name,
                      })),
                    )
                    .filter(
                      (r: any) =>
                        !selectedReviewProduct ||
                        r.productId === selectedReviewProduct,
                    ).length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-24 text-center text-slate-300 font-black italic text-xl"
                      >
                        No reviews found.
                      </td>
                    </tr>
                  ) : (
                    products
                      .flatMap((p: any) =>
                        (p.reviewsList || []).map((r: any) => ({
                          ...r,
                          productId: p.id,
                          productName: p.name,
                        })),
                      )
                      .filter(
                        (r: any) =>
                          !selectedReviewProduct ||
                          r.productId === selectedReviewProduct,
                      )
                      .map((r: any) => (
                        <tr
                          key={r.id}
                          className="border-b hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-6">
                            <p className="font-bold text-slate-900 text-sm truncate max-w-[150px]">
                              {r.productName}
                            </p>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={r.userImage}
                                className="w-8 h-8 rounded-full"
                              />
                              <p className="font-bold text-slate-900 text-sm">
                                {r.userName}
                              </p>
                            </div>
                            {r.photo && (
                              <img
                                src={r.photo}
                                className="w-12 h-12 object-cover rounded mt-2 border"
                              />
                            )}
                          </td>
                          <td className="p-6">
                            <div className="flex text-orange-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  fill={s <= r.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-6">
                            <p className="text-slate-600 text-sm truncate max-w-[200px]">
                              {r.comment}
                            </p>
                          </td>
                          <td className="p-6 text-right">
                            <button
                              onClick={async () => {
                                if (window.confirm("Delete this review?")) {
                                  const updated = await deleteReviewFromProduct(
                                    r.productId,
                                    r.id,
                                  );
                                  setProducts((prev: any) =>
                                    prev.map((p: any) =>
                                      p.id === r.productId
                                        ? {
                                            ...p,
                                            reviewsList: updated,
                                            reviews: updated.length,
                                          }
                                        : p,
                                    ),
                                  );
                                }
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === "settings" ? (
        <AdminStoreSettingsTab
          settings={storeSettings}
          setSettings={setStoreSettings}
          guides={buyingGuides}
          setGuides={setBuyingGuides}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Product Catalog & Quality Review
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unconfirmed placeholder listings (like &ldquo;fgh&rdquo;) and
                draft products are kept hidden from the public catalog until you
                confirm and publish them.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to apply '7 Days Return' policy to ALL products?",
                    )
                  ) {
                    try {
                      const updatedProducts = products.map((p: any) => ({
                        ...p,
                        returnPolicy: "7 Days",
                      }));
                      for (const p of updatedProducts) {
                        await saveProductToFirebase(p);
                      }
                      setProducts(updatedProducts);
                      alert(
                        "7-Day Return policy applied to all products successfully!",
                      );
                    } catch (error) {
                      console.error(
                        "Error applying policy to all products:",
                        error,
                      );
                      alert("Failed to apply policy to all products.");
                    }
                  }
                }}
                className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
              >
                <ShieldCheck size={18} /> Apply 7D Return to All
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    price: "",
                    oldPrice: "",
                    image: "",
                    images: [],
                    rating: "0",
                    reviews: "0",
                    description: "",
                    category: "Accessories",
                    returnPolicy: "7 Days",
                    status: "published",
                    listingConfirmed: true,
                    imageConfirmed: false,
                  });
                  setIsAddProductOpen(true);
                }}
                className="px-5 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>

          {/* Quality Audit Summary Banner */}
          {(() => {
            const flaggedProducts = products.filter(
              (p: Product) =>
                getProductQualityWarnings(p, Boolean(brokenImageMap[p.id]))
                  .length > 0,
            );
            if (flaggedProducts.length === 0) return null;
            return (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-amber-900 text-sm">
                    Catalog Quality Review: {flaggedProducts.length} listing(s)
                    flagged for admin attention
                  </h4>
                  <span className="text-xs font-bold bg-amber-200/70 text-amber-900 px-2.5 py-0.5 rounded-full">
                    No data was auto-deleted
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Review flagged items below to replace broken or mismatched
                  images via the uploader, fix compare-at prices, or confirm test
                  listings like &ldquo;fgh&rdquo;.
                </p>
              </div>
            );
          })()}

          {isAddProductOpen && (
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-orange-100 animate-in slide-in-from-top-4 fade-in">
              <h4 className="font-bold text-lg mb-6">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h4>
              <form
                onSubmit={handleSaveProduct}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                    required
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newProduct.status || "published"}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        status: e.target.value as "published" | "draft",
                      })
                    }
                    className="p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                  >
                    <option value="published">
                      Status: Published (Public)
                    </option>
                    <option value="draft">
                      Status: Draft (Hidden from Store)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-2">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-2">
                    Compare-at / Old Price (₹, optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Old Price (₹)"
                    value={newProduct.oldPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, oldPrice: e.target.value })
                    }
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                  />
                  {newProduct.oldPrice &&
                    Number(newProduct.oldPrice) <= Number(newProduct.price) && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">
                        Old price must be greater than ₹{newProduct.price || 0}{" "}
                        to show a valid discount.
                      </p>
                    )}
                </div>

                <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Verified Customer Ratings
                  </span>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    Star ratings and review counts are calculated automatically
                    from verified customer reviews (
                    {editingProduct?.reviewsList?.length || 0} verified review
                    {(editingProduct?.reviewsList?.length || 0) === 1
                      ? ""
                      : "s"}
                    ). Products with 0 verified reviews do not display a rating
                    badge.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-2">
                    Product Images (Max 8, JPEG/PNG/WebP, 2MB each)
                  </label>
                  <div className="flex flex-col gap-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isSaving}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
                    />

                    {Array.isArray(newProduct.images) &&
                      newProduct.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl border">
                          {newProduct.images.map(
                            (imgUrl: string, idx: number) => {
                              const isMain = newProduct.image === imgUrl;
                              return (
                                <div
                                  key={idx}
                                  className="relative group aspect-square rounded-xl overflow-hidden border bg-slate-50 flex items-center justify-center"
                                >
                                  <SafeProductImage
                                    src={imgUrl}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    fallbackClassName="w-full h-full"
                                  />
                                  {isMain && (
                                    <span className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                      Main
                                    </span>
                                  )}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                                    {!isMain && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setNewProduct({
                                            ...newProduct,
                                            image: imgUrl,
                                          })
                                        }
                                        className="bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow hover:bg-orange-600 hover:text-white transition-colors"
                                      >
                                        Set Main
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedImages =
                                          newProduct.images.filter(
                                            (_, i) => i !== idx,
                                          );
                                        let newMain = newProduct.image;
                                        if (isMain) {
                                          newMain = updatedImages[0] || "";
                                        }
                                        setNewProduct({
                                          ...newProduct,
                                          image: newMain,
                                          images: updatedImages,
                                        });
                                      }}
                                      className="bg-rose-500 text-white text-[10px] font-bold p-1 rounded shadow hover:bg-rose-600 transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                  </div>
                  <input
                    placeholder="Or Main Image URL"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    className="mt-2 w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-2">
                    Return Policy
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewProduct({ ...newProduct, returnPolicy: "7 Days" })
                      }
                      className={`flex-1 py-4 rounded-xl font-bold border transition-all ${newProduct.returnPolicy === "7 Days" ? "bg-orange-600 text-white border-orange-600" : "bg-white text-slate-500 border-slate-200 hover:border-orange-600"}`}
                    >
                      7 Days Return
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewProduct({
                          ...newProduct,
                          returnPolicy: "No Return",
                        })
                      }
                      className={`flex-1 py-4 rounded-xl font-bold border transition-all ${newProduct.returnPolicy === "No Return" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-500 border-slate-200 hover:border-rose-600"}`}
                    >
                      No Return
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Brand</label>
                  <input
                    placeholder="e.g. Hitage"
                    value={newProduct.brand || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Model</label>
                  <input
                    placeholder="e.g. Model X"
                    value={newProduct.model || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Capacity (if applicable)</label>
                  <input
                    placeholder="e.g. 10000mAh"
                    value={newProduct.capacity || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, capacity: e.target.value })}
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Input Spec</label>
                  <input
                    placeholder="e.g. 5V/2A"
                    value={newProduct.inputSpec || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, inputSpec: e.target.value })}
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Output Spec</label>
                  <input
                    placeholder="e.g. 5V/2.1A"
                    value={newProduct.outputSpec || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, outputSpec: e.target.value })}
                    className="w-full p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm mt-1"
                  />
                </div>

                <textarea
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="md:col-span-4 p-4 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-medium h-32"
                />

                <div className="md:col-span-4 flex justify-end gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving
                      ? "Saving..."
                      : editingProduct
                        ? "Update Product"
                        : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p: Product) => {
              const totalSold = orders.reduce((acc: number, order: any) => {
                const item = order.items.find((i: any) => i.id === p.id);
                return acc + (item ? item.quantity : 0);
              }, 0);
              const isBroken = Boolean(brokenImageMap[p.id]);
              const qualityWarnings = getProductQualityWarnings(p, isBroken);
              const isPublic = isPubliclyVisibleProduct(p);
              const verifiedStats = getVerifiedReviewStats(p);

              return (
                <div
                  key={p.id}
                  className={`bg-white p-4 rounded-[2rem] border shadow-sm hover:shadow-md transition-all group relative flex flex-col ${
                    qualityWarnings.length > 0
                      ? "border-amber-300 ring-1 ring-amber-200"
                      : "border-slate-100"
                  }`}
                >
                  <div className="aspect-square rounded-2xl bg-slate-50 mb-3 overflow-hidden relative">
                    <SafeProductImage
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      fallbackClassName="w-full h-full"
                      onBrokenChange={(broken) => {
                        setBrokenImageMap((prev) =>
                          prev[p.id] === broken
                            ? prev
                            : { ...prev, [p.id]: broken },
                        );
                      }}
                    />
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                        isPublic
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {isPublic ? "Published" : "Hidden / Draft"}
                    </span>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-full shadow-sm hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Delete product"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      className="absolute top-2 right-12 p-2 bg-white/90 text-orange-600 rounded-full shadow-sm hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Edit product / Replace image"
                    >
                      <Pencil size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                      Sold: {totalSold}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 mb-1 truncate">
                    {p.name}
                  </h4>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-orange-600 font-black">
                        ₹{p.price}
                      </span>
                      {p.oldPrice !== undefined && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">
                          ₹{p.oldPrice}
                        </span>
                      )}
                    </div>
                    {verifiedStats.hasVerifiedReviews ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                        {verifiedStats.averageRating}{" "}
                        <Star size={10} fill="currentColor" /> (
                        {verifiedStats.reviewCount})
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        No verified reviews
                      </span>
                    )}
                  </div>

                  {qualityWarnings.length > 0 && (
                    <div className="mb-3 space-y-1.5 bg-amber-50/90 border border-amber-200 rounded-xl p-2.5">
                      {qualityWarnings.map((w, wIdx) => (
                        <p
                          key={wIdx}
                          className="text-[11px] text-amber-900 font-semibold leading-snug"
                        >
                          • {w.message}
                        </p>
                      ))}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="px-2.5 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-bold hover:bg-orange-700 transition-colors"
                        >
                          Replace Image / Edit
                        </button>
                        {qualityWarnings.some(
                          (w) => w.type === "placeholder_title",
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickProductUpdate(p.id, {
                                listingConfirmed: true,
                                status: "published",
                              })
                            }
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Confirm Real Product
                          </button>
                        )}
                        {qualityWarnings.some(
                          (w) => w.type === "image_mismatch",
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickProductUpdate(p.id, {
                                imageConfirmed: true,
                              })
                            }
                            className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-bold hover:bg-slate-900 transition-colors"
                          >
                            Confirm Image Matches
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-2 space-y-1.5">
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleUpdateProductPolicy(p.id, "7 Days")
                        }
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${p.returnPolicy === "7 Days" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-400 border-slate-100 hover:border-emerald-600"}`}
                      >
                        7D Return
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateProductPolicy(p.id, "No Return")
                        }
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${p.returnPolicy === "No Return" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-400 border-slate-100 hover:border-rose-600"}`}
                      >
                        No Return
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickProductUpdate(p.id, {
                          status:
                            p.status === "draft" ? "published" : "draft",
                          listingConfirmed:
                            p.status === "draft" ? true : p.listingConfirmed,
                        })
                      }
                      className="w-full py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      {p.status === "draft" || !isPublic
                        ? "Publish to Storefront"
                        : "Move to Draft (Hide)"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isAddAdminReviewOpen && (
        <div className="fixed inset-0 z-[600] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">
                Add Admin Review
              </h3>
              <button
                onClick={() => setIsAddAdminReviewOpen(false)}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const productId = form.productId.value;
                const review = {
                  id: Date.now().toString(),
                  userName: form.userName.value,
                  rating: Number(form.rating.value),
                  comment: form.comment.value,
                  userImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.userName.value}`,
                  photo: adminReviewPhoto || "",
                  date: new Date().toLocaleDateString(),
                };
                const updated = await addReviewToProduct(productId, review);
                setProducts((prev: any) =>
                  prev.map((p: any) =>
                    p.id === productId
                      ? { ...p, reviewsList: updated, reviews: updated.length }
                      : p,
                  ),
                );
                setIsAddAdminReviewOpen(false);
                setAdminReviewPhoto(null);
              }}
              className="p-8 space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                    Select Product
                  </label>
                  <select
                    name="productId"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                    required
                  >
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                    Customer Name
                  </label>
                  <input
                    name="userName"
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                      Rating (1-5)
                    </label>
                    <input
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      defaultValue="5"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-600 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                      Review Photo
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={adminReviewFileRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setAdminReviewPhoto(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => adminReviewFileRef.current?.click()}
                        className="flex-1 p-4 bg-slate-50 rounded-2xl border-none outline-none hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-slate-500 font-bold"
                      >
                        <Camera size={18} />{" "}
                        {adminReviewPhoto ? "Change" : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                    Comment
                  </label>
                  <textarea
                    name="comment"
                    placeholder="Write review here..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-600 font-bold h-32 resize-none"
                    required
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-orange-200 hover:scale-[1.02] transition-all active:scale-95"
              >
                Post Admin Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, close, isAdmin, onUpdate }: any) => {
  const [trackingLink, setTrackingLink] = useState(order.trackingLink || "");
  const [estDelivery, setEstDelivery] = useState(order.estimatedDelivery || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTracking = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(order.id, {
        trackingLink,
        estimatedDelivery: estDelivery,
      });
      alert("Tracking updated successfully");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Order #{order.id}
            </h2>
            <p className="text-sm text-slate-500 font-bold">
              {new Date(order.date).toLocaleString()}
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Details */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-orange-600" /> Customer Details
              </h3>
              <div className="space-y-3">
                <p className="text-sm">
                  <span className="font-bold text-slate-500 uppercase text-xs block mb-1">
                    Name
                  </span>{" "}
                  <span className="font-medium text-slate-900 text-lg">
                    {order.customerName}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-bold text-slate-500 uppercase text-xs block mb-1">
                    Phone
                  </span>{" "}
                  <span className="font-medium text-slate-900 text-lg">
                    {order.customerPhone}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-bold text-slate-500 uppercase text-xs block mb-1">
                    Address
                  </span>{" "}
                  <span className="font-medium text-slate-900">
                    {order.houseNo}, {order.society}, {order.landmark},{" "}
                    {order.village}, {order.taluka}, {order.district} -{" "}
                    {order.pincode}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-orange-600" /> Tracking
                History
              </h3>
              <div className="space-y-4">
                {order.trackingHistory?.map((h: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-1 w-2 h-2 rounded-full bg-orange-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {h.status}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {h.date}
                      </p>
                    </div>
                  </div>
                ))}
                {(!order.trackingHistory ||
                  order.trackingHistory.length === 0) && (
                  <p className="text-sm text-slate-400 italic">
                    No tracking history available.
                  </p>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
                <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                  <Settings size={20} /> Admin: Update Tracking
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-orange-400 px-1 tracking-widest">
                      Estimated Delivery
                    </label>
                    <input
                      value={estDelivery}
                      onChange={(e) => setEstDelivery(e.target.value)}
                      placeholder="e.g. 15/03/2026"
                      className="w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-orange-400 px-1 tracking-widest">
                      Tracking Link
                    </label>
                    <input
                      value={trackingLink}
                      onChange={(e) => setTrackingLink(e.target.value)}
                      placeholder="https://tracking.link/..."
                      className="w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm"
                    />
                  </div>
                  <button
                    onClick={handleUpdateTracking}
                    disabled={isUpdating}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Update Tracking Info"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-orange-600" /> Order Items & Pricing
              </h3>
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg border overflow-hidden flex items-center justify-center shrink-0">
                      <SafeProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        fallbackClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500 font-bold">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-black text-slate-900 text-sm">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
                <div className="space-y-1.5 pt-3 border-t border-slate-200 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="text-emerald-600 font-bold">Free (₹0)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-slate-200">
                    <p className="font-black text-slate-900 text-base">
                      Total Amount
                    </p>
                    <p className="font-black text-orange-600 text-xl">
                      ₹{order.finalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-600" /> Payment & Status
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-xs block mb-1">Payment Method</span>
                  <span className="font-bold text-slate-800">{order.paymentMethod || "COD"}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-xs block mb-1">Payment Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs inline-block ${order.razorpayPaymentId || order.paymentMethod === "Razorpay" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {order.razorpayPaymentId ? `Paid (${order.razorpayPaymentId.substring(0, 10)}...)` : "Pending / COD"}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-400 uppercase text-xs block mb-1">Order Status</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-xs inline-block ${
                    order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "Cancelled" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          {isAdmin && (
            <div className="flex flex-col h-full min-h-[400px]">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-orange-600" /> Delivery
                Location
              </h3>
              <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
                {order.location ? (
                  <div className="relative h-full">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}&q=${order.location.lat},${order.location.lng}`}
                      className="w-full h-full"
                    ></iframe>
                    <a
                      href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all text-orange-600"
                    >
                      <MapPin size={14} /> Open in Google Maps
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <MapPin size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No GPS Location Data Available</p>
                  </div>
                )}

                {order.location && (
                  <a
                    href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white text-orange-600 px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <MapPin size={16} /> Open in Google Maps
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductPage = ({
  products,
  setProducts,
  addToCart,
  setIsCartOpen,
  storeSettings,
}: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existingProduct = products.find((p: any) => p.id === id);
  const [fetchedProduct, setFetchedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!existingProduct);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!existingProduct && id) {
      setIsLoading(true);
      getProductFromFirebase(id)
        .then((res) => {
          if (res) {
            setFetchedProduct(res);
          }
        })
        .catch((err) => console.error("Error fetching product:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id, existingProduct]);

  const product = existingProduct || fetchedProduct;

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    photo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  usePageMeta(
    product ? `${product.name} — Buy Online | MyshopMyhome.shop` : "Product | MyshopMyhome.shop",
    product?.description ? product.description.substring(0, 150) : "Shop verified mobile accessories and electronics at MyshopMyhome.shop."
  );

  useEffect(() => {
    if (product) {
      const scriptId = "product-jsonld";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [product.image],
        "description": product.description,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "MyshopMyhome"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "INR",
          "price": product.price,
          "availability": "https://schema.org/InStock"
        }
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4" />
        <p className="font-bold text-slate-700">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Product not found</h2>
        <p className="text-slate-500 mb-6 text-sm">The product you are looking for may have been removed or is unavailable.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-md hover:bg-orange-700 transition-all"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewForm({ ...reviewForm, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = {
        id: Date.now().toString(),
        userName: "Customer",
        userImage: `https://ui-avatars.com/api/?name=Customer&background=random`,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        photo: reviewForm.photo,
      };

      const updatedReviews = await addReviewToProduct(product.id, newReview);

      // Update local state
      setProducts((prev: any) =>
        prev.map((p: any) =>
          p.id === product.id
            ? {
                ...p,
                reviewsList: updatedReviews,
                reviews: updatedReviews.length,
              }
            : p,
        ),
      );

      setReviewForm({ rating: 5, comment: "", photo: "" });
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedMainImage, setSelectedMainImage] = useState<string>("");
  const activeImg = selectedMainImage || product.image;
  const reviewStats = getVerifiedReviewStats(product);
  const discountInfo = getValidDiscount(product.price, product.oldPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Shopping
      </button>

      <div className="bg-white rounded-sm shadow-sm p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-sm overflow-hidden flex items-center justify-center p-2 md:p-4 min-h-[220px] md:min-h-[380px]">
            <SafeProductImage
              src={activeImg}
              className="w-full h-auto max-h-[320px] md:max-h-[460px] object-contain mx-auto"
              fallbackClassName="w-full h-64 rounded-lg"
              alt={product.name}
            />
          </div>
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMainImage(imgUrl)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-slate-50 flex items-center justify-center transition-all ${
                    activeImg === imgUrl
                      ? "border-orange-600 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <SafeProductImage
                    src={imgUrl}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    fallbackClassName="w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => {
                addToCart(product);
                setIsCartOpen(true);
              }}
              className="flex-1 py-4 bg-[#ff9f00] text-white font-bold uppercase rounded-[2px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product);
                setIsCartOpen(true);
              }}
              className="flex-1 py-4 bg-[#fb641b] text-white font-bold uppercase rounded-[2px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={20} /> Buy Now
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2">
          <nav className="flex text-xs text-slate-400 gap-2 mb-4">
            <span>Home</span> <ChevronRight size={12} />
            <span>{product.category}</span> <ChevronRight size={12} />
            <span className="text-slate-600 truncate">{product.name}</span>
          </nav>

          <h1 className="text-xl md:text-2xl font-medium text-slate-900 mb-2">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {reviewStats.hasVerifiedReviews && (
              <>
                <div className="bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded-[3px] flex items-center gap-1">
                  {reviewStats.averageRating} <Star size={10} fill="white" />
                </div>
                <span className="text-slate-500 text-sm font-bold">
                  {reviewStats.reviewCount} Verified Review
                  {reviewStats.reviewCount === 1 ? "" : "s"}
                </span>
              </>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.returnPolicy === "No Return" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
            >
              {product.returnPolicy === "No Return"
                ? "No Return"
                : "7 Days Return"}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              ₹{product.price}
            </span>
            {discountInfo.isValidDiscount && (
              <>
                <span className="text-base text-slate-400 line-through">
                  ₹{product.oldPrice}
                </span>
                <span className="text-base font-bold text-[#388e3c]">
                  {discountInfo.discountPercent}% off
                </span>
              </>
            )}
          </div>

          <div className="border rounded-[2px] p-4 mb-6 bg-slate-50 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">
              Product Highlights & Specifications
            </h4>
            {(() => {
              const { bullets, specs } = parseProductDescription(product.description, product);
              return (
                <div className="space-y-4">
                  {bullets.length > 0 ? (
                    <ul className="space-y-1.5 list-disc list-inside text-slate-700 text-sm">
                      {bullets.map((b: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                  )}
                  {specs.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-xs font-bold uppercase text-slate-400 mb-2">Specifications</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {specs.map((spec: { label: string; value: string }, idx: number) => (
                          <div key={idx} className="flex justify-between bg-white p-2 rounded border border-slate-100">
                            <span className="font-bold text-slate-500">{spec.label}:</span>
                            <span className="font-medium text-slate-800">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Shipping Information</p>
                      <p className="text-xs text-slate-700 font-medium">{storeSettings?.shippingSummary || storeSettings?.deliveryTimeline || "Standard Pan-India delivery within 3-7 business days."}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Return Policy</p>
                      <p className="text-xs text-slate-700 font-medium">
                        {product.returnPolicy === "No Return" ? "No Return applicable on this product." : "7 Days Return policy eligible for manufacturing defects or incorrect items."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-6">
            {storeSettings?.warrantySummary ? (
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">
                  Warranty
                </p>
                <p className="text-slate-800 text-sm font-medium">
                  {storeSettings.warrantySummary}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">
                  Return Policy
                </p>
                <p className="text-slate-800 text-sm font-medium">
                  {product.returnPolicy === "No Return"
                    ? "No Return"
                    : "7 Days Return"}
                </p>
              </div>
            )}
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">
                Seller
              </p>
              <p className="text-slate-800 text-sm font-medium">
                MyshopMyhome.shop
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-sm shadow-sm p-4 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">
          Ratings & Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Summary */}
          <div className="lg:col-span-1">
            {reviewStats.hasVerifiedReviews ? (
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-bold text-slate-900">
                  {reviewStats.averageRating}
                </div>
                <div>
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={20}
                        fill={
                          s <= Math.round(reviewStats.averageRating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {reviewStats.reviewCount} Verified Review
                    {reviewStats.reviewCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-700">
                  No verified reviews yet
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Ratings appear only after verified customer reviews are
                  submitted.
                </p>
              </div>
            )}

            {/* Write a Review Form */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: s })
                        }
                        className={`p-1 transition-colors ${s <= reviewForm.rating ? "text-orange-500" : "text-slate-300"}`}
                      >
                        <Star
                          size={24}
                          fill={
                            s <= reviewForm.rating ? "currentColor" : "none"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Comment
                  </label>
                  <textarea
                    required
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    className="w-full p-3 bg-white border rounded-lg text-sm outline-none focus:border-blue-600 transition-all h-24 resize-none"
                    placeholder="Share your experience..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Add Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all flex items-center justify-center"
                    >
                      <Camera size={24} />
                    </button>
                    {reviewForm.photo && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                        <img
                          src={reviewForm.photo}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setReviewForm({ ...reviewForm, photo: "" })
                          }
                          className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-bl-lg"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-8">
            {product.reviewsList && product.reviewsList.length > 0 ? (
              product.reviewsList.map((review: any) => (
                <div key={review.id} className="border-b pb-8 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.userImage}
                        className="w-10 h-10 rounded-full bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {review.userName}
                        </h4>
                        <p className="text-slate-400 text-xs">{review.date}</p>
                      </div>
                    </div>
                    <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] flex items-center gap-0.5">
                      {review.rating} <Star size={8} fill="white" />
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {review.photo && (
                    <div className="mb-4">
                      <img
                        src={review.photo}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={14} /> Helpful
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                <p className="text-slate-500 font-medium">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsModal = ({ product, close, addToCart, buyNow }: any) => {
  const [qty, setQty] = useState(1);
  const discountInfo = getValidDiscount(product.price, product.oldPrice);
  const reviewStats = getVerifiedReviewStats(product);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative">
          {discountInfo.isValidDiscount && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#26a541] text-white text-xs font-bold px-2 py-1 rounded-[2px] shadow-sm">
                {discountInfo.discountPercent}% off
              </span>
            </div>
          )}
          <div className="w-full flex items-center justify-center overflow-hidden min-h-[220px] md:min-h-[360px]">
            <SafeProductImage
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[320px] md:max-h-[440px] object-contain hover:scale-105 transition-transform duration-500 mx-auto"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <button
              onClick={() => addToCart(product, qty)}
              className="w-[45%] py-3.5 bg-[#ff9f00] text-white font-bold uppercase text-sm shadow-md hover:shadow-lg transition-all rounded-[2px] flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} fill="white" /> Add to Cart
            </button>
            <button
              onClick={() => buyNow(product, qty)}
              className="w-[45%] py-3.5 bg-[#fb641b] text-white font-bold uppercase text-sm shadow-md hover:shadow-lg transition-all rounded-[2px] flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> Buy Now
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto bg-white">
          <div className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">
            Home / Accessories / {product.category}
          </div>
          <h2 className="text-xl md:text-2xl font-medium text-slate-900 mb-2 leading-tight">
            {product.name}
          </h2>

          <div className="flex items-center gap-3 mb-4">
            {reviewStats.hasVerifiedReviews ? (
              <>
                <span className="bg-[#388e3c] text-white text-xs font-bold px-1.5 py-0.5 rounded-[2px] flex items-center gap-0.5">
                  {reviewStats.averageRating} <Star size={10} fill="white" />
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  {reviewStats.reviewCount} Verified{" "}
                  {reviewStats.reviewCount === 1 ? "Review" : "Reviews"}
                </span>
              </>
            ) : (
              <span className="text-slate-400 text-xs font-medium">
                No verified reviews yet
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.returnPolicy === "No Return" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
            >
              {product.returnPolicy === "No Return"
                ? "No Return"
                : "7 Days Return"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              ₹{product.price}
            </span>
            {discountInfo.isValidDiscount && (
              <>
                <span className="text-slate-400 text-sm line-through">
                  ₹{product.oldPrice}
                </span>
                <span className="text-[#388e3c] font-bold text-sm">
                  {discountInfo.discountPercent}% off
                </span>
              </>
            )}
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">
              Quantity
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors font-bold"
                >
                  -
                </button>
                <span className="px-6 py-2 font-black text-slate-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-[#388e3c]">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-sm text-slate-700 font-bold">
                {product.returnPolicy === "No Return"
                  ? "No Return Policy"
                  : "7 Days Return Policy"}
              </p>
            </div>
          </div>

          <div className="border rounded-[2px] p-4 mb-6 bg-slate-50">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">
              Product Description
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-6 mb-8">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">
                Warranty
              </p>
              <p className="text-slate-800 text-sm font-medium">
                {product.warranty && product.warranty.trim()
                  ? product.warranty
                  : "Check product specifications"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">
                Seller
              </p>
              <p className="text-slate-800 text-sm font-medium">
                MyshopMyhome Official
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Ratings & Reviews
              </h3>
              {reviewStats.hasVerifiedReviews && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                  {reviewStats.averageRating} <Star size={10} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-slate-50 p-6 rounded-2xl mb-8">
              <h4 className="font-bold text-slate-800 mb-4 text-sm">
                Add Your Review
              </h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as any;
                  const rating = Number(form.rating.value);
                  const comment = form.comment.value;
                  const photo = form.photo.dataset.photo;

                  const newReview = {
                    id: Date.now().toString(),
                    userName: "Customer", // In a real app, get from auth
                    rating,
                    comment,
                    userImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
                    photo: photo || "",
                    date: new Date().toLocaleDateString(),
                  };

                  try {
                    await addReviewToProduct(product.id, newReview);
                    alert("Review added successfully!");
                    form.reset();
                    // Note: In a real app, we'd want to refresh the product data or update local state
                  } catch (error) {
                    console.error(error);
                    alert("Failed to add review");
                  }
                }}
                className="space-y-4"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                      Rating
                    </label>
                    <select
                      name="rating"
                      className="w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm"
                      required
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                      Photo (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="userReviewFile"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const photoInput = document.getElementById(
                                "photoData",
                              ) as any;
                              if (photoInput)
                                photoInput.dataset.photo =
                                  reader.result as string;
                              const btn = document.getElementById("uploadBtn");
                              if (btn) btn.innerText = "Photo Selected";
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div
                        id="photoData"
                        data-photo=""
                        className="hidden"
                      ></div>
                      <button
                        type="button"
                        id="uploadBtn"
                        onClick={() =>
                          document.getElementById("userReviewFile")?.click()
                        }
                        className="w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-slate-500 font-bold text-sm"
                      >
                        <Camera size={16} /> Upload Photo
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">
                    Comment
                  </label>
                  <textarea
                    name="comment"
                    placeholder="Share your experience..."
                    className="w-full p-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm h-24 resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm shadow-lg hover:bg-orange-600 transition-all"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {(product.reviewsList || []).length === 0 ? (
                <p className="text-center text-slate-400 italic text-sm py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                product.reviewsList.map((r: any, idx: number) => (
                  <div key={idx} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.userImage}
                          className="w-8 h-8 rounded-full border border-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {r.userName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {r.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            fill={s <= r.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {r.comment}
                    </p>
                    {r.photo && (
                      <img
                        src={r.photo}
                        className="w-20 h-20 object-cover rounded-lg border border-slate-100"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WishlistView = ({
  wishlist,
  products,
  toggleWishlist,
  addToCart,
  close,
}: any) => {
  const wishlistedProducts = products.filter((p: any) =>
    wishlist.includes(p.id),
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Heart className="text-rose-500 fill-rose-500" /> Saved Items
        </h2>
        <button
          onClick={close}
          className="px-5 py-2.5 bg-slate-100 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-slate-400 mb-6">
            Save items you want to buy later.
          </p>
          <button
            onClick={close}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((p: any) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative"
            >
              <button
                onClick={() => toggleWishlist(p.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 text-rose-500 rounded-full shadow-sm hover:bg-rose-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
              <div className="aspect-square rounded-2xl bg-slate-50 mb-4 overflow-hidden">
                <SafeProductImage
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 truncate">
                {p.name}
              </h4>
              <div className="flex justify-between items-center mt-3">
                <p className="text-orange-600 font-black text-lg">₹{p.price}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AIChatModal = ({
  chatMessages,
  setChatMessages,
  userQuery,
  setUserQuery,
  isTyping,
  setIsTyping,
  close,
}: any) => (
  <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/40 backdrop-blur-sm transition-all duration-500">
    <div className="bg-white w-full max-w-xl h-[85vh] md:h-[650px] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Home size={16} className="text-orange-500" fill="currentColor" />
          </div>
          <span className="tracking-tight">
            Myshop<span className="text-orange-500">Myhome</span> AI
          </span>
        </h3>
        <button
          onClick={close}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50 no-scrollbar">
        {chatMessages.map((m: any, i: number) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in`}
          >
            <div
              className={`p-4 rounded-[1.5rem] max-w-[85%] text-sm font-medium shadow-sm leading-relaxed ${m.role === "user" ? "bg-orange-600 text-white rounded-tr-none" : "bg-white border text-slate-800 rounded-tl-none"}`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="p-4 bg-white border w-fit rounded-[1.5rem] rounded-tl-none animate-pulse text-orange-600 text-xs font-bold tracking-widest uppercase">
            MyshopMyhome વિચારી રહ્યું છે...
          </div>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!userQuery.trim()) return;
          const q = userQuery;
          setChatMessages((p: any) => [...p, { role: "user", text: q }]);
          setUserQuery("");
          setIsTyping(true);
          const res = await getAssistantResponse(q);
          setChatMessages((p: any) => [...p, { role: "model", text: res }]);
          setIsTyping(false);
        }}
        className="p-6 bg-white border-t flex gap-3"
      >
        <input
          placeholder="સવાલ પૂછો..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="flex-grow p-4 bg-slate-100 rounded-[1.25rem] outline-none text-sm font-bold border-2 border-transparent focus:border-orange-600 focus:bg-white transition-all shadow-inner"
        />
        <button
          type="submit"
          className="bg-orange-600 text-white p-4 rounded-[1.25rem] shadow-xl hover:bg-orange-700 hover:rotate-6 transition-all active:scale-90"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  </div>
);

const CartDrawer = ({
  cart,
  close,
  checkout,
  removeFromCart,
  updateCartQuantity,
}: any) => (
  <div className="fixed inset-0 z-[200] flex justify-end items-end md:items-stretch bg-slate-900/40 backdrop-blur-sm transition-all duration-500">
    <div className="bg-white w-full md:max-w-md h-[85vh] md:h-full rounded-t-[1rem] md:rounded-none shadow-2xl flex flex-col p-6 md:p-6 animate-in slide-in-from-bottom md:slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          My Cart (
          {cart.reduce((acc: number, item: any) => acc + item.quantity, 0)})
        </h2>
        <button
          onClick={close}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 no-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <ShoppingCart size={40} />
            </div>
            <p className="text-slate-800 font-bold text-lg mb-2">
              Your cart is empty!
            </p>
            <p className="text-slate-500 text-sm">Add items to it now.</p>
            <button
              onClick={close}
              className="mt-6 bg-[#2874f0] text-white px-8 py-2.5 font-bold text-sm shadow-sm rounded-[2px]"
            >
              Shop Now
            </button>
          </div>
        ) : (
          cart.map((i: any, idx: number) => {
            const itemDiscount = getValidDiscount(i.price, i.oldPrice);
            return (
            <div
              key={idx}
              className="flex gap-4 items-start bg-white p-3 rounded-sm border border-slate-200 hover:shadow-sm transition-all"
            >
              <div className="w-20 h-20 flex-shrink-0">
                <SafeProductImage
                  src={i.image}
                  alt={i.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm text-slate-900 line-clamp-2 mb-1">
                  {i.name}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-slate-900 text-base">
                    ₹{i.price}
                  </span>
                  {itemDiscount.isValidDiscount && (
                    <>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{i.oldPrice}
                      </span>
                      <span className="text-xs font-bold text-[#388e3c]">
                        {itemDiscount.discountPercent}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md overflow-hidden h-8">
                    <button
                      onClick={() => updateCartQuantity(idx, -1)}
                      className="px-3 bg-slate-50 hover:bg-slate-100 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-xs">{i.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(idx, 1)}
                      className="px-3 bg-slate-50 hover:bg-slate-100 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
      <div className="pt-4 border-t mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-slate-800">Total Amount</span>
          <span className="text-xl font-bold text-slate-900">
            ₹{cart.reduce((s: any, i: any) => s + i.price * i.quantity, 0)}
          </span>
        </div>
        <button
          onClick={checkout}
          disabled={cart.length === 0}
          className="w-full py-3.5 bg-[#fb641b] text-white font-bold text-base shadow-sm hover:shadow-md transition-all disabled:opacity-50 uppercase rounded-[2px]"
        >
          Place Order
        </button>
      </div>
    </div>
  </div>
);

const CheckoutForm = ({
  customerInfo,
  setCustomerInfo,
  handleCheckout,
  close,
}: any) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "UPI" | "Razorpay"
  >("COD");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleGetLocation = () => {
    setLocationStatus("loading");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerInfo((prev: any) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setLocationStatus("success");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setLocationStatus("error");
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.location) {
      const confirmSubmit = window.confirm(
        "લોકેશન મેળવી શકાયું નથી. શું તમે લોકેશન વગર ઓર્ડર આપવા માંગો છો?",
      );
      if (!confirmSubmit) {
        handleGetLocation();
        return;
      }
    }
    setCustomerInfo({ ...customerInfo, paymentMethod });
    handleCheckout(e, paymentMethod);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 fade-in duration-300 overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            ડિલિવરી માહિતી
          </h2>
          <button
            type="button"
            onClick={close}
            className="hover:rotate-90 transition-transform p-2 bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              આખું નામ
            </label>
            <input
              required
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              મોબાઈલ નંબર
            </label>
            <input
              required
              type="tel"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              સરનામું
            </label>
            <input
              required
              value={customerInfo.society}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, society: e.target.value })
              }
              placeholder="ઘર નંબર, સોસાયટી..."
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              ગામ / શહેર
            </label>
            <input
              required
              value={customerInfo.village}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, village: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
              પિનકોડ
            </label>
            <input
              required
              value={customerInfo.pincode}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, pincode: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleGetLocation}
              className={`w-full p-4 rounded-2xl font-bold border-2 border-dashed flex items-center justify-center gap-2 transition-all ${locationStatus === "success" ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-300 text-slate-500 hover:border-indigo-600 hover:text-indigo-600"}`}
            >
              {locationStatus === "loading" ? (
                <span className="animate-pulse">Detecting Location...</span>
              ) : locationStatus === "success" ? (
                <>
                  {" "}
                  <CheckCircle2 size={20} /> Location Captured{" "}
                </>
              ) : (
                <>
                  {" "}
                  <MapPin size={20} /> Detect My Current Location{" "}
                </>
              )}
            </button>
            {locationStatus === "error" && (
              <p className="text-xs text-rose-500 font-bold mt-2 ml-2">
                Location access denied or unavailable.
              </p>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("COD")}
              className={`p-5 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                paymentMethod === "COD"
                  ? "border-orange-600 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
              }`}
            >
              <Package size={22} /> Cash on Delivery (COD)
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("UPI")}
              className={`p-5 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                paymentMethod === "UPI"
                  ? "border-orange-600 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
              }`}
            >
              <CreditCard size={22} /> UPI Online Payment
            </button>
          </div>

          {paymentMethod === "UPI" && (
            <p className="text-xs text-orange-600 font-bold mt-3 text-center bg-orange-50 p-3 rounded-xl border border-orange-100">
              👉 'ઓર્ડર કન્ફર્મ કરો' પર ક્લિક કરવાથી Razorpay પેમેન્ટ લિંક ખુલશે જ્યાંથી તમે UPI દ્વારા સરળતાથી પેમેન્ટ કરી શકશો.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-orange-600 text-white rounded-2xl text-xl font-black shadow-2xl hover:bg-slate-900 transition-all active:scale-95"
        >
          ઓર્ડર કન્ફર્મ કરો
        </button>
      </form>
    </div>
  );
};

const SuccessModal = ({ orderId, close }: any) => (
  <div className="fixed inset-0 z-[400] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
    <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 text-center animate-in zoom-in duration-500 shadow-[0_0_80px_rgba(249,115,22,0.3)] border border-orange-100">
      <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-3xl font-black mb-4 text-slate-900">અભિનંદન!</h2>
      <p className="text-slate-400 font-bold mb-10 leading-relaxed">
        તમારો ઓર્ડર સફળતાપૂર્વક લેવાઈ ગયો છે.
      </p>
      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-orange-200 mb-10">
        <span className="text-lg font-black text-orange-600 tracking-[0.2em] uppercase">
          {orderId}
        </span>
      </div>
      <button
        onClick={close}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl text-lg font-black hover:bg-orange-600 hover:shadow-2xl transition-all active:scale-90"
      >
        ખુબ ખુબ આભાર
      </button>
    </div>
  </div>
);

export default App;
