"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Box,
  FileText,
  HelpCircle,
  Loader2,
  Search,
  Smartphone,
  Star,
  Target,
  X,
} from "lucide-react";
import { formatImageUrl } from "@/lib/url-utils";
import { getApiUrl } from "@/lib/api";

interface SearchResult {
  brands: any[];
  laptops: any[];
  categories: any[];
  news: any[];
  reviews: any[];
  guides: any[];
  solutions: any[];
}

export default function SearchAutocomplete({
  placeholder = "Search phones, brands, chipsets...",
  isMobile = false,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        void fetchResults();
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/search/?q=${encodeURIComponent(query)}`));
      if (res.ok) {
        const data = (await res.json()) as SearchResult;
        setResults(data);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Search fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyResults =
    results &&
    (results.brands.length > 0 ||
      results.laptops.length > 0 ||
      results.categories.length > 0 ||
      results.news.length > 0 ||
      results.reviews.length > 0 ||
      results.guides.length > 0 ||
      results.solutions.length > 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center w-full">
        <Search
          className={`absolute left-4 ${isMobile ? "text-gray-400" : "text-[#10B981]"} w-5 h-5 pointer-events-none`}
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full py-3 pl-12 pr-12 rounded-2xl outline-none text-sm transition-all border ${
            isMobile
              ? "bg-gray-50 border-gray-100 focus:bg-white focus:border-[#10B981] text-gray-900 font-bold"
              : "bg-white border-gray-100 focus:border-[#10B981] shadow-sm font-bold text-gray-800"
          }`}
        />
        <div className="absolute right-4 flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 text-[#10B981] animate-spin" />
          ) : query.length > 0 ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-300 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {isOpen && results ? (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
            {(results.brands.length > 0 || results.categories.length > 0) && (
              <div className="p-4 border-b border-gray-50 bg-[#fcfdfd]">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                  Quick Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.brands.map((brand: any) => (
                    <Link
                      key={brand.slug}
                      href={`/brands/${brand.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 bg-white hover:bg-[#10B981] hover:text-white rounded-lg text-[10px] font-black uppercase transition-all border border-gray-100 shadow-sm flex items-center gap-1.5"
                    >
                      <Box size={10} /> {brand.name}
                    </Link>
                  ))}
                  {results.categories.map((category: any) => (
                    <Link
                      key={category.slug}
                      href={`/mobiles?category=${category.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 bg-white hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all border border-gray-100 shadow-sm flex items-center gap-1.5"
                    >
                      <Target size={10} /> {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col">
                {results.laptops.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 flex items-center gap-2">
                      <Smartphone size={12} className="text-blue-500" /> Phones & Deals
                    </h4>
                    <div className="flex flex-col">
                      {results.laptops.map((phone: any) => (
                        <Link
                          key={phone.slug}
                          href={`/mobiles/${phone.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-3 hover:bg-emerald-50 rounded-xl transition-all group"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0 group-hover:bg-white transition-colors">
                            {phone.image ? (
                              <img
                                src={formatImageUrl(phone.image)}
                                alt={phone.title}
                                className="max-h-full object-contain"
                              />
                            ) : (
                              <Smartphone className="w-5 h-5 text-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-black text-gray-800 leading-tight group-hover:text-[#10B981] truncate">
                              {phone.title}
                            </h5>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                              Rs. {phone.base_price} • {phone.processor_type || "Flagship Chip"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col border-l border-gray-50">
                {(results.news.length > 0 || results.guides.length > 0) && (
                  <div className="mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 flex items-center gap-2">
                      <BookOpen size={12} className="text-purple-500" /> News & Guides
                    </h4>
                    <div className="flex flex-col">
                      {[...results.news, ...results.guides].slice(0, 4).map((item: any) => (
                        <Link
                          key={item.slug}
                          href={results.news.includes(item) ? `/news/${item.slug}` : `/guides/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                            {results.news.includes(item) ? (
                              <FileText size={14} className="text-gray-400" />
                            ) : (
                              <BookOpen size={14} className="text-gray-400" />
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-gray-600 group-hover:text-purple-700 truncate">
                            {item.title}
                          </h5>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(results.solutions.length > 0 || results.reviews.length > 0) && (
                  <div className="mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 flex items-center gap-2">
                      <HelpCircle size={12} className="text-orange-500" /> Reviews & Solutions
                    </h4>
                    <div className="flex flex-col">
                      {[...results.reviews, ...results.solutions].slice(0, 4).map((item: any) => (
                        <Link
                          key={item.slug}
                          href={results.reviews.includes(item) ? `/reviews/${item.slug}` : `/solutions/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                            {results.reviews.includes(item) ? (
                              <Star size={14} className="text-yellow-500" />
                            ) : (
                              <HelpCircle size={14} className="text-gray-400" />
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-gray-600 group-hover:text-orange-700 truncate">
                            {item.title}
                          </h5>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!hasAnyResults && (
              <div className="p-8 text-center bg-[#fcfdfd]">
                <p className="text-sm font-bold text-gray-400">
                  No matches found for "{query}"
                </p>
                <Link
                  href="/mobiles"
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mt-2 inline-block hover:underline"
                >
                  Browse All Mobiles
                </Link>
              </div>
            )}

            {hasAnyResults && (
              <Link
                href={`/mobiles?search=${query}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-4 bg-gray-50 hover:bg-[#10B981] hover:text-white text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] transition-all"
              >
                Explore All Matching Content <ArrowRight size={14} className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
