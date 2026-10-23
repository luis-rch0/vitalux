"use client";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, MessageCircle } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import type { ServiceRequest } from "@/types/api";

export function CareOverview({ requests }: { requests: ServiceRequest[] }) {
  const { locale } = useI18n();
  const en = locale === "en";
  const active = requests
    .filter((item) => ["PENDENTE", "CONFIRMADA"].includes(item.status))
    .sort((a, b) => Date.parse(a.dataDesejada) - Date.parse(b.dataDesejada))[0];
  return (
    <section
      className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]"
      aria-label={en ? "Care shortcuts" : "Seu cuidado em foco"}
    >
      <Link
        href={active ? `/solicitacoes/${active.id}` : "/profissionais"}
        className="surface flex items-center gap-4 p-6 hover:border-brand-500"
      >
        <CalendarClock className="shrink-0 text-brand-700 dark:text-brand-300" />
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
            {en ? "Follow your care" : "Acompanhe seu cuidado"}
          </p>
          <h2 className="mt-2 text-lg font-semibold">
            {active?.profissional.nome ??
              (en ? "Your first step starts here" : "Seu primeiro passo começa aqui")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {active
              ? `${new Intl.DateTimeFormat(en ? "en-US" : "pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(active.dataDesejada))} · ${active.status}`
              : en
                ? "Find a professional for your needs."
                : "Encontre um profissional para o que você precisa."}
          </p>
        </div>
        <ArrowUpRight aria-hidden />
      </Link>
      <button
        onClick={() => window.dispatchEvent(new Event("carepoint:open-assistant"))}
        className="assistant-invite flex items-center gap-4 rounded-3xl p-6 text-left"
      >
        <MessageCircle className="shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest">
            {en ? "By your side" : "Ao seu lado"}
          </p>
          <h2 className="mt-2 text-lg font-semibold">
            {en ? "How can we help today?" : "Como podemos ajudar hoje?"}
          </h2>
          <p className="mt-1 text-sm">
            {en ? "Ask the CarePoint assistant" : "Converse com o assistente CarePoint"} →
          </p>
        </div>
      </button>
    </section>
  );
}
