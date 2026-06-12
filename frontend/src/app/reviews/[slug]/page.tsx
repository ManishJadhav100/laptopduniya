import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Star, Smartphone, ShieldCheck, TicketPercent, Zap, Cpu, Battery, MonitorPlay } from 'lucide-react';
import AuthorBox from '@/components/AuthorBox';
import { CommentSystem } from '@/components/ReviewSystem';
import { formatImageUrl } from '@/lib/url-utils';

import { fetchApiJson, fetchApiList } from "@/lib/api";

async function getReview(slug: string) {
  return fetchApiJson<any>(`/reviews/${slug}/`, { next: { revalidate: 300 } });
}

async function getRelatedReviews() {
    return fetchApiList<any>("/reviews/?limit=3", { next: { revalidate: 300 } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const review = await getReview(resolvedParams.slug);
  if (!review) return { title: 'Review Not Found' };
  return {
    title: review.meta_title || `${review.title} - Expert Analysis`,
    description: review.meta_description,
  };
}

export default async function ReviewSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const review = await getReview(resolvedParams.slug);
  const otherReviews = await getRelatedReviews();

  if (!review) {
    return <div className="py-20 text-center"><h1 className="text-2xl font-bold font-sans">Review not found.</h1></div>;
  }

  const laptop = review.laptop;

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      <div className="site-shell py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="flex-1">
           <Link href="/reviews" className="inline-flex items-center text-[11px] font-black text-gray-400 hover:text-[#10B981] transition-colors mb-8 uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Expert Reviews
           </Link>
           
           <div className="mb-8 border-b border-gray-100 pb-10">
              <div className="flex items-center gap-2 mb-6 uppercase tracking-widest">
                 <span className="bg-[#10B981] text-white text-[10px] font-black px-3 py-1 rounded shadow-sm">Expert Analysis</span>
                 <span className="text-gray-400 text-[10px] font-black flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                 {review.title}
              </h1>
              
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between border border-gray-100 shadow-inner">
                 <div className="flex items-center gap-8 divide-x divide-gray-200">
                    <div className="flex flex-col items-center">
                       <span className="text-5xl font-black text-[#10B981]">{review.overall_rating}</span>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Score</span>
                    </div>
                    <div className="pl-8 grid grid-cols-2 gap-x-8 gap-y-2">
                       <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold text-gray-500 uppercase">Perf</span><span className="text-sm font-black text-gray-900">{review.performance_rating}</span></div>
                       <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold text-gray-500 uppercase">Disp</span><span className="text-sm font-black text-gray-900">{review.display_rating}</span></div>
                       <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold text-gray-500 uppercase">Batt</span><span className="text-sm font-black text-gray-900">{review.battery_rating}</span></div>
                       <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold text-gray-500 uppercase">Valu</span><span className="text-sm font-black text-gray-900">{review.value_rating}</span></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: review.content }} />
           
           <div className="my-12 p-8 bg-gray-900 text-white rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-800 pb-4"><ShieldCheck className="text-[#10B981]" /> The Verdict</h3>
              <p className="text-lg font-medium leading-relaxed italic text-gray-300">"{review.verdict}"</p>
           </div>

           {/* Author Box Component */}
           <AuthorBox author={review.author} />

           {/* Site Comments - NEW */}
           <CommentSystem contentType="core.review" objectId={review.id} />
        </div>

        {/* Technical Sidebar */}
        <div className="w-full lg:w-[350px] flex flex-col gap-10">
           
           {/* Current Tested Phone Card */}
           {laptop && (
            <div className="bg-white border-2 border-[#10B981] rounded-2xl overflow-hidden shadow-lg p-6">
               <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4 block">Currently Testing</span>
               <div className="h-40 bg-white flex items-center justify-center mb-6 mix-blend-multiply">
                  {laptop.image ? <img src={formatImageUrl(laptop.image)} alt={laptop.title} className="max-h-full object-contain" /> : <Smartphone size={40} className="text-gray-200" />}
               </div>
               <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-4">{laptop.title}</h3>
               <p className="text-2xl font-black text-[#10B981] mb-6">₹{laptop.base_price}</p>
               
               <Link href={`/mobiles/${laptop.slug}`} className="w-full bg-[#10B981] text-white font-black py-4 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-[#059669] transition-all uppercase tracking-widest text-xs shadow-md shadow-emerald-500/10">
                  <TicketPercent size={18} /> Get This Deal
               </Link>
            </div>
           )}

           {/* Top Features Sidebar List */}
           <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Phone Highlights</h3>
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><Cpu className="w-5 h-5 text-[#10B981]" /></div><div><p className="text-[9px] font-black text-gray-400 uppercase">Power</p><p className="text-xs font-black text-gray-800">Flagship Chipset</p></div></div>
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><Zap className="w-5 h-5 text-[#10B981]" /></div><div><p className="text-[9px] font-black text-gray-400 uppercase">Memory</p><p className="text-xs font-black text-gray-800">12GB Fast RAM</p></div></div>
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><MonitorPlay className="w-5 h-5 text-[#10B981]" /></div><div><p className="text-[9px] font-black text-gray-400 uppercase">Display</p><p className="text-xs font-black text-gray-800">Bright High-Refresh Panel</p></div></div>
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><Battery className="w-5 h-5 text-[#10B981]" /></div><div><p className="text-[9px] font-black text-gray-400 uppercase">Battery</p><p className="text-xs font-black text-gray-800">All-Day Endurance</p></div></div>
               </div>
           </div>

           {/* Other Reviews */}
           <div className="bg-[#f0f9ff] border border-blue-100 rounded-2xl p-6">
              <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4">You May Also Like</h4>
              <div className="flex flex-col gap-4">
                 {otherReviews.filter((r: any) => r.slug !== review.slug).map((r: any, i: number) => (
                    <Link href={`/reviews/${r.slug}`} key={i} className="group">
                       <h5 className="text-xs font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight line-clamp-2">{r.title}</h5>
                       <span className="text-[10px] font-bold text-gray-400">{r.overall_rating}/10 Score</span>
                    </Link>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

