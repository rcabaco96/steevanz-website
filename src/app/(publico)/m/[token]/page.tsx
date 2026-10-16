import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preconnect } from "react-dom";
import { VideoMenu } from "@/components/menu/VideoMenu";
import { publicSupabaseConfig } from "@/lib/supabase/env";
import { getTableByToken, type OrderingTable } from "@/lib/video-menus/ordering-store";
import { bunnyHost, menuReferrer } from "@/lib/video-menus/rules";
import { getPublicMenu, MenusNotReadyError } from "@/lib/video-menus/store";

// A table's menu (owner, 2026-10-16): the link on the table's plate. The same menu as /menu/<slug>
// (same dishes, same cache), plus ordering for this table when the menu has «Pedidos no menu» on.
// The token is the table's secret; an unknown one, or a menu switched off, is a 404.
export const dynamic = "force-dynamic";

async function loadTable(token: string): Promise<OrderingTable | null> {
  try {
    return await getTableByToken(token);
  } catch (error) {
    console.error("[ordering] table lookup failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

async function loadMenu(table: OrderingTable | null) {
  if (!table?.menuActive) return null;
  try {
    return await getPublicMenu(table.slug);
  } catch (error) {
    if (error instanceof MenusNotReadyError) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/m/[token]">): Promise<Metadata> {
  const table = await loadTable((await params).token);
  return { title: table ? `Menu · ${table.business} · ${table.name}` : "Menu", referrer: menuReferrer };
}

export default async function TableMenuPage({ params }: PageProps<"/m/[token]">) {
  const bunny = bunnyHost();
  if (bunny) preconnect(bunny);
  const { token } = await params;
  const table = await loadTable(token);
  const menu = await loadMenu(table);
  if (!table || !menu) notFound();
  const supabase = publicSupabaseConfig();
  return (
    <VideoMenu
      menu={menu}
      demo={table.slug === "raza17raza"}
      ordering={table.ordering ? { token, tableName: table.name, channel: table.id, realtime: supabase ? { url: supabase.url, key: supabase.anonKey } : null } : undefined}
    />
  );
}
