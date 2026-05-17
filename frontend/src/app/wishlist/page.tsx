"use client"; // [REFRESH_INP_V2]
import Link from "next/link";
import { Heart, Trash2, ArrowRight, Laptop, TicketPercent, ArrowLeftRight, Zap } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCompare, isInCompare } = useAppContext();

  return (
    <div className="bg-[#fcfdfd] min-h-screen py-12 font-sans">
      <div className="max-w-[1140px] mx-auto px-4">
        
        <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
           <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-4">
              <Heart className="w-12 h-12 text-[#10B981] fill-[#10B981]" /> Your Saved List
           </h1>
           <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
              Keep track of your favorite laptops and compare them when you're ready to decide.
           </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((l) => (
              <div key={l.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
                 
                 {/* Remove Button */}
                 <button 
                  onClick={() => removeFromWishlist(l.id)}
                  className="absolute top-4 right-4 p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all z-10"
                 >
                    <Trash2 size={18} />
                 </button>

                 {/* Image Area */}
                 <div className="aspect-[4/3] bg-[#fafafa] rounded-2xl flex items-center justify-center p-6 mb-6 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply relative overflow-hidden">
                    {l.image ? <img src={l.image} alt={l.title} className="max-h-full object-contain" /> : <Laptop className="w-20 h-20 text-gray-200" />}
                    <span className="absolute top-2 left-2 p-1.5 bg-white rounded-lg border border-gray-100 text-[#10B981] shadow-sm"><TicketPercent size={18} /></span>
                 </div>

                 {/* Content */}
                 <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-2">{l.brand?.name || 'Top Choice'}</span>
                    <Link href={`/laptops/${l.slug}`} className="hover:underline">
                       <h2 className="text-xl font-black text-gray-900 leading-tight mb-4 line-clamp-2">{l.title}</h2>
                    </Link>
                    
                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Price</span>
                          <p className="text-2xl font-black text-gray-900">₹{l.base_price}</p>
                       </div>
                       
                       <div className="flex gap-2">
                          <button 
                            onClick={() => isInCompare(l.id) ? null : addToCompare(l)}
                            className={`p-3 rounded-xl border transition-all ${isInCompare(l.id) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-500 hover:text-blue-500'}`}
                            title={isInCompare(l.id) ? "Added to Compare" : "Add to Compare"}
                          >
                             <ArrowLeftRight size={18} />
                          </button>
                          <Link href={`/laptops/${l.slug}`} className="bg-[#10B981] hover:bg-[#059669] text-white p-3 rounded-xl transition-all shadow-lg flex items-center justify-center">
                             <ArrowRight size={18} />
                          </Link>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
                <Heart className="w-10 h-10 text-gray-200" />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Your wishlist is empty</h2>
             <p className="text-gray-500 font-bold mb-10 max-w-sm">Start exploring our laptop collection and save the ones that catch your eye.</p>
             <Link href="/laptops" className="bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl uppercase tracking-widest text-xs flex items-center gap-2">
                Browse Laptops <ArrowRight size={16} />
             </Link>
          </div>
        )}

      </div>
    </div>
  );
}
