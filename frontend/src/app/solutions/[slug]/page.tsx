import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Smartphone, HelpCircle, ShieldCheck, TicketPercent, Zap, Share2, Mail } from 'lucide-react';
import AuthorBox from '@/components/AuthorBox';
import { formatImageUrl } from '@/lib/url-utils';
import ShareButtons from '@/components/ShareButtons';

import { fetchApiJson, fetchApiList } from "@/lib/api";

async function getSolution(slug: string) {
  return fetchApiJson<any>(`/solutions/${slug}/`, { next: { revalidate: 300 } });
}

async function getMoreFixes() {
    return fetchApiList<any>("/solutions/?limit=3", { next: { revalidate: 300 } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const solution = await getSolution(resolvedParams.slug);
  if (!solution) return { title: 'Solution Not Found' };
  return {
    title: solution.meta_title || `${solution.title} - Tech Fix Guide`,
    description: solution.meta_description,
  };
}

export default async function SolutionSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const solution = await getSolution(resolvedParams.slug);
  const moreFixes = await getMoreFixes();

  if (!solution) {
    return <div className="py-20 text-center"><h1 className="text-2xl font-bold font-sans">Solution not found.</h1></div>;
  }

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      <div className="site-shell py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="flex-1">
           <Link href="/solutions" className="inline-flex items-center text-[11px] font-black text-gray-400 hover:text-[#10B981] transition-colors mb-8 uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tech Help Center
           </Link>
           
           <div className="mb-12 border-b border-gray-100 pb-12">
              <div className="flex items-center gap-2 mb-6 uppercase tracking-widest">
                 <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded shadow-sm border border-orange-600">Step-by-Step Fix</span>
                 <span className="text-gray-400 text-[10px] font-black flex items-center gap-1">Verified Technical Support</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                 {solution.title}
              </h1>
           </div>

           <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed font-medium mb-16" dangerouslySetInnerHTML={{ __html: solution.content }} />
           
           {/* Author Box Component */}
           <AuthorBox author={solution.author} />

        </div>

        {/* Technical Sidebar */}
        <div className="w-full lg:w-[320px] flex flex-col gap-10">
           
           {/* Related Phones Box */}
           {solution.related_laptops && solution.related_laptops.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
               <h3 className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-4">Applies to these models</h3>
               <div className="p-6 flex flex-col gap-6">
                 {solution.related_laptops.map((l: any, i: number) => (
                    <Link href={`/mobiles/${l.slug}`} key={i} className="flex gap-4 group">
                       <div className="w-16 h-14 bg-[#fafafa] border border-gray-100 rounded flex items-center justify-center shrink-0 group-hover:border-[#10B981] transition-colors overflow-hidden">
                          {l.image ? <img src={formatImageUrl(l.image)} className="max-h-full object-contain" /> : <Smartphone size={18} className="text-gray-300" />}
                       </div>
                       <div className="flex flex-col gap-1 text-xs">
                          <h4 className="font-black text-gray-800 group-hover:text-[#10B981] leading-tight transition-colors line-clamp-2">{l.title}</h4>
                          <span className="font-black text-[#10B981]">₹{l.base_price}</span>
                       </div>
                    </Link>
                 ))}
               </div>
               <Link href="/mobiles" className="block text-center bg-gray-50 py-4 text-[10px] font-black uppercase text-gray-500 hover:text-[#10B981] border-t border-gray-100 transition-colors">
                 Check Mobile Pricing
               </Link>
            </div>
           )}

           {/* Quick Shares */}
           <ShareButtons title={solution.title} shareText="Share This Fix" />

           {/* Newsletter / Contact Help */}
           <div className="bg-[#10B981] bg-opacity-5 border border-[#10B981] border-opacity-10 rounded-2xl p-8 mt-10 text-center flex flex-col items-center">
              <Mail className="w-10 h-10 text-[#10B981] mb-4" />
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2 text-center">Still need help?</h4>
              <p className="text-[11px] text-gray-500 font-bold mb-6 text-center">Join our community forum for customized phone troubleshooting advice from experts.</p>
              <button className="w-full bg-[#10B981] text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10">Ask a Question</button>
           </div>

           {/* More Fixes Sidebar */}
           <div className="flex flex-col gap-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">More Tech Fixes</h3>
              {moreFixes.filter((s: any) => s.slug !== solution.slug).map((s: any, i: number) => (
                 <Link href={`/solutions/${s.slug}`} key={i} className="flex items-center gap-4 group">
                    <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                       <HelpCircle size={16} />
                    </div>
                    <h5 className="text-xs font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight line-clamp-2">{s.title}</h5>
                 </Link>
              ))}
           </div>

        </div>
      </div>
    </div>
  );
}

