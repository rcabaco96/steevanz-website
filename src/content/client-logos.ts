// Client logos (owner, 2026-10-22: «coloca-os, se bem que os mais importantes são Sporting, BMW e
// Crédito Agrícola»). Files in public/clients/ (originals as received in public/clients/originais/,
// how they were cleaned in public/clients/LEIA-ME.txt). Pure data, no imports, so tests can load it.
//
// Order: the three big names first, then EIC, Agilflex, Dianaconta. `scale` balances them optically
// (same visual weight, not same width): height = strip height × scale. It starts from equal area
// (1/√aspect), corrected by eye for ink density (the solid BMW roundel and the bold «eiC» read heavier,
// the thin Dianaconta braces lighter), and the featured three get 12% more.

export interface ClientLogo {
  id: string;
  /** Company name: the logo's alt text. */
  name: string;
  /** Full-colour logo. */
  src: string;
  /** One-colour version in the site's ink (#1d1220): the knock-outs are transparent, not grey. */
  monoSrc: string;
  /** Intrinsic size of the files (same for both), for the aspect ratio. */
  width: number;
  height: number;
  /** Height relative to the strip's logo height (optical balance, see above). */
  scale: number;
  featured: boolean;
}

export const clientLogos: readonly ClientLogo[] = [
  { id: "sporting", name: "Sporting", src: "/clients/sporting.png", monoSrc: "/clients/sporting-mono.png", width: 259, height: 361, scale: 1.27, featured: true },
  { id: "bmw", name: "BMW", src: "/clients/bmw.png", monoSrc: "/clients/bmw-mono.png", width: 447, height: 447, scale: 0.96, featured: true },
  { id: "credito-agricola", name: "Crédito Agrícola", src: "/clients/credito-agricola.svg", monoSrc: "/clients/credito-agricola-mono.svg", width: 500, height: 263, scale: 0.81, featured: true },
  { id: "eic", name: "EIC", src: "/clients/eic.svg", monoSrc: "/clients/eic-mono.svg", width: 566, height: 308, scale: 0.66, featured: false },
  { id: "agilflex", name: "Agilflex", src: "/clients/agilflex.svg", monoSrc: "/clients/agilflex-mono.svg", width: 995, height: 1036, scale: 1.07, featured: false },
  // The compact lockup (braces + wordmark): the full one's «contabilidade e consultoria fiscal» line
  // would be under 4 px tall here. Full lockup: /clients/dianaconta.svg.
  { id: "dianaconta", name: "Dianaconta", src: "/clients/dianaconta-compacto.svg", monoSrc: "/clients/dianaconta-compacto-mono.svg", width: 409, height: 154, scale: 0.71, featured: false },
];
