import { GoogleBadgeSlot } from "@/components/google/HeaderSlots";

/** Header slot on /painel/<slug>: "Google ligado ✓" (see GoogleBadgeSlot). */
export default async function Page({ params }: PageProps<"/painel/[slug]">) {
  return <GoogleBadgeSlot slug={(await params).slug} />;
}
