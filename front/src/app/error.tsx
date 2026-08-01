"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center p-6"><section className="surface max-w-md text-center"><h1 className="text-2xl font-bold">Não foi possível carregar esta página</h1><p className="mt-3 text-slate-500">Tente novamente. Se o problema continuar, entre em contato com o suporte.</p><Button className="mt-6" onClick={reset}>Tentar novamente</Button></section></main>;
}
