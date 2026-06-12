import { Check, X, Star, Cpu, Battery, MonitorPlay, Zap, ShieldCheck, ChevronRight, HelpCircle, Smartphone, Info, Award, HandMetal, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';
import Link from 'next/link';
import ProductActions from "@/components/ProductActions";
import PriceChart from "@/components/PriceChart";
import SoftwareCompatibility from '@/components/tools/SoftwareCompatibility';
import FutureProofMeter from '@/components/tools/FutureProofMeter';
import { ReviewSystem } from '@/components/ReviewSystem';
import { PurchaseExplorer, PurchaseProvider } from '@/components/PurchaseExplorer';
import { getCanonicalUrl, formatImageUrl } from '@/lib/url-utils';
import ShareButtons from '@/components/ShareButtons';
import Script from 'next/script';
import Image from 'next/image';
import LaptopCard from "@/components/LaptopCard";
import LaptopGatewayOverlay from "@/components/LaptopGatewayOverlay";

import { fetchApiJson, fetchApiList } from "@/lib/api";
import { buildOutboundGatewayStepTwoUrl, buildShortCodeStepTwoUrl, getShortCodeFromSearchParams, isLaptopGatewayRequest, parseOutboundGatewayPayload, type GatewaySearchParams } from "@/lib/outbound-gateway";

async function getLaptop(slug: string) {
  return fetchApiJson<any>(`/mobiles/${slug}/`, { next: { revalidate: 300 } });
}

async function getRelatedContent(brandSlug: string, currentSlug: string, basePrice: number, categoryId?: number) {
    const relatedPath = brandSlug
      ? `/mobiles/?brand=${encodeURIComponent(brandSlug)}&limit=7`
      : "/mobiles/?limit=7";
    const betterPath = `/mobiles/?price_min=${basePrice * 1.05}&price_max=${basePrice * 1.5}&limit=7`;

    const [news, reviews, solutions, relatedLaptopsRaw, betterLaptopsRaw] = await Promise.all([
        fetchApiList<any>("/news/?limit=6", { next: { revalidate: 300 } }),
        fetchApiList<any>("/reviews/?limit=6", { next: { revalidate: 300 } }),
        fetchApiList<any>("/solutions/?limit=6", { next: { revalidate: 300 } }),
        fetchApiList<any>(relatedPath, { next: { revalidate: 300 } }),
        fetchApiList<any>(betterPath, { next: { revalidate: 300 } }),
    ]);

    const relatedLaptopsFeed = relatedLaptopsRaw
      .filter((l: any) => l.slug !== currentSlug)
      .slice(0, 6);
    const betterLaptopsFeed = betterLaptopsRaw
      .filter((l: any) => l.slug !== currentSlug)
      .slice(0, 6);

    return {
        news,
        reviews,
        solutions,
        relatedLaptops: relatedLaptopsFeed,
        betterLaptops: betterLaptopsFeed
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const laptop = await getLaptop(resolvedParams.slug);
  if (!laptop) return { title: 'Mobile Not Found' };
  
  const siteTitle = laptop.meta_title || `${laptop.title} Specs & Best Deals - PhoneRadar`;
  
  // Rich Meta Description Logic
  let description = laptop.meta_description || "";
  if (description.length < 50) {
    description = `Expert review, full specs, and best live prices for the ${laptop.title}. Featuring ${laptop.processor_type}, ${laptop.ram_gb}GB RAM, and ${laptop.gpu_type}. Verified deals only at PhoneRadar.`;
  }

  return {
    title: siteTitle,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(`/mobiles/${laptop.slug}`),
    },
    openGraph: {
      title: siteTitle,
      description: description,
      images: laptop.image ? [formatImageUrl(laptop.image)] : [],
    }
  };
}

export default async function LaptopDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<GatewaySearchParams>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const laptop = await getLaptop(resolvedParams.slug);

  if (!laptop) return <div className="py-32 text-center text-2xl font-bold">Phone not found</div>;

  const isGatewayRequest = isLaptopGatewayRequest(resolvedSearchParams);
  const gatewayShortCode = isGatewayRequest
    ? getShortCodeFromSearchParams(resolvedSearchParams)
    : undefined;
  const gatewayPayload = isGatewayRequest
    ? parseOutboundGatewayPayload(resolvedSearchParams)
    : null;
  const gatewayStepTwoUrl = gatewayShortCode
    ? buildShortCodeStepTwoUrl(gatewayShortCode)
    : gatewayPayload
      ? buildOutboundGatewayStepTwoUrl(gatewayPayload)
      : null;

  const related = await getRelatedContent(laptop.brand?.slug, laptop.slug, laptop.base_price);

  const groupedSpecs: Record<string, any[]> = {};
  if (laptop.specifications) {
    laptop.specifications.forEach((s: any) => {
      const g = s.spec_group;
      if (!groupedSpecs[g]) groupedSpecs[g] = [];
      groupedSpecs[g].push(s);
    });
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": laptop.title,
    "image": laptop.image ? formatImageUrl(laptop.image) : "",
    "description": laptop.meta_description || `${laptop.title} smartphone review and specs.`,
    "brand": {
      "@type": "Brand",
      "name": laptop.brand?.name || "Premium"
    },
    "sku": `PR-${laptop.id}`,
    "offers": {
      "@type": "Offer",
      "url": getCanonicalUrl(`/mobiles/${laptop.slug}`),
      "priceCurrency": "INR",
      "price": laptop.base_price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-[#f4f7f6] min-h-screen py-8 pb-32 font-sans text-gray-800 selection:bg-emerald-100 selection:text-emerald-900">
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PurchaseProvider retailers={laptop.retailer_prices || []}>
        {gatewayStepTwoUrl ? (
          <LaptopGatewayOverlay
            laptop={{
              title: laptop.title,
              slug: laptop.slug,
              image: laptop.image ? formatImageUrl(laptop.image) : null,
              basePrice: laptop.base_price,
              brandName: laptop.brand?.name,
            }}
            stepTwoUrl={gatewayStepTwoUrl}
          />
        ) : null}
        
        {/* STICKY PURCHASE BAR - Appearing on scroll */}
        <PurchaseExplorer 
          laptop={laptop} 
          retailers={laptop.retailer_prices || []} 
          defaultPrice={laptop.base_price}
          defaultLink={laptop.affiliate_link}
          type="sticky"
        />

        <div className="w-full mx-auto px-4 lg:px-6">
        
        {/* Modern Breadcrumbs */}
        <div className="px-1 text-[11px] font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
           <Link href="/" className="hover:text-[#10B981] transition-colors">Home</Link>
           <ChevronRight size={10} />
           <Link href="/mobiles" className="hover:text-[#10B981] transition-colors">Mobiles</Link>
           <ChevronRight size={10} />
           <span className="text-[#10B981] font-black">{laptop.title}</span>
        </div>

        {/* HERO STAGE: THE CRYSTAL GALLERY + SMART SUMMARY */}
        <div className="relative bg-white border border-gray-200/50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-12 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Gallery Stage */}
            <div className="w-full lg:w-1/2 p-12 bg-gradient-to-br from-[#fafafa] to-white flex flex-col items-center justify-center relative border-r border-gray-100/50 overflow-hidden">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
               
               <div className="absolute top-8 left-8 flex items-center gap-3">
                  <div className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-widest">Verified Specs</div>
                  <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest">2026 Edition</div>
               </div>

               <div className="w-full max-w-[480px] aspect-square flex items-center justify-center mb-4 transition-all duration-700 hover:scale-[1.03]">
                  {laptop.image ? (
                    <div className="relative group">
                       <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <Image 
                          src={formatImageUrl(laptop.image)} 
                          alt={`${laptop.title} ${laptop.processor_type} smartphone - PhoneRadar expert pick`} 
                          width={600}
                          height={450}
                          priority={true}
                          unoptimized={true}
                          className="max-h-full w-auto object-contain mix-blend-multiply relative z-10" 
                       />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-200">
                        <Smartphone className="w-48 h-48" />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-4">No Media Available</span>
                    </div>
                  )}
               </div>
               
               <div className="mt-4 flex gap-2">
                  {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i===1 ? 'bg-[#10B981]' : 'bg-gray-200'}`}></div>)}
               </div>
            </div>

            {/* Smart Summary Panel */}
            <div className="w-full lg:w-1/2 p-12 flex flex-col bg-white">
                <PurchaseExplorer 
                  laptop={laptop} 
                  retailers={laptop.retailer_prices || []} 
                  defaultPrice={laptop.base_price}
                  defaultLink={laptop.affiliate_link}
                  type="header"
                />

                <div className="h-px bg-gray-100 w-full my-6"></div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group transition-all hover:bg-white hover:shadow-xl">
                      <Cpu size={18} className="text-[#10B981] mb-2" />
                      <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">Chipset</span>
                      <span className="text-xs font-black text-gray-800">{laptop.processor_type || 'Modern Chip'}</span>
                   </div>
                   <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group transition-all hover:bg-white hover:shadow-xl">
                      <Zap size={18} className="text-[#10B981] mb-2" />
                      <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">RAM</span>
                      <span className="text-xs font-black text-gray-800">{laptop.ram_gb || 8}GB RAM</span>
                   </div>
                </div>

                {/* Performance Dashboard - NEW Glass Design */}
                <div className="mt-8 bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                           <h4 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] leading-none mb-1">Performance Radar</h4>
                           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Phone Use Estimates</span>
                        </div>
                        <Info size={14} className="text-gray-600" />
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { label: 'Photography', score: (laptop.gpu_type?.toLowerCase().includes('periscope') || laptop.gpu_type?.toLowerCase().includes('telephoto') || laptop.gpu_type?.toLowerCase().includes('50mp') ? 93 : 74), icon: <Star size={12} />, color: 'from-blue-400 to-cyan-600' },
                            { label: 'Gaming', score: (laptop.processor_type?.toLowerCase().includes('snapdragon 8') || laptop.processor_type?.toLowerCase().includes('a18') || laptop.processor_type?.toLowerCase().includes('dimensity 9400') ? 94 : 72), icon: <MonitorPlay size={12} />, color: 'from-orange-400 to-red-600' },
                            { label: 'Battery', score: (laptop.ram_gb >= 12 ? 89 : 75), icon: <Battery size={12} />, color: 'from-emerald-400 to-green-600' },
                        ].map((p) => (
                            <div key={p.label} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                       <span className="text-gray-400 group-hover:text-white transition-colors">{p.icon}</span>
                                       <span className="text-[10px] font-black text-white uppercase tracking-wider">{p.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#10B981] uppercase tracking-tighter">{p.score}% POWER</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                                     <div className={`h-full bg-gradient-to-r ${p.color} rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]`} style={{ width: `${p.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-100">
                    <ProductActions laptop={laptop} />
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase items-center flex justify-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500" /> Secure checkout via verified partners</p>
                 </div>
            </div>
            </div>
        </div>

        {/* SECTION 2: TECHNICAL INSIGHTS ROW (Full Width on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[160px]">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price History</h4>
                <PriceChart currentPrice={parseFloat(laptop.base_price)} />
            </div>
            <SoftwareCompatibility ram_gb={laptop.ram_gb || 0} processor={laptop.processor_type || ''} />
            <FutureProofMeter ram_gb={laptop.ram_gb || 0} processor={laptop.processor_type || ''} gpu={laptop.gpu_type || ''} />
            <ShareButtons title={`Check out this deal on ${laptop.title} at PhoneRadar`} shareText="Share This Deal" />
        </div>

        {/* SECTION 3: DEAL CENTRAL (Store Selector - Full Width) */}
        <div className="mb-10">
           <PurchaseExplorer 
             laptop={laptop} 
             retailers={laptop.retailer_prices || []} 
             defaultPrice={laptop.base_price}
             defaultLink={laptop.affiliate_link}
             type="table"
           />
        </div>

        {/* SECTION 4: DEEP DIVE (Pros, Cons, Specs, Solutions) */}
        <div className="flex flex-col gap-10">
            {/* Pros & Cons Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-l-4 border-green-500 rounded-r-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-black text-green-700 uppercase mb-4 flex items-center gap-2"><Check className="w-5 h-5" /> Why You'll Love It</h3>
                    <div className="prose prose-sm font-medium text-gray-600" dangerouslySetInnerHTML={{ __html: laptop.pros }} />
                </div>
                <div className="bg-white border-l-4 border-red-500 rounded-r-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-black text-red-700 uppercase mb-4 flex items-center gap-2"><X className="w-5 h-5" /> Things to Consider</h3>
                    <div className="prose prose-sm font-medium text-gray-600" dangerouslySetInnerHTML={{ __html: laptop.cons }} />
                </div>
            </div>

            {/* Technical Specifications - Glass Layout */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <div className="bg-gray-50/50 px-12 py-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#10B981]">
                          <Cpu size={24} />
                       </div>
                       <div className="flex flex-col">
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Technical Specifications</h2>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Specs & Features</span>
                       </div>
                    </div>
                    <Award size={20} className="text-yellow-400" />
                </div>
                <div className="grid grid-cols-1 divide-y divide-gray-50">
                     {Object.keys(groupedSpecs).map(group => (
                        <div key={group} className="flex flex-col lg:flex-row group transition-all">
                           <div className="lg:w-64 bg-gray-50/30 px-12 py-10 flex flex-col gap-1 border-r border-gray-50 shrink-0">
                              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em]">{group}</span>
                              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.1em]">Verified Group</span>
                           </div>
                           <div className="flex-1 p-8 lg:p-12">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                  {groupedSpecs[group].map((spec, i) => (
                                     <div key={i} className="flex flex-col gap-1 group/item">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover/item:text-[#10B981] transition-colors">{spec.spec_key}</label>
                                        <div className="text-sm font-extrabold text-gray-800 leading-tight">{spec.value}</div>
                                     </div>
                                  ))}
                              </div>
                           </div>
                        </div>
                     ))}
                </div>
            </div>

            {/* Related Solutions Block */}
            <div className="bg-[#10B981] bg-opacity-5 border border-[#10B981] border-opacity-20 rounded-2xl p-8">
               <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><HelpCircle className="w-7 h-7 text-[#10B981]" /> Community & Support</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.solutions.map((s: any, i: number) => (
                    <Link href={`/solutions/${s.slug}`} key={i} className="bg-white border border-gray-100 p-4 rounded-xl hover:border-[#10B981] transition-all group flex items-start gap-4 shadow-sm">
                       <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                          <HelpCircle size={20} />
                       </div>
                       <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#10B981] leading-tight">{s.title}</h4>
                    </Link>
                  ))}
               </div>
            </div>

            {/* Smart Choice Discovery - Repositioned */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-2 rounded-xl text-white">
                           <HandMetal size={20} />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Expert Shootout</h4>
                    </div>
                    <p className="text-sm font-bold text-gray-500 max-w-xl">
                        Not sure yet? Compare this phone with the <strong>Top Rated</strong> models in this category before making your final choice.
                    </p>
                </div>
                <Link href={`/compare?p1=${laptop.slug}`} className="whitespace-nowrap flex items-center justify-between bg-white px-8 py-5 rounded-2xl border border-emerald-100 hover:border-emerald-500 transition-all group shadow-sm font-black text-xs uppercase tracking-widest text-emerald-600 gap-4">
                    <span>Open VS Mode</span>
                    <ArrowRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

             {/* Discovery Modules: Related & Better */}
             <div className="flex flex-col gap-12 mt-12">
                {related.relatedLaptops.length > 0 && (
                   <section>
                      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                         <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">More from {laptop.brand?.name || 'this Brand'}</h3>
                         <Link href={`/brands/${laptop.brand?.slug}`} className="text-[10px] font-black text-[#10B981] uppercase tracking-widest hover:underline">Explore Hub</Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {related.relatedLaptops.map((l: any, i: number) => (
                            <LaptopCard key={i} laptop={l} />
                         ))}
                      </div>
                   </section>
                )}

                {related.betterLaptops.length > 0 && (
                   <section>
                      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                         <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Premium Alternatives</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Selected models with higher specs in this category</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {related.betterLaptops.map((l: any, i: number) => (
                            <LaptopCard key={i} laptop={l} />
                         ))}
                      </div>
                   </section>
                )}
             </div>

             {/* User Reviews Section */}
             <ReviewSystem laptopId={laptop.id} />

            {/* EXPLORE MORE (Bottom Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <h3 className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-6 py-4">Expert Analysis</h3>
                    <div className="p-6 flex flex-col gap-6">
                       {related.reviews.slice(0, 6).map((r: any, i: number) => (
                        <Link href={`/reviews/${r.slug}`} key={i} className="flex flex-col gap-2 group">
                           <h4 className="text-sm font-black text-gray-800 group-hover:text-[#10B981] leading-snug transition-colors">{r.title}</h4>
                        </Link>
                       ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <h3 className="bg-[#10B981] text-white text-xs font-black uppercase tracking-widest px-6 py-4">Tech News</h3>
                    <div className="p-6 flex flex-col gap-6">
                       {related.news.slice(0, 6).map((n: any, i: number) => (
                        <Link href={`/news/${n.slug}`} key={i} className="flex gap-4 group">
                           <h4 className="text-xs font-black text-gray-800 group-hover:text-[#10B981] leading-tight transition-colors">{n.title}</h4>
                        </Link>
                       ))}
                    </div>
                </div>
            </div>
        </div>
      </PurchaseProvider>
    </div>
  );
}
