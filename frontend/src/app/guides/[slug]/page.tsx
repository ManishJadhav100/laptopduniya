import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Smartphone, ShieldCheck, TicketPercent, Share2, Link as LinkIcon } from 'lucide-react';
import AuthorBox from '@/components/AuthorBox';
import { formatImageUrl } from '@/lib/url-utils';
import ShareButtons from '@/components/ShareButtons';

import { fetchApiJson, fetchApiList } from "@/lib/api";

async function getGuide(slug: string) {
  return fetchApiJson<any>(`/guides/${slug}/`, { next: { revalidate: 300 } });
}

async function getOtherGuides() {
    return fetchApiList<any>("/guides/?limit=3", { next: { revalidate: 300 } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const guide = await getGuide(resolvedParams.slug);
  if (!guide) return { title: 'Guide Not Found' };
  return {
    title: guide.meta_title || `${guide.title} - Buying Guide`,
    description: guide.meta_description,
  };
}

export default async function GuideSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guide = await getGuide(resolvedParams.slug);
  const otherGuides = await getOtherGuides();

  if (!guide) {
    return <div className="py-20 text-center"><h1 className="text-2xl font-bold font-sans">Guide not found.</h1></div>;
  }

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      <div className="site-shell py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="flex-1">
           <Link href="/guides" className="inline-flex items-center text-[11px] font-black text-gray-400 hover:text-[#10B981] transition-colors mb-8 uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> View All Buying Guides
           </Link>
           
           <div className="mb-12 border-b border-gray-100 pb-12">
              <span className="bg-[#10B981] text-white text-[10px] font-black px-3 py-1 rounded shadow-sm border border-[#10B981] uppercase mb-6 inline-block tracking-widest leading-none">Best Picks 2026</span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                 {guide.title}
              </h1>
              <div className="prose prose-lg prose-emerald max-w-none text-gray-600 font-medium leading-relaxed italic border-l-4 border-gray-100 pl-6" dangerouslySetInnerHTML={{ __html: guide.intro }} />
           </div>

           <div className="flex flex-col gap-10">
              {guide.items && guide.items.map((item: any, i: number) => {
                 const laptop = item.laptop;
                 if (!laptop) return null;
                 return (
                   <div key={i} className="bg-white rounded-2xl border-2 border-gray-50 p-8 shadow-sm relative overflow-hidden flex flex-col items-center sm:items-start group hover:border-[#10B981] transition-all">
                      <div className="flex items-center gap-6 mb-8 w-full border-b border-gray-50 pb-6 group-hover:border-emerald-50">
                         <span className="flex items-center justify-center w-14 h-14 bg-gray-900 text-white rounded-xl text-3xl font-black shadow-lg">
                            {item.ordering || i + 1}
                         </span>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mb-1">Expert's Choice</span>
                            <Link href={`/mobiles/${laptop.slug}`} className="hover:underline">
                               <h2 className="text-2xl font-black text-gray-900 tracking-tight">{laptop.title}</h2>
                            </Link>
                         </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 w-full">
                         <div className="w-full md:w-[35%] aspect-[4/3] bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shrink-0">
                            {laptop.image ? <img src={formatImageUrl(laptop.image)} alt={laptop.title} className="max-h-full object-contain p-4 group-hover:scale-105 transition-transform" /> : <Smartphone className="w-20 h-20 text-gray-200" />}
                            <span className="absolute top-2 right-2 p-1.5 bg-white rounded-lg border border-gray-100 text-[#10B981] shadow-sm"><TicketPercent size={18} /></span>
                         </div>
                         <div className="flex-1 flex flex-col">
                            
                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
                               <div className="bg-[#fcfdfd] p-4 rounded-xl border border-gray-100 flex flex-col group-hover:border-[#10B981] transition-colors">
                                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Chipset</span>
                                  <span className="text-[11px] font-black text-gray-900 leading-tight">{laptop.processor_type || '--'}</span>
                               </div>
                               <div className="bg-[#fcfdfd] p-4 rounded-xl border border-gray-100 flex flex-col group-hover:border-[#10B981] transition-colors">
                                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">RAM</span>
                                  <span className="text-[11px] font-black text-gray-900 leading-tight">{laptop.ram_gb ? `${laptop.ram_gb}GB` : '--'}</span>
                               </div>
                               <div className="bg-[#fcfdfd] p-4 rounded-xl border border-gray-100 flex flex-col group-hover:border-[#10B981] transition-colors">
                                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Camera</span>
                                  <span className="text-[11px] font-black text-gray-900 leading-tight">{laptop.gpu_type || '--'}</span>
                               </div>
                               <div className="bg-[#fcfdfd] p-4 rounded-xl border border-gray-100 flex flex-col group-hover:border-[#10B981] transition-colors">
                                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Screen</span>
                                  <span className="text-[11px] font-black text-gray-900 leading-tight">{laptop.display_size ? `${laptop.display_size}" Display` : '--'}</span>
                               </div>
                            </div>
                            {item.custom_note && (
                               <div className="bg-[#10B981] bg-opacity-5 p-6 rounded-xl border border-[#10B981] border-opacity-10 mb-8 text-gray-700 font-medium text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.custom_note }} />
                            )}
                            <div className="mt-auto flex items-center justify-between gap-6">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Deal Price</span>
                                  <p className="text-3xl font-extrabold text-gray-900">₹{laptop.base_price || 'N/A'}</p>
                               </div>
                               <Link href={`/mobiles/${laptop.slug}`} className="bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 px-10 rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                  Check Current Price
                               </Link>
                            </div>
                         </div>
                      </div>
                   </div>
                 )
              })}
           </div>

           {/* Author Box Component */}
           <AuthorBox author={guide.author} />

        </div>

        {/* Technical Sidebar */}
        <div className="w-full lg:w-[300px] flex flex-col gap-10">
           
           {/* Summary Tooltips */}
           <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 border-b border-gray-800 pb-4 flex items-center gap-2"><ShieldCheck className="text-[#10B981]" /> How we pick</h3>
              <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                 "Our buying guides are built from hands-on testing, launch tracking, and price analysis to surface the phones that deliver the strongest real-world value."
              </p>
           </div>

           {/* Quick Shares */}
           <ShareButtons title={guide.title} shareText="Share This Guide" />
           {/* More Guides */}
           <div className="flex flex-col gap-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">More Guides</h3>
              {otherGuides.filter((g: any) => g.slug !== guide.slug).map((g: any, i: number) => (
                 <Link href={`/guides/${g.slug}`} key={i} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-[#10B981] transition-all group">
                    <h5 className="text-xs font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight mb-2 line-clamp-2">{g.title}</h5>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Updated Weekly</span>
                 </Link>
              ))}
           </div>

        </div>
      </div>
    </div>
  );
}

