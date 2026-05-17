import { redirect } from "next/navigation";
import { fetchApiList } from "@/lib/api";
import {
  buildLaptopGatewayPath,
  buildOutboundGatewayStepTwoUrl,
  parseOutboundGatewayPayload,
  type GatewaySearchParams,
} from "@/lib/outbound-gateway";

export const dynamic = "force-dynamic";

async function getRandomLaptopSlug() {
  const laptops = await fetchApiList<{ slug?: string }>("/laptops/?limit=36", {
    cache: "no-store",
  });
  const candidates = laptops.filter((item) => item?.slug);

  if (!candidates.length) return null;

  const randomLaptop =
    candidates[Math.floor(Math.random() * candidates.length)];

  return randomLaptop.slug as string;
}

export default async function OutboundGatewayEntryPage({
  searchParams,
}: {
  searchParams: Promise<GatewaySearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const payload = parseOutboundGatewayPayload(resolvedSearchParams);

  if (!payload) {
    redirect("/");
  }

  const randomLaptopSlug = await getRandomLaptopSlug();

  if (!randomLaptopSlug) {
    redirect(buildOutboundGatewayStepTwoUrl(payload));
  }

  redirect(buildLaptopGatewayPath(randomLaptopSlug, payload));
}
