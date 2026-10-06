"use client";

import { readerOnlineSeconds, relativeTime, updateIntervalMinutes } from "@/lib/reviews/import-jobs";
import { defaultPageMs, importSetupMs, mapsPageSize } from "@/lib/reviews/maps-reader";
import { InfoTip } from "./InfoTip";
import { useReaderJobs } from "./ReaderJobs";

const seconds = (ms: number) => (ms / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 });

/** Explanations (i) of everything the panel computes about the reader. Update with the rules. */
export const readerTexts = {
  reader: `O leitor da Steevanz é o programa que lê as reviews diretamente do Google Maps, num computador nosso (sem custos de serviços externos). Dá sinal a cada poucos segundos e conta como ligado se deu sinal nos últimos ${readerOnlineSeconds} segundos. Desligado quer dizer que esse computador ou o programa estão parados: os pedidos não se perdem, ficam em fila e são feitos assim que voltar a ligar. Faz um pedido de cada vez; quem está à espera no painel passa à frente das rotinas diárias.`,
  newReviews:
    "Reviews encontradas no Google que ainda não estavam guardadas. A atualização lê sempre a continuar a partir da última review guardada (sem buracos) e volta a ver as respostas do dono às reviews dos últimos 7 dias (30 dias uma vez por mês).",
  interval: (minutesAgo: number) =>
    `Cada negócio é lido no Google no máximo uma vez a cada ${updateIntervalMinutes} minutos (pelo botão, pelo separador Respostas ou pelas rotinas). A última leitura foi ${
      minutesAgo < 1 ? "há menos de 1 minuto" : `há ${minutesAgo} min`
    }, por isso as reviews mostradas já são as mais recentes. Pode voltar a atualizar daqui a ${updateIntervalMinutes - minutesAgo} min.`,
  progress: `«Guardadas» são as reviews deste negócio que já temos. O total é o número de reviews que o Google mostra no perfil (o da última leitura). A importação pede todas as reviews ao Google de uma só vez através do nosso fornecedor de dados (DataForSEO): normalmente demora menos de 1 minuto, até ~2 minutos com milhares de reviews. Com o leitor de reserva, o Google entrega ${mapsPageSize} reviews de cada vez (~${seconds(defaultPageMs)} s por pedido e ~${seconds(importSetupMs)} s para abrir o Google Maps).`,
  /** DataForSEO jobs: results arrive all at once. */
  hosted: "Pedido feito ao Google através do nosso fornecedor de dados (DataForSEO). As reviews chegam todas de uma vez: normalmente em menos de 1 minuto.",
  /** Apify full import: the count grows while Apify reads. */
  apify: "Pedido feito ao Google através do nosso fornecedor de dados (Apify). Num negócio com milhares de reviews pode demorar alguns minutos. As reviews ficam guardadas quando a leitura terminar.",
};

/** Compact "Leitor ligado / desligado" with the last time it reported in. */
export function LeitorStatus({ className = "" }: { className?: string }) {
  const { state, now } = useReaderJobs();
  const { online, busy, lastSeenAt, service } = state.reader;
  // With DataForSEO nothing needs to be switched on: no indicator.
  if (service === "dataforseo") return null;
  let label = online ? (busy ? "Leitor ligado · a trabalhar" : "Leitor ligado") : "Leitor desligado";
  if (!online) label += lastSeenAt ? (now ? ` · visto ${relativeTime(lastSeenAt, now)}` : "") : " · ainda não deu sinal";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-subtle ${className}`}>
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${online ? `bg-success ${busy ? "motion-safe:animate-pulse" : ""}` : "bg-line-strong"}`} />
      {label}
      <InfoTip label="Leitor de reviews">{readerTexts.reader}</InfoTip>
    </span>
  );
}
