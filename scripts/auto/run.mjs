// ============================================================
// 自動ブログ生成ランナー
//   node scripts/auto/run.mjs [--only <slug>] [--dry-run] [--limit N] [--reviews-file <json>]
//  --dry-run      content/reviews/{slug}.json のみ書く（articles.ts・台帳は更新しない）
//  --reviews-file レビュー原文(文字列配列JSON)を使い、スクレイピングを行わない。--dry-run 必須
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadEnvLocal, readJson, todayJst } from "./lib/common.mjs";
import { checkRobots } from "./lib/robots.mjs";
import { fetchReviews, MIN_REVIEWS } from "./lib/fetch-reviews.mjs";
import { classifyReviews, writeTrends } from "./lib/gemini.mjs";
import { themesFor } from "./lib/themes.mjs";
import { aggregate } from "./lib/aggregate.mjs";
import { validateGenerated } from "./lib/validate.mjs";
import { writeReviewJson, appendArticleIndex, appendRegistry, registryHas } from "./lib/write-article.mjs";

loadEnvLocal();

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const only = opt("--only");
const limit = Number(opt("--limit") ?? Infinity);
const dryRun = args.includes("--dry-run");
const reviewsFile = opt("--reviews-file");
if (reviewsFile && !dryRun) { console.error("--reviews-file は --dry-run と併用してください（検証用データを公開しないため）"); process.exit(1); }

const targets = readJson(path.join(ROOT, "data", "auto-targets.json"), []);
const seed = readJson(path.join(ROOT, "data", "products.seed.json"), []);

async function generateTrends(product, agg, reviews, labels) {
  if (!agg.positive.length && !agg.negative.length) return { goodTrend: "", concernTrend: "" };
  let feedback = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const t = await writeTrends({
      productName: product.name,
      goodLabels: agg.positive.map((x) => x.label),
      concernLabels: agg.negative.map((x) => x.label),
      feedback
    });
    const issues = [...validateGenerated(t.goodTrend, { reviews, labels }), ...validateGenerated(t.concernTrend, { reviews, labels })];
    if (!issues.length) return t;
    feedback = issues.join(" / ");
    console.warn(`  検証NG(試行${attempt + 1}): ${feedback}`);
  }
  throw new Error("傾向文が検証を通過しませんでした。記事を生成しません。");
}

async function processTarget(t) {
  const product = seed.find((p) => p.slug === t.slug);
  if (!product) throw new Error("data/products.seed.json に該当slugがありません（スペックはseedの値のみ使用）");
  if (!dryRun && registryHas(t.slug)) throw new Error("既に review 記事が登録済みです");
  if (!product.affiliate?.rakutenUrl) console.warn("  注意: seed の affiliate.rakutenUrl が未設定です（家電は rakutenUrl のみ設定する運用）");

  let reviews;
  if (reviewsFile) {
    reviews = readJson(path.resolve(reviewsFile), []);
    console.warn("  [検証モード] 提供されたレビューを使用（スクレイピングなし）");
  } else {
    if (!t.reviewPageUrl) throw new Error("reviewPageUrl が未設定です");
    const robots = await checkRobots(t.reviewPageUrl.replace("{page}", "1"));
    if (!robots.allowed) throw new Error(robots.reason);
    reviews = await fetchReviews(t.reviewPageUrl);
  }
  if (reviews.length < MIN_REVIEWS) throw new Error(`レビュー件数が不足: ${reviews.length}件（最低${MIN_REVIEWS}件）`);

  const themes = themesFor(product.category);
  const classified = await classifyReviews(reviews, themes);
  const agg = aggregate(classified, themes, reviews.length);
  const labels = themes.map((x) => x.label);
  const trends = await generateTrends(product, agg, reviews, labels);

  const reviewStats = {
    total: agg.total,
    fetchedAt: todayJst(),
    sourceUrl: (t.reviewPageUrl ?? "").replace("{page}", "1"),
    positive: agg.positive,
    negative: agg.negative,
    goodTrend: trends.goodTrend,
    concernTrend: trends.concernTrend
  };
  const file = writeReviewJson(t.slug, reviewStats);
  if (!dryRun) {
    appendArticleIndex({
      slug: t.slug,
      title: `${product.name}のレビュー・評判`,
      category: product.category,
      description: `${product.name}の特徴と、楽天レビュー${agg.total}件をもとにした良い評価・気になる評価の傾向を編集部がまとめました。`
    });
    appendRegistry(t.slug, product.name);
  }
  console.log(`  生成: ${path.relative(ROOT, file)}（${agg.total}件／良い${agg.positive.length}テーマ・気になる${agg.negative.length}テーマ）`);
}

const queue = targets.filter((t) => (only ? t.slug === only : t.status === "enabled")).slice(0, limit);
if (!queue.length) { console.log("対象がありません（auto-targets.json の status を enabled にするか --only を指定）"); process.exit(0); }

let failed = 0;
for (const t of queue) {
  console.log(`▶ ${t.slug}`);
  try { await processTarget(t); } catch (e) { failed++; console.error(`  ✖ 中止: ${e.message}`); }
}
console.log(`完了: 成功${queue.length - failed} / 失敗${failed}${dryRun ? "（dry-run）" : ""}`);
process.exit(failed ? 3 : 0);
