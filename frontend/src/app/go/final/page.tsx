import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OutboundGatewayFinalScreen from "@/components/OutboundGatewayFinalScreen";
import {
  GATEWAY_ACCESS_COOKIE_NAME,
  verifyGatewayAccessToken,
} from "@/lib/gateway-access.server";
import {
  buildOutboundGatewayStepTwoUrl,
  buildOutboundGatewayUrl,
  parseOutboundGatewayPayload,
  type GatewaySearchParams,
} from "@/lib/outbound-gateway";

export const dynamic = "force-dynamic";

export default async function OutboundGatewayFinalPage({
  searchParams,
}: {
  searchParams: Promise<GatewaySearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const payload = parseOutboundGatewayPayload(resolvedSearchParams);

  if (!payload) {
    return <OutboundGatewayFinalScreen payload={null} />;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(GATEWAY_ACCESS_COOKIE_NAME)?.value;
  const finalPath = buildOutboundGatewayStepTwoUrl(payload);

  if (!accessToken || !verifyGatewayAccessToken(accessToken, finalPath)) {
    redirect(buildOutboundGatewayUrl(payload));
  }

  return <OutboundGatewayFinalScreen payload={payload} />;
}
