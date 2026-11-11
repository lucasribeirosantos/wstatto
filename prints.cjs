// Gera os prints da prévia com Playwright.
// Uso: npx http-server -p 5510 (ou python -m http.server 5510) e depois: node prints.cjs
// Requer: npm i playwright  (usa o Google Chrome instalado na máquina)
const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.PREVIEW_URL || 'http://127.0.0.1:5510/';
const out = (f) => path.join(__dirname, 'prints', f);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });

  // 1) primeira dobra no celular, com a animação de entrada completa
  const phone = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const p = await phone.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(5200);
  await p.screenshot({ path: out('celular-primeira-dobra.png') });

  // 2) página inteira no desktop (estado final das animações)
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const d = await desk.newPage();
  await d.goto(URL, { waitUntil: 'networkidle' });
  const h = await d.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) { await d.evaluate((v) => scrollTo(0, v), y); await d.waitForTimeout(120); }
  await d.evaluate(() => document.querySelector('#local').scrollIntoView());
  await d.waitForTimeout(6000); // mapa do Google
  await d.evaluate(() => scrollTo(0, 0));
  // janela do tamanho da página (com hero travado em 900px) para o iframe do mapa sair no print
  await d.addStyleTag({ content: '.hero{min-height:900px!important;height:900px}' });
  const full = await d.evaluate(() => document.documentElement.scrollHeight);
  await d.setViewportSize({ width: 1440, height: full });
  await d.waitForTimeout(5000);
  await d.screenshot({ path: out('desktop-pagina-inteira.png') });

  await browser.close();
  console.log('prints salvos em', path.join(__dirname, 'prints'));
})();
