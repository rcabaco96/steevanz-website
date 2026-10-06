import { redirect } from "next/navigation";

// Panels are listed in the client area (and in /admin/reviews for admins).
export default function DashboardIndex() {
  redirect("/conta");
}
