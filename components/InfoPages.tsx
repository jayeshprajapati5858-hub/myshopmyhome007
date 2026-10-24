import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
  Info,
  Mail,
  MapPin,
  Clock,
  Phone,
  RefreshCw,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { BuyingGuide, Product, StoreSettings } from "../types";
import { AdSlot } from "./AdSlot";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [title, description]);
}

const PageContainer: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Store
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ShoppingBag size={14} /> Browse Products
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <header className="bg-slate-900 text-white p-6 md:p-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold mb-4">
            {icon}
            <span>MyshopMyhome.shop</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            {subtitle}
          </p>
        </header>

        <div className="p-6 md:p-10 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
          {children}
        </div>
      </article>
    </div>
  );
};

export const AboutPage: React.FC<{
  settings: StoreSettings;
  products: Product[];
}> = ({ settings, products }) => {
  usePageMeta(
    "About Us | MyshopMyhome.shop",
    "Learn about MyshopMyhome.shop, our mobile accessories and electronics catalog, and how we serve customers."
  );

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  return (
    <PageContainer
      title="About Us"
      subtitle="Practical mobile accessories and everyday electronics with transparent product information."
      icon={<Info size={14} />}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Who We Are</h2>
        <p>
          Welcome to <strong>{settings.businessName || "MyshopMyhome.shop"}</strong>. We operate an online store focused on mobile accessories and utility electronics, helping customers find compatible charging accessories, cables, screen protection, batteries, and audio gear.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">What We Offer</h2>
        <p>
          Our catalog is organized to make it straightforward to compare product specifications, check return eligibility before ordering, and place orders using Cash on Delivery (COD) or online payment via Razorpay.
        </p>
        {categories.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
              Current Store Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to="/"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Our Approach to Product Listings</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Clear Return Badges:</strong> Every product page states whether the item carries a{" "}
            <span className="font-semibold">7 Days Return</span> policy or is marked{" "}
            <span className="font-semibold">No Return</span> prior to checkout.
          </li>
          <li>
            <strong>Verified Customer Reviews:</strong> Product ratings are calculated from customer reviews submitted on the store rather than pre-filled ratings.
          </li>
          <li>
            <strong>Practical Buying Guides:</strong> We publish original guides to help shoppers check charger wattage, cable types, and battery care before purchasing.
          </li>
        </ul>
      </section>

      {(settings.businessAddress || settings.registrationDetails) && (
        <section className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Business Information</h2>
          {settings.businessAddress && (
            <p className="text-sm">
              <strong>Address:</strong> {settings.businessAddress}
            </p>
          )}
          {settings.registrationDetails && (
            <p className="text-sm">
              <strong>Registration Details:</strong> {settings.registrationDetails}
            </p>
          )}
        </section>
      )}
    </PageContainer>
  );
};

export const ContactPage: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  usePageMeta(
    "Contact Us | MyshopMyhome.shop",
    "Get in touch with MyshopMyhome.shop for order inquiries, product questions, or return requests."
  );

  const hasDirectContact = Boolean(
    settings.supportEmail?.trim() ||
      settings.supportPhone?.trim() ||
      settings.businessAddress?.trim()
  );

  return (
    <PageContainer
      title="Contact Us"
      subtitle="Reach out to us for order assistance, product questions, or return support."
      icon={<Mail size={14} />}
    >
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Customer Support Channels</h2>
        {hasDirectContact ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.supportEmail?.trim() && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
                <Mail className="text-blue-600 shrink-0 mt-1" size={22} />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
                  <a
                    href={`mailto:${settings.supportEmail.trim()}`}
                    className="text-blue-600 font-semibold hover:underline break-all"
                  >
                    {settings.supportEmail.trim()}
                  </a>
                </div>
              </div>
            )}

            {settings.supportPhone?.trim() && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
                <Phone className="text-orange-600 shrink-0 mt-1" size={22} />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Phone / WhatsApp</h3>
                  <a
                    href={`tel:${settings.supportPhone.trim()}`}
                    className="text-slate-800 font-semibold hover:underline"
                  >
                    {settings.supportPhone.trim()}
                  </a>
                </div>
              </div>
            )}

            {settings.businessAddress?.trim() && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4 md:col-span-2">
                <MapPin className="text-emerald-600 shrink-0 mt-1" size={22} />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Store / Office Address</h3>
                  <p className="text-slate-700 whitespace-pre-line">
                    {settings.businessAddress.trim()}
                  </p>
                </div>
              </div>
            )}

            {settings.businessHours?.trim() && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4 md:col-span-2">
                <Clock className="text-slate-600 shrink-0 mt-1" size={22} />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Support Hours</h3>
                  <p className="text-slate-700">{settings.businessHours.trim()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <p className="text-slate-700">
              For existing orders, you can sign in to your account and open{" "}
              <strong>My Orders</strong> to view your order status, tracking updates, cancellation options (for Pending orders), or return requests.
            </p>
            <p className="text-xs text-slate-500">
              Direct phone, email, and physical address details are managed in the store’s administration settings and are displayed here as soon as configured by the store owner.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">How to Get Faster Help With an Order</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Keep your <strong>Order ID</strong> ready when inquiring about delivery or payment status.</li>
          <li>To cancel an unshipped order, log in, open <strong>My Orders</strong>, and select <strong>Cancel Order</strong> while the status is still <em>Pending</em>.</li>
          <li>To request a return on an eligible delivered item, open <strong>My Orders</strong> and use the <strong>Return/Refund</strong> button to submit your reason.</li>
        </ul>
      </section>
    </PageContainer>
  );
};

