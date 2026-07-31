"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { authErrorMessage, useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { loginSchema } from "@/schemas/auth";

type Form = import("zod").infer<typeof loginSchema>;
export type LoginProfile = "ADMIN" | "PACIENTE";

const portalStyle = {
  PACIENTE: { destination: "/paciente", switchHref: "/login/admin", icon: UserRound, background: "from-[#123f31] via-brand-700 to-brand-500", accent: "text-brand-600 dark:text-brand-300" },
  ADMIN: { destination: "/admin", switchHref: "/login/paciente", icon: ShieldCheck, background: "from-[#07101f] via-[#0d1729] to-[#143c2d]", accent: "text-emerald-600 dark:text-emerald-300" },
} as const;

const translations = {
  "pt-BR": {
    portal: {
      PACIENTE: { title: "Login do paciente", description: "Acesse seus atendimentos, profissionais e solicitações.", badge: "Área do paciente", switchLabel: "Acessar portal administrativo", hero: "Seu cuidado começa com uma escolha segura.", submit: "Entrar como paciente", success: "Login realizado com segurança.", footer: "Privacidade e segurança para seus dados de saúde." },
      ADMIN: { title: "Portal administrativo", description: "Entre para gerenciar usuários, profissionais, clínicas e atendimentos.", badge: "Acesso restrito", switchLabel: "Voltar ao login do paciente", hero: "Gestão segura para uma operação eficiente.", submit: "Entrar no painel administrativo", success: "Acesso administrativo autorizado.", footer: "Acesso monitorado e exclusivo para administradores." },
    },
    tagline: "Sua saúde, nossa prioridade",
    email: "Seu e-mail",
    password: "Sua senha",
    passwordPlaceholder: "Digite sua senha",
    submitting: "Entrando...",
    wrongPortal: "Esta conta não possui acesso a este portal.",
    noAccount: "Ainda não tem uma conta?",
    register: "Faça seu cadastro",
    choiceTitle: "Escolha como deseja entrar",
    choiceDescription: "Paciente e administrador possuem portais independentes.",
    patientChoice: "Sou paciente",
    patientChoiceDescription: "Buscar profissionais e acompanhar solicitações.",
    adminChoice: "Sou administrador",
    adminChoiceDescription: "Gerenciar a operação e visualizar indicadores.",
  },
  en: {
    portal: {
      PACIENTE: { title: "Patient sign in", description: "Access your care, professionals, and requests.", badge: "Patient area", switchLabel: "Open the administration portal", hero: "Your care starts with a safe choice.", submit: "Sign in as a patient", success: "You have signed in securely.", footer: "Privacy and security for your health data." },
      ADMIN: { title: "Administration portal", description: "Sign in to manage users, professionals, clinics, and care.", badge: "Restricted access", switchLabel: "Back to patient sign in", hero: "Secure management for efficient operations.", submit: "Open administration dashboard", success: "Administrative access authorized.", footer: "Monitored access exclusively for administrators." },
    },
    tagline: "Your health is our priority",
    email: "Your email",
    password: "Your password",
    passwordPlaceholder: "Enter your password",
    submitting: "Signing in...",
    wrongPortal: "This account does not have access to this portal.",
    noAccount: "Don't have an account yet?",
    register: "Create your account",
    choiceTitle: "Choose how you want to sign in",
    choiceDescription: "Patients and administrators have separate portals.",
    patientChoice: "I am a patient",
    patientChoiceDescription: "Find professionals and track requests.",
    adminChoice: "I am an administrator",
    adminChoiceDescription: "Manage operations and view indicators.",
  },
} as const;

