import Link from "next/link";
import { HelpCircle, ChevronRight, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { fetchApiList } from "@/lib/api";

async function getSolutions() {
  return fetchApiList<any>("/solutions/", { next: { revalidate: 300 } });
}

export const metadata = {
  title: "Laptop Tech Help Center - Laptop Duniya",
  description: "Step-by-step troubleshooting guides and solutions for common laptop software and hardware issues.",
};

export default async function SolutionsPage() {
  const solutionsItems = await getSolutions();

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-10 font-sans text-gray-800">
      <div className="site-shell">
        
        {/* Solutions Header */}
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-6">
              <Link href="/" className="hover:text-[#10B981]">Home</Link>
              <ChevronRight size={10} />
              <span className="text-[#10B981]">Tech Help Center</span>
           </div>
           <h1 className="text-[22px] font-black text-gray-900 tracking-tight mb-2">Tech Fixes & Support</h1>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">Don't let technical glitches slow you down. Browse our verified step-by-step solutions for thousands of laptop hardware and software problems.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             {solutionsItems.length > 0 ? solutionsItems.map((item: any, i: number) => (
                <Link href={`/solutions/${item.slug}`} key={i} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-2xl hover:border-[#10B981] transition-all group flex flex-col sm:flex-row items-center sm:items-start gap-8 relative overflow-hidden">
                   
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:bg-[#10B981] group-hover:text-white transition-colors shrink-0">
                      <HelpCircle size={32} />
                   </div>
                   
                   <div className="flex-1 flex flex-col text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                         <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm border border-orange-600 uppercase tracking-widest leading-none">Verified Fix</span>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Updated Weekly</span>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 leading-tight mb-3 group-hover:text-[#10B981] transition-colors">{item.title}</h3>
                      <p className="text-gray-500 text-sm font-bold leading-relaxed mb-6 line-clamp-2 italic">
                         "{item.meta_description}"
                      </p>
                      <div className="mt-auto flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black uppercase text-gray-800 group-hover:text-[#10B981] tracking-widest decoration-2 underline-offset-4 decoration-[#10B981] transition-all">
                         View Step-by-Step Solution <ArrowRight size={14} />
                      </div>
                   </div>
                </Link>
             )) : (
                <div className="py-20 text-center text-gray-300 font-black uppercase tracking-widest italic border-2 border-dashed border-gray-100 rounded-3xl">Expert help articles being prepared...</div>
             )}
          </div>

          {/* Help Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
             
             {/* Newsletter / Contact Help */}
             <div className="bg-[#10B981] bg-opacity-5 border border-[#10B981] border-opacity-10 rounded-2xl p-8 text-center flex flex-col items-center">
                <Mail className="w-10 h-10 text-[#10B981] mb-4" />
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide mb-2 text-center">Join Tech Inner Circle</h4>
                <p className="text-[11px] text-gray-500 font-bold mb-6 text-center">Receive weekly troubleshooting tips and software health alerts for your laptop model.</p>
                <input type="text" placeholder="Email Address" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs mb-3 outline-none focus:border-[#10B981]" />
                <button className="w-full bg-[#10B981] text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10">Subscribe Now</button>
             </div>

             <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 border-b border-gray-800 pb-4 flex items-center gap-2"><ShieldCheck className="text-[#10B981]" /> Laboratory Fixes</h3>
                <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                   "Every technical solution provided on Laptop Duniya is tested by our engineering team across multiple BIOS and Windows versions to ensure accuracy."
                </p>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}

