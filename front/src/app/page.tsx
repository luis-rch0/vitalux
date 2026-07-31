"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, ShieldPlus, Stethoscope, UserRound } from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    ourTeam: "Nossa equipe",
    badge: "Saúde em casa",
    title: "O cuidado certo encontra você.",
    description: "Conectamos pacientes, clínicas e profissionais para tornar o atendimento domiciliar mais simples, seguro e humano.",
    patientLogin: "Entrar como paciente",
    patientLoginDescription: "Encontre profissionais e acompanhe atendimentos.",
    adminArea: "Área administrativa",
    adminAreaDescription: "Gerencie a operação e os indicadores.",
    reviewedProfessionals: "Profissionais avaliados",
    protectedData: "Dados protegidos",
    humanCare: "Atendimento humanizado",
    clinicAlt: "Clínica parceira CarePoint",
    network: "Rede CarePoint",
    closeCare: "Cuidado próximo e acessível",
    preparedAtHome: "Profissionais preparados para atender em casa.",
    familyAlt: "Profissional de saúde atendendo um paciente com apoio da família em casa",
    welcomingCare: "Cuidado que acolhe",
    professionalAtHome: "Atendimento profissional sem sair de casa.",
    closingDescription: "Encontre profissionais preparados para apoiar pacientes e familiares com segurança, conforto e acompanhamento transparente.",
    startNow: "Começar agora",
  },
  en: {
    ourTeam: "Our team",
    badge: "Healthcare at home",
    title: "The right care finds you.",
    description: "We connect patients, clinics, and professionals to make home care simpler, safer, and more human.",
    patientLogin: "Sign in as a patient",
    patientLoginDescription: "Find professionals and track your care.",
    adminArea: "Administration area",
    adminAreaDescription: "Manage operations and performance indicators.",
    reviewedProfessionals: "Reviewed professionals",
    protectedData: "Protected data",
    humanCare: "Human-centered care",
    clinicAlt: "CarePoint partner clinic",
    network: "CarePoint network",
    closeCare: "Accessible care close to you",
    preparedAtHome: "Professionals prepared to care for you at home.",
    familyAlt: "Healthcare professional assisting a patient and family at home",
    welcomingCare: "Care that welcomes",
    professionalAtHome: "Professional care without leaving home.",
    closingDescription: "Find professionals prepared to support patients and families with safety, comfort, and transparent follow-up.",
    startNow: "Get started",
  },
} as const;

export default function HomePage() {
  const { locale } = useI18n();
  const copy = content[locale];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8f6] text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/nossa-equipe" className="text-sm font-bold text-brand-700 dark:text-brand-300">{copy.ourTeam}</Link>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-10 px-5 pb-12 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="animate-rise relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700 shadow-sm dark:border-brand-900 dark:bg-slate-900 dark:text-brand-300"><HeartHandshake size={15} /> {copy.badge}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">{copy.title}</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">{copy.description}</p>

          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <EntryCard href="/login/paciente" icon={<UserRound size={25} />} title={copy.patientLogin} description={copy.patientLoginDescription} primary />
            <EntryCard href="/login/admin" icon={<ShieldPlus size={25} />} title={copy.adminArea} description={copy.adminAreaDescription} />
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-brand-600" /> {copy.reviewedProfessionals}</span>
            <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-brand-600" /> {copy.protectedData}</span>
            <span className="flex items-center gap-2"><Stethoscope size={17} className="text-brand-600" /> {copy.humanCare}</span>
          </div>
        </div>

        <div className="animate-rise relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-10 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-700/20" />
          <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl shadow-brand-900/20 dark:border-slate-900 dark:bg-slate-900">
            <Image src="/images/clinica-carepoint.png" alt={copy.clinicAlt} width={1536} height={1024} className="aspect-[4/3] w-full object-cover" priority />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-slate-950/70 p-4 text-white backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">{copy.network}</p>
              <div className="mt-2 flex items-end justify-between gap-4"><div><strong className="text-lg">{copy.closeCare}</strong><p className="mt-1 text-sm text-slate-200">{copy.preparedAtHome}</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-400 text-slate-950"><ArrowRight size={20} /></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-soft dark:bg-slate-900 lg:grid lg:grid-cols-2">
          <Image src="/images/cuidado-domiciliar-familia.png" alt={copy.familyAlt} width={1536} height={1024} className="h-full min-h-72 w-full object-cover" />
          <div className="flex flex-col justify-center p-7 md:p-12">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{copy.welcomingCare}</span>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">{copy.professionalAtHome}</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{copy.closingDescription}</p>
            <Link href="/login/paciente" className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white transition hover:bg-brand-700">{copy.startNow} <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EntryCard({ href, icon, title, description, primary = false }: { href: string; icon: React.ReactNode; title: string; description: string; primary?: boolean }) {
  return (
    <Link href={href} className={`group flex items-center gap-4 rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${primary ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700" : "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"}`}>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${primary ? "bg-white/15" : "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200"}`}>{icon}</span>
      <span className="min-w-0"><strong className="block">{title}</strong><small className={`mt-1 block leading-5 ${primary ? "text-brand-100" : "text-slate-500"}`}>{description}</small></span>
    </Link>
  );
}
