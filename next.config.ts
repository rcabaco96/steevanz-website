import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600],
    imageSizes: [64, 96, 128, 256, 384],
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
    return renamed.map(([source, destination]) => ({
      source: `${source}/:rest*`,
      destination: `${destination}/:rest*`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The queue's service worker: always the latest version, never a cached one.
      {
        source: "/fila-sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
