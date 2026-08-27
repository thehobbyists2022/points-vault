import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://localhost:5173'; // local dev server is running on 5173
const OUT_DIR = path.resolve('public/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser for Google Play phone screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set exact modern Android flagship viewport (1080 x 2400 output)
  await page.setViewport({
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true
  });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  // Set English language in app state if needed
  await page.evaluate(() => {
    try {
      const raw = localStorage.getItem('points-vault-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.state.profile.language = 'en';
        localStorage.setItem('points-vault-storage', JSON.stringify(parsed));
      }
    } catch (e) {}
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // 1. Dashboard screenshot
  console.log('Capturing Screenshot 1: Dashboard & Valuation...');
  await page.screenshot({ path: path.join(OUT_DIR, 'screenshot-1-dashboard.png') });

  // 2. Switch to 5/24 Rules Tab
  console.log('Capturing Screenshot 2: Chase 5/24 Rule Radar...');
  await page.evaluate(() => {
    const raw = localStorage.getItem('points-vault-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.state.activeTab = 'rules524';
      localStorage.setItem('points-vault-storage', JSON.stringify(parsed));
    }
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'screenshot-2-524radar.png') });

  // 3. Switch to Cards Tab
  console.log('Capturing Screenshot 3: Cards & MSR Spending...');
  await page.evaluate(() => {
    const raw = localStorage.getItem('points-vault-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.state.activeTab = 'cards';
      localStorage.setItem('points-vault-storage', JSON.stringify(parsed));
    }
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'screenshot-3-cards.png') });

  // 4. Switch to Transfer Partners Tab
  console.log('Capturing Screenshot 4: Transfer Partners Matrix...');
  await page.evaluate(() => {
    const raw = localStorage.getItem('points-vault-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.state.activeTab = 'transfer';
      localStorage.setItem('points-vault-storage', JSON.stringify(parsed));
    }
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'screenshot-4-transfer.png') });

  await browser.close();
  console.log('All 4 Google Play screenshots captured successfully in public/screenshots/ !');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
