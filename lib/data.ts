import { products as localProducts } from "@/data/products";
import { categories, categoryMap } from "@/data/categories";
import { getSupabase } from "./supabase";
import type { Product, CategorySlug } from "@/data/types";

// DB行(snake_case) → Product(camelCase) へのマッピング
function mapRow(r: Record<string, unknown>): Product {
  return {
    slug: r.slug as string,
    name: r.name as string,
    brand: r.brand as string,
    category: r.category as CategorySlug,
    releaseYear: (r.release_year as number) ?? undefined,
    priceRange: (r.price_range as string) ?? "",
    image: (r.image as string) ?? "",
    specs: (r.specs as Product["specs"]) ?? [],
    pros: (r.pros as string[]) ?? [],
    cons: (r.cons as string[]) ?? [],
    bestFor: (r.best_for as string[]) ?? [],
    notFor: (r.not_for as string[]) ?? [],
    reviewSummary: (r.review_summary as string) ?? "",
    rating: Number(r.rating ?? 0),
    affiliate: (r.affiliate as Product["affiliate"]) ?? {},
    competitors: (r.competitors as string[]) ?? [],
    updatedAt: (r.updated_at as string) ?? ""
  };
}

// ビルド中(SSG)はプロセス内で1回だけ取得すれば十分なのでキャッシュ
let cache: Product[] | null = null;

export async function getAllProducts(): Promise<Product[]> {
  if (cache) return cache;
  const sb = getSupabase();
  if (!sb) {
    cache = localProducts;
    return cache;
  }
  const { data, error } = await sb.from("products").select("*");
  if (error || !data) {
    console.warn("Supabase取得に失敗。ローカルseedで継続:", error?.message);
    cache = localProducts;
    return cache;
  }
  cache = data.map(mapRow);
  return cache;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(cat: CategorySlug): Promise<Product[]> {
  return (await getAllProducts())
    .filter((p) => p.category === cat)
    .sort((a, b) => b.rating - a.rating);
}

export async function getRanking(cat: CategorySlug, limit = 10): Promise<Product[]> {
  return (await getProductsByCategory(cat))
    .sort((a, b) => b.rating - a.rating || (b.releaseYear ?? 0) - (a.releaseYear ?? 0))
    .slice(0, limit);
}

export { categories, categoryMap };
