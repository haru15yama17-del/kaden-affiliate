import { publishProduct } from "@/lib/publication";
import { applyCatalogReplacements } from "@/lib/catalogReplacements";
import seed from "./products.seed.json";
import type { Product } from "./types";

// ローカル/オフライン時のフォールバック兼Supabaseの初期投入データ。
// 本番の正はSupabaseの products テーブル（lib/data.ts が参照）。
export const products = applyCatalogReplacements(seed as Product[]).map(publishProduct);
export const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));
