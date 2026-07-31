"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  return <AppShell roles={["ADMIN"]}>
    <h1 className="page-title">{t("adminSettings.title")}</h1>
    <p className="mt-1 text-slate-500">{t("adminSettings.subtitle")}</p>
    <Card className="mt-6 max-w-2xl">
      <h2 className="text-lg font-bold">{t("adminSettings.operation")}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("adminSettings.description")}</p>
      <Link href="/nossa-equipe" className="mt-5 inline-flex font-semibold text-brand-700">{t("settings.ourTeam")} →</Link>
    </Card>
  </AppShell>;
}
