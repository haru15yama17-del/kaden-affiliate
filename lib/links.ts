import type { CategorySlug, Product } from "@/data/types";
import { buildStoreButtons } from "@/lib/affiliate";

// 実際に購入/公式サイトCTAボタンが表示される商品か（＝内部リンクで送客する価値があるか）
export function isMonetized(p: Product): boolean {
  const aff = p.affiliate;
  const isServiceType = aff.ctaLabel !== undefined || aff.officialUrl !== undefined;
  if (isServiceType) return Boolean(aff.officialUrl) && (aff.isAffiliateLink ?? true);
  return buildStoreButtons(aff).length > 0;
}

// food-delivery: A8提携否認の食材宅配3社（パルシステム・コープデリ・オイシックス等）を
// 比較導線に載せないよう、両側とも収益化済みの商品同士のみ許可する
function passesMonetizationGate(p: Product, comp: Product): boolean {
  if (p.category !== "food-delivery") return true;
  return isMonetized(p) && isMonetized(comp);
}

export function relatedReviews(p: Product, all: Product[], limit = 4): Product[] {
  return all
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

export function competitorProducts(p: Product, all: Product[]): Product[] {
  return p.competitors
    .map((slug) => all.find((x) => x.slug === slug))
    .filter((x): x is Product => Boolean(x));
}

export function compareSlug(slugs: string[]): string {
  return [...slugs].sort().join("-vs-");
}

// competitors未設定の商品は、同カテゴリ・評価上位で代替する
export function effectiveCompetitors(p: Product, all: Product[], limit = 2): Product[] {
  const explicit = competitorProducts(p, all).filter((c) => passesMonetizationGate(p, c));
  if (explicit.length > 0) return explicit;
  return relatedReviews(p, all, limit).filter((c) => passesMonetizationGate(p, c));
}

export function categoryComparePairs(
  cat: CategorySlug,
  all: Product[]
): { slug: string; a: Product; b: Product }[] {
  const inCat = all.filter((p) => p.category === cat);
  const seen = new Set<string>();
  const pairs: { slug: string; a: Product; b: Product }[] = [];
  for (const p of inCat) {
    for (const comp of effectiveCompetitors(p, all)) {
      const slug = compareSlug([p.slug, comp.slug]);
      if (seen.has(slug)) continue;
      seen.add(slug);
      pairs.push({ slug, a: p, b: comp });
    }
  }
  return pairs;
}
