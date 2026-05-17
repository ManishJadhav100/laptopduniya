import { fetchApiJson } from "@/lib/api";

export interface ShortenedLinkRecord {
  id: number;
  short_code: string;
  short_path: string;
  destination_url: string;
  title: string;
  brand_name: string;
  store_name: string;
  coupon_code: string;
  link_type: "retailer" | "deal" | "coupon";
  click_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchShortenedLink(shortCode: string) {
  return fetchApiJson<ShortenedLinkRecord>(
    `/short-links/${encodeURIComponent(shortCode)}/`,
    {
      cache: "no-store",
    },
  );
}
