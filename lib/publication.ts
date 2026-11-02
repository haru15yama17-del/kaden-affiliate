import { productPhoto } from "@/lib/productPhotos";
import correctedSlugs from "@/data/editorial-correction-products.json";
import corrections from "@/data/editorial-corrections.json";
import type { Product } from "@/data/types";

export const PRICE_NOTICE = "要確認（時期により変動）";
const money = /[0-9０-９][0-9０-９,.，．〜～万千百\s+-]*円/;

// DB・ローカルどちらにも適用。個人の体験談本文には適用しない。
export function publishProduct(p: Product): Product {
  const correct = (text: string) => (corrections as Record<string, string>)[text] ?? text;
  // 完全一致の編集修正のみを適用し、URL・型番・体験談本文は書き換えない。
  p = {
    ...p,
    specs: p.specs.map(s => ({ ...s, value: correct(s.value) })),
    pros: p.pros.map(correct),
    cons: p.cons.map(correct),
    bestFor: p.bestFor.map(correct),
    notFor: p.notFor.map(correct),
    reviewSummary: correct(p.reviewSummary),
    affiliate: {
      ...p.affiliate,
      ...(p.affiliate.ctaLabel === "無料お試しを見る" ? { ctaLabel: "お試しの条件を見る" } : {}),
    },
  };
  return {
    ...p,
    updatedAt: correctedSlugs.includes(p.slug) && p.updatedAt.slice(0,10) < "2026-11-01" ? "2026-11-01" : p.updatedAt,
    priceRange: PRICE_NOTICE,
    image: productPhoto(p.slug)?.src ?? p.image,
    specs: p.specs.map(s => money.test(s.value) ? { ...s, value: /電気代/.test(s.label) ? "使用条件・電力契約により異なります" : PRICE_NOTICE } : s),
    pros: p.pros.filter(s => !money.test(s)),
    cons: p.cons.filter(s => !money.test(s)),
    bestFor: p.bestFor.filter(s => !money.test(s)),
    notFor: p.notFor.filter(s => !money.test(s)),
    reviewSummary: money.test(p.reviewSummary) ? "" : p.reviewSummary,
  };
}
