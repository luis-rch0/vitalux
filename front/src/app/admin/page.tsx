"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarCheck2,
  CircleCheckBig,
  ClipboardCheck,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/cards";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/state";
import { useAdminDashboard } from "@/features/carepoint-hooks";
import { useI18n, type Locale } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";
import type { Dashboard, MonthlyMetrics } from "@/types/api";

const content = {
  "pt-BR": {
    kicker: "Central de gestão", title: "Visão geral da operação", subtitle: "Acompanhe cadastros, atendimentos e a evolução do CarePoint.", operational: "Sistema operacional", users: "Usuários", professionals: "Profissionais", clinics: "Clínicas", requests: "Solicitações", appointments: "Agendamentos", consultations: "Consultas realizadas", inMonth: "no mês", pending: "pendentes", confirmedOrCompleted: "Confirmados ou concluídos", completedCare: "Atendimentos concluídos", growth: "Crescimento", registrationsLast6: "Cadastros nos últimos 6 meses", care: "Atendimentos", requestStatus: "Status das solicitações", recentCare: "Atendimentos recentes", noRequests: "Nenhuma solicitação registrada.", monthSummary: "Resumo do mês", platformMovement: "Movimento da plataforma", newUsers: "Novos usuários", newProfessionals: "Novos profissionais", newClinics: "Novas clínicas", recentUsers: "Usuários recentes", partnerClinics: "Clínicas parceiras", professionalCount: "profissional(is)", fullList: "Lista completa", noRecords: "Nenhum registro.", viewAll: "Ver todos", registrations: "cadastro(s)", statusDistribution: "Distribuição das solicitações por status", total: "total", completed: "Concluídas", confirmed: "Confirmadas", rejectedCancelled: "Rejeitadas/canceladas" },
  en: {
    kicker: "Management center", title: "Operations overview", subtitle: "Track registrations, care services, and CarePoint growth.", operational: "System operational", users: "Users", professionals: "Professionals", clinics: "Clinics", requests: "Requests", appointments: "Appointments", consultations: "Completed consultations", inMonth: "this month", pending: "pending", confirmedOrCompleted: "Confirmed or completed", completedCare: "Completed care services", growth: "Growth", registrationsLast6: "Registrations in the last 6 months", care: "Care services", requestStatus: "Request status", recentCare: "Recent care services", noRequests: "No requests registered.", monthSummary: "Monthly summary", platformMovement: "Platform activity", newUsers: "New users", newProfessionals: "New professionals", newClinics: "New clinics", recentUsers: "Recent users", partnerClinics: "Partner clinics", professionalCount: "professional(s)", fullList: "Full list", noRecords: "No records.", viewAll: "View all", registrations: "registration(s)", statusDistribution: "Distribution of requests by status", total: "total", completed: "Completed", confirmed: "Confirmed", rejectedCancelled: "Rejected/cancelled" },
} as const;

