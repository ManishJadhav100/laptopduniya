import { fetchApiJson } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

export interface ShortenedLinkRecord {
  id: number;
  short_code: string;
  short_path: string;
  short_url: string;
  destination_url: string;
  title: string;
  brand_name: string;
  store_name: string;
  coupon_code: string;
  link_type: "retailer" | "deal" | "coupon";
  click_count: number;
  last_visited_at: string | null;
  owner_username: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShortenerDashboardResponse {
  user: AuthUser;
  api_key: string;
  api_endpoint_example: string;
  summary: {
    total_links: number;
    active_links: number;
    total_views: number;
    average_views_per_link: number;
    retailer_links: number;
    deal_links: number;
    coupon_links: number;
  };
  top_link: ShortenedLinkRecord | null;
  links: ShortenedLinkRecord[];
}

export async function fetchShortenedLink(shortCode: string) {
  return fetchApiJson<ShortenedLinkRecord>(
    `/short-links/${encodeURIComponent(shortCode)}/`,
    {
      cache: "no-store",
    },
  );
}

export async function visitShortenedLink(shortCode: string) {
  return fetchApiJson<ShortenedLinkRecord>(
    `/short-links/${encodeURIComponent(shortCode)}/visit/`,
    {
      method: "POST",
      cache: "no-store",
    },
  );
}
