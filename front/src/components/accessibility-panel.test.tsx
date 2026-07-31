import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { I18nProvider } from "@/providers/i18n-provider";

describe("AccessibilityPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-font-scale");
    document.documentElement.removeAttribute("data-high-contrast");
    document.documentElement.removeAttribute("data-reduced-motion");
  });

  afterEach(cleanup);

  it("applies and persists visual accessibility preferences", async () => {
    render(<I18nProvider><AccessibilityPanel /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir opções de acessibilidade" }));
    fireEvent.click(screen.getByRole("button", { name: "A++ Muito grande" }));
    fireEvent.click(screen.getByRole("button", { name: /Alto contraste/ }));
    fireEvent.click(screen.getByRole("button", { name: /Reduzir animações/ }));

    await waitFor(() => {
      expect(document.documentElement.dataset.fontScale).toBe("125");
      expect(document.documentElement.dataset.highContrast).toBe("true");
      expect(document.documentElement.dataset.reducedMotion).toBe("true");
    });

    expect(localStorage.getItem("carepoint-accessibility")).toContain('"fontScale":"125"');
  });
});
