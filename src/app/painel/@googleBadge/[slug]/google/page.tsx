import { GoogleBadgeSlot } from "@/components/google/HeaderSlots";

/** Header slot on /painel/<slug>/google: "Google ligado ✓" (see GoogleBadgeSlot). */
export default async function Page({ params }: PageProps<"/painel/[slug]/google">) {
  return <GoogleBadgeSlot slug={(await params).slug} />;
}
