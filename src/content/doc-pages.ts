import type { Localized } from "@/lib/i18n";
import type { DocPageId } from "./types";

export interface DocPageMeta {
  id: DocPageId;
  slug: Localized<string>;
  label: Localized<string>;
}

export const docPages: DocPageMeta[] = [
  { id: "getting-started", slug: { pt: "primeiros-passos", en: "getting-started" }, label: { pt: "Primeiros passos", en: "Getting started" } },
  { id: "setup", slug: { pt: "instalacao", en: "setup" }, label: { pt: "Instalação", en: "Setup" } },
  { id: "configuration", slug: { pt: "configuracao", en: "configuration" }, label: { pt: "Configuração", en: "Configuration" } },
  { id: "usage", slug: { pt: "utilizacao", en: "usage" }, label: { pt: "Utilização", en: "Usage" } },
  { id: "troubleshooting", slug: { pt: "resolucao-problemas", en: "troubleshooting" }, label: { pt: "Resolução de problemas", en: "Troubleshooting" } },
  { id: "faq", slug: { pt: "perguntas-frequentes", en: "faq" }, label: { pt: "Perguntas frequentes", en: "FAQ" } },
];

export function getDocPageMeta(id: DocPageId): DocPageMeta {
  const meta = docPages.find((page) => page.id === id);
  if (!meta) throw new Error(`Unknown doc page ${id}`);
  return meta;
}
