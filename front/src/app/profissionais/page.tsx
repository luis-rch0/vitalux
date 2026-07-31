"use client";

import { useState } from "react";
import { ChevronDown, Filter, Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProfessionalCard } from "@/components/cards";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { useClinics, useProfessionalSpecialties, useProfessionals } from "@/features/carepoint-hooks";
import { useI18n } from "@/providers/i18n-provider";

const professions = ["MEDICO", "ENFERMEIRO", "TECNICO_ENFERMAGEM", "CUIDADOR", "FISIOTERAPEUTA", "NUTRICIONISTA", "PSICOLOGO", "FONOAUDIOLOGO", "TERAPEUTA_OCUPACIONAL"] as const;

const filterShellClass = "relative flex min-h-12 items-center gap-2 rounded-xl border bg-white px-3 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 dark:bg-slate-900";
const filterFieldClass = "w-full appearance-none border-0 bg-transparent py-3 pr-7 !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0";

const content = {
  "pt-BR": {
    kicker: "Rede de cuidado",
    title: "Profissionais",
    subtitle: "Encontre especialistas disponíveis para atendimento em casa.",
    connectedFilters: "Filtros conectados à base",
    searchLabel: "Pesquisar profissional",
    searchPlaceholder: "Nome ou especialidade",
    profession: "Profissão",
    allProfessions: "Todas as profissões",
    specialty: "Especialidade",
    loadingSpecialties: "Carregando especialidades...",
    allSpecialties: "Todas as especialidades",
    clinic: "Clínica",
    allClinics: "Todas as clínicas",
    maxPrice: "Valor máximo",
    rating: "Avaliação",
    anyRating: "Qualquer avaliação",
    stars: "estrelas",
    sorting: "Ordenação",
    sortName: "Ordenar por nome",
    lowestPrice: "Menor valor",
    highestRating: "Maior avaliação",
    clearFilters: "Limpar filtros",
    result: "resultado",
    results: "resultados",
    noResults: "Nenhum profissional encontrado",
    noResultsDescription: "Ajuste os filtros ou tente outra busca.",
    previous: "Anterior",
    page: "Página",
    of: "de",
    next: "Próxima",
    professions: {
      MEDICO: "Médico",
      ENFERMEIRO: "Enfermeiro",
      TECNICO_ENFERMAGEM: "Técnico de enfermagem",
      CUIDADOR: "Cuidador",
      FISIOTERAPEUTA: "Fisioterapeuta",
      NUTRICIONISTA: "Nutricionista",
      PSICOLOGO: "Psicólogo",
      FONOAUDIOLOGO: "Fonoaudiólogo",
      TERAPEUTA_OCUPACIONAL: "Terapeuta ocupacional",
    },
  },
  en: {
    kicker: "Care network",
    title: "Professionals",
    subtitle: "Find available specialists for home care.",
    connectedFilters: "Filters connected to live data",
    searchLabel: "Search for a professional",
    searchPlaceholder: "Name or specialty",
    profession: "Profession",
    allProfessions: "All professions",
    specialty: "Specialty",
    loadingSpecialties: "Loading specialties...",
    allSpecialties: "All specialties",
    clinic: "Clinic",
    allClinics: "All clinics",
    maxPrice: "Maximum price",
    rating: "Rating",
    anyRating: "Any rating",
    stars: "stars",
    sorting: "Sorting",
    sortName: "Sort by name",
    lowestPrice: "Lowest price",
    highestRating: "Highest rating",
    clearFilters: "Clear filters",
    result: "result",
    results: "results",
    noResults: "No professionals found",
    noResultsDescription: "Adjust the filters or try a different search.",
    previous: "Previous",
    page: "Page",
    of: "of",
    next: "Next",
    professions: {
      MEDICO: "Physician",
      ENFERMEIRO: "Nurse",
      TECNICO_ENFERMAGEM: "Nursing technician",
      CUIDADOR: "Caregiver",
      FISIOTERAPEUTA: "Physical therapist",
      NUTRICIONISTA: "Nutritionist",
      PSICOLOGO: "Psychologist",
      FONOAUDIOLOGO: "Speech therapist",
      TERAPEUTA_OCUPACIONAL: "Occupational therapist",
    },
  },
} as const;

