const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const DIST = path.join(__dirname, '..', 'dist');
const OUT_ROOT = path.join(__dirname, '..', 'appstore_screenshots');

const browserCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const browserExe = process.env.BROWSER_EXE || browserCandidates.find((p) => fs.existsSync(p));
if (!browserExe) { console.error('No Chrome/Edge found.'); process.exit(1); }

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.json': 'application/json',
  '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.ttf': 'font/ttf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.map': 'application/json', '.webmanifest': 'application/manifest+json',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let serve = path.join(DIST, urlPath);
      if (!fs.existsSync(serve) || fs.statSync(serve).isDirectory()) {
        const idx = path.join(serve, 'index.html');
        serve = fs.existsSync(idx) ? idx : path.join(DIST, 'index.html');
      }
      fs.readFile(serve, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(serve).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const DEVICES = [
  { name: 'iPhone-6.7-1290x2796', w: 430, h: 932, dsf: 3, mobile: true },
  { name: 'iPhone-6.5-1242x2688', w: 414, h: 896, dsf: 3, mobile: true },
  { name: 'iPad-12.9-2048x2732', w: 1024, h: 1366, dsf: 2, mobile: false },
];

const SCREENS = [
  { i: 0, file: '01-dashboard' },
  { i: 1, file: '02-cards' },
  { i: 2, file: '03-airlines' },
  { i: 3, file: '04-hotels' },
  { i: 5, file: '05-best-card' },
  { i: 7, file: '06-chase-524' },
];

(async () => {
  if (!fs.existsSync(DIST)) { console.error('dist/ not found - run: npm run build'); process.exit(1); }
  const onlyDevice = process.env.ONLY_DEVICE;
  const devices = onlyDevice ? DEVICES.filter((d) => d.name === onlyDevice) : DEVICES;
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch({ executablePath: browserExe, headless: true, args: ['--no-proxy-server'] });
  try {
    for (const d of devices) {
      const outDir = path.join(OUT_ROOT, d.name);
      fs.mkdirSync(outDir, { recursive: true });
      const context = await browser.newContext({
        viewport: { width: d.w, height: d.h },
        deviceScaleFactor: d.dsf,
        isMobile: d.mobile,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
      await page.waitForTimeout(2500);
      for (const s of SCREENS) {
        console.log(`Capturing ${d.name}  ${s.file}`);
        try {
          await page.locator('aside button').nth(s.i).click({ timeout: 8000 });
        } catch (e) {
          console.log(`  (could not click tab ${s.i}: ${e.message.split('\n')[0]})`);
        }
        await page.waitForTimeout(1200);
        await page.evaluate(() => {
          const header = document.querySelector('header');
          const main = document.querySelector('main');
          if (main) {
            const headerH = header ? header.offsetHeight : 0;
            const y = main.getBoundingClientRect().top + window.scrollY - headerH - 8;
            window.scrollTo(0, Math.max(0, y));
          }
        });
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outDir, `${s.file}.png`) });
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log('\nDone. Screenshots written to appstore_screenshots/');
})();
