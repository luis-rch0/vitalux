"use client";

import { QueryError } from "@/components/ui/query-error";
import { CareOverview } from "@/features/requests/care-overview";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Search,
  MessageCircle,
  Settings,
  Stethoscope,
  UserRoundPen,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ClinicCard, ProfessionalCard, StatusBadge } from "@/components/cards";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { usePatientDashboard } from "@/features/carepoint-hooks";
import { useI18n, type Locale } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    kicker: "Seu cuidado, do seu jeito",
    hello: "Olá",
    subtitle: "Encontre profissionais e acompanhe seus atendimentos domiciliares.",
    editProfile: "Editar perfil",
    settings: "Configurações",
    homeCare: "Atendimento domiciliar",
    heroTitle: "Cuidado especializado, onde você se sente melhor.",
    heroDescription:
      "Compare especialidades, valores e avaliações para escolher o profissional ideal.",
    findProfessional: "Encontrar profissional",
    professionalAlt: "Profissional de saúde CarePoint",
    recommendedProfessionals: "Profissionais recomendados",
    availableClinics: "Clínicas disponíveis",
    pendingRequests: "Solicitações pendentes",
    selectedSubtitle: "Selecionados por avaliação e disponibilidade",
    noProfessionals: "Ainda não há profissionais",
    noProfessionalsDescription: "Volte em breve ou consulte as clínicas disponíveis.",
    partnerClinics: "Clínicas parceiras",
    clinicsSubtitle: "Estruturas preparadas para apoiar seu cuidado",
    noClinics: "Nenhuma clínica disponível",
    noClinicsDescription: "Assim que clínicas forem cadastradas, elas aparecerão aqui.",
    recentCare: "Atendimentos recentes",
    waitingSuffix: "solicitação(ões) aguardando andamento",
    professional: "Profissional",
    date: "Data",
    status: "Status",
    noRequests: "Nenhuma solicitação ainda",
    noRequestsDescription: "Escolha um profissional para solicitar atendimento.",
    viewAll: "Ver tudo →",
  },
  en: {
    kicker: "Your care, your way",
    hello: "Hello",
    subtitle: "Find professionals and track your home care services.",
    editProfile: "Edit profile",
    settings: "Settings",
    homeCare: "Home care",
    heroTitle: "Specialized care, where you feel your best.",
    heroDescription: "Compare specialties, prices, and reviews to choose the right professional.",
    findProfessional: "Find a professional",
    professionalAlt: "CarePoint healthcare professional",
    recommendedProfessionals: "Recommended professionals",
    availableClinics: "Available clinics",
    pendingRequests: "Pending requests",
    selectedSubtitle: "Selected by rating and availability",
    noProfessionals: "No professionals yet",
    noProfessionalsDescription: "Come back soon or browse the available clinics.",
    partnerClinics: "Partner clinics",
    clinicsSubtitle: "Facilities prepared to support your care",
    noClinics: "No clinics available",
    noClinicsDescription: "New clinics will appear here as soon as they are registered.",
    recentCare: "Recent care requests",
    waitingSuffix: "request(s) waiting for an update",
    professional: "Professional",
    date: "Date",
    status: "Status",
    noRequests: "No requests yet",
    noRequestsDescription: "Choose a professional to request home care.",
    viewAll: "View all →",
  },
} as const;

function localizedDateTime(value: string | undefined, locale: Locale) {
  return value
    ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
}

