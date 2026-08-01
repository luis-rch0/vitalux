"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ProfessionalAdminForm } from "@/components/forms/admin-forms";
import { useI18n } from "@/providers/i18n-provider";

export default function NewProfessionalPage() {
  const { locale } = useI18n();
  const copy = locale === "en"
    ? { title: "New professional", subtitle: "Register a professional to display in the marketplace." }
    : { title: "Novo profissional", subtitle: "Cadastre um profissional para aparecer no marketplace." };
  return <AppShell roles={["ADMIN"]}><h1 className="page-title">{copy.title}</h1><p className="mt-1 text-slate-500">{copy.subtitle}</p><ProfessionalAdminForm /></AppShell>;
}
