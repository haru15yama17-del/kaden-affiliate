import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { site } from "@/data/site";
import { getAllProducts } from "@/lib/data";
import { categories } from "@/data/categories";
import { compareSlug, effectiveCompetitors } from "@/lib/links";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const products = await getAllProducts();
  const staticPaths = ["", "/guides", "/about", "/privacy", "/disclaimer", "/contact"];

  const compareSet = new Set<string>();
  for (const p of products) for (const c of effectiveCompetitors(p, products)) compareSet.add(compareSlug([p.slug, c.slug]));

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}` })),
    ...articles.map(a => ({ url: `${base}/reviews/${a.slug}` })),
    ...categories.flatMap((c) => [
      { url: `${base}/category/${c.slug}` },
      { url: `${base}/ranking/${c.slug}` }
    ]),
    ...products.map((p) => ({ url: `${base}/reviews/${p.slug}`, lastModified: new Date(p.updatedAt) })),
    ...[...compareSet].map((slug) => ({ url: `${base}/compare/${slug}` }))
  ];
}
