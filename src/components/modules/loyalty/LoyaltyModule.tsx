import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { requestOrigin } from "@/lib/booking/request";
import { moduleEstablishments } from "@/lib/establishments/provision";
import { loadBundle } from "@/lib/establishments/store";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { saveProgram, setStaffCode, staffDeleteCard, staffMigrateStamps, staffRedeem, staffRemoveStamp, staffStamp } from "@/lib/modules/loyalty/actions";
import { cardRewards, formatCardCode, maxMilestones, missingText, rewardsSentence } from "@/lib/modules/loyalty/rules";
import {
  availableRewards,
  ensureProgram,
  getCard,
  loadLoyaltyStats,
  recentCards,
  searchCards,
  type LoyaltyCardRow,
  type LoyaltyProgramRow,
  type LoyaltyRewardRow,
} from "@/lib/modules/loyalty/store";
import type { ModuleProps } from "../registry";
import { EstablishmentSettings } from "../shared/EstablishmentSettings";
import { Materials } from "../shared/Materials";
import { ModuleNav, pickEstablishment, pickView, queryValue } from "../shared/ModuleNav";
import { NoEstablishment } from "../shared/NoEstablishment";
import { QrCode } from "../shared/QrCode";

const views = [
  { id: "carimbar", label: "Carimbar" },
  { id: "clientes", label: "Clientes" },
  { id: "estatisticas", label: "Estatísticas" },
  { id: "definicoes", label: "Definições" },
  { id: "cartaz", label: "Cartaz e link" },
];

