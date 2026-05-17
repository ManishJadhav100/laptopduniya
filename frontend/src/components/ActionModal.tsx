"use client";
import React, { useState, useEffect } from "react";
import { X, ExternalLink, TicketPercent, Zap, ShieldCheck } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { buildOutboundGatewayUrl } from "@/lib/outbound-gateway";

export default function ActionModal() {
  const { actionModal, closeActionModal } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with open/close
  useEffect(() => {
    if (!actionModal.isOpen) {
      setSuccess(false);
    } else {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [actionModal.isOpen]);

  if (!actionModal.isOpen || !actionModal.data) return null;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModal.data) return;
    setLoading(true);
    
    // Simulate lead capture
    console.log(`[LEAD CAPTURED] Brand: ${actionModal.data.brandName}`);

    if (actionModal.data.code) {
      void navigator.clipboard.writeText(actionModal.data.code).catch(() => undefined);
    }

    const redirectUrl = buildOutboundGatewayUrl({
      targetUrl: actionModal.data.link,
      title: actionModal.data.title,
      brandName: actionModal.data.brandName,
      couponCode: actionModal.data.code,
      linkType: actionModal.data.isDeal ? "deal" : "coupon",
    });

    const redirectWindow = window.open(redirectUrl, "_blank", "noopener,noreferrer");

    if (!redirectWindow) {
      window.location.assign(redirectUrl);
    }

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      closeActionModal();
    }, 300);
  };

  const data = actionModal.data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeActionModal}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header Decor */}
        <div className={`h-2 w-full ${data.isDeal ? "bg-orange-500" : "bg-[#10B981]"}`} />
        
        <button 
          onClick={closeActionModal}
          className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all hover:bg-white hover:shadow-md"
        >
          <X size={20} />
        </button>

        <div className="p-10">
          {/* Badge & Title */}
          <div className="flex flex-col items-center text-center mb-8">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-100 ${data.isDeal ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-[#10B981]"}`}>
                {data.isDeal ? <Zap size={32} /> : <TicketPercent size={32} />}
             </div>
             
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{data.brandName || "Special Offer"}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${data.isDeal ? "text-orange-500" : "text-[#10B981]"}`}>
                    {data.isDeal ? "Verified Deal" : "Exclusive Coupon"}
                </span>
             </div>
             
             <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4">{data.title}</h2>
             
             {data.description && (
                <p className="text-gray-500 font-bold text-sm leading-relaxed italic line-clamp-2">
                    "{data.description}"
                </p>
             )}
          </div>

          {/* Action Area */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
             {!data.isDeal && data.code && (
                <div className="flex flex-col items-center mb-8">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Copy Coupon Code</span>
                    <div className="w-full bg-white border-2 border-dashed border-emerald-200 py-4 rounded-xl text-center select-all">
                        <span className="text-2xl font-black text-gray-800 tracking-[0.3em] font-mono">{data.code}</span>
                    </div>
                </div>
             )}

             <form onSubmit={handleContinue} className="flex flex-col gap-4 mt-6">
                <button 
                    type="submit"
                    disabled={loading || success}
                    className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${success ? "bg-[#10B981] text-white" : "bg-gray-900 text-white hover:bg-[#10B981]"}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : success ? (
                        <>Success! Opening Link <ExternalLink size={16} /></>
                    ) : (
                        <>{data.code ? "Copy Code & Continue" : "Continue to Offer"} <ExternalLink size={16} /></>
                    )}
                </button>
             </form>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">
             <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#10B981]" /> Encryption Active</div>
             <div className="flex items-center gap-1.5"><ExternalLink size={12} /> Redirecting to Official Store</div>
          </div>
        </div>
      </div>
    </div>
  );
}
