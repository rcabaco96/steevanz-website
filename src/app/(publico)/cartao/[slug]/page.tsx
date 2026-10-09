import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { JoinCardForm, RecoverForm } from "@/components/public/loyalty/CardForms";
import { StampCard } from "@/components/public/loyalty/StampCard";
import { cardRewards, nextReward, rewardsSentence, stampRuleText } from "@/lib/modules/loyalty/rules";
import { ensureProgram } from "@/lib/modules/loyalty/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const establishment = await publicEstablishment((await params).slug, "loyalty");
  return { title: establishment ? `Cartão de cliente · ${establishment.name}` : "Cartão de cliente" };
}

export default async function LoyaltyJoinPage({ params }: Props) {
  const { slug } = await params;
  const establishment = await publicEstablishment(slug, "loyalty");
  if (!establishment) notFound();
  const program = await ensureProgram(establishment);
  const terms =
    program.terms ??
    `Aceito que ${establishment.name} guarde o meu nome e contacto para gerir o cartão de cliente. Posso pedir para apagar os dados a qualquer momento.`;

  return (
    <BrandFrame establishment={establishment} service="Cartão de cliente">
      <div className="flex flex-col gap-2">
        <h2 className="display text-[1.9rem] leading-tight text-balance">{rewardsSentence(program)}</h2>
        <p className="text-muted">
          {stampRuleText(program.min_spend_cents)}. O cartão fica no seu telemóvel: sem aplicação, sem papel para perder.
        </p>
      </div>
      <StampCard
        name={establishment.name}
        holder="O seu nome"
        stamps={program.welcome_stamp ? 1 : 0}
        required={program.stamps_required}
        reward={nextReward(program.welcome_stamp ? 1 : 0, program).reward}
        rewardAt={cardRewards(program).map((item) => item.at)}
      />
      {program.active ? (
        <PublicCard>
          <h2 className="text-lg font-semibold text-text">{program.welcome_stamp ? "Crie o cartão e ganhe já o primeiro carimbo" : "Crie o seu cartão"}</h2>
          <JoinCardForm slug={establishment.slug} terms={terms} welcomeStamp={program.welcome_stamp} />
        </PublicCard>
      ) : (
        <PublicCard>
          <p className="text-center text-muted">O cartão de cliente está em pausa. Fale com a equipa.</p>
        </PublicCard>
      )}
      <details className="card group p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-text">
          Já tinha cartão e mudou de telemóvel?
          <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="mt-4">
          <RecoverForm slug={establishment.slug} />
        </div>
      </details>
    </BrandFrame>
  );
}