export const ShippingDeliveryPage: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  usePageMeta(
    "Shipping and Delivery | MyshopMyhome.shop",
    "Information about order processing, address details, and delivery tracking on MyshopMyhome.shop."
  );

  return (
    <PageContainer
      title="Shipping and Delivery"
      subtitle="How orders are processed, dispatched, and tracked on MyshopMyhome.shop."
      icon={<Truck size={14} />}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Delivery Address & Pin Code Accuracy</h2>
        <p>
          During checkout, customers provide their full name, mobile number, house/society details, village/city, and pin code, with an optional GPS location capture to help delivery personnel locate the address accurately. Please verify your pin code and phone number before confirming your order.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Order Status & Tracking Updates</h2>
        <p>
          Every order placed on <strong>MyshopMyhome.shop</strong> goes through clear status stages visible in the <strong>My Orders</strong> section of your account:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Pending:</strong> Your order has been received and is awaiting confirmation/dispatch.</li>
          <li><strong>Confirmed / Shipped:</strong> Your order has been packed and handed over for delivery. Where available, an estimated delivery date and tracking link are added to your order details.</li>
          <li><strong>Delivered:</strong> Your order has been delivered to your specified address.</li>
        </ul>
      </section>

      {settings.shippingSummary?.trim() && (
        <section className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Shipping Charges & Coverage</h2>
          <p className="whitespace-pre-line">{settings.shippingSummary.trim()}</p>
        </section>
      )}

      {settings.deliveryTimeline?.trim() && (
        <section className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Estimated Delivery Timelines</h2>
          <p className="whitespace-pre-line">{settings.deliveryTimeline.trim()}</p>
        </section>
      )}
    </PageContainer>
  );
};

