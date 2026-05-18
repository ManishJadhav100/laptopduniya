"use client";

import Link from "next/link";
import {
  Copy,
  ExternalLink,
  Loader2,
  MousePointerClick,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { readApiError } from "@/lib/auth";
import type {
  ShortenedLinkRecord,
  ShortenerDashboardResponse,
} from "@/lib/short-links";

function formatDate(value?: string | null) {
  if (!value) return "Not visited yet";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function resolveShortUrl(link: ShortenedLinkRecord) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${link.short_path}`;
  }

  return link.short_url || link.short_path;
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="flex min-h-[160px] flex-col justify-between rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
        {label}
      </p>
      <div
        className={`mt-4 text-3xl font-black tracking-tight sm:text-4xl ${accent}`}
      >
        {value}
      </div>
    </div>
  );
}

function LinkRow({ link }: { link: ShortenedLinkRecord }) {
  const shortUrl = resolveShortUrl(link);

  return (
    <div className="grid gap-4 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:grid-cols-[1.3fr_0.75fr_0.75fr_0.7fr]">
      <div>
        <p className="text-lg font-black text-gray-900">
          {link.title || link.short_code}
        </p>
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 break-all text-sm font-black text-[#10B981]"
        >
          {shortUrl}
          <ExternalLink size={15} />
        </a>
        <p className="mt-3 break-all text-xs font-bold leading-relaxed text-gray-500">
          Destination: {link.destination_url}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Type
          </p>
          <p className="mt-2 text-sm font-black uppercase text-gray-800">
            {link.link_type}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Alias
          </p>
          <p className="mt-2 text-sm font-black text-gray-800">
            {link.short_code}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Views
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-black text-gray-800">
            <MousePointerClick size={15} className="text-[#10B981]" />
            {link.click_count}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Last Visit
          </p>
          <p className="mt-2 text-sm font-bold text-gray-700">
            {formatDate(link.last_visited_at)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Brand
          </p>
          <p className="mt-2 text-sm font-bold text-gray-700">
            {link.brand_name || "Not set"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Store
          </p>
          <p className="mt-2 text-sm font-bold text-gray-700">
            {link.store_name || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { fetchWithAuth, isAuthenticated, isReady, user } = useAuth();
  const [dashboard, setDashboard] = useState<ShortenerDashboardResponse | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    void (async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchWithAuth("/short-links/dashboard/", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            await readApiError(response, "Unable to load your dashboard."),
          );
        }

        const data = (await response.json()) as ShortenerDashboardResponse;

        if (isMounted) {
          setDashboard(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load your dashboard.",
          );
          setDashboard(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchWithAuth, isAuthenticated, isReady]);

  const topLinkLabel = useMemo(() => {
    if (!dashboard?.top_link) {
      return "No clicks yet";
    }

    return dashboard.top_link.title || dashboard.top_link.short_code;
  }, [dashboard]);

  const handleCopyApiKey = async () => {
    if (!dashboard?.api_key) return;

    try {
      await navigator.clipboard.writeText(dashboard.api_key);
      setCopiedApiKey(true);
      window.setTimeout(() => setCopiedApiKey(false), 1800);
    } catch {
      setCopiedApiKey(false);
    }
  };

  if (!isReady || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fbfa]">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-gray-700 shadow-lg">
          <Loader2 size={18} className="animate-spin text-[#10B981]" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] px-4 py-20">
        <div className="mx-auto max-w-[760px] rounded-[2.5rem] bg-white p-10 text-center shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981]">
            Login Required
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-900">
            Sign in to view your shortener dashboard
          </h1>
          <p className="mt-5 text-sm font-bold leading-relaxed text-gray-500">
            After login you can see your API key, created short links, total
            views, top link, and recent activity from the backend.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-gray-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-gray-300 px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <section className="relative overflow-hidden bg-gray-900 py-20 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-12 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px]" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
        </div>
        <div className="site-shell relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
            User Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            {user?.username || dashboard?.user.username}, here are your short links
          </h1>
          <p className="mt-5 max-w-3xl text-sm font-bold leading-relaxed text-slate-300">
            This page is fed directly from the backend and includes your API key,
            summary metrics, and the latest view counts for every short code.
          </p>
        </div>
      </section>

      <section className="pb-20 pt-8 lg:pt-10">
        <div className="site-shell">
          {error ? (
            <div className="mb-8 rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-600">
              {error}
            </div>
          ) : null}

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(360px,460px)_1fr]">
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                API Key
              </p>
              <div className="mt-4 break-all rounded-[1.75rem] bg-gray-900 px-5 py-5 text-sm font-black text-emerald-300">
                {dashboard?.api_key}
              </div>
              <button
                type="button"
                onClick={handleCopyApiKey}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700"
              >
                <Copy size={14} />
                {copiedApiKey ? "Copied" : "Copy API Key"}
              </button>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Example Endpoint
              </p>
              <div className="mt-3 break-all rounded-[1.75rem] border border-gray-200 bg-gray-50 px-5 py-5 text-xs font-bold leading-relaxed text-gray-700">
                {dashboard?.api_endpoint_example}
              </div>
              <Link
                href="/shortener"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#10B981] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white"
              >
                <Plus size={14} />
                Create New Link
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
              <SummaryCard
                label="Total Links"
                value={dashboard?.summary.total_links ?? 0}
                accent="text-gray-900"
              />
              <SummaryCard
                label="Active Links"
                value={dashboard?.summary.active_links ?? 0}
                accent="text-emerald-600"
              />
              <SummaryCard
                label="Total Views"
                value={dashboard?.summary.total_views ?? 0}
                accent="text-blue-600"
              />
              <SummaryCard
                label="Average Views"
                value={dashboard?.summary.average_views_per_link ?? 0}
                accent="text-orange-600"
              />
              <SummaryCard
                label="Top Link"
                value={topLinkLabel}
                accent="text-violet-600"
              />
              <SummaryCard
                label="Coupon Links"
                value={dashboard?.summary.coupon_links ?? 0}
                accent="text-pink-600"
              />
            </div>
          </div>

          <div className="mt-10 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                  Created Links
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  All short codes for {dashboard?.user.username}
                </h2>
              </div>
              <div className="text-sm font-bold text-gray-500">
                Retailer: {dashboard?.summary.retailer_links ?? 0} | Deal:{" "}
                {dashboard?.summary.deal_links ?? 0} | Coupon:{" "}
                {dashboard?.summary.coupon_links ?? 0}
              </div>
            </div>

            {dashboard?.links.length ? (
              <div className="mt-8 grid gap-5">
                {dashboard.links.map((link) => (
                  <LinkRow key={link.id} link={link} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <p className="text-lg font-black text-gray-900">
                  No short links created yet
                </p>
                <p className="mt-3 text-sm font-bold leading-relaxed text-gray-500">
                  Start from the shortener page and your links will appear here
                  with visit counts and metadata.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
