import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { BrandFrame, Fact, PublicCard } from "@/components/public/BrandFrame";
import { CallAlert } from "@/components/public/waitlist/CallAlert";
import { QueueLine } from "@/components/public/waitlist/QueueLine";
import { ReplyButtons } from "@/components/public/waitlist/ReplyButtons";
import { kindWords } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { formatWait } from "@/lib/modules/waitlist/eta";
import { ensureWaitlistSettings, entryOutlook, getEntryByToken, loadQueue } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string; token: string }> };

export const metadata: Metadata = { title: "A sua senha", referrer: "no-referrer" };

const finished = {
  served: { chip: "Atendido", text: "Foi atendido. Obrigado pela visita!" },
  no_show: { chip: "Senha expirada", text: "Foi chamado mas não se apresentou a tempo. Se ainda estiver por perto, fale com a equipa." },
  cancelled: { chip: "Saiu da fila", text: "Já não está na fila." },
} as const;

export default async function WaitlistTicketPage({ params }: Props) {
  const { slug, token } = await params;
  const establishment = await publicEstablishment(slug, "waitlist");
  if (!establishment) notFound();
  const entry = await getEntryByToken(token);
  if (!entry || entry.establishment_id !== establishment.id) notFound();
  const [bundle, settings, queue] = await Promise.all([loadBundle(establishment), ensureWaitlistSettings(establishment), loadQueue(establishment)]);
  const words = kindWords[establishment.kind];
  const called = entry.status === "called";
  const live = entry.status === "waiting" || called;
  const outlook = entry.status === "waiting" ? entryOutlook(entry, queue, bundle, settings) : null;
  const service = entry.service_id ? bundle.services.find((item) => item.id === entry.service_id) : null;
  const staff = entry.staff_id ? bundle.staff.find((item) => item.id === entry.staff_id) : null;
  const joinedAt = new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, hour: "2-digit", minute: "2-digit" }).format(new Date(entry.joined_at));
  const details = [
    entry.party_size ? `${entry.party_size} ${entry.party_size === 1 ? "pessoa" : "pessoas"}` : null,
    service?.name ?? null,
    entry.service_id || entry.staff_id ? `com ${staff?.name ?? "qualquer profissional"}` : null,
    `entrou às ${joinedAt}`,
  ].filter(Boolean);
  const done = entry.status === "served" || entry.status === "no_show" || entry.status === "cancelled" ? finished[entry.status] : null;

  return (
    <BrandFrame establishment={establishment} service="Lista de espera">
      {live ? <AutoRefresh intervalMs={5000} whileHidden /> : null}

      <article
        aria-live="polite"
        className={`ticket overflow-hidden ${called ? "call-pulse" : ""} ${done ? "opacity-75" : ""}`}
      >
        <div className={`px-6 pt-5 pb-7 ${called ? "bg-[var(--brand)] text-[var(--brand-text)]" : ""}`}>
          <div className="flex items-center justify-between gap-3">
            <span className={`text-sm font-medium ${called ? "opacity-85" : "text-muted"}`}>A sua senha</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${called ? "bg-black/15" : "bg-surface-2 text-text"} ${done ? "text-muted" : ""}`}
            >
              {!called && !done ? <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-[var(--brand)] motion-reduce:animate-none" /> : null}
              {called ? words.callAction : (done?.chip ?? "À espera")}
            </span>
          </div>
          <p className={`display mt-2 text-[6rem] leading-[0.9] tabular-nums ${done ? "line-through decoration-2" : ""}`}>{entry.number}</p>
          <p className={`mt-2 text-lg font-semibold ${called ? "" : "text-text"}`}>{entry.name}</p>
          {called ? (
            <div role="alert" className="mt-4 flex flex-col gap-1">
              <p className="display text-[1.7rem] leading-tight">{words.ready}</p>
              <p className="opacity-85">Tem cerca de {settings.grace_minutes} minutos para se apresentar.</p>
            </div>
          ) : null}
        </div>
        <div className="ticket-tear" />
        <div className="flex flex-col gap-4 px-6 pt-5 pb-6">
          {outlook ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Fact value={`${outlook.position}.º`} label="na fila" />
                <Fact value={outlook.minutes ? formatWait(outlook.minutes).replace("cerca de ", "~ ") : "Já"} label={outlook.minutes ? "de espera estimada" : "é a seguir"} />
              </div>
              <QueueLine ahead={outlook.position - 1} withYou />
            </>
          ) : null}
          {done ? <p className="text-muted">{done.text}</p> : null}
          {live ? <p className="text-sm text-muted">{details.join(", ")}</p> : null}
        </div>
      </article>

      <CallAlert slug={establishment.slug} token={entry.token} status={entry.status} calledAt={entry.called_at} title={words.callAction} message={words.ready} />

      {live ? (
        <PublicCard>
          {called ? <h2 className="text-lg font-semibold text-text">Diga à equipa se já vem</h2> : null}
          <ReplyButtons token={entry.token} called={called} current={entry.reply} />
        </PublicCard>
      ) : (
        <Link href={`/fila/${establishment.slug}`} className="text-center text-sm font-semibold text-muted hover:text-text">
          Voltar à lista de espera
        </Link>
      )}
      {entry.status === "waiting" ? (
        <p className="px-4 text-center text-sm text-subtle">
          Pode bloquear o ecrã: a página continua atenta. Se a fechar, volte a ler o mesmo QR code para ver a sua senha.
        </p>
      ) : null}
    </BrandFrame>
  );
}
