import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface AdSlotProps {
  slotId?: string;
  enabledByAdmin?: boolean;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

const ALLOWED_EDITORIAL_PATH_PREFIXES = ["/buying-guides", "/faq"];
const VALID_ADSENSE_CLIENT_REGEX = /^ca-pub-\d{16}$/;

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  enabledByAdmin = false,
  format = "auto",
  className = "",
}) => {
  const location = useLocation();
  const adInitialized = useRef(false);

  const clientId = (import.meta.env.VITE_ADSENSE_CLIENT_ID || "").trim();
  const envEnabled = import.meta.env.VITE_ENABLE_ADS === "true";
  const resolvedSlotId = (slotId || import.meta.env.VITE_ADSENSE_DEFAULT_SLOT_ID || "").trim();

  const isEditorialRoute = ALLOWED_EDITORIAL_PATH_PREFIXES.some(
    (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  );

  const isValidClient = VALID_ADSENSE_CLIENT_REGEX.test(clientId);
  const isValidSlot = /^\d{6,20}$/.test(resolvedSlotId);
  const shouldRender = isEditorialRoute && isValidClient && isValidSlot && (envEnabled || enabledByAdmin);

  useEffect(() => {
    if (!shouldRender) return;

    // Dynamically load AdSense script only when a real client ID is configured and enabled
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        clientId
      )}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    if (!adInitialized.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adInitialized.current = true;
      } catch (err) {
        console.warn("AdSense push skipped:", err);
      }
    }
  }, [shouldRender, clientId, resolvedSlotId]);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 mx-auto max-w-4xl px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center ${className}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
        Advertisement
      </div>
      <ins
        className="adsbygoogle block"
        data-ad-client={clientId}
        data-ad-slot={resolvedSlotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
};
