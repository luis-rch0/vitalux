import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "CarePoint | Atendimento domiciliar",
  description: "Encontre cuidados de saúde para atendimento domiciliar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a>
        <Providers><div id="conteudo-principal">{children}</div></Providers>
      </body>
    </html>
  );
}
