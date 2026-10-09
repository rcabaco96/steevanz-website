import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GoogleDisconnectButton, GoogleImportWatcher, GoogleLocationChooser } from "@/components/google/GoogleConnectPanel";
import { googleConnectPath } from "@/components/google/header-status";
import { ShieldCheckIcon, verifiedExplanation } from "@/components/google/verified";
import { VerifiedBadge } from "@/components/google/VerifiedBadge";
import { AlertIcon, Check, ClockIcon, GoogleG, SparkleIcon } from "@/components/icons";
import { InfoTip } from "@/components/reviews/InfoTip";
import { buttonClasses } from "@/components/ui/Button";
import { emptyGoogleLink, loadGoogleLink, type GoogleLink } from "@/lib/google/connection";
import { getSession } from "@/lib/auth/session";
import { googleOAuthConfigured, googleOAuthMissing } from "@/lib/google/oauth";
import { requirePanelPage } from "@/lib/reviews/access";
import { formatDateTime } from "@/lib/reviews/format";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export async function generateMetadata({ params }: PageProps<"/painel/[slug]/google">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Ligação ao Google · ${slug}` };
}

type Estado = "ligado" | "escolher" | "erro" | "indisponivel" | "cancelado";
const estados: readonly Estado[] = ["ligado", "escolher", "erro", "indisponivel", "cancelado"];

const tips = {
  speed:
    "Tempos aproximados de uma atualização, medidos pela Steevanz. Sem ligação, as reviews são lidas da página pública do Google Maps por um computador da Steevanz: demora uns 5 segundos e, se esse computador estiver desligado, a atualização fica à espera dele. Com ligação, as reviews e as respostas vêm da API oficial do Google Business Profile, em cerca de 1 segundo.",
  verified: `${verifiedExplanation()} O selo aparece no seu painel e ao lado do nome do seu negócio na tabela da concorrência dos outros clientes Steevanz. Não substitui a verificação do perfil feita pelo próprio Google (por carta, telefone ou vídeo).`,
};

function LockIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

async function loadPage(slug: string): Promise<{ name: string; link: GoogleLink } | null> {
  const client = tryCreateServiceClient();
  if (!client) return null;
  const { data, error } = await client.from("review_businesses").select("id, name").eq("slug", slug).maybeSingle<{ id: string; name: string }>();
  if (error) throw new Error(error.message);
  if (!data) return null;
  // Only reads Supabase; opening the page never calls Google.
  const link = await loadGoogleLink(client, data.id).catch(() => emptyGoogleLink);
  return { name: data.name, link };
}

function Notice({ tone, children }: { tone: "success" | "gold" | "danger"; children: ReactNode }) {
  const classes = {
    success: "border-success/30 bg-success-soft text-success",
    gold: "border-gold/40 bg-gold-soft text-gold-text",
    danger: "border-danger/30 bg-danger-soft text-danger",
  }[tone];
  return (
    <div role="status" className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-sm sm:p-4 ${classes}`}>
      {tone === "success" ? <Check size={18} className="mt-px shrink-0" /> : <AlertIcon size={18} className="mt-px shrink-0" />}
      <div className="min-w-0 break-words text-text">{children}</div>
    </div>
  );
}

function EstadoNotice({ estado, link, missing }: { estado: Estado | null; link: GoogleLink; missing: string[] | null }) {
  if (estado === "ligado" && link.status === "connected")
    return (
      <Notice tone="success">
        <strong>Perfil Google ligado.</strong> A partir de agora as reviews e as respostas chegam pela API oficial do Google. A primeira leitura do histórico pode demorar
        alguns minutos.
      </Notice>
    );
  if (estado === "escolher" && link.status === "pending_location")
    return (
      <Notice tone="gold">
        <strong>Falta um passo.</strong> A sua conta Google gere mais do que um negócio (ou não encontrámos este automaticamente): escolha abaixo qual é o seu.
      </Notice>
    );
  if (estado === "erro")
    return (
      <Notice tone="danger">
        <strong>Não foi possível ligar ao Google.</strong> {link.lastError ?? "Tente outra vez; se o problema continuar, fale connosco."}
      </Notice>
    );
  if (estado === "indisponivel")
    return (
      <Notice tone="gold">
        <strong>A ligação ao Google ainda não está ativa.</strong> A Steevanz ainda está a concluir a configuração da ligação com a Google, por isso não o
        enviámos para o ecrã de autorização. Não precisa de fazer nada: o seu painel continua a funcionar e, assim que a ligação estiver ativa, este mesmo
        botão leva-o diretamente ao Google (demora menos de um minuto).
        {missing?.length ? (
          // Admins only: what the server is missing (names of the env vars, never their values).
          <span className="mt-2 block text-sm text-muted">
            <strong className="text-text">Só para administradores:</strong> faltam no servidor {missing.join(", ")}. Defina-as na Vercel (Settings → Environment
            Variables, Production e Preview) e faça um novo deploy.
          </span>
        ) : null}
      </Notice>
    );
  if (estado === "cancelado" && link.status !== "connected")
    return (
      <Notice tone="gold">
        <strong>Ligação cancelada.</strong> Pode tentar outra vez quando quiser.
      </Notice>
    );
  return null;
}

