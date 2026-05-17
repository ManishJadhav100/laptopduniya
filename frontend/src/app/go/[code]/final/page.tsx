import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OutboundGatewayFinalScreen from "@/components/OutboundGatewayFinalScreen";
import {
  GATEWAY_ACCESS_COOKIE_NAME,
  verifyGatewayAccessToken,
} from "@/lib/gateway-access.server";
import { buildShortCodeEntryUrl, buildShortCodeStepTwoUrl } from "@/lib/outbound-gateway";
import { fetchShortenedLink } from "@/lib/short-links";

export const dynamic = "force-dynamic";

export default async function ShortCodeGatewayFinalPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(GATEWAY_ACCESS_COOKIE_NAME)?.value;
  const finalPath = buildShortCodeStepTwoUrl(code);

  if (!accessToken || !verifyGatewayAccessToken(accessToken, finalPath)) {
    redirect(buildShortCodeEntryUrl(code));
  }

  const shortLink = await fetchShortenedLink(code);

  const payload = shortLink
    ? {
        targetUrl: shortLink.destination_url,
        title: shortLink.title,
        brandName: shortLink.brand_name,
        storeName: shortLink.store_name,
        couponCode: shortLink.coupon_code,
        linkType: shortLink.link_type,
      }
    : null;

  return <OutboundGatewayFinalScreen payload={payload} />;
}
