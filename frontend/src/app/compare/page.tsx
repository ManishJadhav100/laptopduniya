"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftRight, X, Trash2, ArrowRight, Laptop, ShieldCheck, Zap, TicketPercent, Award, TrendingDown, Crown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { fetchApiJson } from "@/lib/api";

interface SpecValue {
  spec_group: string;
  spec_key: string;
  value: string;
}

interface LaptopDetail {
  id: number;
  title: string;
  slug: string;
  base_price: string;
  image: string | null;
  brand: { name: string; slug: string };
  specifications: SpecValue[];
  ram_gb?: number;
  processor_type?: string;
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useAppContext();
  const [detailedLaptops, setDetailedLaptops] = useState<LaptopDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (compareList.length === 0) {
        setDetailedLaptops([]);
        return;
      }
      setLoading(true);
      try {
        const promises = compareList.map(async (l) => {
          return fetchApiJson<LaptopDetail>(`/laptops/${l.slug}/`);
        });
        const results = await Promise.all(promises);
        setDetailedLaptops(results.filter(r => r !== null));
      } catch (e) {
        console.error("Error fetching comparison details", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [compareList]);

  const allSpecKeys = Array.from(new Set(
    detailedLaptops.flatMap(l => l.specifications.map(s => `${s.spec_group}: ${s.spec_key}`))
  ));

  const getSpecValue = (laptop: LaptopDetail, compositeKey: string) => {
    const [group, key] = compositeKey.split(": ");
    const spec = laptop.specifications.find(s => s.spec_group === group && s.spec_key === key);
    return spec ? spec.value : "-";
  };

  const isWinner = (laptop: LaptopDetail, compositeKey: string) => {
    if (detailedLaptops.length < 2) return false;
    const value = getSpecValue(laptop, compositeKey);
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numValue)) return false;

    const allValues = detailedLaptops.map(l => parseFloat(getSpecValue(l, compositeKey).replace(/[^0-9.]/g, '')));
    const filteredValues = allValues.filter(v => !isNaN(v));

