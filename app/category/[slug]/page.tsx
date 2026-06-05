import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryMap } from "@/data/categories";
import { getProductsByCategory } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { JsonLd } from "@/components/JsonLd";

const HUB_META: Partial<Record<string, { title: string; h1: string; description: string }>> = {
  "water-server": {
    title: "【2026年】ウォーターサーバーおすすめ比較｜赤ちゃん・コスパで選ぶ人気5社",
    h1: "ウォーターサーバーおすすめ比較（2026年）",
    description:
      "2026年最新のウォーターサーバーを編集部が比較。赤ちゃんにも安心な天然水・RO水タイプ、月額費用・電気代のコスパ比較、お試し特典情報まで徹底解説します。",
  },
  "food-delivery": {
    title: "【2026年】食材宅配・ミールキット比較｜共働き主婦が選ぶおすすめ5社",
    h1: "食材宅配・ミールキット比較（2026年）",
    description:
      "2026年の食材宅配・ミールキットを共働き主婦目線で比較。お試しセット価格・週次費用・調理時間の短縮効果など、失敗しない選び方を解説します。",
  },
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = categoryMap[params.slug];
  if (!c) return {};
  const hub = HUB_META[params.slug];
  if (hub) {
    return buildMetadata({
      title: hub.title,
      description: hub.description,
      path: `/category/${params.slug}`,
    });
  }
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
  const hub = HUB_META[params.slug];
  const topProduct = items[0];

  return (
    <div>
      {/* ItemList 構造化データ（比較ハブのみ） */}
      {hub && items.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            items.map((p) => ({ name: p.name, path: `/reviews/${p.slug}` }))
          )}
        />
      )}

      <Breadcrumbs
        items={[{ name: "トップ", path: "/" }, { name: c.name, path: `/category/${c.slug}` }]}
      />

      <h1 className="font-serif text-3xl font-bold">
        {hub ? hub.h1 : `${c.name}のおすすめと選び方`}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">{c.intro}</p>

      {/* ✅ 迷ったらコレ（比較ハブのみ） */}
      {hub && topProduct && (
        <div className="my-6 rounded-2xl border-2 border-gold/40 bg-gold/5 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
            ✅ 迷ったらコレ — 編集部おすすめ No.1
          </p>
          <p className="text-lg font-bold text-ink">{topProduct.name}</p>
          <p className="mt-1 text-sm text-ink/65">{topProduct.bestFor[0]}</p>
          <Link
            href={`/reviews/${topProduct.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-cta transition-all hover:brightness-110"
          >
            詳しいレビューを見る →
          </Link>
        </div>
      )}

      {/* Ranking CTA */}
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

      {/* 選び方チェックポイント */}
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

      {/* 横並び比較表（比較ハブのみ） */}
      {hub && items.length > 1 && (
        <div className="mb-10">
          <h2 className="mb-4 font-serif text-xl font-bold">各社を横並びで比較</h2>
          <div className="overflow-x-auto">
            <ComparisonTable items={items.slice(0, 5)} />
          </div>
        </div>
      )}

      {/* レビュー一覧 */}
      <h2 className="mb-4 font-serif text-xl font-bold">
        {hub ? `${c.name}の詳細レビュー一覧` : `${c.name}のレビュー一覧`}
      </h2>
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
