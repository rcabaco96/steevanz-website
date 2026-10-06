/**
 * DataForSEO: the hosted source of Google review data chosen by the owner (no local computer, no
 * Apify in the normal path). Basic auth with DATA_FOR_SEO_LOGIN / DATA_FOR_SEO_PASSWORD, base
 * https://api.dataforseo.com/v3. Only relative imports, so it can be loaded by node --test and by
 * small scripts without Next.js.
 *
 * Every request returns { status_code, tasks: [{ id, status_code, data, result }] }: 20000 is
 * "Ok", 20100 "Task Created", 40601/40602 "Task Handed"/"Task In Queue" (not ready yet).
 */

export const dfsBaseUrl = "https://api.dataforseo.com/v3";
/** Tasks per POST accepted by DataForSEO. */
export const dfsMaxTasksPerPost = 100;

export const dfsCodes = {
  ok: 20000,
  created: 20100,
  noResults: 40102,
  handed: 40601,
  inQueue: 40602,
} as const;

export interface DfsTaskData {
  tag?: string;
  postback_url?: string;
  depth?: number;
  priority?: number;
  place_id?: string;
  cid?: string;
  keyword?: string;
  [key: string]: unknown;
}

export interface DfsTask<R = unknown> {
  id: string;
  status_code: number;
  status_message: string;
  cost?: number;
  result_count?: number;
  data?: DfsTaskData | null;
  result: R[] | null;
}

export interface DfsResponse<R = unknown> {
  status_code: number;
  status_message: string;
  cost?: number;
  tasks_count?: number;
  tasks_error?: number;
  tasks?: DfsTask<R>[] | null;
}

/** "budget": refused by our own spending guard (reserve or daily limit), before reaching DataForSEO. */
export type DfsErrorKind = "not_configured" | "auth" | "balance" | "budget" | "rate_limit" | "invalid" | "no_results" | "pending" | "server" | "network";

export class DataForSeoError extends Error {
  readonly kind: DfsErrorKind;
  readonly statusCode?: number;

  constructor(kind: DfsErrorKind, message: string, statusCode?: number) {
    super(message);
    this.name = "DataForSeoError";
    this.kind = kind;
    this.statusCode = statusCode;
  }
}

/** Kind of a DataForSEO status code (request or task level) or HTTP status. */
export function dfsErrorKind(code: number): DfsErrorKind {
  if (code === dfsCodes.handed || code === dfsCodes.inQueue) return "pending";
  if (code === dfsCodes.noResults) return "no_results";
  if (code === 401 || (code >= 40100 && code < 40200)) return "auth";
  if (code === 429 || code === 40202 || code === 40209) return "rate_limit";
  if (code === 402 || (code >= 40200 && code < 40300)) return "balance";
  if (code >= 500 && code < 600) return "server";
  if (code >= 50000) return "server";
  return "invalid";
}

/** True for task codes that only mean "not ready yet". */
export const dfsTaskPending = (code: number) => code === dfsCodes.handed || code === dfsCodes.inQueue;

/** Portuguese message stored in review_import_jobs.error (shown in the panel and in the admin). */
export function dfsUserMessage(error: unknown): string {
  if (!(error instanceof DataForSeoError)) return "Não foi possível ler as reviews do Google. Tente outra vez daqui a pouco.";
  switch (error.kind) {
    case "not_configured":
      return "A ligação ao fornecedor de dados do Google (DataForSEO) não está configurada.";
    case "auth":
      // 40104: the account exists but was never verified in app.dataforseo.com (paid endpoints refuse it).
      if (error.statusCode === 40104) return "A conta do fornecedor de dados do Google (DataForSEO) ainda não foi verificada. Avise a Steevanz.";
      return "O fornecedor de dados do Google (DataForSEO) recusou as credenciais. Avise a Steevanz.";
    case "balance": {
      // 402xx covers more than an empty balance: say which one (DataForSEO appendix/errors).
      const code = error.statusCode;
      const reason =
        code === 40201
          ? "suspendeu temporariamente a conta por atividade invulgar (é preciso contactar support@dataforseo.com)"
          : code === 40203
            ? "recusou o pedido porque passa o limite de custo definido na conta (app.dataforseo.com/api-settings)"
            : code === 40204
              ? "não dá acesso a esta API com o plano da conta"
              : code === 40205 || code === 40206
                ? "recusou um pedido repetido (limite de pedidos iguais na conta, app.dataforseo.com/api-settings)"
                : code === 40207
                  ? "recusou o pedido porque o IP deste servidor não está autorizado na conta (app.dataforseo.com/api-access)"
                  : "está sem saldo";
      return `O fornecedor de dados do Google (DataForSEO) ${reason}. Avise a Steevanz.${code ? ` (código ${code})` : ""}`;
    }
    case "budget":
      return error.message;
    case "rate_limit":
      return "O fornecedor de dados do Google (DataForSEO) pediu para abrandar. Tente outra vez daqui a pouco.";
    case "no_results":
      return "O Google não devolveu resultados para este local.";
    case "pending":
      return "O fornecedor de dados do Google ainda está a preparar a leitura.";
    case "network":
      return "Não foi possível contactar o fornecedor de dados do Google. Tente outra vez daqui a pouco.";
    case "server":
      return "O fornecedor de dados do Google (DataForSEO) teve um erro. Tente outra vez daqui a pouco.";
    default:
      return `O fornecedor de dados do Google (DataForSEO) recusou o pedido (código ${error.statusCode ?? "?"}).`;
  }
}

