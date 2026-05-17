import { redirect } from "next/navigation";
import { buildShortCodeEntryUrl } from "@/lib/outbound-gateway";

export default async function ShortUrlResolverPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(buildShortCodeEntryUrl(code));
}
