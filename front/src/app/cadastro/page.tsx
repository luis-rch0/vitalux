"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  HeartHandshake,
  IdCard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { authErrorMessage, useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { patientRegistrationSchema } from "@/schemas/auth";

type Form = import("zod").z.infer<typeof patientRegistrationSchema>;

const content = {
  "pt-BR": {
    back: "Voltar para o início",
    kicker: "Cadastro do paciente",
    heroTitle: "Seu cuidado começa com informações bem organizadas.",
    heroDescription: "Crie sua conta para encontrar profissionais, solicitar atendimento domiciliar e acompanhar cada etapa.",
    benefits: ["Busca personalizada de profissionais", "Solicitações acompanhadas em um só lugar", "Seus dados protegidos e sob seu controle"],
    imageCaption: "Cuidado profissional, perto de você.",
    title: "Crie sua conta",
    subtitle: "Preencha seus dados para começar. Leva menos de 3 minutos.",
    requiredHint: "* Campos obrigatórios",
    optional: "opcional",
    personalSection: "Dados pessoais",
    personalDescription: "Informações usadas para identificar o paciente.",
    contactSection: "Contato e acesso",
    contactDescription: "Como entraremos em contato e protegeremos sua conta.",
    careSection: "Informações de cuidado",
    careDescription: "Conte um pouco sobre o atendimento que você procura.",
    success: "Cadastro criado. Agora entre na sua conta.",
    submitting: "Criando conta...",
    submit: "Criar minha conta",
    hasAccount: "Já possui uma conta?",
    signIn: "Entrar",
    privacy: "Ao criar sua conta, seus dados serão usados somente para viabilizar os serviços do CarePoint.",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
    fields: {
      nome: "Nome completo",
      cpf: "CPF",
      dataNascimento: "Data de nascimento",
      telefone: "Telefone",
      email: "E-mail",
      senha: "Senha",
      endereco: "Endereço do atendimento",
      necessidadesCuidado: "Necessidades de cuidado",
      familiarResponsavel: "Familiar responsável",
    },
    placeholders: {
      nome: "Como você gostaria de ser chamado?",
      cpf: "000.000.000-00",
      telefone: "(00) 00000-0000",
      email: "voce@exemplo.com",
      senha: "Mínimo de 8 caracteres",
      endereco: "Rua, número, bairro e cidade",
      necessidadesCuidado: "Ex.: fisioterapia, acompanhamento de idoso...",
      familiarResponsavel: "Nome e relação com o paciente (opcional)",
    },
  },
  en: {
    back: "Back to home",
    kicker: "Patient registration",
    heroTitle: "Your care starts with well-organized information.",
    heroDescription: "Create your account to find professionals, request home care, and follow every step.",
    benefits: ["Personalized professional search", "Requests tracked in one place", "Your data protected and under your control"],
    imageCaption: "Professional care, close to you.",
    title: "Create your account",
    subtitle: "Enter your information to get started. It takes less than 3 minutes.",
    requiredHint: "* Required fields",
    optional: "optional",
    personalSection: "Personal information",
    personalDescription: "Information used to identify the patient.",
    contactSection: "Contact and access",
    contactDescription: "How we will contact you and protect your account.",
    careSection: "Care information",
    careDescription: "Tell us a little about the care you are looking for.",
    success: "Account created. You can now sign in.",
    submitting: "Creating account...",
    submit: "Create my account",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
    privacy: "By creating your account, your data will only be used to provide CarePoint services.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    fields: {
      nome: "Full name",
      cpf: "CPF",
      dataNascimento: "Date of birth",
      telefone: "Phone number",
      email: "Email",
      senha: "Password",
      endereco: "Care address",
      necessidadesCuidado: "Care needs",
      familiarResponsavel: "Responsible family member",
    },
    placeholders: {
      nome: "How would you like to be addressed?",
      cpf: "000.000.000-00",
      telefone: "(00) 00000-0000",
      email: "you@example.com",
      senha: "At least 8 characters",
      endereco: "Street, number, district, and city",
      necessidadesCuidado: "E.g. physical therapy, elderly care...",
      familiarResponsavel: "Name and relationship to the patient (optional)",
    },
  },
} as const;

const controlClass = "group flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950/70 dark:focus-within:border-brand-400 dark:focus-within:bg-slate-950";
const inputClass = "min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-slate-950 outline-none !ring-0 placeholder:text-slate-400 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 dark:bg-transparent dark:text-white dark:placeholder:text-slate-500";
const iconClass = "shrink-0 text-slate-400 transition group-focus-within:text-brand-600 dark:group-focus-within:text-brand-300";

