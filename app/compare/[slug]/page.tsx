import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/data";
import { compareSlug, effectiveCompetitors, parseComparison } from "@/lib/links";
import { buildSpecDiffParagraphs } from "@/lib/compareInsights";
import { categoryMap } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { CampaignBanner } from "@/components/CampaignBanner";
import type { Product } from "@/data/types";

// キャンペーン期間の判定をリクエスト時刻ベースにするため、ビルド時に固定されないよう定期再生成する
export const revalidate = 3600;

export async function generateStaticParams() {
  const all = await getAllProducts();
  const set = new Set<string>();
  for (const p of all) for (const c of effectiveCompetitors(p, all)) set.add(compareSlug([p.slug, c.slug]));
  return [...set].map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const items = parseComparison(params.slug, await getAllProducts());
  if (items.length !== 2) notFound();
  const names = items.map((p) => p.name).join(" と ");
  return buildMetadata({
    title: `${names}を比較｜どっちがおすすめ？用途・仕様の違い`,
    description: `${names}の仕様・購入条件・向き不向きを比較。それぞれの向き不向きを編集部が解説します。`,
    path: `/compare/${params.slug}`
  });
}

export default async function ComparePage({ params }: { params: { slug: string } }) {
  const items = parseComparison(params.slug, await getAllProducts());
  if (items.length < 2) notFound();
  const cat = categoryMap[items[0].category];
  const specDiffParagraphs = buildSpecDiffParagraphs(items);
  const hasProsConsData = items.some((p) => p.pros.length > 0 || p.cons.length > 0 || p.notFor.length > 0);

  return (
    <div className="prose-article max-w-none">
      <JsonLd data={itemListJsonLd(items.map((p) => ({ name: p.name, path: `/reviews/${p.slug}` })))} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: cat.name, path: `/category/${items[0].category}` },
          { name: "比較", path: `/compare/${params.slug}` }
        ]}
      />
      <h1 className="font-serif text-3xl font-bold">{items.map((p) => p.name).join(" と ")} を比較</h1>

      <p className="text-sm text-ink/60">2026-11-01 修正：比較対象を用途で見直し、価格の断定と自動おすすめ判定を取りやめました。仕様の測定条件が異なる場合、数値だけで優劣は判断できません。</p>
      <h2>スペック比較表</h2>
      <ComparisonTable items={items} />

      {items.map((p) => (
        <section key={p.slug} className="mt-8">
          <h2>{p.name}が向いている人</h2>
          <ul>{p.bestFor.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <div className="my-3"><AffiliateButtons aff={p.affiliate} productName={p.name} /></div>
          <CampaignBanner slug={p.slug} />
        </section>
      ))}

      {hasProsConsData && (
        <>
          <h2>メリット・デメリット</h2>
          {items.map((p) => {
            if (p.pros.length === 0 && p.cons.length === 0 && p.notFor.length === 0) return null;
            return (
              <div key={p.slug} className="mt-4">
                <h3>{p.name}</h3>
                {p.pros.length > 0 && (
                  <>
                    <p className="font-semibold">メリット</p>
                    <ul>{p.pros.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  </>
                )}
                {p.cons.length > 0 && (
                  <>
                    <p className="font-semibold">デメリット</p>
                    <ul>{p.cons.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  </>
                )}
                {p.notFor.length > 0 && (
                  <>
                    <p className="font-semibold">向いていない人</p>
                    <ul>{p.notFor.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  </>
                )}
              </div>
            );
          })}
        </>
      )}

      {specDiffParagraphs.length > 0 && (
        <>
          <h2>型番の違いをふまえた選び方</h2>
          {specDiffParagraphs.map((text, i) => <p key={i}>{text}</p>)}
        </>
      )}

      <h2>結論</h2>
      <p>
        使いたい機能・設置条件・お手入れの負担を、ご家庭の使い方に合わせて比較してください。
        各商品の詳細は個別レビューもあわせてご確認ください。
      </p>
    </div>
  );
}
