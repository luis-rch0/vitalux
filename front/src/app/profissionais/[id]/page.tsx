"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/state";
import { useCreateRequest, useProfessional } from "@/features/carepoint-hooks";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n, type Locale } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    notFound: "Profissional não encontrado.",
    back: "← Voltar",
    reviews: "avaliações",
    about: "Sobre o profissional",
    defaultDescription: "Profissional habilitado para atendimento domiciliar com foco no cuidado humanizado.",
    requestCare: "Solicitar atendimento",
    dialogDescription: "A solicitação será analisada pela administração.",
    success: "Solicitação enviada para análise.",
    cancel: "Cancelar",
    sending: "Enviando...",
    send: "Enviar",
    fields: {
      servicoSolicitado: "Serviço solicitado",
      necessidadesInformadas: "Necessidades informadas",
      dataDesejada: "Data e horário desejados",
      enderecoAtendimento: "Endereço do atendimento",
    },
    professions: {
      MEDICO: "Médico",
      ENFERMEIRO: "Enfermeiro",
      TECNICO_ENFERMAGEM: "Técnico de enfermagem",
      CUIDADOR: "Cuidador",
      FISIOTERAPEUTA: "Fisioterapeuta",
      NUTRICIONISTA: "Nutricionista",
      PSICOLOGO: "Psicólogo",
      FONOAUDIOLOGO: "Fonoaudiólogo",
      TERAPEUTA_OCUPACIONAL: "Terapeuta ocupacional",
    },
  },
  en: {
    notFound: "Professional not found.",
    back: "← Back",
    reviews: "reviews",
    about: "About the professional",
    defaultDescription: "Qualified home care professional focused on compassionate, human-centered care.",
    requestCare: "Request care",
    dialogDescription: "Your request will be reviewed by the administration team.",
    success: "Request submitted for review.",
    cancel: "Cancel",
    sending: "Sending...",
    send: "Send",
    fields: {
      servicoSolicitado: "Requested service",
      necessidadesInformadas: "Care needs",
      dataDesejada: "Preferred date and time",
      enderecoAtendimento: "Care address",
    },
    professions: {
      MEDICO: "Physician",
      ENFERMEIRO: "Nurse",
      TECNICO_ENFERMAGEM: "Nursing technician",
      CUIDADOR: "Caregiver",
      FISIOTERAPEUTA: "Physical therapist",
      NUTRICIONISTA: "Nutritionist",
      PSICOLOGO: "Psychologist",
      FONOAUDIOLOGO: "Speech therapist",
      TERAPEUTA_OCUPACIONAL: "Occupational therapist",
    },
  },
} as const;

const requestFields = [
  ["servicoSolicitado", "text"],
  ["necessidadesInformadas", "text"],
  ["dataDesejada", "datetime-local"],
  ["enderecoAtendimento", "text"],
] as const;

function localizedCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function ProfessionalDetailPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const { id } = useParams<{ id: string }>();
  const professional = useProfessional(id);
  const create = useCreateRequest();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    servicoSolicitado: "Atendimento domiciliar",
    necessidadesInformadas: "",
    dataDesejada: "",
    enderecoAtendimento: "",
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!professional.data) return;
    try {
      await create.mutateAsync({
        profissionalId: professional.data.id,
        clinicaId: professional.data.clinica?.id,
        ...form,
        dataDesejada: new Date(form.dataDesejada).toISOString(),
      });
      toast.success(copy.success);
      router.push("/solicitacoes");
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  if (professional.isLoading) return <AppShell roles={["PACIENTE"]}><Skeleton className="h-96" /></AppShell>;
  if (!professional.data) return <AppShell roles={["PACIENTE"]}><p>{copy.notFound}</p></AppShell>;

  const item = professional.data;
  const profession = copy.professions[item.profissao] ?? item.profissao.replaceAll("_", " ");

  return (
    <AppShell roles={["PACIENTE"]}>
      <button onClick={() => router.back()} className="text-sm font-semibold text-brand-700">{copy.back}</button>
      <Card className="mt-5 overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand-100 to-brand-50 p-6 dark:from-brand-900 dark:to-slate-900">
          <Avatar name={item.nome} url={item.fotoUrl} />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="page-title">{item.nome}</h1>
              <p className="mt-1 text-brand-700 dark:text-brand-300">{profession} · {item.especialidade}</p>
            </div>
            <strong className="text-lg text-brand-700 dark:text-brand-300">{localizedCurrency(item.valorAtendimento, locale)}</strong>
          </div>
          <p className="mt-4 flex items-center gap-1 text-amber-500">
            <Star size={18} fill="currentColor" />
            {item.mediaAvaliacoes.toFixed(1)} <span className="text-slate-500">({item.quantidadeAvaliacoes} {copy.reviews})</span>
          </p>
          <div className="mt-5 grid gap-3 rounded-2xl border p-4 text-sm sm:grid-cols-2">
            <span>{item.telefone}</span>
            <span>{item.email}</span>
            {item.clinica && <span className="flex items-center gap-1"><MapPin size={15} />{item.clinica.nome}</span>}
          </div>
          <h2 className="mt-6 text-lg font-bold">{copy.about}</h2>
          <p className="mt-2 leading-6 text-slate-600 dark:text-slate-300">{item.descricao || copy.defaultDescription}</p>
          <Button onClick={() => setOpen(true)} className="mt-7 w-full">
            <CalendarDays size={18} className="mr-2" />{copy.requestCare}
          </Button>
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-5" role="dialog" aria-modal="true" aria-labelledby="request-dialog-title">
          <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h2 id="request-dialog-title" className="text-xl font-bold">{copy.requestCare}</h2>
            <p className="mt-1 text-sm text-slate-500">{copy.dialogDescription}</p>
            {requestFields.map(([key, type]) => (
              <label key={key} className="mt-4 block text-sm font-medium">
                {copy.fields[key]}
                <input
                  required
                  type={type}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-3"
                />
              </label>
            ))}
            <div className="mt-6 flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>{copy.cancel}</Button>
              <Button className="flex-1" disabled={create.isPending}>{create.isPending ? copy.sending : copy.send}</Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
