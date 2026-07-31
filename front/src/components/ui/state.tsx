import { Inbox } from "lucide-react";
export function Skeleton({ className = "" }: { className?: string }) { return <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} />; }
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500 dark:text-slate-400"><Inbox className="mx-auto mb-3" aria-hidden /><h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3><p className="mt-1 text-sm">{description}</p></div>; }
