import { ReadingSteps } from "@/components/ReadingGuide";
import Link from "next/link";
import { EditorialImage } from "@/components/EditorialImage";
import { categoryImage } from "@/data/editorial";
import { notFound } from "next/navigation";
import { categories, categoryMap } from "@/data/categories";
import { articles } from "@/data/articles";
import { getAllProducts, getProductsByCategory } from "@/lib/data";
import { categoryComparePairs } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { ArticleCard } from "@/components/ArticleCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CampaignBanner } from "@/components/CampaignBanner";
import { JsonLd } from "@/components/JsonLd";

// キャンペーン期間の判定をリクエスト時刻ベースにするため、ビルド時に固定されないよう定期再生成する
export const revalidate = 3600;

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
  const relatedArticles = articles.filter((a) => a.category === c.slug);
  const comparePairs = categoryComparePairs(c.slug, await getAllProducts());

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

      <section className="category-hero"><div><p className="eyebrow">暮らしに合う選択を</p><h1>{hub ? hub.h1 : c.name + "の比較と選び方"}</h1><p>{c.intro}</p><nav className="category-jumps" aria-label="ページ内の案内">{relatedArticles.length > 0 && <a href="#category-guides">比較記事から選ぶ</a>}<a href="#category-products">商品・サービスを見る</a></nav></div><EditorialImage {...categoryImage(c.slug)} priority /></section>
      {c.slug === "water-server" && <CampaignBanner slug="frecious" />}
      <ReadingSteps category={c.slug}/>
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

      {/* 比較記事（該当カテゴリの記事が無ければ非表示） */}
      {relatedArticles.length > 0 && (
        <div className="mb-10" id="category-guides">
          <h2 className="mb-4 font-serif text-xl font-bold">{c.name}の比較記事</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </div>
      )}

      {/* 2機種比較（自動生成 compare ページ一覧） */}
      {comparePairs.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-serif text-xl font-bold">{c.name}を2機種で比較する</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {comparePairs.map(({ slug, a, b }) => (
              <Link
                key={slug}
                href={`/compare/${slug}`}
                className="group flex flex-col rounded-2xl border border-ink/8 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card-hover"
              >
                <p className="font-serif text-sm leading-snug text-ink transition-colors group-hover:text-accent">
                  {a.name} <span className="text-ink/40">vs</span> {b.name}
                </p>
                <span className="mt-auto block pt-3 text-right text-sm font-bold text-accent transition-all group-hover:underline">
                  比較を見る →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* レビュー一覧 */}
      <h2 id="category-products" className="mb-4 font-serif text-xl font-bold">
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
