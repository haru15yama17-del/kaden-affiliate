// 共通ユーティリティ：.env.local 読み込み・日付・待機
import fs from "node:fs";
import path from "node:path";

export const ROOT = process.cwd();
// 取得リクエストの最小間隔（仕様：3秒以上。下げられないよう定数で固定）
export const MIN_DELAY_MS = 3000;
export const BOT_UA = "kaden-affiliate-research-bot/0.1";

export function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function todayJst() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

export function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : fallback;
}
