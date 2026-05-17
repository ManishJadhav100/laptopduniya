"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Monitor, Cpu, Zap, CreditCard, Box, Target, ChevronRight } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
}

export default function FilterSidebar({ brands, categories }: { brands: Brand[], categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [minPrice, setMinPrice] = useState(searchParams.get("price_min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("price_max") || "");

  // Active filter count logic
  const activeCount = Array.from(searchParams.keys()).filter(k => k !== 'ordering').length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("price_min", minPrice); else params.delete("price_min");
    if (maxPrice) params.set("price_max", maxPrice); else params.delete("price_max");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/laptops");
    setIsOpen(false);
  };

  const isActive = (key: string, value: string) => searchParams.get(key) === value;

  const FilterContent = () => (
    <div className="flex flex-col gap-6 pb-20">
      {/* Use Case (Categories) */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Target size={14} className="text-red-500"/> Use Case
         </h4>
         <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button 
                key={c.slug}
                onClick={() => updateFilters("category", isActive("category", c.slug) ? null : c.slug)}
                className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase transition-all ${isActive("category", c.slug) ? 'bg-red-500 border-red-500 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-red-500 hover:text-red-500'}`}
              >
                {c.name}
              </button>
            ))}
         </div>
      </div>

      {/* Brand Selection */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Box size={14} className="text-[#10B981]"/> Manufacturer
         </h4>
         <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <button 
                key={b.slug}
                onClick={() => updateFilters("brand", isActive("brand", b.slug) ? null : b.slug)}
                className={`px-4 py-2 rounded-xl border-2 text-[11px] font-black uppercase transition-all ${isActive("brand", b.slug) ? 'bg-[#10B981] border-[#10B981] text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-[#10B981] hover:text-[#10B981]'}`}
              >
                {b.name}
              </button>
            ))}
         </div>
      </div>

      {/* Price Range */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <CreditCard size={14} className="text-yellow-500"/> Budget Range
         </h4>
         <form onSubmit={handlePriceSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
               <input 
                 type="number" 
                 placeholder="Min" 
                 value={minPrice}
                 onChange={(e) => setMinPrice(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-[#10B981] transition-all outline-none"
               />
               <span className="text-gray-300">-</span>
               <input 
                 type="number" 
                 placeholder="Max" 
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-[#10B981] transition-all outline-none"
               />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#10B981] transition-all shadow-lg">Set Budget</button>
         </form>
      </div>

      {/* RAM / Performance */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap size={14} className="text-blue-500"/> Memory (RAM)
         </h4>
         <div className="flex flex-col gap-1">
            {["8", "16", "18", "32", "64"].map((r) => (
              <button 
                key={r}
                onClick={() => updateFilters("ram", isActive("ram", r) ? null : r)}
                className={`flex items-center justify-between p-3 rounded-xl border-l-4 transition-all ${isActive("ram", r) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#fcfdfd] border-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="text-xs font-black uppercase">{r} GB</span>
                {isActive("ram", r) && <X size={12}/>}
              </button>
            ))}
         </div>
      </div>

      {/* Processor Family */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Cpu size={14} className="text-purple-500"/> Processor
         </h4>
         <div className="flex flex-col gap-1">
            {["Core i9", "Core i7", "Core i5", "Ryzen 9", "Ryzen 7", "Apple M3"].map((p) => (
              <button 
                key={p}
                onClick={() => updateFilters("processor", isActive("processor", p) ? null : p)}
                className={`flex items-center justify-between p-3 rounded-xl border-l-4 transition-all ${isActive("processor", p) ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-[#fcfdfd] border-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="text-xs font-black uppercase">{p}</span>
                {isActive("processor", p) && <X size={12}/>}
              </button>
            ))}
         </div>
      </div>

      {/* Display Size */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Monitor size={14} className="text-orange-500"/> Screen Size
         </h4>
         <div className="flex flex-wrap gap-2">
            {[
              { label: "13-14\"", min: "13", max: "14.5" },
              { label: "15-16\"", min: "15", max: "16.5" }
            ].map((d) => {
              const active = searchParams.get("display_min") === d.min;
              return (
                <button 
                  key={d.label}
                  onClick={() => {
                    updateFilters("display_min", active ? null : d.min);
                    updateFilters("display_max", active ? null : d.max);
                  }}
                  className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${active ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-orange-500 hover:text-orange-500'}`}
                >
                  {d.label}
                </button>
              );
            })}
         </div>
      </div>

      <button 
        onClick={clearFilters}
        className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-2 border-gray-100 rounded-xl py-4 hover:border-red-500 hover:text-red-500 transition-all font-sans mb-10"
      >
        Reset All Filters
      </button>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <div className="hidden lg:block sticky top-28 h-auto overflow-y-auto pr-2 custom-scrollbar">
        <FilterContent />
      </div>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all active:scale-95">
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl shadow-gray-400 flex items-center gap-3 border-2 border-white"
          >
             <Filter size={18} className={activeCount > 0 ? "text-[#10B981]" : "text-white"}/>
             <span className="text-xs font-black uppercase tracking-widest">Filters</span>
             {activeCount > 0 && (
                <div className="bg-[#10B981] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {activeCount}
                </div>
             )}
          </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-bottom duration-300">
           <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <Filter className="text-[#10B981]"/> Filter Options 
                    {activeCount > 0 && <span className="text-[#10B981]">({activeCount})</span>}
                 </h3>
                 <button onClick={() => setIsOpen(false)} className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-red-500 transition-all">
                    <X size={24}/>
                 </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 pt-6 bg-[#fcfdfd]">
                 <FilterContent />
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                 <button 
                   onClick={() => setIsOpen(false)}
                   className="w-full bg-[#10B981] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100"
                 >
                    View Matching Results
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
