import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-[#10B981] pt-16 pb-8 font-sans">
      <div className="site-shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <div className="text-[#10B981] text-3xl font-black tracking-tight uppercase">
                PHONE
              </div>
              <div className="bg-[#10B981] text-white px-2 py-0.5 rounded text-xl font-bold uppercase tracking-widest leading-none">
                RADAR
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              PhoneRadar helps you discover the right phone faster with tracked prices,
              camera-first reviews, verified deals, and practical buying guides for
              every budget.
            </p>
            <div className="flex gap-3">
              {["facebook", "twitter", "instagram", "youtube"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10B981] hover:text-white transition-all shadow-sm"
                >
                  <span className="sr-only">{name}</span>
                  <div className="w-2 h-2 rounded-full bg-current" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2 inline-block">
              Explore
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-600">
              <li>
                <Link href="/mobiles" className="hover:text-[#10B981] transition-colors">
                  All Mobiles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#10B981] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#10B981] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-[#10B981] transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#10B981] transition-colors">
                  Phone Fixes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2 inline-block">
              Top Brands
            </h4>
            <ul className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-600">
              <li><Link href="/mobiles?brand=apple" className="hover:text-[#10B981] transition-colors">Apple</Link></li>
              <li><Link href="/mobiles?brand=samsung" className="hover:text-[#10B981] transition-colors">Samsung</Link></li>
              <li><Link href="/mobiles?brand=google" className="hover:text-[#10B981] transition-colors">Google</Link></li>
              <li><Link href="/mobiles?brand=oneplus" className="hover:text-[#10B981] transition-colors">OnePlus</Link></li>
              <li><Link href="/mobiles?brand=xiaomi" className="hover:text-[#10B981] transition-colors">Xiaomi</Link></li>
              <li><Link href="/mobiles?brand=nothing" className="hover:text-[#10B981] transition-colors">Nothing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-2 inline-block">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#10B981] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Email Us</span>
                  <span className="text-sm font-bold text-gray-700">hello@phoneradar.in</span>
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

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-400">
            © {new Date().getFullYear()} PHONERADAR. All rights reserved.
          </p>
          <div className="flex gap-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">
            <Link href="/privacy-policy" className="hover:text-[#10B981]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#10B981]">
              Terms of Use
            </Link>
            <Link href="/advertise" className="hover:text-[#10B981]">
              Advertise
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
