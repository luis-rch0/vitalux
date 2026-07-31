"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { carepointService } from "@/services/carepoint";

const professions = ["MEDICO", "ENFERMEIRO", "TECNICO_ENFERMAGEM", "CUIDADOR", "FISIOTERAPEUTA", "NUTRICIONISTA", "PSICOLOGO", "FONOAUDIOLOGO", "TERAPEUTA_OCUPACIONAL"] as const;

const content = {
  "pt-BR": {
    cpfRequired: "CPF é obrigatório.",
    professionalUpdated: "Profissional atualizado.",
    professionalCreated: "Profissional cadastrado.",
    clinicUpdated: "Clínica atualizada.",
    clinicCreated: "Clínica cadastrada.",
    cancel: "Cancelar",
    saving: "Salvando...",
    saveProfessional: "Salvar profissional",
    saveClinic: "Salvar clínica",
    independentCare: "Atendimento independente",
    professionalActive: "Profissional ativo",
    clinicActive: "Clínica ativa",
    professionalFields: {
      name: "Nome completo",
      cpf: "CPF",
      profession: "Profissão",
      specialty: "Especialidade",
      registration: "Registro profissional",
      price: "Valor do atendimento",
      phone: "Telefone",
      email: "E-mail",
      photo: "URL da foto (opcional)",
      clinic: "Clínica",
      description: "Descrição",
    },
    clinicFields: {
      name: "Nome",
      cnpj: "CNPJ",
      phone: "Telefone",
      email: "E-mail",
      address: "Endereço",
      image: "URL da imagem (opcional)",
      latitude: "Latitude (opcional)",
      longitude: "Longitude (opcional)",
      description: "Descrição",
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
    cpfRequired: "CPF is required.",
    professionalUpdated: "Professional updated.",
    professionalCreated: "Professional created.",
    clinicUpdated: "Clinic updated.",
    clinicCreated: "Clinic created.",
    cancel: "Cancel",
    saving: "Saving...",
    saveProfessional: "Save professional",
    saveClinic: "Save clinic",
    independentCare: "Independent home care",
    professionalActive: "Active professional",
    clinicActive: "Active clinic",
    professionalFields: {
      name: "Full name",
      cpf: "CPF",
      profession: "Profession",
      specialty: "Specialty",
      registration: "Professional registration",
      price: "Service price",
      phone: "Phone number",
      email: "Email",
      photo: "Photo URL (optional)",
      clinic: "Clinic",
      description: "Description",
    },
    clinicFields: {
      name: "Name",
      cnpj: "CNPJ",
      phone: "Phone number",
      email: "Email",
      address: "Address",
      image: "Image URL (optional)",
      latitude: "Latitude (optional)",
      longitude: "Longitude (optional)",
      description: "Description",
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

type ProfessionalFormData = {
  nome: string;
  cpf: string;
  profissao: string;
  especialidade: string;
  numeroRegistroProfissional: string;
  fotoUrl: string;
  valorAtendimento: string;
  telefone: string;
  email: string;
  descricao: string;
  clinicaId: string;
  ativo: boolean;
};

const blankProfessional: ProfessionalFormData = {
  nome: "", cpf: "", profissao: "MEDICO", especialidade: "", numeroRegistroProfissional: "", fotoUrl: "",
  valorAtendimento: "", telefone: "", email: "", descricao: "", clinicaId: "", ativo: true,
};

export function ProfessionalAdminForm({ id }: { id?: string }) {
  const { locale } = useI18n();
  const copy = content[locale];
  const router = useRouter();
  const existing = useQuery({ queryKey: ["admin-professional", id], queryFn: () => carepointService.adminProfessional(id!), enabled: Boolean(id) });
  const clinics = useQuery({ queryKey: ["admin-clinics"], queryFn: carepointService.adminClinics });
  const [data, setData] = useState<ProfessionalFormData>(blankProfessional);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    const item = existing.data.profissional;
    setData({
      nome: item.nome,
      cpf: existing.data.cpf,
      profissao: item.profissao,
      especialidade: item.especialidade,
      numeroRegistroProfissional: item.numeroRegistroProfissional || "",
      fotoUrl: item.fotoUrl || "",
      valorAtendimento: String(item.valorAtendimento),
      telefone: item.telefone,
      email: item.email,
      descricao: item.descricao || "",
      clinicaId: String(item.clinica?.id || ""),
      ativo: item.ativo,
    });
  }, [existing.data]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!data.cpf.trim()) {
      toast.error(copy.cpfRequired);
      return;
    }
    setSaving(true);
    try {
      await carepointService.saveProfessional({
        ...data,
        valorAtendimento: Number(data.valorAtendimento),
        clinicaId: data.clinicaId ? Number(data.clinicaId) : null,
      }, id);
      toast.success(id ? copy.professionalUpdated : copy.professionalCreated);
      router.push("/admin/profissionais");
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface mt-6 max-w-3xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={copy.professionalFields.name} value={data.nome} onChange={(value) => setData({ ...data, nome: value })} />
        <Input label={copy.professionalFields.cpf} value={data.cpf} onChange={(value) => setData({ ...data, cpf: value })} />
        <Select label={copy.professionalFields.profession} value={data.profissao} onChange={(value) => setData({ ...data, profissao: value })}>
          {professions.map((item) => <option key={item} value={item}>{copy.professions[item]}</option>)}
        </Select>
        <Input label={copy.professionalFields.specialty} value={data.especialidade} onChange={(value) => setData({ ...data, especialidade: value })} />
        <Input label={copy.professionalFields.registration} value={data.numeroRegistroProfissional} onChange={(value) => setData({ ...data, numeroRegistroProfissional: value })} required={false} />
        <Input label={copy.professionalFields.price} type="number" value={data.valorAtendimento} onChange={(value) => setData({ ...data, valorAtendimento: value })} />
        <Input label={copy.professionalFields.phone} value={data.telefone} onChange={(value) => setData({ ...data, telefone: value })} />
        <Input label={copy.professionalFields.email} type="email" value={data.email} onChange={(value) => setData({ ...data, email: value })} />
        <Input label={copy.professionalFields.photo} value={data.fotoUrl} onChange={(value) => setData({ ...data, fotoUrl: value })} required={false} />
        <Select label={copy.professionalFields.clinic} value={data.clinicaId} onChange={(value) => setData({ ...data, clinicaId: value })}>
          <option value="">{copy.independentCare}</option>
          {clinics.data?.content.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.nome}</option>)}
        </Select>
      </div>
      <label className="mt-4 block text-sm font-medium">
        {copy.professionalFields.description}
        <textarea value={data.descricao} onChange={(event) => setData({ ...data, descricao: event.target.value })} className="mt-1 min-h-28 w-full rounded-xl border p-3" />
      </label>
      <label className="mt-4 flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={data.ativo} onChange={(event) => setData({ ...data, ativo: event.target.checked })} />
        {copy.professionalActive}
      </label>
      <div className="mt-6 flex gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>{copy.cancel}</Button>
        <Button disabled={saving}>{saving ? copy.saving : copy.saveProfessional}</Button>
      </div>
    </form>
  );
}

