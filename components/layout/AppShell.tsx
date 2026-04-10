import Link from "next/link";
import { PropsWithChildren } from "react";

type AppShellProps = PropsWithChildren<{
  title: string;
}>;

export const AppShell = ({ title, children }: AppShellProps) => (
  <div className="min-h-screen bg-brand-navy text-brand-white">
    <header className="sticky top-0 z-20 border-b border-slate-700/60 bg-brand-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold">{title}</h1>
        <nav className="flex items-center gap-3 text-sm text-brand-light">
          <Link href="/dashboard" className="hover:text-brand-gold">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:text-brand-gold">
            Profile
          </Link>
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
  </div>
);
