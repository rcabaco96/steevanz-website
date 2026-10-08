import type { BusinessKind } from "@/lib/establishments/kinds";

/**
 * Starting points for the booking services: a few kinds of business with their usual services, so
 * the owner only adjusts names, times and prices. Everything stays editable.
 */
export interface ServiceTemplate {
  name: string;
  booking_kind: "one" | "group";
  duration_minutes: number;
  capacity?: number;
  max_party?: number;
  /** "one" services done only by some of the template's places (sports pitches). */
  places?: string[];
}

export interface BusinessTemplate {
  id: string;
  label: string;
  hint: string;
  services: ServiceTemplate[];
  /** People or places created with the template (e.g. the pitches). */
  places?: string[];
  /**
   * The service is fixed (a restaurant's table): the owner only sets it up (places per turn, most
   * people per booking) and never adds or removes services. The tab is called by `fixedLabel`.
   */
  fixed?: { label: string; title: string };
}

export const businessTemplates: BusinessTemplate[] = [
  {
    id: "restaurante",
    label: "Restaurante, café ou bar",
    hint: "Reservas por número de pessoas, até encher a lotação do almoço ou do jantar.",
    services: [{ name: "Reserva", booking_kind: "group", duration_minutes: 120, capacity: 40, max_party: 8 }],
    fixed: { label: "Lotação", title: "Lotação por turno" },
  },
  {
    id: "barbearia",
    label: "Barbearia",
    hint: "Corte, barba e os dois, com o barbeiro que o cliente escolher.",
    services: [
      { name: "Corte", booking_kind: "one", duration_minutes: 30 },
      { name: "Barba", booking_kind: "one", duration_minutes: 20 },
      { name: "Corte e barba", booking_kind: "one", duration_minutes: 45 },
    ],
  },
  {
    id: "cabeleireiro",
    label: "Cabeleireiro e estética",
    hint: "Cabelo, unhas e tratamentos, cada um com a sua duração.",
    services: [
      { name: "Corte", booking_kind: "one", duration_minutes: 45 },
      { name: "Brushing", booking_kind: "one", duration_minutes: 30 },
      { name: "Coloração", booking_kind: "one", duration_minutes: 90 },
      { name: "Manicure", booking_kind: "one", duration_minutes: 45 },
    ],
  },
  {
    id: "clinica",
    label: "Clínica ou consultório",
    hint: "Consultas e tratamentos com o profissional de cada um.",
    services: [
      { name: "Primeira consulta", booking_kind: "one", duration_minutes: 45 },
      { name: "Consulta", booking_kind: "one", duration_minutes: 30 },
      { name: "Tratamento", booking_kind: "one", duration_minutes: 60 },
    ],
  },
  {
    id: "desporto",
    label: "Espaço desportivo",
    hint: "Campos à hora: cada desporto com os seus campos.",
    places: ["Campo de futebol 1", "Campo de futebol 2", "Campo de ténis"],
    services: [
      { name: "Futebol (1 hora)", booking_kind: "one", duration_minutes: 60, places: ["Campo de futebol 1", "Campo de futebol 2"] },
      { name: "Ténis (1 hora)", booking_kind: "one", duration_minutes: 60, places: ["Campo de ténis"] },
    ],
  },
];

/** The starting services of each kind of business (none: the owner starts from scratch or picks one). */
export const kindTemplate: Record<BusinessKind, string | null> = {
  restaurant: "restaurante",
  barbershop: "barbearia",
  salon: "cabeleireiro",
  clinic: "clinica",
  sports: "desporto",
  retail: null,
};

/** The template of a kind of business, when it has one. */
export function templateForKind(kind: BusinessKind): BusinessTemplate | null {
  return businessTemplates.find((item) => item.id === kindTemplate[kind]) ?? null;
}
