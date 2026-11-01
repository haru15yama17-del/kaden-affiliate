import type { Product } from "@/data/types";

export const PRICE_NOTICE = "要確認（時期により変動）";
const money = /[0-9０-９][0-9０-９,.，．〜～万千百\s+-]*円/;

// DB・ローカルどちらにも適用。個人の体験談本文には適用しない。
export function publishProduct(p: Product): Product {
  return {
    ...p,
    priceRange: PRICE_NOTICE,
    specs: p.specs.map(s => money.test(s.value) ? { ...s, value: /電気代/.test(s.label) ? "使用条件・電力契約により異なります" : PRICE_NOTICE } : s),
    pros: p.pros.filter(s => !money.test(s)),
    cons: p.cons.filter(s => !money.test(s)),
    bestFor: p.bestFor.filter(s => !money.test(s)),
    notFor: p.notFor.filter(s => !money.test(s)),
    reviewSummary: money.test(p.reviewSummary) ? "" : p.reviewSummary,
  };
}
