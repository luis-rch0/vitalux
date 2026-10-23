"use client";

import { AlertCircle } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

export function QueryError({ retry }: { retry: () => unknown }) {
  const { locale } = useI18n();
  return (
    <div
      role="alert"
      className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:bg-amber-950 dark:text-amber-100"
    >
      <AlertCircle aria-hidden className="mb-2" />
      <p>
        {locale === "en"
          ? "We could not load this information."
          : "Não foi possível carregar estas informações."}
      </p>
      <button
        type="button"
        onClick={() => void retry()}
        className="mt-3 rounded-lg border border-current px-4 py-2 font-semibold"
      >
        {locale === "en" ? "Try again" : "Tentar novamente"}
      </button>
    </div>
  );
}
