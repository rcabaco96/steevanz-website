import type { Metadata } from "next";
import { SeteChavesNotFound } from "@/components/clients/sete-chaves/NotFound";

export const metadata: Metadata = {
  title: "Sete Chaves",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <SeteChavesNotFound />;
}
