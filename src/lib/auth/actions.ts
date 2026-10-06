"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { requestOrigin } from "@/lib/booking/request";
import { createAuthClient } from "@/lib/supabase/server";
import { minPasswordLength } from "./password";
import { isAdminUser, safeNextPath } from "./session";

const unconfigured: ActionState = { ok: false, message: "O acesso a contas ainda não está configurado." };
const weakPassword: ActionState = { ok: false, message: "Esta palavra-passe é demasiado fraca ou já foi exposta. Escolha outra." };
const shortPassword = `A palavra-passe tem de ter pelo menos ${minPasswordLength} caracteres.`;

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function raw(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

function optional(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .transform((text) => (text.length ? text : undefined));
}

const password = z.string().min(minPasswordLength).max(72);

const signUpSchema = z
  .object({
    full_name: z.string().trim().min(1).max(120),
    business_name: optional(160),
    phone: optional(40),
    email: z.email().max(200),
    password,
    confirm: z.string(),
    terms: z.literal(true),
  })
  .refine((data) => data.password === data.confirm, { path: ["confirm"] });

const signUpMessages: Record<string, string> = {
  full_name: "Indique o seu nome.",
  business_name: "O nome do negócio é demasiado longo.",
  phone: "O telemóvel é demasiado longo.",
  email: "Indique um email válido.",
  password: shortPassword,
  confirm: "As palavras-passe não coincidem.",
  terms: "Tem de aceitar os termos e a política de privacidade.",
};

async function callbackUrl(next: string): Promise<string> {
  const origin = await requestOrigin();
  return `${origin}/conta/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signUp(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    full_name: value(formData, "full_name"),
    business_name: value(formData, "business_name"),
    phone: value(formData, "phone"),
    email: value(formData, "email").toLowerCase(),
    password: raw(formData, "password"),
    confirm: raw(formData, "confirm"),
    terms: formData.get("terms") === "on",
  });
  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? "");
    return { ok: false, message: signUpMessages[field] ?? "Verifique os dados do formulário." };
  }
  const { email, password: secret, full_name, business_name, phone } = parsed.data;

  const supabase = await createAuthClient();
  if (!supabase) return unconfigured;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: secret,
    options: {
      emailRedirectTo: await callbackUrl("/conta"),
      data: { full_name, business_name, phone },
    },
  });
  if (error) {
    if (error.code === "weak_password") return weakPassword;
    if (error.code === "over_email_send_rate_limit") return { ok: false, message: "Demasiados pedidos. Aguarde um minuto e tente novamente." };
    console.error("[auth] signUp failed:", error.code, error.message);
    return { ok: false, message: "Não foi possível criar a conta. Tente novamente." };
  }
  // With email confirmation disabled Supabase signs the user in straight away.
  if (data.session) redirect("/conta");
  redirect(`/conta/verificar-email?email=${encodeURIComponent(email)}`);
}

const signInSchema = z.object({ email: z.email(), password: z.string().min(1).max(200) });

export async function signIn(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: value(formData, "email").toLowerCase(),
    password: raw(formData, "password"),
  });
  if (!parsed.success) return { ok: false, message: "Indique o email e a palavra-passe." };

  const supabase = await createAuthClient();
  if (!supabase) return unconfigured;
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    console.error("[auth] signIn failed:", error?.code, error?.message);
    if (error?.code === "email_not_confirmed") {
      return { ok: false, message: "Ainda não confirmou o seu email. Procure a mensagem de confirmação na sua caixa de correio." };
    }
    return { ok: false, message: "Email ou palavra-passe incorretos." };
  }
  redirect(safeNextPath(value(formData, "next"), isAdminUser(data.user) ? "/admin" : "/conta"));
}

export async function requestPasswordReset(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.email().safeParse(value(formData, "email").toLowerCase());
  if (!parsed.success) return { ok: false, message: "Indique um email válido." };
  const supabase = await createAuthClient();
  if (!supabase) return unconfigured;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, { redirectTo: await callbackUrl("/conta/nova-password") });
  if (error) console.error("[auth] resetPasswordForEmail failed:", error.code, error.message);
  return { ok: true, message: "Se existir uma conta com este email, vai receber um link para definir uma nova palavra-passe." };
}

const newPasswordSchema = z
  .object({ password, confirm: z.string() })
  .refine((data) => data.password === data.confirm, { path: ["confirm"] });

export async function updatePassword(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = newPasswordSchema.safeParse({ password: raw(formData, "password"), confirm: raw(formData, "confirm") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.path[0] === "confirm" ? "As palavras-passe não coincidem." : shortPassword };
  }
  const supabase = await createAuthClient();
  if (!supabase) return unconfigured;
  const { data: current } = await supabase.auth.getUser();
  if (!current.user) return { ok: false, message: "A sessão expirou. Peça um novo link de recuperação." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { ok: false, message: "A nova palavra-passe tem de ser diferente da atual." };
    if (error.code === "weak_password") return weakPassword;
    if (error.code === "reauthentication_needed") return { ok: false, message: "Por segurança, saia e entre novamente antes de mudar a palavra-passe." };
    console.error("[auth] updateUser failed:", error.code, error.message);
    return { ok: false, message: "Não foi possível alterar a palavra-passe. Tente novamente." };
  }
  return { ok: true, message: "Palavra-passe atualizada." };
}

export async function signOut(): Promise<void> {
  const supabase = await createAuthClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/conta/entrar");
}
