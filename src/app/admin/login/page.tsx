import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/conta/entrar?next=/admin");
}
