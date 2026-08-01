"use client";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProfessionalAdminForm } from "@/components/forms/admin-forms";
import { useI18n } from "@/providers/i18n-provider";

export default function EditProfessionalPage() { const { locale } = useI18n(); const { id } = useParams<{ id: string }>(); return <AppShell roles={["ADMIN"]}><h1 className="page-title">{locale === "en" ? "Edit professional" : "Editar profissional"}</h1><ProfessionalAdminForm id={id}/></AppShell>; }
