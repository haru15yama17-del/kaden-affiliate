"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/types";

export function SearchClient({ products }: { products: Pick<Product, "slug" | "name" | "brand" | "category">[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(k) ||
        p.brand.toLowerCase().includes(k) ||
        p.category.includes(k)
    );
  }, [q, products]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="商品名・ブランド・カテゴリで検索"
        className="mt-4 w-full rounded-md border border-ink/20 px-4 py-3 outline-none focus:border-accent"
      />
      <ul className="mt-6 space-y-2">
        {results.map((p) => (
          <li key={p.slug}>
            <Link href={`/reviews/${p.slug}`} className="text-accent hover:underline">{p.name}</Link>
          </li>
        ))}
        {q && results.length === 0 && <li className="text-ink/60">該当する商品が見つかりませんでした。</li>}
      </ul>
    </div>
  );
}
