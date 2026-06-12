"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock3, ExternalLink, ShieldCheck, X } from "lucide-react";
import AdSenseBlock from "@/components/AdSenseBlock";
import CountdownAction from "@/components/CountdownAction";

interface LaptopGatewayOverlayProps {
  laptop: {
    title: string;
    slug: string;
    image?: string | null;
    basePrice?: string | number;
    brandName?: string;
  };
  stepTwoUrl: string;
}

const FIRST_GATE_AD_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_REDIRECT_TOP_SLOT || "6542869990";

export default function LaptopGatewayOverlay({
  laptop,
  stepTwoUrl,
}: LaptopGatewayOverlayProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function armFinalGatewayPage() {
    const response = await fetch("/apis/gateway/arm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: stepTwoUrl }),
    });

    if (!response.ok) {
      throw new Error("Unable to arm final gateway page.");
    }
  }

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/70 p-2 backdrop-blur-sm sm:p-4 md:p-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/20 bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(135deg,#0f172a,#111827_55%,#1f2937)] p-5 pr-16 text-white sm:p-7 sm:pr-20 md:p-10">
            <Link
              href={`/mobiles/${laptop.slug}`}
              aria-label="Close redirect popup"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:bg-white/20 sm:right-5 sm:top-5"
            >
              <X size={18} />
            </Link>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
              <Clock3 size={14} />
              Step 1 of 2
            </div>

            <h2 className="max-w-xl text-[2.15rem] font-black leading-[1.05] sm:text-3xl md:text-4xl">
              Your link is unlocked. Continue opens after 10 seconds.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-slate-300 sm:text-[15px]">
              You are viewing the first step of the redirect flow. When the timer ends, continue to the
              second page before the final destination URL opens.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300 sm:gap-6 sm:text-[11px] sm:tracking-widest">
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-300" />
                Verified gateway
              </span>
              <span className="flex items-center gap-2">
                <ExternalLink size={14} className="text-emerald-300" />
                Outbound link protection
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5 bg-[#f8fafc] p-4 sm:p-6 md:gap-6 md:p-8">
            <div className="rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-5">
              <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:h-24 sm:w-24">
                  {laptop.image ? (
                    <Image
                      src={laptop.image}
                      alt={laptop.title}
                      width={160}
                      height={120}
                      unoptimized={true}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
                    Random Mobile Page
                  </span>
                  <h3 className="text-base font-black leading-tight text-gray-900 sm:text-lg">
                    {laptop.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 sm:gap-3 sm:text-[11px] sm:tracking-widest">
                    {laptop.brandName ? <span>{laptop.brandName}</span> : null}
                    {laptop.basePrice ? (
                      <span className="text-[#10B981]">Rs. {laptop.basePrice}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <AdSenseBlock slot={FIRST_GATE_AD_SLOT} label="Ad Placement Block 1" />

            <div className="rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Next Step
              </p>
              <CountdownAction
                seconds={10}
                href={stepTwoUrl}
                onReadyClick={armFinalGatewayPage}
                pendingLabel="Continue unlocks in"
                readyLabel="Continue to page 2"
                processingLabel="Securing page 2..."
              />
              <p className="mt-4 text-xs font-bold leading-relaxed text-gray-500 sm:text-[13px]">
                The second page adds another short timer before the final store
                link opens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
