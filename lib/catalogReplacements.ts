import replacements from "@/data/catalog-replacements.json";
import seed from "@/data/products.seed.json";
import type { Product } from "@/data/types";

// 別製品への差し替えは独立した商品レコードで行う。旧商品の本文・評価を混ぜない。
// DBに旧商品が残っていても、ローカルと同じ確認済み商品を公開する。
export function applyCatalogReplacements(products: Product[]): Product[] {
  const retired = new Set(Object.keys(replacements));
  const current = new Set(Object.values(replacements));
  return [
    ...products.filter(p => !retired.has(p.slug) && !current.has(p.slug)),
    ...(seed as Product[]).filter(p => current.has(p.slug)),
  ];
}
