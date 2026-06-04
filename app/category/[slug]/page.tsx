import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryMap } from "@/data/categories";
import { getProductsByCategory } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = categoryMap[params.slug];
  if (!c) return {};
  return buildMetadata({
    title: `${c.name}のおすすめと選び方｜比較・レビュー`,
    description: `${c.name}の選び方を「${c.selectionPoints.slice(0, 3).join("・")}」の軸で解説。編集部のレビューと比較で失敗しない一台を見つけます。`,
    path: `/category/${c.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const c = categoryMap[params.slug];
  if (!c) notFound();
  const items = await getProductsByCategory(c.slug);

  return (
    <div>
      <Breadcrumbs
        items={[{ name: "トップ", path: "/" }, { name: c.name, path: `/category/${c.slug}` }]}
      />

      <h1 className="font-serif text-3xl font-bold">{c.name}のおすすめと選び方</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">{c.intro}</p>

      {/* Ranking CTA — prominent */}
      <div className="my-6 flex flex-col gap-3 rounded-2xl border-2 border-accent/30 bg-blush/60 p-5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-bold text-ink">{c.name}ランキングを見る</p>
          <p className="mt-0.5 text-xs text-ink/55">編集部評価の高い順に厳選・比較</p>
        </div>
        <Link
          href={`/ranking/${c.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:brightness-110 sm:shrink-0"
        >
          <span>🏆</span>
          {c.name}ランキングを見る
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Selection points */}
      <div className="mb-8 rounded-xl border border-sub/20 bg-sub/5 p-4">
        <p className="mb-3 text-sm font-bold text-sub">✅ 選び方のチェックポイント</p>
        <ul className="space-y-2">
          {c.selectionPoints.map((s, i) => (
            <li key={s} className="flex items-start gap-2 text-sm text-ink/75">
              <span className="mt-0.5 shrink-0 font-bold text-sub">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Product list */}
      <h2 className="mb-4 font-serif text-xl font-bold">{c.name}のレビュー一覧</h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-ink/10 bg-white p-8 text-center text-ink/50">
          このカテゴリの商品はまだありません。
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
