"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Link2, Loader2, Sparkles } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import type { ShortenedLinkRecord } from "@/lib/short-links";

type LinkType = "retailer" | "deal" | "coupon";

const initialForm = {
  destination_url: "",
  title: "",
  brand_name: "",
  store_name: "",
  coupon_code: "",
  link_type: "retailer" as LinkType,
};

export default function ShortLinkBuilder() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ShortenedLinkRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const shortUrl = useMemo(() => {
    if (!result) return "";
    if (typeof window === "undefined") return result.short_path;
    return `${window.location.origin}${result.short_path}`;
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch(getApiUrl("/short-links/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.destination_url?.[0] ||
          data.detail ||
          "Unable to shorten this link right now.";
        throw new Error(message);
      }

      setResult(data as ShortenedLinkRecord);
    } catch (err: unknown) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] md:p-10">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#10B981]">
            <Sparkles size={14} />
            Saved in Django
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            Create a shareable short link
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-relaxed text-gray-500">
            Submit a destination URL and we will save it in the backend,
            generate a short code, and route visitors through the 2-page timer
            flow with your ad placement blocks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Destination URL
            </label>
            <input
              required
              type="url"
              placeholder="https://example.com/product-page"
              value={formData.destination_url}
              onChange={(e) =>
                setFormData({ ...formData, destination_url: e.target.value })
              }
              className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-5 text-sm font-bold outline-none transition-all focus:border-[#10B981] focus:bg-white"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Title
              </label>
              <input
                type="text"
                placeholder="MacBook Air M3 Offer"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-5 text-sm font-bold outline-none transition-all focus:border-[#10B981] focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Link Type
              </label>
              <select
                value={formData.link_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    link_type: e.target.value as LinkType,
                  })
                }
                className="w-full appearance-none rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-5 text-sm font-black uppercase outline-none transition-all focus:border-[#10B981] focus:bg-white"
              >
                <option value="retailer">Retailer</option>
                <option value="deal">Deal</option>
                <option value="coupon">Coupon</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="Apple"
                value={formData.brand_name}
                onChange={(e) =>
                  setFormData({ ...formData, brand_name: e.target.value })
                }
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-5 text-sm font-bold outline-none transition-all focus:border-[#10B981] focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Store Name
              </label>
              <input
                type="text"
                placeholder="Amazon"
                value={formData.store_name}
                onChange={(e) =>
                  setFormData({ ...formData, store_name: e.target.value })
                }
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-5 text-sm font-bold outline-none transition-all focus:border-[#10B981] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Coupon Code
            </label>
            <input
              type="text"
              placeholder="Optional coupon code"
              value={formData.coupon_code}
              onChange={(e) =>
                setFormData({ ...formData, coupon_code: e.target.value })
              }
              className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-5 text-sm font-bold outline-none transition-all focus:border-[#10B981] focus:bg-white"
            />
          </div>

          {error ? (
            <p className="text-[11px] font-black uppercase tracking-widest text-red-500">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-gray-200 transition-all hover:bg-black disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Link2 size={18} />}
            {loading ? "Creating..." : "Shorten Link"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-[2.5rem] bg-gray-900 p-8 text-white shadow-2xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
            Redirect Flow
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Every short link uses your ad-supported handoff
          </h3>
          <div className="mt-8 grid gap-4">
            {[
              "Short URL opens the gateway entry route.",
              "Step 1 picks a random laptop page and shows a 10-second timer.",
              "Step 2 shows a 5-second timer before the destination URL opens.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
            Generated Link
          </p>

          {result ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Short URL
                </p>
                <div className="mt-3 break-all text-lg font-black text-gray-900">
                  {shortUrl}
                </div>
                <p className="mt-3 text-xs font-bold text-gray-500">
                  Code: {result.short_code}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black"
                >
                  <Copy size={16} />
                  {copied ? "Copied" : "Copy Link"}
                </button>

                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-700 transition-all hover:border-[#10B981] hover:text-[#10B981]"
                >
                  <ExternalLink size={16} />
                  Open Link
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm font-black text-gray-700">
                Your shortened link will appear here
              </p>
              <p className="mt-2 text-xs font-bold leading-relaxed text-gray-500">
                Submit the form to generate a saved short code from Django.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
