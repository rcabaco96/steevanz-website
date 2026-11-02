// Os botões do site (Inscrever, Ser sócio, Contactar, os cartões das modalidades) abrem a gaveta do formulário com
// o motivo já escolhido: um evento da janela, sem estado global. Sem JavaScript, os mesmos botões são ligações para
// o formulário do fim da página.
export type ContactReason = "inscricao" | "socio" | "aluguer" | "outro";

export interface ContactRequest {
  reason: ContactReason;
  modality?: string;
}

export const openContactEvent = "gb:abrir-formulario";

export function openContact(request: ContactRequest) {
  window.dispatchEvent(new CustomEvent<ContactRequest>(openContactEvent, { detail: request }));
}

/** Prende ou solta o scroll da página (e avisa o Lenis, que de outro modo continuaria a deslizar por trás). */
export const scrollLockEvent = "gb:prender-scroll";

export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  window.dispatchEvent(new CustomEvent<boolean>(scrollLockEvent, { detail: locked }));
}
