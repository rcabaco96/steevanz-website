export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://steevanz.com").replace(/\/$/, "");

export const site = {
  name: "Steevanz",
  legalName: "Steevanz",
  email: "rcabaco@steevanz.com",
  phoneDisplay: "+351 928 069 072",
  phoneHref: "tel:+351928069072",
  whatsappNumber: "351961292679",
  whatsappDisplay: "+351 961 292 679",
  instagramUrl: "https://www.instagram.com/steevanz_",
  instagramHandle: "@steevanz_",
  country: "PT",
  city: "Lisboa",
  timeZone: "Europe/Lisbon",
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path === "/" ? "" : path}` || siteUrl;
}