    if (compositeKey.toLowerCase().includes("price")) {
        return numValue === Math.min(...filteredValues);
    }
    return numValue === Math.max(...filteredValues) && numValue !== 0;
  };

  const getBadge = (laptop: LaptopDetail) => {
    const price = parseFloat(laptop.base_price);
    const ram = laptop.ram_gb || 0;
    
    if (ram >= 32) return { label: "Performance Beast", color: "bg-purple-500", icon: <Zap size={10}/> };
    if (price < 800) return { label: "Budget King", color: "bg-[#10B981]", icon: <Award size={10}/> };
    if (laptop.title.toLowerCase().includes("pro") || laptop.title.toLowerCase().includes("ultra")) return { label: "Pro Choice", color: "bg-blue-600", icon: <Crown size={10}/> };
    return null;
  };

  if (compareList.length === 0) {
    return (
      <div className="bg-[#fcfdfd] min-h-screen py-32 text-center flex flex-col items-center font-sans">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
           <ArrowLeftRight className="w-10 h-10 text-gray-200" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Your comparison list is empty</h2>
        <p className="text-gray-500 font-bold mb-10 max-w-sm">Select up to 4 laptops to see their technical specifications side-by-side.</p>
        <Link href="/laptops" className="bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl uppercase tracking-widest text-xs flex items-center gap-2">
           Explore Laptops <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans overflow-x-auto">
      <div className="max-w-[1140px] mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
           <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-2">
                 <ShieldCheck size={12}/> Hardware Benchmarking
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                 Compare Pro <span className="text-blue-500 font-light invisible md:visible">/ Expert Analysis</span>
              </h1>
           </div>
           <button onClick={clearCompare} className="flex items-center gap-2 bg-gray-900 text-white font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg active:scale-95">
              <Trash2 size={14} /> Reset List
           </button>
        </div>

        {loading ? (
           <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
              <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Syncing Performance Data...</p>
           </div>
        ) : (
           <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden min-w-[1000px]">
              <table className="w-full text-left border-collapse table-fixed">
                 <thead>
                    <tr className="border-b-8 border-[#fcfdfd]">
                       <th className="p-8 bg-gray-900 w-[280px] text-white">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-4">Comparison Engine</h4>
                          <Link href="/laptops" className="inline-flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all">
                             Add Laptop
                          </Link>
                       </th>
                       {detailedLaptops.map((l) => {
                          const badge = getBadge(l);
                          return (
                          <th key={l.id} className="p-8 bg-white border-l border-gray-100 relative group">
                             <button onClick={() => removeFromCompare(l.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <X size={20} />
                             </button>
                             <div className="flex flex-col items-center">
                                {badge && (
                                   <div className={`mb-4 px-3 py-1 ${badge.color} text-white text-[8px] font-black uppercase rounded-full flex items-center gap-1 shadow-md animate-bounce`}>
                                      {badge.icon} {badge.label}
                                   </div>
                                )}
                                <div className="h-32 bg-gray-50 border border-gray-100 p-4 rounded-3xl flex items-center justify-center mb-6 mix-blend-multiply w-full relative">
                                   {l.image ? <img src={l.image} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" /> : <Laptop size={32} className="text-gray-200" />}
                                </div>
                                <h3 className="text-sm font-black text-gray-900 text-center leading-tight mb-4 min-h-[40px] px-2">{l.title}</h3>
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting From</span>
                                    <div className={`px-5 py-2 rounded-2xl font-black text-lg shadow-sm border ${isWinner(l, "price") ? 'bg-[#10B981] border-[#10B981] text-white shadow-[#10B981]/20' : 'bg-white border-gray-100 text-gray-900'}`}>
                                        ₹{l.base_price}
                                        {isWinner(l, "price") && <TrendingDown size={14} className="inline ml-1" />}
                                    </div>
                                </div>
                             </div>
                          </th>
                       )})}
                       {Array.from({ length: 4 - detailedLaptops.length }).map((_, idx) => (
                         <th key={idx} className="p-8 bg-gray-50/50 border-l border-gray-100 text-center">
                            <div className="flex flex-col items-center opacity-30">
                               <div className="w-24 h-24 bg-gray-200 rounded-[2rem] mb-6 flex items-center justify-center"><Laptop size={32} className="text-gray-400"/></div>
                               <div className="w-32 h-4 bg-gray-200 rounded-full mb-3" />
                               <div className="w-20 h-4 bg-gray-200 rounded-full" />
                            </div>
                         </th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    <tr className="bg-[#fcfdfd]">
                       <td className="p-6 pl-10 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] border-r border-gray-100">Performance Index</td>
                       {detailedLaptops.map(l => (
                          <td key={l.id} className="p-6 text-center border-l border-gray-100">
                             <div className="flex items-center justify-center gap-1.5">
                                {[1,2,3,4,5].map(v => (
                                    <div key={v} className={`w-3 h-1 rounded-full ${v <= (l.ram_gb || 0)/12 ? 'bg-[#10B981]' : 'bg-gray-200'}`} />
                                ))}
                             </div>
                          </td>
                       ))}
                       {Array.from({ length: 4 - detailedLaptops.length }).map((_, idx) => <td key={idx} className="p-6 border-l border-gray-100"></td>)}
                    </tr>

                    {allSpecKeys.map((compositeKey) => (
                       <tr key={compositeKey} className="group hover:bg-emerald-50/30 transition-all">
                          <td className="p-6 pl-10 font-black text-[10px] uppercase tracking-wider border-r border-gray-100 relative bg-gray-50/50">
                             <div className="flex flex-col">
                                <span className="text-gray-400 text-[8px] mb-0.5 opacity-70">{compositeKey.split(": ")[0]}</span>
                                <span className="text-gray-900 text-xs">{compositeKey.split(": ")[1]}</span>
                             </div>
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[#10B981] group-hover:h-full transition-all" />
                          </td>
                          {detailedLaptops.map(l => (
                             <td key={l.id} className={`p-6 text-center text-xs font-bold border-l border-gray-50 transition-colors ${isWinner(l, compositeKey) ? 'bg-emerald-50/80 text-[#10B981]' : 'text-gray-600'}`}>
                                <div className="flex items-center justify-center gap-2">
                                    {getSpecValue(l, compositeKey)}
                                    {isWinner(l, compositeKey) && <Zap size={10} className="fill-[#10B981]"/>}
                                </div>
                             </td>
                          ))}
                          {Array.from({ length: 4 - detailedLaptops.length }).map((_, idx) => <td key={idx} className="p-6 border-l border-gray-100"></td>)}
                       </tr>
                    ))}
                    
                    <tr className="border-t-8 border-[#fcfdfd]">
                       <td className="p-10 pl-10 bg-gray-900 border-r border-gray-100">
                          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-2">Verdict</h4>
                          <p className="text-gray-400 text-[9px] font-bold">Ready to secure your hardware?</p>
                       </td>
                       {detailedLaptops.map(l => (
                          <td key={l.id} className="p-10 text-center border-l border-gray-100 bg-white">
                             <Link href={`/laptops/${l.slug}`} className="group bg-[#10B981] hover:bg-gray-900 text-white font-black py-4 px-6 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95">
                                Select Deal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </Link>
                          </td>
                       ))}
                       {Array.from({ length: 4 - detailedLaptops.length }).map((_, idx) => <td key={idx} className="p-10 border-l border-gray-100 bg-gray-50/30"></td>)}
                    </tr>
                 </tbody>
              </table>
           </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
           {[
              { icon: <ShieldCheck className="text-[#10B981]"/>, title: "Unbiased Logic", desc: "Winners are calculated based on raw spec data and industry benchmarks." },
              { icon: <Zap className="text-orange-500"/>, title: "Hardware-Deep", desc: "We look beyond marketing jargon to the actual components inside." },
              { icon: <ArrowLeftRight className="text-blue-500"/>, title: "Real-time Sync", desc: "Prices and stock levels are updated every 60 minutes." }
           ].map((p, i) => (
              <div key={i} className="flex gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">{p.icon}</div>
                 <div>
                    <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{p.title}</h5>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{p.desc}</p>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
}
