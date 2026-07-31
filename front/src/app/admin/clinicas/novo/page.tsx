"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ClinicAdminForm } from "@/components/forms/admin-forms";
import { useI18n } from "@/providers/i18n-provider";

export default function NewClinicPage() {
  const { locale } = useI18n();
  const copy = locale === "en"
    ? { title: "New clinic", subtitle: "Register a partner clinic." }
    : { title: "Nova clínica", subtitle: "Cadastre uma clínica parceira." };
  return <AppShell roles={["ADMIN"]}><h1 className="page-title">{copy.title}</h1><p className="mt-1 text-slate-500">{copy.subtitle}</p><ClinicAdminForm /></AppShell>;
}
