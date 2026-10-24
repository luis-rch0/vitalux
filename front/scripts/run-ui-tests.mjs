import { spawn, execFile } from "node:child_process";

const port = process.env.TEST_PORT || "3100";
const baseUrl = `http://127.0.0.1:${port}`;
const startupTimeoutMs = Number(process.env.UI_STARTUP_TIMEOUT_MS || 60000);
const testTimeoutMs = Number(process.env.UI_TEST_TIMEOUT_MS || 210000);

function assertTimeout(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} deve ser um número positivo de milissegundos.`);
  }
}

function withTimeout(promise, durationMs, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), durationMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function terminateTree(child) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;

  if (process.platform === "win32") {
    execFile("taskkill", ["/PID", String(child.pid), "/T", "/F"], (error) => {
      if (error && child.exitCode === null) child.kill();
    });
    return;
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }

  setTimeout(() => {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      // O grupo já foi encerrado.
    }
  }, 2000).unref();
}

async function main() {
  assertTimeout(startupTimeoutMs, "UI_STARTUP_TIMEOUT_MS");
  assertTimeout(testTimeoutMs, "UI_TEST_TIMEOUT_MS");

  console.log(`[UI] Iniciando Next.js em ${baseUrl}`);
  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port],
    {
      stdio: ["ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
    },
  );

  let test;
  let signalExitCode = null;
  let exitCode = 1;
  const onSignal = (signal) => {
    console.error(`[UI] Interrompido por ${signal}`);
    signalExitCode = signal === "SIGINT" ? 130 : 143;
    terminateTree(test);
    terminateTree(server);
  };
  process.on("SIGINT", onSignal);
  process.on("SIGTERM", onSignal);

  const serverExit = new Promise((resolve) => {
    server.once("error", (error) => resolve({ error }));
    server.once("exit", (code, signal) => resolve({ code, signal }));
  });

  let markReady;
  const serverReady = new Promise((resolve) => {
    markReady = resolve;
  });
  let outputBuffer = "";
  server.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    outputBuffer = (outputBuffer + chunk.toString()).slice(-4096);
    if (/\bReady\b/i.test(outputBuffer)) markReady();
  });
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await withTimeout(
      Promise.race([
        serverReady,
        serverExit.then((result) => {
          throw new Error(
            `Next.js encerrou antes de iniciar: ${result.error?.message || result.signal || result.code}`,
          );
        }),
      ]),
      startupTimeoutMs,
      `Next.js não ficou pronto em ${startupTimeoutMs / 1000}s.`,
    );

    console.log(`[UI] Servidor pronto: ${baseUrl}`);
    console.log(`[UI] Executando regressão visual (limite: ${testTimeoutMs / 1000}s)`);

    test = spawn(process.execPath, ["scripts/ui-regression.mjs"], {
      stdio: "inherit",
      detached: process.platform !== "win32",
      env: { ...process.env, TEST_BASE_URL: baseUrl },
    });
    const testExit = new Promise((resolve) => {
      test.once("error", (error) => resolve({ error }));
      test.once("exit", (code, signal) => resolve({ code, signal }));
    });

    const result = await withTimeout(
      Promise.race([
        testExit,
        serverExit.then((result) => {
          throw new Error(
            `Next.js encerrou durante os testes: ${result.error?.message || result.signal || result.code}`,
          );
        }),
      ]),
      testTimeoutMs,
      `Os testes visuais excederam ${testTimeoutMs / 1000}s.`,
    );
    if (result.error) throw result.error;
    exitCode = result.code === 0 ? 0 : 1;
    console.log(exitCode === 0 ? "[UI] Testes concluídos com sucesso." : `[UI] Testes falharam: ${result.signal || result.code}`);
  } catch (error) {
    console.error(`[UI] ${error.message}`);
    exitCode = 1;
  } finally {
    console.log("[UI] Encerrando os processos de teste e servidor...");
    terminateTree(test);
    terminateTree(server);
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    process.exitCode = signalExitCode ?? exitCode;
  }
}

main().catch((error) => {
  console.error("[UI] Erro inesperado:", error);
  process.exitCode = 1;
});
