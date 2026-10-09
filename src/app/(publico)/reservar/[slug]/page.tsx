import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingWizard } from "@/components/public/bookings/BookingWizard";
import { BrandFrame, PublicCard } from "@/components/public/BrandFrame";
import { kindWords } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { bookingChangeState, ensureBookingPage, formatBookingWhen, getBookingByToken, serviceStaff, toleranceText } from "@/lib/modules/bookings/store";
import { publicEstablishment } from "@/lib/modules/public";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const establishment = await publicEstablishment((await params).slug, "bookings");
  return { title: establishment ? `${kindWords[establishment.kind].bookingTitle} · ${establishment.name}` : "Reservar" };
}

const price = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

export default async function BookingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const establishment = await publicEstablishment(slug, "bookings");
  if (!establishment) notFound();
  const [bundle, page] = await Promise.all([loadBundle(establishment), ensureBookingPage(establishment)]);
  const words = kindWords[establishment.kind];

  // Changing an existing booking: start from its choices; the old one is cancelled when the new one is taken.
  const replacing = first(query.alterar) ? await getBookingByToken(first(query.alterar)) : null;
  const canReplace = replacing && replacing.establishment_id === establishment.id && bookingChangeState(replacing, page).changeable;

  const services = bundle.services.filter((item) => item.active);
  const staff = bundle.staff.filter((item) => item.active);
  const unavailable = !page.active || !services.length || !bundle.hours.length;

  return (
    <BrandFrame establishment={establishment} service={words.bookingTitle}>
      {unavailable ? (
        <PublicCard>
          <p className="text-center text-sm text-muted">
            As reservas online estão fechadas de momento.{establishment.phone ? ` Ligue-nos para o ${establishment.phone}.` : " Contacte-nos diretamente."}
          </p>
        </PublicCard>
      ) : (
        <>
          {canReplace && replacing ? (
            <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-text">
              A alterar a reserva de <strong>{formatBookingWhen(replacing.starts_at, establishment.time_zone)}</strong>. Escolha a nova hora; a anterior é cancelada
              quando confirmar.
            </p>
          ) : null}
          <BookingWizard
            slug={establishment.slug}
            who={kindWords[establishment.kind].who}
            services={services.map((item) => ({
              id: item.id,
              name: item.name,
              minutes: item.duration_minutes,
              price: item.price_cents === null ? null : price.format(item.price_cents / 100),
              kind: item.booking_kind,
              maxParty: item.max_party,
              staff: item.booking_kind === "one" ? serviceStaff(bundle, item) : [],
            }))}
            staff={staff.map((item) => ({ id: item.id, name: item.name }))}
            replaceToken={canReplace && replacing ? replacing.token : null}
            initial={{
              service: canReplace ? (replacing?.service_id ?? null) : first(query.servico) || null,
              staff: canReplace ? (replacing?.staff_id ?? null) : first(query.profissional) || null,
              party: (canReplace ? replacing?.party_size : Number(first(query.pessoas))) || 2,
            }}
            policy={[toleranceText(page), page.policy].filter(Boolean).join(" ") || null}
          />
        </>
      )}
    </BrandFrame>
  );
}
