// ============================================================
// 初期投入：data/products.seed.json → Supabase products テーブル
// 使い方: node scripts/seed-supabase.mjs
// 必要env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const seed = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "products.seed.json"), "utf-8")
);

const rows = seed.map((p) => ({
  slug: p.slug, name: p.name, brand: p.brand, category: p.category,
  release_year: p.releaseYear ?? null, price_range: p.priceRange ?? "",
  image: p.image ?? "", specs: p.specs ?? [], pros: p.pros ?? [], cons: p.cons ?? [],
  best_for: p.bestFor ?? [], not_for: p.notFor ?? [], review_summary: p.reviewSummary ?? "",
  rating: p.rating ?? 0, affiliate: p.affiliate ?? {}, competitors: p.competitors ?? [],
  updated_at: p.updatedAt ?? null
}));

const { error } = await sb.from("products").upsert(rows, { onConflict: "slug" });
if (error) { console.error("投入失敗:", error.message); process.exit(1); }
console.log(`投入完了: ${rows.length}件`);
