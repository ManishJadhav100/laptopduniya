import { notFound, redirect } from "next/navigation";
import { buildShortCodeEntryUrl } from "@/lib/outbound-gateway";
import { visitShortenedLink } from "@/lib/short-links";

export const dynamic = "force-dynamic";

export default async function ShortUrlResolverPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const shortLink = await visitShortenedLink(code);

  if (!shortLink) {
    notFound();
  }

  redirect(buildShortCodeEntryUrl(shortLink.short_code));
}
