import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { JoinForm } from "@/components/public/waitlist/JoinForm";
import { QueueLine } from "@/components/public/waitlist/QueueLine";
import { kindWords } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { formatWait } from "@/lib/modules/waitlist/eta";
import { currentSettings, loadQueue, queueWait, servingNumber } from "@/lib/modules/waitlist/store";
import { demoSpacePreview } from "@/lib/link-previews";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const establishment = await publicEstablishment(slug, "waitlist");
  if (!establishment) return { title: "Lista de espera" };
  const title = `Lista de espera · ${establishment.name}`;
  return { title, ...demoSpacePreview("fila", slug, title) };
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
  const bundle = await loadBundle(establishment);
  const settings = await currentSettings(establishment, bundle);
  const queue = await loadQueue(establishment);
  const words = kindWords[establishment.kind];
  const waiting = queue.live.filter((entry) => entry.status === "waiting");
  const minutes = queueWait(queue, bundle, settings);
  const serving = servingNumber(queue);
  const services = settings.ask_service ? bundle.services.filter((item) => item.active) : [];
  const staff = settings.ask_staff ? bundle.staff.filter((item) => item.active) : [];
  const open = settings.state === "open";
  // Customers pick who serves them: the estimate is for «qualquer barbeiro» (waiting for one in particular can take longer).
  const anyone = settings.ask_staff && bundle.staff.filter((item) => item.active).length > 1 ? words.who.any.toLowerCase() : null;

  return (
    <BrandFrame establishment={establishment} service="Lista de espera">
      {/* Kept up to date: the estimate moves with the queue, and a queue that closes hides the form at once. */}
      <AutoRefresh intervalMs={5000} />
      {open || waiting.length ? (
        <PublicCard>
          {serving ? (
            <p className="text-sm text-muted">
              A atender agora: <strong className="font-semibold text-text">senha {serving}</strong>
            </p>
          ) : null}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="display text-[2.6rem] leading-none tabular-nums">{waiting.length}</p>
              <p className="mt-1 text-sm text-muted">{waiting.length === 1 ? "pessoa à espera" : "pessoas à espera"}</p>
            </div>
            <div className="text-right">
              <p className="display text-2xl leading-none">{minutes ? formatWait(minutes).replace("cerca de ", "~ ") : "A seguir"}</p>
              <p className="mt-1 text-sm text-muted">{minutes ? (anyone ? `espera estimada com ${anyone}` : "espera estimada") : anyone ? `com ${anyone}, é o próximo a ser chamado` : "se entrar agora, é o próximo a ser chamado"}</p>
            </div>
          </div>
          <QueueLine ahead={waiting.length} withYou={open} />
        </PublicCard>
      ) : null}

      {open ? (
        <PublicCard>
          <div className="flex flex-col gap-1">
            <h2 className="display text-[1.7rem] leading-tight">{words.joinTitle}</h2>
            <p className="text-muted">Avisamos quando for a sua vez: na página da senha, ative os avisos no telemóvel.</p>
          </div>
          {settings.message ? <p className="rounded-2xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-text">{settings.message}</p> : null}
          <JoinForm
            slug={establishment.slug}
            askParty={settings.ask_party}
            maxParty={settings.max_party}
            services={services.map((service) => ({ id: service.id, label: `${service.name} (${service.duration_minutes} min)` }))}
            staff={staff.map((person) => ({ id: person.id, label: person.name }))}
            submitLabel={words.joinTitle}
            who={words.who}
          />
        </PublicCard>
      ) : (
        <PublicCard className="items-center py-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand)] text-[var(--brand-text)]">
            <ClockIcon />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2 className="display text-[1.7rem] leading-tight">A fila está fechada</h2>
            <p className="mx-auto max-w-[30ch] text-muted">Não estamos a aceitar entradas neste momento. Pode falar diretamente com a equipa.</p>
          </div>
        </PublicCard>
      )}
    </BrandFrame>
  );
}
