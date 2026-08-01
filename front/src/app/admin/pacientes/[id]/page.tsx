"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/state";
import { useI18n } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";

const content = {
  "pt-BR": { notFound: "Paciente não encontrado.", back: "← Voltar", email: "E-mail", phone: "Telefone", birth: "Nascimento", address: "Endereço", family: "Familiar responsável", needs: "Necessidades de cuidado", missing: "Não informado" },
  en: { notFound: "Patient not found.", back: "← Back", email: "Email", phone: "Phone number", birth: "Date of birth", address: "Address", family: "Responsible family member", needs: "Care needs", missing: "Not provided" },
} as const;

export default function AdminPatientDetailPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const patient = useQuery({ queryKey: ["admin-patient", id], queryFn: () => carepointService.adminPatient(id) });

  if (patient.isLoading) return <AppShell roles={["ADMIN"]}><Skeleton className="h-72" /></AppShell>;
  if (!patient.data) return <AppShell roles={["ADMIN"]}><p>{copy.notFound}</p></AppShell>;

  const item = patient.data;
  const birthDate = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR").format(new Date(`${item.dataNascimento}T00:00:00`));

  return (
    <AppShell roles={["ADMIN"]}>
      <button onClick={() => router.back()} className="text-sm font-semibold text-brand-700">{copy.back}</button>
      <Card className="mt-5 max-w-2xl">
        <h1 className="page-title">{item.nome}</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label={copy.email} value={item.email} />
          <Detail label={copy.phone} value={item.telefone} />
          <Detail label="CPF" value={item.cpf} />
          <Detail label={copy.birth} value={birthDate} />
          <Detail label={copy.address} value={item.endereco} />
          <Detail label={copy.family} value={item.familiarResponsavel || copy.missing} />
          <Detail label={copy.needs} value={item.necessidadesCuidado || copy.missing} />
        </dl>
      </Card>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;
}
