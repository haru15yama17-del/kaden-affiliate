// ============================================================
// 記事生成ランナー（カニバリ防止つき）
//   node scripts/generate-article.mjs <product-slug> <intent> [sourcesCSV]
// データ源: Supabase(env設定時) → 無ければ data/products.seed.json
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { systemPrompt, userPrompt } from "./article-template.mjs";

const [, , slug, intentArg = "review", sourcesCsv = ""] = process.argv;
if (!slug) { console.error("slug を指定してください"); process.exit(1); }

const canonical = { review: "review", kuchikomi: "review", compare: "compare", osusume: "osusume", ranking: "ranking" };
const intent = canonical[intentArg] ?? "review";
const sources = sourcesCsv ? sourcesCsv.split(",").map((s) => s.trim()).filter(Boolean) : [];

const root = process.cwd();
const registryFile = path.join(root, "content", "generated-registry.json");
const outFile = path.join(root, "content", "reviews", `${slug}.json`);

const registry = fs.existsSync(registryFile) ? JSON.parse(fs.readFileSync(registryFile, "utf-8")) : [];
if (registry.some((r) => r.target === slug && r.intent === intent)) {
  console.error(`既に同じ検索意図(${intent})の記事が存在します: ${slug} → 生成を中止`);
  process.exit(2);
}

async function loadProduct() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const { data } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();
    if (data) {
      return {
        name: data.name, brand: data.brand, category: data.category, priceRange: data.price_range,
        specs: data.specs, pros: data.pros, cons: data.cons, bestFor: data.best_for, notFor: data.not_for
      };
    }
  }
  const seedFile = path.join(root, "data", "products.seed.json");
  if (fs.existsSync(seedFile)) {
    const all = JSON.parse(fs.readFileSync(seedFile, "utf-8"));
    return all.find((p) => p.slug === slug) ?? null;
  }
  return null;
}

let product = await loadProduct();
if (!product) {
  console.warn("該当slugの商品が見つかりません。雛形のみ出力します。");
  product = { name: slug, brand: "", category: "", priceRange: "", specs: [], pros: [], cons: [], bestFor: [], notFor: [] };
}

async function callLLM() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.GEN_MODEL ?? "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model, temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: userPrompt(product, intent, sources) }
      ]
    })
  });
  if (!res.ok) { console.error("LLM呼び出し失敗:", res.status); return null; }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { console.error("LLM出力のJSON解析失敗。雛形を出力します。"); return null; }
}

const body = (await callLLM()) ?? { intro: "", reviewDetail: "", summary: "", faq: [], sources };

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(body, null, 2), "utf-8");

registry.push({ target: slug, intent, url: `/reviews/${slug}`, primaryKeyword: `${product.name} ${intent}`, generatedAt: new Date().toISOString() });
fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2), "utf-8");

console.log(`生成完了: ${outFile}`);
console.log(`台帳更新: ${registryFile} (intent=${intent})`);
