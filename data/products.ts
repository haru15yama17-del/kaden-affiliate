import seed from "./products.seed.json";
import type { Product } from "./types";

// ローカル/オフライン時のフォールバック兼Supabaseの初期投入データ。
// 本番の正はSupabaseの products テーブル（lib/data.ts が参照）。
export const products = seed as Product[];
export const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));