function localizedDateTime(value: string | undefined, locale: Locale) {
  return value ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default function AdminHomePage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const dashboard = useAdminDashboard();
  const patients = useQuery({ queryKey: ["admin-dashboard-patients"], queryFn: () => carepointService.adminPatients({ page: 0, size: 5 }) });
  const professionals = useQuery({ queryKey: ["admin-dashboard-professionals"], queryFn: () => carepointService.adminProfessionals({ page: 0, size: 5 }) });
  const clinics = useQuery({ queryKey: ["admin-dashboard-clinics"], queryFn: () => carepointService.adminClinics({ page: 0, size: 5 }) });
  const data = dashboard.data;

  return (
    <AppShell roles={["ADMIN"]}>
      <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">{copy.kicker}</p>
          <h1 className="page-title mt-2">{copy.title}</h1>
          <p className="mt-2 text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm dark:bg-slate-900">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">{copy.operational}</span>
        </div>
      </div>

      {dashboard.isLoading ? <DashboardLoading /> : data && (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <Metric icon={<Users />} label={copy.users} value={data.totalPacientes} detail={`+${data.novosPacientesNoMes} ${copy.inMonth}`} href="/admin/pacientes" tone="emerald" />
            <Metric icon={<Stethoscope />} label={copy.professionals} value={data.totalProfissionais} detail={`+${data.novosProfissionaisNoMes} ${copy.inMonth}`} href="/admin/profissionais" tone="blue" />
            <Metric icon={<Building2 />} label={copy.clinics} value={data.totalClinicas} detail={`+${data.novasClinicasNoMes} ${copy.inMonth}`} href="/admin/clinicas" tone="violet" />
            <Metric icon={<ClipboardCheck />} label={copy.requests} value={data.totalSolicitacoes} detail={`${data.solicitacoesPendentes} ${copy.pending}`} href="/admin/solicitacoes" tone="amber" />
            <Metric icon={<CalendarCheck2 />} label={copy.appointments} value={data.agendamentosRealizados} detail={copy.confirmedOrCompleted} href="/admin/solicitacoes" tone="sky" />
            <Metric icon={<CircleCheckBig />} label={copy.consultations} value={data.consultasRealizadas} detail={copy.completedCare} href="/admin/solicitacoes" tone="rose" />
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
            <Card className="animate-rise overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5 md:px-6">
                <div><p className="admin-kicker">{copy.growth}</p><h2 className="mt-1 text-lg font-extrabold">{copy.registrationsLast6}</h2></div>
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500"><Legend color="bg-emerald-500" label={copy.users} /><Legend color="bg-sky-500" label={copy.professionals} /><Legend color="bg-violet-500" label={copy.clinics} /></div>
              </div>
              <RegistrationChart metrics={data.cadastrosPorMes} />
            </Card>
            <Card className="animate-rise">
              <p className="admin-kicker">{copy.care}</p>
              <h2 className="mt-1 text-lg font-extrabold">{copy.requestStatus}</h2>
              <StatusDonut data={data} />
            </Card>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <Card className="animate-rise p-0">
              <SectionHeader title={copy.recentCare} href="/admin/solicitacoes" />
              <div className="divide-y">
                {data.solicitacoesRecentes.length ? data.solicitacoesRecentes.map(item => (
                  <Link key={item.id} href={`/admin/solicitacoes/${item.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/70 md:px-6">
                    <span className="min-w-0"><strong className="block truncate text-sm">{item.pacienteNome}</strong><small className="mt-1 block truncate text-slate-500">{item.profissional.nome} · {localizedDateTime(item.createdAt, locale)}</small></span>
                    <StatusBadge status={item.status} />
                  </Link>
                )) : <p className="p-10 text-center text-sm text-slate-500">{copy.noRequests}</p>}
              </div>
            </Card>
            <Card className="animate-rise bg-gradient-to-br from-[#0d1729] to-[#143c2d] text-white">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300"><Activity /></span><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">{copy.monthSummary}</p><h2 className="mt-1 text-lg font-extrabold">{copy.platformMovement}</h2></div></div>
              <div className="mt-6 space-y-4"><MonthlyRow label={copy.newUsers} value={data.novosPacientesNoMes} /><MonthlyRow label={copy.newProfessionals} value={data.novosProfissionaisNoMes} /><MonthlyRow label={copy.newClinics} value={data.novasClinicasNoMes} /></div>
            </Card>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-3">
            <EntityList title={copy.recentUsers} href="/admin/pacientes" icon={<Users size={18} />} loading={patients.isLoading} items={patients.data?.content.map(item => ({ id: item.id, title: item.nome, subtitle: item.email })) || []} />
            <EntityList title={copy.professionals} href="/admin/profissionais" icon={<Stethoscope size={18} />} loading={professionals.isLoading} items={professionals.data?.content.map(item => ({ id: item.id, title: item.nome, subtitle: item.especialidade })) || []} />
            <EntityList title={copy.partnerClinics} href="/admin/clinicas" icon={<Building2 size={18} />} loading={clinics.isLoading} items={clinics.data?.content.map(item => ({ id: item.id, title: item.nome, subtitle: `${item.totalProfissionais} ${copy.professionalCount}` })) || []} />
          </div>
        </>
      )}
    </AppShell>
  );
}

const tones = {
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  blue: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  sky: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

function Metric({ icon, label, value, detail, href, tone }: { icon: React.ReactNode; label: string; value: number; detail: string; href: string; tone: keyof typeof tones }) {
  return <Link href={href} className="surface card-lift animate-rise p-5"><div className="flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}>{icon}</span><TrendingUp size={17} className="text-slate-300" /></div><strong className="mt-5 block text-3xl font-black">{value}</strong><span className="mt-1 block text-sm font-bold">{label}</span><small className="mt-2 block text-slate-500">{detail}</small></Link>;
}

function RegistrationChart({ metrics }: { metrics: MonthlyMetrics[] }) {
  const { locale } = useI18n();
  const max = Math.max(1, ...metrics.flatMap(item => [item.pacientes, item.profissionais, item.clinicas]));
  return <div className="overflow-x-auto px-5 pb-5 pt-7 md:px-6"><div className="flex h-64 min-w-[620px] items-end gap-5 border-b border-dashed pb-1">{metrics.map((item, index) => <div key={item.mes} className="flex h-full flex-1 flex-col justify-end"><div className="flex h-[210px] items-end justify-center gap-1.5"><Bar value={item.pacientes} max={max} className="bg-emerald-500" delay={index * 60} /><Bar value={item.profissionais} max={max} className="bg-sky-500" delay={index * 60 + 50} /><Bar value={item.clinicas} max={max} className="bg-violet-500" delay={index * 60 + 100} /></div><span className="mt-3 text-center text-xs font-bold capitalize text-slate-500">{monthLabel(item.mes, locale)}</span></div>)}</div></div>;
}

function Bar({ value, max, className, delay }: { value: number; max: number; className: string; delay: number }) {
  const { locale } = useI18n();
  const height = value ? Math.max(12, (value / max) * 100) : 3;
  return <div title={`${value} ${content[locale].registrations}`} className={`animate-bar relative w-3 rounded-t-md md:w-4 ${value ? className : "bg-slate-200 dark:bg-slate-700"}`} style={{ height: `${height}%`, animationDelay: `${delay}ms` }}><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">{value}</span></div>;
}

function StatusDonut({ data }: { data: Dashboard }) {
  const { locale } = useI18n();
  const copy = content[locale];
  const total = Math.max(1, data.totalSolicitacoes);
  const values = [data.solicitacoesConcluidas, data.solicitacoesConfirmadas, data.solicitacoesPendentes, data.solicitacoesRejeitadas + data.solicitacoesCanceladas];
  const percentages = values.map(value => (value / total) * 100);
  const p1 = percentages[0]; const p2 = p1 + percentages[1]; const p3 = p2 + percentages[2];
  const background = `conic-gradient(#10b981 0 ${p1}%, #0ea5e9 ${p1}% ${p2}%, #f59e0b ${p2}% ${p3}%, #f43f5e ${p3}% 100%)`;
  return <div className="mt-6 grid items-center gap-6 sm:grid-cols-[150px_1fr] xl:grid-cols-1 2xl:grid-cols-[150px_1fr]"><div className="relative mx-auto h-36 w-36 rounded-full" style={{ background }} role="img" aria-label={copy.statusDistribution}><div className="absolute inset-5 grid place-items-center rounded-full bg-white text-center dark:bg-slate-900"><span><strong className="block text-2xl">{data.totalSolicitacoes}</strong><small className="text-slate-500">{copy.total}</small></span></div></div><div className="space-y-3"><StatusLine color="bg-emerald-500" label={copy.completed} value={data.solicitacoesConcluidas} /><StatusLine color="bg-sky-500" label={copy.confirmed} value={data.solicitacoesConfirmadas} /><StatusLine color="bg-amber-500" label={copy.pending} value={data.solicitacoesPendentes} /><StatusLine color="bg-rose-500" label={copy.rejectedCancelled} value={data.solicitacoesRejeitadas + data.solicitacoesCanceladas} /></div></div>;
}

function EntityList({ title, href, icon, loading, items }: { title: string; href: string; icon: React.ReactNode; loading: boolean; items: { id: number; title: string; subtitle: string }[] }) {
  const { locale } = useI18n();
  const copy = content[locale];
  return <Card className="animate-rise p-0"><div className="flex items-center justify-between border-b p-5"><div className="flex items-center gap-2 font-extrabold"><span className="text-brand-700 dark:text-emerald-300">{icon}</span>{title}</div><Link href={href} className="text-xs font-bold text-brand-700 dark:text-emerald-300">{copy.fullList}</Link></div><div className="divide-y">{loading ? <Skeleton className="m-5 h-32" /> : items.length ? items.map(item => <div key={item.id} className="px-5 py-3"><strong className="block truncate text-sm">{item.title}</strong><small className="mt-1 block truncate text-slate-500">{item.subtitle}</small></div>) : <p className="p-8 text-center text-sm text-slate-500">{copy.noRecords}</p>}</div></Card>;
}

function SectionHeader({ title, href }: { title: string; href: string }) { const { locale } = useI18n(); return <div className="flex items-center justify-between border-b p-5 md:px-6"><h2 className="text-lg font-extrabold">{title}</h2><Link href={href} className="flex items-center gap-1 text-sm font-bold text-brand-700 dark:text-emerald-300">{content[locale].viewAll} <ArrowRight size={15} /></Link></div>; }
function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-1.5"><i className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>; }
function StatusLine({ color, label, value }: { color: string; label: string; value: number }) { return <div className="flex items-center justify-between gap-4 text-sm"><span className="flex items-center gap-2 text-slate-500"><i className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span><strong>{value}</strong></div>; }
function MonthlyRow({ label, value }: { label: string; value: number }) { return <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"><span className="text-sm text-slate-300">{label}</span><strong className="text-xl text-emerald-300">+{value}</strong></div>; }
function monthLabel(month: string, locale: Locale) { return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", { month: "short" }).format(new Date(`${month}-01T00:00:00Z`)).replace(".", ""); }
function DashboardLoading() { return <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></div>; }
