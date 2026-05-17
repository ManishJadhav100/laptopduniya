"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2777699093936446";

interface AdSenseBlockProps {
  slot?: string;
  label: string;
  className?: string;
}

export default function AdSenseBlock({
  slot="6542869990",
  label,
  className = "",
}: AdSenseBlockProps) {
  const hasRequestedAd = useRef(false);

  useEffect(() => {
    if (!slot || hasRequestedAd.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasRequestedAd.current = true;
    } catch {
      hasRequestedAd.current = false;
    }
  }, [slot]);

  return (
    <div
      className={`rounded-[1.5rem] border border-gray-200 bg-white/90 p-4 shadow-sm ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
          {label}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
          Google Ads
        </span>
      </div>

      {slot ? (
        <ins
          className="adsbygoogle block min-h-[160px] w-full overflow-hidden rounded-2xl bg-gray-50"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
          <p className="text-sm font-black text-gray-700">
            Ad slot placeholder ready
          </p>
          <p className="mt-2 max-w-md text-xs font-bold leading-relaxed text-gray-500">
            Add your AdSense slot ID to this block when you are ready to serve
            ads on the redirect pages.
          </p>
        </div>
      )}
    </div>
  );
}
