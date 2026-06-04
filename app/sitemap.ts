import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllProducts } from "@/lib/data";
import { categories } from "@/data/categories";
import { compareSlug } from "@/lib/links";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const products = await getAllProducts();
  const staticPaths = ["", "/search", "/about", "/privacy", "/disclaimer", "/contact"];

  const compareSet = new Set<string>();
  for (const p of products) for (const c of p.competitors) compareSet.add(compareSlug([p.slug, c]));

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })),
    ...categories.flatMap((c) => [
      { url: `${base}/category/${c.slug}`, lastModified: new Date() },
      { url: `${base}/ranking/${c.slug}`, lastModified: new Date() }
    ]),
    ...products.map((p) => ({ url: `${base}/reviews/${p.slug}`, lastModified: new Date(p.updatedAt) })),
    ...[...compareSet].map((slug) => ({ url: `${base}/compare/${slug}`, lastModified: new Date() }))
  ];
}
