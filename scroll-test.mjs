import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5174/';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }, // mobile-ish viewport
  userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
});
const page = await context.newPage();

let navCount = 0;
let consoleErrors = [];
let pageErrors = [];
let requests = [];

page.on('framenavigated', (frame) => {
  if (frame === page.mainFrame()) {
    navCount++;
    console.log(`[NAV #${navCount}] ${frame.url()} @ ${new Date().toISOString()}`);
  }
});

page.on('console', (msg) => {
  if (msg.type() === 'error') {
    consoleErrors.push(msg.text());
    console.log(`[CONSOLE ERROR] ${msg.text()}`);
  }
});

page.on('pageerror', (err) => {
  pageErrors.push(String(err));
  console.log(`[PAGE ERROR] ${err}`);
});

page.on('requestfailed', (req) => {
  console.log(`[REQ FAILED] ${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
});

page.on('response', (res) => {
  requests.push({ url: res.url(), status: res.status(), time: Date.now() });
});

console.log(`Navigating to ${url} ...`);
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
console.log('Initial load complete. Starting scroll test...');

const startNavCount = navCount;
const startMem = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : null);
console.log(`Start heap: ${startMem ? (startMem/1024/1024).toFixed(1)+'MB' : 'n/a'}`);

// Scroll down repeatedly in steps, like a user scrolling through the page
for (let i = 0; i < 40; i++) {
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  const scrollY = await page.evaluate(() => window.scrollY);
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  if (i % 5 === 0) {
    const mem = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : null);
    console.log(`[scroll ${i}] y=${scrollY} docHeight=${docHeight} heap=${mem ? (mem/1024/1024).toFixed(1)+'MB' : 'n/a'} navCount=${navCount}`);
  }
  if (navCount > startNavCount) {
    console.log(`!!! RELOAD DETECTED after scroll step ${i} at y=${scrollY} !!!`);
    break;
  }
}

// Also try fast repeated scrolling (jank stress test)
console.log('Now doing fast repeated scroll bursts...');
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(50);
  if (navCount > startNavCount) {
    console.log(`!!! RELOAD DETECTED during fast scroll at burst ${i} !!!`);
    break;
  }
}

await page.waitForTimeout(1000);
const endMem = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : null);
console.log(`End heap: ${endMem ? (endMem/1024/1024).toFixed(1)+'MB' : 'n/a'}`);
console.log(`Total navigations during test: ${navCount - startNavCount} (0 = no reload)`);
console.log(`Total console errors: ${consoleErrors.length}`);
console.log(`Total page errors: ${pageErrors.length}`);

await page.screenshot({ path: 'C:\\Users\\sharm\\AppData\\Local\\Temp\\claude\\c--Users-sharm-OneDrive-Desktop-Astrologyn-frontend\\fde4d3a5-a804-4321-961a-c52b3a9af2a1\\scratchpad\\final-scroll-state.png' });

await browser.close();
