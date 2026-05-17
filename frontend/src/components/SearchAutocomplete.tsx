"use client";
import React, { useState, useEffect, useRef, useDeferredValue } from "react";
import Link from "next/link";
import { Search, Loader2, Laptop, Box, ArrowRight, X, FileText, BookOpen, Star, HelpCircle, Target } from "lucide-react";
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

export default function SearchAutocomplete({ placeholder = "Search laptops, brands, specs...", isMobile = false }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchResults();
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
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      }
    } catch (err) {
      console.error("Search fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyResults = results && (
    results.brands.length > 0 || 
    results.laptops.length > 0 || 
    results.categories.length > 0 || 
    results.news.length > 0 || 
    results.reviews.length > 0 || 
    results.guides.length > 0 || 
    results.solutions.length > 0
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center w-full">
        <Search className={`absolute left-4 ${isMobile ? 'text-gray-400' : 'text-[#10B981]'} w-5 h-5 pointer-events-none`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full py-3 pl-12 pr-12 rounded-2xl outline-none text-sm transition-all border ${
            isMobile 
              ? 'bg-gray-50 border-gray-100 focus:bg-white focus:border-[#10B981] text-gray-900 font-bold' 
              : 'bg-white border-gray-100 focus:border-[#10B981] shadow-sm font-bold text-gray-800'
          }`}
        />
        <div className="absolute right-4 flex items-center gap-2">
            {loading ? (
                <Loader2 className="w-4 h-4 text-[#10B981] animate-spin" />
            ) : query.length > 0 ? (
                <button onClick={() => setQuery("")} className="text-gray-300 hover:text-gray-500">
                    <X size={16} />
                </button>
            ) : null}
        </div>
      </div>

      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
            {(results.brands.length > 0 || results.categories.length > 0) && (
              <div className="p-4 border-b border-gray-50 bg-[#fcfdfd]">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Quick Links</h4>
                <div className="flex flex-wrap gap-2">
                  {results.brands.map((b: any) => (
                    <Link key={b.slug} href={`/brands/${b.slug}`} onClick={() => setIsOpen(false)} className="px-3 py-1.5 bg-white hover:bg-[#10B981] hover:text-white rounded-lg text-[10px] font-black uppercase transition-all border border-gray-100 shadow-sm flex items-center gap-1.5">
                      <Box size={10}/> {b.name}
                    </Link>
                  ))}
                  {results.categories.map((c: any) => (
                    <Link key={c.slug} href={`/laptops?category=${c.slug}`} onClick={() => setIsOpen(false)} className="px-3 py-1.5 bg-white hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all border border-gray-100 shadow-sm flex items-center gap-1.5">
                      <Target size={10}/> {c.name}
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
                          <Laptop size={12} className="text-blue-500"/> Laptops & Deals
                        </h4>
                        <div className="flex flex-col">
                          {results.laptops.map((l: any) => (
                            <Link key={l.slug} href={`/laptops/${l.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 hover:bg-emerald-50 rounded-xl transition-all group">
                              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0 group-hover:bg-white transition-colors">
                                {l.image ? <img src={formatImageUrl(l.image)} alt={l.title} className="max-h-full object-contain" /> : <Laptop className="w-5 h-5 text-gray-200" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-black text-gray-800 leading-tight group-hover:text-[#10B981] truncate">{l.title}</h5>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">₹{l.base_price} • {l.processor_type || 'Core'}</p>
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
                          <BookOpen size={12} className="text-purple-500"/> News & Guides
                        </h4>
                        <div className="flex flex-col">
                          {[...results.news, ...results.guides].slice(0, 4).map((item: any) => (
                            <Link key={item.slug} href={item.title ? (results.news.includes(item) ? `/news/${item.slug}` : `/guides/${item.slug}`) : '#'} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-all group">
                              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                                {results.news.includes(item) ? <FileText size={14} className="text-gray-400"/> : <BookOpen size={14} className="text-gray-400"/>}
                              </div>
                              <h5 className="text-xs font-bold text-gray-600 group-hover:text-purple-700 truncate">{item.title}</h5>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {(results.solutions.length > 0 || results.reviews.length > 0) && (
                      <div className="mb-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 flex items-center gap-2">
                          <HelpCircle size={12} className="text-orange-500"/> Reviews & Solutions
                        </h4>
                        <div className="flex flex-col">
                          {[...results.reviews, ...results.solutions].slice(0, 4).map((item: any) => (
                            <Link key={item.slug} href={results.reviews.includes(item) ? `/reviews/${item.slug}` : `/solutions/${item.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl transition-all group">
                              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                                {results.reviews.includes(item) ? <Star size={14} className="text-yellow-500"/> : <HelpCircle size={14} className="text-gray-400"/>}
                              </div>
                              <h5 className="text-xs font-bold text-gray-600 group-hover:text-orange-700 truncate">{item.title}</h5>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
            </div>

            {!hasAnyResults && (
               <div className="p-8 text-center bg-[#fcfdfd]">
                  <p className="text-sm font-bold text-gray-400">No matches found for "{query}"</p>
                  <Link href="/laptops" onClick={() => setIsOpen(false)} className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mt-2 inline-block hover:underline">Browse All Laptops</Link>
               </div>
            )}

            {hasAnyResults && (
                <Link 
                    href={`/laptops?search=${query}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center py-4 bg-gray-50 hover:bg-[#10B981] hover:text-white text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] transition-all"
                >
                    Explore All Matching Content <ArrowRight size={14} className="ml-2" />
                </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
