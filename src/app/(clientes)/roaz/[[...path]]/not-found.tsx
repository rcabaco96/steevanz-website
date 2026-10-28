import type { Metadata } from "next";
import { RoazNotFound } from "@/components/clients/roaz/NotFound";

export const metadata: Metadata = { title: "Roaz", robots: { index: false, follow: true } };

export default function NotFound() {
  return <RoazNotFound />;
}
