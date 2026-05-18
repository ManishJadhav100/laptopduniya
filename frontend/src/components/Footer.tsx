import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-[#10B981] pt-16 pb-8 font-sans">
      <div className="site-shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
               <div className="text-[#10B981] text-3xl font-black tracking-tight uppercase">LAPTOP</div>
               <div className="bg-[#10B981] text-white px-2 py-0.5 rounded text-xl font-bold uppercase tracking-widest leading-none">DUNIYA</div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Laptop Duniya is your one-stop destination for the latest laptop deals, expert reviews, and comprehensive buying guides. We help you pick the perfect machine at the best price.
            </p>
            <div className="flex gap-3">
               {/* Facebook */}
               <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               </a>
               {/* Twitter */}
               <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
               </a>
               {/* Instagram */}
               <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               </a>
               {/* Youtube */}
               <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2 inline-block">Explore</h4>
            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-600">
                <li><Link href="/laptops" className="hover:text-[#10B981] transition-colors">All Laptops</Link></li>
                <li><Link href="/about" className="hover:text-[#10B981] transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#10B981] transition-colors">Contact Us</Link></li>
                <li><Link href="/affiliate-disclosure" className="hover:text-[#10B981] transition-colors">Affiliate Disclosure</Link></li>
                <li><Link href="/solutions" className="hover:text-[#10B981] transition-colors">Tech Fixes</Link></li>
            </ul>
          </div>

          {/* Trending Brands */}
          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2 inline-block">Top Brands</h4>
            <ul className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-600">
               <li><Link href="/laptops?brand=apple" className="hover:text-[#10B981] transition-colors">Apple</Link></li>
               <li><Link href="/laptops?brand=dell" className="hover:text-[#10B981] transition-colors">Dell</Link></li>
               <li><Link href="/laptops?brand=lenovo" className="hover:text-[#10B981] transition-colors">Lenovo</Link></li>
               <li><Link href="/laptops?brand=hp" className="hover:text-[#10B981] transition-colors">HP</Link></li>
               <li><Link href="/laptops?brand=asus" className="hover:text-[#10B981] transition-colors">ASUS</Link></li>
               <li><Link href="/laptops?brand=acer" className="hover:text-[#10B981] transition-colors">Acer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2 inline-block">Get in Touch</h4>
            <div className="flex flex-col gap-4">
               <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#10B981] shrink-0" />
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-gray-400 uppercase">Email Us</span>
                     <span className="text-sm font-bold text-gray-700">laptopduniya77@gmail.com</span>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#10B981] shrink-0" />
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-gray-400 uppercase">Headquarters</span>
                     <span className="text-sm font-bold text-gray-700">Pune, Maharashtra 416001</span>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs font-bold text-gray-400">© {new Date().getFullYear()} LAPTOP DUNIYA. All rights reserved.</p>
           <div className="flex gap-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">
               <Link href="/privacy-policy" className="hover:text-[#10B981]">Privacy Policy</Link>
               <Link href="/terms" className="hover:text-[#10B981]">Terms of Use</Link>
               <Link href="/advertise" className="hover:text-[#10B981]">Advertise</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
