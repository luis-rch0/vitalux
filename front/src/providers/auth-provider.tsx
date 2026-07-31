"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services/api";
import { authService, type LoginPayload, type RegisterPayload } from "@/services/auth";
import type { AuthUser, Role } from "@/types/api";

type AuthContextValue = { user: AuthUser | null; loading: boolean; login: (payload: LoginPayload) => Promise<AuthUser>; register: (payload: RegisterPayload) => Promise<AuthUser>; logout: () => Promise<void>; };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const publicPath = pathname === "/" || pathname === "/cadastro" || pathname === "/nossa-equipe" || pathname.startsWith("/login");
  const me = useQuery({ queryKey: ["auth", "me"], queryFn: authService.me, retry: false, staleTime: 60_000 });
  const user = me.data ?? null;

  useEffect(() => {
    const clear = () => {
      queryClient.setQueryData(["auth", "me"], null);
      if (!publicPath) router.push(pathname.startsWith("/admin") ? "/login/admin" : "/login/paciente");
    };
    window.addEventListener("carepoint:unauthorized", clear);
    return () => window.removeEventListener("carepoint:unauthorized", clear);
  }, [pathname, publicPath, queryClient, router]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading: me.isLoading,
    login: async (payload) => { const result = await authService.login(payload); queryClient.setQueryData(["auth", "me"], result); return result; },
    register: async (payload) => { const result = await authService.register(payload); return result; },
    logout: async () => { try { await authService.logout(); } finally { queryClient.setQueryData(["auth", "me"], null); router.push("/"); } },
  }), [me.isLoading, queryClient, router, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}

export function RouteGuard({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace(roles?.includes("ADMIN") ? "/login/admin" : "/login/paciente");
    if (!loading && user && roles && !roles.includes(user.role)) router.replace(user.role === "ADMIN" ? "/admin" : "/paciente");
  }, [loading, roles, router, user]);
  if (loading || !user || (roles && !roles.includes(user.role))) return <div className="mx-auto mt-24 h-24 w-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" aria-label="Carregando" />;
  return <>{children}</>;
}

export function authErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  toast.error("Não foi possível concluir a operação.");
  return "Não foi possível concluir a operação.";
}
