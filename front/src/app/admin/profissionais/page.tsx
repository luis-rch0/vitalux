"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { AdminPagination, AdminSearch } from "@/components/admin/admin-list";
import { Avatar } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { carepointService } from "@/services/carepoint";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    kicker: "Equipe assistencial", title: "Profissionais", subtitle: "Lista de médicos e demais profissionais disponíveis para atendimento.", newProfessional: "Novo profissional", search: "Pesquisar profissional...", count: "profissional(is)", professional: "Profissional", profession: "Profissão", clinic: "Clínica", status: "Status", actions: "Ações", independent: "Independente", active: "Ativo", inactive: "Inativo", edit: "Editar", activate: "Ativar", deactivate: "Desativar", confirmActivate: "Ativar este profissional?", confirmDeactivate: "Desativar este profissional?", statusUpdated: "Status atualizado.", empty: "Nenhum profissional encontrado", emptyDescription: "Cadastre um profissional ou ajuste a pesquisa.",
    professions: { MEDICO: "Médico", ENFERMEIRO: "Enfermeiro", TECNICO_ENFERMAGEM: "Técnico de enfermagem", CUIDADOR: "Cuidador", FISIOTERAPEUTA: "Fisioterapeuta", NUTRICIONISTA: "Nutricionista", PSICOLOGO: "Psicólogo", FONOAUDIOLOGO: "Fonoaudiólogo", TERAPEUTA_OCUPACIONAL: "Terapeuta ocupacional" },
  },
  en: {
    kicker: "Care team", title: "Professionals", subtitle: "List of physicians and other professionals available for care.", newProfessional: "New professional", search: "Search professionals...", count: "professional(s)", professional: "Professional", profession: "Profession", clinic: "Clinic", status: "Status", actions: "Actions", independent: "Independent", active: "Active", inactive: "Inactive", edit: "Edit", activate: "Activate", deactivate: "Deactivate", confirmActivate: "Activate this professional?", confirmDeactivate: "Deactivate this professional?", statusUpdated: "Status updated.", empty: "No professionals found", emptyDescription: "Register a professional or adjust your search.",
    professions: { MEDICO: "Physician", ENFERMEIRO: "Nurse", TECNICO_ENFERMAGEM: "Nursing technician", CUIDADOR: "Caregiver", FISIOTERAPEUTA: "Physical therapist", NUTRICIONISTA: "Nutritionist", PSICOLOGO: "Psychologist", FONOAUDIOLOGO: "Speech therapist", TERAPEUTA_OCUPACIONAL: "Occupational therapist" },
  },
} as const;

export default function AdminProfessionalsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const professionals = useQuery({ queryKey: ["admin-professionals", search, page], queryFn: () => carepointService.adminProfessionals({ busca: search || undefined, page, size: 12 }) });
  const data = professionals.data;

  const toggle = async (id: number, active: boolean) => {
    if (!window.confirm(active ? copy.confirmDeactivate : copy.confirmActivate)) return;
    try { await carepointService.setProfessionalStatus(id, !active); await client.invalidateQueries({ queryKey: ["admin-professionals"] }); toast.success(copy.statusUpdated); }
    catch (error) { toast.error(authErrorMessage(error)); }
  };

  return <AppShell roles={["ADMIN"]}>
    <div className="animate-rise flex flex-wrap items-end justify-between gap-4"><div><p className="admin-kicker">{copy.kicker}</p><h1 className="page-title mt-2">{copy.title}</h1><p className="mt-2 text-slate-500">{copy.subtitle}</p></div><Link href="/admin/profissionais/novo"><Button><Plus size={18} className="mr-2" />{copy.newProfessional}</Button></Link></div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><AdminSearch value={search} onChange={value => { setSearch(value); setPage(0); }} placeholder={copy.search} /><span className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">{data?.totalElements || 0} {copy.count}</span></div>
    <div className="surface animate-rise mt-5 overflow-hidden">
      {professionals.isLoading ? <Skeleton className="m-5 h-64" /> : data?.content.length ? <div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="p-4">{copy.professional}</th><th className="p-4">{copy.profession}</th><th className="p-4">{copy.clinic}</th><th className="p-4">{copy.status}</th><th className="p-4 text-right">{copy.actions}</th></tr></thead><tbody>{data.content.map(item => <tr key={item.id} className="border-b transition last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/60"><td className="p-4"><div className="flex items-center gap-3"><Avatar name={item.nome} url={item.fotoUrl} id={item.id} /><span><strong className="block">{item.nome}</strong><small className="mt-1 block text-slate-500">{item.especialidade}</small></span></div></td><td className="p-4 font-medium">{copy.professions[item.profissao as keyof typeof copy.professions] || item.profissao.replaceAll("_", " ")}</td><td className="p-4">{item.clinica?.nome || copy.independent}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.ativo ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{item.ativo ? copy.active : copy.inactive}</span></td><td className="p-4 text-right"><div className="flex justify-end gap-3"><Link href={`/admin/profissionais/${item.id}/editar`} className="font-bold text-brand-700 dark:text-emerald-300">{copy.edit}</Link><button onClick={() => void toggle(item.id, item.ativo)} className="font-bold text-rose-600">{item.ativo ? copy.deactivate : copy.activate}</button></div></td></tr>)}</tbody></table></div> : <div className="p-8"><EmptyState title={copy.empty} description={copy.emptyDescription} /></div>}
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPage={setPage} />}
    </div>
  </AppShell>;
}
