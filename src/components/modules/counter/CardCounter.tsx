import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ActionForm } from "@/components/backoffice/ActionForm";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { staffRedeem, staffRemoveStamp, staffStamp } from "@/lib/modules/loyalty/actions";
import { formatCardCode } from "@/lib/modules/loyalty/rules";
import type { LoyaltyCardRow, LoyaltyProgramRow, LoyaltyRewardRow } from "@/lib/modules/loyalty/store";
import { QrCode } from "../shared/QrCode";
import { CounterSubmit } from "./CounterSubmit";

function Stamps({ stamps, required, large = false }: { stamps: number; required: number; large?: boolean }) {
  return (
    <div
      aria-label={`${stamps} de ${required} carimbos`}
      role="img"
      className={large ? "grid max-w-md gap-1.5" : "flex flex-wrap gap-1"}
      style={large ? { gridTemplateColumns: `repeat(${Math.min(required, 10)}, minmax(0, 1fr))` } : undefined}
    >
      {Array.from({ length: required }, (_, index) => {
        const filled = index < stamps;
        const last = index === required - 1;
        return (
          <span
            key={index}
            className={`rounded-full ${large ? "aspect-square w-full" : "h-2.5 w-2.5"} ${
              filled ? "bg-[var(--brand)]" : last ? "border-2 border-dashed border-gold" : "bg-surface-2 ring-1 ring-line ring-inset"
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
    <div className="flex flex-col gap-2">
      <div className={`grid gap-2 ${rewards.length ? "sm:grid-cols-2" : ""}`}>
        <ActionForm action={staffStamp} className="flex flex-col">
          {hidden}
          <CounterSubmit size="xl" pendingLabel="A carimbar…">
            Dar carimbo
          </CounterSubmit>
        </ActionForm>
        {rewards.length ? (
          <ActionForm action={staffRedeem} className="flex flex-col" confirmMessage={`Entregar «${program.reward}» a ${card.name}?`}>
            {hidden}
            <input type="hidden" name="reward_id" value={rewards[0].id} />
            <CounterSubmit size="xl" tone="gold">
              Entregar recompensa
            </CounterSubmit>
          </ActionForm>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        <ActionForm action={staffRemoveStamp} confirmMessage={`Retirar um carimbo a ${card.name}?`} className="flex flex-col items-center">
          {hidden}
          <CounterSubmit size="sm" tone="quiet">
            Retirar um carimbo
          </CounterSubmit>
        </ActionForm>
        <Link href={qrHref} scroll={false} className="inline-flex h-9 items-center rounded-xl px-3 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text">
          Mostrar QR do cartão
        </Link>
      </div>
    </div>
  );
}

/**
 * The loyalty card at the counter: find the customer (or scan their card's QR with this device's
 * camera, which lands here), then one big "Dar carimbo". A single result opens as the big card.
 */
export function CardCounter({
  establishment,
  program,
  cards,
  rewards,
  term,
  basePath,
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
  qrCard: LoyaltyCardRow | null;
  qrUrl: string | null;
  settingsHref: string;
}) {
  const rewardsOf = (cardId: string) => rewards.filter((reward) => reward.card_id === cardId);
  const hrefWith = (extra: Record<string, string>) => `${basePath}?${new URLSearchParams({ vista: "cartao", ...(term ? { q: term } : {}), ...extra })}`;
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
        <input type="hidden" name="vista" value="cartao" />
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={term}
            aria-label="Procurar cartão"
            placeholder="Procurar cliente"
            autoComplete="off"
            className="h-14 min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 text-lg text-text placeholder:text-subtle focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_oklab,var(--brand)_18%,transparent)]"
          />
          <button
            type="submit"
            className="h-14 shrink-0 rounded-2xl bg-surface-inverse px-5 text-base font-semibold text-inverse transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Procurar
          </button>
        </div>
        <p className="px-1 text-xs text-subtle">
          Pelo nome, telemóvel ou código do cartão. Mais rápido: aponte a câmara deste aparelho ao QR do cartão do cliente e o cartão abre aqui.
          {term ? (
            <>
              {" "}
              <Link href={`${basePath}?vista=cartao`} className="font-semibold text-muted underline hover:text-text">
                Limpar
              </Link>
            </>
          ) : null}
        </p>
      </form>

      {qrCard && qrUrl ? (
        <section aria-labelledby="qr-title" className="flex flex-col items-center gap-4 rounded-[2rem] border border-line bg-surface p-6 text-center">
          <div className="rounded-2xl bg-white p-3">
            <QrCode value={qrUrl} label={`Código QR do cartão de ${qrCard.name}`} className="h-52 w-52" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 id="qr-title" className="text-lg font-semibold text-text">
              Cartão de {qrCard.name}
            </h2>
            <p className="max-w-sm text-sm text-muted">O cliente aponta a câmara do telemóvel a este código e o cartão abre com os carimbos todos. Mostre-o só ao próprio.</p>
          </div>
          <Link href={hrefWith({})} scroll={false} className="inline-flex h-11 items-center rounded-2xl border border-line-strong px-5 text-sm font-semibold text-text hover:bg-surface-2">
            Fechar
          </Link>
        </section>
      ) : null}

      {focus ? (
        <section aria-label={`Cartão de ${focus.name}`} className="flex flex-col gap-5 rounded-[2rem] border border-line bg-surface p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-2xl font-semibold text-text">{focus.name}</p>
              <p className="text-sm text-muted">
                <span className="font-mono">{formatCardCode(focus.code)}</span>
                {focus.phone ? ` · ${focus.phone}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-right">
              <span className="display text-5xl leading-none tabular-nums">{focus.stamps}</span>
              <span className="display text-2xl text-muted">/{program.stamps_required}</span>
            </p>
          </div>
          <Stamps stamps={focus.stamps} required={program.stamps_required} large />
          {rewardsOf(focus.id).length ? (
            <p className="rounded-2xl bg-gold-soft px-4 py-3 text-sm font-semibold text-gold-text">
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
        <section aria-labelledby="cartoes-title" className="flex flex-col gap-2">
          <h2 id="cartoes-title" className="px-1 text-sm font-semibold text-muted">
            {term ? `${list.length} cartões para «${term}»` : "Últimos clientes com carimbo"}
          </h2>
          <ul className="flex flex-col gap-2">
            {list.map((card) => {
              const cardRewards = rewardsOf(card.id).length;
              return (
                <li key={card.id}>
                  <Link href={`${basePath}?${new URLSearchParams({ vista: "cartao", q: card.code })}`} className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-3 pr-2 transition-colors hover:border-line-strong">
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
                  <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-muted">
                    <ArrowRight size={18} />
                  </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : term && !focus ? (
        <p className="rounded-3xl border border-dashed border-line-strong px-5 py-8 text-center text-muted">Nenhum cartão encontrado para «{term}».</p>
      ) : !term && !cards.length ? (
        <p className="rounded-3xl border border-dashed border-line-strong px-5 py-8 text-center text-muted">Ainda sem cartões. Os clientes aderem pelo QR code ao balcão.</p>
      ) : null}
    </div>
  );
}
