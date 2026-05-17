"use client";
import React from "react";
import { ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function DealCard({ deal }: { deal: any }) {
  const { openActionModal } = useAppContext();

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    openActionModal({
      title: deal.title,
      description: deal.description,
      link: deal.link,
      isDeal: true,
      brandName: deal.brand?.name
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col relative shadow-sm">
      
      <div className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded shadow-sm">PRICE DROP</div>

      {/* Brand Icon Area */}
      <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center font-black text-xs text-yellow-600 uppercase tracking-tighter mb-6">
        {deal.brand?.name}
      </div>

      <h2 className="text-xl font-black text-gray-900 leading-tight mb-4 flex-1">{deal.title}</h2>
      
      <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed line-clamp-3 italic">
        {deal.description}
      </p>

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
          <span className="flex items-center gap-1"><Clock size={12} /> Ending Soon</span>
          <span className="flex items-center gap-1 text-blue-600"><ShieldCheck size={12} /> Verified Today</span>
        </div>
        
        <button 
          onClick={handleAction}
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          ACTIVATE DEAL <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
