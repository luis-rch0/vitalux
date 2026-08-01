import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() { return <main className="grid min-h-screen place-items-center p-6"><div className="text-center"><Logo/><h1 className="mt-8 text-5xl font-bold">404</h1><h2 className="mt-3 text-xl font-bold">Página não encontrada</h2><p className="mt-2 text-slate-500">O endereço informado não existe ou foi movido.</p><Link href="/" className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white">Ir para o início</Link></div></main>; }
