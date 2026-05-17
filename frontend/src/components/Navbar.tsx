"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, TicketPercent, Zap, ChevronDown, Menu, X, ArrowRight, ArrowLeftRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Navbar() {
  const pathname = usePathname();
  const { wishlist, compareList } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);


  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`flex flex-col w-full bg-white font-sans sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      
      {/* Top Row: Branding & Desktop Search */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 border-b border-gray-100 max-w-[1140px] mx-auto w-full gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
             <div className="text-[#10B981] text-xl lg:text-3xl font-black tracking-tight uppercase group-hover:scale-105 transition-transform">LAPTOP</div>
             <div className="bg-[#10B981] text-white px-2 py-0.5 rounded text-base lg:text-xl font-bold uppercase tracking-widest leading-none group-hover:bg-[#059669] transition-colors">DUNIYA</div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-[600px] relative items-center">
             <SearchAutocomplete />
          </div>

          {/* Desktop Setup Links & Mobile Actions */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
             <Link href="/compare" className="relative flex flex-col items-center cursor-pointer text-gray-600 hover:text-[#10B981] transition-colors group">
                <ArrowLeftRight size={20} className="group-hover:text-[#10B981]" />
                <span className="hidden lg:block text-[10px] font-bold mt-1 uppercase">Compare</span>
                {compareList && compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {compareList.length}
                  </span>
                )}
             </Link>
             <Link href="/wishlist" className="relative flex flex-col items-center cursor-pointer text-gray-600 hover:text-[#10B981] transition-colors group">
                <Heart size={20} className="group-hover:fill-[#10B981] transition-all" />
                <span className="hidden lg:block text-[10px] font-bold mt-1 uppercase">Wishlist</span>
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#10B981] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {wishlist.length}
                  </span>
                )}
             </Link>
          </div>
      </div>

      {/* NEW: Mobile Search & Menu Row (Visible only on mobile) */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-gray-50 bg-[#fafafa]">
          <SearchAutocomplete isMobile={true} placeholder="Search brands, specs..." />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-[#10B981] hover:border-[#10B981] transition-all"
          >
             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:block bg-[#10B981] w-full text-white overflow-x-auto shadow-md">
         <div className="max-w-[1140px] mx-auto flex items-center h-12 uppercase tracking-widest text-[11px] font-black px-4 whitespace-nowrap">
            <Link href="/laptops" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive('/laptops') ? 'bg-[#059669] shadow-inner' : ''}`}>All Laptops</Link>

            <Link href="/coupons" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] gap-1.5 ${isActive('/coupons') ? 'bg-[#059669] shadow-inner' : ''}`}>
               <TicketPercent size={14} className="text-yellow-400" /> Coupons
            </Link>
            <Link href="/deals" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] gap-1.5 ${isActive('/deals') ? 'bg-[#059669] shadow-inner' : ''}`}>
               <Zap size={14} className="text-yellow-400" /> Hot Deals
            </Link>
            <Link href="/shortener" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive('/shortener') ? 'bg-[#059669] shadow-inner' : ''}`}>Shortener</Link>
            <Link href="/news" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive('/news') ? 'bg-[#059669] shadow-inner' : ''}`}>News</Link>
            <Link href="/reviews" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive('/reviews') ? 'bg-[#059669] shadow-inner' : ''}`}>Reviews</Link>
            <Link href="/guides" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive('/guides') ? 'bg-[#059669] shadow-inner' : ''}`}>Guides</Link>
            <Link href="/solutions" className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive('/solutions') ? 'bg-[#059669] shadow-inner' : ''}`}>Solutions</Link>
            <Link href="/compare" className="px-5 h-full flex items-center hover:bg-[#059669] transition-colors ml-auto bg-[#059669] border-l border-[#ffffff1a]">Compare</Link>
         </div>
      </div>

      {/* Mobile Backdrop & Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 md:hidden shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col pt-6">
             <div className="px-6 flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
               <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Main Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
             </div>
             <div className="flex flex-col overflow-y-auto pb-10">
                {[
                  { name: 'All Laptops', path: '/laptops', icon: <ArrowRight size={14}/> },
                  { name: 'Coupons', path: '/coupons', icon: <TicketPercent size={14} className="text-[#10B981]"/> },
                  { name: 'Hot Deals', path: '/deals', icon: <Zap size={14} className="text-orange-500"/> },
                  { name: 'Shortener', path: '/shortener', icon: <LinkMiniIcon /> },
                  { name: 'Expert Reviews', path: '/reviews', icon: <StarIcon /> },
                  { name: 'Latest News', path: '/news', icon: <FileTextIcon /> },
                  { name: 'Buying Guides', path: '/guides', icon: <BookOpenIcon /> },
                  { name: 'Tech Solutions', path: '/solutions', icon: <HelpCircleIcon /> },
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    className={`px-6 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-emerald-50 transition-colors ${isActive(item.path) ? 'bg-emerald-50 text-[#10B981] font-black' : 'text-gray-700 font-bold'}`}
                  >
                    <span className="flex items-center gap-3 text-xs uppercase tracking-wider">{item.icon} {item.name}</span>
                    <ChevronDown size={14} className="-rotate-90 text-gray-300" />
                  </Link>
                ))}
                
             </div>
          </div>
        </>
      )}

    </nav>
  );
}

// Simple icons for the mobile menu list
function StarIcon() { return <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> }
function FileTextIcon() { return <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> }
function BookOpenIcon() { return <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" /> }
function HelpCircleIcon() { return <div className="w-1.5 h-1.5 bg-green-400 rounded-full" /> }
function LinkMiniIcon() { return <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> }
