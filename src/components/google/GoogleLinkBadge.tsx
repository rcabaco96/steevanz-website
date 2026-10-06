import Link from "next/link";
import { googlePagePath } from "./header-status";
import { ShieldCheckIcon, verifiedExplanation } from "./verified";

/**
 * «Perfil verificado» in the panel header, instead of the connect bar, once the customer's Google
 * Business Profile is connected (business rule 14). The shield alone on phones (the header is
 * tight), "Perfil verificado" from sm, plus "· Google ligado" on wide screens. Leads to the Google
 * page (details, disconnect); the title explains what the seal means.
 */
export function GoogleLinkBadge({ slug }: { slug: string }) {
  return (
    <Link
      href={googlePagePath(slug)}
      title={`Perfil verificado. ${verifiedExplanation()} Toque para ver os detalhes da ligação.`}
      aria-label="Perfil verificado: Google ligado. Ver os detalhes da ligação."
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-3 text-xs font-semibold text-accent-text ring-1 ring-accent/25 transition-shadow hover:ring-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-sm:h-8 max-sm:w-8 max-sm:justify-center max-sm:px-0 [body:has([data-panel-missing])_&]:hidden"
    >
      <ShieldCheckIcon size={17} className="shrink-0" />
      <span className="hidden sm:inline">Perfil verificado</span>
      <span className="hidden font-medium opacity-80 xl:inline">· Google ligado</span>
    </Link>
  );
}
