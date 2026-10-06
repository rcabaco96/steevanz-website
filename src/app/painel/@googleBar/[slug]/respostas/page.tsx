import { GoogleBarSlot } from "@/components/google/HeaderSlots";

/** Header slot on /painel/<slug>/respostas: the "connect Google" bar (see GoogleBarSlot). */
export default async function Page({ params }: PageProps<"/painel/[slug]/respostas">) {
  return <GoogleBarSlot slug={(await params).slug} />;
}
