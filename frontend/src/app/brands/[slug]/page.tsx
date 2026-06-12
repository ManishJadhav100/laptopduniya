import type { Metadata } from 'next';
import Link from 'next/link';
import { Smartphone, TicketPercent, ShieldCheck, Clock, ExternalLink, ArrowRight, Star, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import { formatImageUrl } from '@/lib/url-utils';
import { fetchApiJson } from '@/lib/api';
import { buildOutboundGatewayUrl } from '@/lib/outbound-gateway';

async function getBrandHubData(slug: string) {
  return fetchApiJson<any>(`/brands/${slug}/hub/`, { next: { revalidate: 300 } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getBrandHubData(resolvedParams.slug);
  
  if (!data?.brand) {
    const brandName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
    return { title: `${brandName} Mobiles - PhoneRadar` };
  }

  return {
    title: data.brand.meta_title || `${data.brand.name} Mobiles Price, Deals, News and Reviews 2026 - PhoneRadar`,
    description: data.brand.meta_description || `Complete guide to ${data.brand.name} phones. Get latest prices, verified coupons, expert reviews, and tech support.`,
  };
}

export default async function BrandHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getBrandHubData(resolvedParams.slug);

  if (!data) {
    return (
      <div className="bg-[#fcfdfd] min-h-screen font-sans flex items-center justify-center">
        <div className="text-center py-32">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
            <Smartphone className="w-10 h-10 text-gray-200" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Brand hub currently being populated...</h1>
          <p className="text-gray-500 font-bold mb-8">We are syncing the latest manufacturer data for this hub.</p>
          <Link href="/brands" className="text-[#10B981] font-black uppercase text-xs tracking-widest hover:underline flex items-center justify-center gap-2">
            <ArrowRight size={14} className="rotate-180" /> Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  const { brand, laptops, news, reviews, solutions, coupons } = data;

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      
      {/* BRAND HERO SECTION */}
      <div className="bg-white border-b border-gray-100 py-16 shadow-inner">
         <div className="site-shell flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center mb-8 shrink-0 shadow-lg p-4">
               {brand.logo ? <img src={formatImageUrl(brand.logo)} alt={brand.name} className="max-h-16 object-contain" /> : <div className="text-2xl font-black text-gray-300">{brand.name[0]}</div>}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-6 uppercase italic decoration-[#10B981] underline decoration-4 underline-offset-8">
               {brand.name} Mobiles Price, Deals, News & Reviews
            </h1>
            {brand.description ? (
               <div className="prose prose-lg font-bold text-gray-500 max-w-3xl leading-relaxed brand-desc" dangerouslySetInnerHTML={{ __html: brand.description }} />
            ) : (
               <p className="text-gray-500 font-bold text-lg max-w-3xl leading-relaxed">
                  Your complete resource hub for everything {brand.name}. From latest hardware prices to verified promo codes and expert technical analysis.
               </p>
            )}
         </div>
      </div>

      <div className="site-shell py-12 flex flex-col gap-20">
         
         {/* TOP DEALS & COUPONS */}
         {coupons.length > 0 && (
           <section>
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                 <h2 className="text-lg font-black text-gray-900 flex items-center gap-3"><TicketPercent className="text-[#10B981]" /> Best Online {brand.name} Coupons</h2>
                 <Link href="/coupons" className="text-xs font-black text-[#10B981] uppercase tracking-widest hover:underline">View All Coupons</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {coupons.slice(0, 3).map((c: any, i: number) => (
                    <div key={i} className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-6 hover:border-[#10B981] transition-all group flex flex-col">
                       <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4">{c.is_deal ? 'Hot Deal' : 'Coupon Code'}</span>
                       <h3 className="text-lg font-black text-gray-900 mb-6 group-hover:text-[#10B981] transition-colors">{c.title}</h3>
                       <a
                         href={buildOutboundGatewayUrl({
                           targetUrl: c.link,
                           title: c.title,
                           brandName: brand.name,
                           couponCode: c.code,
                           linkType: c.is_deal ? 'deal' : 'coupon',
                         })}
                         target="_blank"
                         rel="noopener noreferrer sponsored"
                         className="mt-auto w-full bg-gray-50 group-hover:bg-[#10B981] group-hover:text-white text-gray-400 font-black py-3 rounded-xl text-center text-xs uppercase transition-all tracking-widest border border-gray-100 group-hover:border-[#10B981]"
                       >
                          {c.is_deal ? 'Claim Now' : 'Check Code'}
                       </a>
                    </div>
                 ))}
              </div>
           </section>
         )}

         {/* LATEST LAPTOP PRICE LIST */}
         <section>
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
               <h2 className="text-lg font-black text-gray-900 flex items-center gap-3"><Smartphone className="text-[#10B981]" /> Trending {brand.name} Phones Pricing</h2>
               <Link href="/mobiles" className="text-xs font-black text-[#10B981] uppercase tracking-widest hover:underline">Full Catalog</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
               {laptops.length > 0 ? laptops.map((l: any, i: number) => (
                  <Link href={`/mobiles/${l.slug}`} key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                     <div className="aspect-[4/3] flex items-center justify-center mb-6 bg-[#fafafa] rounded-xl relative overflow-hidden mix-blend-multiply border border-gray-50">
                        {l.image ? <img src={formatImageUrl(l.image)} className="max-h-24 object-contain group-hover:scale-110 transition-transform duration-500" /> : <Smartphone size={32} className="text-gray-200" />}
                     </div>
                     <h3 className="text-sm font-black text-gray-900 group-hover:text-[#10B981] leading-tight mb-4 flex-1">{l.title}</h3>
                     <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-black text-[#10B981]">₹{l.base_price}</span>
                        <span className="text-[10px] bg-gray-900 text-white font-black px-2 py-0.5 rounded uppercase tracking-tighter">View</span>
                     </div>
                  </Link>
               )) : (
                 <div className="col-span-full py-12 text-center text-gray-400 font-black uppercase tracking-widest border border-dashed border-gray-100 rounded-2xl">
                    No active phone listings for {brand.name} at the moment.
                 </div>
               )}
            </div>
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* BRAND NEWS & REVIEWS */}
            <div className="lg:col-span-8 flex flex-col gap-12">
               
               {/* News Aggregator */}
               <section>
                  <h2 className="text-lg font-black text-gray-900 mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-tighter">Latest {brand.name} Launches & News</h2>
                  <div className="flex flex-col gap-4">
                     {news.length > 0 ? news.map((item: any, i: number) => (
                        <Link href={`/news/${item.slug}`} key={i} className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-[#10B981] transition-all flex items-center gap-6 group shadow-sm">
                           <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                              {item.image ? <img src={formatImageUrl(item.image)} className="w-full h-full object-cover" /> : <FileText className="text-gray-200" />}
                           </div>
                           <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{item.category}</span>
                              <h3 className="text-lg font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight">{item.title}</h3>
                              <p className="text-xs font-bold text-gray-500 line-clamp-2">{item.meta_description}</p>
                           </div>
                        </Link>
                     )) : <p className="text-xs font-bold text-gray-400 ml-4 italic">No recent news stories found.</p>}
                  </div>
               </section>

               {/* Reviews Aggregator */}
               <section>
                  <h2 className="text-lg font-black text-gray-900 mb-8 border-l-4 border-yellow-500 pl-4 uppercase tracking-tighter">Expert Analysis & Reviews</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {reviews.length > 0 ? reviews.map((r: any, i: number) => (
                        <Link href={`/reviews/${r.slug}`} key={i} className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-[#10B981] transition-all flex flex-col group shadow-sm">
                           <div className="flex justify-between items-start mb-6 w-full">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{brand.name} Expert Test</span>
                                 <h3 className="text-base font-black text-gray-900 group-hover:text-[#10B981] transition-colors mt-1 leading-snug">{r.title}</h3>
                              </div>
                              <div className="w-12 h-12 rounded-full border-4 border-yellow-50 flex items-center justify-center bg-white shadow-xl shrink-0">
                                 <span className="text-lg font-black text-[#10B981]">{r.overall_rating}</span>
                              </div>
                           </div>
                           <p className="text-xs font-bold text-gray-500 italic line-clamp-3">"{r.verdict}"</p>
                        </Link>
                     )) : <p className="text-xs font-bold text-gray-400 ml-4 italic">No expert reviews archived for this manufacturer yet.</p>}
                  </div>
               </section>
            </div>

            {/* BRAND RESOURCES SIDEBAR */}
            <div className="lg:col-span-4 flex flex-col gap-10">
               
               {/* Solution Hub (Tech Fixes) */}
               <section className="bg-orange-50 bg-opacity-30 border border-orange-100 rounded-3xl p-8">
                  <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2"><HelpCircle className="text-orange-500" /> {brand.name} Help Center</h2>
                  <p className="text-xs font-bold text-gray-500 mb-8 leading-relaxed">Common fixes and troubleshooting guides specific to {brand.name} hardware architecture.</p>
                  <div className="flex flex-col gap-4">
                     {solutions.length > 0 ? solutions.map((s: any, i: number) => (
                        <Link href={`/solutions/${s.slug}`} key={i} className="flex items-center gap-4 group">
                           <div className="p-2 border border-orange-100 rounded-lg bg-white shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                              <HelpCircle size={16} />
                           </div>
                           <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#10B981] leading-tight">{s.title}</h4>
                        </Link>
                     )) : <p className="text-[10px] font-bold text-gray-400 italic">Self-help guides coming soon.</p>}
                  </div>
                  <button className="w-full mt-10 bg-white border border-orange-200 text-orange-600 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm">Ask an Expert</button>
               </section>

               {/* Trust Factor Box */}
               <div className="bg-gray-900 text-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <ShieldCheck className="w-16 h-16 text-[#10B981] mb-6" />
                  <h4 className="text-lg font-black uppercase tracking-widest mb-4">Official Verification</h4>
                  <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">"Every deal and hardware specification on this {brand.name} Hub is cross-verified across five major retailers to ensure your purchase follows genuine industry standards."</p>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}

