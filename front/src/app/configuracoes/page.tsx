"use client";

import Link from "next/link";
import { Bell, ChevronRight, CircleHelp, Globe2, LogOut, Moon, UsersRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { useI18n, type Locale } from "@/providers/i18n-provider";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(false);

  useEffect(() => {
    setNotifications(localStorage.getItem("carepoint-notifications") !== "false");
    setReminders(localStorage.getItem("carepoint-reminders") === "true");
  }, []);

  const save = (key: string, value: boolean, setter: (next: boolean) => void) => {
    localStorage.setItem(key, String(value));
    setter(value);
  };

  return <AppShell roles={["PACIENTE"]}>
    <h1 className="page-title">{t("settings.title")}</h1>
    <p className="mt-1 text-slate-500">{t("settings.subtitle")}</p>

    <SettingsCard title={t("settings.account")}>
      <SettingLink href="/perfil/editar" icon={<UsersRound/>} title={t("settings.editProfile")} description={t("settings.editProfileDescription")}/>
    </SettingsCard>

    <SettingsCard title={t("settings.notifications")}>
      <SettingToggle ariaLabel={t("settings.toggleNotifications")} icon={<Bell/>} title={t("settings.enableNotifications")} description={t("settings.enableNotificationsDescription")} checked={notifications} onChange={value => save("carepoint-notifications", value, setNotifications)}/>
      <SettingToggle ariaLabel={t("settings.toggleReminders")} icon={<Bell/>} title={t("settings.reminders")} description={t("settings.remindersDescription")} checked={reminders} onChange={value => save("carepoint-reminders", value, setReminders)}/>
    </SettingsCard>

    <SettingsCard title={t("settings.application")}>
      <SettingSelect icon={<Globe2/>} title={t("settings.language")} label={t("settings.languageLabel")} value={locale} onChange={value => setLocale(value as Locale)}>
        <option value="pt-BR">{t("settings.portuguese")}</option>
        <option value="en">{t("settings.english")}</option>
      </SettingSelect>
      <SettingToggle ariaLabel={t("settings.toggleDarkMode")} icon={<Moon/>} title={t("settings.darkMode")} description={t("settings.darkModeDescription")} checked={resolvedTheme === "dark"} onChange={value => setTheme(value ? "dark" : "light")}/>
    </SettingsCard>

    <SettingsCard title={t("settings.help")}>
      <SettingLink href="#suporte" icon={<CircleHelp/>} title={t("settings.helpSupport")} description={t("settings.helpSupportDescription")}/>
      <SettingLink href="/nossa-equipe" icon={<UsersRound/>} title={t("settings.ourTeam")} description={t("settings.ourTeamDescription")}/>
    </SettingsCard>

    <button onClick={() => void logout()} className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200"><LogOut/>{t("settings.logout")}</button>
  </AppShell>;
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-7"><h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{title}</h2><Card className="divide-y p-0">{children}</Card></section>;
}

function SettingLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return <Link href={href} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800"><SettingIcon>{icon}</SettingIcon><span className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><small className="block text-slate-500">{description}</small></span><ChevronRight size={18} className="text-slate-400"/></Link>;
}

function SettingSelect({ icon, title, label, value, onChange, children }: { icon: React.ReactNode; title: string; label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <div className="flex items-center gap-3 p-4"><SettingIcon>{icon}</SettingIcon><label className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={event => onChange(event.target.value)} className="mt-1 w-full max-w-52 rounded-lg border px-2 py-1.5 text-sm text-slate-600 dark:text-slate-200">{children}</select></label></div>;
}

function SettingToggle({ icon, title, description, checked, onChange, ariaLabel }: { icon: React.ReactNode; title: string; description: string; checked: boolean; onChange: (value: boolean) => void; ariaLabel: string }) {
  return <div className="flex items-center gap-3 p-4"><SettingIcon>{icon}</SettingIcon><span className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><small className="block text-slate-500">{description}</small></span><button type="button" role="switch" aria-label={ariaLabel} aria-checked={checked} onClick={() => onChange(!checked)} className={`h-7 w-12 rounded-full p-1 transition ${checked ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`}/></button></div>;
}

function SettingIcon({ children }: { children: React.ReactNode }) {
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">{children}</span>;
}