function lastVisit(card: LoyaltyCardRow, timeZone: string): string {
  if (!card.last_stamp_at) return "sem visitas";
  return new Intl.DateTimeFormat("pt-PT", { timeZone, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(card.last_stamp_at));
}

function CardRow({
  card,
  program,
  rewards,
  establishment,
  qrHref,
}: {
  card: LoyaltyCardRow;
  program: LoyaltyProgramRow;
  rewards: LoyaltyRewardRow[];
  establishment: EstablishmentRow;
  qrHref: string;
}) {
  const hidden = (
    <>
      <input type="hidden" name="establishment_id" value={establishment.id} />
      <input type="hidden" name="card_id" value={card.id} />
    </>
  );
  // Circles that give a reward (the milestones and the last one) are outlined in gold.
  const rewardStamps = new Set(cardRewards(program).map((item) => item.at));
  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-text">{card.name}</p>
          <p className="text-sm text-muted">
            <span className="font-mono">{formatCardCode(card.code)}</span>
            {card.email ? ` · ${card.email}` : ""}
            {card.phone ? ` · ${card.phone}` : ""}
          </p>
          <p className="text-xs text-subtle">
            Última visita: {lastVisit(card, establishment.time_zone)} · {missingText(card.stamps, program)}
          </p>
          <div aria-hidden="true" className="mt-2 flex flex-wrap gap-1">
            {Array.from({ length: program.stamps_required }, (_, index) => (
              <span
                key={index}
                className={`h-2.5 w-2.5 rounded-full ${index < card.stamps ? "bg-gold" : rewardStamps.has(index + 1) ? "border border-gold" : "bg-surface-2"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xl font-semibold tabular-nums text-text">
            {card.stamps}
            <span className="text-base text-muted">/{program.stamps_required}</span>
          </span>
          {rewards.length ? (
            <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-semibold text-gold-text">
              🎁 {rewards.length} {rewards.length === 1 ? "recompensa" : "recompensas"}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <ActionForm action={staffStamp} className="flex flex-col">
          {hidden}
          <SubmitButton size="sm" pendingLabel="A carimbar…">
            Dar carimbo
          </SubmitButton>
        </ActionForm>
        {rewards.length ? (
          <ActionForm action={staffRedeem} className="flex flex-col" confirmMessage={`Entregar «${rewards[0].label ?? program.reward}» a ${card.name}?`}>
            {hidden}
            <input type="hidden" name="reward_id" value={rewards[0].id} />
            <SubmitButton size="sm" variant="secondary">
              Entregar: {rewards[0].label ?? program.reward}
            </SubmitButton>
          </ActionForm>
        ) : null}
        <ActionForm action={staffRemoveStamp} className="flex flex-col" confirmMessage={`Retirar um carimbo a ${card.name}?`}>
          {hidden}
          <SubmitButton size="sm" variant="ghost">
            Retirar carimbo
          </SubmitButton>
        </ActionForm>
        <Link href={qrHref} scroll={false} className={buttonClasses("ghost", "sm")}>
          Mostrar QR do cartão
        </Link>
        <details className="basis-full">
          <summary className="cursor-pointer text-xs font-semibold text-muted hover:text-text">Mais: carimbos do papel, apagar cartão</summary>
          <ActionForm action={staffMigrateStamps} className="mt-2 flex flex-wrap items-end gap-2">
            {hidden}
            <label className={adminLabelClasses}>
              Carimbos no papel
              <input name="amount" type="number" min={1} max={program.stamps_required * 3} required className={`${adminInputClasses} h-10 w-28 text-sm`} />
            </label>
            <SubmitButton size="sm" variant="secondary">
              Passar
            </SubmitButton>
          </ActionForm>
          <ActionForm
            action={staffDeleteCard}
            confirmMessage={`Apagar o cartão de ${card.name} e todo o histórico? Use quando o cliente pedir para apagar os dados. Não se pode desfazer.`}
            className="mt-3"
          >
            {hidden}
            <SubmitButton size="sm" variant="ghost" className="!px-0 text-danger">
              Apagar cartão (pedido do cliente)
            </SubmitButton>
          </ActionForm>
        </details>
      </div>
    </li>
  );
}

/** The card's QR on the staff screen: a customer on a new phone scans it and has the card back. */
async function CardQr({ card, url, closeHref }: { card: LoyaltyCardRow; url: string; closeHref: string }) {
  return (
    <section aria-labelledby="qr-title" className="card flex flex-col items-center gap-4 p-5 text-center sm:flex-row sm:text-left">
      <div className="shrink-0 rounded-2xl bg-white p-2.5">
        <QrCode value={url} label={`Código QR do cartão de ${card.name}`} className="h-44 w-44" />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <h2 id="qr-title" className="text-lg font-semibold text-text">
          Cartão de {card.name}
        </h2>
        <p className="text-sm text-muted">
          Peça ao cliente para apontar a câmara do telemóvel a este código: o cartão abre com os carimbos todos. Útil quando muda de telemóvel e não deu
          email.
        </p>
        <p className="text-xs text-subtle">Mostre-o só ao próprio cliente: quem tiver este código abre o cartão.</p>
        <Link href={closeHref} scroll={false} className={buttonClasses("secondary", "sm", "self-center sm:self-start")}>
          Fechar
        </Link>
      </div>
    </section>
  );
}

function ProgramSettings({ program, establishmentId }: { program: LoyaltyProgramRow; establishmentId: string }) {
  const input = `${adminInputClasses} h-11`;
  return (
    <Panel title="Regras do cartão">
      <ActionForm resetKey={program.updated_at} action={saveProgram} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input type="hidden" name="establishment_id" value={establishmentId} />
        <label className={adminLabelClasses}>
          Carimbos para completar
          <input name="stamps_required" type="number" min={2} max={50} required defaultValue={program.stamps_required} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Recompensa ao completar o cartão
          <input name="reward" required maxLength={120} defaultValue={program.reward} className={input} />
          <span className="text-xs font-normal text-subtle">Comece por «Um» ou «Uma» (por exemplo «Uma sobremesa oferecida»): fica natural nas frases do cartão.</span>
        </label>
        <fieldset className="flex flex-col gap-2 sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-muted">Recompensas pelo caminho (opcional)</legend>
          <p className="-mt-1 text-xs text-subtle">
            Uma recompensa pequena cedo faz o cliente voltar; a grande fica no fim. Por exemplo: ao 3.º carimbo um café, ao 6.º uma sobremesa. Deixe vazio para ter só a recompensa final.
          </p>
          {Array.from({ length: maxMilestones }, (_, index) => {
            const milestone = program.milestones[index];
            return (
              <div key={index} className="flex items-center gap-2">
                <label className="flex shrink-0 items-center gap-2 text-sm text-muted">
                  Ao
                  <input
                    name={`milestone_at_${index + 1}`}
                    type="number"
                    min={2}
                    max={49}
                    defaultValue={milestone?.at ?? ""}
                    aria-label={`Recompensa pelo caminho ${index + 1}: número do carimbo`}
                    className={`${adminInputClasses} h-10 w-18 text-sm`}
                  />
                  .º carimbo
                </label>
                <input
                  name={`milestone_reward_${index + 1}`}
                  maxLength={120}
                  defaultValue={milestone?.reward ?? ""}
                  aria-label={`Recompensa pelo caminho ${index + 1}`}
                  className={`${adminInputClasses} h-10 min-w-0 flex-1 text-sm`}
                />
              </div>
            );
          })}
        </fieldset>
        <label className={adminLabelClasses}>
          Consumo mínimo para carimbar (€, opcional)
          <input name="min_spend" inputMode="decimal" maxLength={8} defaultValue={program.min_spend_cents ? (program.min_spend_cents / 100).toString().replace(".", ",") : ""} placeholder="Sem mínimo" className={input} />
          <span className="text-xs font-normal text-subtle">1 carimbo por visita a partir deste valor. Aparece no cartão do cliente e no Balcão; a equipa aplica.</span>
        </label>
        <label className={adminLabelClasses}>
          Tempo mínimo entre carimbos (minutos)
          <input name="cooldown_minutes" type="number" min={0} max={10080} required defaultValue={program.cooldown_minutes} className={input} />
          <span className="text-xs font-normal text-subtle">Antifraude: evita dois carimbos na mesma visita. 0 = sem limite.</span>
        </label>
        <label className={adminLabelClasses}>
          Validade da recompensa (dias)
          <input name="reward_valid_days" type="number" min={1} max={730} defaultValue={program.reward_valid_days ?? ""} placeholder="Sem validade" className={input} />
        </label>
        <label className="flex items-center gap-2 text-sm text-text">
          <input type="checkbox" name="welcome_stamp" defaultChecked={program.welcome_stamp} className="h-4.5 w-4.5 accent-accent" />
          Dar o primeiro carimbo na adesão
        </label>
        <label className="flex items-center gap-2 text-sm text-text">
          <input type="checkbox" name="active" defaultChecked={program.active} className="h-4.5 w-4.5 accent-accent" />
          Cartão ativo (novas adesões e carimbos)
        </label>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Texto de consentimento (opcional)
          <textarea
            name="terms"
            rows={3}
            maxLength={600}
            defaultValue={program.terms ?? ""}
            placeholder="Por omissão: «Aceito que [nome do espaço] guarde o meu nome e contacto para gerir o cartão de cliente…»"
            className={`${adminInputClasses} py-2`}
          />
        </label>
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Guardar regras</SubmitButton>
        </div>
      </ActionForm>
    </Panel>
  );
}

function StaffCodeSettings({ program, establishmentId, timeZone }: { program: LoyaltyProgramRow; establishmentId: string; timeZone: string }) {
  const input = `${adminInputClasses} h-11 tracking-[0.3em]`;
  return (
    <Panel title="PIN de carimbo">
      <p className="-mt-2 mb-4 text-sm text-muted">
        6 algarismos que só o dono e os funcionários sabem. O cliente mostra o cartão no telemóvel, o funcionário escreve o PIN e o carimbo aparece: assim o
        cliente não consegue carimbar sozinho. Serve também para entregar recompensas. Não o deixe à vista; se suspeitar que foi divulgado, mude-o aqui.
        {program.staff_code_set_at
          ? ` Definido a ${new Intl.DateTimeFormat("pt-PT", { timeZone, dateStyle: "medium", timeStyle: "short" }).format(new Date(program.staff_code_set_at))}.`
          : ""}
      </p>
      <ActionForm action={setStaffCode} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="establishment_id" value={establishmentId} />
        <label className={adminLabelClasses}>
          Novo PIN
          <input name="code" type="password" inputMode="numeric" pattern="\d{6}" maxLength={6} required autoComplete="new-password" className={input} />
        </label>
        <label className={adminLabelClasses}>
          Repetir
          <input name="confirm" type="password" inputMode="numeric" pattern="\d{6}" maxLength={6} required autoComplete="new-password" className={input} />
        </label>
        <SubmitButton size="sm">{program.staff_code_set_at ? "Mudar PIN" : "Definir PIN"}</SubmitButton>
      </ActionForm>
    </Panel>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card flex flex-col gap-1 p-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-2xl font-semibold tabular-nums text-text">{value}</span>
      <span className="text-xs text-subtle">{hint}</span>
    </div>
  );
}

export async function LoyaltyModule({ userId, viewer, basePath, query, productId }: ModuleProps) {
  const establishments = await moduleEstablishments(userId, productId);
  const current = pickEstablishment(establishments, query);
  if (!current) return <NoEstablishment productId={productId} viewer={viewer} ownerId={userId} />;
  const view = pickView(query, views);
  const program = await ensureProgram(current);
  const nav = <ModuleNav basePath={basePath} establishments={establishments} current={current} views={views} view={view} />;
  const settingsHref = `${basePath}?${new URLSearchParams({ ...(establishments.length > 1 ? { loja: current.slug } : {}), vista: "definicoes" })}`;
  const codeMissing = !program.staff_code_set_at ? (
    <p className="rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-text">
      Falta definir o <strong>PIN de carimbo</strong>: sem ele, só consegue dar carimbos aqui no painel (procurando o cliente).{" "}
      <Link href={settingsHref} className="font-semibold underline">
        Definir agora
      </Link>
    </p>
  ) : null;

  if (view === "clientes" || view === "carimbar") {
    const term = view === "carimbar" ? queryValue(query, "q").trim() : "";
    const cards = view === "clientes" ? await recentCards(current.id, 100) : term ? await searchCards(current.id, term) : await recentCards(current.id, 8);
    const rewards = await availableRewards(cards.map((card) => card.id));
    const rewardsOf = (cardId: string) => rewards.filter((reward) => reward.card_id === cardId);
    const keep = { ...(establishments.length > 1 ? { loja: current.slug } : {}), ...(view === "carimbar" ? {} : { vista: view }), ...(term ? { q: term } : {}) };
    const hrefWith = (extra: Record<string, string>) => `${basePath}?${new URLSearchParams({ ...keep, ...extra })}`;
    const qrCard = await getCard(current.id, queryValue(query, "qr"));
    const origin = await requestOrigin();
    return (
      <div className="flex flex-col gap-6">
        {nav}
        {codeMissing}
        {view === "carimbar" ? (
          <form method="get" action={basePath} className="flex gap-2" role="search">
            {establishments.length > 1 ? <input type="hidden" name="loja" value={current.slug} /> : null}
            <input
              type="search"
              name="q"
              defaultValue={term}
              aria-label="Procurar cartão"
              placeholder="Código do cartão, nome, email ou telemóvel"
              autoFocus={!term}
              className={`${adminInputClasses} h-12 flex-1`}
            />
            <button type="submit" className={buttonClasses("primary", "md")}>
              Procurar
            </button>
          </form>
        ) : null}
        {qrCard ? <CardQr card={qrCard} url={`${origin}/cartao/${current.slug}/${qrCard.token}`} closeHref={hrefWith({})} /> : null}
        {view === "carimbar" ? (
          <p className="-mt-3 text-xs text-subtle">
            {term ? `Resultados para «${term}».` : "Mais rápido: aponte a câmara deste telemóvel ou tablet ao QR do cartão do cliente e o cartão abre aqui. Em baixo, os últimos clientes com carimbo."}
          </p>
        ) : (
          <p className="-mt-3 text-sm text-muted">Os 100 cartões mais recentes, pela última visita.</p>
        )}
        {cards.length ? (
          <ul className="card divide-y divide-line">
            {cards.map((card) => (
              <CardRow key={card.id} card={card} program={program} rewards={rewardsOf(card.id)} establishment={current} qrHref={hrefWith({ qr: card.id })} />
            ))}
          </ul>
        ) : (
          <EmptyState>{term ? "Nenhum cartão encontrado." : "Ainda sem cartões. Os clientes aderem pelo QR code ou pela placa NFC ao balcão."}</EmptyState>
        )}
      </div>
    );
  }

  if (view === "estatisticas") {
    const stats = await loadLoyaltyStats(current.id);
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Cartões" value={String(stats.cards)} hint={`${stats.newCards} novos nos últimos ${stats.days} dias.`} />
          <Tile label="Carimbos" value={String(stats.stamps)} hint={`Últimos ${stats.days} dias (sem os passados do papel).`} />
          <Tile label="Clientes que voltaram" value={String(stats.returning)} hint={`Com 2 ou mais carimbos nos últimos ${stats.days} dias.`} />
          <Tile label="Recompensas" value={`${stats.rewardsRedeemed}/${stats.rewardsEarned}`} hint={`Entregues / ganhas nos últimos ${stats.days} dias.`} />
        </div>
        <p className="text-sm text-muted">
          {stats.activeCards
            ? `${stats.activeCards} clientes receberam carimbos nos últimos ${stats.days} dias.`
            : "Os números aparecem assim que os primeiros clientes usarem o cartão."}
        </p>
      </div>
    );
  }

  if (view === "definicoes") {
    const bundle = await loadBundle(current);
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <StaffCodeSettings program={program} establishmentId={current.id} timeZone={current.time_zone} />
        <ProgramSettings program={program} establishmentId={current.id} />
        <EstablishmentSettings bundle={bundle} viewer={viewer} sections={["details"]} />
      </div>
    );
  }

  const url = `${await requestOrigin()}/cartao/${current.slug}`;
  return (
    <div className="flex flex-col gap-6">
      {nav}
      {codeMissing}
      <Materials
        title="Página de adesão"
        url={url}
        hint="Os clientes aderem por este link. Imprima o cartaz para o balcão, ou peça-nos a placa NFC já programada."
        poster={{
          heading: rewardsSentence(program),
          sub: "Aponte a câmara ao código. O cartão fica no seu telemóvel, sem aplicação.",
          name: current.name,
        }}
      />
    </div>
  );
}