export default function PatientHomePage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const dashboard = usePatientDashboard();
  const data = dashboard.data;

  return (
    <AppShell roles={["PACIENTE"]}>
      <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">{copy.kicker}</p>
          <h1 className="page-title mt-2">
            {copy.hello}, {data?.paciente.nome?.split(" ")[0] || ""}
          </h1>
          <p className="mt-2 text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Shortcut
            href="/perfil/editar"
            label={copy.editProfile}
            icon={<UserRoundPen size={18} />}
          />
          <Shortcut href="/configuracoes" label={copy.settings} icon={<Settings size={18} />} />
        </div>
      </div>

      <section className="care-welcome mt-8 grid overflow-hidden lg:grid-cols-[1.35fr_1fr]">
        <div className="p-7 md:p-10">
          <p className="care-eyebrow">
            CAREPOINT / {locale === "en" ? "YOUR CARE SPACE" : "SEU ESPAÇO DE CUIDADO"}
          </p>
          <h2 className="mt-6 max-w-lg font-display text-4xl leading-[1.08] md:text-6xl">
            {locale === "en" ? "More presence. Better care." : "Mais presença. Mais cuidado."}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 opacity-80">{copy.heroDescription}</p>
          <Link
            href="/profissionais"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173f35]"
          >
            <Search size={18} /> {copy.findProfessional} <ArrowRight size={18} />
          </Link>
        </div>
        <div className="care-welcome-aside flex flex-col justify-between gap-8 p-7 md:p-10">
          <div className="flex items-center justify-between border-b border-current/20 pb-4">
            <span className="care-eyebrow">
              {locale === "en" ? "ONE STEP AT A TIME" : "UM PASSO DE CADA VEZ"}
            </span>
            <span className="font-display text-3xl">01—03</span>
          </div>
          <ol className="space-y-5 text-sm">
            {(locale === "en"
              ? ["Find the right professional", "Choose when and where", "Follow your request"]
              : ["Encontre seu profissional", "Escolha quando e onde", "Acompanhe sua solicitação"]
            ).map((label, i) => (
              <li key={label} className="flex items-center gap-4">
                <span className="care-step">0{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <button
            onClick={() => window.dispatchEvent(new Event("carepoint:open-assistant"))}
            className="flex items-center justify-between border-t border-current/20 pt-5 text-left text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <MessageCircle size={18} />
              {locale === "en" ? "Let’s find your next step" : "Vamos encontrar seu próximo passo"}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {dashboard.isError ? (
        <QueryError retry={dashboard.refetch} />
      ) : dashboard.isLoading ? (
        <DashboardSkeleton />
      ) : (
        data && (
          <>
            <CareOverview requests={data.solicitacoesRecentes} />
            <div className="care-metrics mt-6 grid sm:grid-cols-3">
              <QuickStat
                icon={<Stethoscope />}
                value={data.profissionaisRecomendados.length}
                label={copy.recommendedProfessionals}
              />
              <QuickStat
                icon={<Building2 />}
                value={data.clinicasDisponiveis.length}
                label={copy.availableClinics}
              />
              <QuickStat
                icon={<CalendarClock />}
                value={data.solicitacoesPendentes}
                label={copy.pendingRequests}
              />
            </div>

            <Section
              title={copy.recommendedProfessionals}
              subtitle={copy.selectedSubtitle}
              href="/profissionais"
              viewAllLabel={copy.viewAll}
            >
              {data.profissionaisRecomendados.length ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {data.profissionaisRecomendados.map((item) => (
                    <ProfessionalCard key={item.id} professional={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={copy.noProfessionals}
                  description={copy.noProfessionalsDescription}
                />
              )}
            </Section>

            <Section
              title={copy.partnerClinics}
              subtitle={copy.clinicsSubtitle}
              href="/clinicas"
              viewAllLabel={copy.viewAll}
            >
              {data.clinicasDisponiveis.length ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {data.clinicasDisponiveis.map((item) => (
                    <ClinicCard key={item.id} clinic={item} />
                  ))}
                </div>
              ) : (
                <EmptyState title={copy.noClinics} description={copy.noClinicsDescription} />
              )}
            </Section>

            <Section
              title={copy.recentCare}
              subtitle={`${data.solicitacoesPendentes} ${copy.waitingSuffix}`}
              href="/solicitacoes"
              viewAllLabel={copy.viewAll}
            >
              {data.solicitacoesRecentes.length ? (
                <Card className="overflow-x-auto p-0">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800">
                      <tr>
                        <th className="p-4">{copy.professional}</th>
                        <th className="p-4">{copy.date}</th>
                        <th className="p-4">{copy.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.solicitacoesRecentes.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t transition hover:bg-brand-50/50 dark:hover:bg-slate-800/60"
                        >
                          <td className="p-4 font-semibold">{item.profissional.nome}</td>
                          <td className="p-4">{localizedDateTime(item.dataDesejada, locale)}</td>
                          <td className="p-4">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              ) : (
                <EmptyState title={copy.noRequests} description={copy.noRequestsDescription} />
              )}
            </Section>
          </>
        )
      )}
    </AppShell>
  );
}

function Section({
  title,
  subtitle,
  href,
  viewAllLabel,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  viewAllLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-normal md:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <Link href={href} className="shrink-0 text-sm font-bold text-brand-700 dark:text-brand-300">
          {viewAllLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

function QuickStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
        {icon}
      </span>
      <span>
        <strong className="block text-xl">{value}</strong>
        <small className="text-slate-500">{label}</small>
      </span>
    </div>
  );
}

function Shortcut({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-700 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-900 dark:text-brand-300"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mt-7 grid gap-4 md:grid-cols-3">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}
