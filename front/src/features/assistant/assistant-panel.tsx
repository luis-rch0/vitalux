"use client";

import Link from "next/link";
import { TaskPanel } from "./task-panel";
import { understand } from "./understand";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, MessageCircle, Plus, Send, Trash2, X } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { assistantApi, type Intent, type Message, type Reply } from "./api";
import { assistantCopy } from "./copy";

export default function AssistantPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { locale } = useI18n();
  const copy = assistantCopy[locale];
  const client = useQueryClient();
  const panel = useRef<HTMLElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<number>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [links, setLinks] = useState<Reply["links"]>([]);
  const [task, setTask] = useState<"CREATE" | "CANCEL">();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [useAi, setUseAi] = useState(false);
  const [providerUnavailable, setProviderUnavailable] = useState(false);
  const [mode, setMode] = useState<Reply["mode"]>("GUIDED");
  const [page, setPage] = useState(0);
  const [hasOlder, setHasOlder] = useState(false);
  const conversations = useQuery({
    queryKey: ["assistant-conversations", user?.id],
    queryFn: assistantApi.conversations,
  });
  const history = useMutation({
    mutationFn: ({ id, page }: { id: number; page: number }) => assistantApi.history(id, page),
  });
  const remove = useMutation({ mutationFn: assistantApi.remove });
  const send = useMutation({
    mutationFn: ({ message, intent, term }: { message: string; intent: Intent; term?: string }) =>
      assistantApi.send({ conversationId, message, intent, search: term, locale, useAi }),
    onSuccess: (reply, input) => {
      setConversationId(reply.conversationId);
      setMessages((current) => [
        ...current,
        { id: Date.now(), role: "USER", content: input.message },
        { id: Date.now() + 1, role: "ASSISTANT", content: reply.answer },
      ]);
      setText("");
      setLinks(reply.links);
      setMode(reply.mode);
      if (user?.role === "PACIENTE" && (reply.task === "CREATE" || reply.task === "CANCEL")) {
        setTask(reply.task);
      }
      setProviderUnavailable(useAi && input.intent === "HELP" && reply.mode === "GUIDED");
      void client.invalidateQueries({ queryKey: ["assistant-conversations", user?.id] });
    },
  });
  const busy = send.isPending || history.isPending || remove.isPending;
  useEffect(() => {
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, send.isPending]);
  const reset = () => {
    setProviderUnavailable(false);
    setMode("GUIDED");
    setTask(undefined);
    setConversationId(undefined);
    setMessages([]);
    setLinks([]);
    setPage(0);
    setHasOlder(false);
    send.reset();
    history.reset();
    remove.reset();
  };
  const load = async (id: number, nextPage = 0) => {
    try {
      const items = await history.mutateAsync({ id, page: nextPage });
      setTask(undefined);
      setConversationId(id);
      setMessages((current) => (nextPage ? [...items, ...current] : items));
      setPage(nextPage);
      setHasOlder(items.length === 50);
      setLinks([]);
      send.reset();
    } catch {
      /* The error is rendered below, preserving the current conversation. */
    }
  };
  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/25 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={panel}
        id="carepoint-assistant"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key === "Tab") {
            const elements = panel.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]",
            );
            if (!elements?.length) return;
            const first = elements[0],
              last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-[var(--cp-paper)] text-slate-900 shadow-2xl dark:text-slate-100 sm:m-4 sm:w-[500px] sm:rounded-3xl"
      >
        <header className="flex items-center justify-between rounded-t-3xl bg-brand-900 p-5 text-white">
          <div>
            <p className="text-xs tracking-widest text-brand-200">{copy.subtitle}</p>
            <h2 id="assistant-title" className="mt-2 text-lg font-semibold">
              {copy.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={copy.close}
            className="rounded-xl p-2 hover:bg-white/10"
          >
            <X />
          </button>
        </header>
        <div className="flex gap-2 border-b p-3">
          <button
            disabled={busy}
            onClick={reset}
            className="rounded-lg border p-2"
            aria-label={copy.new}
          >
            <Plus size={18} />
          </button>
          <select
            disabled={busy}
            className="min-w-0 flex-1 rounded-lg border p-2 text-sm"
            aria-label={copy.history}
            value={conversationId ?? ""}
            onChange={(event) => {
              if (event.target.value) void load(Number(event.target.value));
              else reset();
            }}
          >
            <option value="">{copy.new}</option>
            {conversations.data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          {conversationId && (
            <button
              disabled={busy}
              aria-label={copy.remove}
              className="rounded-lg border p-2"
              onClick={async () => {
                if (!window.confirm(copy.confirmRemove)) return;
                try {
                  await remove.mutateAsync(conversationId);
                  reset();
                  await conversations.refetch();
                } catch {
                  /* Rendered below. */
                }
              }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {hasOlder && (
            <button
              disabled={busy}
              className="mb-4 text-sm underline"
              onClick={() => conversationId && void load(conversationId, page + 1)}
            >
              {copy.older}
            </button>
          )}
          {!messages.length && (
            <div className="py-6">
              <MessageCircle className="mb-5 text-brand-700 dark:text-brand-300" size={32} />
              <p className="font-display text-3xl leading-tight">{copy.intro}</p>
            </div>
          )}
          <div role="log" aria-live="polite" aria-relevant="additions" className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`whitespace-pre-wrap break-words rounded-2xl p-4 text-sm leading-6 ${message.role === "USER" ? "ml-8 bg-brand-900 text-white" : "mr-4 border bg-white dark:bg-slate-900"}`}
              >
                {message.content}
              </div>
            ))}
          </div>
          {!!links.length && (
            <div className="mt-4 grid gap-2">
              {links
                .filter((link) => /^\/(?!\/)/.test(link.href))
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-xl border p-3 text-sm font-semibold text-brand-700 dark:text-brand-300"
                  >
                    {link.label}
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
            </div>
          )}
          {send.isPending && (
            <p role="status" className="mt-4 text-sm">
              {copy.busy}
            </p>
          )}
          {(send.isError || history.isError || remove.isError || conversations.isError) && (
            <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
              {(send.error ?? history.error ?? remove.error ?? conversations.error)?.message ||
                copy.error}
            </p>
          )}
          {task && user?.role === "PACIENTE" && (
            <TaskPanel
              key={task}
              task={task}
              onDone={(message) => {
                panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
                setTask(undefined);
                setMessages((current) => [
                  ...current,
                  { id: Date.now(), role: "ASSISTANT", content: message },
                ]);
              }}
            />
          )}
          <div ref={end} />
        </div>
        <div className="border-t p-4">
          <details className="mb-3">
            <summary className="cursor-pointer text-xs text-brand-700 dark:text-brand-300">
              {locale === "en" ? "Filter directory searches" : "Filtrar buscas no catálogo"}
            </summary>
            <label className="sr-only" htmlFor="assistant-search">
              {copy.search}
            </label>
            <input
              id="assistant-search"
              value={search}
              maxLength={160}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.search}
              className="mb-2 w-full rounded-lg border p-2 text-sm"
            />
          </details>
          <div className="mb-3 flex flex-wrap gap-2">
            {(
              [
                ["PROFESSIONALS", copy.professionals],
                ["CLINICS", copy.clinics],
                ...(user?.role === "PACIENTE" ? [["MY_REQUESTS", copy.requests]] : []),
              ] as [Intent, string][]
            ).map(([intent, label]) => (
              <button
                key={intent}
                disabled={busy}
                onClick={() =>
                  send.mutate({
                    intent,
                    message: search ? `${label}: ${search}` : label,
                    term: search,
                  })
                }
                className="rounded-full border px-3 py-2 text-xs font-semibold hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                {label}
              </button>
            ))}
          </div>
          {user?.role === "PACIENTE" && (
            <div className="mb-3 flex gap-2">
              <button
                disabled={busy}
                className="rounded-lg bg-brand-900 px-3 py-2 text-xs text-white"
                onClick={() => setTask("CREATE")}
              >
                {locale === "en" ? "Request care" : "Solicitar atendimento"}
              </button>
              <button
                disabled={busy}
                className="rounded-lg border px-3 py-2 text-xs"
                onClick={() => setTask("CANCEL")}
              >
                {locale === "en" ? "Cancel request" : "Cancelar pedido"}
              </button>
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!text.trim() || busy) return;
              const message = text.trim();
              // Free text goes to the contextual agent when the user has opted in.
              // Explicit buttons and offline routing remain available as fallbacks.
              if (useAi) {
                setTask(undefined);
                send.mutate({ intent: "HELP", message });
                return;
              }
              const parsed = understand(message);
              if (parsed.task && user?.role === "PACIENTE") {
                setTask(parsed.task);
                setMessages((current) => [
                  ...current,
                  { id: Date.now(), role: "USER", content: message },
                  {
                    id: Date.now() + 1,
                    role: "ASSISTANT",
                    content:
                      locale === "en"
                        ? "Let’s prepare this together. Complete the details below; you will review before anything changes."
                        : "Vamos preparar isso juntos. Complete os dados abaixo; você vai revisar antes de qualquer alteração.",
                  },
                ]);
                setText("");
                setLinks([]);
              } else {
                setTask(undefined);
                send.mutate({
                  intent:
                    parsed.intent === "MY_REQUESTS" && user?.role !== "PACIENTE"
                      ? "HELP"
                      : parsed.intent,
                  message,
                  term: parsed.search,
                });
              }
            }}
            className="flex items-end gap-2"
          >
            <textarea
              aria-label={copy.placeholder}
              placeholder={copy.placeholder}
              maxLength={2000}
              rows={2}
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-w-0 flex-1 resize-none rounded-xl border p-3 text-sm"
            />
            <button
              type="submit"
              disabled={busy || !text.trim()}
              aria-label={copy.send}
              className="rounded-xl bg-brand-900 p-3 text-white disabled:opacity-40"
            >
              <Send size={20} />
            </button>
          </form>
          <label className="mt-3 flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              disabled={busy}
              checked={useAi}
              onChange={(event) => setUseAi(event.target.checked)}
            />
            {copy.consent}
          </label>
          {useAi && <p className="mt-2 text-xs leading-5 text-slate-500">{copy.privacy}</p>}
          <p className="mt-2 text-[11px] text-slate-500">
            {mode === "AI"
              ? copy.ai
              : providerUnavailable
                ? locale === "en"
                  ? "External AI did not answer this query. Guided mode is available."
                  : "A IA externa não respondeu esta consulta. O modo guiado está disponível."
                : copy.guided}
          </p>
        </div>
      </section>
    </div>
  );
}
