import { GoogleBadgeSlot } from "@/components/google/HeaderSlots";

/** Header slot on /painel/<slug>/respostas: "Google ligado ✓" (see GoogleBadgeSlot). */
export default async function Page({ params }: PageProps<"/painel/[slug]/respostas">) {
  return <GoogleBadgeSlot slug={(await params).slug} />;
}
