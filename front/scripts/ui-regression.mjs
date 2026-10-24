/* Synthetic API fixtures: browser regression, not a production integration test. */
import { pathToFileURL } from "node:url";
import path from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href
    : "playwright"
);
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const out = process.env.TEST_OUTPUT || path.join("test-results", "ui");
fs.mkdirSync(out, { recursive: true });
const professional = {
  id: 1,
  nome: "Dra. Marina Costa",
  profissao: "FISIOTERAPEUTA",
  especialidade: "Fisioterapia",
  valorAtendimento: 180,
  telefone: "11999999999",
  email: "demo@example.com",
  descricao: "Acompanhamento domiciliar e cuidado individualizado.",
  ativo: true,
  mediaAvaliacoes: 4.8,
  quantidadeAvaliacoes: 12,
};
const patient = {
  id: 1,
  nome: "Pessoa de Teste",
  cpf: "00000000000",
  dataNascimento: "1990-01-01",
  telefone: "11999999999",
  email: "demo@example.com",
  endereco: "Endereço de teste",
  ativo: true,
};
const clinic = {
  id: 1,
  nome: "Clínica Jardim",
  cnpj: "00000000000000",
  endereco: "Endereço de teste",
  telefone: "11999999999",
  email: "clinic@example.com",
  totalProfissionais: 3,
  ativo: true,
};
const request = {
  id: 1,
  pacienteId: 1,
  pacienteNome: patient.nome,
  profissional: professional,
  servicoSolicitado: "Fisioterapia domiciliar",
  necessidadesInformadas: "Acompanhamento",
  dataDesejada: "2027-01-20T15:00:00Z",
  enderecoAtendimento: patient.endereco,
  valor: 180,
  status: "PENDENTE",
  podeAvaliar: false,
};
const paged = (content) => ({
  content,
  page: 0,
  size: 12,
  totalElements: content.length,
  totalPages: 1,
  first: true,
  last: true,
});
let browser;
let page;
let currentStep = "Inicialização";

function logStep(label) {
  currentStep = label;
  console.log(`[UI] ${label}`);
}