export default function RegisterPage() {
  const { locale } = useI18n();
  const copy = content[locale];
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<Form>({ resolver: zodResolver(patientRegistrationSchema), mode: "onBlur" });

  const submit = async (data: Form) => {
    try {
      await registerUser({
        ...data,
        cpf: digitsOnly(data.cpf),
        telefone: digitsOnly(data.telefone),
        necessidadesCuidado: data.necessidadesCuidado?.trim() || undefined,
        familiarResponsavel: data.familiarResponsavel?.trim() || undefined,
      });
      toast.success(copy.success);
      router.push("/login/paciente");
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  const errors = form.formState.errors;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f2f7f4] px-4 py-5 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-7 lg:px-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-300/25 blur-3xl dark:bg-brand-700/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/10" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-brand-300 sm:inline-flex">
              <ArrowLeft size={16} aria-hidden="true" /> {copy.back}
            </Link>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative hidden min-h-[720px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#145c43] via-[#1f7a57] to-[#38a879] p-8 text-white shadow-2xl shadow-brand-900/15 lg:sticky lg:top-7 lg:flex lg:h-[calc(100vh-3.5rem)] lg:max-h-[860px] lg:flex-col">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10 bg-white/5" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-50">
                <Sparkles size={14} aria-hidden="true" /> {copy.kicker}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight">{copy.heroTitle}</h1>
              <p className="mt-4 leading-7 text-emerald-50/85">{copy.heroDescription}</p>
              <ul className="mt-7 space-y-3">
                {copy.benefits.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-200" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-8 min-h-64 flex-1 overflow-hidden rounded-3xl border border-white/15 shadow-xl">
              <Image src="/images/profissionais/medica-geriatra.webp" alt="Profissional de saúde do CarePoint" fill sizes="(min-width: 1024px) 360px, 0px" className="object-cover object-top" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-transparent to-transparent" />
              <p className="absolute bottom-0 left-0 right-0 p-5 text-lg font-extrabold">{copy.imageCaption}</p>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
              <div>
                <p className="admin-kicker lg:hidden">{copy.kicker}</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{copy.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">{copy.requiredHint}</span>
            </div>

            <form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-8" noValidate>
              <FormSection icon={<UserRound size={18} />} title={copy.personalSection} description={copy.personalDescription}>
                <FormField id="nome" label={copy.fields.nome} required error={errors.nome?.message} className="sm:col-span-2">
                  <div className={controlClass}>
                    <UserRound size={18} className={iconClass} aria-hidden="true" />
                    <input id="nome" autoComplete="name" placeholder={copy.placeholders.nome} aria-invalid={Boolean(errors.nome)} aria-describedby={errors.nome ? "nome-error" : undefined} className={inputClass} {...form.register("nome")} />
                  </div>
                </FormField>

                <FormField id="cpf" label={copy.fields.cpf} required error={errors.cpf?.message}>
                  <div className={controlClass}>
                    <IdCard size={18} className={iconClass} aria-hidden="true" />
                    <Controller control={form.control} name="cpf" render={({ field }) => (
                      <input id="cpf" inputMode="numeric" autoComplete="off" maxLength={14} value={field.value ?? ""} onBlur={field.onBlur} onChange={event => field.onChange(formatCpf(event.target.value))} placeholder={copy.placeholders.cpf} aria-invalid={Boolean(errors.cpf)} aria-describedby={errors.cpf ? "cpf-error" : undefined} className={inputClass} />
                    )} />
                  </div>
                </FormField>

                <FormField id="dataNascimento" label={copy.fields.dataNascimento} required error={errors.dataNascimento?.message}>
                  <div className={controlClass}>
                    <CalendarDays size={18} className={iconClass} aria-hidden="true" />
                    <input id="dataNascimento" type="date" autoComplete="bday" aria-invalid={Boolean(errors.dataNascimento)} aria-describedby={errors.dataNascimento ? "dataNascimento-error" : undefined} className={`${inputClass} [color-scheme:light] dark:[color-scheme:dark]`} {...form.register("dataNascimento")} />
                  </div>
                </FormField>
              </FormSection>

              <FormSection icon={<Mail size={18} />} title={copy.contactSection} description={copy.contactDescription}>
                <FormField id="telefone" label={copy.fields.telefone} required error={errors.telefone?.message}>
                  <div className={controlClass}>
                    <Phone size={18} className={iconClass} aria-hidden="true" />
                    <Controller control={form.control} name="telefone" render={({ field }) => (
                      <input id="telefone" type="tel" inputMode="tel" autoComplete="tel" maxLength={15} value={field.value ?? ""} onBlur={field.onBlur} onChange={event => field.onChange(formatPhone(event.target.value))} placeholder={copy.placeholders.telefone} aria-invalid={Boolean(errors.telefone)} aria-describedby={errors.telefone ? "telefone-error" : undefined} className={inputClass} />
                    )} />
                  </div>
                </FormField>

                <FormField id="email" label={copy.fields.email} required error={errors.email?.message}>
                  <div className={controlClass}>
                    <Mail size={18} className={iconClass} aria-hidden="true" />
                    <input id="email" type="email" inputMode="email" autoComplete="email" placeholder={copy.placeholders.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className={inputClass} {...form.register("email")} />
                  </div>
                </FormField>

                <FormField id="senha" label={copy.fields.senha} required error={errors.senha?.message} className="sm:col-span-2">
                  <div className={controlClass}>
                    <LockKeyhole size={18} className={iconClass} aria-hidden="true" />
                    <input id="senha" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder={copy.placeholders.senha} aria-invalid={Boolean(errors.senha)} aria-describedby={errors.senha ? "senha-error" : undefined} className={inputClass} {...form.register("senha")} />
                    <button type="button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? copy.hidePassword : copy.showPassword} aria-pressed={showPassword} className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-brand-700 focus-visible:ring-offset-0 dark:hover:bg-slate-800 dark:hover:text-brand-300">
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                </FormField>
              </FormSection>

              <FormSection icon={<HeartHandshake size={18} />} title={copy.careSection} description={copy.careDescription}>
                <FormField id="endereco" label={copy.fields.endereco} required error={errors.endereco?.message} className="sm:col-span-2">
                  <div className={controlClass}>
                    <MapPin size={18} className={iconClass} aria-hidden="true" />
                    <input id="endereco" autoComplete="street-address" placeholder={copy.placeholders.endereco} aria-invalid={Boolean(errors.endereco)} aria-describedby={errors.endereco ? "endereco-error" : undefined} className={inputClass} {...form.register("endereco")} />
                  </div>
                </FormField>

                <FormField id="necessidadesCuidado" label={copy.fields.necessidadesCuidado} optionalLabel={copy.optional} error={errors.necessidadesCuidado?.message}>
                  <div className={`${controlClass} items-start`}>
                    <HeartHandshake size={18} className={`${iconClass} mt-3.5`} aria-hidden="true" />
                    <textarea id="necessidadesCuidado" rows={3} placeholder={copy.placeholders.necessidadesCuidado} aria-invalid={Boolean(errors.necessidadesCuidado)} aria-describedby={errors.necessidadesCuidado ? "necessidadesCuidado-error" : undefined} className={`${inputClass} resize-none`} {...form.register("necessidadesCuidado")} />
                  </div>
                </FormField>

                <FormField id="familiarResponsavel" label={copy.fields.familiarResponsavel} optionalLabel={copy.optional} error={errors.familiarResponsavel?.message}>
                  <div className={`${controlClass} items-start`}>
                    <UsersRound size={18} className={`${iconClass} mt-3.5`} aria-hidden="true" />
                    <textarea id="familiarResponsavel" rows={3} placeholder={copy.placeholders.familiarResponsavel} aria-invalid={Boolean(errors.familiarResponsavel)} aria-describedby={errors.familiarResponsavel ? "familiarResponsavel-error" : undefined} className={`${inputClass} resize-none`} {...form.register("familiarResponsavel")} />
                  </div>
                </FormField>
              </FormSection>

              <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-900 dark:bg-brand-950/30">
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                  <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{copy.privacy}</p>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 rounded-2xl py-3.5 text-base shadow-lg shadow-brand-700/15" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <LoaderCircle size={19} className="animate-spin" aria-hidden="true" /> : null}
                {form.formState.isSubmitting ? copy.submitting : copy.submit}
                {!form.formState.isSubmitting ? <ChevronRight size={19} aria-hidden="true" /> : null}
              </Button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                {copy.hasAccount} <Link href="/login/paciente" className="font-extrabold text-brand-700 hover:underline dark:text-brand-300">{copy.signIn}</Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function FormSection({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="sr-only">{title}</legend>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" aria-hidden="true">{icon}</span>
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function FormField({ id, label, required = false, optionalLabel, error, className = "", children }: { id: string; label: string; required?: boolean; optionalLabel?: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200">
        {label} {required ? <span className="text-rose-600" aria-hidden="true">*</span> : optionalLabel ? <span className="text-xs font-medium text-slate-400">({optionalLabel})</span> : null}
      </label>
      {children}
      {error ? <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p> : null}
    </div>
  );
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
