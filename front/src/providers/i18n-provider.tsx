"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "pt-BR" | "en";

const STORAGE_KEY = "carepoint-language";

const ptBR = {
  "nav.home": "Início",
  "nav.dashboard": "Painel",
  "nav.overview": "Visão geral",
  "nav.users": "Usuários",
  "nav.appointments": "Agendamentos",
  "nav.professionals": "Profissionais",
  "nav.clinics": "Clínicas",
  "nav.patients": "Pacientes",
  "nav.requests": "Solicitações",
  "nav.settings": "Configurações",
  "nav.logout": "Sair",
  "theme.toggle": "Alternar tema",
  "shell.adminCenter": "Central administrativa",
  "shell.adminCenterDescription": "Gestão completa da operação CarePoint.",
  "shell.changeTheme": "Alterar tema",
  "shell.administration": "Administração",
  "shell.patientArea": "Área do paciente",
  "shell.adminSubtitle": "Dados e controle operacional",
  "shell.patientSubtitle": "Cuidado domiciliar em um só lugar",
  "shell.administrator": "Administrador",
  "shell.patient": "Paciente",
  "settings.title": "Configurações",
  "settings.subtitle": "Personalize sua experiência no CarePoint.",
  "settings.account": "Conta",
  "settings.editProfile": "Editar perfil",
  "settings.editProfileDescription": "Atualize suas informações",
  "settings.notifications": "Notificações",
  "settings.enableNotifications": "Ativar notificações",
  "settings.enableNotificationsDescription": "Receba alertas e atualizações",
  "settings.reminders": "Lembretes",
  "settings.remindersDescription": "Lembretes diários de atendimento",
  "settings.application": "Configurações do aplicativo",
  "settings.language": "Idioma",
  "settings.darkMode": "Modo escuro",
  "settings.darkModeDescription": "Alterne entre os temas claro e escuro",
  "settings.help": "Ajuda",
  "settings.helpSupport": "Ajuda e suporte",
  "settings.helpSupportDescription": "Perguntas frequentes e contato",
  "settings.ourTeam": "Nossa equipe",
  "settings.ourTeamDescription": "Conheça a Vitalux",
  "settings.logout": "Sair da conta",
  "settings.portuguese": "Português (Brasil)",
  "settings.english": "English",
  "settings.languageLabel": "Selecionar idioma",
  "settings.toggleNotifications": "Ativar ou desativar notificações",
  "settings.toggleReminders": "Ativar ou desativar lembretes",
  "settings.toggleDarkMode": "Ativar ou desativar modo escuro",
  "adminSettings.title": "Configurações administrativas",
  "adminSettings.subtitle": "A segurança de contas, CORS e integrações é configurada por variáveis de ambiente do backend.",
  "adminSettings.operation": "Operação do CarePoint",
  "adminSettings.description": "Use as áreas de Profissionais, Clínicas, Pacientes e Solicitações para gerenciar os dados do marketplace. Dados confidenciais e preferências de implantação não são expostos na interface.",
  "accessibility.panelLabel": "Opções de acessibilidade",
  "accessibility.title": "Acessibilidade",
  "accessibility.customize": "Personalize a visualização",
  "accessibility.open": "Abrir opções de acessibilidade",
  "accessibility.close": "Fechar opções de acessibilidade",
  "accessibility.fontSize": "Tamanho do texto",
  "accessibility.normal": "Normal",
  "accessibility.large": "Grande",
  "accessibility.veryLarge": "Muito grande",
  "accessibility.highContrast": "Alto contraste",
  "accessibility.highContrastDescription": "Realça textos, bordas e foco",
  "accessibility.reduceMotion": "Reduzir animações",
  "accessibility.reduceMotionDescription": "Evita movimentos desnecessários",
  "accessibility.restore": "Restaurar padrão",
  "accessibility.normalEnabled": "Tamanho de texto normal ativado",
  "accessibility.largeEnabled": "Texto grande ativado",
  "accessibility.veryLargeEnabled": "Texto muito grande ativado",
  "accessibility.contrastEnabled": "Alto contraste ativado",
  "accessibility.contrastDisabled": "Alto contraste desativado",
  "accessibility.motionReduced": "Animações reduzidas",
  "accessibility.motionRestored": "Animações restauradas",
  "accessibility.preferencesRestored": "Preferências de acessibilidade restauradas",
} as const;

export type TranslationKey = keyof typeof ptBR;

