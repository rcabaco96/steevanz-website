import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { CallAlert } from "@/components/public/waitlist/CallAlert";
import { ReplyButtons } from "@/components/public/waitlist/ReplyButtons";
import { kindWords } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { formatWait } from "@/lib/modules/waitlist/eta";
import { ensureWaitlistSettings, entryOutlook, getEntryByToken, loadQueue } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string; token: string }> };

export const metadata: Metadata = { title: "A sua vez na fila", referrer: "no-referrer" };

export default async function WaitlistTicketPage({ params }: Props) {
  const { slug, token } = await params;
  const establishment = await publicEstablishment(slug, "waitlist");
  if (!establishment) notFound();
  const entry = await getEntryByToken(token);
  if (!entry || entry.establishment_id !== establishment.id) notFound();
  const [bundle, settings, queue] = await Promise.all([loadBundle(establishment), ensureWaitlistSettings(establishment), loadQueue(establishment)]);
  const words = kindWords[establishment.kind];
  const live = entry.status === "waiting" || entry.status === "called";
  const outlook = entry.status === "waiting" ? entryOutlook(entry, queue, bundle, settings) : null;
  const service = entry.service_id ? bundle.services.find((item) => item.id === entry.service_id) : null;
  const staff = entry.staff_id ? bundle.staff.find((item) => item.id === entry.staff_id) : null;

  return (
    <BrandFrame establishment={establishment} eyebrow="Lista de espera">
      {live ? <AutoRefresh intervalMs={5000} whileHidden /> : null}
      <CallAlert slug={establishment.slug} token={entry.token} status={entry.status} calledAt={entry.called_at} title={words.callAction} message={words.ready} />

      {entry.status === "called" ? (
        <section role="alert" className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-[var(--brand)] px-5 py-8 text-center text-[var(--brand-text)] shadow-lg">
          <p className="text-sm font-semibold tracking-[0.12em] uppercase opacity-80">Senha n.º {entry.number}</p>
          <p className="display text-4xl leading-tight">{words.callAction}!</p>
          <p className="text-base opacity-90">{words.ready}</p>
          <p className="text-sm opacity-80">Tem cerca de {settings.grace_minutes} minutos para se apresentar.</p>
        </section>
      ) : (
        <PublicCard className="items-center text-center">
          <p className="text-xs font-semibold tracking-[0.12em] text-subtle uppercase">A sua senha</p>
          <p className="display text-6xl tabular-nums">{entry.number}</p>
          <p className="text-base font-semibold text-text">{entry.name}</p>
          {entry.status === "waiting" && outlook ? (
            <div className="grid w-full grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-surface-2/70 p-3">
                <p className="text-xs font-semibold tracking-[0.08em] text-subtle uppercase">Posição</p>
                <p className="display mt-1 text-3xl tabular-nums">{outlook.position}.º</p>
              </div>
              <div className="rounded-2xl bg-surface-2/70 p-3">
                <p className="text-xs font-semibold tracking-[0.08em] text-subtle uppercase">Estimativa</p>
                <p className="display mt-1 text-2xl leading-9">{outlook.minutes ? formatWait(outlook.minutes).replace("cerca de ", "~") : "A seguir"}</p>
              </div>
            </div>
          ) : null}
          {entry.status === "waiting" ? (
            <p className="text-sm text-muted">Pode esperar onde quiser. Esta página atualiza-se sozinha e toca quando for a sua vez.</p>
          ) : null}
          {entry.status === "served" ? <p className="text-sm text-muted">Já foi atendido. Obrigado pela visita!</p> : null}
          {entry.status === "no_show" ? <p className="text-sm text-muted">Foi chamado mas não se apresentou a tempo. Fale com a equipa se ainda estiver por perto.</p> : null}
          {entry.status === "cancelled" ? <p className="text-sm text-muted">Saiu da fila.</p> : null}
        </PublicCard>
      )}

      {live ? (
        <PublicCard>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {entry.party_size ? (
              <>
                <dt className="text-subtle">Pessoas</dt>
                <dd className="text-text">{entry.party_size}</dd>
              </>
            ) : null}
            {service ? (
              <>
                <dt className="text-subtle">Serviço</dt>
                <dd className="text-text">{service.name}</dd>
              </>
            ) : null}
            {entry.service_id || entry.staff_id ? (
              <>
                <dt className="text-subtle">Com</dt>
                <dd className="text-text">{staff?.name ?? "Qualquer profissional"}</dd>
              </>
            ) : null}
            <dt className="text-subtle">Entrou às</dt>
            <dd className="text-text">
              {new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, hour: "2-digit", minute: "2-digit" }).format(new Date(entry.joined_at))}
            </dd>
          </dl>
          <ReplyButtons token={entry.token} called={entry.status === "called"} current={entry.reply} />
        </PublicCard>
      ) : (
        <Link href={`/fila/${establishment.slug}`} className="text-center text-sm font-semibold text-muted hover:text-text">
          Voltar à lista de espera
        </Link>
      )}
      {live ? (
        <p className="px-2 text-center text-xs text-subtle">Guarde esta página: é a sua senha. Se a fechar, volte a abri-la pelo mesmo QR code.</p>
      ) : null}
    </BrandFrame>
  );
}
