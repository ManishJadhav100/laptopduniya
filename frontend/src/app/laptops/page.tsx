import Link from "next/link";
import { Filter, ChevronRight, X } from "lucide-react";
import LaptopCard from "@/components/LaptopCard";
import FilterSidebar from "@/components/FilterSidebar";
import SortControl from "@/components/SortControl";

import { fetchApiList } from "@/lib/api";

async function getLaptops(searchParams: any) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value as string);
      }
    }
  });

  const query = params.toString();

  return fetchApiList<any>(`/mobiles/${query ? `?${query}` : ""}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
}

async function getFiltersData() {
  const [brands, categories] = await Promise.all([
    fetchApiList<any>("/brands/", { next: { revalidate: 300 } }),
    fetchApiList<any>("/categories/", { next: { revalidate: 300 } }),
  ]);

  return { brands, categories };
}

export const metadata = {
  title: "All Mobile Deals & Models - PhoneRadar",
  description: "Browse the complete catalog of smartphones with latest pricing and deals.",
};

export default async function LaptopListingPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const laptops = await getLaptops(searchParams);
  const filterData = await getFiltersData();

  const activeFilterCount = Object.keys(searchParams).length;

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="site-shell">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">
                 <Link href="/" className="hover:text-[#10B981]">Home</Link>
                 <ChevronRight size={10} />
              <span className="text-[#10B981]">All Mobiles</span>
              </div>
              <h1 className="text-[22px] font-black text-gray-900 tracking-tight">Browse All Mobile Deals</h1>
              <p className="text-gray-500 font-bold text-sm max-w-xl">Explore our hand-picked catalog of the latest smartphones from global brands, verified for quality and value.</p>
           </div>
           
           <SortControl />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-3">
             <FilterSidebar brands={filterData.brands} categories={filterData.categories} />
          </div>

          {/* Mobile Filter (Floating) - Also render here but it will handle its own FAB status */}
          <div className="lg:hidden">
             <FilterSidebar brands={filterData.brands} categories={filterData.categories} />
          </div>

          {/* Product Feed */}
          <div className="lg:col-span-9">
            {laptops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {laptops.map((l: any, i: number) => (
                    <LaptopCard key={i} laptop={l} />
                ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Filter className="w-10 h-10 text-gray-200" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2">No mobiles match your selection</h2>
                    <p className="text-gray-500 font-bold mb-8">Try adjusting your price range or selecting different brands, chipsets, or screen sizes.</p>
                    
                    {activeFilterCount > 0 && (
                        <Link href="/mobiles" className="inline-flex items-center gap-2 bg-[#10B981] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#059669] transition-all">
                            <X size={16} /> Reset Active Filters
                        </Link>
                    )}
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

