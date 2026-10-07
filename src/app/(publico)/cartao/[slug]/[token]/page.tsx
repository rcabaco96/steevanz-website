import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { QrCode } from "@/components/modules/shared/QrCode";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { RedeemWithCodeForm, RememberCard, StampWithCodeForm } from "@/components/public/loyalty/CardForms";
import { StampCard } from "@/components/public/loyalty/StampCard";
import { requestOrigin } from "@/lib/booking/request";
import { formatCardCode, rewardInSentence } from "@/lib/modules/loyalty/rules";
import { availableRewards, ensureProgram, getCardByToken, recentlyRedeemed } from "@/lib/modules/loyalty/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string; token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, token } = await params;
  const establishment = await publicEstablishment(slug, "loyalty");
  return {
    title: establishment ? `Cartão ${establishment.name}` : "Cartão de cliente",
    referrer: "no-referrer",
    // Its own manifest, so "Add to Home Screen" opens this card (not the Steevanz home page).
    manifest: `/cartao/${slug}/${token}/manifest.webmanifest`,
    appleWebApp: { capable: true, title: establishment?.name ?? "Cartão", statusBarStyle: "default" },
  };
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="card group p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-text">
        {title}
        <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 text-sm text-muted">{children}</div>
    </details>
  );
}

export default async function LoyaltyCardPage({ params }: Props) {
  const { slug, token } = await params;
  const establishment = await publicEstablishment(slug, "loyalty");
  if (!establishment) notFound();
  const card = await getCardByToken(token);
  if (!card || card.establishment_id !== establishment.id) notFound();
  const [program, rewards, redeemed, origin] = await Promise.all([ensureProgram(establishment), availableRewards([card.id]), recentlyRedeemed(card.id), requestOrigin()]);
  const format = new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, day: "numeric", month: "long" });
  const left = program.stamps_required - card.stamps;

  return (
    <BrandFrame establishment={establishment} service="Cartão de cliente">
      <RememberCard slug={establishment.slug} token={card.token} />
      {/* A stamp given from the staff panel shows up while the customer is at the counter. */}
      <AutoRefresh intervalMs={10_000} />
      <StampCard name={establishment.name} holder={card.name} stamps={card.stamps} required={program.stamps_required} reward={program.reward} code={card.code} />
      <p className="-mt-1 text-center text-muted">
        {card.stamps === 0 ? `Junte ${program.stamps_required} carimbos para ${rewardInSentence(program.reward)}.` : `${left === 1 ? "Falta 1 carimbo" : `Faltam ${left} carimbos`} para ${rewardInSentence(program.reward)}.`}
      </p>

      {redeemed?.redeemed_at ? (
        <p role="status" className="rounded-2xl border border-success/30 bg-success-soft px-4 py-3 text-center font-semibold text-success">
          Recompensa entregue às{" "}
          {new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, hour: "2-digit", minute: "2-digit" }).format(new Date(redeemed.redeemed_at))}. Bom proveito!
        </p>
      ) : null}

      {rewards.length ? (
        <article className="ticket overflow-hidden">
          <div className="bg-[color-mix(in_oklab,var(--brand)_10%,var(--surface))] px-6 pt-5 pb-6">
            <p className="text-sm text-muted">{rewards.length === 1 ? "Tem uma recompensa à espera" : `Tem ${rewards.length} recompensas à espera`}</p>
            <p className="display mt-1 text-[1.9rem] leading-tight">{program.reward}</p>
            {rewards[0].expires_at ? <p className="mt-1 text-sm text-muted">Válida até {format.format(new Date(rewards[0].expires_at))}.</p> : null}
          </div>
          <div className="ticket-tear" />
          <div className="flex flex-col gap-3 px-6 pt-5 pb-6">
            <p className="text-sm text-muted">Na altura de usar, mostre este ecrã ao balcão: o funcionário escreve aqui o PIN de carimbo.</p>
            <RedeemWithCodeForm token={card.token} rewardId={rewards[0].id} reward={program.reward} />
          </div>
        </article>
      ) : null}

      <PublicCard>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">Pedir carimbo</h2>
          <p className="text-muted">Mostre este ecrã ao balcão. O carimbo aparece no cartão em segundos.</p>
        </div>
        {program.active ? (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-2xl bg-white p-2.5">
                <QrCode value={`${origin}/conta/carimbar?${new URLSearchParams({ espaco: establishment.slug, cartao: card.code })}`} label="Código QR para o funcionário carimbar" className="h-40 w-40" />
              </div>
              <p className="text-sm text-muted">O funcionário lê este código com o telemóvel ou tablet do estabelecimento.</p>
            </div>
            <p className="flex items-center gap-3 text-sm text-subtle before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">ou</p>
            <StampWithCodeForm token={card.token} />
          </>
        ) : (
          <p className="text-muted">Os carimbos estão em pausa de momento.</p>
        )}
        <p className="text-sm text-subtle">
          O funcionário também encontra o cartão pelo código <strong className="font-semibold text-muted">{formatCardCode(card.code)}</strong>.
        </p>
      </PublicCard>

      <Disclosure title="Ter o cartão sempre à mão">
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>No iPhone: botão Partilhar, depois «Adicionar ao ecrã principal».</li>
          <li>No Android: menu ⋮, depois «Adicionar ao ecrã principal».</li>
          <li>{card.email ? `Enviámos o link para ${card.email}: use-o se mudar de telemóvel.` : "Guarde esta página nos favoritos: é o seu cartão. Se mudar de telemóvel, peça ao balcão para lhe mostrar o código QR do seu cartão."}</li>
        </ul>
      </Disclosure>
    </BrandFrame>
  );
}
