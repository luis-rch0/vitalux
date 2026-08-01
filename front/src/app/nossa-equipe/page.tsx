"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  Home,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/providers/i18n-provider";
import styles from "./team.module.css";

const team = [
  "Gabriel Quinelato",
  "João Francisco",
  "Kayke Cruz",
  "Luis Eduardo Rocha",
  "Rafael Felipe",
];

const journeyIcons = [
  <Search key="search" />,
  <Stethoscope key="professional" />,
  <Home key="home" />,
  <ClipboardCheck key="request" />,
];

const ecosystemIcons = [
  <UserRound key="patient" />,
  <Building2 key="clinic" />,
  <ShieldCheck key="admin" />,
];

const content = {
  "pt-BR": {
    navigationLabel: "Navegação da página",
    back: "Voltar",
    about: "Sobre nós",
    heroTitle: "Tecnologia que aproxima cuidado e pessoas.",
    heroDescription:
      "O CarePoint nasceu para tornar o atendimento domiciliar em saúde mais acessível, organizado e humano — desde a busca pelo profissional até o acompanhamento da solicitação.",
    humanCare: "Cuidado humanizado",
    homeCare: "Atendimento em casa",
    clearJourney: "Jornada transparente",
    photoAlt: "Os cinco integrantes da equipe Vitalux em frente ao Firjan SENAI",
    photoCaption: "Equipe Vitalux · Projeto Integrador",
    universeLabel: "Como o CarePoint funciona",
    universeTitle: "O cuidado domiciliar conectado de ponta a ponta",
    universeDescription:
      "No CarePoint, pacientes e familiares procuram apoio para necessidades reais de saúde. Clínicas reúnem profissionais de diferentes áreas, enquanto a administração mantém os cadastros e solicitações organizados. A plataforma conecta essas pessoas em uma experiência semelhante a um marketplace, sem perder de vista o que mais importa: confiança, acolhimento e continuidade do cuidado.",
    journey: [
      {
        title: "Encontre o cuidado",
        description: "Pesquise profissionais e clínicas por profissão, especialidade, localização e valor.",
      },
      {
        title: "Conheça quem atende",
        description: "Compare perfis, experiências, serviços e avaliações antes de tomar sua decisão.",
      },
      {
        title: "Solicite em casa",
        description: "Informe sua necessidade, endereço e data desejada para o atendimento domiciliar.",
      },
      {
        title: "Acompanhe cada etapa",
        description: "Veja a análise da equipe administrativa e acompanhe o status da solicitação com clareza.",
      },
    ],
    networkLabel: "Quem faz parte",
    networkTitle: "Uma rede organizada em torno do paciente",
    networkDescription:
      "Cada perfil participa de uma etapa específica. Assim, o paciente encontra opções, escolhe com informação e sabe o que está acontecendo com seu pedido de atendimento.",
    ecosystem: [
      {
        title: "Pacientes e familiares",
        description: "Encontram o cuidado adequado, enviam solicitações e acompanham o atendimento em um só lugar.",
      },
      {
        title: "Clínicas e profissionais",
        description: "Apresentam especialidades e serviços para que cada pessoa faça uma escolha mais informada.",
      },
      {
        title: "Administração",
        description: "Mantém os cadastros organizados e analisa as solicitações para apoiar uma jornada segura.",
      },
    ],
    teamLabel: "Nossa equipe",
    teamDescription: "Somos o time responsável por idealizar e desenvolver o CarePoint como Projeto Integrador.",
    membersCount: "5 integrantes",
    memberLabel: "Integrante Vitalux",
    teachers: "Docentes",
    footerProject: "CarePoint · Projeto Integrador da equipe Vitalux",
    footerMessage: "Atendimento domiciliar em saúde com informação, proximidade e cuidado.",
  },
  en: {
    navigationLabel: "Page navigation",
    back: "Back",
    about: "About us",
    heroTitle: "Technology that brings care and people closer.",
    heroDescription:
      "CarePoint was created to make home healthcare more accessible, organized, and human — from finding a professional to tracking a care request.",
    humanCare: "Human-centered care",
    homeCare: "Care at home",
    clearJourney: "A transparent journey",
    photoAlt: "The five members of the Vitalux team in front of Firjan SENAI",
    photoCaption: "Vitalux team · Integrative Project",
    universeLabel: "Our world",
    universeTitle: "Connected home care from beginning to end",
    universeDescription:
      "In the CarePoint world, patients and families seek support for real healthcare needs. Clinics bring together professionals from different fields, while administrators keep records and requests organized. The platform connects these people through a marketplace-like experience without losing sight of what matters most: trust, compassion, and continuity of care.",
    journey: [
      {
        title: "Find the right care",
        description: "Search professionals and clinics by profession, specialty, location, and price.",
      },
      {
        title: "Know your provider",
        description: "Compare profiles, experience, services, and reviews before making your decision.",
      },
      {
        title: "Request care at home",
        description: "Share your needs, address, and preferred date for home care.",
      },
      {
        title: "Follow every step",
        description: "See the administrative review and track the request status with clarity.",
      },
    ],
    networkLabel: "Who takes part",
    networkTitle: "A network organized around the patient",
    networkDescription:
      "Each profile takes part in a specific stage. Patients can find options, make informed choices, and know what is happening with their care request.",
    ecosystem: [
      {
        title: "Patients and families",
        description: "Find suitable care, submit requests, and track services in one place.",
      },
      {
        title: "Clinics and professionals",
        description: "Present specialties and services so each person can make a more informed choice.",
      },
      {
        title: "Administration",
        description: "Keeps records organized and reviews requests to support a safe care journey.",
      },
    ],
    teamLabel: "Our team",
    teamDescription: "We are the team that envisioned and developed CarePoint as an Integrative Project.",
    membersCount: "5 team members",
    memberLabel: "Vitalux team member",
    teachers: "Faculty advisors",
    footerProject: "CarePoint · Vitalux team Integrative Project",
    footerMessage: "Home healthcare with information, closeness, and compassion.",
  },
} as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-900 dark:bg-brand-900/40 dark:text-brand-100">
      <Sparkles aria-hidden="true" size={14} />
      {children}
    </p>
  );
}