const statusPill: Record<GoogleLink["status"], { label: string; className: string }> = {
  not_connected: { label: "Não ligado", className: "bg-surface-2 text-muted" },
  pending_location: { label: "Falta escolher o negócio", className: "bg-gold-soft text-gold-text" },
  connected: { label: "Google ligado", className: "bg-success-soft text-success" },
  error: { label: "Com problema", className: "bg-danger-soft text-danger" },
};

const headlines: Record<GoogleLink["status"], { title: string; lead: string }> = {
  not_connected: {
    title: "Verifique o seu perfil",
    lead: "Ligue o seu Perfil de Empresa Google e ganhe o selo «Perfil verificado»: a prova, dada pela Google, de que é mesmo você quem gere este negócio. E o painel passa a atualizar em segundos, pela API oficial.",
  },
  pending_location: {
    title: "Falta escolher o seu negócio",
    lead: "A conta Google já está ligada. Diga-nos qual dos perfis que ela gere é o deste painel: o seu perfil fica verificado e começamos a usar a API oficial.",
  },
  connected: {
    title: "O seu perfil está verificado",
    lead: "O seu Perfil de Empresa Google está ligado: o selo «Perfil verificado» aparece no seu painel e na tabela da concorrência, e as reviews e as respostas chegam pela API oficial do Google, em segundos.",
  },
  error: {
    title: "A ligação ao Google tem um problema",
    lead: "Enquanto não for resolvido, o selo «Perfil verificado» fica suspenso e as reviews voltam a ser lidas do Google Maps (mais devagar). Normalmente resolve-se voltando a ligar.",
  },
};

/**
 * Always clickable while the customer isn't connected. A plain navigation: the route redirects to
 * Google's consent screen and back here; while the connection isn't set up on the server it comes
 * straight back with estado=indisponivel, which explains why.
 */
function ConnectButton({ slug, configured, label = "Ligar com o Google" }: { slug: string; configured: boolean; label?: string }) {
  const button = (
    <a href={googleConnectPath(slug)} className={buttonClasses("primary", "lg", "w-full sm:w-auto sm:self-start")}>
      <GoogleG size={18} />
      {label}
    </a>
  );
  if (configured) return button;
  return (
    <div className="flex flex-col gap-2">
      {button}
      <p className="text-sm text-muted">A Steevanz ainda está a concluir a ligação com a Google. Pode carregar no botão: explicamos em que ponto está.</p>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-2.5 last:border-b-0">
      <dt className="text-sm text-subtle">{label}</dt>
      <dd className="min-w-0 font-medium break-words text-text">{children}</dd>
    </div>
  );
}

