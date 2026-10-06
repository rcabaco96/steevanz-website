import type { Metadata } from "next";
import { PasswordForm } from "@/components/account/PasswordForm";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, adminInputClasses, adminLabelClasses, Panel } from "@/components/backoffice/ui";
import { updateProfile } from "@/lib/accounts/actions";
import { getOwnProfile, requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Perfil" };

function Field({ label, name, defaultValue, maxLength, required, autoComplete }: { label: string; name: string; defaultValue: string | null | undefined; maxLength: number; required?: boolean; autoComplete?: string }) {
  return (
    <label className={adminLabelClasses}>
      {label}
      <input name={name} defaultValue={defaultValue ?? ""} maxLength={maxLength} required={required} autoComplete={autoComplete} className={`${adminInputClasses} h-11`} />
    </label>
  );
}

export default async function AccountProfilePage() {
  const user = await requireUser();
  const profile = await getOwnProfile();

  return (
    <>
      <AdminPageHeader title="Perfil" description={user.email} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Dados">
          <ActionForm action={updateProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nome" name="full_name" defaultValue={profile?.full_name} maxLength={120} required autoComplete="name" />
            </div>
            <div className="sm:col-span-2">
              <Field label="Negócio" name="business_name" defaultValue={profile?.business_name} maxLength={160} autoComplete="organization" />
            </div>
            <Field label="Telemóvel" name="phone" defaultValue={profile?.phone} maxLength={40} autoComplete="tel" />
            <Field label="NIF" name="nif" defaultValue={profile?.nif} maxLength={20} />
            <SubmitButton pendingLabel="A guardar…" className="self-start sm:col-span-2 sm:justify-self-start">
              Guardar
            </SubmitButton>
          </ActionForm>
        </Panel>
        <Panel title="Palavra-passe" className="lg:self-start">
          <PasswordForm />
        </Panel>
      </div>
    </>
  );
}
