"use client";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Search, ClipboardList, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";

const questions = {
  "pt-BR": [
    [
      "Como solicito um atendimento?",
      "Abra Profissionais, filtre por especialidade e consulte um perfil. Clique em solicitar atendimento, informe o serviço, as necessidades, a data desejada e o endereço. Você pode revisar o pedido com o assistente antes de confirmar.",
    ],
    [
      "Meu atendimento já está confirmado?",
      "Uma solicitação nova começa como PENDENTE. A administração precisa confirmá-la. Acompanhe o status em Solicitações; o envio do pedido não garante disponibilidade.",
    ],
    [
      "Posso cancelar?",
      "Sim. Abra o detalhe de uma solicitação PENDENTE ou CONFIRMADA. Revise o cancelamento e confirme. Solicitações concluídas, rejeitadas ou já canceladas não permitem essa ação.",
    ],
    [
      "Quando posso avaliar?",
      "Após a administração concluir o atendimento, a opção de avaliação aparece no detalhe da solicitação. É permitida uma avaliação por atendimento.",
    ],
    [
      "Como o assistente usa meus dados?",
      "As consultas respeitam sua conta. Ao ativar a conversa com IA, sua mensagem e até 12 mensagens recentes são enviadas à Groq, junto de resultados de buscas e números/status dos seus pedidos quando consultados. Não envie senhas, documentos ou informações de saúde. As ações exigem confirmação. Você pode excluir suas conversas no painel.",
    ],
    [
      "Como ajusto a leitura?",
      "Use o botão de acessibilidade para ampliar o texto, aumentar o contraste ou reduzir movimentos. O tema e o idioma ficam em Configurações.",
    ],
  ],
  en: [
    [
      "How do I request care?",
      "Open Professionals, filter by specialty and open a profile. Select request care and enter the service, needs, preferred date and address. You can review the request with the assistant before confirming.",
    ],
    [
      "Is my appointment confirmed?",
      "New requests start as PENDENTE. An administrator must confirm them. Track the status in Requests; submitting a request does not guarantee availability.",
    ],
    [
      "Can I cancel?",
      "Open a PENDENTE or CONFIRMADA request, review cancellation and confirm. Completed, rejected and cancelled requests cannot be cancelled.",
    ],
    [
      "When can I review care?",
      "After an administrator completes the service, the review form becomes available in the request. One review per service is allowed.",
    ],
    [
      "How does the assistant use my data?",
      "Lookups are scoped to your account. When you enable AI conversation, your message and up to 12 recent messages are sent to Groq, along with directory results and request numbers/statuses when looked up. Do not send passwords, documents or health information. Actions require confirmation. You can delete conversations from the panel.",
    ],
    [
      "How can I adjust readability?",
      "Use the accessibility button to enlarge text, increase contrast or reduce motion. Theme and language are available in Settings.",
    ],
  ],
};
export default function HelpPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const en = locale === "en";
  const admin = user?.role === "ADMIN";
  return (
    <AppShell roles={["PACIENTE", "ADMIN"]}>
      <p className="admin-kicker">{en ? "Here for you" : "Estamos por perto"}</p>
      <h1 className="page-title mt-3">
        {en ? "A little help, a simpler day." : "Uma ajuda. Um dia mais simples."}
      </h1>
      <p className="mt-4 max-w-xl text-slate-500">
        {en
          ? "Find your way through CarePoint, at your own pace."
          : "Encontre seu caminho no CarePoint, no seu ritmo."}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <button
          onClick={() => window.dispatchEvent(new Event("carepoint:open-assistant"))}
          className="assistant-invite rounded-2xl p-6 text-left"
        >
          <MessageCircle />
          <h2 className="mt-5 text-lg font-bold">
            {en ? "Talk to the assistant" : "Converse com o assistente"}
          </h2>
          <p className="mt-2 text-sm">
            {en ? "Guidance and authorized lookups." : "Orientações e consultas do seu cuidado."}
          </p>
        </button>
        <Link href={admin ? "/admin/profissionais" : "/profissionais"} className="surface p-6">
          <Search />
          <h2 className="mt-5 text-lg font-bold">
            {en ? "Find professionals" : "Encontre profissionais"}
          </h2>
          <ArrowUpRight className="mt-3" />
        </Link>
        <Link href={admin ? "/admin/solicitacoes" : "/solicitacoes"} className="surface p-6">
          <ClipboardList />
          <h2 className="mt-5 text-lg font-bold">
            {en ? "Follow requests" : "Acompanhe solicitações"}
          </h2>
          <ArrowUpRight className="mt-3" />
        </Link>
      </div>
      <section className="mt-10 max-w-3xl">
        <h2 className="mb-5 text-xl font-semibold">
          {en ? "Frequently asked questions" : "Dúvidas frequentes"}
        </h2>
        {questions[locale].map(([question, answer]) => (
          <details key={question} className="group border-b py-5">
            <summary className="cursor-pointer text-base font-semibold">{question}</summary>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {answer}
            </p>
          </details>
        ))}
      </section>
      <p className="mt-8 flex max-w-2xl items-start gap-3 text-sm leading-6 text-slate-500">
        <ShieldCheck className="shrink-0" />
        {en
          ? "The assistant helps you use the platform. It does not provide diagnoses or prescriptions."
          : "O assistente ajuda você a usar a plataforma. Ele não realiza diagnósticos nem prescreve tratamentos."}
      </p>
    </AppShell>
  );
}
