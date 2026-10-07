import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { JoinCardForm, RecoverForm } from "@/components/public/loyalty/CardForms";
import { StampCard } from "@/components/public/loyalty/StampCard";
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
    <BrandFrame establishment={establishment} eyebrow="Cartão de cliente">
      <StampCard
        name={establishment.name}
        holder="O seu nome"
        stamps={program.welcome_stamp ? 1 : 0}
        required={program.stamps_required}
        reward={program.reward}
      />
      {program.active ? (
        <PublicCard>
          <div className="flex flex-col gap-1">
            <h1 className="display text-2xl">O seu cartão no telemóvel</h1>
            <p className="text-sm text-muted">
              Sem aplicação e sem papel. A cada visita a equipa dá-lhe um carimbo; ao fim de {program.stamps_required}, ganha {program.reward.toLowerCase()}.
            </p>
          </div>
          <JoinCardForm slug={establishment.slug} terms={terms} welcomeStamp={program.welcome_stamp} />
        </PublicCard>
      ) : (
        <PublicCard>
          <p className="text-center text-sm text-muted">O cartão de cliente está temporariamente indisponível. Fale com a equipa.</p>
        </PublicCard>
      )}
      <details className="card p-5">
        <summary className="cursor-pointer text-sm font-semibold text-text">Já tinha cartão e mudou de telemóvel?</summary>
        <div className="mt-4">
          <RecoverForm slug={establishment.slug} />
        </div>
      </details>
    </BrandFrame>
  );
}
