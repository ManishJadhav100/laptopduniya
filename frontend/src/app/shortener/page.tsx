import type { Metadata } from "next";
import ShortLinkBuilder from "@/components/ShortLinkBuilder";

export const metadata: Metadata = {
  title: "Link Shortener - PhoneRadar",
  description:
    "Create saved short links that pass through the PhoneRadar 2-step redirect and ad placement flow.",
};

export default function ShortenerPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      <section className="relative overflow-hidden bg-gray-900 py-24 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-12 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px]" />
          <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
        </div>

        <div className="relative z-10 site-shell text-center">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
            Smart Redirect Tools
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Unlock the Power of Shortened URLs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-relaxed text-slate-300 md:text-lg">
            Monetize your Social Media, Youtube, Website, and Community
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-sm font-bold leading-relaxed text-slate-300 md:text-base">
            Step into the new age of monetization. Every link you share has
            potential, and we help you tap into it. Whether you&apos;re a
            content creator, influencer, or blogger, our URL shortener is not
            just about making links concise, it&apos;s about maximizing their
            value.
          </p>
        </div>
      </section>

      <section className="-mt-10 pb-20">
        <div className="site-shell">
          <ShortLinkBuilder />
        </div>
      </section>
    </div>
  );
}

