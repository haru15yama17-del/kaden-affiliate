import Link from "next/link";
import type { Product } from "@/data/types";
import { Rating } from "./Rating";

export function RelatedArticles({ items }: { items: Product[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 border-t border-ink/10 pt-8">
      <h2 className="mb-4 font-serif text-xl font-bold">関連レビュー</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/reviews/${p.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3 shadow-card transition-all hover:border-accent hover:shadow-card-hover"
            >
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                  {p.name}
                </p>
                <div className="mt-1">
                  <Rating value={p.rating} size="sm" />
                </div>
              </div>
              <span className="shrink-0 text-sm font-bold text-accent">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
