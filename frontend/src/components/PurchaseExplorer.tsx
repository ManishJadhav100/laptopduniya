"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, ShieldCheck, Award, ExternalLink, TicketPercent } from "lucide-react";
import { formatImageUrl } from "@/lib/url-utils";
import { buildOutboundGatewayUrl } from "@/lib/outbound-gateway";

interface Retailer {
  store: {
    name: string;
    logo?: string;
  };
  price: string;
  url: string;
  is_available: boolean;
}

// We no longer need an interactive Provider because the backend handles the "Selection" (syncing base_price)
export function PurchaseProvider({ children }: { children: React.ReactNode, retailers: Retailer[] }) {
  return <>{children}</>;
}

interface PurchaseExplorerProps {
  laptop: any;
  retailers: Retailer[];
  defaultPrice: string;
  defaultLink: string;
  type: 'header' | 'table' | 'sticky';
}

export function PurchaseExplorer({ laptop, retailers, defaultPrice, defaultLink, type }: PurchaseExplorerProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always use the synced base price from the backend.
  const currentPrice = defaultPrice;
  const currentLink = defaultLink;
  
  // Find the store name that corresponds to the best price if retailers exist
  const bestRetailer = retailers && retailers.length > 0 ? retailers[0] : null; 
  const currentStore = bestRetailer ? bestRetailer.store.name : "Verified Stores";
  const currentGatewayLink = buildOutboundGatewayUrl({
    targetUrl: currentLink,
    title: laptop.title,
    brandName: laptop.brand?.name,
    storeName: currentStore,
    linkType: "retailer",
  });

  // STICKY BAR: Bottom docking quick-buy
  if (type === 'sticky') {
    if (!isScrolled) return null;
    return (
      <div className="fixed bottom-0 left-0 w-full z-[100] animate-in slide-in-from-bottom duration-300">
         <div className="max-w-[1200px] mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-3 flex items-center justify-between mx-auto">
                <div className="flex items-center gap-4">
                    {laptop.image ? (
                        <img src={formatImageUrl(laptop.image)} alt={laptop.title} className="h-10 w-10 object-contain mix-blend-multiply" />
                    ) : (
                        <div className="h-10 w-10 bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-200 uppercase">No Img</div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 leading-none mb-1">{laptop.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Best Live Price</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-[#10B981] leading-none">₹{currentPrice}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Live Deal</span>
                    </div>
                    <a 
                      href={currentGatewayLink} 
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="bg-[#10B981] hover:bg-[#059669] text-white text-[10px] font-black px-6 py-3 rounded-full shadow-lg transition-all uppercase tracking-widest flex items-center gap-2"
                    >
                       Get Deal <ChevronRight size={12} />
                    </a>
                </div>
            </div>
         </div>
      </div>
    );
  }

  // HEADER: Best Price Display
  if (type === 'header') {
    return (
      <div id="price-summary-static" className="flex flex-col gap-8">
          <div className="flex justify-between items-start">
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   <div className="bg-emerald-50 text-[#10B981] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100/50">Best Phone Price</div>
                   <div className="flex items-center gap-0.5 text-yellow-400">
                      {[1,2,3,4,5].map(i => <Award key={i} size={10} fill="currentColor" />)}
                   </div>
                </div>
                <h1 className="text-[22px] font-black text-gray-900 tracking-tight leading-[1.2]">{laptop.title}</h1>
             </div>
             <div className="flex flex-col items-end group">
                <div className="relative">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-right">Selling Price</span>
                    <div className="flex items-center gap-1">
                       <p className="text-3xl font-extrabold text-[#10B981] tracking-tighter transition-all group-hover:scale-105">
                         ₹{currentPrice}
                       </p>
                       <div className="animate-pulse w-1 h-1 bg-[#10B981] rounded-full mt-3"></div>
                    </div>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4">
             <a 
               href={currentGatewayLink} 
               target="_blank"
               rel="noopener noreferrer sponsored"
               className="group relative w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-center text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                <TicketPercent className="w-5 h-5" /> GRAB THIS DEAL
             </a>
             <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> SECURE CHECKOUT</span>
                <span className="h-4 w-px bg-gray-200"></span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-emerald-500" /> VERIFIED LINK</span>
             </div>
          </div>
      </div>
    );
  }

  // TABLE: Store Grid (Links only)
  return (
      <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 px-1">
             <h3 className="text-lg font-black text-gray-900 tracking-tight">Available Store Offers</h3>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live prices from verified retailers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {retailers.map((retailer: Retailer, idx: number) => {
                const isLowest = idx === 0; // Since grouped by price
                const retailerGatewayLink = buildOutboundGatewayUrl({
                  targetUrl: retailer.url,
                  title: laptop.title,
                  brandName: laptop.brand?.name,
                  storeName: retailer.store.name,
                  linkType: "retailer",
                });
                return (
                   <a 
                     key={idx} 
                     href={retailerGatewayLink}
                     target="_blank"
                     rel="noopener noreferrer sponsored"
                     className={`group relative bg-white border-2 rounded-[2rem] p-6 transition-all duration-500 flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${isLowest ? 'border-[#10B981] ring-4 ring-emerald-50' : 'border-gray-100'}`}
                   >
                       {isLowest && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-10 whitespace-nowrap">
                             Current Lowest Price
                          </div>
                       )}

                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center p-2 bg-gray-50/50 transition-all ${isLowest ? 'border-[#10B981] bg-emerald-50' : 'border-gray-100 group-hover:border-emerald-200'}`}>
                             {retailer.store.logo ? <img src={retailer.store.logo} alt={retailer.store.name} className="max-h-full object-contain mix-blend-multiply" /> : <div className="text-xl font-black text-gray-300">{retailer.store.name[0]}</div>}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-lg font-black text-gray-900">{retailer.store.name}</span>
                             <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Visit Online Store</span>
                          </div>
                       </div>

                       <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Live Price</span>
                             <span className={`text-xl font-black ${isLowest ? 'text-[#10B981]' : 'text-gray-900'}`}>₹{retailer.price}</span>
                          </div>
                          <div className={`p-3 rounded-xl transition-all ${isLowest ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-900 group-hover:text-white'}`}>
                             <ExternalLink size={16} />
                          </div>
                       </div>
                   </a>
                );
             })}
          </div>
      </section>
  );
}

function Truck({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
