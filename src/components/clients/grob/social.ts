import { grob } from "@/content/grob/facts";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";

/** As redes do clube (ligações do site atual). */
export const grobSocial = [
  { href: grob.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: grob.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: grob.social.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: grob.social.youtube, label: "YouTube", Icon: YoutubeIcon },
] as const;