function StatusCard({ slug, link, configured }: { slug: string; link: GoogleLink; configured: boolean }) {
  if (link.status === "pending_location") {
    return (
      <section aria-labelledby="google-choose" className="card flex flex-col gap-3 p-4 sm:p-6">
        <h2 id="google-choose" className="font-semibold text-text">
          Escolha o seu negócio
        </h2>
        {link.options?.length ? (
          <GoogleLocationChooser slug={slug} options={link.options} />
        ) : (
          <>
            <p className="text-sm text-muted">
              Não encontrámos nenhum Perfil de Empresa na conta Google com que entrou{link.email ? ` (${link.email})` : ""}. Volte a ligar com a conta que gere o perfil do
              seu negócio.
            </p>
            <ConnectButton slug={slug} configured={configured} label="Ligar com outra conta" />
          </>
        )}
      </section>
    );
  }

  if (link.status === "connected" || link.status === "error") {
    return (
      <section aria-labelledby="google-details" className="card flex flex-col gap-4 p-4 sm:p-6">
        <h2 id="google-details" className="font-semibold text-text">
          Detalhes da ligação
        </h2>
        {link.status === "error" ? (
          <p className="flex items-start gap-2 rounded-2xl bg-danger-soft p-3.5 text-sm text-text">
            <AlertIcon size={18} className="mt-px shrink-0 text-danger" />
            <span className="min-w-0 break-words">{link.lastError ?? "O Google deixou de aceitar a ligação. Volte a ligar para a renovar."}</span>
          </p>
        ) : null}
        <dl className="flex flex-col">
          <Detail label="Conta Google">{link.email ?? "—"}</Detail>
          <Detail label="Negócio no Google">{link.locationTitle ?? "—"}</Detail>
          <Detail label="Ligado em">{link.linkedAt ? formatDateTime(link.linkedAt) : "—"}</Detail>
          <Detail label="Última leitura pelo Google">
            {link.lastSyncAt ? (
              formatDateTime(link.lastSyncAt)
            ) : link.status === "connected" ? (
              <span className="inline-flex items-center gap-2 text-accent-text">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent" />A importar as suas reviews do Google…
              </span>
            ) : (
              "Ainda nenhuma"
            )}
          </Detail>
        </dl>
        {link.status === "connected" && !link.lastSyncAt ? <GoogleImportWatcher /> : null}
        {link.status === "error" ? <ConnectButton slug={slug} configured={configured} label="Voltar a ligar" /> : null}
        <GoogleDisconnectButton slug={slug} />
      </section>
    );
  }

  const steps = [
    "Toque em «Ligar com o Google».",
    "Entre com a conta Google que gere o perfil do seu negócio e autorize a Steevanz.",
    "Se a conta gerir mais do que um negócio, escolha qual é o deste painel.",
  ];
  return (
    <section aria-labelledby="google-steps" className="card flex flex-col gap-4 p-4 sm:p-6">
      <h2 id="google-steps" className="font-semibold text-text">
        Como funciona
      </h2>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 text-sm text-muted">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-text">{index + 1}</span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
      </ol>
      <p className="text-sm text-subtle">Demora menos de um minuto. Pode desligar quando quiser.</p>
    </section>
  );
}

const benefits = [
  {
    icon: <ShieldCheckIcon size={21} />,
    title: "Perfil verificado",
    text: "Ganha o selo «Perfil verificado» no seu painel e ao lado do seu nome na tabela da concorrência dos outros clientes Steevanz.",
    tip: tips.verified,
  },
  {
    icon: <ClockIcon size={20} />,
    title: "Velocidade",
    text: "Reviews e respostas novas chegam em segundos, pela API oficial do Google, sem depender da leitura do Google Maps.",
  },
  {
    icon: <SparkleIcon size={20} />,
    title: "Respostas diretas",
    text: "As respostas que aprovar passam a ser publicadas diretamente no Google, sem copiar e colar.",
    soon: true,
  },
  {
    icon: <LockIcon />,
    title: "Privacidade",
    text: "Só lemos as reviews e as respostas do seu perfil. Não mexemos em mais nada e pode desligar quando quiser.",
  },
];

const comparison: { label: string; tip?: string; without: string; with: string; soon?: boolean }[] = [
  { label: "Selo «Perfil verificado»", tip: tips.verified, without: "Não", with: "Sim, no painel e na tabela da concorrência" },
  { label: "Atualização", tip: tips.speed, without: "Leitura do Google Maps (~5 s), depende do computador da Steevanz", with: "API oficial do Google (~1 s)" },
  { label: "Respostas", without: "Copiar à mão para o Google", with: "Publicadas pela Steevanz", soon: true },
];

function SoonTag() {
  return <span className="ml-1.5 inline-flex rounded-full bg-gold-soft px-2 py-0.5 align-middle text-[0.6875rem] font-semibold text-gold-text">Em breve</span>;
}

