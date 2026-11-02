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

// 用途を編集確認したグループのみ。カテゴリ内の評価順位から比較相手を作らない。
const groups = [
  ['sharp-kn-mn16h-hotkook','sharp-kn-hw24h-hotkook','sharp-kn-hw16h-hotkook','sharp-kn-hw10g-hotkook','iris-kpc-ma4-pressurecooker'],
  ['panasonic-np-tml1-solota-dishwasher','sanko-rakua-mini-color-dishwasher'],
  ['balmuda-egf1800-fan','balmuda-egf3400-cirq','iris-woozoo-stf-dc15tec'],
  ['aircon-set-6jo-omakase','iris-g-aircon-set'],
  ['daikin-s285ates-aircon','mitsubishi-msz-zw5625s-aircon','panasonic-cs-635dex2-aircon'],
  ['premium-water','cosmo-water','frecious','aquaclara'],
  ['oisix','yoshikei','coopdeli','palsystem','seikatsu-club'],
  ['iris-flk842-washer','nitori-nd60ul1-washer','panasonic-na-sd10hbl-washer','sharp-es11k1-washer','toshiba-tw127xm4l-washer'],
  ['iris-fk-d2-futondryer','cado-foehn-pro-futondryer'],
  ['ecovacs-deebot-n20-proplus-cleaner','irobot-roomba-205-cleaner'],
];
export function isComparable(a: Product, b: Product): boolean {
  return a.slug !== b.slug && groups.some(g => g.includes(a.slug) && g.includes(b.slug)) && passesMonetizationGate(a,b);
}
export function parseComparison(slug: string, all: Product[]): Product[] {
  const slugs = slug.split('-vs-');
  if(slugs.length !== 2 || slug !== compareSlug(slugs)) return [];
  const a = all.find(p=>p.slug===slugs[0]), b = all.find(p=>p.slug===slugs[1]);
  return a && b && effectiveCompetitors(a,all).some(p=>p.slug===b.slug) ? [a,b] : [];
}
export function effectiveCompetitors(p: Product, all: Product[], limit = 2): Product[] {
  return all.filter(c => isComparable(p,c) &&
    (p.competitors.includes(c.slug) || c.competitors.includes(p.slug) ||
     (p.slug.includes('dishwasher') && c.slug.includes('dishwasher'))));
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
