import type { Metadata } from "next";
import { FerragialNotFound } from "@/components/clients/ferragial/NotFound";

export const metadata: Metadata = { title: "Adega Ferragial", robots: { index: false, follow: true } };

export default function NotFound() {
  return <FerragialNotFound />;
}
