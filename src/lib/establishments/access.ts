import { getSession } from "@/lib/auth/session";
import { getEstablishment, ownerHasProduct } from "./store";
import type { EstablishmentRow } from "./types";

export type ModuleProduct = "waitlist" | "loyalty" | "bookings";

export class EstablishmentAccessError extends Error {
  constructor(readonly reason: "anonymous" | "denied") {
    super(reason === "anonymous" ? "Sessão em falta" : "Sem acesso");
    this.name = "EstablishmentAccessError";
  }
}

export interface EstablishmentAccess {
  establishment: EstablishmentRow;
  viewer: "client" | "admin";
}

/**
 * Who may manage an establishment's module: admins always; the owning client account while the
 * product is active. Unknown establishments are "denied" too.
 */
export async function requireEstablishmentAccess(establishmentId: string, product?: ModuleProduct): Promise<EstablishmentAccess> {
  const session = await getSession();
  if (session.state !== "admin" && session.state !== "client") throw new EstablishmentAccessError("anonymous");
  const establishment = await getEstablishment(establishmentId);
  if (!establishment) throw new EstablishmentAccessError("denied");
  if (session.state === "admin") return { establishment, viewer: "admin" };
  if (establishment.owner_id !== session.user.id) throw new EstablishmentAccessError("denied");
  if (product && !(await ownerHasProduct(establishment.owner_id, product))) throw new EstablishmentAccessError("denied");
  return { establishment, viewer: "client" };
}

export async function requireAdminSession(): Promise<void> {
  const session = await getSession();
  if (session.state !== "admin") throw new EstablishmentAccessError(session.state === "client" ? "denied" : "anonymous");
}

export function accessErrorMessage(error: unknown): string | null {
  if (!(error instanceof EstablishmentAccessError)) return null;
  return error.reason === "anonymous" ? "A sessão expirou. Entre novamente." : "Não tem acesso a este estabelecimento.";
}
