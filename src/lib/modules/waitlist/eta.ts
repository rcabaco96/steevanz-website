// Waiting time estimate for the digital waitlist. Pure module: also used by the tests.
//
// - "Turn" queues (restaurants, counters): people ahead × minutes between calls. The configured
//   average is blended with the pace the team actually called people over the last 90 minutes
//   (once there are at least 3 calls), so the estimate follows the real rhythm of the day.
// - Service queues (barbers, clinics): the people ahead are handed out in order, each to their own
//   professional or, for "anyone", to whoever is free first; the wait is when this person's
//   professional (or the first one free) gets to them. Free professionals mean no wait.
// The result is rounded up to 5 minutes and always shown as an estimate.

export interface EtaEntry {
  /** Duration of the chosen service, when the queue asks for one. */
  serviceMinutes: number | null;
  /** Specific professional asked for, or null for "anyone". */
  staffId: string | null;
}

export interface EtaInput {
  /** People ahead, in queue order. */
  ahead: EtaEntry[];
  /** Who is asking (their own professional matters in service queues). */
  self?: EtaEntry;
  avgMinutes: number;
  /** Professionals working (service queues). */
  activeStaff: number;
  /** Their ids, so people waiting for one of them go to that one (service queues). */
  staffIds?: string[];
  /** When the last people were called (any order). */
  recentCalls: number[];
  now: number;
}

const paceWindowMs = 90 * 60_000;
const minCallsForPace = 3;

export function observedPace(recentCalls: number[], now: number): number | null {
  const calls = recentCalls.filter((at) => now - at <= paceWindowMs && at <= now).sort((a, b) => a - b);
  if (calls.length < minCallsForPace) return null;
  const gaps = calls.slice(1).map((at, index) => (at - calls[index]) / 60_000);
  const sorted = [...gaps].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function roundUpToFive(minutes: number): number {
  return minutes <= 0 ? 0 : Math.max(5, Math.ceil(minutes / 5) * 5);
}

/** Minutes until this person is called (0 = next). */
export function estimateWait(input: EtaInput): number {
  const { ahead, avgMinutes } = input;
  if (!ahead.length) return 0;
  const isServiceQueue = ahead.some((entry) => entry.serviceMinutes !== null);
  if (!isServiceQueue) {
    const pace = observedPace(input.recentCalls, input.now);
    const perTurn = pace === null ? avgMinutes : (avgMinutes + pace) / 2;
    return roundUpToFive(ahead.length * perTurn);
  }
  const servers = input.staffIds?.length ? input.staffIds : Array.from({ length: Math.max(1, input.activeStaff) }, (_, index) => `#${index}`);
  const busyUntil = new Map(servers.map((id) => [id, 0]));
  const firstFree = () => servers.reduce((best, id) => (busyUntil.get(id)! < busyUntil.get(best)! ? id : best), servers[0]);
  for (const entry of ahead) {
    const server = entry.staffId && busyUntil.has(entry.staffId) ? entry.staffId : firstFree();
    busyUntil.set(server, busyUntil.get(server)! + (entry.serviceMinutes ?? avgMinutes));
  }
  const own = input.self?.staffId;
  return roundUpToFive(busyUntil.get(own && busyUntil.has(own) ? own : firstFree())!);
}

/** "cerca de 15 min", "cerca de 1 h 10 min", "a seguir". */
export function formatWait(minutes: number): string {
  if (minutes <= 0) return "a seguir";
  if (minutes < 60) return `cerca de ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `cerca de ${hours} h ${rest} min` : `cerca de ${hours} h`;
}
