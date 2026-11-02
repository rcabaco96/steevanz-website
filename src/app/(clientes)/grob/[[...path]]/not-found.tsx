import type { Metadata } from "next";
import { GrobNotFound } from "@/components/clients/grob/NotFound";

export const metadata: Metadata = { title: "GROB", robots: { index: false, follow: true } };

export default function NotFound() {
  return <GrobNotFound />;
}
