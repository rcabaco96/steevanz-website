import type { Localized } from "@/lib/i18n";
import type { DocPageId } from "./types";

export interface DocPageMeta {
  id: DocPageId;
  slug: Localized<string>;
  label: Localized<string>;
}

export const docPages: DocPageMeta[] = [
  { id: "getting-started", slug: { pt: "primeiros-passos", en: "getting-started" }, label: { pt: "Primeiros passos", en: "Getting started", es: "Primeros pasos", fr: "Premiers pas", de: "Erste Schritte", it: "Primi passi" } },
  { id: "setup", slug: { pt: "instalacao", en: "setup" }, label: { pt: "Instalação", en: "Setup", es: "Instalación", fr: "Installation", de: "Einrichtung", it: "Installazione" } },
  { id: "configuration", slug: { pt: "configuracao", en: "configuration" }, label: { pt: "Configuração", en: "Configuration", es: "Configuración", fr: "Configuration", de: "Konfiguration", it: "Configurazione" } },
  { id: "usage", slug: { pt: "utilizacao", en: "usage" }, label: { pt: "Utilização", en: "Usage", es: "Uso", fr: "Utilisation", de: "Nutzung", it: "Utilizzo" } },
  { id: "troubleshooting", slug: { pt: "resolucao-problemas", en: "troubleshooting" }, label: { pt: "Resolução de problemas", en: "Troubleshooting", es: "Solución de problemas", fr: "Dépannage", de: "Fehlerbehebung", it: "Risoluzione dei problemi" } },
  { id: "faq", slug: { pt: "perguntas-frequentes", en: "faq" }, label: { pt: "Perguntas frequentes", en: "FAQ", es: "Preguntas frecuentes", fr: "Questions fréquentes", de: "Häufige Fragen", it: "Domande frequenti" } },
];

export function getDocPageMeta(id: DocPageId): DocPageMeta {
  const meta = docPages.find((page) => page.id === id);
  if (!meta) throw new Error(`Unknown doc page ${id}`);
  return meta;
}
