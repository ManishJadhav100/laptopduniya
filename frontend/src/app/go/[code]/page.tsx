import { notFound, redirect } from "next/navigation";
import { fetchApiList } from "@/lib/api";
import {
  buildLaptopGatewayPathFromCode,
  buildShortCodeStepTwoUrl,
} from "@/lib/outbound-gateway";
import { fetchShortenedLink } from "@/lib/short-links";

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

export default async function ShortCodeGatewayEntryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const shortLink = await fetchShortenedLink(code);

  if (!shortLink) {
    notFound();
  }

  const randomLaptopSlug = await getRandomLaptopSlug();

  if (!randomLaptopSlug) {
    redirect(buildShortCodeStepTwoUrl(code));
  }

  redirect(buildLaptopGatewayPathFromCode(randomLaptopSlug, code));
}
