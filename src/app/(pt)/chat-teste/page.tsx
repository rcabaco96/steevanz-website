import type { Metadata } from "next";
import { WebChat } from "@/components/chatbot/WebChat";
import { steevanzSuggestions } from "@/lib/chatbot/steevanz";

// Test page of the Steevanz assistant on the site (web channel, phase D): not indexed, not in the sitemap, Disallow in
// robots.ts, linked from nowhere. The future site widget will use the same route (/api/chatbot/web).
export const metadata: Metadata = {
  title: { absolute: "Assistente Steevanz — página de teste" },
  description: "Página de teste do assistente da Steevanz.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function ChatTestPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 sm:pt-10 sm:pb-12">
      <p className="inline-flex rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-text">Página de teste</p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-text sm:text-4xl">
        Fale com o <em className="text-accent-text">assistente</em> Steevanz
      </h1>
      <p className="mt-2 text-muted">Pergunte como faria a alguém da equipa: preços, produtos, setores ou como marcar uma demonstração.</p>
      <div className="mt-6">
        <WebChat suggestions={steevanzSuggestions} />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-subtle">
        As respostas são automáticas e podem ter erros; os preços são sem IVA. Para falar com uma pessoa, ligue para o 961 292 679. A conversa fica só
        neste separador do navegador.
      </p>
    </main>
  );
}
