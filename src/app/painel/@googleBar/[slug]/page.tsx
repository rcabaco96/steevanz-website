import { GoogleBarSlot } from "@/components/google/HeaderSlots";

/** Header slot on /painel/<slug>: the "connect Google" bar (see GoogleBarSlot). */
export default async function Page({ params }: PageProps<"/painel/[slug]">) {
  return <GoogleBarSlot slug={(await params).slug} />;
}
