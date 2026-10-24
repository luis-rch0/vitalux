/** Diagnóstico isolado da imagem da landing page do CarePoint.
 * Execute com o frontend já servido em http://127.0.0.1:3100.
 * Não altera o aplicativo nem os testes existentes.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3100';
const selector = '.landing-hero-photo img';
const outDir = process.env.TEST_OUTPUT || 'test-results/ui';
const isRelevant = (url) => url.includes('/_next/image') || url.includes('cuidado-domiciliar-familia');
const relevantRequests = new Set();
const states = [];
let browser;

try {
  fs.mkdirSync(outDir, { recursive: true });
  browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  page.on('request', (request) => {
    if (!isRelevant(request.url())) return;
    relevantRequests.add(request.url());
    states.push({ state: 'request', url: request.url() });
    console.log('[IMAGEM] Requisição iniciada:', request.url());
  });
  page.on('response', (response) => {
    if (!isRelevant(response.url())) return;
    states.push({ state: 'response', status: response.status(), url: response.url() });
    console.log('[IMAGEM] Resposta HTTP:', response.status(), response.url());
  });
  page.on('requestfinished', (request) => {
    if (isRelevant(request.url())) {
      states.push({ state: 'finished', url: request.url() });
      console.log('[IMAGEM] Download concluído:', request.url());
    }
  });
  page.on('requestfailed', (request) => {
    if (isRelevant(request.url())) {
      states.push({ state: 'failed', error: request.failure(), url: request.url() });
      console.error('[IMAGEM] Falha de rede:', request.failure(), request.url());
    }
  });
  page.on('pageerror', (error) => console.error('[PÁGINA] Erro JavaScript:', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error('[CONSOLE]', message.text());
  });

  console.log('[IMAGEM] Abrindo:', new URL('/', base).href);
  await page.goto(new URL('/', base).href, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const photo = page.locator(selector).first();
  await photo.waitFor({ state: 'attached', timeout: 15000 });
  console.log('[IMAGEM] Elementos que correspondem ao seletor:', await page.locator(selector).count());
  await photo.scrollIntoViewIfNeeded({ timeout: 15000 });

  const inspect = () => page.locator(selector).first().evaluate((img) => {
    const rect = img.getBoundingClientRect();
    const style = getComputedStyle(img);
    return {
      src: img.getAttribute('src'),
      srcset: img.getAttribute('srcset'),
      sizes: img.getAttribute('sizes'),
      currentSrc: img.currentSrc,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      loading: img.loading,
      fetchPriority: img.fetchPriority,
      isConnected: img.isConnected,
      bounds: { width: rect.width, height: rect.height, top: rect.top },
      display: style.display,
      visibility: style.visibility,
      outerHTML: img.outerHTML.slice(0, 1500),
    };
  });

  console.log('[IMAGEM] Estado inicial:', JSON.stringify(await inspect(), null, 2));
  let passed = false;
  try {
    await page.waitForFunction(() => {
      const img = document.querySelector('.landing-hero-photo img');
      return Boolean(img?.complete && img.naturalWidth > 0);
    }, undefined, { timeout: 25000 });
    passed = true;
  } catch (error) {
    console.error('[IMAGEM] Tempo esgotado:', error.message.split('\n')[0]);
  }
  console.log('[IMAGEM] Estado final:', JSON.stringify(await inspect(), null, 2));
  console.log('[IMAGEM] Histórico de rede:', JSON.stringify(states, null, 2));
  console.log('[IMAGEM] Total de URLs de imagens solicitadas:', relevantRequests.size);

  const file = path.join(outDir, 'landing-isolada.png');
  try {
    await page.screenshot({ path: file, fullPage: true, timeout: 12000 });
    console.log('[IMAGEM] Captura:', file);
  } catch (error) {
    console.error('[IMAGEM] Erro ao salvar captura:', error.message.split('\n')[0]);
  }

  console.log(passed ? '[IMAGEM] PASSOU no teste isolado.' : '[IMAGEM] FALHOU no teste isolado.');
  if (!passed) process.exitCode = 1;
} catch (error) {
  console.error('[IMAGEM] Falha inesperada:', error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch((error) => console.error('[IMAGEM] Falha no fechamento:', error));
}
