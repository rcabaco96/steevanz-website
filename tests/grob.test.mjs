import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import { grobDomainSegment, grobHref, grobSitemapEntries, grobStaticParams, resolveGrobPath } from "../src/content/grob/routes.ts";
import { grob, grobAge, grobModalities, grobPhotos } from "../src/content/grob/facts.ts";

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

describe("GROB: caminho de pré-visualização (src/lib/client-sites.ts)", () => {
  it("está registado como site de cliente, ainda sem domínio", () => {
    const site = clientSites.find((entry) => entry.id === "grob");
    assert.ok(site);
    assert.equal(site.base, "/grob");
    assert.deepEqual(site.hosts, []);
  });

  it("fica fora dos motores de busca e não mexe no resto da steevanz.com", () => {
    assert.deepEqual(routeClientSite("www.steevanz.com", "/grob"), { kind: "noindex", site: "grob" });
    assert.equal(routeClientSite("www.steevanz.com", "/grobx"), null);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/grob/dominio"), { kind: "redirect", site: "grob", path: "/grob" });
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/grob",\s*"\/grob\/:path\*"/);
    assert.equal(domainSegment, grobDomainSegment);
  });

  it("resolve só a página, nos dois modos", () => {
    assert.deepEqual(resolveGrobPath(undefined), { mode: "preview" });
    assert.deepEqual(resolveGrobPath(["dominio"]), { mode: "domain" });
    assert.equal(resolveGrobPath(["en"]), null);
    assert.equal(grobStaticParams().length, 2);
    assert.equal(grobHref("preview"), "/grob");
    assert.equal(grobHref("domain"), "/");
    assert.equal(grobSitemapEntries().length, 1);
  });
});

describe("GROB: regras de conteúdo", () => {
  const files = [...filesUnder("src/components/clients/grob"), ...filesUnder("src/content/grob"), ...filesUnder("src/app/(clientes)/grob")].map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("nunca mostra avaliações, nem IVA calculado", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|\bIVA\b/, path);
    }
  });

  it("nunca «NFC», nunca a casca da Steevanz, nunca o verde do WhatsApp", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54/i, path);
    }
  });

  it("tem o crédito «Site por Steevanz» no rodapé", () => {
    assert.match(readFileSync("src/components/clients/grob/Footer.tsx", "utf8"), /Site por/);
  });

  it("usa só os media do próprio clube, todos presentes", () => {
    for (const src of [...Object.values(grob.media), ...Object.values(grobPhotos).map((p) => p.src)]) {
      assert.ok(src.startsWith("/media/clients/grob/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    assert.ok(existsSync("public/media/clients/grob/LICENCAS.txt"));
  });

  it("conta os anos desde 6 de junho de 1937", () => {
    assert.equal(grobAge(new Date(2026, 5, 5)), 88);
    assert.equal(grobAge(new Date(2026, 5, 6)), 89);
    assert.equal(grobModalities.length, 6);
  });
});
