import Link from "next/link";
import { Clock, Tag, ChevronRight, FileText, ArrowRight } from "lucide-react";
import { formatImageUrl } from "@/lib/url-utils";

import { fetchApiList } from "@/lib/api";

async function getNews() {
  return fetchApiList<any>("/news/", { next: { revalidate: 300 } });
}

export const metadata = {
  title: "Tech News Hub - Laptop Duniya",
  description: "Stay ahead with the latest laptop launches, leaks, and industry rumors.",
};

export default async function NewsPage() {
  const newsItems = await getNews();
  const featured = newsItems[0];
  const others = newsItems.slice(1, 7);

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="max-w-[1140px] mx-auto px-4">
        
        {/* News Header */}
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-6">
              <Link href="/" className="hover:text-[#10B981]">Home</Link>
              <ChevronRight size={10} />
              <span className="text-[#10B981]">News Hub</span>
           </div>
           <h1 className="text-[22px] font-black text-gray-900 tracking-tight mb-2">Latest Laptop News</h1>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">Breaking stories, new launches, and the latest industry rumors verified by our expert tech journalists.</p>
        </div>

        {/* FEATURED STORY */}
        {featured && (
          <div className="mb-16">
            <Link href={`/news/${featured.slug}`} className="flex flex-col lg:flex-row gap-8 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
               <div className="w-full lg:w-3/5 aspect-[16/9] lg:aspect-auto h-auto lg:min-h-[450px] relative overflow-hidden bg-gray-800">
                  {featured.image ? (
                    <img src={formatImageUrl(featured.image)} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-black text-5xl opacity-10">NEWS IMAGE</div>
                  )}
                  <div className="absolute top-8 left-8">
                     <span className="bg-[#10B981] text-white text-[10px] font-black px-4 py-1.5 rounded-lg shadow-xl uppercase tracking-widest">Featured Story</span>
                  </div>
               </div>
               <div className="w-full lg:w-2/5 p-12 flex flex-col justify-center text-white">
                  <div className="flex items-center gap-3 mb-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                     <Clock size={16} className="text-[#10B981]" />
                     <span>{new Date(featured.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black mb-4 tracking-tight leading-none group-hover:text-[#10B981] transition-colors">{featured.title}</h2>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 line-clamp-3 italic">"{featured.meta_description}"</p>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#10B981] tracking-[0.2em]">Read Full Story <ArrowRight size={14} /></div>
               </div>
            </Link>
          </div>
        )}

        {/* OTHERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {others.length > 0 ? others.map((item: any, i: number) => (
            <Link href={`/news/${item.slug}`} key={i} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group group relative">
               <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100 group-hover:bg-[#10B981] group-hover:bg-opacity-5 transition-all">
                  {item.image ? (
                    <img src={formatImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-200 group-hover:text-[#10B981] transition-colors" />
                  )}
               </div>
               <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[9px] font-black text-[#10B981] uppercase tracking-[0.2em]">{item.category || 'News'}</span>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-[#10B981] transition-colors mb-4 tracking-tight leading-none">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed mb-6 line-clamp-2">
                    {item.meta_description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase text-gray-800 group-hover:text-[#10B981] tracking-widest decoration-2 underline-offset-4 decoration-[#10B981] group-hover:underline">
                     Read More Details
                  </div>
               </div>
            </Link>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest italic border-2 border-dashed border-gray-100 rounded-3xl">More breaking news incoming...</div>
          )}
        </div>
      </div>
    </div>
  );
}