export const ReturnsRefundsPage: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  usePageMeta(
    "Cancellation, Returns and Refunds | MyshopMyhome.shop",
    "Understand order cancellation rules, product-level return eligibility, and how to submit a return request on MyshopMyhome.shop."
  );

  return (
    <PageContainer
      title="Cancellation, Returns and Refunds"
      subtitle="Clear rules on how order cancellations and product return requests work."
      icon={<RefreshCw size={14} />}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Order Cancellation Policy</h2>
        <p>
          {settings.cancellationPolicy?.trim() ||
            'Orders that are currently in "Pending" status can be cancelled directly by logging into your account, opening "My Orders", and clicking the "Cancel Order" button.'}
        </p>
        <p>
          Once an order has been processed or dispatched, self-service cancellation is no longer active in the order portal.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Product Return Eligibility</h2>
        <p>
          Return eligibility is displayed transparently on every product card and product detail page before you add an item to your cart:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>7 Days Return:</strong> Products marked with the{" "}
            <span className="text-emerald-700 font-semibold">7 Days Return</span> badge are eligible for a return/replacement request after delivery if there is a defect, damage, or issue with the item.
          </li>
          <li>
            <strong>No Return:</strong> Products marked with the{" "}
            <span className="text-rose-600 font-semibold">No Return</span> badge are final sale items unless damaged in transit. Please check the badge on the product page before ordering.
          </li>
        </ul>
        {settings.returnPolicySummary?.trim() && (
          <p className="text-slate-700 whitespace-pre-line pt-2">
            {settings.returnPolicySummary.trim()}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. How to Submit a Return Request</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Sign in to your customer account on <strong>MyshopMyhome.shop</strong>.</li>
          <li>Open <strong>My Orders</strong> and locate your delivered order.</li>
          <li>Click <strong>Return/Refund</strong>, describe the reason for the return, and submit the request.</li>
          <li>You can track the status of your return request (<em>Requested</em>, <em>Approved</em>, <em>Rejected</em>, or <em>Completed</em>) directly inside <strong>My Orders</strong>.</li>
        </ol>
      </section>

      {settings.refundTimeline?.trim() && (
        <section className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Refund Processing Details</h2>
          <p className="whitespace-pre-line">{settings.refundTimeline.trim()}</p>
        </section>
      )}
    </PageContainer>
  );
};

export const TermsPage: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  usePageMeta(
    "Terms and Conditions | MyshopMyhome.shop",
    "Terms of use, pricing, account responsibilities, and order conditions for MyshopMyhome.shop."
  );

  return (
    <PageContainer
      title="Terms and Conditions"
      subtitle="Terms governing the use of MyshopMyhome.shop and purchases made through the store."
      icon={<FileText size={14} />}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Overview</h2>
        <p>
          By accessing or placing an order on <strong>{settings.businessName || "MyshopMyhome.shop"}</strong>, you agree to provide accurate delivery and contact information and to use the website in accordance with applicable laws.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Product Information and Pricing</h2>
        <p>
          All prices are listed in Indian Rupees (₹). We strive to display accurate product descriptions, images, and pricing. If a compare-at price is shown, a discount badge is displayed only when the compare-at price is higher than the current selling price.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Payments</h2>
        <p>
          Customers may choose between Cash on Delivery (COD) and online payments processed securely through Razorpay (supporting UPI and other supported payment modes). Online payment credentials are processed directly by Razorpay and are not stored on our servers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. User Accounts & Reviews</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account password. Product reviews submitted by users must reflect genuine experiences with the product and must not contain unlawful, abusive, or misleading content.
        </p>
      </section>

      {settings.warrantySummary?.trim() && (
        <section className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">5. Product Warranty Terms</h2>
          <p className="whitespace-pre-line">{settings.warrantySummary.trim()}</p>
        </section>
      )}
    </PageContainer>
  );
};

