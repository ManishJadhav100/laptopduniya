import Link from "next/link";
import { Laptop, TicketPercent, ShieldCheck, HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";
import LaptopCard from "@/components/LaptopCard";
import MatchmakerQuiz from "@/components/tools/MatchmakerQuiz";
import NewsletterSection from "@/components/NewsletterSection";
import Image from "next/image";
import { formatImageUrl } from "@/lib/url-utils";
import { fetchApiJson } from "@/lib/api";
import SearchAutocomplete from "@/components/SearchAutocomplete";

async function getHomeData() {
  return fetchApiJson<any>("/home/", {
    next: { revalidate: 60 },
  });
}

export default async function Home() {
  const data = await getHomeData();
  
   const featured = data?.featured_laptops && data.featured_laptops.length > 0 ? data.featured_laptops : [];
  const news = data?.latest_news || [];
  const reviews = data?.latest_reviews || [];
  const guides = data?.buying_guides_highlights || [];
  const brands = data?.popular_brands || [
    { name: 'Apple', logo: null, color: '#f5f5f7' },
    { name: 'Lenovo', logo: null, color: '#ffebee' },
    { name: 'Dell', logo: null, color: '#e3f2fd' },
    { name: 'HP', logo: null, color: '#e1f5fe' },
    { name: 'ASUS', logo: null, color: '#f3e5f5' },
    { name: 'Acer', logo: null, color: '#e8f5e9' }
  ];

  return (
    <div className="flex flex-col bg-[#fcfdfd] min-h-screen pb-16 font-sans">
       
       {/* Hero Banner Sub-header */}
       <div className="relative w-full overflow-hidden bg-gray-900 py-24 lg:py-32 flex flex-col items-center justify-center text-center">
            {/* Dark Mode Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen opacity-70"></div>
               <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen opacity-70"></div>
            </div>

          <div className="max-w-[800px] mx-auto px-4 relative z-10 w-full">
              <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 mb-6 tracking-tight">
                  Find Your Ultimate Laptop Deal
              </h1>
              <p className="text-gray-300 font-medium mb-12 text-xl max-w-[600px] mx-auto leading-relaxed">
                  Compare top-rated machines, verify community reviews, and track real-time price drops.
              </p>
              
              {/* Huge GrabOn Style Search */}
              <div className="hidden md:flex relative shadow-[0_0_50px_rgba(16,185,129,0.15)] rounded-full max-w-[700px] mx-auto z-50 transform hover:scale-[1.01] transition-transform">
                  <SearchAutocomplete placeholder="Search 5,000+ laptops and trending deals..." />
              </div>

              {/* Brand bubbles */}
              <div className="flex justify-center flex-wrap gap-4 md:gap-8 mt-16 pb-4">
                 {brands.map((b: any) => (
                     <Link href={`/brands/${b.slug || b.name.toLowerCase()}`} key={b.name} className="flex flex-col items-center group cursor-pointer">
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:border-emerald-400/50 group-hover:bg-white/10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 overflow-hidden p-4">
                            {
                               <div className="w-full h-full rounded-full flex items-center justify-center font-black text-white text-[12px]">{b.name}</div>
                            }
                         </div>
                         <span className="text-[10px] font-black text-gray-400 group-hover:text-emerald-400 mt-4 uppercase tracking-[0.2em] transition-colors">{b.name}</span>
                     </Link>
                 ))}
              </div>
          </div>
       </div>
      
      {/* AI Matchmaker Section - Ultra Premium Redesign */}
      <div className="max-w-[1140px] mx-auto px-4 lg:px-8 mt-24 w-full relative">
         <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl z-0"></div>
         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl z-0"></div>

         <div className="flex flex-col lg:flex-row items-center gap-12 bg-white/60 backdrop-blur-3xl rounded-[3rem] p-2 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/80 relative z-10">
            <div className="lg:w-1/3 p-10 lg:p-14 text-center lg:text-left flex flex-col justify-center h-full bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px]"></div>
               <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 w-fit mx-auto lg:mx-0 border border-emerald-500/20 shadow-sm">
                  <Sparkles size={12} className="text-emerald-400" /> AI Powered
               </div>
               <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 tracking-tight leading-tight">Can't decide? Let our AI find your perfect match.</h2>
               <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10">Tell us your budget and usage, and we'll analyze specs to find the best value laptops for you.</p>
               
               <div className="flex flex-col gap-5 text-left">
                  {['Personalized Picks', 'Real-time Price Sync', 'Expert Benchmarks'].map((feat) => (
                     <div key={feat} className="flex items-center gap-4 text-[11px] font-black text-gray-300 uppercase tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                           <CheckCircle2 size={12} className="text-emerald-400" />
                        </div>
                        {feat}
                     </div>
                  ))}
               </div>
            </div>
            <div className="lg:w-2/3 w-full py-4 pr-4">
               <MatchmakerQuiz />
            </div>
         </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 mt-24">
         
         {/* Main Content Column (Deals Feed) */}
         <div className="lg:col-span-8 flex flex-col gap-10">
             <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                        <TicketPercent size={20} />
                    </div>
                    <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Trending Deals</h2>
                 </div>
                 <Link href="/laptops" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-gray-200 hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm bg-white">View All</Link>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {featured.slice(0, 6).map((l: any, i: number) => (
                  <LaptopCard key={i} laptop={l} />
               ))}
             </div>
         </div>

         {/* Sidebar Right Column */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Reviews Block */}
            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
               <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white font-black px-8 py-5 text-[10px] uppercase tracking-[0.3em] flex items-center justify-between relative overflow-hidden">
                  <span className="relative z-10">Expert Reviews</span>
                  <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-r from-transparent to-white/10 skew-x-12 transform translate-x-8"></div>
               </div>
               <div className="p-8 space-y-6">
                  {reviews.length > 0 ? reviews.slice(0, 6).map((r: any, i: number) => (
                    <Link href={`/reviews/${r.slug}`} key={i} className="block group border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                       <h4 className="text-sm font-black text-gray-900 leading-snug group-hover:text-emerald-500 transition-colors mb-3 pr-4">{r.title}</h4>
                       <div className="flex items-center gap-3">
                          <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-amber-100">Score {r.overall_rating}/10</div>
                       </div>
                       <p className="text-[11px] text-gray-500 mt-3 font-medium line-clamp-2 leading-relaxed">"{r.verdict}"</p>
                    </Link>
                  )) : <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center py-6">Analyzers warming up...</p>}
               </div>
            </div>

            {/* Buying Guides Block */}
            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col mt-4">
               <div className="bg-emerald-50 text-emerald-600 font-black px-8 py-5 text-[10px] uppercase tracking-[0.3em] flex items-center justify-between relative border-b border-emerald-100/50">
                  <span>Buying Guides</span>
               </div>
               <div className="p-8 space-y-6 divide-y divide-gray-50">
                  {guides.length > 0 ? guides.slice(0, 6).map((g: any, i: number) => (
                    <Link href={`/guides/${g.slug}`} key={i} className="block pt-6 first:pt-0 group">
                       <h4 className="text-[13px] font-black text-gray-900 leading-snug group-hover:text-emerald-500 transition-colors mb-2">{g.title}</h4>
                       <p className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed">{g.meta_description}</p>
                    </Link>
                  )) : <p className="text-[10px] text-gray-300 font-black uppercase text-center py-6 tracking-[0.2em]">More coming soon</p>}
               </div>
            </div>

            {/* Fix Solutions Block */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-10 text-center flex flex-col items-center mt-4 group hover:shadow-xl hover:shadow-indigo-500/10 transition-all">
               <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HelpCircle className="w-8 h-8 text-indigo-500 animate-pulse" />
               </div>
               <h3 className="font-black text-gray-900 text-xl mb-3 tracking-tight">Tech Support</h3>
               <p className="text-[11px] text-gray-500 font-medium mb-8 leading-relaxed max-w-[200px]">Step-by-step troubleshooting for your laptop hardware issues.</p>
               <Link href="/solutions" className="w-full py-4 font-black text-[10px] bg-indigo-500 text-white rounded-xl uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
                  Browse Fixes
               </Link>
            </div>
         </div>
      </div>
      <NewsletterSection />
    </div>
  );
}
