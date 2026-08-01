"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ClinicCard } from "@/components/cards";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { useClinics } from "@/features/carepoint-hooks";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    title: "Clínicas",
    subtitle: "Conheça as clínicas parceiras do CarePoint.",
    searchLabel: "Pesquisar clínicas",
    searchPlaceholder: "Buscar por nome ou endereço",
    previous: "Anterior",
    page: "Página",
    of: "de",
    next: "Próxima",
    emptyTitle: "Nenhuma clínica encontrada",
    emptyDescription: "Tente outro termo de busca.",
  },
  en: {
    title: "Clinics",
    subtitle: "Discover CarePoint partner clinics.",
    searchLabel: "Search clinics",
    searchPlaceholder: "Search by name or address",
    previous: "Previous",
    page: "Page",
    of: "of",
    next: "Next",
    emptyTitle: "No clinics found",
    emptyDescription: "Try a different search term.",
  },
} as const;

export default function ClinicsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(0);
  const clinics = useClinics({ busca, page, size: 12 });

  return (
    <AppShell roles={["PACIENTE"]}>
      <h1 className="page-title">{copy.title}</h1>
      <p className="mt-1 text-slate-500">{copy.subtitle}</p>

      <label className="surface mt-6 flex items-center gap-2 p-3">
        <Search size={18} className="text-brand-600" />
        <span className="sr-only">{copy.searchLabel}</span>
        <input
          value={busca}
          onChange={(event) => {
            setBusca(event.target.value);
            setPage(0);
          }}
          className="w-full border-0"
          placeholder={copy.searchPlaceholder}
        />
      </label>

      {clinics.isLoading ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : clinics.data?.content.length ? (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clinics.data.content.map((item) => <ClinicCard key={item.id} clinic={item} />)}
          </div>
          {clinics.data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-xl border px-4 py-2 disabled:opacity-50">
                {copy.previous}
              </button>
              <span className="text-sm text-slate-500">{copy.page} {page + 1} {copy.of} {clinics.data.totalPages}</span>
              <button disabled={page >= clinics.data.totalPages - 1} onClick={() => setPage(page + 1)} className="rounded-xl border px-4 py-2 disabled:opacity-50">
                {copy.next}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-5">
          <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
        </div>
      )}
    </AppShell>
  );
}
