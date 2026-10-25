import React, { useState, useEffect } from "react";
import { ImageOff, Package } from "lucide-react";
import { Product } from "../types";

const KNOWN_MISMATCHED_STOCK_URLS: { urlPart: string; wrongForKeywords: string[]; reason: string }[] = [
  {
    urlPart: "photo-1541140134513-85a161dc4a00",
    wrongForKeywords: ["glass", "ગ્લાસ", "tempered", "screen", "charger", "cable", "battery"],
    reason: "Stock image shows a keyboard, which appears inconsistent with the product title.",
  },
  {
    urlPart: "photo-1629131726692-1accd0c53ce0",
    wrongForKeywords: ["charger", "ચાર્જર", "adapter", "cable", "glass", "battery"],
    reason: "Stock image shows a gaming controller, which appears inconsistent with a charger/accessory title.",
  },
  {
    urlPart: "photo-1590487988256-9ed24133863e",
    wrongForKeywords: ["battery", "બેટરી", "power", "charger", "cable", "glass"],
    reason: "Stock image does not clearly depict the titled mobile battery product.",
  },
];

export function isPlaceholderOrTestProduct(product: Product): boolean {
  if (product.listingConfirmed) return false;
  const trimmed = (product.name || "").trim().toLowerCase();
  if (!trimmed) return true;
  if (
    trimmed === "fgh" ||
    trimmed === "test" ||
    trimmed === "asdf" ||
    trimmed === "qwerty" ||
    trimmed === "abc" ||
    trimmed === "demo" ||
    trimmed === "sample"
  ) {
    return true;
  }
  return false;
}

export function isPubliclyVisibleProduct(product: Product): boolean {
  if (!product) return false;
  if (product.status === "draft") return false;
  if (isPlaceholderOrTestProduct(product) && !product.listingConfirmed) {
    return false;
  }
  return true;
}

export function getValidDiscount(price?: number, oldPrice?: number): {
  isValidDiscount: boolean;
  discountPercent: number;
  hasInvalidOldPrice: boolean;
} {
  const numPrice = Number(price);
  const numOldPrice = oldPrice !== undefined && oldPrice !== null && String(oldPrice) !== "" ? Number(oldPrice) : undefined;

  if (numOldPrice === undefined || isNaN(numOldPrice) || numOldPrice === 0) {
    return { isValidDiscount: false, discountPercent: 0, hasInvalidOldPrice: false };
  }

  if (isNaN(numPrice) || numPrice <= 0) {
    return { isValidDiscount: false, discountPercent: 0, hasInvalidOldPrice: true };
  }

  if (numOldPrice <= numPrice) {
    return { isValidDiscount: false, discountPercent: 0, hasInvalidOldPrice: true };
  }

  const pct = Math.round(((numOldPrice - numPrice) / numOldPrice) * 100);
  if (pct <= 0 || pct >= 100) {
    return { isValidDiscount: false, discountPercent: 0, hasInvalidOldPrice: pct <= 0 };
  }

  return { isValidDiscount: true, discountPercent: pct, hasInvalidOldPrice: false };
}

export function getVerifiedReviewStats(product: Product): {
  hasVerifiedReviews: boolean;
  reviewCount: number;
  averageRating: number;
} {
  const list = Array.isArray(product?.reviewsList)
    ? product.reviewsList.filter(
        (r) =>
          r &&
          typeof r.rating === "number" &&
          r.rating >= 1 &&
          r.rating <= 5 &&
          typeof r.comment === "string" &&
          r.comment.trim().length > 0
      )
    : [];

  if (list.length === 0) {
    return {
      hasVerifiedReviews: false,
      reviewCount: 0,
      averageRating: 0,
    };
  }

  const sum = list.reduce((acc, r) => acc + Number(r.rating), 0);
  const avg = Number((sum / list.length).toFixed(1));
  return {
    hasVerifiedReviews: true,
    reviewCount: list.length,
    averageRating: avg,
  };
}

export function getImageConsistencyWarning(product: Product): string | null {
  if (product.imageConfirmed) return null;
  const img = (product.image || "").trim();
  if (!img) {
    return "Product is missing a primary image URL.";
  }
  if (img.includes("picsum.photos") || img.includes("via.placeholder.com")) {
    return "Product uses a generic random placeholder image URL (picsum/placeholder) that may not match the product title.";
  }

  const titleAndCat = `${product.name || ""} ${product.category || ""}`.toLowerCase();
  for (const item of KNOWN_MISMATCHED_STOCK_URLS) {
    if (img.includes(item.urlPart)) {
      const matchesKeyword = item.wrongForKeywords.some((kw) => titleAndCat.includes(kw.toLowerCase()));
      if (matchesKeyword) {
        return item.reason;
      }
    }
  }

  return null;
}

export interface ProductQualityWarning {
  type: "placeholder_title" | "broken_image" | "image_mismatch" | "invalid_price" | "unverified_reviews" | "draft";
  message: string;
}

export function getProductQualityWarnings(
  product: Product,
  isImageBroken?: boolean
): ProductQualityWarning[] {
  const warnings: ProductQualityWarning[] = [];

  if (product.status === "draft") {
    warnings.push({
      type: "draft",
      message: "Draft / Unpublished: Hidden from public store catalog until published.",
    });
  }

  if (isPlaceholderOrTestProduct(product)) {
    warnings.push({
      type: "placeholder_title",
      message: `Possible test/placeholder listing ("${product.name}"). Hidden from public catalog until you confirm or rename it.`,
    });
  }

  if (isImageBroken || !(product.image || "").trim()) {
    warnings.push({
      type: "broken_image",
      message: "Product image failed to load or is missing. Upload a replacement photo.",
    });
  }

  const mismatchWarning = getImageConsistencyWarning(product);
  if (mismatchWarning) {
    warnings.push({
      type: "image_mismatch",
      message: mismatchWarning,
    });
  }

  const discountCheck = getValidDiscount(product.price, product.oldPrice);
  if (discountCheck.hasInvalidOldPrice) {
    warnings.push({
      type: "invalid_price",
      message: `Compare-at / original price (₹${product.oldPrice}) must be greater than current sale price (₹${product.price}). Discount badge is hidden.`,
    });
  }

  return warnings;
}

export const SafeProductImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onBrokenChange?: (isBroken: boolean) => void;
}> = ({ src, alt, className = "", fallbackClassName = "", onBrokenChange }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!src || !src.trim());
  }, [src]);

  if (hasError || !src || !src.trim()) {
    return (
      <div
        role="img"
        aria-label={`${alt} - Image unavailable`}
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-2 text-center select-none ${fallbackClassName || className}`}
      >
        <Package size={20} className="mb-1 opacity-70 text-slate-500" />
        <span className="text-[10px] font-semibold leading-tight text-slate-600 truncate max-w-full">
          {alt || "Item"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          if (onBrokenChange) onBrokenChange(true);
        }
      }}
      onLoad={() => {
        if (onBrokenChange) onBrokenChange(false);
      }}
    />
  );
};
