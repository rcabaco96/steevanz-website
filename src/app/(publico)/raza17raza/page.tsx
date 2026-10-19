import { permanentRedirect } from "next/navigation";

// The Dolci e Salati video menu's old hidden address (owner, 2026-10-14). Since 2026-10-19 the menu is
// /menu/dolci-salati, on the same page as every other menu; this address only sends people there.
export default function OldDolciMenuPage(): never {
  permanentRedirect("/menu/dolci-salati");
}
