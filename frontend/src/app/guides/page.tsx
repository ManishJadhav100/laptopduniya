import Link from "next/link";
import { ArrowLeft, Laptop, ChevronRight, Bookmark, ArrowRight, ShieldCheck } from "lucide-react";
import { fetchApiList } from "@/lib/api";

async function getGuides() {
  return fetchApiList<any>("/guides/", { next: { revalidate: 300 } });
}

export const metadata = {
  title: "Laptop Buying Guides & Best Picks - Laptop Duniya",
  description: "Find the best laptop for your needs with our curated buying guides.",
};

export default async function GuidesPage() {
  const guidesItems = await getGuides();

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="max-w-[1140px] mx-auto px-4">
        
        {/* Guides Header */}
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-6">
              <Link href="/" className="hover:text-[#10B981]">Home</Link>
              <ChevronRight size={10} />
              <span className="text-[#10B981]">Buying Guides Hub</span>
           </div>
           <h1 className="text-[22px] font-black text-gray-900 tracking-tight mb-2">Master Your Purchase</h1>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">Don't guess. Our curated collections rank the best laptops based on rigorous real-world performance tests for every budget.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {guidesItems.length > 0 ? guidesItems.map((guide: any, i: number) => (
            <Link href={`/guides/${guide.slug}`} key={i} className="flex flex-col bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
               
               <div className="absolute top-0 left-0 w-2 h-full bg-[#10B981] opacity-60 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="flex items-center gap-3 mb-8">
                  <Bookmark size={20} className="text-[#10B981]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curated Collection</span>
               </div>
               
               <h2 className="text-lg font-black text-gray-900 leading-tight mb-4 group-hover:text-[#10B981] transition-colors">
                  {guide.title}
               </h2>
               
               <div className="prose prose-sm font-medium text-gray-500 leading-relaxed mb-10 flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: guide.intro }} />
               
               <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Guide Category</span>
                     <div className="text-xs font-black text-gray-900 tracking-tighter uppercase flex items-center gap-1 mt-1">
                        <ShieldCheck size={14} className="text-[#10B981]" /> Expert Recommended
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#10B981] tracking-widest">
                     Explore Guide <ArrowRight size={14} />
                  </div>
               </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-widest italic animate-pulse">More collections being curated...</div>
          )}
        </div>
      </div>
    </div>
  );
}
