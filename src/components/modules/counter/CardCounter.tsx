import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, Panel, adminInputClasses } from "@/components/backoffice/ui";
import { ArrowRight } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { staffRedeem, staffRemoveStamp, staffStamp } from "@/lib/modules/loyalty/actions";
import { formatCardCode } from "@/lib/modules/loyalty/rules";
import type { LoyaltyCardRow, LoyaltyProgramRow, LoyaltyRewardRow } from "@/lib/modules/loyalty/store";
import { QrCode } from "../shared/QrCode";

function Stamps({ stamps, required, large = false }: { stamps: number; required: number; large?: boolean }) {
  return (
    <div
      aria-label={`${stamps} de ${required} carimbos`}
      role="img"
      className={`flex flex-wrap ${large ? "gap-1.5" : "gap-1"}`}
    >
      {Array.from({ length: required }, (_, index) => {
        const filled = index < stamps;
        const last = index === required - 1;
        return (
          <span
            key={index}
            className={`rounded-full ${large ? "h-5 w-5" : "h-2.5 w-2.5"} ${
              filled ? "bg-accent" : last ? "border-2 border-dashed border-gold" : "bg-surface-2 ring-1 ring-line ring-inset"
            }`}
          />
        );
      })}
    </div>
  );
}

function CardActions({ card, establishment, rewards, program, qrHref }: { card: LoyaltyCardRow; establishment: EstablishmentRow; rewards: LoyaltyRewardRow[]; program: LoyaltyProgramRow; qrHref: string }) {
  const hidden = (
    <>
      <input type="hidden" name="establishment_id" value={establishment.id} />
      <input type="hidden" name="card_id" value={card.id} />
    </>
  );
  return (
    <div className="flex flex-wrap items-start gap-2 border-t border-line pt-4">
      <ActionForm action={staffStamp} className="flex flex-col">
        {hidden}
        <SubmitButton size="md" pendingLabel="A carimbar…">
          Dar carimbo
        </SubmitButton>
      </ActionForm>
      {rewards.length ? (
        <ActionForm action={staffRedeem} className="flex flex-col" confirmMessage={`Entregar «${program.reward}» a ${card.name}?`}>
          {hidden}
          <input type="hidden" name="reward_id" value={rewards[0].id} />
          <SubmitButton size="md" variant="secondary">
            Entregar recompensa
          </SubmitButton>
        </ActionForm>
      ) : null}
      <ActionForm action={staffRemoveStamp} confirmMessage={`Retirar um carimbo a ${card.name}?`} className="flex flex-col">
        {hidden}
        <SubmitButton size="md" variant="ghost">
          Retirar um carimbo
        </SubmitButton>
      </ActionForm>
      <Link href={qrHref} scroll={false} className={buttonClasses("ghost", "md")}>
        Mostrar QR do cartão
      </Link>
    </div>
  );
}

/**
 * The loyalty card for the team (the Balcão): find the customer (or scan their card's QR with this
 * device's camera, which lands here), then "Dar carimbo". A single result opens the card.
 */
