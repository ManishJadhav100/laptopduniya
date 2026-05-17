import { TicketPercent } from "lucide-react";
import CouponCard from "@/components/CouponCard";
import { fetchApiList } from "@/lib/api";

async function getCoupons() {
  return fetchApiList<any>("/coupons/", { next: { revalidate: 300 } });
}

export const metadata = {
  title: "Latest Laptop Coupons & Promo Codes 2026 - Laptop Duniya",
  description: "Highest savings on HP, Dell, Apple, and Lenovo laptops. Verified promo codes and direct discount deals.",
};

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="max-w-[1140px] mx-auto px-4">
        
        {/* Page Header */}
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-4">
              <TicketPercent className="w-12 h-12 text-[#10B981]" /> Laptop Coupons & Deals
           </h1>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
              Save up to $500 on your next machine. We manually verify every promo code and direct discount deal daily.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupons.length > 0 ? coupons.map((c: any, i: number) => (
            <CouponCard key={i} coupon={c} />
          )) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <TicketPercent className="w-16 h-16 text-gray-100 animate-pulse mb-4" />
               <p className="text-gray-300 font-black uppercase tracking-widest">More savings incoming...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
