import type { Metadata } from "next";
import { QuintalNotFound } from "@/components/clients/o-quintal/NotFound";

export const metadata: Metadata = { title: "O Quintal", robots: { index: false, follow: true } };

export default function NotFound() {
  return <QuintalNotFound />;
}
