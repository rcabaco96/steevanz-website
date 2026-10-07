import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { JoinForm } from "@/components/public/waitlist/JoinForm";
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

  return (
    <BrandFrame establishment={establishment} eyebrow="Lista de espera">
      <PublicCard>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-2/70 p-3.5">
            <p className="text-xs font-semibold tracking-[0.08em] text-subtle uppercase">À sua frente</p>
            <p className="display mt-1 text-3xl tabular-nums">{waiting.length}</p>
          </div>
          <div className="rounded-2xl bg-surface-2/70 p-3.5">
            <p className="text-xs font-semibold tracking-[0.08em] text-subtle uppercase">Espera estimada</p>
            <p className="display mt-1 text-2xl leading-9">{minutes ? formatWait(minutes).replace("cerca de ", "~") : "Já a seguir"}</p>
          </div>
        </div>
        {settings.state === "open" ? (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="display text-2xl">{words.joinTitle}</h1>
              <p className="text-sm text-muted">Pode esperar onde quiser: avisamos neste telemóvel quando for a sua vez.</p>
              {settings.message ? <p className="mt-1 rounded-xl bg-surface-2/70 px-3 py-2 text-sm text-text">{settings.message}</p> : null}
            </div>
            <JoinForm
              slug={establishment.slug}
              askParty={settings.ask_party}
              maxParty={settings.max_party}
              services={services.map((service) => ({ id: service.id, label: `${service.name} · ${service.duration_minutes} min` }))}
              staff={staff.map((person) => ({ id: person.id, label: person.name }))}
              submitLabel={words.joinTitle}
            />
          </>
        ) : (
          <div className="flex flex-col gap-1.5 py-2 text-center">
            <h1 className="display text-2xl">{settings.state === "paused" ? "Entradas em pausa" : "A fila está fechada"}</h1>
            <p className="text-sm text-muted">
              {settings.state === "paused"
                ? "Neste momento não estamos a aceitar novas entradas. Tente daqui a pouco ou fale com a equipa."
                : "A lista de espera abre nas horas de maior movimento. Fale com a equipa."}
            </p>
          </div>
        )}
      </PublicCard>
    </BrandFrame>
  );
}
