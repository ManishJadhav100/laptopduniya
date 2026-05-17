"use client";
import React from "react";
import { ShieldCheck, Clock, Scissors, ExternalLink } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function CouponCard({ coupon }: { coupon: any }) {
  const { openActionModal } = useAppContext();

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    openActionModal({
      title: coupon.title,
      description: coupon.description,
      code: coupon.code,
      link: coupon.link,
      isDeal: !!coupon.is_deal,
      brandName: coupon.brand?.name
    });
  };

  return (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:border-[#10B981] transition-all group relative overflow-hidden flex flex-col shadow-sm">
      
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-black text-xs text-gray-400 uppercase tracking-tighter">
          {coupon.brand?.name}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-[#10B981] tracking-widest">
            {coupon.is_deal ? 'Direct Deal' : 'Promo Code'}
          </span>
          <h2 className="text-xl font-black text-gray-900 leading-tight line-clamp-2">{coupon.title}</h2>
        </div>
      </div>

      <p className="text-sm font-bold text-gray-500 mb-8 flex-1 leading-relaxed">
        {coupon.description}
      </p>

      <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
        <div className="flex items-center justify-between text-[11px] font-black uppercase text-gray-400">
          <span className="flex items-center gap-1"><Clock size={12} /> Expiry: {coupon.expiry_date || 'Ongoing'}</span>
          <span className="flex items-center gap-1 text-green-600"><ShieldCheck size={12} /> Verified Today</span>
        </div>
        
        {coupon.is_deal ? (
          <button 
            onClick={handleAction}
            className="w-full bg-gray-900 text-white font-black py-4 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-[#10B981] transition-all uppercase tracking-widest text-xs cursor-pointer"
          >
            GET DEAL NOW <ExternalLink size={14} />
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="w-full bg-emerald-50 border-2 border-emerald-100 border-dashed py-4 rounded-xl text-center relative group-hover:border-[#10B981]">
              <span className="text-lg font-black text-gray-800 tracking-widest">{coupon.code}</span>
            </div>
            <button 
              onClick={handleAction}
              className="w-full bg-[#10B981] text-white font-black py-4 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-[#059669] transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              COPY & ACTIVATE <Scissors size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
