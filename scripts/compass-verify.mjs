import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "/tmp/compass-verify";
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE || "http://localhost:5174";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

const routes = [
  ["/", "home"],
  ["/test", "intro"],
  ["/pricing", "pricing"],
  ["/blog", "blog"],
  ["/free-strengths-test", "landing-strengths"],
  ["/free-personality-test", "landing-personality"],
  ["/free-disc-test", "landing-disc"],
  ["/free-enneagram-test", "landing-enneagram"],
];

for (const [path, name] of routes) {
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 15000 });
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("captured", name);
}

// Start test + question card
await page.goto(BASE + "/test", { waitUntil: "networkidle", timeout: 15000 });
await page.click(".btn-start");
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/question.png`, fullPage: false });
console.log("captured question card");

await browser.close();
console.log("done");
