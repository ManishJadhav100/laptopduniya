"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Clock3, ExternalLink, ShieldCheck } from "lucide-react";
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
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm md:p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(135deg,#0f172a,#111827_55%,#1f2937)] p-8 text-white md:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
              <Clock3 size={14} />
              Step 1 of 2
            </div>

            <h2 className="max-w-xl text-3xl font-black leading-tight md:text-4xl">
              Your link is unlocked. Continue opens after 10 seconds.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-slate-300">
              You are viewing the first
              step of the redirect flow. When the timer ends, continue to the
              second page before the final destination URL opens.
            </p>

            <div className="mt-8 flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-300">
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

          <div className="flex flex-col gap-6 bg-[#f8fafc] p-6 md:p-8">
            <div className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
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

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
                    Random Laptop Page
                  </span>
                  <h3 className="text-lg font-black leading-tight text-gray-900">
                    {laptop.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    {laptop.brandName ? <span>{laptop.brandName}</span> : null}
                    {laptop.basePrice ? (
                      <span className="text-[#10B981]">Rs. {laptop.basePrice}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <AdSenseBlock slot={FIRST_GATE_AD_SLOT} label="Ad Placement Block 1" />

            <div className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm">
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
              <p className="mt-4 text-xs font-bold leading-relaxed text-gray-500">
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
