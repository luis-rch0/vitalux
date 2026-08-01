"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/state";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n, type Locale } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";

type Action = "confirmar" | "rejeitar" | "concluir";

const content = {
  "pt-BR": {
    rejectionRequired: "Informe uma justificativa para rejeitar.", confirmAction: "Confirmar ação", updated: "Solicitação atualizada.", notFound: "Solicitação não encontrada.", back: "← Voltar", request: "Solicitação", patient: "Paciente", professional: "Profissional", desiredDate: "Data desejada", price: "Valor", address: "Endereço", needs: "Necessidades", rejectionNote: "Justificativa em caso de rejeição", confirm: "Confirmar", reject: "Rejeitar", complete: "Marcar como concluída", actions: { confirmar: "confirmar", rejeitar: "rejeitar", concluir: "concluir" },
  },
  en: {
    rejectionRequired: "Provide a reason before rejecting this request.", confirmAction: "Confirm action", updated: "Request updated.", notFound: "Request not found.", back: "← Back", request: "Request", patient: "Patient", professional: "Professional", desiredDate: "Preferred date", price: "Price", address: "Address", needs: "Care needs", rejectionNote: "Reason for rejection", confirm: "Confirm", reject: "Reject", complete: "Mark as completed", actions: { confirmar: "confirm", rejeitar: "reject", concluir: "complete" },
  },
} as const;

function localizedDateTime(value: string | undefined, locale: Locale) {
  return value ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

function localizedCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function AdminRequestDetailPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const client = useQueryClient();
  const request = useQuery({ queryKey: ["admin-request", id], queryFn: () => carepointService.adminRequest(id) });
  const [note, setNote] = useState("");
  const item = request.data;

  const action = async (name: Action) => {
    if (!item) return;
    if (name === "rejeitar" && !note.trim()) {
      toast.error(copy.rejectionRequired);
      return;
    }
    if (!window.confirm(`${copy.confirmAction}: ${copy.actions[name]}?`)) return;
    try {
      await carepointService.updateRequestStatus(item.id, name, name === "rejeitar" ? note : undefined);
      toast.success(copy.updated);
      await request.refetch();
      await client.invalidateQueries({ queryKey: ["admin-requests"] });
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  if (request.isLoading) return <AppShell roles={["ADMIN"]}><Skeleton className="h-96" /></AppShell>;
  if (!item) return <AppShell roles={["ADMIN"]}><p>{copy.notFound}</p></AppShell>;

  return (
    <AppShell roles={["ADMIN"]}>
      <button onClick={() => router.back()} className="text-sm font-semibold text-brand-700">{copy.back}</button>
      <Card className="mt-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h1 className="page-title">{copy.request} #{item.id}</h1><p className="mt-1 text-slate-500">{item.servicoSolicitado}</p></div>
          <StatusBadge status={item.status} />
        </div>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <Detail label={copy.patient} value={item.pacienteNome} />
          <Detail label={copy.professional} value={item.profissional.nome} />
          <Detail label={copy.desiredDate} value={localizedDateTime(item.dataDesejada, locale)} />
          <Detail label={copy.price} value={localizedCurrency(item.valor, locale)} />
          <Detail label={copy.address} value={item.enderecoAtendimento} />
          <Detail label={copy.needs} value={item.necessidadesInformadas} />
        </dl>

        {item.status === "PENDENTE" && (
          <div className="mt-7 space-y-3">
            <label className="block text-sm font-medium">
              {copy.rejectionNote}
              <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3" />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void action("confirmar")}>{copy.confirm}</Button>
              <Button variant="danger" onClick={() => void action("rejeitar")}>{copy.reject}</Button>
            </div>
          </div>
        )}
        {item.status === "CONFIRMADA" && <Button className="mt-7" onClick={() => void action("concluir")}>{copy.complete}</Button>}
      </Card>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;
}
