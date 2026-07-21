import Link from "next/link";
import { tier1Destinations, type Tier1Link } from "@/data/tier1-links";

/** 家電記事末尾に置く、Tier1収益記事への控えめな「あわせて読みたい」カード */
export function RelatedTier1({ items }: { items: Tier1Link[] }) {
  if (items.length === 0) return null;
  return (
    <section className="not-prose mt-10 border-t border-ink/10 pt-8">
      <h2 className="mb-4 font-serif text-xl font-bold text-ink">あわせて読みたい</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(({ to, reason }) => {
          const dest = tier1Destinations[to];
          return (
            <li key={to}>
              <Link
                href={dest.href}
                className="group flex flex-col rounded-2xl border border-ink/8 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card-hover"
              >
                <h3 className="font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent">
                  {dest.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink/65">{reason}</p>
                <span className="mt-3 block text-right text-sm font-bold text-accent transition-all group-hover:underline">
                  記事を読む →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
