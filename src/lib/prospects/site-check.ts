// The website label of each business (CRM «Situação do site»), checked for free by the prospector: it
// opens the site like a browser would and labels only what is clear (no site of its own, down,
// parked, error, no HTTPS, very old code). «Parece feito com IA» is only set here when the site says
// so itself (made with Lovable); otherwise the admin sets it by hand. Pure except probeSite (fetch).

import type { SiteStatus } from "./crm.ts";
import { linkName, siteKind } from "./rules.ts";

export interface SiteVerdict {
  status: SiteStatus;
  reasons: string[];
}

/** Free pages on someone else's domain: not a site of its own. */
const freeSubdomain = /(^|\.)(blogspot\.[a-z.]+|wixsite\.com|wordpress\.com|webnode\.[a-z.]+|negocio\.site|business\.site|sites\.google\.com|eatbu\.com|jimdosite\.com|jimdofree\.com|weebly\.com|godaddysites\.com|square\.site|carrd\.co|my\.canva\.site|canva\.site|ueniweb\.com|site123\.me|strikingly\.com|wix\.com)$/i;

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** What can be told from the link alone, without opening it; null means it must be opened. */
export function verdictFromLink(website: string | null): SiteVerdict | null {
  if (!website) return { status: "none", reasons: ["Sem site no Google"] };
  const kind = siteKind(website);
  if (kind === "social") return { status: "none", reasons: [`Sem site próprio: o Google aponta para ${linkName(website)}`] };
  if (kind === "booking") return { status: "none", reasons: [`Sem site próprio: só tem uma página em ${linkName(website)}`] };
  if (!host(website)) return { status: "none", reasons: ["O link do site no Google não é válido"] };
  if (freeSubdomain.test(host(website))) return { status: "none", reasons: ["Sem site próprio: o Google aponta para uma página grátis de uma plataforma"] };
  return null;
}

export interface SiteProbe {
  /** The request got no answer: name not found (domain down or expired), refused, too slow, other. */
  failure?: "dns" | "refused" | "timeout" | "other";
  /** The https certificate is not valid (the page was read again over http). */
  badCertificate?: boolean;
  status?: number;
  /** Address after the redirects. */
  finalUrl?: string;
  html?: string;
}

const parked =
  /domain (name )?(is |may be )?for sale|buy this domain|this domain (has been|is) (registered|parked)|parked (free|domain|by)|sedoparking|parkingcrew|bodis\.com|afternic|hugedomains|dondominio\.com\/(parking|dominios)|domain parking|dom[ií]nio (est[aá] )?(à|a|para) venda|este dom[ií]nio (foi|est[aá]) registado/i;
const serverDefault =
  /<title>\s*(welcome to nginx|apache2 (ubuntu|debian) default page|test page for the (apache|nginx)|iis windows server|welcome to openresty|default web site page|index of \/|it works!?|cpanel|plesk|default page)/i;
const notReady = /<title>[^<]*(em constru[cç][aã]o|under construction|coming soon|brevemente|em breve|maintenance mode|em manuten[cç][aã]o)[^<]*<\/title>/i;
const suspended = /account (has been )?suspended|website (is )?(currently )?(suspended|unavailable)|conta suspensa|this account has been suspended/i;

