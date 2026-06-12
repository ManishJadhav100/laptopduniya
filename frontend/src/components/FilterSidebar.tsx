"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Cpu, CreditCard, Filter, Smartphone, Target, X, Zap } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
}

export default function FilterSidebar({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("price_min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("price_max") || "");

  const activeCount = Array.from(searchParams.keys()).filter(
    (key) => key !== "ordering",
  ).length;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
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

  const handlePriceSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("price_min", minPrice);
    else params.delete("price_min");
    if (maxPrice) params.set("price_max", maxPrice);
    else params.delete("price_max");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/mobiles");
    setIsOpen(false);
  };

  const isActive = (key: string, value: string) => searchParams.get(key) === value;

  const filterContent = (
    <div className="flex flex-col gap-6 pb-20">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Target size={14} className="text-red-500" /> Phone Focus
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() =>
                updateFilters(
                  "category",
                  isActive("category", category.slug) ? null : category.slug,
                )
              }
              className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase transition-all ${
                isActive("category", category.slug)
                  ? "bg-red-500 border-red-500 text-white shadow-md"
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:border-red-500 hover:text-red-500"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Box size={14} className="text-[#10B981]" /> Brand
        </h4>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand.slug}
              type="button"
              onClick={() =>
                updateFilters("brand", isActive("brand", brand.slug) ? null : brand.slug)
              }
              className={`px-4 py-2 rounded-xl border-2 text-[11px] font-black uppercase transition-all ${
                isActive("brand", brand.slug)
                  ? "bg-[#10B981] border-[#10B981] text-white shadow-lg"
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:border-[#10B981] hover:text-[#10B981]"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <CreditCard size={14} className="text-yellow-500" /> Budget Range
        </h4>
        <form onSubmit={handlePriceSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-[#10B981] transition-all outline-none"
            />
            <span className="text-gray-300">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-[#10B981] transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#10B981] transition-all shadow-lg"
          >
            Set Budget
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Zap size={14} className="text-blue-500" /> Memory (RAM)
        </h4>
        <div className="flex flex-col gap-1">
          {["8", "12", "16"].map((ram) => (
            <button
              key={ram}
              type="button"
              onClick={() => updateFilters("ram", isActive("ram", ram) ? null : ram)}
              className={`flex items-center justify-between p-3 rounded-xl border-l-4 transition-all ${
                isActive("ram", ram)
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-[#fcfdfd] border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-black uppercase">{ram} GB</span>
              {isActive("ram", ram) ? <X size={12} /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Cpu size={14} className="text-purple-500" /> Chipset
        </h4>
        <div className="flex flex-col gap-1">
          {[
            "Apple A18",
            "Snapdragon 8 Elite",
            "Snapdragon 8 Gen 3",
            "Google Tensor G4",
            "Dimensity 9400",
            "Snapdragon 7s Gen 3",
          ].map((chipset) => (
            <button
              key={chipset}
              type="button"
              onClick={() =>
                updateFilters(
                  "processor",
                  isActive("processor", chipset) ? null : chipset,
                )
              }
              className={`flex items-center justify-between p-3 rounded-xl border-l-4 transition-all ${
                isActive("processor", chipset)
                  ? "bg-purple-50 border-purple-500 text-purple-700"
                  : "bg-[#fcfdfd] border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-black uppercase">{chipset}</span>
              {isActive("processor", chipset) ? <X size={12} /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Smartphone size={14} className="text-orange-500" /> Screen Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '6.0-6.4"', min: "6", max: "6.4" },
            { label: '6.5-6.9"', min: "6.5", max: "6.9" },
            { label: "Foldables", min: "7", max: "8" },
          ].map((display) => {
            const active = searchParams.get("display_min") === display.min;
            return (
              <button
                key={display.label}
                type="button"
                onClick={() => {
                  updateFilters("display_min", active ? null : display.min);
                  updateFilters("display_max", active ? null : display.max);
                }}
                className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white shadow-lg"
                    : "bg-gray-50 border-gray-100 text-gray-500 hover:border-orange-500 hover:text-orange-500"
                }`}
              >
                {display.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-2 border-gray-100 rounded-xl py-4 hover:border-red-500 hover:text-red-500 transition-all font-sans mb-10"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block sticky top-28 h-auto overflow-y-auto pr-2 custom-scrollbar">
        {filterContent}
      </div>

      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all active:scale-95">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl shadow-gray-400 flex items-center gap-3 border-2 border-white"
        >
          <Filter
            size={18}
            className={activeCount > 0 ? "text-[#10B981]" : "text-white"}
          />
          <span className="text-xs font-black uppercase tracking-widest">
            Filters
          </span>
          {activeCount > 0 ? (
            <div className="bg-[#10B981] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">
              {activeCount}
            </div>
          ) : null}
        </button>
      </div>

      {isOpen ? (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                <Filter className="text-[#10B981]" /> Filter Options
                {activeCount > 0 ? (
                  <span className="text-[#10B981]">({activeCount})</span>
                ) : null}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-red-500 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-6 bg-[#fcfdfd]">
              {filterContent}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#10B981] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100"
              >
                View Matching Results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