export default async function GooglePage({ params, searchParams }: PageProps<"/painel/[slug]/google">) {
  const { slug } = await params;
  if (!(await requirePanelPage(slug, `/painel/${slug}/google`))) notFound();
  const query = await searchParams;
  const rawEstado = Array.isArray(query.estado) ? query.estado[0] : query.estado;
  const estado = estados.includes(rawEstado as Estado) ? (rawEstado as Estado) : null;

  const data = await loadPage(slug);
  if (!data) notFound();
  const { link, name } = data;
  const configured = googleOAuthConfigured();
  // An admin sees the customer's page as is, plus which server settings are missing.
  const missing = !configured && (await getSession()).state === "admin" ? googleOAuthMissing() : null;
  const headline = headlines[link.status];
  const pill = statusPill[link.status];

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <EstadoNotice estado={estado} link={link} missing={missing} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-start lg:gap-10">
        <section aria-labelledby="google-title" className="flex min-w-0 flex-col gap-5">
          <p className="eyebrow break-words">Perfil de Empresa Google · {name}</p>
          <h1 id="google-title" className="display text-[2.1rem] leading-tight sm:text-5xl">
            {headline.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {link.status === "connected" ? <VerifiedBadge size="md" name={name} /> : null}
            <span className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${pill.className}`}>
              <GoogleG size={13} />
              {pill.label}
            </span>
            {link.status !== "connected" ? (
              <span className="inline-flex items-center gap-2 text-xs text-subtle">
                O selo que vai ganhar:
                <VerifiedBadge size="md" />
              </span>
            ) : null}
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">{headline.lead}</p>
          {link.status === "not_connected" ? <ConnectButton slug={slug} configured={configured} /> : null}
          {link.status === "pending_location" ? (
            <a href={googleConnectPath(slug)} className="self-start text-sm font-semibold text-accent-text underline-offset-4 hover:underline">
              Usar outra conta Google
            </a>
          ) : null}
        </section>
        <StatusCard slug={slug} link={link} configured={configured} />
      </div>

      <section aria-labelledby="google-benefits" className="flex flex-col gap-4 sm:gap-6">
        <h2 id="google-benefits" className="display text-2xl sm:text-3xl">
          {link.status === "connected" ? "O que ganha com a ligação" : "Porque ligar"}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="card flex flex-col gap-2.5 p-4 sm:p-5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent-text">{benefit.icon}</span>
              <h3 className="flex flex-wrap items-center gap-1 font-semibold text-text">
                {benefit.title}
                {benefit.tip ? <InfoTip label={benefit.title}>{benefit.tip}</InfoTip> : null}
                {benefit.soon ? <SoonTag /> : null}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="google-compare" className="flex flex-col gap-4 sm:gap-6">
        <h2 id="google-compare" className="display text-2xl sm:text-3xl">
          Sem ligação vs Com ligação
        </h2>
        {/* Phones: each criterion is a row with its name on top and the two columns side by side. */}
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm max-sm:block">
            <thead className="max-sm:block">
              <tr className="border-b border-line bg-surface-2 max-sm:grid max-sm:grid-cols-2">
                <th scope="col" className="p-3 font-semibold text-subtle max-sm:hidden sm:p-4">
                  <span className="sr-only">Critério</span>
                </th>
                <th scope="col" className="p-3 font-semibold text-muted sm:p-4">
                  Sem ligação
                </th>
                <th scope="col" className="p-3 font-semibold text-success sm:p-4">
                  <span className="inline-flex items-center gap-1.5">
                    <GoogleG size={14} />
                    Com ligação
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="max-sm:block">
              {comparison.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0 max-sm:grid max-sm:grid-cols-2">
                  <th scope="row" className="p-3 align-top font-semibold text-text max-sm:col-span-2 max-sm:pb-0 sm:p-4">
                    <span className="inline-flex items-center gap-1">
                      {row.label}
                      {row.tip ? <InfoTip label={row.label}>{row.tip}</InfoTip> : null}
                    </span>
                  </th>
                  <td className="p-3 align-top text-muted sm:p-4">{row.without}</td>
                  <td className="p-3 align-top font-medium text-text sm:p-4">
                    <span className="inline-flex items-start gap-1.5">
                      <Check size={16} className="mt-px shrink-0 text-success" />
                      <span>
                        {row.with}
                        {row.soon ? <SoonTag /> : null}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