export function LoginScreen({ profile }: { profile: LoginProfile }) {
  const { login } = useAuth();
  const { locale } = useI18n();
  const router = useRouter();
  const form = useForm<Form>({ resolver: zodResolver(loginSchema) });
  const copy = translations[locale];
  const content = { ...copy.portal[profile], ...portalStyle[profile] };
  const PortalIcon = content.icon;

  const submit = async (data: Form) => {
    try {
      const user = await login({ ...data, perfilSelecionado: profile });
      if (user.role !== profile) {
        toast.error(copy.wrongPortal);
        return;
      }
      toast.success(content.success);
      router.replace(content.destination);
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  return (
    <main className={`relative grid min-h-screen overflow-hidden bg-gradient-to-br ${content.background} px-5 py-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-10`}>
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="absolute right-5 top-5 z-20"><LanguageSwitcher light /></div>
      <section className="relative mx-auto hidden max-w-xl text-white lg:block">
        <Logo light />
        <p className="mt-12 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">{content.badge}</p>
        <h1 className="mt-4 text-5xl font-black leading-tight">{content.hero}</h1>
        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-200">{content.description}</p>
      </section>

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-8 lg:hidden"><Logo light /><p className="mt-2 text-sm text-emerald-100">{copy.tagline}</p></div>
        <form onSubmit={form.handleSubmit(submit)} className="rounded-[2rem] border border-white/60 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/25 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:p-8">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl ${profile === "ADMIN" ? "bg-slate-900 text-emerald-300 dark:bg-emerald-400/10" : "bg-brand-100 text-brand-700 dark:bg-brand-900"}`}><PortalIcon size={24} /></span>
          <p className={`mt-5 text-xs font-extrabold uppercase tracking-[0.18em] ${content.accent}`}>{content.badge}</p>
          <h2 className="mt-2 text-2xl font-extrabold">{content.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{content.description}</p>

          <Field label={copy.email} icon={<Mail size={18} />} error={form.formState.errors.email?.message}>
            <input className="min-w-0 flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-white dark:placeholder:text-slate-500" autoComplete="email" {...form.register("email")} placeholder={profile === "ADMIN" ? "admin@carepoint.com" : "voce@exemplo.com"} />
          </Field>
          <Field label={copy.password} icon={<LockKeyhole size={18} />} error={form.formState.errors.senha?.message}>
            <input className="min-w-0 flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-white dark:placeholder:text-slate-500" type="password" autoComplete="current-password" {...form.register("senha")} placeholder={copy.passwordPlaceholder} />
          </Field>

          <Button className={`mt-6 w-full ${profile === "ADMIN" ? "!bg-slate-900 hover:!bg-slate-800 dark:!bg-emerald-600 dark:hover:!bg-emerald-700" : ""}`} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? copy.submitting : content.submit}
          </Button>

          {profile === "PACIENTE" && <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">{copy.noAccount} <Link className="font-semibold text-brand-700 dark:text-brand-300" href="/cadastro">{copy.register}</Link></p>}
          <Link href={content.switchHref} className="mt-5 block text-center text-sm font-semibold text-slate-500 transition hover:text-brand-700 dark:text-slate-400 dark:hover:text-emerald-300">{content.switchLabel}</Link>
        </form>
        <p className="mt-5 text-center text-sm text-emerald-50">{content.footer}</p>
      </div>
    </main>
  );
}

export function LoginChoice() {
  const { locale } = useI18n();
  const copy = translations[locale];
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#effbf5] to-white px-5 dark:from-slate-950 dark:to-[#0d1729]">
      <div className="absolute right-5 top-5"><LanguageSwitcher /></div>
      <section className="w-full max-w-2xl rounded-[2rem] border bg-white p-7 shadow-2xl dark:bg-slate-900 sm:p-10">
        <Logo />
        <h1 className="mt-8 text-3xl font-black">{copy.choiceTitle}</h1>
        <p className="mt-2 text-slate-500">{copy.choiceDescription}</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <PortalLink href="/login/paciente" icon={<UserRound />} title={copy.patientChoice} description={copy.patientChoiceDescription} />
          <PortalLink href="/login/admin" icon={<ShieldCheck />} title={copy.adminChoice} description={copy.adminChoiceDescription} admin />
        </div>
      </section>
    </main>
  );
}

function PortalLink({ href, icon, title, description, admin = false }: { href: string; icon: React.ReactNode; title: string; description: string; admin?: boolean }) {
  return <Link href={href} className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-xl ${admin ? "border-slate-800 bg-[#0d1729] text-white" : "border-brand-200 bg-brand-50 text-slate-900 dark:border-brand-900 dark:bg-brand-900 dark:text-white"}`}><span className={`grid h-11 w-11 place-items-center rounded-xl ${admin ? "bg-emerald-400/15 text-emerald-300" : "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200"}`}>{icon}</span><strong className="mt-4 block">{title}</strong><small className={`mt-1 block leading-5 ${admin ? "text-slate-300" : "text-slate-500"}`}>{description}</small></Link>;
}

function Field({ label, icon, error, children }: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-200">
      <span className="mb-2 block">{label}</span>
      <span className="flex min-h-12 items-center gap-2 overflow-hidden rounded-xl border border-slate-300 bg-white px-3 text-brand-600 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-brand-300">
        <span className="shrink-0" aria-hidden>{icon}</span>{children}
      </span>
      {error && <span className="mt-1 block text-xs text-rose-600 dark:text-rose-400">{error}</span>}
    </label>
  );
}
