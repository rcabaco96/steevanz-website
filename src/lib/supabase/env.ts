export interface PublicSupabaseConfig {
  url: string;
  anonKey: string;
}

export interface ServiceSupabaseConfig extends PublicSupabaseConfig {
  serviceRoleKey: string;
}

export function publicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function serviceSupabaseConfig(): ServiceSupabaseConfig | null {
  const base = publicSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!base || !serviceRoleKey) return null;
  return { ...base, serviceRoleKey };
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
