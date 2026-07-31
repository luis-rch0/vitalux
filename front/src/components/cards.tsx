"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, Star } from "lucide-react";
import type { Clinic, Professional, RequestStatus } from "@/types/api";
import { useI18n, type Locale } from "@/providers/i18n-provider";

const cardCopy = {
  "pt-BR": {
    photoOf: "Foto de",
    homeCare: "Atendimento domiciliar",
    viewProfile: "Ver perfil",
    clinicFront: "Fachada da",
    professionals: "profissional(is)",
    viewDetails: "Ver detalhes",
    statuses: {
      PENDENTE: "Pendente",
      CONFIRMADA: "Confirmada",
      REJEITADA: "Rejeitada",
      CANCELADA: "Cancelada",
      CONCLUIDA: "Concluída",
    },
  },
  en: {
    photoOf: "Photo of",
    homeCare: "Home care",
    viewProfile: "View profile",
    clinicFront: "Front of",
    professionals: "professional(s)",
    viewDetails: "View details",
    statuses: {
      PENDENTE: "Pending",
      CONFIRMADA: "Confirmed",
      REJEITADA: "Rejected",
      CANCELADA: "Cancelled",
      CONCLUIDA: "Completed",
    },
  },
} as const;

function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const { locale } = useI18n();
  const copy = cardCopy[locale];

  return (
    <article className="surface card-lift animate-rise group overflow-hidden p-3">
      <div className="relative h-48 overflow-hidden rounded-2xl bg-brand-50 dark:bg-slate-800">
        <img
          src={professional.fotoUrl || fallbackProfessional(professional.id)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          alt={`${copy.photoOf} ${professional.nome}`}
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-brand-700 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-emerald-300">
          {formatCurrency(professional.valorAtendimento, locale)}
        </span>
      </div>
      <div className="p-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-slate-950 dark:text-white">{professional.nome}</h3>
            <p className="mt-0.5 truncate text-sm text-slate-500">{professional.especialidade}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <Star size={14} fill="currentColor" /> {professional.mediaAvaliacoes.toFixed(1)}
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 truncate text-xs text-slate-500"><Building2 size={13} />{professional.clinica?.nome || copy.homeCare}</p>
        <Link className="mt-4 flex items-center justify-between rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700" href={`/profissionais/${professional.id}`}>
          {copy.viewProfile} <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export function ClinicCard({ clinic }: { clinic: Clinic }) {
  const { locale } = useI18n();
  const copy = cardCopy[locale];

  return (
    <article className="surface card-lift animate-rise group overflow-hidden">
      <div className="h-36 overflow-hidden bg-brand-50 dark:bg-slate-800">
        <img
          src={clinic.imagemUrl || "/images/clinica-carepoint.png"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          alt={`${copy.clinicFront} ${clinic.nome}`}
        />
      </div>
      <div className="p-5">
        <h3 className="truncate text-lg font-extrabold">{clinic.nome}</h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500"><MapPin size={15} className="mt-0.5 shrink-0" />{clinic.endereco}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">{clinic.totalProfissionais} {copy.professionals}</span>
          <Link className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 dark:text-brand-300" href={`/clinicas/${clinic.id}`}>{copy.viewDetails} <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  );
}

export function Avatar({ name, url, id = 1 }: { name: string; url?: string; id?: number }) {
  const { locale } = useI18n();

  return (
    <img
      src={url || fallbackProfessional(id)}
      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      alt={`${cardCopy[locale].photoOf} ${name}`}
    />
  );
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const { locale } = useI18n();
  const colors: Record<RequestStatus, string> = {
    PENDENTE: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    CONFIRMADA: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
    REJEITADA: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
    CANCELADA: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    CONCLUIDA: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status]}`}>{cardCopy[locale].statuses[status]}</span>;
}

function fallbackProfessional(id: number) {
  return id % 2 === 0 ? "/images/fisioterapeuta-carepoint.png" : "/images/medica-carepoint.png";
}
