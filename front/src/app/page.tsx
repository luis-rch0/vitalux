"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/providers/i18n-provider";

const content = {
  "pt-BR": {
    ourTeam: "Nossa equipe",
    badge: "Saúde em casa",
    title: "O cuidado certo encontra você.",
    description:
      "Conectamos pacientes, clínicas e profissionais para tornar o atendimento domiciliar mais simples, seguro e humano.",
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
    closingDescription:
      "Encontre profissionais preparados para apoiar pacientes e familiares com segurança, conforto e acompanhamento transparente.",
    startNow: "Começar agora",
  },
  en: {
    ourTeam: "Our team",
    badge: "Healthcare at home",
    title: "The right care finds you.",
    description:
      "We connect patients, clinics, and professionals to make home care simpler, safer, and more human.",
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
    closingDescription:
      "Find professionals prepared to support patients and families with safety, comfort, and transparent follow-up.",
    startNow: "Get started",
  },
} as const;

export default function HomePage() {
  const { locale } = useI18n();
  const copy = content[locale];

  const en = locale === "en";
  const benefits = [
    {
      icon: Stethoscope,
      title: en ? "Find your professional" : "Encontre seu profissional",
      text: en ? "Specialties and profiles" : "Especialidades e perfis",
    },
    {
      icon: HeartHandshake,
      title: en ? "Care at home" : "Cuidado em casa",
      text: en ? "Choose your care address" : "Escolha onde ser atendido",
    },
    {
      icon: CheckCircle2,
      title: en ? "Follow each step" : "Acompanhe cada etapa",
      text: en ? "Request status in one place" : "Status dos pedidos em um lugar",
    },
    {
      icon: ShieldCheck,
      title: en ? "Your personal space" : "Seu espaço pessoal",
      text: en ? "Profile and care history" : "Perfil e histórico de cuidado",
    },
  ];
  const services = [
    {
      image: "medica-carepoint.png",
      title: en ? "Professionals" : "Profissionais",
      text: en ? "Compare profiles and specialties." : "Compare perfis e especialidades.",
      href: "/profissionais",
    },
    {
      image: "clinica-carepoint.png",
      title: en ? "Partner clinics" : "Clínicas parceiras",
      text: en ? "Get to know the care network." : "Conheça a rede de atendimento.",
      href: "/clinicas",
    },
    {
      image: "fisioterapeuta-carepoint.png",
      title: en ? "Personalized care" : "Cuidado individualizado",
      text: en
        ? "Find the right care for your needs."
        : "Busque atendimento para suas necessidades.",
      href: "/profissionais",
    },
    {
      image: "cuidado-domiciliar-familia.png",
      title: en ? "Your requests" : "Seus atendimentos",
      text: en ? "Follow your requests from home." : "Acompanhe seus pedidos sem sair de casa.",
      href: "/solicitacoes",
    },
  ];
  return (
    <main className="care-landing min-h-screen overflow-hidden text-slate-950 dark:text-white">
      <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Logo />
        <nav
          aria-label={en ? "Main navigation" : "Navegação principal"}
          className="hidden items-center gap-7 text-sm font-semibold lg:flex"
        >
          <a href="#inicio">{en ? "Home" : "Início"}</a>
          <a href="#sobre">{en ? "About" : "Sobre"}</a>
          <a href="#cuidado">{en ? "Care network" : "Rede de cuidado"}</a>
          <Link href="/nossa-equipe">{copy.ourTeam}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login/paciente"
            className="rounded-full bg-brand-700 px-4 py-2.5 text-xs font-bold text-white"
          >
            {en ? "Sign in" : "Entrar"}
          </Link>
        </div>
      </header>
      <section id="inicio" className="landing-hero relative mx-auto max-w-[1600px]">
        <div className="landing-hero-photo">
          <Image
            src="/images/cuidado-domiciliar-familia.png"
            alt={copy.familyAlt}
            fill
            sizes="(max-width: 767px) 100vw, 65vw"
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-24">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-xs font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-100">
              <HeartHandshake size={16} />
              {copy.badge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {en ? "Care for you." : "Cuidado para você."}
              <br />
              <span className="text-brand-700 dark:text-brand-300">
                {en ? "Peace of mind" : "Tranquilidade"}
              </span>
              <br />
              {en ? "for your family." : "para sua família."}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
              {copy.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-3 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white"
              >
                {copy.startNow}
                <ArrowRight size={17} />
              </Link>
              <a
                href="#cuidado"
                className="inline-flex items-center gap-3 rounded-xl border border-brand-700 bg-[var(--cp-paper)] px-5 py-3 text-sm font-bold text-brand-700 dark:text-brand-200"
              >
                {en ? "Explore care" : "Conhecer a rede"}
                <Stethoscope size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-label={en ? "Platform features" : "Recursos da plataforma"}
        className="relative z-10 mx-5 rounded-2xl border bg-[var(--cp-paper)] p-6 shadow-soft md:mx-auto md:-mt-8 md:max-w-6xl"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                <Icon size={23} />
              </span>
              <div>
                <h2 className="text-sm font-bold">{title}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        id="sobre"
        className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-2"
      >
        <div className="relative">
          <Image
            src="/images/clinica-carepoint.png"
            alt={copy.clinicAlt}
            width={900}
            height={650}
            className="aspect-[4/3] w-full rounded-[12px_60px_12px_12px] object-cover"
          />
          <span className="absolute bottom-5 left-5 rounded-xl bg-brand-900 px-5 py-3 text-sm font-bold text-white">
            {copy.network}
          </span>
        </div>
        <div>
          <p className="admin-kicker">{en ? "Closer to what matters" : "Perto do que importa"}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            {copy.professionalAtHome}
          </h2>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
            {copy.closingDescription}
          </p>
          <div className="mt-7 grid grid-cols-2 gap-5">
            {benefits.slice(0, 2).map(({ icon: Icon, title }) => (
              <div key={title}>
                <Icon className="mb-3 text-brand-700 dark:text-brand-300" />
                <p className="text-sm font-semibold">{title}</p>
              </div>
            ))}
          </div>
          <Link
            href="/login/paciente"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-300"
          >
            {copy.patientLogin}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section id="cuidado" className="rounded-t-[40px] bg-[var(--cp-paper)] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="admin-kicker">CAREPOINT</p>
              <h2 className="mt-3 text-3xl font-bold">
                {en ? "A network around your care" : "Uma rede ao redor do seu cuidado"}
              </h2>
            </div>
            <Link
              href="/profissionais"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-300"
            >
              {en ? "View professionals" : "Ver profissionais"}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group overflow-hidden rounded-2xl border bg-[var(--cp-canvas)]"
              >
                <Image
                  src={`/images/${item.image}`}
                  alt=""
                  width={420}
                  height={300}
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-5">
                  <h3 className="flex items-center justify-between text-base font-bold">
                    {item.title}
                    <ArrowRight size={16} />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="flex flex-col justify-between gap-6 rounded-[32px_8px_32px_8px] bg-brand-900 p-8 text-white md:flex-row md:items-center md:p-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-200">{copy.welcomingCare}</p>
            <h2 className="mt-3 text-3xl font-bold">
              {en ? "Your next step starts here." : "Seu próximo passo começa aqui."}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-brand-100">
              {en
                ? "Create your profile, find a professional and follow your request."
                : "Crie seu perfil, encontre um profissional e acompanhe sua solicitação."}
            </p>
          </div>
          <Link
            href="/cadastro"
            className="inline-flex shrink-0 items-center justify-center gap-4 rounded-xl bg-white px-6 py-4 text-sm font-bold text-brand-900"
          >
            {copy.startNow}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t px-5 py-8 text-sm md:px-8">
        <Logo />
        <div className="flex flex-wrap gap-6">
          <Link href="/nossa-equipe">{copy.ourTeam}</Link>
          <Link href="/login/admin">{copy.adminArea}</Link>
          <Link href="/login/paciente">{copy.patientLogin}</Link>
        </div>
      </footer>
    </main>
  );
}
