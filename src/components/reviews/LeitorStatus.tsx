"use client";

import { readerOnlineSeconds, relativeTime, updateIntervalMinutes } from "@/lib/reviews/import-jobs";
import { lisbonTime } from "@/lib/reviews/reader-throttle";
import { defaultPageMs, importSetupMs, mapsPageSize } from "@/lib/reviews/maps-reader";
import { InfoTip } from "./InfoTip";
import { useReaderJobs } from "./ReaderJobs";

const seconds = (ms: number) => (ms / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 });

/** Explanations (i) of everything the panel computes about the reader. Update with the rules. */
export const readerTexts = {
  reader: `O leitor da Steevanz é o programa que lê as reviews diretamente do Google Maps, num computador nosso (sem custos de serviços externos). Dá sinal a cada poucos segundos e conta como ligado se deu sinal nos últimos ${readerOnlineSeconds} segundos. Desligado quer dizer que esse computador ou o programa estão parados: os pedidos não se perdem, ficam em fila e são feitos assim que voltar a ligar. As reviews dos clientes passam sempre à frente da concorrência, e quem está à espera no painel passa à frente das rotinas diárias.`,
  newReviews:
    "Reviews encontradas no Google que ainda não estavam guardadas. A atualização lê sempre a continuar a partir da última review guardada (sem buracos) e volta a ver as respostas do dono às reviews dos últimos 7 dias (30 dias uma vez por mês).",
  interval: (minutesAgo: number) =>
    `Cada negócio é lido no Google no máximo uma vez a cada ${updateIntervalMinutes} minutos (pelo botão, pelo separador Respostas ou pelas rotinas). A última leitura foi ${
      minutesAgo < 1 ? "há menos de 1 minuto" : `há ${minutesAgo} min`
    }, por isso as reviews mostradas já são as mais recentes. Pode voltar a atualizar daqui a ${updateIntervalMinutes - minutesAgo} min.`,
  limited:
    "Quando o Google mostra sinais de estar a limitar o leitor (reviews que não carregam, pedidos para iniciar sessão, listas que param a meio), o leitor volta a tentar este pedido daí a poucos minutos (2, 5, 10 e 20), até 5 vezes; só as leituras de concorrentes fazem uma pausa maior. As reviews já lidas ficam guardadas e a leitura continua a partir da última guardada.",
  progress: `«Guardadas» são as reviews deste negócio que já temos. O total é o número de reviews que o Google mostra no perfil (o da última leitura). O leitor da Steevanz lê o Google Maps: o Google entrega ${mapsPageSize} reviews de cada vez (~${seconds(defaultPageMs)} s por pedido e ~${seconds(importSetupMs)} s para abrir o Google Maps). O tempo que falta é uma estimativa feita com esse ritmo.`,
};

/** Compact "Leitor ligado / desligado" with the last time it reported in. */
export function LeitorStatus({ className = "" }: { className?: string }) {
  const { state, now } = useReaderJobs();
  const { online, busy, lastSeenAt, pausedUntil } = state.reader;
  const paused = online && pausedUntil && now !== null && Date.parse(pausedUntil) > now ? pausedUntil : null;
  let label = paused ? `Leitor em pausa até às ${lisbonTime(paused)} (o Google está a limitar)` : online ? (busy ? "Leitor ligado · a trabalhar" : "Leitor ligado") : "Leitor desligado";
  if (!online) label += lastSeenAt ? (now ? ` · visto ${relativeTime(lastSeenAt, now)}` : "") : " · ainda não deu sinal";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-subtle ${className}`}>
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${online ? `bg-success ${busy ? "motion-safe:animate-pulse" : ""}` : "bg-line-strong"}`} />
      {label}
      <InfoTip label="Leitor de reviews">{readerTexts.reader}</InfoTip>
    </span>
  );
}
