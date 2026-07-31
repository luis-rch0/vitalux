"use client";

import { useParams, useRouter } from "next/navigation";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProfessionalCard } from "@/components/cards";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/state";
import { useClinic, useProfessionals } from "@/features/carepoint-hooks";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    notFound: "Clínica não encontrada.",
    back: "← Voltar",
    defaultDescription: "Clínica parceira preparada para coordenar o atendimento domiciliar.",
    professionals: "Profissionais desta clínica",
    noProfessionals: "Não há profissionais ativos vinculados no momento.",
  },
  en: {
    notFound: "Clinic not found.",
    back: "← Back",
    defaultDescription: "Partner clinic prepared to coordinate home care services.",
    professionals: "Professionals at this clinic",
    noProfessionals: "There are no active professionals linked to this clinic at the moment.",
  },
} as const;

export default function ClinicDetailPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const clinic = useClinic(id);
  const professionals = useProfessionals({ clinicaId: id });

  if (clinic.isLoading) return <AppShell roles={["PACIENTE"]}><Skeleton className="h-80" /></AppShell>;
  if (!clinic.data) return <AppShell roles={["PACIENTE"]}><p>{copy.notFound}</p></AppShell>;

  const item = clinic.data;

  return (
    <AppShell roles={["PACIENTE"]}>
      <button onClick={() => router.back()} className="text-sm font-semibold text-brand-700">{copy.back}</button>
      <Card className="mt-5">
        <div className="grid h-28 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
          <Building2 size={45} aria-hidden="true" />
        </div>
        <h1 className="page-title mt-6">{item.nome}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{item.descricao || copy.defaultDescription}</p>
        <div className="mt-6 grid gap-3 rounded-2xl border p-4 text-sm sm:grid-cols-2">
          <span className="flex items-center gap-2"><Phone size={16} aria-hidden="true" />{item.telefone}</span>
          <span className="flex items-center gap-2"><Mail size={16} aria-hidden="true" />{item.email}</span>
          <span className="flex items-center gap-2 sm:col-span-2"><MapPin size={16} aria-hidden="true" />{item.endereco}</span>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="text-lg font-bold">{copy.professionals}</h2>
        {professionals.data?.content.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {professionals.data.content.map((person) => <ProfessionalCard key={person.id} professional={person} />)}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">{copy.noProfessionals}</p>
        )}
      </section>
    </AppShell>
  );
}
