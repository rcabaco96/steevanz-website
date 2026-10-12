import { createServiceClient } from "@/lib/supabase/service";
import { isProspectStatus, opportunities, type Opportunity, type ProspectFields, type ProspectStatus } from "./rules";

export interface ProspectSearchRow {
  id: string;
  query: string;
  area: string;
  max_results: number;
  status: "queued" | "running" | "done" | "failed";
  error: string | null;
  results: number | null;
  new_results: number | null;
  requested_by: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface ProspectRow extends ProspectFields {
  status: ProspectStatus;
  notes: string | null;
  first_search_id: string | null;
  last_search_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProspectFilters {
  /** A search's id, "all" for every business, or "" for the latest search. */
  search: string;
  status: ProspectStatus | "";
  opportunity: Opportunity | "";
  contact: "" | "phone" | "email";
  /** Reviews on Google: "lt20", "lt50", "lt100", "gte100". */
  reviews: "" | "lt20" | "lt50" | "lt100" | "gte100";
  /** Google rating: "lt40", "lt45", "gte45". */
  rating: "" | "lt40" | "lt45" | "gte45";
  sort: "best" | "fewest" | "most" | "lowest";
  q: string;
}

export const reviewFilterLabels: Record<Exclude<ProspectFilters["reviews"], "">, string> = { lt20: "menos de 20", lt50: "menos de 50", lt100: "menos de 100", gte100: "100 ou mais" };
export const ratingFilterLabels: Record<Exclude<ProspectFilters["rating"], "">, string> = { lt40: "abaixo de 4,0", lt45: "abaixo de 4,5", gte45: "4,5 ou mais" };
export const sortLabels: Record<ProspectFilters["sort"], string> = { best: "mais oportunidades", fewest: "menos reviews", most: "mais reviews", lowest: "nota mais baixa" };

export function parseProspectFilters(params: Record<string, string | string[] | undefined>): ProspectFilters {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  };
  const status = one("estado");
  const opportunity = one("oportunidade");
  const contact = one("contacto");
  const reviews = one("reviews");
  const rating = one("nota");
  const sort = one("ordem");
  return {
    reviews: reviews in reviewFilterLabels ? (reviews as ProspectFilters["reviews"]) : "",
    rating: rating in ratingFilterLabels ? (rating as ProspectFilters["rating"]) : "",
    sort: sort in sortLabels ? (sort as ProspectFilters["sort"]) : "best",
    search: one("pesquisa") === "todas" ? "all" : /^[0-9a-f-]{36}$/.test(one("pesquisa")) ? one("pesquisa") : "",
    status: isProspectStatus(status) ? status : "",
    opportunity: opportunity === "site" || opportunity === "modules" ? opportunity : "",
    contact: contact === "phone" || contact === "email" ? contact : "",
    q: one("q").slice(0, 80),
  };
}

export async function listSearches(limit = 20): Promise<ProspectSearchRow[]> {
  const { data, error } = await createServiceClient().from("prospect_searches").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(`listSearches: ${error.message}`);
  return (data ?? []) as ProspectSearchRow[];
}

/** Prospects matching the filters, best opportunities first (most reasons to call, then fewer reviews). */
export async function listProspects(filters: ProspectFilters, limit = 300): Promise<ProspectRow[]> {
  const bySearch = filters.search && filters.search !== "all";
  let query = createServiceClient()
    .from("prospects")
    .select(bySearch ? "*, prospect_search_hits!inner(search_id)" : "*")
    .order("updated_at", { ascending: false })
    .limit(2000);
  if (bySearch) query = query.eq("prospect_search_hits.search_id", filters.search);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.contact === "phone") query = query.not("phone", "is", null);
  if (filters.contact === "email") query = query.not("email", "is", null);
  if (filters.reviews === "lt20") query = query.lt("reviews", 20);
  if (filters.reviews === "lt50") query = query.lt("reviews", 50);
  if (filters.reviews === "lt100") query = query.lt("reviews", 100);
  if (filters.reviews === "gte100") query = query.gte("reviews", 100);
  if (filters.rating === "lt40") query = query.lt("rating", 4);
  if (filters.rating === "lt45") query = query.lt("rating", 4.5);
  if (filters.rating === "gte45") query = query.gte("rating", 4.5);
  const term = filters.q.replace(/[%,()*]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,address.ilike.%${term}%,category.ilike.%${term}%`);
  const { data, error } = await query;
  if (error) throw new Error(`listProspects: ${error.message}`);
  return ((data ?? []) as unknown as ProspectRow[])
    .filter((row) => !filters.opportunity || opportunities(row).includes(filters.opportunity))
    .sort((a, b) => {
      if (filters.sort === "fewest") return (a.reviews ?? 0) - (b.reviews ?? 0);
      if (filters.sort === "most") return (b.reviews ?? 0) - (a.reviews ?? 0);
      if (filters.sort === "lowest") return (a.rating ?? 6) - (b.rating ?? 6);
      return opportunities(b).length - opportunities(a).length || (a.reviews ?? 0) - (b.reviews ?? 0);
    })
    .slice(0, limit);
}

/** Google places that are already our customers (reviews product), so the list can say so. */
export async function customerPlaceIds(): Promise<Set<string>> {
  const { data, error } = await createServiceClient().from("review_businesses").select("place_id, google_place_id").limit(5000);
  if (error) throw new Error(`customerPlaceIds: ${error.message}`);
  return new Set(((data ?? []) as { place_id: string | null; google_place_id: string | null }[]).flatMap((row) => [row.place_id, row.google_place_id]).filter((id): id is string => Boolean(id)));
}
