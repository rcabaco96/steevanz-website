import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CounterScreen } from "@/components/modules/counter/CounterScreen";
import { counterAccess } from "@/lib/establishments/counter";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: "Balcão" };

export default async function CounterPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const access = await counterAccess(slug);
  if (access.state === "anonymous") redirect(`/conta/entrar?${new URLSearchParams({ next: `/conta/balcao/${slug}` })}`);
  if (access.state === "denied") notFound();
  return <CounterScreen establishment={access.establishment} products={access.products} viewer={access.viewer} query={query} now={access.now} />;
}
