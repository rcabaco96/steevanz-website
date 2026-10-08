"use client";

import { useEffect } from "react";

/**
 * Back from the join page to a ticket that is already over (e.g. another day): forget it on this
 * phone and go back to the join form, so reading the QR again just starts a new ticket.
 */
export function ForgetTicket({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      window.localStorage.removeItem(`fila:${slug}`);
    } catch {
      // Nothing saved to forget.
    }
    window.location.replace(`/fila/${slug}`);
  }, [slug]);
  return null;
}
