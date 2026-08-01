"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } }));
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <I18nProvider><QueryClientProvider client={queryClient}><AuthProvider>{children}</AuthProvider><AccessibilityPanel /><Toaster richColors position="top-center" /></QueryClientProvider></I18nProvider>
  </ThemeProvider>;
}
