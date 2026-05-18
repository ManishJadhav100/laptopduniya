import { ArrowRight, Clock3, ShieldCheck, TicketPercent } from "lucide-react";
import AdSenseBlock from "@/components/AdSenseBlock";
import CountdownAction from "@/components/CountdownAction";
import type { OutboundGatewayPayload } from "@/lib/outbound-gateway";

const SECOND_GATE_AD_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_REDIRECT_BOTTOM_SLOT || "6542869990";

function getLinkTypeLabel(linkType?: string) {
  if (linkType === "coupon") return "Coupon unlock";
  if (linkType === "deal") return "Deal unlock";
  return "Verified retailer redirect";
}

export default function OutboundGatewayFinalScreen({
  payload,
}: {
  payload: OutboundGatewayPayload | null;
}) {
  if (!payload) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f6] px-4">
        <div className="max-w-lg rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-gray-900">
            Redirect link is missing or invalid
          </h1>
          <p className="mt-3 text-sm font-bold leading-relaxed text-gray-500">
            Open the offer again from the site so the gateway can rebuild the
            correct destination URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,#f8fafc,#eef6f4)] px-3 py-6 sm:px-4 sm:py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:gap-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:rounded-[2.5rem]">
          <div className="border-b border-gray-100 bg-gray-900 px-5 py-6 text-white sm:px-8 sm:py-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
              <Clock3 size={14} />
              Step 2 of 2
            </div>

            <h1 className="text-[2.15rem] font-black leading-[1.05] sm:text-3xl md:text-4xl">
              Final wait page before the destination URL opens
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-slate-300 sm:text-[15px]">
              Short 5-second countdown before continuing to the final link.
            </p>
          </div>

          <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="rounded-[1.5rem] border border-gray-200 bg-[#f8fafc] p-4 sm:rounded-[1.75rem] sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-[#10B981]">
                    <TicketPercent size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
                      Redirect Summary
                    </p>
                    <h2 className="text-xl font-black text-gray-900">
                      {payload.title || "Offer link"}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-sm font-bold text-gray-600">
                  <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                    <span className="uppercase tracking-widest text-gray-400">
                      Type
                    </span>
                    <span className="text-right text-gray-900">
                      {getLinkTypeLabel(payload.linkType)}
                    </span>
                  </div>

                  {payload.brandName ? (
                    <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                      <span className="uppercase tracking-widest text-gray-400">
                        Brand
                      </span>
                      <span className="text-right text-gray-900">
                        {payload.brandName}
                      </span>
                    </div>
                  ) : null}

                  {payload.storeName ? (
                    <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                      <span className="uppercase tracking-widest text-gray-400">
                        Store
                      </span>
                      <span className="text-right text-gray-900">
                        {payload.storeName}
                      </span>
                    </div>
                  ) : null}

                  {payload.couponCode ? (
                    <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                      <span className="uppercase tracking-widest text-emerald-700">
                        Coupon Code
                      </span>
                      <span className="font-mono text-right text-gray-900">
                        {payload.couponCode}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <AdSenseBlock
                slot={SECOND_GATE_AD_SLOT}
                label="Ad Placement Block 2"
              />
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
                  <ShieldCheck size={14} />
                  Secure handoff
                </div>

                <h3 className="text-[1.85rem] font-black leading-[1.08] text-gray-900 sm:text-2xl">
                  Continue to destination after the short 5-second timer
                </h3>

                <p className="mt-4 text-sm font-bold leading-relaxed text-gray-500 sm:text-[15px]">
                  When the button unlocks, you will be sent to the final
                  destination URL in this tab.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-gray-200 bg-[#f8fafc] p-4 sm:p-5">
                <CountdownAction
                  seconds={5}
                  href={payload.targetUrl}
                  pendingLabel="Continue unlocks in"
                  readyLabel="Continue to destination URL"
                />
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-black uppercase tracking-[0.15em] text-gray-400">
                  <ArrowRight size={14} />
                  Final redirect after confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