export default function TeamPage() {
  const { locale } = useI18n();
  const copy = content[locale];

  return (
    <main className={`${styles.page} min-h-screen overflow-hidden px-5 py-6 md:px-10 md:py-10`}>
      <div className={styles.ambientOne} aria-hidden="true" />
      <div className={styles.ambientTwo} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <nav className={`${styles.reveal} flex items-center justify-between gap-4`} aria-label={copy.navigationLabel}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/30"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            {copy.back}
          </Link>
          <div className="flex items-center gap-3"><LanguageSwitcher /><Logo /></div>
        </nav>

        <section className={`${styles.hero} mt-8 overflow-hidden rounded-[2rem] bg-brand-900 text-white shadow-soft`}>
          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-100">{copy.about}</p>
              <h1 className="mt-4 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-brand-50/90 sm:text-lg">
                {copy.heroDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-sm">
                  <HeartHandshake aria-hidden="true" size={17} /> {copy.humanCare}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-sm">
                  <Home aria-hidden="true" size={17} /> {copy.homeCare}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-sm">
                  <CheckCircle2 aria-hidden="true" size={17} /> {copy.clearJourney}
                </span>
              </div>
            </div>

            <figure className={`${styles.photoFrame} relative min-h-[330px] sm:min-h-[440px] lg:min-h-full`}>
              <Image
                src="/images/equipe-saude-carepoint.png"
                alt={copy.photoAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <figcaption className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl border border-white/20 bg-slate-950/55 px-4 py-3 text-sm text-white backdrop-blur-md">
                {copy.photoCaption}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="carepoint-title">
          <div className={`${styles.reveal} mx-auto max-w-3xl text-center`}>
            <Eyebrow>{copy.universeLabel}</Eyebrow>
            <h2 id="carepoint-title" className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {copy.universeTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {copy.universeDescription}
            </p>
          </div>

          <div className={`${styles.staggerGrid} mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4`}>
            {copy.journey.map((step, index) => (
              <article
                key={step.title}
                className={`${styles.journeyCard} rounded-3xl border bg-white p-6 shadow-soft dark:bg-slate-900`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-100">
                    {journeyIcons[index]}
                  </span>
                  <span className="text-sm font-bold tracking-widest text-brand-600 dark:text-brand-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border bg-white/80 p-6 shadow-soft backdrop-blur-sm dark:bg-slate-900/80 sm:p-10" aria-labelledby="ecosystem-title">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className={styles.reveal}>
              <Eyebrow>{copy.networkLabel}</Eyebrow>
              <h2 id="ecosystem-title" className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {copy.networkTitle}
              </h2>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                {copy.networkDescription}
              </p>
            </div>

            <div className={`${styles.staggerGrid} grid gap-4`}>
              {copy.ecosystem.map((item, index) => (
                <article key={item.title} className={`${styles.ecosystemCard} flex gap-4 rounded-2xl border bg-white p-5 dark:bg-slate-950`}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                    {ecosystemIcons[index]}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="team-title">
          <div className={`${styles.reveal} flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between`}>
            <div>
              <Eyebrow>{copy.teamLabel}</Eyebrow>
              <h2 id="team-title" className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Vitalux
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                {copy.teamDescription}
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900 dark:bg-brand-900/50 dark:text-brand-100">
              <UsersRound aria-hidden="true" size={20} /> {copy.membersCount}
            </div>
          </div>

          <ul className={`${styles.staggerGrid} mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5`}>
            {team.map((member, index) => (
              <li key={member} className={`${styles.memberCard} rounded-3xl border bg-white p-5 shadow-soft dark:bg-slate-900`}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 font-bold text-white" aria-hidden="true">
                  {member
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <p className="mt-5 font-bold leading-6 text-slate-900 dark:text-white">{member}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{copy.memberLabel} {index + 1}</p>
              </li>
            ))}
          </ul>

          <div className={`${styles.reveal} mt-6 flex flex-col gap-4 rounded-3xl border border-brand-100 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-900/30 sm:flex-row sm:items-center`}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-200">
              <GraduationCap aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-200">{copy.teachers}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Debora Souza e Felippe Nascimento</p>
            </div>
          </div>
        </section>

        <footer className="border-t py-8 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
          <p>{copy.footerProject}</p>
          <p>{copy.footerMessage}</p>
        </footer>
      </div>
    </main>
  );
}
