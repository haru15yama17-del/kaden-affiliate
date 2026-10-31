// 記事JSON・data/articles.ts・台帳(generated-registry.json)への書き込み
//  - data/articles.ts は手書きの既存配列。既存エントリは一切変更せず、末尾に追記するだけ。
import fs from "node:fs";
import path from "node:path";
import { ROOT, readJson } from "./common.mjs";

const articlesFile = path.join(ROOT, "data", "articles.ts");
const registryFile = path.join(ROOT, "content", "generated-registry.json");

export function registryHas(slug, intent = "review") {
  return readJson(registryFile, []).some((r) => r.target === slug && r.intent === intent);
}

// 既存の手書き本文(intro等)は保持し、reviewStats だけ更新する
// article: { intro, sections, faq, summary } / reviewStats: 収集有効時のみ
export function writeReviewJson(slug, { article, reviewStats }) {
  const file = path.join(ROOT, "content", "reviews", `${slug}.json`);
  const prev = readJson(file, {});
  const body = { ...prev, ...article };
  if (reviewStats) {
    body.reviewStats = reviewStats;
    body.sources = [reviewStats.sourceUrl];
  } else {
    delete body.reviewStats; // 収集無効時は古い集計を残さない
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(body, null, 2) + "\n", "utf-8");
  return file;
}

// data/articles.ts の `export const articles: Article[] = [ ... ];` の末尾に1件追記する。
// 既に同じ slug がある場合は何もしない（既存記事を壊さない）。
export function appendArticleIndex({ slug, title, category, description }) {
  const src = fs.readFileSync(articlesFile, "utf-8");
  if (src.includes(`slug: ${JSON.stringify(slug)}`)) return false;

  const end = src.lastIndexOf("];");
  if (end < 0) throw new Error("data/articles.ts の配列終端 `];` が見つかりません");
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  const entry = [
    "  {",
    `    slug: ${JSON.stringify(slug)},`,
    `    title: ${JSON.stringify(title)},`,
    `    category: ${JSON.stringify(category)},`,
    `    description: ${JSON.stringify(description)},`,
    "  },"
  ].join(nl);
  const next = src.slice(0, end) + entry + nl + src.slice(end);

  // 追記後に既存の slug が1つも欠けていないことを確認してから書く
  const slugs = (s) => [...s.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  const before = slugs(src);
  const after = slugs(next);
  if (!before.every((s) => after.includes(s)) || after.length !== before.length + 1) {
    throw new Error("articles.ts の追記検証に失敗しました（書き込みを中止）");
  }
  fs.writeFileSync(articlesFile, next, "utf-8");
  return true;
}

export function appendRegistry(slug, productName) {
  const reg = readJson(registryFile, []);
  reg.push({ target: slug, intent: "review", url: `/reviews/${slug}`, primaryKeyword: `${productName} review`, generatedAt: new Date().toISOString() });
  fs.mkdirSync(path.dirname(registryFile), { recursive: true });
  fs.writeFileSync(registryFile, JSON.stringify(reg, null, 2) + "\n", "utf-8");
}