export default function ProfessionalsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const [filters, setFilters] = useState({ busca: "", profissao: "", especialidade: "", clinicaId: "", valorMax: "", avaliacaoMin: "", ordenacao: "NOME" });
  const [page, setPage] = useState(0);
  const data = useProfessionals({ ...filters, page, size: 12 });
  const clinics = useClinics({ size: 100 });
  const specialties = useProfessionalSpecialties();

  const update = (partial: Partial<typeof filters>) => {
    setPage(0);
    setFilters(current => ({ ...current, ...partial }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilters({ busca: "", profissao: "", especialidade: "", clinicaId: "", valorMax: "", avaliacaoMin: "", ordenacao: "NOME" });
  };

  return (
    <AppShell roles={["PACIENTE"]}>
      <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">{copy.kicker}</p>
          <h1 className="page-title mt-2">{copy.title}</h1>
          <p className="mt-2 text-slate-500">{copy.subtitle}</p>
        </div>
        <span className="hidden items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200 sm:inline-flex">
          <SlidersHorizontal size={16} /> {copy.connectedFilters}
        </span>
      </div>

      <div className="surface animate-rise mt-6 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className={filterShellClass}>
          <Search size={17} className="text-brand-600" />
          <span className="sr-only">{copy.searchLabel}</span>
          <input value={filters.busca} onChange={event => update({ busca: event.target.value })} className={`${filterFieldClass} pr-0`} placeholder={copy.searchPlaceholder} />
        </label>

        <FilterSelect label={copy.profession} value={filters.profissao} onChange={value => update({ profissao: value })}>
          <option value="">{copy.allProfessions}</option>
          {professions.map(item => <option key={item} value={item}>{copy.professions[item]}</option>)}
        </FilterSelect>

        <FilterSelect label={copy.specialty} value={filters.especialidade} onChange={value => update({ especialidade: value })} disabled={specialties.isLoading}>
          <option value="">{specialties.isLoading ? copy.loadingSpecialties : copy.allSpecialties}</option>
          {specialties.data?.map(item => <option key={item} value={item}>{item}</option>)}
        </FilterSelect>

        <FilterSelect label={copy.clinic} value={filters.clinicaId} onChange={value => update({ clinicaId: value })}>
          <option value="">{copy.allClinics}</option>
          {clinics.data?.content.map(clinic => <option key={clinic.id} value={clinic.id}>{clinic.nome}</option>)}
        </FilterSelect>

        <label className={filterShellClass}>
          <span className="sr-only">{copy.maxPrice}</span>
          <input type="number" min="0" value={filters.valorMax} onChange={event => update({ valorMax: event.target.value })} className={`${filterFieldClass} pr-0`} placeholder={copy.maxPrice} />
        </label>

        <FilterSelect label={copy.rating} value={filters.avaliacaoMin} onChange={value => update({ avaliacaoMin: value })}>
          <option value="">{copy.anyRating}</option>
          {[4, 3, 2, 1].map(value => <option key={value} value={value}>{value}+ {copy.stars}</option>)}
        </FilterSelect>

        <label className={filterShellClass}>
          <Filter size={17} className="text-brand-600" />
          <span className="sr-only">{copy.sorting}</span>
          <select value={filters.ordenacao} onChange={event => update({ ordenacao: event.target.value })} className={filterFieldClass}>
            <option value="NOME">{copy.sortName}</option>
            <option value="MENOR_VALOR">{copy.lowestPrice}</option>
            <option value="AVALIACAO">{copy.highestRating}</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-500" aria-hidden="true" />
        </label>

        <button type="button" onClick={clearFilters} className="rounded-xl border border-brand-200 px-4 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-200 dark:hover:bg-brand-900/40">
          {copy.clearFilters}
        </button>
      </div>

      <p className="mt-5 text-sm text-slate-500" aria-live="polite">{data.data?.totalElements ?? 0} {(data.data?.totalElements ?? 0) === 1 ? copy.result : copy.results}</p>
      {data.isLoading ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Skeleton className="h-96" /><Skeleton className="h-96" /><Skeleton className="h-96" /></div>
      ) : data.data?.content.length ? (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.data.content.map(item => <ProfessionalCard key={item.id} professional={item} />)}</div>
          <Pager page={page} total={data.data.totalPages} onChange={setPage} labels={{ previous: copy.previous, page: copy.page, of: copy.of, next: copy.next }} />
        </>
      ) : <div className="mt-4"><EmptyState title={copy.noResults} description={copy.noResultsDescription} /></div>}
    </AppShell>
  );
}

function FilterSelect({ label, value, onChange, children, disabled = false }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <label className={filterShellClass}>
      <span className="sr-only">{label}</span>
      <select aria-label={label} value={value} onChange={event => onChange(event.target.value)} disabled={disabled} className={`${filterFieldClass} disabled:cursor-wait disabled:opacity-60`}>{children}</select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-500" aria-hidden="true" />
    </label>
  );
}

function Pager({ page, total, onChange, labels }: { page: number; total: number; onChange: (page: number) => void; labels: { previous: string; page: string; of: string; next: string } }) {
  if (total <= 1) return null;
  return <div className="mt-6 flex items-center justify-center gap-3"><button disabled={page === 0} onClick={() => onChange(page - 1)} className="rounded-xl border px-4 py-2 disabled:opacity-50">{labels.previous}</button><span className="text-sm text-slate-500">{labels.page} {page + 1} {labels.of} {total}</span><button disabled={page >= total - 1} onClick={() => onChange(page + 1)} className="rounded-xl border px-4 py-2 disabled:opacity-50">{labels.next}</button></div>;
}
