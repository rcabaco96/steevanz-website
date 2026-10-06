/**
 * Competitor search with DataForSEO (replaces Apify, ~1 cent instead of ~1 $ per customer): the
 * customer's own Google profile (my_business_info, live: $0.0054) gives its place, category and
 * coordinates; one Google Maps search of that category around it (serp maps, live: $0.002, 100
 * places) gives the candidates with rating, total and star distribution, so the competition table
 * has numbers right away. Live endpoints: it runs once per customer, while someone waits.
 */
import type { ApifyPlaceItem } from "../reviews/apify.ts";
import { googleMapsPlaceUrl } from "../reviews/competitors.ts";
import { dataForSeo, dfsCodes, dfsPaths, DataForSeoError, dfsErrorKind, type DfsTransport } from "./client.ts";
import { dfsDistribution, type DfsMapsItem, type DfsMapsResult } from "./rules.ts";

/** Zoom of the Maps search: at 12z Google shows places across ~10 km around the point. */
export const discoverZoom = 12;
export const discoverDepth = 100;

interface DfsBusinessInfoResult {
  items?: DfsMapsItem[] | null;
}

const text = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null);

function openingStatus(item: DfsMapsItem): string {
  const hours = (item.work_hours ?? (item.work_time as { work_hours?: unknown } | undefined)?.work_hours) as { current_status?: unknown } | undefined;
  return typeof hours?.current_status === "string" ? hours.current_status.toLowerCase() : "";
}

/** A DataForSEO place in the shape the competitor selection and snapshots already use. */
export function placeFromMapsItem(item: DfsMapsItem, searchString: string | null = null): ApifyPlaceItem | null {
  const placeId = text(item.place_id);
  if (!placeId) return null;
  const lat = item.latitude;
  const lng = item.longitude;
  const votes = item.rating?.votes_count;
  const score = item.rating?.value;
  const status = openingStatus(item);
  return {
    placeId,
    title: text(item.title),
    categoryName: text(item.category),
    address: text(item.address),
    url: googleMapsPlaceUrl(placeId),
    totalScore: typeof score === "number" && Number.isFinite(score) ? Math.round(score * 10) / 10 : null,
    reviewsCount: typeof votes === "number" && Number.isFinite(votes) ? Math.round(votes) : 0,
    reviewsDistribution: dfsDistribution(item.rating_distribution),
    location: typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
    permanentlyClosed: /forever|permanent/.test(status),
    temporarilyClosed: /temporar/.test(status),
    searchString,
  };
}

function firstTask<R>(response: { tasks?: { status_code: number; status_message?: string; result?: R[] | null }[] | null }, what: string) {
  const task = response.tasks?.[0];
  if (!task) throw new DataForSeoError("server", `${what}: missing task`, 0);
  if (task.status_code === dfsCodes.noResults) return [];
  if (task.status_code !== dfsCodes.ok) throw new DataForSeoError(dfsErrorKind(task.status_code), `${what} ${task.status_code} ${task.status_message ?? ""}`.trim(), task.status_code);
  return task.result ?? [];
}

/** The customer's own Google profile, by place_id or cid. Null when Google has no such place. */
export async function fetchOwnPlace(target: { placeId?: string | null; cid?: string | null }, dfs: DfsTransport = dataForSeo): Promise<ApifyPlaceItem | null> {
  const keyword = target.placeId ? `place_id:${target.placeId}` : target.cid ? `cid:${target.cid}` : null;
  if (!keyword) return null;
  const response = await dfs.post<DfsBusinessInfoResult>(dfsPaths.businessInfoLive, [{ keyword, location_name: "Portugal", language_code: "pt" }]);
  const item = firstTask(response, "my_business_info")[0]?.items?.[0];
  return item ? placeFromMapsItem(item) : null;
}

/** Places Google Maps shows for `keyword` around a point (businesses only, in Google's order). */
export async function searchZone(keyword: string, lat: number, lng: number, dfs: DfsTransport = dataForSeo): Promise<ApifyPlaceItem[]> {
  const coordinate = (value: number) => String(Math.round(value * 1e7) / 1e7);
  const response = await dfs.post<DfsMapsResult>(dfsPaths.mapsLive, [
    { keyword, location_coordinate: `${coordinate(lat)},${coordinate(lng)},${discoverZoom}z`, language_code: "pt", depth: discoverDepth },
  ]);
  return firstTask(response, "maps live")
    .flatMap((result) => result?.items ?? [])
    .filter((item) => item?.type === "maps_search")
    .flatMap((item) => placeFromMapsItem(item, keyword) ?? []);
}
