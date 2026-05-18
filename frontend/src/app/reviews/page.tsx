import Link from "next/link";
import { Star, Laptop, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { fetchApiList } from "@/lib/api";

async function getReviews() {
  return fetchApiList<any>("/reviews/", { next: { revalidate: 300 } });
}

export const metadata = {
  title: "Expert Laptop Reviews - Laptop Duniya",
  description: "Read in-depth technical analysis and hands-on reviews of the latest laptops.",
};

export default async function ReviewsPage() {
  const reviewsItems = await getReviews();

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="site-shell">
        
        {/* Reviews Header */}
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-6">
              <Link href="/" className="hover:text-[#10B981]">Home</Link>
              <ChevronRight size={10} />
              <span className="text-[#10B981]">Reviews Hub</span>
           </div>
           <div className="flex items-center gap-4 mb-4">
              <h1 className="text-[22px] font-black text-gray-900 tracking-tight leading-none">Expert Tech Reviews</h1>
              <div className="bg-[#10B981] bg-opacity-10 text-[#10B981] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm"><ShieldCheck size={14} /> Laboratory Tested</div>
           </div>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">Our experts benchmark performance, battery, and display quality to give you the most accurate verdict on every machine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviewsItems.length > 0 ? reviewsItems.map((review: any, i: number) => (
            <Link href={`/reviews/${review.slug}`} key={i} className="flex flex-col bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
               
               {/* Score Circle */}
               <div className="absolute top-8 right-8 w-16 h-16 rounded-full border-4 border-gray-50 flex items-center justify-center bg-white shadow-xl">
                  <span className="text-2xl font-black text-[#10B981] tracking-tight">{review.overall_rating}</span>
               </div>

               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-[#10B981] transition-colors">
                    <Laptop size={24} className="text-gray-400 group-hover:text-[#10B981] transition-colors" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Hardware Analysis</span>
                     <p className="text-sm font-black text-gray-900 group-hover:underline">{review.laptop_title}</p>
                  </div>
               </div>
               
               <h2 className="text-lg font-black text-gray-900 leading-tight mb-4 group-hover:text-[#10B981] transition-colors">
                  {review.title}
               </h2>
               
               <p className="text-gray-500 text-sm font-bold leading-relaxed mb-10 flex-1 italic line-clamp-3">
                  "{review.verdict}"
               </p>
               
               <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expert Verdict</span>
                     <div className="flex items-center text-yellow-500 gap-1.5 mt-1">
                        <Star fill="currentColor" size={12} />
                        <span className="font-black text-xs text-gray-900 tracking-tighter">PREMIUM SCORE</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#10B981] tracking-widest">
                     Read Full Analysis <ArrowRight size={14} />
                  </div>
               </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <Laptop className="w-16 h-16 text-gray-100 animate-pulse mb-4" />
               <p className="text-gray-300 font-black uppercase tracking-widest">More laboratory tests in progress...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

