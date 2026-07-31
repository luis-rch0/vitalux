import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { I18nProvider, useI18n } from "@/providers/i18n-provider";

function LanguageConsumer() {
  const { locale, setLocale, t } = useI18n();
  return <div><span>{locale}</span><span>{t("nav.home")}</span><button onClick={() => setLocale("pt-BR")}>Português</button></div>;
}

describe("I18nProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "pt-BR";
  });

  afterEach(cleanup);

  it("carrega o idioma salvo e atualiza o atributo lang", () => {
    localStorage.setItem("carepoint-language", "en");
    render(<I18nProvider><LanguageConsumer/></I18nProvider>);
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
  });

  it("persiste uma nova escolha de idioma", () => {
    localStorage.setItem("carepoint-language", "en");
    render(<I18nProvider><LanguageConsumer/></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Português" }));
    expect(localStorage.getItem("carepoint-language")).toBe("pt-BR");
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("pt-BR");
  });
});
