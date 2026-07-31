"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { AdminPagination, AdminSearch } from "@/components/admin/admin-list";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { carepointService } from "@/services/carepoint";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": { kicker: "Rede parceira", title: "Clínicas", subtitle: "Lista completa das clínicas vinculadas ao CarePoint.", newClinic: "Nova clínica", search: "Pesquisar clínica...", count: "clínica(s)", clinic: "Clínica", contact: "Contato", professionals: "Profissionais", status: "Status", actions: "Ações", active: "Ativa", inactive: "Inativa", edit: "Editar", activate: "Ativar", deactivate: "Desativar", confirmActivate: "Ativar esta clínica?", confirmDeactivate: "Desativar esta clínica?", updated: "Status atualizado.", empty: "Nenhuma clínica encontrada", emptyDescription: "Cadastre uma clínica ou ajuste a pesquisa.", imageAlt: "Imagem da clínica" },
  en: { kicker: "Partner network", title: "Clinics", subtitle: "Complete list of clinics connected to CarePoint.", newClinic: "New clinic", search: "Search clinics...", count: "clinic(s)", clinic: "Clinic", contact: "Contact", professionals: "Professionals", status: "Status", actions: "Actions", active: "Active", inactive: "Inactive", edit: "Edit", activate: "Activate", deactivate: "Deactivate", confirmActivate: "Activate this clinic?", confirmDeactivate: "Deactivate this clinic?", updated: "Status updated.", empty: "No clinics found", emptyDescription: "Register a clinic or adjust your search.", imageAlt: "Image of clinic" },
} as const;

export default function AdminClinicsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const clinics = useQuery({ queryKey: ["admin-clinics", search, page], queryFn: () => carepointService.adminClinics({ busca: search || undefined, page, size: 12 }) });
  const data = clinics.data;

  const toggle = async (id: number, active: boolean) => {
    if (!window.confirm(active ? copy.confirmDeactivate : copy.confirmActivate)) return;
    try { await carepointService.setClinicStatus(id, !active); await client.invalidateQueries({ queryKey: ["admin-clinics"] }); toast.success(copy.updated); }
    catch (error) { toast.error(authErrorMessage(error)); }
  };

  return <AppShell roles={["ADMIN"]}>
    <div className="animate-rise flex flex-wrap items-end justify-between gap-4"><div><p className="admin-kicker">{copy.kicker}</p><h1 className="page-title mt-2">{copy.title}</h1><p className="mt-2 text-slate-500">{copy.subtitle}</p></div><Link href="/admin/clinicas/novo"><Button><Plus size={18} className="mr-2" />{copy.newClinic}</Button></Link></div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><AdminSearch value={search} onChange={value => { setSearch(value); setPage(0); }} placeholder={copy.search} /><span className="rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">{data?.totalElements || 0} {copy.count}</span></div>
    <div className="surface animate-rise mt-5 overflow-hidden">
      {clinics.isLoading ? <Skeleton className="m-5 h-64" /> : data?.content.length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="p-4">{copy.clinic}</th><th className="p-4">{copy.contact}</th><th className="p-4">{copy.professionals}</th><th className="p-4">{copy.status}</th><th className="p-4 text-right">{copy.actions}</th></tr></thead><tbody>{data.content.map(item => <tr key={item.id} className="border-b transition last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/60"><td className="p-4"><div className="flex items-center gap-3"><img src={item.imagemUrl || "/images/clinica-carepoint.png"} alt={`${copy.imageAlt} ${item.nome}`} className="h-14 w-20 rounded-xl object-cover" /><span><strong className="block">{item.nome}</strong><small className="mt-1 block max-w-xs truncate text-slate-500">{item.endereco}</small></span></div></td><td className="p-4">{item.email}<small className="mt-1 block text-slate-500">{item.telefone}</small></td><td className="p-4 font-bold">{item.totalProfissionais}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.ativo ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{item.ativo ? copy.active : copy.inactive}</span></td><td className="p-4 text-right"><div className="flex justify-end gap-3"><Link href={`/admin/clinicas/${item.id}/editar`} className="font-bold text-brand-700 dark:text-emerald-300">{copy.edit}</Link><button onClick={() => void toggle(item.id, item.ativo)} className="font-bold text-rose-600">{item.ativo ? copy.deactivate : copy.activate}</button></div></td></tr>)}</tbody></table></div> : <div className="p-8"><EmptyState title={copy.empty} description={copy.emptyDescription} /></div>}
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPage={setPage} />}
    </div>
  </AppShell>;
}
