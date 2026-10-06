/** «Perfil verificado» (business rule 14): shared mark and wording, usable on server and client. */

/** Shield with a tick: the «Perfil verificado» mark. Follows currentColor. */
export function ShieldCheckIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      <path d="M12 2.8 4.5 5.8v5.7c0 4.6 3.2 8.5 7.5 9.7 4.3-1.2 7.5-5.1 7.5-9.7V5.8L12 2.8Z" fill="currentColor" fillOpacity={0.14} />
      <path d="m8.6 12.1 2.3 2.3 4.5-4.8" />
    </svg>
  );
}

/** What the seal means, in plain Portuguese (every «Perfil verificado» badge explains it). */
export function verifiedExplanation(name?: string): string {
  const who = name ? `«${name}»` : "Este negócio";
  return `${who} ligou o seu Perfil de Empresa Google à Steevanz com uma conta que gere mesmo esse negócio. A prova é a autorização oficial da Google, pedida na ligação; a Steevanz nunca dá este selo à mão. Se a ligação for desfeita, o selo desaparece.`;
}
