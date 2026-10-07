import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { RedeemWithCodeForm, RememberCard, StampWithCodeForm } from "@/components/public/loyalty/CardForms";
import { StampCard } from "@/components/public/loyalty/StampCard";
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

export default async function LoyaltyCardPage({ params }: Props) {
  const { slug, token } = await params;
  const establishment = await publicEstablishment(slug, "loyalty");
  if (!establishment) notFound();
  const card = await getCardByToken(token);
  if (!card || card.establishment_id !== establishment.id) notFound();
  const [program, rewards, redeemed] = await Promise.all([ensureProgram(establishment), availableRewards([card.id]), recentlyRedeemed(card.id)]);
  const format = new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, day: "numeric", month: "long" });

  return (
    <BrandFrame establishment={establishment} eyebrow="Cartão de cliente">
      <RememberCard slug={establishment.slug} token={card.token} />
      <StampCard name={establishment.name} holder={card.name} stamps={card.stamps} required={program.stamps_required} reward={program.reward} code={card.code} />

      {redeemed?.redeemed_at ? (
        <p role="status" className="rounded-2xl border border-success/30 bg-success-soft px-4 py-3 text-center text-sm font-semibold text-success">
          ✓ Recompensa entregue às{" "}
          {new Intl.DateTimeFormat("pt-PT", { timeZone: establishment.time_zone, hour: "2-digit", minute: "2-digit" }).format(new Date(redeemed.redeemed_at))}: {program.reward}. Bom proveito!
        </p>
      ) : null}

      {rewards.length ? (
        <PublicCard className="border-[var(--brand)]/40">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-[0.12em] text-subtle uppercase">
              {rewards.length === 1 ? "Recompensa disponível" : `${rewards.length} recompensas disponíveis`}
            </p>
            <h2 className="display text-2xl">🎁 {program.reward}</h2>
            {rewards[0].expires_at ? <p className="text-sm text-muted">Válida até {format.format(new Date(rewards[0].expires_at))}.</p> : null}
          </div>
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-text">Usar agora (a equipa valida)</summary>
            <div className="mt-3">
              <RedeemWithCodeForm token={card.token} rewardId={rewards[0].id} reward={program.reward} />
            </div>
          </details>
        </PublicCard>
      ) : null}

      <PublicCard>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">Pedir carimbo</h2>
          <p className="text-sm text-muted">Mostre este ecrã à equipa. Quem o atender escreve o código da loja aqui.</p>
        </div>
        {program.active ? <StampWithCodeForm token={card.token} /> : <p className="text-sm text-muted">Os carimbos estão temporariamente em pausa.</p>}
        <p className="text-xs text-subtle">
          A equipa também pode procurar o cartão pelo código <strong className="font-mono">{card.code.slice(0, 3)} {card.code.slice(3)}</strong>.
        </p>
      </PublicCard>

      <details className="card p-5 text-sm text-muted">
        <summary className="cursor-pointer font-semibold text-text">Ter o cartão sempre à mão</summary>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5">
          <li>iPhone: botão Partilhar → «Adicionar ao ecrã principal».</li>
          <li>Android: menu ⋮ → «Adicionar ao ecrã principal» ou «Instalar».</li>
          <li>{card.email ? `Enviámos o link para ${card.email}: use-o se mudar de telemóvel.` : "Guarde esta página nos favoritos: é o seu cartão."}</li>
        </ul>
      </details>
    </BrandFrame>
  );
}
