import Link from "next/link";
import type { Article } from "@/data/articles";

export function ArticleCard({ a }: { a: Article }) {
  return (
    <Link
      href={`/reviews/${a.slug}`}
      className="group flex flex-col rounded-2xl border border-ink/8 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card-hover"
    >
      <h3 className="font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent">
        {a.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-ink/65">{a.description}</p>
      <span className="mt-auto block pt-3 text-right text-sm font-bold text-accent transition-all group-hover:underline">
        比較記事を読む →
      </span>
    </Link>
  );
}
