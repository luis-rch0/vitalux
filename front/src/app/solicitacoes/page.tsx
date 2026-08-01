"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/cards";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { useMyRequests } from "@/features/carepoint-hooks";
import { useI18n, type Locale } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    title: "Minhas solicitações",
    subtitle: "Acompanhe cada etapa do seu atendimento domiciliar.",
    emptyTitle: "Você ainda não enviou solicitações",
    emptyDescription: "Encontre um profissional e solicite atendimento com poucos passos.",
  },
  en: {
    title: "My requests",
    subtitle: "Track every stage of your home care service.",
    emptyTitle: "You have not submitted any requests yet",
    emptyDescription: "Find a professional and request care in just a few steps.",
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

export default function RequestsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const requests = useMyRequests();

  return (
    <AppShell roles={["PACIENTE"]}>
      <h1 className="page-title">{copy.title}</h1>
      <p className="mt-1 text-slate-500">{copy.subtitle}</p>

      {requests.isLoading ? (
        <Skeleton className="mt-6 h-60" />
      ) : requests.data?.content.length ? (
        <div className="mt-6 space-y-3">
          {requests.data.content.map((item) => (
            <Link key={item.id} href={`/solicitacoes/${item.id}`} className="surface block p-5 transition hover:ring-2 hover:ring-brand-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{item.profissional.nome}</h2>
                  <p className="mt-1 text-sm text-slate-500">{item.servicoSolicitado} · {localizedDateTime(item.dataDesejada, locale)}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-3 text-sm font-semibold text-brand-700 dark:text-brand-300">{localizedCurrency(item.valor, locale)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
        </div>
      )}
    </AppShell>
  );
}
