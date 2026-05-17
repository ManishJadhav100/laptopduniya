"use client";
import { Heart, ArrowLeftRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface Laptop {
  id: number;
  title: string;
  slug: string;
  base_price: string;
  image: string | null;
}

export default function ProductActions({ laptop }: { laptop: Laptop }) {
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare } = useAppContext();

  const handleWishlist = () => {
    if (isInWishlist(laptop.id)) {
      removeFromWishlist(laptop.id);
    } else {
      addToWishlist(laptop);
    }
  };

  const handleCompare = () => {
    if (isInCompare(laptop.id)) {
      removeFromCompare(laptop.id);
    } else {
      addToCompare(laptop);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4 mb-2">
      <button 
        onClick={handleWishlist}
        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${isInWishlist(laptop.id) ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-red-500 hover:text-red-500'}`}
      >
        <Heart size={18} fill={isInWishlist(laptop.id) ? "currentColor" : "none"} />
        {isInWishlist(laptop.id) ? 'Saved' : 'Wishlist'}
      </button>
      
      <button 
        onClick={handleCompare}
        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${isInCompare(laptop.id) ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-500 hover:text-blue-500'}`}
      >
        <ArrowLeftRight size={18} />
        {isInCompare(laptop.id) ? 'Compare List' : 'Compare'}
      </button>
    </div>
  );
}