type ClinicFormData = {
  nome: string;
  cnpj: string;
  descricao: string;
  endereco: string;
  telefone: string;
  email: string;
  imagemUrl: string;
  latitude: string;
  longitude: string;
  ativo: boolean;
};

const blankClinic: ClinicFormData = {
  nome: "", cnpj: "", descricao: "", endereco: "", telefone: "", email: "", imagemUrl: "",
  latitude: "", longitude: "", ativo: true,
};

export function ClinicAdminForm({ id }: { id?: string }) {
  const { locale } = useI18n();
  const copy = content[locale];
  const router = useRouter();
  const existing = useQuery({ queryKey: ["admin-clinic", id], queryFn: () => carepointService.adminClinic(id!), enabled: Boolean(id) });
  const [data, setData] = useState<ClinicFormData>(blankClinic);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    setData({
      nome: existing.data.nome,
      cnpj: existing.data.cnpj,
      descricao: existing.data.descricao || "",
      endereco: existing.data.endereco,
      telefone: existing.data.telefone,
      email: existing.data.email,
      imagemUrl: existing.data.imagemUrl || "",
      latitude: existing.data.latitude ? String(existing.data.latitude) : "",
      longitude: existing.data.longitude ? String(existing.data.longitude) : "",
      ativo: existing.data.ativo,
    });
  }, [existing.data]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await carepointService.saveClinic({
        ...data,
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
      }, id);
      toast.success(id ? copy.clinicUpdated : copy.clinicCreated);
      router.push("/admin/clinicas");
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface mt-6 max-w-3xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={copy.clinicFields.name} value={data.nome} onChange={(value) => setData({ ...data, nome: value })} />
        <Input label={copy.clinicFields.cnpj} value={data.cnpj} onChange={(value) => setData({ ...data, cnpj: value })} />
        <Input label={copy.clinicFields.phone} value={data.telefone} onChange={(value) => setData({ ...data, telefone: value })} />
        <Input label={copy.clinicFields.email} type="email" value={data.email} onChange={(value) => setData({ ...data, email: value })} />
        <Input label={copy.clinicFields.address} value={data.endereco} onChange={(value) => setData({ ...data, endereco: value })} />
        <Input label={copy.clinicFields.image} value={data.imagemUrl} onChange={(value) => setData({ ...data, imagemUrl: value })} required={false} />
        <Input label={copy.clinicFields.latitude} type="number" value={data.latitude} onChange={(value) => setData({ ...data, latitude: value })} required={false} />
        <Input label={copy.clinicFields.longitude} type="number" value={data.longitude} onChange={(value) => setData({ ...data, longitude: value })} required={false} />
      </div>
      <label className="mt-4 block text-sm font-medium">
        {copy.clinicFields.description}
        <textarea value={data.descricao} onChange={(event) => setData({ ...data, descricao: event.target.value })} className="mt-1 min-h-28 w-full rounded-xl border p-3" />
      </label>
      <label className="mt-4 flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={data.ativo} onChange={(event) => setData({ ...data, ativo: event.target.checked })} />
        {copy.clinicActive}
      </label>
      <div className="mt-6 flex gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>{copy.cancel}</Button>
        <Button disabled={saving}>{saving ? copy.saving : copy.saveClinic}</Button>
      </div>
    </form>
  );
}

function Input({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="text-sm font-medium">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3" /></label>;
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="text-sm font-medium">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3">{children}</select></label>;
}