/** Text a person would read on the page (no scripts, styles or tags). */
function visibleText(html: string): string {
  return html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The label from what opening the site showed. The most serious label wins; every reason found is kept. */
export function verdictFromProbe(probe: SiteProbe, year: number): SiteVerdict {
  const down: string[] = [];
  const ai: string[] = [];
  const outdated: string[] = [];
  if (probe.failure) {
    down.push(
      probe.failure === "dns" ? "site não abre (domínio em baixo ou expirado)" : probe.failure === "timeout" ? "site não abre (demora demasiado a responder)" : "site não abre",
    );
  } else if (probe.status && probe.status >= 400) {
    down.push(`site dá erro (${probe.status})`);
  }
  if (probe.badCertificate) outdated.push("o certificado de segurança não é válido (o browser mostra «não seguro»)");
  const html = probe.html ?? "";
  if (!probe.failure && (!probe.status || probe.status < 400)) {
    if (parked.test(html)) down.push("o domínio está estacionado (página de parking, sem site)");
    else if (serverDefault.test(html)) down.push("o domínio mostra a página por omissão do servidor, sem site");
    else if (suspended.test(visibleText(html).slice(0, 2000))) down.push("o alojamento do site está suspenso");
    else if (notReady.test(html)) down.push("o site está «em construção»");
    else if (visibleText(html).length < 40 && !/<script[^>]+src=/i.test(html) && !/<iframe/i.test(html)) down.push("a página inicial abre em branco");

    if (/lovable\.(dev|app)|gptengineer|<meta[^>]+content=["']lovable/i.test(html)) ai.push("feito com Lovable (IA)");

    if (probe.finalUrl?.startsWith("http://") && !probe.badCertificate) outdated.push("o site abre sem HTTPS (o browser mostra «não seguro»)");
    const wordpress = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']WordPress (\d+)\.(\d+)/i) ?? html.match(/<meta[^>]+content=["']WordPress (\d+)\.(\d+)[^>]+name=["']generator/i);
    if (wordpress && Number(wordpress[1]) < 6) outdated.push(`${Number(wordpress[1]) < 5 ? "WordPress muito antigo" : "WordPress antigo"} (${wordpress[1]}.${wordpress[2]})`);
    if (/jquery[.-]1\.\d+(\.\d+)?(\.min)?\.js|jquery v1\.\d/i.test(html)) outdated.push("código antigo (jQuery 1.x)");
    if (/<frameset/i.test(html) || /\.swf["'?]/i.test(html)) outdated.push("site feito com tecnologia dos anos 2000 (frames ou Flash)");
    if (html && !/<meta[^>]+name=["']viewport["']/i.test(html) && !down.length) outdated.push("sem versão para telemóvel");
    const years = [...visibleText(html).matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})/gi)].map((match) => Number(match[1]));
    const latest = years.length ? Math.max(...years) : null;
    if (latest && latest <= year - 4 && !down.length) outdated.push(`o rodapé ainda diz © ${latest}`);
  }
  if (down.length) return { status: "down", reasons: [...down, ...outdated].slice(0, 10) };
  if (ai.length) return { status: "ai", reasons: [...ai, ...outdated].slice(0, 10) };
  if (outdated.length) return { status: "outdated", reasons: outdated.slice(0, 10) };
  return { status: "ok", reasons: [] };
}

const browserHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
};

function failureOf(error: unknown): { failure?: SiteProbe["failure"]; certificate?: boolean } {
  const cause = (error as { cause?: { code?: string; name?: string } })?.cause;
  const code = String(cause?.code ?? (error as { code?: string })?.code ?? "");
  const name = String((error as { name?: string })?.name ?? cause?.name ?? "");
  if (/CERT|SSL|TLS|SELF_SIGNED|UNABLE_TO_VERIFY|DEPTH_ZERO|ERR_TLS/i.test(code)) return { certificate: true };
  if (/ENOTFOUND|EAI_AGAIN/.test(code)) return { failure: "dns" };
  if (/ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH/.test(code)) return { failure: "refused" };
  if (/TimeoutError|AbortError/.test(name) || /TIMEOUT/i.test(code)) return { failure: "timeout" };
  return { failure: "other" };
}

async function read(url: string, timeoutMs: number): Promise<Pick<SiteProbe, "status" | "finalUrl" | "html">> {
  const response = await fetch(url, { redirect: "follow", headers: browserHeaders, signal: AbortSignal.timeout(timeoutMs) });
  const type = response.headers.get("content-type") ?? "";
  const html = /html|text\/plain/i.test(type) || !type ? (await response.text()).slice(0, 1_500_000) : "";
  return { status: response.status, finalUrl: response.url || url, html };
}

/** Opens the site like a browser (one page, no images): free, a few seconds. */
export async function probeSite(website: string, timeoutMs = 15_000): Promise<SiteProbe> {
  try {
    return await read(website, timeoutMs);
  } catch (error) {
    const found = failureOf(error);
    if (!found.certificate) return { failure: found.failure };
    // Bad certificate: read it over http to check the rest, as a visitor clicking through would.
    try {
      return { ...(await read(website.replace(/^https:/i, "http:"), timeoutMs)), badCertificate: true };
    } catch (again) {
      return { failure: failureOf(again).failure ?? "other", badCertificate: true };
    }
  }
}

/** The label of a business's website: from the link alone when that is enough, otherwise by opening it. */
export async function checkSite(website: string | null, now: Date = new Date()): Promise<SiteVerdict> {
  const fromLink = verdictFromLink(website);
  if (fromLink) return fromLink;
  return verdictFromProbe(await probeSite(website as string), now.getFullYear());
}
