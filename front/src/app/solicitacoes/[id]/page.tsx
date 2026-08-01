"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/state";
import { useCancelRequest, useRequest } from "@/features/carepoint-hooks";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n, type Locale } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";

const content = {
  "pt-BR": {
    confirmCancel: "Cancelar esta solicitação?",
    cancelled: "Solicitação cancelada.",
    reviewSent: "Avaliação enviada. Obrigado!",
    notFound: "Solicitação não encontrada.",
    back: "← Voltar",
    professional: "Profissional",
    desiredDate: "Data desejada",
    price: "Valor",
    address: "Endereço",
    needs: "Necessidades",
    adminMessage: "Mensagem da administração",
    cancelRequest: "Cancelar solicitação",
    reviewTitle: "Avalie o atendimento",
    score: "Nota",
    stars: "estrela(s)",
    comment: "Comentário (opcional)",
    submitReview: "Enviar avaliação",
  },
  en: {
    confirmCancel: "Cancel this request?",
    cancelled: "Request cancelled.",
    reviewSent: "Review submitted. Thank you!",
    notFound: "Request not found.",
    back: "← Back",
    professional: "Professional",
    desiredDate: "Preferred date",
    price: "Price",
    address: "Address",
    needs: "Care needs",
    adminMessage: "Message from the administration team",
    cancelRequest: "Cancel request",
    reviewTitle: "Review this service",
    score: "Rating",
    stars: "star(s)",
    comment: "Comment (optional)",
    submitReview: "Submit review",
  },
} as const;

function localizedDateTime(value: string | undefined, locale: Locale) {
  return value
    ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";
}

function localizedCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function RequestDetailPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const { id } = useParams<{ id: string }>();
  const request = useRequest(id);
  const cancel = useCancelRequest();
  const router = useRouter();
  const [score, setScore] = useState("5");
  const [comment, setComment] = useState("");
  const item = request.data;

  const doCancel = async () => {
    if (!item || !window.confirm(copy.confirmCancel)) return;
    try {
      await cancel.mutateAsync(item.id);
      toast.success(copy.cancelled);
      await request.refetch();
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  const review = async () => {
    if (!item) return;
    try {
      await carepointService.reviewRequest(item.id, { nota: Number(score), comentario: comment });
      toast.success(copy.reviewSent);
      await request.refetch();
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  if (request.isLoading) return <AppShell roles={["PACIENTE"]}><Skeleton className="h-96" /></AppShell>;
  if (!item) return <AppShell roles={["PACIENTE"]}><p>{copy.notFound}</p></AppShell>;

  return (
    <AppShell roles={["PACIENTE"]}>
      <button onClick={() => router.back()} className="text-sm font-semibold text-brand-700">{copy.back}</button>
      <Card className="mt-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="page-title">{item.servicoSolicitado}</h1>
            <p className="mt-1 text-slate-500">{copy.professional}: {item.profissional.nome}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <Detail label={copy.desiredDate} value={localizedDateTime(item.dataDesejada, locale)} />
          <Detail label={copy.price} value={localizedCurrency(item.valor, locale)} />
          <Detail label={copy.address} value={item.enderecoAtendimento} />
          <Detail label={copy.needs} value={item.necessidadesInformadas} />
        </dl>

        {item.observacaoAdministrador && (
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <strong>{copy.adminMessage}</strong>
            <p className="mt-1">{item.observacaoAdministrador}</p>
          </div>
        )}

        {(item.status === "PENDENTE" || item.status === "CONFIRMADA") && (
          <Button variant="danger" className="mt-7" onClick={() => void doCancel()} disabled={cancel.isPending}>
            {copy.cancelRequest}
          </Button>
        )}
      </Card>

      {item.podeAvaliar && (
        <Card className="mt-5">
          <h2 className="text-lg font-bold">{copy.reviewTitle}</h2>
          <label className="mt-4 block text-sm font-medium">
            {copy.score}
            <select value={score} onChange={(event) => setScore(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3">
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} {copy.stars}</option>)}
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium">
            {copy.comment}
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3" />
          </label>
          <Button className="mt-4" onClick={() => void review()}>{copy.submitReview}</Button>
        </Card>
      )}
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;
}
