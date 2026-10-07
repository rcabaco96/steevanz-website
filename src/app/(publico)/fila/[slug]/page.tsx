import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { JoinForm } from "@/components/public/waitlist/JoinForm";
import { QueueLine } from "@/components/public/waitlist/QueueLine";
import { kindWords } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { estimateWait, formatWait } from "@/lib/modules/waitlist/eta";
import { ensureWaitlistSettings, loadQueue } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const establishment = await publicEstablishment((await params).slug, "waitlist");
  return { title: establishment ? `Lista de espera · ${establishment.name}` : "Lista de espera" };
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export default async function WaitlistJoinPage({ params }: Props) {
  const { slug } = await params;
  const establishment = await publicEstablishment(slug, "waitlist");
  if (!establishment) notFound();
  const [bundle, settings, queue] = await Promise.all([loadBundle(establishment), ensureWaitlistSettings(establishment), loadQueue(establishment)]);
  const words = kindWords[establishment.kind];
  const waiting = queue.live.filter((entry) => entry.status === "waiting");
  const minutes = estimateWait({
    ahead: waiting.map((entry) => ({
      serviceMinutes: settings.ask_service ? (bundle.services.find((item) => item.id === entry.service_id)?.duration_minutes ?? settings.avg_minutes) : null,
      staffId: entry.staff_id,
    })),
    avgMinutes: settings.avg_minutes,
    activeStaff: bundle.staff.filter((item) => item.active).length,
    recentCalls: queue.recentCalls,
    now: queue.now,
  });
  const services = settings.ask_service ? bundle.services.filter((item) => item.active) : [];
  const staff = settings.ask_staff ? bundle.staff.filter((item) => item.active) : [];
  const open = settings.state === "open";

  return (
    <BrandFrame establishment={establishment} service="Lista de espera">
      {open || waiting.length ? (
        <PublicCard>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="display text-[2.6rem] leading-none tabular-nums">{waiting.length}</p>
              <p className="mt-1 text-sm text-muted">{waiting.length === 1 ? "pessoa à espera" : "pessoas à espera"}</p>
            </div>
            <div className="text-right">
              <p className="display text-2xl leading-none">{minutes ? formatWait(minutes).replace("cerca de ", "~ ") : "Sem espera"}</p>
              <p className="mt-1 text-sm text-muted">{minutes ? "espera estimada" : "é já a seguir"}</p>
            </div>
          </div>
          <QueueLine ahead={waiting.length} withYou={open} />
        </PublicCard>
      ) : null}

      {open ? (
        <PublicCard>
          <div className="flex flex-col gap-1">
            <h2 className="display text-[1.7rem] leading-tight">{words.joinTitle}</h2>
            <p className="text-muted">Espere onde quiser. Este telemóvel avisa quando for a sua vez.</p>
          </div>
          {settings.message ? <p className="rounded-2xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-text">{settings.message}</p> : null}
          <JoinForm
            slug={establishment.slug}
            askParty={settings.ask_party}
            maxParty={settings.max_party}
            services={services.map((service) => ({ id: service.id, label: `${service.name} (${service.duration_minutes} min)` }))}
            staff={staff.map((person) => ({ id: person.id, label: person.name }))}
            submitLabel={words.joinTitle}
          />
        </PublicCard>
      ) : (
        <PublicCard className="items-center py-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand)] text-[var(--brand-text)]">
            <ClockIcon />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2 className="display text-[1.7rem] leading-tight">{settings.state === "paused" ? "Entradas em pausa" : "A fila está fechada"}</h2>
            <p className="mx-auto max-w-[30ch] text-muted">
              {settings.state === "paused"
                ? "Não estamos a aceitar novas entradas neste momento. Volte a tentar daqui a pouco."
                : "A lista de espera abre nas horas de maior movimento. Pode falar diretamente com a equipa."}
            </p>
          </div>
        </PublicCard>
      )}
    </BrandFrame>
  );
}