export const PrivacyPolicyPage: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  usePageMeta(
    "Privacy Policy | MyshopMyhome.shop",
    "Read how MyshopMyhome.shop collects, uses, and protects customer data, cookies, payment processing, and third-party advertising."
  );

  return (
    <PageContainer
      title="Privacy Policy"
      subtitle="How we handle customer data, order details, cookies, and third-party services."
      icon={<Shield size={14} />}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          When you create an account, update your profile, or place an order on{" "}
          <strong>{settings.businessName || "MyshopMyhome.shop"}</strong>, we collect the information necessary to fulfill your order and provide customer support:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Account & Contact Data:</strong> Your name, mobile number, and account login identifier.</li>
          <li><strong>Delivery Address:</strong> House number, society/street, landmark, village/city, taluka, district, and pin code.</li>
          <li><strong>Optional Location Data:</strong> If you grant browser geolocation permission during checkout, your latitude and longitude coordinates are attached to the order to assist delivery. You can decline location sharing and still place an order.</li>
          <li><strong>Order & Payment Records:</strong> Ordered items, order totals, payment method (COD or Razorpay), and Razorpay transaction/order identifiers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To process, deliver, and track your orders.</li>
          <li>To handle cancellations, return requests, and customer support inquiries.</li>
          <li>To maintain your saved profile and order history across sessions.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Third-Party Infrastructure & Payment Processing</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Firebase (Google Cloud):</strong> We use Google Firebase Authentication and Cloud Firestore to store account profiles, product catalog data, and order records.
          </li>
          <li>
            <strong>Razorpay:</strong> Online payments are processed via Razorpay. Your UPI PIN, card numbers, or bank login credentials are entered directly in Razorpay’s secure checkout interface and are never stored by MyshopMyhome.shop.
          </li>
        </ul>
      </section>

      <section className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          4. Cookies and Google / Third-Party Advertising Disclosure
        </h2>
        <p>
          We use local storage and cookies to keep you signed in, remember items in your cart or wishlist, and support offline caching through our Progressive Web App (PWA) service worker.
        </p>
        <p>
          We may also use third-party advertising services such as <strong>Google AdSense</strong> on informational or editorial pages of this website:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the internet.
          </li>
          <li>
            Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.
          </li>
          <li>
            Users may opt out of personalized advertising by visiting{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline inline-flex items-center gap-1"
            >
              Google Ads Settings <ExternalLink size={12} />
            </a>{" "}
            or{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline inline-flex items-center gap-1"
            >
              www.aboutads.info <ExternalLink size={12} />
            </a>
            .
          </li>
          <li>
            To learn more about how Google uses data when you use partner sites or apps, please visit:{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline inline-flex items-center gap-1 break-all"
            >
              https://policies.google.com/technologies/partner-sites <ExternalLink size={12} />
            </a>
          </li>
        </ul>
      </section>

      {settings.supportEmail?.trim() && (
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">5. Contact Regarding Privacy</h2>
          <p>
            If you have questions about your account data or wish to request corrections, please contact us at{" "}
            <a href={`mailto:${settings.supportEmail.trim()}`} className="text-blue-600 font-semibold underline">
              {settings.supportEmail.trim()}
            </a>
            .
          </p>
        </section>
      )}
    </PageContainer>
  );
};

export const FaqPage: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  usePageMeta(
    "Frequently Asked Questions (FAQ) | MyshopMyhome.shop",
    "Answers to common questions about ordering, payment methods, charger compatibility, cancellations, and returns on MyshopMyhome.shop."
  );

  const faqs = [
    {
      q: "What payment methods are accepted on MyshopMyhome.shop?",
      a: "You can pay using Cash on Delivery (COD) or online payment via Razorpay (which supports UPI apps and other standard online payment methods).",
    },
    {
      q: "How do I know if a product can be returned?",
      a: "Every product listing displays either a '7 Days Return' badge or a 'No Return' badge on the product card and product detail page. Please check this badge before placing your order.",
    },
    {
      q: "How can I cancel my order?",
      a: "If your order is still in 'Pending' status, sign in to your account, open 'My Orders' from the menu, and click 'Cancel Order'.",
    },
    {
      q: "Why is the browser asking for my location during checkout?",
      a: "Location capture is an optional step that helps delivery personnel find your address in villages or societies where street names may be unclear. If you prefer not to share GPS coordinates, you can still confirm your order using your written address and pin code.",
    },
    {
      q: "Can I use a 65W fast charger with a phone that only supports 18W or 33W?",
      a: "Yes, provided the charger is from a quality manufacturer and uses compatible USB standards. The smartphone controls how much power it draws and will only pull its maximum supported wattage. Read our Buying Guides for a detailed explanation.",
    },
    {
      q: "Why does a 10,000mAh power bank not charge a 5,000mAh phone twice?",
      a: "Power bank capacity is rated at the internal cell voltage (~3.7V), whereas phones charge at 5V or higher. Due to voltage conversion and normal heat loss, about 60%–70% of the rated mAh is delivered to the phone.",
    },
  ];

  return (
    <PageContainer
      title="Frequently Asked Questions"
      subtitle="Clear answers about shopping, payments, order tracking, and mobile accessory usage."
      icon={<HelpCircle size={14} />}
    >
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
          >
            <h2 className="text-base md:text-lg font-bold text-slate-900">
              {item.q}
            </h2>
            <p className="text-slate-600 text-sm md:text-base">{item.a}</p>
          </div>
        ))}
      </div>

      <AdSlot
        slotId={settings.adsenseFaqSlotId}
        enabledByAdmin={settings.adsenseEnabled}
      />

      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">
            Looking for technical advice before buying?
          </h3>
          <p className="text-xs md:text-sm text-slate-600">
            Explore our practical buying guides on chargers, power banks, earphones, and cable care.
          </p>
        </div>
        <Link
          to="/buying-guides"
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shrink-0 inline-flex items-center gap-2"
        >
          <BookOpen size={16} /> Read Buying Guides
        </Link>
      </div>
    </PageContainer>
  );
};

