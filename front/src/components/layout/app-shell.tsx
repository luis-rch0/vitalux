"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Stethoscope,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";
import { RouteGuard, useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { Role } from "@/types/api";

const patientLinks = [
  ["/paciente", "nav.home", LayoutDashboard],
  ["/profissionais", "nav.professionals", Stethoscope],
  ["/clinicas", "nav.clinics", Building2],
  ["/solicitacoes", "nav.requests", ClipboardList],
  ["/configuracoes", "nav.settings", Settings],
] as const;

const adminLinks = [
  ["/admin", "nav.overview", LayoutDashboard],
  ["/admin/pacientes", "nav.users", Users],
  ["/admin/profissionais", "nav.professionals", Stethoscope],
  ["/admin/clinicas", "nav.clinics", Building2],
  ["/admin/solicitacoes", "nav.appointments", ClipboardList],
  ["/admin/configuracoes", "nav.settings", Settings],
] as const;

export function AppShell({ children, roles }: { children: React.ReactNode; roles: Role[] }) {
  return (
    <RouteGuard roles={roles}>
      <ShellContent>{children}</ShellContent>
    </RouteGuard>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const isAdmin = user?.role === "ADMIN";
  const links = isAdmin ? adminLinks : patientLinks;

  return (
    <div className={`min-h-screen md:flex ${isAdmin ? "bg-slate-100 dark:bg-[#07101f]" : "bg-[#f5f8f6] dark:bg-slate-950"}`}>
      <aside className={`hidden w-72 shrink-0 p-6 md:flex md:flex-col ${isAdmin ? "border-r border-slate-800 bg-[#0d1729] text-white" : "border-r bg-white dark:bg-slate-900"}`}>
        <Logo light={isAdmin} />
        {isAdmin && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">{t("shell.adminCenter")}</p>
            <p className="mt-2 text-sm text-slate-300">{t("shell.adminCenterDescription")}</p>
          </div>
        )}
        <nav className="mt-8 space-y-1.5">
          {links.map(([href, labelKey, Icon]) => (
            <NavLink
              key={href}
              href={href}
              label={t(labelKey)}
              icon={<Icon size={19} />}
              admin={isAdmin}
              active={pathname === href || (href !== "/paciente" && href !== "/admin" && pathname.startsWith(`${href}/`))}
            />
          ))}
        </nav>
        <div className={`mt-auto space-y-2 border-t pt-5 ${isAdmin ? "border-white/10" : ""}`}>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isAdmin ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            aria-label={t("theme.toggle")}
          >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {t("shell.changeTheme")}
          </button>
          <button onClick={() => void logout()} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${isAdmin ? "text-rose-300 hover:bg-rose-500/10" : "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"}`}>
            <LogOut size={18} /> {t("nav.logout")}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pb-20 md:pb-10">
        <header className={`sticky top-0 z-20 flex h-20 items-center justify-between border-b px-5 backdrop-blur-xl md:px-8 ${isAdmin ? "border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-[#0b1424]/90" : "bg-white/90 dark:bg-slate-900/90"}`}>
          <div className="md:hidden"><Logo /></div>
          <div className="hidden md:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{isAdmin ? t("shell.administration") : t("shell.patientArea")}</p>
            <p className="mt-1 text-sm text-slate-500">{isAdmin ? t("shell.adminSubtitle") : t("shell.patientSubtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={t("theme.toggle")}>
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.nome}</p>
              <p className="text-xs text-slate-500">{isAdmin ? t("shell.administrator") : t("shell.patient")}</p>
            </div>
            <span className={`grid h-11 w-11 place-items-center rounded-2xl font-bold ${isAdmin ? "bg-[#123f31] text-emerald-200" : "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200"}`}>
              {user?.nome?.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <div className={`mx-auto p-5 md:p-8 ${isAdmin ? "max-w-[1600px]" : "max-w-7xl"}`}>{children}</div>
      </main>

      <nav className={`fixed inset-x-0 bottom-0 z-30 flex justify-around border-t p-2 md:hidden ${isAdmin ? "border-slate-800 bg-[#0d1729]" : "bg-white dark:bg-slate-900"}`}>
        {links.slice(0, 5).map(([href, labelKey, Icon]) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`grid min-w-14 place-items-center gap-1 rounded-xl px-2 py-1 text-[11px] ${active ? "text-emerald-400" : isAdmin ? "text-slate-400" : "text-slate-500"}`}>
              <Icon size={19} /><span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NavLink({ href, label, icon, active, admin }: { href: string; label: string; icon: React.ReactNode; active: boolean; admin: boolean }) {
  const classes = admin
    ? active ? "bg-emerald-400/15 text-emerald-300 shadow-[inset_3px_0_0_#34d399]" : "text-slate-300 hover:bg-white/5 hover:text-white"
    : active ? "bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";
  return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition ${classes}`}>{icon}{label}</Link>;
}
