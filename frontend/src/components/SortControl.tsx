"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortControl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val) {
      params.set("ordering", val);
    } else {
      params.delete("ordering");
    }
    router.push(`?${params.toString()}`);
  };

  const currentSort = searchParams.get("ordering") || "";

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-xl shadow-sm">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Sort By</span>
        <select 
          value={currentSort}
          onChange={handleSortChange}
          className="text-xs font-black text-gray-900 bg-transparent outline-none cursor-pointer pr-4"
        >
          <option value="">Recommended</option>
          <option value="base_price">Price: Low to High</option>
          <option value="-base_price">Price: High to Low</option>
          <option value="-created_at">Latest Arrivals</option>
        </select>
      </div>
    </div>
  );
}