function credentials(): { login: string; password: string } | null {
  const login = process.env.DATA_FOR_SEO_LOGIN?.trim();
  const password = process.env.DATA_FOR_SEO_PASSWORD?.trim();
  return login && password ? { login, password } : null;
}

/**
 * Owner decision (2026-10-05): DataForSEO is paid and switched off. Nothing is sent to it (panel
 * buttons, routines) unless DATA_FOR_SEO_ENABLED=1, even with the credentials set: the free reader
 * does the work.
 */
export function dataForSeoEnabled(): boolean {
  return process.env.DATA_FOR_SEO_ENABLED?.trim() === "1";
}

export function dataForSeoConfigured(): boolean {
  return dataForSeoEnabled() && credentials() !== null;
}

const requestTimeoutMs = 60_000;

async function request<R>(method: "GET" | "POST", path: string, body?: unknown): Promise<DfsResponse<R>> {
  const auth = credentials();
  if (!auth) throw new DataForSeoError("not_configured", "DATA_FOR_SEO_LOGIN / DATA_FOR_SEO_PASSWORD are not set");
  const url = `${dfsBaseUrl}/${path.replace(/^\/+/, "").replace(/^v3\//, "")}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        authorization: `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString("base64")}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(requestTimeoutMs),
      cache: "no-store",
    });
  } catch (error) {
    throw new DataForSeoError("network", `DataForSEO ${method} ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
  let json: DfsResponse<R> | null = null;
  try {
    json = (await response.json()) as DfsResponse<R>;
  } catch {
    json = null;
  }
  if (!response.ok || !json) {
    // HTTP 402 comes with status_code 20000 in the body: the HTTP status says what went wrong.
    const code = json?.status_code && json.status_code !== dfsCodes.ok ? json.status_code : response.status;
    throw new DataForSeoError(dfsErrorKind(code), `DataForSEO ${method} ${path}: HTTP ${response.status} ${json?.status_message ?? ""}`.trim(), code);
  }
  if (json.status_code !== dfsCodes.ok) {
    throw new DataForSeoError(dfsErrorKind(json.status_code), `DataForSEO ${method} ${path}: ${json.status_code} ${json.status_message}`, json.status_code);
  }
  return json;
}

// --- Spending guard ------------------------------------------------------------------------------
// DataForSEO accepts a POST while the balance is positive, even when the tasks cost more than what is
// left (on 2026-10-04 one batch took the account from ~0.85 $ to -3.37 $). So every paid POST first
// reads the balance and today's spend (appendix/user_data, free) and is refused when it would leave
// less than the reserve or pass the daily limit.

/** Reserve that is never spent, and most that may be spent per day (US dollars). */
export function dfsSpendLimits(): { reserve: number; daily: number } {
  const value = (raw: string | undefined, fallback: number) => {
    const parsed = Number(raw);
    return raw?.trim() && Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  };
  return { reserve: value(process.env.DATA_FOR_SEO_MIN_BALANCE, 5), daily: value(process.env.DATA_FOR_SEO_DAILY_LIMIT, 3) };
}

/** Prices of DataForSEO's list (US dollars) for what this product posts; unknown endpoints count 0.01. */
export function estimateTaskCost(path: string, task: Record<string, unknown>): number {
  const priority = task.priority === 2 ? 2 : 1;
  if (path === dfsPaths.reviewsPost) {
    const depth = typeof task.depth === "number" && task.depth > 0 ? task.depth : 10;
    return Math.ceil(depth / 10) * 0.00075 * priority;
  }
  if (path === dfsPaths.mapsPost) return 0.0006 * priority;
  if (path === dfsPaths.mapsLive) return 0.002;
  if (path === dfsPaths.businessInfoLive) return 0.0054;
  return 0.01;
}

export interface DfsAccount {
  balance: number;
  spentToday: number;
}

const usd = (value: number) => `${value.toFixed(2).replace(".", ",")} $`;

/** Why a POST costing `estimate` must not be sent (Portuguese, shown in the panel), or null when it may. */
export function spendProblem(account: DfsAccount, estimate: number, limits = dfsSpendLimits()): string | null {
  if (account.balance - estimate < limits.reserve) {
    return `O saldo do fornecedor de dados do Google (${usd(account.balance)}) está abaixo do mínimo de segurança (${usd(limits.reserve)}). Avise a Steevanz.`;
  }
  if (account.spentToday + estimate > limits.daily) {
    return `Atingido o limite de gastos de hoje com o fornecedor de dados do Google (${usd(limits.daily)}). O pedido fica para amanhã; avise a Steevanz se for urgente.`;
  }
  return null;
}

interface DfsUserData {
  money?: { balance?: number | null; statistics?: { day?: { total?: number | null } | null } | null } | null;
}

let account: (DfsAccount & { at: number }) | null = null;
/** The account is read again after this long; in between, each POST is subtracted locally. */
const accountTtlMs = 60_000;

/** Balance and today's spend (free endpoint), cached for a minute. */
export async function dfsAccount(): Promise<DfsAccount> {
  if (!account || Date.now() - account.at > accountTtlMs) {
    const response = await request<DfsUserData>("GET", "appendix/user_data");
    const money = response.tasks?.[0]?.result?.[0]?.money;
    const balance = Number(money?.balance);
    if (!Number.isFinite(balance)) throw new DataForSeoError("server", "DataForSEO user_data without a balance");
    account = { balance, spentToday: Number(money?.statistics?.day?.total) || 0, at: Date.now() };
  }
  return account;
}

/** POST of up to 100 tasks (e.g. "business_data/google/reviews/task_post"), after the spending guard. */
export async function dfsPost<R = unknown>(path: string, tasks: Record<string, unknown>[]): Promise<DfsResponse<R>> {
  if (!dataForSeoEnabled()) throw new DataForSeoError("not_configured", "DataForSEO is switched off (DATA_FOR_SEO_ENABLED is not 1)");
  if (tasks.length > dfsMaxTasksPerPost) throw new DataForSeoError("invalid", `DataForSEO accepts at most ${dfsMaxTasksPerPost} tasks per POST`);
  const estimate = tasks.reduce((sum, task) => sum + estimateTaskCost(path, task), 0);
  const current = await dfsAccount();
  const problem = spendProblem(current, estimate);
  if (problem) throw new DataForSeoError("budget", problem);
  const response = await request<R>("POST", path, tasks);
  const charged = typeof response.cost === "number" ? response.cost : estimate;
  current.balance -= charged;
  current.spentToday += charged;
  return response;
}

/** GET (e.g. "business_data/google/reviews/task_get/<id>", ".../tasks_ready"). */
export function dfsGet<R = unknown>(path: string): Promise<DfsResponse<R>> {
  return request<R>("GET", path);
}

/** What dispatch/collect need from DataForSEO; tests and dry runs can pass their own. */
export interface DfsTransport {
  post<R = unknown>(path: string, tasks: Record<string, unknown>[]): Promise<DfsResponse<R>>;
  get<R = unknown>(path: string): Promise<DfsResponse<R>>;
}

export const dataForSeo: DfsTransport = { post: dfsPost, get: dfsGet };

/** Endpoints used by the reviews product. */
export const dfsPaths = {
  reviewsPost: "business_data/google/reviews/task_post",
  reviewsGet: (id: string) => `business_data/google/reviews/task_get/${encodeURIComponent(id)}`,
  reviewsReady: "business_data/google/reviews/tasks_ready",
  mapsPost: "serp/google/maps/task_post",
  mapsGet: (id: string) => `serp/google/maps/task_get/advanced/${encodeURIComponent(id)}`,
  mapsReady: "serp/google/maps/tasks_ready",
  /** Competitor search (once per customer, someone waiting): live, no postback. */
  mapsLive: "serp/google/maps/live/advanced",
  businessInfoLive: "business_data/google/my_business_info/live",
} as const;
