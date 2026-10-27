import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { INITIAL_PRODUCTS } from '../constants.js';

const firebaseConfig = {
  apiKey: "AIzaSyDoG_FkvlV-w4vfwD7yz1CqGBbb4wxphoI",
  authDomain: "mobigear-641d5.firebaseapp.com",
  databaseURL: "https://mobigear-641d5-default-rtdb.firebaseio.com",
  projectId: "mobigear-641d5",
  storageBucket: "mobigear-641d5.firebasestorage.app",
  messagingSenderId: "773717226551",
  appId: "1:773717226551:web:3a499b9137e87def81fbb2",
  measurementId: "G-6TPH3DG3S7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let products = [...INITIAL_PRODUCTS];
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const firestoreProducts: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id) {
          firestoreProducts.push(data);
        }
      });
      if (firestoreProducts.length > 0) {
        products = firestoreProducts;
      }
    } catch (dbErr) {
      console.warn("Failed to fetch products from Firestore for sitemap, using initial products:", dbErr);
    }

    const domain = "https://www.myshopmyhome.shop";
    const staticPages = [
      { url: "", priority: "1.0", changefreq: "daily" },
      { url: "/buying-guides", priority: "0.8", changefreq: "weekly" },
      { url: "/faq", priority: "0.8", changefreq: "weekly" },
      { url: "/about", priority: "0.7", changefreq: "monthly" },
      { url: "/contact", priority: "0.7", changefreq: "monthly" },
      { url: "/shipping-delivery", priority: "0.6", changefreq: "monthly" },
      { url: "/returns-refunds", priority: "0.6", changefreq: "monthly" },
      { url: "/terms", priority: "0.5", changefreq: "monthly" },
      { url: "/privacy-policy", priority: "0.5", changefreq: "monthly" },
    ];

    const xmlItems = [
      ...staticPages.map(
        (p) => `  <url>
    <loc>${domain}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
      ),
      ...products
        .filter((p: any) => p.status !== "draft" && p.listingConfirmed !== false)
        .map(
          (p: any) => `  <url>
    <loc>${domain}/product/${p.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
        ),
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems.join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return res.status(200).send(sitemapXml);
  } catch (error: any) {
    console.error("Sitemap Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate sitemap" });
  }
}