export function CardCounter({
  establishment,
  program,
  cards,
  rewards,
  term,
  basePath,
  keep,
  qrCard,
  qrUrl,
  settingsHref,
}: {
  establishment: EstablishmentRow;
  program: LoyaltyProgramRow;
  cards: LoyaltyCardRow[];
  rewards: LoyaltyRewardRow[];
  term: string;
  basePath: string;
  /** Query kept on every link (the space and the tab). */
  keep: Record<string, string>;
  qrCard: LoyaltyCardRow | null;
  qrUrl: string | null;
  settingsHref: string;
}) {
  const rewardsOf = (cardId: string) => rewards.filter((reward) => reward.card_id === cardId);
  const hrefWith = (extra: Record<string, string>) => `${basePath}?${new URLSearchParams({ ...keep, ...(term ? { q: term } : {}), ...extra })}`;
  const focus = term && cards.length === 1 ? cards[0] : null;
  const list = focus ? [] : cards;

  return (
    <div className="flex flex-col gap-5">
      {!program.active ? (
        <p className="rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-text">
          O cartão está em pausa: não dá para dar carimbos.{" "}
          <Link href={settingsHref} className="font-semibold underline">
            Ativar
          </Link>
        </p>
      ) : null}

      <form method="get" action={basePath} role="search" className="flex flex-col gap-2">
        {Object.entries(keep).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={term}
            aria-label="Procurar cartão"
            placeholder="Procurar cliente"
            autoComplete="off"
            className={`${adminInputClasses} h-11 min-w-0 flex-1`}
          />
          <button type="submit" className={buttonClasses("secondary", "md", "shrink-0")}>
            Procurar
          </button>
        </div>
        <p className="text-xs text-subtle">
          Pelo nome, telemóvel ou código do cartão. Mais rápido: aponte a câmara deste aparelho ao QR do cartão do cliente e o cartão abre aqui.
          {term ? (
            <>
              {" "}
              <Link href={`${basePath}?${new URLSearchParams(keep)}`} className="font-semibold text-muted underline hover:text-text">
                Limpar
              </Link>
            </>
          ) : null}
        </p>
      </form>

      {qrCard && qrUrl ? (
        <section aria-labelledby="qr-title" className="card flex flex-col items-center gap-4 p-6 text-center">
          <div className="rounded-2xl bg-white p-3">
            <QrCode value={qrUrl} label={`Código QR do cartão de ${qrCard.name}`} className="h-52 w-52" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 id="qr-title" className="text-lg font-semibold text-text">
              Cartão de {qrCard.name}
            </h2>
            <p className="max-w-sm text-sm text-muted">O cliente aponta a câmara do telemóvel a este código e o cartão abre com os carimbos todos. Mostre-o só ao próprio.</p>
          </div>
          <Link href={hrefWith({})} scroll={false} className={buttonClasses("secondary", "sm")}>
            Fechar
          </Link>
        </section>
      ) : null}

      {focus ? (
        <section aria-label={`Cartão de ${focus.name}`} className="card flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-text">{focus.name}</p>
              <p className="text-sm text-muted">
                <span className="font-mono">{formatCardCode(focus.code)}</span>
                {focus.phone ? ` · ${focus.phone}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-right">
              <span className="text-2xl font-semibold tabular-nums text-text">{focus.stamps}</span>
              <span className="text-base text-muted">/{program.stamps_required}</span>
            </p>
          </div>
          <Stamps stamps={focus.stamps} required={program.stamps_required} large />
          {rewardsOf(focus.id).length ? (
            <p className="rounded-xl bg-gold-soft px-3 py-2 text-sm font-semibold text-gold-text">
              Tem {rewardsOf(focus.id).length === 1 ? "uma recompensa" : `${rewardsOf(focus.id).length} recompensas`} por usar: {program.reward}.
            </p>
          ) : (
            <p className="text-sm text-muted">
              {program.stamps_required - focus.stamps === 1 ? "Falta 1 carimbo" : `Faltam ${Math.max(0, program.stamps_required - focus.stamps)} carimbos`} para: {program.reward}.
            </p>
          )}
          <CardActions card={focus} establishment={establishment} rewards={rewardsOf(focus.id)} program={program} qrHref={hrefWith({ qr: focus.id })} />
        </section>
      ) : null}

      {list.length ? (
        <Panel title={term ? `${list.length} cartões para «${term}»` : "Últimos clientes com carimbo"}>
          <ul className="-my-3 divide-y divide-line">
            {list.map((card) => {
              const cardRewards = rewardsOf(card.id).length;
              return (
                <li key={card.id}>
                  <Link href={`${basePath}?${new URLSearchParams({ ...keep, q: card.code })}`} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface-2">
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5 px-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold text-text">{card.name}</span>
                      {cardRewards ? <span className="shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-gold-text">Recompensa</span> : null}
                    </span>
                    <span className="flex items-center gap-2">
                      <Stamps stamps={card.stamps} required={program.stamps_required} />
                      <span className="text-xs tabular-nums text-muted">
                        {card.stamps}/{program.stamps_required}
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-muted">
                    <ArrowRight size={18} />
                  </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : term && !focus ? (
        <EmptyState>Nenhum cartão encontrado para «{term}».</EmptyState>
      ) : !term && !cards.length ? (
        <EmptyState>Ainda sem cartões. Os clientes aderem pelo QR code ao balcão.</EmptyState>
      ) : null}
    </div>
  );
}