export const BuyingGuidesPage: React.FC<{
  guides: BuyingGuide[];
  settings: StoreSettings;
}> = ({ guides, settings }) => {
  usePageMeta(
    "Buying Guides & Mobile Accessory Tips | MyshopMyhome.shop",
    "Practical, original buying guides on choosing compatible phone chargers, power banks, earphones, and caring for charging cables."
  );

  return (
    <PageContainer
      title="Buying Guides & Helpful Articles"
      subtitle="Original, practical guides to help you choose compatible mobile accessories and make them last longer."
      icon={<BookOpen size={14} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            to={`/buying-guides/${guide.slug}`}
            className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between bg-white"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                <span>{guide.category}</span>
                <span className="text-slate-400 font-medium">{guide.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {guide.summary}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
              Read Full Guide <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      <AdSlot
        slotId={settings.adsenseGuideSlotId}
        enabledByAdmin={settings.adsenseEnabled}
      />
    </PageContainer>
  );
};

export const BuyingGuideDetailPage: React.FC<{
  guides: BuyingGuide[];
  settings: StoreSettings;
}> = ({ guides, settings }) => {
  const { slug } = useParams();
  const guide = guides.find((g) => g.slug === slug) || guides[0];

  usePageMeta(
    guide ? `${guide.title} | MyshopMyhome.shop` : "Buying Guide | MyshopMyhome.shop",
    guide ? guide.summary : "Practical buying guide for mobile accessories."
  );

  if (!guide) {
    return (
      <PageContainer
        title="Guide Not Found"
        subtitle="The requested buying guide could not be found."
        icon={<BookOpen size={14} />}
      >
        <Link to="/buying-guides" className="text-blue-600 font-bold underline">
          View all Buying Guides
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={guide.title}
      subtitle={guide.summary}
      icon={<BookOpen size={14} />}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-b pb-4">
        <span className="px-2.5 py-1 bg-orange-50 text-orange-700 font-bold rounded-full">
          {guide.category}
        </span>
        <span>{guide.readTime}</span>
        <span>•</span>
        <span>Last updated: {guide.updatedAt}</span>
        <Link
          to="/buying-guides"
          className="ml-auto text-blue-600 font-bold hover:underline"
        >
          ← All Buying Guides
        </Link>
      </div>

      <div className="space-y-8">
        {guide.sections.map((sec, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">{sec.heading}</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {sec.body}
            </p>
            {sec.checklist && sec.checklist.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 mt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Checklist
                </p>
                <ul className="space-y-2">
                  {sec.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      <AdSlot
        slotId={settings.adsenseGuideSlotId}
        enabledByAdmin={settings.adsenseEnabled}
      />

      <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/buying-guides"
          className="text-sm font-bold text-slate-600 hover:text-blue-600"
        >
          ← Back to All Buying Guides
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
        >
          <ShoppingBag size={15} /> Shop Accessories
        </Link>
      </div>
    </PageContainer>
  );
};

export const SiteFooter: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-lg">
                <Home size={20} className="text-blue-600" fill="currentColor" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                Myshop<span className="text-orange-400">Myhome.shop</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Online store for mobile chargers, data cables, replacement batteries, screen protectors, and everyday electronic accessories.
            </p>
            {settings.supportEmail?.trim() && (
              <p className="text-xs text-slate-300">
                <strong>Email:</strong> {settings.supportEmail.trim()}
              </p>
            )}
            {settings.supportPhone?.trim() && (
              <p className="text-xs text-slate-300">
                <strong>Phone:</strong> {settings.supportPhone.trim()}
              </p>
            )}
          </div>

          {/* Shopping & Guides */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Shop & Guides
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/buying-guides" className="hover:text-white transition-colors">
                  Buying Guides & Tips
                </Link>
              </li>
              <li>
                <Link
                  to="/buying-guides/how-to-choose-compatible-phone-charger"
                  className="hover:text-white transition-colors text-xs text-slate-400"
                >
                  • Phone Charger Compatibility Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/buying-guides/what-to-check-before-buying-a-power-bank"
                  className="hover:text-white transition-colors text-xs text-slate-400"
                >
                  • Power Bank Buying Checklist
                </Link>
              </li>
              <li>
                <Link
                  to="/buying-guides/basic-care-and-safe-use-of-charging-cables-and-adapters"
                  className="hover:text-white transition-colors text-xs text-slate-400"
                >
                  • Cable & Adapter Safety Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/shipping-delivery" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Store Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/returns-refunds" className="hover:text-white transition-colors">
                  Cancellation, Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.businessName || "MyshopMyhome.shop"}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/returns-refunds" className="hover:text-white">
              Returns
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
