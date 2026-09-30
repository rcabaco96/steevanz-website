import type { Metadata } from "next";
import { NotFoundContent } from "@/components/pages/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found | Steevanz",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent locale="en" />;
}
