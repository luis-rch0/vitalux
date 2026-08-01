"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": { search: "Pesquisar", records: "registro(s)", page: "Página", of: "de", previous: "Página anterior", next: "Próxima página" },
  en: { search: "Search", records: "record(s)", page: "Page", of: "of", previous: "Previous page", next: "Next page" },
} as const;

export function AdminSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const { locale } = useI18n();
  return <label className="relative block w-full max-w-md"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><span className="sr-only">{content[locale].search}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm shadow-sm transition focus:border-brand-500 dark:bg-slate-900" /></label>;
}

export function AdminPagination({ page, totalPages, totalElements, onPage }: { page: number; totalPages: number; totalElements: number; onPage: (page: number) => void }) {
  const { locale } = useI18n();
  const copy = content[locale];
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-sm"><span className="text-slate-500">{totalElements} {copy.records} · {copy.page} {totalPages ? page + 1 : 0} {copy.of} {totalPages}</span><div className="flex gap-2"><button disabled={page <= 0} onClick={() => onPage(page - 1)} className="grid h-9 w-9 place-items-center rounded-xl border transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800" aria-label={copy.previous}><ChevronLeft size={17} /></button><button disabled={page + 1 >= totalPages} onClick={() => onPage(page + 1)} className="grid h-9 w-9 place-items-center rounded-xl border transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800" aria-label={copy.next}><ChevronRight size={17} /></button></div></div>;
}
