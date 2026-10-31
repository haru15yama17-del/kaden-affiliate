// 楽天レビューページから上位30〜50件を取得（Playwright）
//  - 各ページ取得前に robots.txt を確認
//  - リクエスト間隔は MIN_DELAY_MS（3秒）以上
//  - reviewPageUrl に {page} を含めるとページ送りする（無ければ1ページのみ）
// ※ DOMセレクタは楽天側の画面変更で変わりうる。SELECTORS を実ページで要確認。
import { checkRobots } from "./robots.mjs";
import { MIN_DELAY_MS, BOT_UA, sleep } from "./common.mjs";

export const MIN_REVIEWS = 30;
export const MAX_REVIEWS = 50;
const MAX_PAGES = 10;
const SELECTORS = ['[class*="review-body"]', '[class*="reviewBody"]', '[class*="review-text"]'];

export async function fetchReviews(reviewPageUrl) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("playwright が見つかりません（npm install / npx playwright install chromium）");
  }
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ userAgent: BOT_UA })).newPage();
  const seen = new Set();
  const reviews = [];
  try {
    for (let n = 1; n <= MAX_PAGES && reviews.length < MAX_REVIEWS; n++) {
      const url = reviewPageUrl.replace("{page}", String(n));
      const robots = await checkRobots(url);
      if (!robots.allowed) throw new Error(robots.reason);
      if (n > 1) await sleep(MIN_DELAY_MS + Math.floor(Math.random() * 1000));
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      let texts = [];
      for (const sel of SELECTORS) {
        texts = await page.$$eval(sel, (els) => els.map((e) => (e.textContent ?? "").trim()));
        if (texts.length) break;
      }
      const fresh = texts.filter((t) => t.length >= 10 && !seen.has(t));
      fresh.forEach((t) => seen.add(t));
      reviews.push(...fresh);
      if (!fresh.length || !reviewPageUrl.includes("{page}")) break;
    }
  } finally {
    await browser.close();
  }
  return reviews.slice(0, MAX_REVIEWS);
}
