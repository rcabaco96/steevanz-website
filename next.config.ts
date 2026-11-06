import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // pdf.js (through unpdf) reads PDFs for the WhatsApp assistant's documents: loaded from node_modules
  // at run time instead of being bundled (it uses import.meta in ways the bundler can't follow).
  serverExternalPackages: ["unpdf"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600],
    imageSizes: [64, 96, 128, 256, 384],
    // 85 para as fotografias que enchem cartões e ecrãs dos sites de clientes (GROB, 2026-11-02); o resto fica a 75.
    qualities: [75, 85],
  },
  experimental: {
    globalNotFound: true,
    optimizePackageImports: ["motion"],
    // inlineCss left on 2026-10-12: it copied the whole stylesheet (~140 KB) into every prerendered page
    // and navigation payload (~385 MB per deployment, over the Vercel Hobby storage) and into every page change.
    // The establishment's logo is sent through a server action (up to 2 MB, plus the form's own bytes).
    serverActions: { bodySizeLimit: "3mb" },
  },
  // Product slugs renamed on 2026-10-11 (the word "NFC" left the site): old links keep working.
  async redirects() {
    const renamed: [string, string][] = [
      ["/produtos/placas-nfc-google-reviews", "/produtos/placas-google-reviews"],
      ["/produtos/nfc-redes-sociais", "/produtos/placas-redes-sociais"],
      ["/produtos/cardapio-digital-nfc", "/produtos/menu-digital"],
      ["/docs/placas-nfc-google-reviews", "/docs/placas-google-reviews"],
      ["/docs/nfc-redes-sociais", "/docs/placas-redes-sociais"],
      ["/docs/cardapio-digital-nfc", "/docs/menu-digital"],
      ["/en/products/nfc-google-review-plates", "/en/products/google-review-plates"],
      ["/en/products/nfc-social-media", "/en/products/social-media-plates"],
      ["/en/products/nfc-digital-menu", "/en/products/digital-menu"],
      ["/en/docs/nfc-google-review-plates", "/en/docs/google-review-plates"],
      ["/en/docs/nfc-social-media", "/en/docs/social-media-plates"],
      ["/en/docs/nfc-digital-menu", "/en/docs/digital-menu"],
    ];
    // Product ids renamed the same day: they appear in the OG image URLs and in the account areas.
    const renamedIds: [string, string][] = [
      ["nfc-google-reviews", "google-review-plates"],
      ["nfc-social", "social-plates"],
      ["nfc-menu", "digital-menu"],
    ];
    for (const [from, to] of renamedIds) {
      renamed.push(
        [`/og/pt/${from}`, `/og/pt/${to}`],
        [`/og/en/${from}`, `/og/en/${to}`],
        [`/conta/${from}`, `/conta/${to}`],
        [`/admin/clientes/:client/${from}`, `/admin/clientes/:client/${to}`],
      );
    }
    return [
      ...renamed.map(([source, destination]) => ({
        source: `${source}/:rest*`,
        destination: `${destination}/:rest*`,
        permanent: true,
      })),
      // The new home was previewed at /novo until 2026-10-20; it is now «/».
      { source: "/novo", destination: "/", permanent: true },
    ];
  },
  // Balneário da Luz (3D shirt rail, Astro build in public/balneario-da-luz): its pages are folders with an index.html.
  // The GROB sede's site (2026-11-05), the same way:
  // public/grob-sede (source in Downloads\grob-sede-site, built with base "/grob-sede"), with its 3D visit page and the walkable 3D rooms (sede-3d).
  async rewrites() {
    return [
      { source: "/balneario-da-luz", destination: "/balneario-da-luz/index.html" },
      { source: "/balneario-da-luz/numero/:n", destination: "/balneario-da-luz/numero/:n/index.html" },
      { source: "/grob-sede", destination: "/grob-sede/index.html" },
      { source: "/grob-sede/visita-3d", destination: "/grob-sede/visita-3d/index.html" },
      { source: "/grob-sede/sede-3d", destination: "/grob-sede/sede-3d/index.html" },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The queue's service worker: always the latest version, never a cached one.
      {
        source: "/fila-sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      // Proposals are private by link: never indexed, also for crawlers that ignore the meta tag.
      {
        source: "/proposta/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      // Client demo sites shared by link only (Balneário da Luz, Sede do GROB): out of search engines.
      {
        source: "/grob-sede/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/grob-sede",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/balneario-da-luz/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // hls.js's worker, in a folder named after its version (scripts/hls-worker.mjs).
      {
        source: "/hls/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
