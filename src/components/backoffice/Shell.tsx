import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { signOut } from "@/lib/auth/actions";
import { BackofficeNav, type NavLink } from "./Nav";

export function SignOutButton({ label = "Sair" }: { label?: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={buttonClasses("ghost", "sm")}>
        {label}
      </button>
    </form>
  );
}

interface BackofficeShellProps {
  home: string;
  homeLabel: string;
  badge: string;
  email: string;
  links: NavLink[];
  navLabel: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function BackofficeShell({ home, homeLabel, badge, email, links, navLabel, actions, children }: BackofficeShellProps) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-3 pb-2 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo href={home} label={homeLabel} />
              <span className="hidden rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text sm:inline">{badge}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="hidden max-w-48 truncate text-sm text-subtle md:inline">{email}</span>
              {actions}
              <ThemeToggle label="Mudar tema" />
              <SignOutButton />
            </div>
          </div>
          <BackofficeNav links={links} label={navLabel} />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
