"use client";
import React, { memo } from "react";
import Link from "next/link";
import { ArrowLeftRight, Heart, Smartphone, Star, TicketPercent } from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { formatImageUrl } from "@/lib/url-utils";

interface LaptopCardProps {
  laptop: {
    id: number;
    title: string;
    slug: string;
    base_price: string;
    image: string | null;
    brand?: { name: string; slug: string };
  };
}

function LaptopCardComponent({ laptop }: LaptopCardProps) {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    isInCompare,
  } = useAppContext();

  const currentPrice = Number(laptop.base_price || 0);
  const listPrice = currentPrice + Math.max(2000, Math.round(currentPrice * 0.08));

  const handleWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isInWishlist(laptop.id)) {
      removeFromWishlist(laptop.id);
    } else {
      addToWishlist(laptop);
    }
  };

  const handleCompare = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isInCompare(laptop.id)) {
      removeFromCompare(laptop.id);
    } else {
      addToCompare(laptop);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 transition-all duration-300 transform translate-x-0 md:translate-x-12 md:group-hover:translate-x-0">
        <button
          type="button"
          onClick={handleWishlist}
          className={`p-2.5 rounded-xl shadow-lg border border-gray-100 transition-all ${
            isInWishlist(laptop.id)
              ? "bg-red-500 text-white"
              : "bg-white text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={18} fill={isInWishlist(laptop.id) ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={handleCompare}
          className={`p-2.5 rounded-xl shadow-lg border border-gray-100 transition-all ${
            isInCompare(laptop.id)
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-400 hover:text-blue-500"
          }`}
        >
          <ArrowLeftRight size={18} />
        </button>
      </div>

      <div className="absolute top-0 left-0 bg-gray-900 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-sm">
        Verified
      </div>

      <Link href={`/mobiles/${laptop.slug}`} className="contents">
        <div className="h-44 flex items-center justify-center p-6 bg-[#fafafa] rounded-xl mb-6 relative mix-blend-multiply border border-gray-50 group-hover:bg-emerald-50/20 transition-colors">
          {laptop.image ? (
            <Image
              src={formatImageUrl(laptop.image)}
              alt={`${laptop.title} review and price at PhoneRadar`}
              width={300}
              height={200}
              unoptimized
              className="max-h-full w-auto object-contain group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <Smartphone size={40} className="text-gray-200" />
          )}
        </div>

        <div className="flex flex-col gap-1 mb-4 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
              4.8 <Star size={8} fill="currentColor" />
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              {laptop.brand?.name || "Featured"} Phone
            </span>
          </div>
          <h3 className="text-base font-black text-gray-900 group-hover:text-[#10B981] leading-tight transition-colors line-clamp-2">
            {laptop.title}
          </h3>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#10B981]">
                Rs. {currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-gray-400 font-bold line-through tracking-tighter leading-none">
                Rs. {listPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
              Street price tracked by PhoneRadar
            </p>
          </div>

          <div className="w-full bg-[#10B981] group-hover:bg-[#059669] text-white font-black py-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/10">
            <TicketPercent size={14} /> Check Price
          </div>
        </div>
      </Link>
    </div>
  );
}

export default memo(LaptopCardComponent);
