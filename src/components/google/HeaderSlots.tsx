import { panelAccess } from "@/lib/reviews/access";
import { GoogleConnectBanner } from "./GoogleConnectBanner";
import { GoogleLinkBadge } from "./GoogleLinkBadge";
import { getPanelGoogleStatus } from "./header-status";

/**
 * Content of the panel header's parallel-route slots (src/app/painel/@googleBar, @googleBadge),
 * which exist because the /painel root layout can't read the [slug] param.
 */

/** Bar under the sticky header while the customer's Google Business Profile isn't connected. */
export async function GoogleBarSlot({ slug }: { slug: string }) {
  if ((await panelAccess(slug)) !== "allowed") return null;
  const status = await getPanelGoogleStatus(slug);
  if (!status || status === "connected") return null;
  return <GoogleConnectBanner slug={slug} status={status} />;
}

/** "Google ligado ✓" next to the theme toggle once it is connected. */
export async function GoogleBadgeSlot({ slug }: { slug: string }) {
  if ((await panelAccess(slug)) !== "allowed") return null;
  const status = await getPanelGoogleStatus(slug);
  return status === "connected" ? <GoogleLinkBadge slug={slug} /> : null;
}
