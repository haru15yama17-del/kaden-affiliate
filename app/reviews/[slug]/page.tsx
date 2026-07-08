import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getProduct, getAllProducts } from "@/lib/data";
import { categoryMap } from "@/data/categories";
import { effectiveCompetitors, relatedReviews, compareSlug } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Rating } from "@/components/Rating";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import { RelatedArticles } from "@/components/RelatedArticles";
import { StickyCta } from "@/components/StickyCta";
import Link from "next/link";
import type { Product } from "@/data/types";

interface ArticleBody {
  intro?: string;
  reviewDetail?: string;
  summary?: string;
  faq?: { q: string; a: string }[];
  sources?: string[];
}
function loadBody(slug: string): ArticleBody {
  const file = path.join(process.cwd(), "content", "reviews", `${slug}.json`);
  if (fs.existsSync(file)) {
    try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch { /* noop */ }
  }
  return {};
}

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return buildMetadata({
    title: `${p.name}のレビュー・評価｜良い点と気になる点を実機目線で`,
    description: `${p.name}（${p.priceRange}）を編集部が評価。スペック、メリット・デメリット、口コミ要約、競合比較、向き不向きまで解説します。`,
    path: `/reviews/${p.slug}`,
    type: "article",
    image: p.image || undefined,
    modifiedTime: p.updatedAt,
  });
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const all = await getAllProducts();
  const p = all.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const cat = categoryMap[p.category];
  const body = loadBody(p.slug);
  const competitors = effectiveCompetitors(p, all);
  const related = relatedReviews(p, all);
  const faq =
    body.faq ?? [
      { q: `${p.name}の価格帯は？`, a: `${p.priceRange}が目安です（時期により変動）。` },
      { q: `${p.name}はどんな人向け？`, a: p.bestFor.join("／") },
    ];

  // 内部リンク判定
  const showFoodDeliveryLink =
    p.category === "cooking" && !p.slug.includes("dishwasher");
  const showWaterServerLink = p.slug.includes("dishwasher");

  // 結論ボックスにCTAを表示するか
  const hasCta =
    !!(p.affiliate.ctaLabel) ||
    !!(p.affiliate.amazonAsin) ||
    !!(p.affiliate.rakutenUrl) ||
    !!(p.affiliate.moshimoUrl);

  return (
    <article className="prose-article max-w-none pb-20">
      <JsonLd data={reviewJsonLd(p, `/reviews/${p.slug}`)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: cat.name, path: `/category/${p.category}` },
          { name: p.name, path: `/reviews/${p.slug}` },
        ]}
      />

      {/* ✅ この記事の結論（本文最上部） */}
      <div className="not-prose my-4 rounded-2xl border-2 border-sub/30 bg-moss/40 p-5">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-sub">
          ✅ この記事の結論
        </p>
        <p className="font-bold text-ink">{p.name}</p>
        <p className="mt-1 text-sm text-ink/65">
          こんな人におすすめ：{p.bestFor[0]}
        </p>
        {hasCta && (
          <div className="mt-3">
            <AffiliateButtons aff={p.affiliate} productName={p.name} />
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl font-bold leading-tight">{p.name}のレビュー・評価</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink/55">
        {p.rating != null && <Rating value={p.rating} />}
        <span>価格帯：<strong className="text-accent">{p.priceRange}</strong></span>
        <span>更新日：{p.updatedAt}</span>
      </div>

      {/* ── 総合評価サマリーボックス（CVR最重要） ── */}
      <div className="my-6 rounded-2xl border-2 border-accent/30 bg-white p-5 shadow-card">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent/75">
          編集部の総合評価
        </p>
        <div className="mb-4 flex items-center gap-5">
          {p.rating != null && <Rating value={p.rating} size="lg" />}
          <div>
            <p className="font-bold text-ink">{p.priceRange}</p>
            <p className="text-xs text-ink/45">最終更新：{p.updatedAt}</p>
          </div>
        </div>

        {/* Pros/cons quick list */}
        <div className="mb-5 grid gap-1.5 sm:grid-cols-2">
          {p.pros.slice(0, 3).map((pro, i) => (
            <p key={i} className="flex items-start gap-1.5 text-sm">
              <span className="mt-0.5 shrink-0 rounded bg-ok/10 px-1 font-bold text-ok">✓</span>
              <span>{pro.replace(/（※編集部記述）/g, "")}</span>
            </p>
          ))}
          {p.cons.slice(0, 2).map((con, i) => (
            <p key={i} className="flex items-start gap-1.5 text-sm">
              <span className="mt-0.5 shrink-0 rounded bg-ng/10 px-1 font-bold text-ng">✗</span>
              <span className="text-ink/65">{con.replace(/（※編集部記述）/g, "")}</span>
            </p>
          ))}
        </div>

        <AffiliateButtons aff={p.affiliate} productName={p.name} />
      </div>

      <h2>はじめに</h2>
      <p>{body.intro ?? `${p.name}を、${cat.selectionPoints.slice(0, 3).join("・")}の観点で評価しました。結論から言うと、${p.bestFor[0]}に向いた一台です。`}</p>

      <h2>主なスペック</h2>
      <div className="overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {p.specs.map((s) => (
              <tr key={s.label} className="border-t border-ink/10 first:border-t-0">
                <th className="w-1/3 bg-sub/5 p-3 text-left text-xs font-semibold text-ink/70">{s.label}</th>
                <td className="p-3 font-medium">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>良い点</h2>
      <div className="not-prose space-y-2">
        {p.pros.map((x, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg bg-ok/5 border border-ok/15 p-3 text-sm">
            <span className="mt-0.5 shrink-0 font-bold text-ok">✓</span>
            <span>{x.replace(/（※編集部記述）/g, "")}</span>
          </div>
        ))}
      </div>

      <h2>気になる点</h2>
      <div className="not-prose space-y-2">
        {p.cons.map((x, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg bg-ng/5 border border-ng/15 p-3 text-sm">
            <span className="mt-0.5 shrink-0 font-bold text-ng">✗</span>
            <span>{x.replace(/（※編集部記述）/g, "")}</span>
          </div>
        ))}
      </div>

      <h2>口コミ・評判の要約</h2>
      <p>{body.reviewDetail ?? p.reviewSummary}</p>
      {body.sources && body.sources.length > 0 && (
        <p className="text-xs text-ink/45">出典：{body.sources.join("、")}</p>
      )}

      {competitors.length > 0 && (
        <>
          <h2>競合商品との比較</h2>
          <ComparisonTable items={[p, ...competitors]} />
          <div className="not-prose mt-4 flex flex-wrap gap-2">
            {competitors.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${compareSlug([p.slug, comp.slug])}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sub/40 bg-sub/5 px-3 py-1.5 text-sm font-medium text-sub transition-all hover:bg-sub hover:text-white"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {p.name} vs {comp.name} の詳細比較を見る →
              </Link>
            ))}
          </div>
        </>
      )}

      <h2>おすすめできる人</h2>
      <ul>
        {p.bestFor.map((x, i) => <li key={i}>{x}</li>)}
      </ul>

      <h2>おすすめできない人</h2>
      <ul>
        {p.notFor.map((x, i) => <li key={i}>{x}</li>)}
      </ul>

      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
          </div>
        ))}
      </div>

      <h2>まとめ</h2>
      <p>{body.summary ?? `${p.name}は${p.bestFor.join("・")}におすすめできる一台です。一方で${p.notFor[0]}には別の選択肢も検討しましょう。`}</p>

      {/* 内部リンク：調理家電 → 食材宅配 */}
      {showFoodDeliveryLink && (
        <div className="not-prose my-6 rounded-xl border border-accent/20 bg-blush/40 p-4">
          <p className="text-sm font-bold text-ink">🥘 相性のいい食材宅配・ミールキット</p>
          <p className="mt-1 text-xs text-ink/60">
            ホットクック・電気圧力鍋と組み合わせると、食材宅配のカット済み食材で時短効果がさらにアップします。
          </p>
          <Link
            href="/category/food-delivery"
            className="mt-2 inline-block text-sm font-bold text-accent hover:underline"
          >
            食材宅配・ミールキット比較を見る →
          </Link>
        </div>
      )}

      {/* 内部リンク：食洗機 → ウォーターサーバー */}
      {showWaterServerLink && (
        <div className="not-prose my-6 rounded-xl border border-accent/20 bg-blush/40 p-4">
          <p className="text-sm font-bold text-ink">💧 キッチンをもっと快適に</p>
          <p className="mt-1 text-xs text-ink/60">
            食洗機と合わせてウォーターサーバーを導入すると、キッチン全体の家事負担が大幅に軽減されます。
          </p>
          <Link
            href="/category/water-server"
            className="mt-2 inline-block text-sm font-bold text-accent hover:underline"
          >
            ウォーターサーバー比較を見る →
          </Link>
        </div>
      )}

      {/* Final buy CTA */}
      <div className="not-prose my-8 rounded-2xl border-2 border-accent/30 bg-blush/50 p-5">
        <p className="mb-1 text-sm font-bold text-ink">{p.name} の購入・申し込みはこちら</p>
        <p className="mb-4 text-xs text-ink/55">
          価格は変動します。下記の各ストアで最新価格・特典をご確認ください。
        </p>
        <AffiliateButtons aff={p.affiliate} productName={p.name} />
      </div>

      <RelatedArticles items={related} />

      {/* Sticky bottom CTA */}
      <StickyCta productName={p.name} priceRange={p.priceRange} aff={p.affiliate} />
    </article>
  );
}
