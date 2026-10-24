"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { carepointService } from "@/services/carepoint";
import { useI18n } from "@/providers/i18n-provider";
import { ActionReview } from "./action-review";
import type { ActionInput } from "./api";

/** All writes go through the server-owned preview and confirmation flow. */
export function TaskPanel({
  task,
  onDone,
}: {
  task: "CREATE" | "CANCEL";
  onDone: (message: string) => void;
}) {
  const { locale } = useI18n();
  const en = locale === "en";
  const [input, setInput] = useState<ActionInput>();
  const professionals = useQuery({
    queryKey: ["assistant-task-professionals"],
    queryFn: () => carepointService.professionals({ size: 100 }),
    enabled: task === "CREATE",
  });
  const requests = useQuery({
    queryKey: ["assistant-task-requests"],
    queryFn: carepointService.myRequests,
    enabled: task === "CANCEL",
  });
  const query = task === "CREATE" ? professionals : requests;
  const field = "mt-1 w-full rounded-lg border p-2 text-sm";
  return (
    <section
      className="mt-4 rounded-xl border border-brand-300 bg-brand-50/40 p-4 dark:bg-slate-900"
      aria-label={en ? "Assistant task" : "Tarefa do assistente"}
    >
      <h3 className="font-semibold">
        {task === "CREATE"
          ? en
            ? "Request care here"
            : "Solicite seu atendimento aqui"
          : en
            ? "Cancel a request"
            : "Cancelar uma solicitação"}
      </h3>
      <p className="mt-2 text-xs leading-5">
        {en
          ? "Nothing changes until you review and confirm."
          : "Nada será alterado antes de você revisar e confirmar."}
      </p>
      {query.isPending ? (
        <p role="status">{en ? "Loading…" : "Carregando…"}</p>
      ) : query.isError ? (
        <button className="mt-3 underline" onClick={() => void query.refetch()}>
          {en ? "Could not load. Try again" : "Não foi possível carregar. Tentar novamente"}
        </button>
      ) : input ? (
        <>
          <ActionReview
            input={input}
            onComplete={(result) =>
              onDone(
                en
                  ? `Request #${result.id}: ${result.status}.`
                  : `Solicitação #${result.id}: ${result.status === "CANCELADA" ? "cancelamento realizado" : "criada e aguardando confirmação da administração"}.`,
              )
            }
          />
          <button className="mt-3 text-sm underline" onClick={() => setInput(undefined)}>
            {en ? "Edit details" : "Editar dados"}
          </button>
        </>
      ) : task === "CANCEL" ? (
        <div className="mt-3 space-y-2">
          {requests.data?.content
            .filter((r) => ["PENDENTE", "CONFIRMADA"].includes(r.status))
            .map((r) => (
              <button
                key={r.id}
                onClick={() => setInput({ type: "CANCEL_REQUEST", requestId: r.id })}
                className="block w-full rounded-lg border bg-white p-3 text-left text-sm dark:bg-slate-800"
              >
                #{r.id} · {r.profissional.nome}
                <span className="block text-xs">{r.servicoSolicitado}</span>
              </button>
            ))}
          {!requests.data?.content.some((r) => ["PENDENTE", "CONFIRMADA"].includes(r.status)) && (
            <p className="text-sm">
              {en
                ? "No cancellable requests on this page. See your requests for older items."
                : "Nenhum pedido cancelável nesta página. Consulte suas solicitações para itens anteriores."}
            </p>
          )}
        </div>
      ) : (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setInput({
              type: "CREATE_REQUEST",
              draft: {
                profissionalId: Number(data.get("professional")),
                servicoSolicitado: String(data.get("service")),
                necessidadesInformadas: String(data.get("needs")),
                dataDesejada: new Date(String(data.get("date"))).toISOString(),
                enderecoAtendimento: String(data.get("address")),
              },
            });
          }}
        >
          <label className="block text-xs">
            {en ? "Professional" : "Profissional"}
            <select name="professional" required className={field} defaultValue="">
              <option value="" disabled>
                {en ? "Select" : "Selecione"}
              </option>
              {professionals.data?.content.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} · {p.especialidade} · R$ {p.valorAtendimento.toFixed(2)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            {en ? "Service" : "Serviço desejado"}
            <input name="service" required maxLength={160} className={field} />
          </label>
          <label className="block text-xs">
            {en
              ? "Desired date and time (your local time)"
              : "Data e hora desejadas (seu horário local)"}
            <input name="date" type="datetime-local" required className={field} />
          </label>
          <label className="block text-xs">
            {en ? "Care address" : "Endereço do atendimento"}
            <input name="address" required maxLength={255} className={field} />
          </label>
          <label className="block text-xs">
            {en ? "Care needs" : "Necessidades do atendimento"}
            <textarea name="needs" required maxLength={2000} className={field} />
          </label>
          <p className="text-xs">
            {en
              ? "These details go to CarePoint, not the external AI provider. This is a request, not a confirmed appointment."
              : "Estes dados vão para o CarePoint, não para o provedor externo de IA. É uma solicitação, não um agendamento confirmado."}
          </p>
          <button type="submit" className="rounded-lg bg-brand-900 px-4 py-2 text-sm text-white">
            {en ? "Continue to review" : "Continuar para revisão"}
          </button>
        </form>
      )}
    </section>
  );
}
