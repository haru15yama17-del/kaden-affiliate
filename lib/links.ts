import type { Product } from "@/data/types";

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
