import { Zap } from "lucide-react";
import DealCard from "@/components/DealCard";
import { fetchApiList } from "@/lib/api";

async function getDeals() {
  return fetchApiList<any>("/coupons/?is_deal=true", { next: { revalidate: 300 } });
}

export const metadata = {
  title: "Hot Mobile Deals & Direct Discounts 2026 - PhoneRadar",
  description: "Biggest price drops on premium smartphones. Verified direct deals from official stores.",
};

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="site-shell">
        
        {/* Page Header */}
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-4">
              <Zap className="w-12 h-12 text-yellow-500 fill-yellow-500" /> Hot Mobile Deals
           </h1>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
              Skip the promo codes. These are direct price drops and official phone deals verified for the best value today.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {deals.length > 0 ? deals.map((d: any, i: number) => (
            <DealCard key={i} deal={d} />
          )) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <Zap className="w-16 h-16 text-gray-100 animate-pulse mb-4" />
               <p className="text-gray-300 font-black uppercase tracking-widest">More price drops coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

