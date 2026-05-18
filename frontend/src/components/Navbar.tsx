"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  TicketPercent,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import SearchAutocomplete from "./SearchAutocomplete";

type DesktopNavItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

type MobileNavItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export default function Navbar() {
  const pathname = usePathname();
  const { wishlist, compareList } = useAppContext();
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((previousValue) =>
            previousValue !== isScrolled ? isScrolled : previousValue,
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  const showShortenerNav = isReady && isAuthenticated;
  const desktopLinks: DesktopNavItem[] = [
    { href: "/laptops", label: "All Laptops" },
    {
      href: "/coupons",
      label: "Coupons",
      icon: <TicketPercent size={14} className="text-yellow-400" />,
    },
    {
      href: "/deals",
      label: "Hot Deals",
      icon: <Zap size={14} className="text-yellow-400" />,
    },
    ...(showShortenerNav ? [{ href: "/shortener", label: "Shortener" }] : []),
    { href: "/news", label: "News" },
    { href: "/reviews", label: "Reviews" },
    { href: "/guides", label: "Guides" },
    { href: "/solutions", label: "Solutions" },
  ];
  const mobileLinks: MobileNavItem[] = [
    { name: "All Laptops", path: "/laptops", icon: <ArrowRight size={14} /> },
    {
      name: "Coupons",
      path: "/coupons",
      icon: <TicketPercent size={14} className="text-[#10B981]" />,
    },
    {
      name: "Hot Deals",
      path: "/deals",
      icon: <Zap size={14} className="text-orange-500" />,
    },
    ...(showShortenerNav
      ? [{ name: "Shortener", path: "/shortener", icon: <LinkMiniIcon /> }]
      : []),
    { name: "Expert Reviews", path: "/reviews", icon: <StarIcon /> },
    { name: "Latest News", path: "/news", icon: <FileTextIcon /> },
    { name: "Buying Guides", path: "/guides", icon: <BookOpenIcon /> },
    { name: "Tech Solutions", path: "/solutions", icon: <HelpCircleIcon /> },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav
      className={`flex flex-col w-full bg-white font-sans sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
    >
      <div className="site-shell flex items-center justify-between py-3 lg:py-4 border-b border-gray-100 gap-4 lg:gap-8">
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="text-[#10B981] text-xl lg:text-3xl font-black tracking-tight uppercase group-hover:scale-105 transition-transform">
            LAPTOP
          </div>
          <div className="bg-[#10B981] text-white px-2 py-0.5 rounded text-base lg:text-xl font-bold uppercase tracking-widest leading-none group-hover:bg-[#059669] transition-colors">
            DUNIYA
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-[600px] relative items-center">
          <SearchAutocomplete />
        </div>

        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link
            href="/compare"
            className="relative flex flex-col items-center cursor-pointer text-gray-600 hover:text-[#10B981] transition-colors group"
          >
            <ArrowLeftRight size={20} className="group-hover:text-[#10B981]" />
            <span className="hidden lg:block text-[10px] font-bold mt-1 uppercase">
              Compare
            </span>
            {compareList && compareList.length > 0 ? (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {compareList.length}
              </span>
            ) : null}
          </Link>

          <Link
            href="/wishlist"
            className="relative flex flex-col items-center cursor-pointer text-gray-600 hover:text-[#10B981] transition-colors group"
          >
            <Heart size={20} className="group-hover:fill-[#10B981] transition-all" />
            <span className="hidden lg:block text-[10px] font-bold mt-1 uppercase">
              Wishlist
            </span>
            {wishlist && wishlist.length > 0 ? (
              <span className="absolute -top-1 -right-1 bg-[#10B981] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {wishlist.length}
              </span>
            ) : null}
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            {showShortenerNav ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-gray-200 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 transition-colors hover:border-[#10B981] hover:text-[#10B981]"
                >
                  {user?.username || "Dashboard"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-gray-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-gray-200 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 transition-colors hover:border-[#10B981] hover:text-[#10B981]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gray-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-gray-50 bg-[#fafafa]">
        <SearchAutocomplete isMobile={true} placeholder="Search brands, specs..." />
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((previousValue) => !previousValue)}
          className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-[#10B981] hover:border-[#10B981] transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="hidden md:block bg-[#10B981] w-full text-white overflow-x-auto shadow-md">
        <div className="site-shell flex items-center h-12 uppercase tracking-widest text-[11px] font-black whitespace-nowrap">
          {desktopLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${item.icon ? "gap-1.5" : ""} ${isActive(item.href) ? "bg-[#059669] shadow-inner" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {showShortenerNav ? (
            <Link
              href="/dashboard"
              className={`px-5 h-full flex items-center hover:bg-[#059669] transition-colors border-r border-[#ffffff1a] ${isActive("/dashboard") ? "bg-[#059669] shadow-inner" : ""}`}
            >
              Dashboard
            </Link>
          ) : null}

          <Link
            href="/compare"
            className="px-5 h-full flex items-center hover:bg-[#059669] transition-colors ml-auto bg-[#059669] border-l border-[#ffffff1a]"
          >
            Compare
          </Link>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 md:hidden shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col pt-6">
            <div className="px-6 flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <span className="text-sm font-black text-gray-900 uppercase tracking-widest">
                Main Menu
              </span>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col overflow-y-auto pb-10">
              {mobileLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`px-6 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-emerald-50 transition-colors ${isActive(item.path) ? "bg-emerald-50 text-[#10B981] font-black" : "text-gray-700 font-bold"}`}
                >
                  <span className="flex items-center gap-3 text-xs uppercase tracking-wider">
                    {item.icon} {item.name}
                  </span>
                  <ChevronDown size={14} className="-rotate-90 text-gray-300" />
                </Link>
              ))}

              <div className="px-6 py-5">
                {showShortenerNav ? (
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}

function StarIcon() {
  return <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />;
}

function FileTextIcon() {
  return <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />;
}

function BookOpenIcon() {
  return <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />;
}

function HelpCircleIcon() {
  return <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />;
}

function LinkMiniIcon() {
  return <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />;
}