(async () => {
  try {
    logStep("Abrindo Chromium");
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROMIUM_EXECUTABLE
        ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
        : {}),
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(20000);
    async function openPage(route, label) {
      logStep(label);
      await page.goto(`${base}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });
    }

    let role = "PACIENTE",
      failProfessionals = false,
      confirmed = 0,
      preparedType = "",
      preparedDraft;
    const errors = [];
    const imageNetworkIssues = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      if (request.resourceType() === "image") {
        imageNetworkIssues.push(`Requisição falhou: ${request.url()} — ${request.failure()}`);
      }
    });
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && !response.ok()) {
        imageNetworkIssues.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
    await page.route("**/api/**", async (route) => {
      const url = new URL(route.request().url());
      const path = url.pathname.replace("/api", "");
      let data = {};
      if (path === "/auth/me")
        data = { id: 1, nome: patient.nome, email: patient.email, role, pacienteId: 1 };
      else if (path === "/paciente/dashboard")
        data = {
          paciente: patient,
          profissionaisRecomendados: [professional],
          clinicasDisponiveis: [clinic],
          solicitacoesRecentes: [request],
          solicitacoesPendentes: 1,
        };
      else if (path === "/profissionais/especialidades") data = ["Fisioterapia"];
      else if (path === "/profissionais") {
        if (failProfessionals)
          return route.fulfill({ status: 503, json: { message: "Teste de indisponibilidade" } });
        data = paged([professional]);
      } else if (path === "/profissionais/1") data = professional;
      else if (path === "/clinicas") data = paged([clinic]);
      else if (path === "/clinicas/1") data = clinic;
      else if (path === "/solicitacoes/minhas") data = paged([request]);
      else if (path === "/solicitacoes/1") data = request;
      else if (path === "/assistant/conversations") data = [];
      else if (path === "/assistant/messages")
        data = {
          conversationId: 10,
          answer: "Sua solicitação #1 está PENDENTE.",
          mode: "GUIDED",
          links: [{ label: "Ver solicitação #1", href: "/solicitacoes/1" }],
        };
      else if (path === "/assistant/actions") {
        const payload = route.request().postDataJSON();
        preparedType = payload.type;
        preparedDraft = payload.draft;
        data = {
          token: "test-token",
          type: preparedType,
          summary:
            preparedType === "CREATE_REQUEST"
              ? "Solicitar atendimento com Dra. Marina Costa · R$ 180"
              : "Cancelar solicitação #1 · Dra. Marina Costa",
          expiresAt: "2027-01-01T00:00:00Z",
        };
      } else if (path === "/assistant/actions/test-token/confirm") {
        confirmed++;
        request.status = preparedType === "CREATE_REQUEST" ? "PENDENTE" : "CANCELADA";
        data = request;
      }
      return route.fulfill({ status: 200, json: data });
    });
    await openPage("/paciente", "Dashboard do paciente - desktop");
    await page.getByRole("heading", { name: /Olá/ }).waitFor();
    await page.getByRole("heading", { name: "Dra. Marina Costa" }).first().waitFor();
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/patient-desktop.png`,
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    logStep("Assistente - abertura e pedidos");
    await page.getByRole("button", { name: "Abrir assistente", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await page.getByRole("button", { name: "Meus pedidos", exact: true }).click();
    await page.getByText("Sua solicitação #1 está PENDENTE.", { exact: true }).waitFor();
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/assistant.png`,
    });
    await page.getByRole("link", { name: "Ver solicitação #1" }).click();
    await page.getByRole("heading", { name: "Fisioterapia domiciliar" }).waitFor();
    await page.getByRole("button", { name: "Revisar com o assistente" }).click();
    await page.getByText("Cancelar solicitação #1 · Dra. Marina Costa", { exact: true }).waitFor();
    assert.equal(confirmed, 0);
    logStep("Assistente - confirmação de cancelamento");
    await page.getByRole("button", { name: "Confirmar ação", exact: true }).click();
    await page.getByText("Cancelada", { exact: true }).waitFor();
    assert.equal(confirmed, 1);
    await openPage("/ajuda", "Central de ajuda - desktop");
    await page.getByRole("heading", { name: "Uma ajuda. Um dia mais simples." }).waitFor();
    await page.getByText("Como solicito um atendimento?", { exact: true }).click();
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/help-desktop.png`,
      fullPage: true,
    });
    await openPage("/profissionais", "Lista de profissionais - desktop");
    await page.getByRole("heading", { name: "Profissionais", exact: true }).waitFor();
    await page.getByRole("heading", { name: "Dra. Marina Costa" }).waitFor();
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/professionals-desktop.png`,
      fullPage: true,
    });
    logStep("Profissionais - estado de erro e nova tentativa");
    failProfessionals = true;
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("alert").filter({ hasText: "Não foi possível carregar" }).waitFor();
    assert.equal(
      await page.getByText("Nenhum profissional encontrado", { exact: true }).count(),
      0,
    );
    failProfessionals = false;
    await page.getByRole("button", { name: "Tentar novamente", exact: true }).click();
    await page.getByRole("heading", { name: "Dra. Marina Costa" }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage("/paciente", "Dashboard do paciente - mobile");
    await page.getByRole("heading", { name: /Olá/ }).waitFor();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/patient-mobile.png`,
      fullPage: true,
    });
    logStep("Assistente - formulário no mobile");
    await page.getByRole("button", { name: "Abrir assistente", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/assistant-mobile.png`,
    });
    await page
      .getByRole("textbox", { name: "Escreva sua dúvida…" })
      .fill("quero agendar atendimento");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await page.locator("select[name=professional]").selectOption("1");
    await page.getByLabel("Serviço desejado").fill("Fisioterapia");
    await page.getByLabel("Data e hora desejadas (seu horário local)").fill("2027-05-20T15:00");
    await page.getByLabel("Endereço do atendimento").fill("Endereço sintético de teste");
    await page.getByLabel("Necessidades do atendimento").fill("Acompanhamento de teste");
    await page.getByRole("button", { name: "Continuar para revisão" }).click();
    await page.getByRole("button", { name: "Revisar com o assistente" }).click();
    await page
      .getByText("Solicitar atendimento com Dra. Marina Costa · R$ 180", { exact: true })
      .waitFor();
    assert.equal(confirmed, 1);
    assert.equal(preparedDraft.profissionalId, 1);
    assert.equal(preparedDraft.servicoSolicitado, "Fisioterapia");
    await page.getByRole("button", { name: "Confirmar ação", exact: true }).click();
    await page
      .getByText("Solicitação #1: criada e aguardando confirmação da administração.", {
        exact: true,
      })
      .waitFor();
    assert.equal(confirmed, 2);
    await page.getByRole("button", { name: "Cancelar pedido", exact: true }).click();
    await page.getByRole("button", { name: /#1 · Dra. Marina Costa/ }).click();
    await page.getByRole("button", { name: "Revisar com o assistente" }).click();
    await page.getByRole("button", { name: "Confirmar ação", exact: true }).click();
    await page.getByText("Solicitação #1: cancelamento realizado.", { exact: true }).waitFor();
    assert.equal(confirmed, 3);
    logStep("Alteração para tema escuro");
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: /Alternar tema|Toggle theme/ })
      .first()
      .click();
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/patient-dark.png`,
      fullPage: true,
    });
    role = "ADMIN";
    await openPage("/admin/configuracoes", "Configurações do administrador - mobile");
    await page.getByRole("heading", { name: /Configurações|Settings/ }).waitFor();
    assert.ok(
      await page
        .getByRole("link", { name: /Configurações|Settings/ })
        .last()
        .isVisible(),
    );
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/admin-mobile.png`,
      fullPage: true,
    });
    await openPage("/", "Landing page - mobile");
    await page.getByRole("heading", { name: /Cuidado para você/ }).waitFor();
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/landing-mobile.png`,
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    // A landing desktop roda num contexto limpo: a página anterior passou por
    // navegações autenticadas, alterações de tema e trocas de viewport.
    // Isso evita que estado acumulado interfira no carregamento da imagem.
    await context.close();
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    await desktopContext.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });
    page = await desktopContext.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(20000);
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      if (request.resourceType() === "image") {
        imageNetworkIssues.push(`Requisição falhou: ${request.url()} — ${request.failure()}`);
      }
    });
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && !response.ok()) {
        imageNetworkIssues.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });

    logStep("Landing page - desktop e validação da imagem (contexto isolado)");
    imageNetworkIssues.length = 0;
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.getByRole("heading", { name: /Cuidado para você/ }).waitFor();
    const heroImage = page.locator(".landing-hero-photo img");
    await heroImage.waitFor({ state: "visible" });
    // Imagens lazy só começam a carregar quando entram na área visível.
    await heroImage.scrollIntoViewIfNeeded();
    console.log("[UI] Aguardando imagem principal da landing page (até 20s)...");
    try {
      await page.waitForFunction(
        () => {
          const img = document.querySelector(".landing-hero-photo img");
          return Boolean(img?.complete && img.naturalWidth > 0);
        },
        undefined,
        { timeout: 20000 },
      );
    } catch (error) {
      const details = await heroImage.evaluate((img) => {
        const rect = img.getBoundingClientRect();
        const styles = getComputedStyle(img);
        return {
          src: img.getAttribute("src"),
          srcSet: img.getAttribute("srcset"),
          sizes: img.getAttribute("sizes"),
          currentSrc: img.currentSrc,
          loading: img.loading,
          fetchPriority: img.fetchPriority,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          rect: { width: rect.width, height: rect.height, top: rect.top },
          display: styles.display,
          visibility: styles.visibility,
        };
      });
      console.error("[UI] Imagem principal não carregou:", JSON.stringify(details, null, 2));
      if (imageNetworkIssues.length > 0) {
        console.error("[UI] Falhas nas requisições de imagens:", imageNetworkIssues.join("\n"));
      } else {
        console.error("[UI] Nenhuma falha de requisição de imagem foi registrada pelo navegador.");
      }
      // Diferencia arquivo ausente, otimizador lento e falha de carregamento no navegador.
      // As verificações mantêm o teste reprovado: não mascaram imagens quebradas.
      const candidates = [
        ["Arquivo original", `${new URL(base).origin}/images/cuidado-domiciliar-familia.png`],
      ];
      if (details.src) {
        candidates.push(["URL gerada pelo Next.js", new URL(details.src, base).href]);
      }
      await Promise.all(
        candidates.map(async ([label, url]) => {
          const startedAt = Date.now();
          try {
            const response = await page.request.get(url, {
              timeout: 10000,
              failOnStatusCode: false,
            });
            console.error(
              `[UI] ${label}: HTTP ${response.status()}, ` +
                `${response.headers()["content-type"] || "tipo desconhecido"}, ` +
                `${Date.now() - startedAt}ms — ${url}`,
            );
          } catch (probeError) {
            console.error(
              `[UI] ${label}: erro/timeout após ${Date.now() - startedAt}ms — ` +
                `${probeError.message.split("\n")[0]} — ${url}`,
            );
          }
        }),
      );
      throw new Error("A imagem principal da landing page não carregou em 20s.", { cause: error });
    }
    await page.screenshot({
      timeout: 15000,
      animations: "disabled",
      path: `${out}/landing-desktop.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      `${out}/result.json`,
      JSON.stringify(
        {
          passed: true,
          browser: browser.version(),
          checks: [
            "patient desktop/mobile",
            "assistant query and navigation",
            "explicit action confirmation",
            "help accordion",
            "search error vs empty and retry",
            "mobile admin settings",
            "dark theme",
            "landing",
            "no horizontal overflow",
            "no page errors",
          ],
        },
        null,
        2,
      ),
    );
    console.log("[UI] Regressão visual aprovada; evidências:", out);
  } catch (error) {
    console.error(`[UI] Falha na etapa: ${currentStep}`);
    console.error(error);
    if (page && !page.isClosed()) {
      try {
        await page.screenshot({ path: path.join(out, "failure.png"), timeout: 5000 });
        console.error("[UI] Captura da falha salva em:", path.join(out, "failure.png"));
      } catch (captureError) {
        console.error("[UI] Não foi possível capturar a falha:", captureError.message);
      }
    }
    process.exitCode = 1;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("[UI] Falha ao fechar o Chromium:", closeError.message);
        process.exitCode = 1;
      }
    }
  }
})();
