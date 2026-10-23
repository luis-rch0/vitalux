"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { assistantCopy } from "./copy";

const AssistantPanel = dynamic(() => import("./assistant-panel"), { ssr: false });

export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();
  const { locale } = useI18n();
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("carepoint:open-assistant", show);
    return () => window.removeEventListener("carepoint:open-assistant", show);
  }, []);
  if (!user || !["ADMIN", "PACIENTE"].includes(user.role)) return null;
  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={assistantCopy[locale].open}
        aria-expanded={open}
        aria-controls="carepoint-assistant"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-40 flex h-12 items-center gap-2 rounded-full bg-brand-900 px-4 text-sm font-semibold text-white shadow-lg md:bottom-6 md:left-auto md:right-24"
      >
        <MessageCircle size={19} />
        <span>CarePoint</span>
      </button>
      {open && (
        <AssistantPanel
          key={user.id}
          onClose={() => {
            setOpen(false);
            button.current?.focus();
          }}
        />
      )}
    </>
  );
}
