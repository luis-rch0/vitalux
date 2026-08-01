"use client";

import { Globe2 } from "lucide-react";
import { type Locale, useI18n } from "@/providers/i18n-provider";

const languages: Array<{ locale: Locale; label: string }> = [
  { locale: "pt-BR", label: "PT" },
  { locale: "en", label: "EN" },
];

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { locale, setLocale } = useI18n();
  const label = locale === "en" ? "Choose language" : "Escolher idioma";

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded-xl border p-1.5 text-xs font-extrabold shadow-sm backdrop-blur transition hover:-translate-y-0.5 ${light ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-white/85 text-slate-700 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200"}`}
    >
      <Globe2 size={15} aria-hidden="true" />
      {languages.map(language => {
        const active = language.locale === locale;

        return (
          <button
            key={language.locale}
            type="button"
            aria-pressed={active}
            aria-label={`${label}: ${language.label}`}
            onClick={() => setLocale(language.locale)}
            className={`rounded-lg px-2 py-1 leading-none transition focus-visible:ring-offset-1 ${active
              ? light
                ? "bg-white text-brand-800 shadow-sm"
                : "bg-brand-600 text-white shadow-sm"
              : light
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
