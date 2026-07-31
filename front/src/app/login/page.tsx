"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginChoice, LoginScreen } from "@/components/auth/login-screen";

export default function LoginPage() {
  return <Suspense fallback={<main className="min-h-screen bg-brand-700" aria-label="Carregando" />}><LoginContent /></Suspense>;
}

function LoginContent() {
  const params = useSearchParams();
  const profile = params.get("perfil");
  if (profile === "ADMIN" || profile === "PACIENTE") return <LoginScreen profile={profile} />;
  return <LoginChoice />;
}
