"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";

type Form = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  necessidadesCuidado?: string;
  familiarResponsavel?: string;
  novaSenha?: string;
};

const content = {
  "pt-BR": {
    title: "Editar perfil",
    subtitle: "Mantenha suas informações de atendimento atualizadas.",
    success: "Perfil atualizado.",
    careNeeds: "Necessidades de cuidado",
    cancel: "Cancelar",
    saving: "Salvando...",
    save: "Salvar mudanças",
    fields: {
      nome: "Nome completo",
      email: "E-mail",
      telefone: "Telefone",
      endereco: "Endereço",
      familiarResponsavel: "Familiar responsável",
      novaSenha: "Nova senha (opcional)",
    },
  },
  en: {
    title: "Edit profile",
    subtitle: "Keep your care information up to date.",
    success: "Profile updated.",
    careNeeds: "Care needs",
    cancel: "Cancel",
    saving: "Saving...",
    save: "Save changes",
    fields: {
      nome: "Full name",
      email: "Email",
      telefone: "Phone number",
      endereco: "Address",
      familiarResponsavel: "Responsible family member",
      novaSenha: "New password (optional)",
    },
  },
} as const;

const fields = [
  ["nome", "text"],
  ["email", "email"],
  ["telefone", "tel"],
  ["endereco", "text"],
  ["familiarResponsavel", "text"],
  ["novaSenha", "password"],
] as const;

export default function EditProfilePage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const router = useRouter();
  const client = useQueryClient();
  const profile = useQuery({ queryKey: ["my-patient"], queryFn: carepointService.myPatient });
  const form = useForm<Form>();

  useEffect(() => {
    if (profile.data) form.reset(profile.data);
  }, [form, profile.data]);

  const update = useMutation({
    mutationFn: carepointService.updatePatient,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["my-patient"] });
      void client.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
  });

  const submit = async (data: Form) => {
    try {
      await update.mutateAsync(data);
      toast.success(copy.success);
      router.push("/configuracoes");
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  return (
    <AppShell roles={["PACIENTE"]}>
      <h1 className="page-title">{copy.title}</h1>
      <p className="mt-1 text-slate-500">{copy.subtitle}</p>

      <form onSubmit={form.handleSubmit(submit)} className="surface mt-6 max-w-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([name, type]) => (
            <label className="text-sm font-medium" key={name}>
              {copy.fields[name]}
              <input type={type} className="mt-1 w-full rounded-xl border px-3 py-3" {...form.register(name)} />
            </label>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium">
          {copy.careNeeds}
          <textarea className="mt-1 min-h-28 w-full rounded-xl border p-3" {...form.register("necessidadesCuidado")} />
        </label>
        <div className="mt-6 flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>{copy.cancel}</Button>
          <Button disabled={update.isPending}>{update.isPending ? copy.saving : copy.save}</Button>
        </div>
      </form>
    </AppShell>
  );
}
