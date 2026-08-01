"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/cards";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { useI18n, type Locale } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";
import type { RequestStatus } from "@/types/api";

const statuses: RequestStatus[] = ["PENDENTE", "CONFIRMADA", "REJEITADA", "CANCELADA", "CONCLUIDA"];

const content = {
  "pt-BR": {
    title: "Solicitações", subtitle: "Analise e atualize o andamento dos atendimentos.", allStatuses: "Todos os status", patient: "Paciente", professional: "Profissional", date: "Data", status: "Status", action: "Ação", review: "Analisar", empty: "Nenhuma solicitação encontrada", emptyDescription: "Ajuste o filtro ou aguarde novos pedidos.",
    statuses: { PENDENTE: "Pendente", CONFIRMADA: "Confirmada", REJEITADA: "Rejeitada", CANCELADA: "Cancelada", CONCLUIDA: "Concluída" },
  },
  en: {
    title: "Requests", subtitle: "Review and update the progress of care services.", allStatuses: "All statuses", patient: "Patient", professional: "Professional", date: "Date", status: "Status", action: "Action", review: "Review", empty: "No requests found", emptyDescription: "Adjust the filter or wait for new requests.",
    statuses: { PENDENTE: "Pending", CONFIRMADA: "Confirmed", REJEITADA: "Rejected", CANCELADA: "Cancelled", CONCLUIDA: "Completed" },
  },
} as const;

function localizedDateTime(value: string | undefined, locale: Locale) {
  return value ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default function AdminRequestsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const [status, setStatus] = useState<RequestStatus | "">("");
  const requests = useQuery({ queryKey: ["admin-requests", status], queryFn: () => carepointService.adminRequests(status || undefined) });

  return (
    <AppShell roles={["ADMIN"]}>
      <h1 className="page-title">{copy.title}</h1>
      <p className="mt-1 text-slate-500">{copy.subtitle}</p>
      <select aria-label={copy.status} value={status} onChange={(event) => setStatus(event.target.value as RequestStatus | "")} className="surface mt-5 rounded-xl border px-3 py-3 text-sm">
        <option value="">{copy.allStatuses}</option>
        {statuses.map((item) => <option key={item} value={item}>{copy.statuses[item]}</option>)}
      </select>
      <div className="surface mt-4 overflow-x-auto">
        {requests.isLoading ? (
          <Skeleton className="m-5 h-48" />
        ) : requests.data?.content.length ? (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500 dark:bg-slate-800">
              <tr><th className="p-4">{copy.patient}</th><th className="p-4">{copy.professional}</th><th className="p-4">{copy.date}</th><th className="p-4">{copy.status}</th><th className="p-4">{copy.action}</th></tr>
            </thead>
            <tbody>
              {requests.data.content.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4 font-semibold">{item.pacienteNome}</td>
                  <td className="p-4">{item.profissional.nome}</td>
                  <td className="p-4">{localizedDateTime(item.dataDesejada, locale)}</td>
                  <td className="p-4"><StatusBadge status={item.status} /></td>
                  <td className="p-4"><Link className="font-semibold text-brand-700" href={`/admin/solicitacoes/${item.id}`}>{copy.review}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6"><EmptyState title={copy.empty} description={copy.emptyDescription} /></div>
        )}
      </div>
    </AppShell>
  );
}
