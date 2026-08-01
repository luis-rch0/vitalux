"use client";

import { Accessibility, Contrast, RotateCcw, Type, X, ZapOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/providers/i18n-provider";

type FontScale = "100" | "112" | "125";
type Preferences = { fontScale: FontScale; highContrast: boolean; reducedMotion: boolean };

const storageKey = "carepoint-accessibility";
const defaults: Preferences = { fontScale: "100", highContrast: false, reducedMotion: false };

export function AccessibilityPanel() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPreferences({ ...defaults, ...JSON.parse(saved) });
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fontScale = preferences.fontScale;
    root.dataset.highContrast = String(preferences.highContrast);
    root.dataset.reducedMotion = String(preferences.reducedMotion);
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences]);

  const update = (next: Partial<Preferences>, message: string) => {
    setPreferences(current => ({ ...current, ...next }));
    setAnnouncement(message);
  };

  return (
    <>
      <span className="sr-only" aria-live="polite">{announcement}</span>
      {open && (
        <section id="painel-acessibilidade" data-a11y-panel className="fixed bottom-36 right-4 z-[70] w-[calc(100vw-2rem)] max-w-sm rounded-3xl border-2 border-brand-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white md:bottom-24 md:right-6" aria-label={t("accessibility.panelLabel")}>
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{t("accessibility.title")}</p><h2 className="mt-1 text-lg font-extrabold">{t("accessibility.customize")}</h2></div>
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t("accessibility.close")}><X size={20} /></button>
          </div>

          <div className="mt-5 border-t pt-5">
            <div className="flex items-center gap-2 font-bold"><Type size={18} className="text-brand-700 dark:text-brand-300" /> {t("accessibility.fontSize")}</div>
            <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={t("accessibility.fontSize")}>
              <FontButton label={t("accessibility.normal")} sample="A" selected={preferences.fontScale === "100"} onClick={() => update({ fontScale: "100" }, t("accessibility.normalEnabled"))} />
              <FontButton label={t("accessibility.large")} sample="A+" selected={preferences.fontScale === "112"} onClick={() => update({ fontScale: "112" }, t("accessibility.largeEnabled"))} />
              <FontButton label={t("accessibility.veryLarge")} sample="A++" selected={preferences.fontScale === "125"} onClick={() => update({ fontScale: "125" }, t("accessibility.veryLargeEnabled"))} />
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t pt-5">
            <PreferenceButton icon={<Contrast size={19} />} title={t("accessibility.highContrast")} description={t("accessibility.highContrastDescription")} pressed={preferences.highContrast} onClick={() => update({ highContrast: !preferences.highContrast }, preferences.highContrast ? t("accessibility.contrastDisabled") : t("accessibility.contrastEnabled"))} />
            <PreferenceButton icon={<ZapOff size={19} />} title={t("accessibility.reduceMotion")} description={t("accessibility.reduceMotionDescription")} pressed={preferences.reducedMotion} onClick={() => update({ reducedMotion: !preferences.reducedMotion }, preferences.reducedMotion ? t("accessibility.motionRestored") : t("accessibility.motionReduced"))} />
          </div>

          <button onClick={() => { setPreferences(defaults); setAnnouncement(t("accessibility.preferencesRestored")); }} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border font-bold text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"><RotateCcw size={17} /> {t("accessibility.restore")}</button>
        </section>
      )}
      <button onClick={() => setOpen(current => !current)} className="fixed bottom-20 right-4 z-[70] grid h-14 w-14 place-items-center rounded-2xl border-2 border-white bg-brand-700 text-white shadow-2xl transition hover:-translate-y-1 hover:bg-brand-600 focus-visible:ring-4 focus-visible:ring-emerald-300 dark:border-slate-800 md:bottom-6 md:right-6" aria-label={open ? t("accessibility.close") : t("accessibility.open")} aria-expanded={open} aria-controls="painel-acessibilidade">
        <Accessibility size={27} />
      </button>
    </>
  );
}

function FontButton({ label, sample, selected, onClick }: { label: string; sample: string; selected: boolean; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`min-h-16 rounded-xl border px-2 py-2 font-black transition ${selected ? "border-brand-700 bg-brand-700 text-white" : "bg-white text-slate-700 hover:bg-brand-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"}`}><span className="block text-lg">{sample}</span><span className="mt-1 block text-[10px] font-bold">{label}</span></button>;
}

function PreferenceButton({ icon, title, description, pressed, onClick }: { icon: React.ReactNode; title: string; description: string; pressed: boolean; onClick: () => void }) {
  return <button type="button" aria-pressed={pressed} onClick={onClick} className={`flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left transition ${pressed ? "border-brand-700 bg-brand-50 dark:bg-brand-900/50" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${pressed ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>{icon}</span><span className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><small className="block text-xs text-slate-500 dark:text-slate-400">{description}</small></span><span className={`h-3 w-3 rounded-full ${pressed ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600"}`} aria-hidden /></button>;
}
