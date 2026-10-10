import { BusinessName } from "@/components/reviews/BusinessName";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoReplyPanel } from "@/components/reviews/AutoReplyPanel";
import { DashboardBusyProvider } from "@/components/reviews/DashboardBusy";
import { InfoTip } from "@/components/reviews/InfoTip";
import { ReplyInbox } from "@/components/reviews/ReplyInbox";
import { ReplyOnboarding } from "@/components/reviews/ReplyOnboarding";
import { DraftMoreButton, ReplyRunner } from "@/components/reviews/ReplyRunner";
import { ReplyLibrary, ReplyTraining } from "@/components/reviews/ReplyTraining";
import { requirePanelPage } from "@/lib/reviews/access";
import { formatDate, formatPercent } from "@/lib/reviews/format";
import { inferReplySettings, ownerReplyMinChars } from "@/lib/reviews/owner-replies";
import {
  draftMissingReplies,
  googleLearningReady,
  learnOwnerRepliesSafely,
  loadInbox,
  loadLibrary,
  loadOwnerReplies,
  loadReplyBusiness,
  loadReplySettings,
  loadToneHistory,
  loadTrainingQueue,
  saveReplySettings,
  type ToneHistoryEntry,
} from "@/lib/reviews/reply-store";
import { describeTone, draftsPerRun } from "@/lib/reviews/replies";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export async function generateMetadata({ params }: PageProps<"/painel/[slug]/respostas">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Respostas · ${slug}` };
}

function Stat({ label, value, info }: { label: string; value: number; info: string }) {
  return (
    <div className="card flex flex-col gap-1 p-3.5 sm:p-4">
      <span className="flex items-center gap-1 text-xs text-subtle sm:text-sm">
        {label}
        <InfoTip label={label}>{info}</InfoTip>
      </span>
      <span className="display text-2xl sm:text-3xl">{value}</span>
    </div>
  );
}

/** Minimum decided replies before an acceptance rate is shown. */
const minDecided = 5;

/** "1 frase", "3 frases". */
const count = (value: number, one: string, many: string) => `${value} ${value === 1 ? one : many}`;

function ToneHistory({ history }: { history: ToneHistoryEntry[] }) {
  if (!history.length) return null;
  return (
    <section aria-labelledby="tons-title" className="card flex flex-col gap-3 p-4 sm:p-5">
      <h2 id="tons-title" className="flex items-center gap-1.5 font-semibold text-text">
        Evolução por tom
        <InfoTip label="Evolução por tom">
          Um tom é o conjunto de respostas do formulário de definições que definem como as respostas soam (a assinatura e o contacto não contam). Tudo o que é aprendido (treino, frases, aceitações, edições e rejeições) fica guardado no tom em que
          aconteceu e nunca se mistura com outros. Se mudar as definições, começa um tom novo; se voltar a escolher exatamente as mesmas respostas, o tom antigo volta com
          tudo o que aprendeu. As respostas que deu no Google (em português, com pelo menos {ownerReplyMinChars} caracteres) são a sua voz real: cada tom, novo ou antigo, aprende sozinho as frases delas
          («respostas do Google»). «Aceites à primeira» conta as respostas aprovadas por si sem edição, a dividir por todas as que decidiu (aceites, editadas e rejeitadas); só
          aparece com pelo menos {minDecided} decisões.
        </InfoTip>
      </h2>
      <ol className="flex flex-col gap-2">
        {history.map((entry) => {
          const decided = entry.accepted + entry.edited + entry.rejected;
          return (
            <li key={entry.id} className={`flex flex-col gap-1.5 rounded-xl border p-3 ${entry.current ? "border-accent bg-accent-soft" : "border-line"}`}>
              <span className="flex items-center justify-between gap-2 text-xs text-subtle">
                <span className="font-semibold text-accent-text">{entry.current ? "Tom atual" : "Tom anterior"}</span>
                <span>desde {formatDate(entry.createdAt)}</span>
              </span>
              <span className="text-sm text-text">{describeTone(entry.settings)}</span>
              <span className="text-xs text-muted">
                {[
                  count(entry.sentences, "frase", "frases"),
                  count(entry.trained, "treino", "treinos"),
                  count(entry.google, "resposta do Google", "respostas do Google"),
                  count(entry.accepted, "aceite", "aceites"),
                  count(entry.edited, "editada", "editadas"),
                  count(entry.rejected, "rejeitada", "rejeitadas"),
                ].join(" · ")}
                {decided >= minDecided ? ` · ${formatPercent(entry.accepted / decided)} aceites à primeira` : ""}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default async function RepliesPage({ params, searchParams }: PageProps<"/painel/[slug]/respostas">) {
  const { slug } = await params;
  if (!(await requirePanelPage(slug, `/painel/${slug}/respostas`))) notFound();
  const editing = (await searchParams).editar === "1";
  const client = tryCreateServiceClient();
  if (!client) notFound();
  const business = await loadReplyBusiness(client, slug);
  if (!business) notFound();
  let settings = await loadReplySettings(client, business.id);

  // The page opens on the replies, never on the tone form (owner, 2026-10-10): the first time, the
  // tone is set from the owner's replies on Google (or the defaults) and the first replies are
  // prepared. «Definições do tom e do contacto» changes it whenever the owner wants.
  let autoSetup: { fromGoogle: boolean } | null = null;
  if (!settings.onboardedAt && !editing) {
    const inference = inferReplySettings(await loadOwnerReplies(client, business.id));
    const suggested = inference?.suggested ?? {};
    await saveReplySettings(client, business.id, { ...settings, ...suggested }, settings);
    settings = await loadReplySettings(client, business.id);
    await learnOwnerRepliesSafely(client, business.id, settings);
    await draftMissingReplies(client, business);
    autoSetup = { fromGoogle: Object.keys(suggested).length > 0 };
  }

  if (editing) {
    const [candidates, ownerReplies, learningReady] = await Promise.all([
      loadTrainingQueue(client, business.id, settings.profileId),
      settings.onboardedAt ? Promise.resolve(null) : loadOwnerReplies(client, business.id),
      googleLearningReady(client),
    ]);
    // Never configured: the form starts from what the owner's replies on Google show (nothing is
    // saved until the owner confirms the form).
    const inference = ownerReplies ? inferReplySettings(ownerReplies) : null;
    return (
      <ReplyOnboarding
        slug={slug}
        initial={inference ? { ...settings, ...inference.suggested } : settings}
        prefilled={
          inference
            ? { fields: Object.keys(inference.suggested), replies: inference.replies, portuguese: inference.portuguese, learnable: learningReady ? inference.learnable : 0 }
            : null
        }
        candidates={candidates}
        editing={Boolean(settings.onboardedAt)}
      />
    );
  }

  // Replies the owner gave on Google that are not learned yet (e.g. from the Business Profile sync) teach now.
  await learnOwnerRepliesSafely(client, business.id, settings);
  const [inbox, library, queue, history] = await Promise.all([
    loadInbox(client, business.id, settings),
    loadLibrary(client, business.id, settings.profileId),
    loadTrainingQueue(client, business.id, settings.profileId),
    loadToneHistory(client, business.id, settings.profileId),
  ]);
  const pending = inbox.items.filter((item) => item.status === "pending" && !item.review.ownerReply).length;
  const approved = inbox.items.filter((item) => item.status === "approved").length;
  const runUrl = `/api/painel/${slug}/respostas`;

  return (
    <DashboardBusyProvider>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="eyebrow">Respostas às reviews</p>
            <BusinessName name={business.name} mapsUrl={business.googleMapsUrl} />
          </div>
          <Link
            href={`/painel/${slug}/respostas?editar=1`}
            className="inline-flex min-h-10 items-center self-start text-sm font-semibold text-accent-text hover:underline lg:self-auto"
          >
            Definições do tom e do contacto
          </Link>
        </div>

        {autoSetup ? (
          <p className="rounded-2xl border border-line bg-surface-2/60 p-3.5 text-sm text-text">
            {autoSetup.fromGoogle
              ? "Preparámos as respostas com o tom das suas respostas no Google."
              : "Preparámos as respostas com um tom simples e simpático."}{" "}
            Pode mudar o tratamento, o tamanho, os emojis e a assinatura em{" "}
            <Link href={`/painel/${slug}/respostas?editar=1`} className="font-semibold text-accent-text hover:underline">
              Definições do tom e do contacto
            </Link>
            .
          </p>
        ) : null}

        <p className="rounded-2xl border border-gold/40 bg-gold-soft p-3.5 text-sm text-gold-text">
          <strong>Modo de demonstração.</strong> Ainda não está ligado ao seu perfil Google: aceitar marca a resposta como aprovada, mas não a publica. Quando ligarmos o
          Google Business Profile, as respostas aprovadas passam a ser publicadas sozinhas.
        </p>

        <div className="flex flex-col gap-2">
          <ReplyRunner runUrl={runUrl} />
          <p className="text-sm text-subtle">
            Respostas preparadas a partir das {inbox.stored} reviews guardadas deste negócio
            {business.lastSyncedAt ? `, lidas do Google pela última vez a ${formatDate(business.lastSyncedAt)}` : ""}. As reviews novas chegam com «Atualizar» no separador{" "}
            <Link href={`/painel/${slug}`} className="font-semibold text-accent-text hover:underline">
              Análise Google
            </Link>{" "}
            e com a leitura diária.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="Por aprovar" value={pending} info="Respostas preparadas à espera da sua decisão. As de reviews negativas (1 a 3★) aparecem primeiro." />
          <Stat label="Aprovadas" value={approved} info="Respostas que aceitou (com ou sem edição) ou que foram aprovadas pela resposta automática." />
          <Stat
            label="Sem resposta"
            value={inbox.backlog}
            info={`Todas as reviews guardadas deste negócio (todo o histórico) ainda sem resposta do dono e sem resposta preparada. Cada «Atualizar» prepara até ${draftsPerRun}, das mais recentes para as mais antigas.`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="flex min-w-0 flex-col gap-4">
            <ReplyInbox slug={slug} items={inbox.items} googleFid={business.googleFid} />
            {inbox.backlog > 0 ? <DraftMoreButton runUrl={runUrl} label={`Preparar as restantes ${inbox.backlog}`} /> : null}
          </div>
          <div className="flex flex-col gap-4">
            <AutoReplyPanel slug={slug} mode={settings.autoMode} limit={settings.autoLimit} used={settings.autoUsed} negative={settings.autoNegative} />
            <ReplyTraining key={settings.profileId} slug={slug} queue={queue} />
            <ReplyLibrary slug={slug} library={library} />
            <ToneHistory history={history} />
          </div>
        </div>
      </div>
    </DashboardBusyProvider>
  );
}