const en: Record<TranslationKey, string> = {
  "nav.home": "Home",
  "nav.dashboard": "Dashboard",
  "nav.overview": "Overview",
  "nav.users": "Users",
  "nav.appointments": "Appointments",
  "nav.professionals": "Professionals",
  "nav.clinics": "Clinics",
  "nav.patients": "Patients",
  "nav.requests": "Requests",
  "nav.settings": "Settings",
  "nav.logout": "Log out",
  "theme.toggle": "Toggle theme",
  "shell.adminCenter": "Administration center",
  "shell.adminCenterDescription": "Complete CarePoint operations management.",
  "shell.changeTheme": "Change theme",
  "shell.administration": "Administration",
  "shell.patientArea": "Patient area",
  "shell.adminSubtitle": "Data and operational control",
  "shell.patientSubtitle": "Home care in one place",
  "shell.administrator": "Administrator",
  "shell.patient": "Patient",
  "settings.title": "Settings",
  "settings.subtitle": "Personalize your CarePoint experience.",
  "settings.account": "Account",
  "settings.editProfile": "Edit profile",
  "settings.editProfileDescription": "Update your information",
  "settings.notifications": "Notifications",
  "settings.enableNotifications": "Enable notifications",
  "settings.enableNotificationsDescription": "Receive alerts and updates",
  "settings.reminders": "Reminders",
  "settings.remindersDescription": "Daily care reminders",
  "settings.application": "Application settings",
  "settings.language": "Language",
  "settings.darkMode": "Dark mode",
  "settings.darkModeDescription": "Switch between light and dark themes",
  "settings.help": "Help",
  "settings.helpSupport": "Help and support",
  "settings.helpSupportDescription": "Frequently asked questions and contact",
  "settings.ourTeam": "Our team",
  "settings.ourTeamDescription": "Meet Vitalux",
  "settings.logout": "Log out",
  "settings.portuguese": "Português (Brasil)",
  "settings.english": "English",
  "settings.languageLabel": "Select language",
  "settings.toggleNotifications": "Enable or disable notifications",
  "settings.toggleReminders": "Enable or disable reminders",
  "settings.toggleDarkMode": "Enable or disable dark mode",
  "adminSettings.title": "Administrative settings",
  "adminSettings.subtitle": "Account security, CORS, and integrations are configured through backend environment variables.",
  "adminSettings.operation": "CarePoint operations",
  "adminSettings.description": "Use the Professionals, Clinics, Patients, and Requests sections to manage marketplace data. Confidential data and deployment preferences are not exposed in the interface.",
  "accessibility.panelLabel": "Accessibility options",
  "accessibility.title": "Accessibility",
  "accessibility.customize": "Customize the display",
  "accessibility.open": "Open accessibility options",
  "accessibility.close": "Close accessibility options",
  "accessibility.fontSize": "Text size",
  "accessibility.normal": "Normal",
  "accessibility.large": "Large",
  "accessibility.veryLarge": "Very large",
  "accessibility.highContrast": "High contrast",
  "accessibility.highContrastDescription": "Enhances text, borders, and focus",
  "accessibility.reduceMotion": "Reduce animations",
  "accessibility.reduceMotionDescription": "Avoids unnecessary motion",
  "accessibility.restore": "Restore defaults",
  "accessibility.normalEnabled": "Normal text size enabled",
  "accessibility.largeEnabled": "Large text enabled",
  "accessibility.veryLargeEnabled": "Very large text enabled",
  "accessibility.contrastEnabled": "High contrast enabled",
  "accessibility.contrastDisabled": "High contrast disabled",
  "accessibility.motionReduced": "Animations reduced",
  "accessibility.motionRestored": "Animations restored",
  "accessibility.preferencesRestored": "Accessibility preferences restored",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { "pt-BR": ptBR, en };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "pt-BR" || value === "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  const applyLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  useEffect(() => {
    const storedLocale = localStorage.getItem(STORAGE_KEY);
    applyLocale(isLocale(storedLocale) ? storedLocale : "pt-BR");

    const syncLocale = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isLocale(event.newValue)) applyLocale(event.newValue);
    };
    window.addEventListener("storage", syncLocale);
    return () => window.removeEventListener("storage", syncLocale);
  }, [applyLocale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, nextLocale);
    applyLocale(nextLocale);
  }, [applyLocale]);

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t: key => dictionaries[locale][key] }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n deve ser usado dentro de I18nProvider");
  return context;
}
