import type { Metadata } from 'next';
import Link from 'next/link';
import { Laptop, ChevronRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { formatImageUrl } from '@/lib/url-utils';
import { fetchApiList } from '@/lib/api';

async function getBrands() {
  return fetchApiList<any>("/brands/", { next: { revalidate: 300 } });
}

export const metadata: Metadata = {
  title: 'Shop by Brand - Latest Laptops & Best Deals 2026',
  description: 'Explore the best laptop brands including Apple, Dell, HP, Lenovo, and ASUS. Compare models, read expert reviews, and find verified coupons for every manufacturer.',
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50 transition-all" />
         <div className="max-w-[1140px] mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
               <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em] mb-4">Manufacturer Directory</span>
               <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none mb-6">
                  Shop by <span className="text-[#10B981]">Brand</span>
               </h1>
               <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
                  Every major laptop manufacturer in one place. Access dedicated hubs for pricing, verified coupons, and expert technical support for your favorite brand.
               </p>
            </div>
         </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 py-20">
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.length > 0 ? brands.map((brand: any) => (
               <Link 
                 href={`/brands/${brand.slug}`} 
                 key={brand.slug}
                 className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:border-[#10B981] transition-all duration-500 hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50 group-hover:bg-[#10B981] transition-colors" />
                  
                  <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner p-4">
                     {brand.logo ? (
                        <img src={formatImageUrl(brand.logo)} alt={brand.name} className="max-h-full object-contain" />
                     ) : (
                        <div className="text-4xl font-black text-gray-200">{brand.name[0]}</div>
                     )}
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#10B981] transition-colors">{brand.name}</h2>
                  
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                     <span className="flex items-center gap-1"><Laptop size={12} className="text-[#10B981]"/> Full Catalog</span>
                     <span className="w-1 h-1 bg-gray-200 rounded-full" />
                     <span className="flex items-center gap-1"><Zap size={12} className="text-orange-500"/> Verified Deals</span>
                  </div>

                  <div className="w-full h-px bg-gray-50 mb-6" />

                  <div className="flex items-center gap-2 text-[#10B981] font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                     Explore Brand Hub <ChevronRight size={14} />
                  </div>
               </Link>
            )) : (
              <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-[3rem]">
                Manufacturer Directory being updated...
              </div>
            )}
         </div>

         {/* Trust Section */}
         <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 bg-gray-900 rounded-[3rem] p-12 lg:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#10B981] opacity-10 rounded-full -mb-32 -mr-32" />
            
            <div className="flex flex-col gap-4">
               <ShieldCheck className="text-[#10B981] w-12 h-12 mb-2" />
               <h3 className="text-xl font-black uppercase tracking-tight">Verified Listings</h3>
               <p className="text-sm font-bold text-gray-400 leading-relaxed">We sync daily with official manufacturer catalogs to ensure every listing and price point is 100% accurate.</p>
            </div>
            
            <div className="flex flex-col gap-4">
               <Zap className="text-orange-500 w-12 h-12 mb-2" />
               <h3 className="text-xl font-black uppercase tracking-tight">Direct Discounts</h3>
               <p className="text-sm font-bold text-gray-400 leading-relaxed">Our relationships with top brands allow us to surface exclusive hidden deals and promo codes you won't find anywhere else.</p>
            </div>

            <div className="flex flex-col gap-4">
               <Star className="text-yellow-400 w-12 h-12 mb-2" />
               <h3 className="text-xl font-black uppercase tracking-tight">Expert Sentiment</h3>
               <p className="text-sm font-bold text-gray-400 leading-relaxed">Every brand page features aggregated sentiment from over 500 expert reviews to give you the honest truth about reliability.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
