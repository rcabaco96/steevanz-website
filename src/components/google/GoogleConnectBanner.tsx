import Link from "next/link";
import { AlertIcon, ArrowRight, GoogleG } from "@/components/icons";
import { googleConnectPath, googlePagePath, type GoogleLinkStatus } from "./header-status";
import { ShieldCheckIcon } from "./verified";

type Tone = { bar: string; text: string; button: string };

const tones: Record<"invite" | "pending" | "error", Tone> = {
  invite: { bar: "bg-accent-soft/90", text: "text-accent-text", button: "bg-accent text-accent-contrast hover:bg-accent-hover" },
  pending: { bar: "bg-gold-soft/90", text: "text-gold-text", button: "bg-gold-text text-bg hover:opacity-90" },
  error: { bar: "bg-danger-soft/90", text: "text-danger", button: "bg-danger text-bg hover:opacity-90" },
};

/**
 * «Perfil verificado» is the headline (business rule 14).
 * Slim bar under the panel's sticky header, on screen for as long as the customer hasn't connected
 * their Google Business Profile (business rule: the panel always encourages connecting). One line
 * on phones (short message + button), the full pitch from sm. Hidden on the 404 page.
 */
export function GoogleConnectBanner({ slug, status }: { slug: string; status: Exclude<GoogleLinkStatus, "connected"> }) {
  const page = googlePagePath(slug);

  const content =
    status === "pending_location"
      ? {
          tone: tones.pending,
          short: "Falta escolher o seu negócio",
          mid: "Falta escolher o seu negócio para ficar verificado",
          long: "Google ligado: falta escolher qual é o seu negócio para começarmos a usar a API oficial",
          action: "Escolher",
          href: page,
          external: false,
        }
      : status === "error"
        ? {
            tone: tones.error,
            short: "Google com problema",
            mid: "A ligação ao seu Perfil Google tem um problema",
            long: "A ligação ao seu Perfil Google tem um problema: até ser resolvido, as reviews voltam a ser lidas do Google Maps",
            action: "Ver o problema",
            href: page,
            external: false,
          }
        : {
            tone: tones.invite,
            short: "Verifique o seu perfil",
            mid: "Verifique o seu perfil: ligue o Perfil de Empresa Google",
            long: "Verifique o seu perfil: ligue o Google e ganhe o selo «Perfil verificado», atualizações em segundos e respostas publicadas diretamente",
            action: "Ligar Google",
            // Straight to Google's consent screen; while the connection isn't set up yet, the route
            // returns to the Google page with the explanation (estado=indisponivel).
            href: googleConnectPath(slug),
            external: true,
          };

  const buttonClass = `inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-[background-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[360px]:px-4 ${content.tone.button}`;
  const buttonInner = (
    <>
      {status === "not_connected" ? <GoogleG size={15} className="hidden min-[360px]:block" /> : null}
      {content.action}
    </>
  );

  return (
    <div data-google-bar={status} className={`border-t border-line [body:has([data-panel-missing])_&]:hidden ${content.tone.bar}`}>
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href={page} className={`group flex min-w-0 flex-1 items-center gap-2 text-[0.8125rem] font-semibold sm:text-sm ${content.tone.text}`}>
          {status === "error" ? <AlertIcon size={16} className="shrink-0" /> : <ShieldCheckIcon size={18} className="shrink-0" />}
          <span className="truncate sm:hidden">{content.short}</span>
          <span className="hidden truncate sm:inline lg:hidden">{content.mid}</span>
          <span className="hidden truncate lg:inline">{content.long}</span>
          <ArrowRight size={15} className="hidden shrink-0 transition-transform group-hover:translate-x-0.5 sm:block" />
        </Link>
        {content.external ? (
          // A plain navigation: the route redirects to Google and back to the panel.
          <a href={content.href} className={buttonClass}>
            {buttonInner}
          </a>
        ) : (
          <Link href={content.href} className={buttonClass}>
            {buttonInner}
          </Link>
        )}
      </div>
    </div>
  );
}
