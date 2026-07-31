"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AdminPagination, AdminSearch } from "@/components/admin/admin-list";
import { EmptyState, Skeleton } from "@/components/ui/state";
import { useI18n } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";

const content = {
  "pt-BR": { kicker: "Cadastros", title: "Usuários", subtitle: "Lista completa de pacientes cadastrados na plataforma.", search: "Pesquisar por nome...", count: "usuário(s)", user: "Usuário", contact: "Contato", status: "Status", action: "Ação", active: "Ativo", inactive: "Inativo", details: "Ver detalhes", empty: "Nenhum usuário encontrado", emptyDescription: "Ajuste a pesquisa ou aguarde novos cadastros." },
  en: { kicker: "Registrations", title: "Users", subtitle: "Complete list of patients registered on the platform.", search: "Search by name...", count: "user(s)", user: "User", contact: "Contact", status: "Status", action: "Action", active: "Active", inactive: "Inactive", details: "View details", empty: "No users found", emptyDescription: "Adjust the search or wait for new registrations." },
} as const;

export default function AdminPatientsPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const patients = useQuery({ queryKey: ["admin-patients", search, page], queryFn: () => carepointService.adminPatients({ busca: search || undefined, page, size: 12 }) });
  const data = patients.data;

  return <AppShell roles={["ADMIN"]}>
    <div className="animate-rise"><p className="admin-kicker">{copy.kicker}</p><h1 className="page-title mt-2">{copy.title}</h1><p className="mt-2 text-slate-500">{copy.subtitle}</p></div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><AdminSearch value={search} onChange={value => { setSearch(value); setPage(0); }} placeholder={copy.search} /><span className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{data?.totalElements || 0} {copy.count}</span></div>
    <div className="surface animate-rise mt-5 overflow-hidden">
      {patients.isLoading ? <Skeleton className="m-5 h-64" /> : data?.content.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="p-4">{copy.user}</th><th className="p-4">{copy.contact}</th><th className="p-4">CPF</th><th className="p-4">{copy.status}</th><th className="p-4 text-right">{copy.action}</th></tr></thead><tbody>{data.content.map(item => <tr key={item.id} className="border-b transition last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/60"><td className="p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><UserRound size={18} /></span><strong>{item.nome}</strong></div></td><td className="p-4">{item.email}<small className="mt-1 block text-slate-500">{item.telefone}</small></td><td className="p-4">{item.cpf}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.ativo ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{item.ativo ? copy.active : copy.inactive}</span></td><td className="p-4 text-right"><Link href={`/admin/pacientes/${item.id}`} className="font-bold text-brand-700 dark:text-emerald-300">{copy.details}</Link></td></tr>)}</tbody></table></div> : <div className="p-8"><EmptyState title={copy.empty} description={copy.emptyDescription} /></div>}
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPage={setPage} />}
    </div>
  </AppShell>;
}
