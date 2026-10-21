import { fabios } from "@/content/fabios-roadstop/facts";
import { fabiosHref, type FabiosLocale, type FabiosMode, type FabiosPage } from "@/content/fabios-roadstop/routes";

export interface FabiosLinks {
  home: string;
  about: string;
  contact: string;
  /** The Steevanz video menu: a path on the preview, the full Steevanz address on the client's domain. */
  menu: string;
  /** The same page in the other language. */
  otherLocale: string;
  otherLocaleCode: FabiosLocale;
}

export function fabiosLinks(mode: FabiosMode, locale: FabiosLocale, page: FabiosPage): FabiosLinks {
  const other: FabiosLocale = locale === "pt" ? "en" : "pt";
  return {
    home: fabiosHref(mode, locale, "home"),
    about: fabiosHref(mode, locale, "about"),
    contact: fabiosHref(mode, locale, "contact"),
    menu: mode === "domain" ? fabios.menuUrl : fabios.menuPath,
    otherLocale: fabiosHref(mode, other, page),
    otherLocaleCode: other,
  };
}
