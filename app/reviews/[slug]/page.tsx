import { ArticleWelcome, ReadingPause, ReadingSteps, ProductGlance } from "@/components/ReadingGuide";
import fs from "node:fs";
import { EditorialImage } from "@/components/EditorialImage";
import { categoryImage } from "@/data/editorial";
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
import { CampaignBanner } from "@/components/CampaignBanner";
import { ComparisonTable } from "@/components/ComparisonTable";
import { RelatedArticles } from "@/components/RelatedArticles";
import { StickyCta } from "@/components/StickyCta";
import Link from "next/link";
import { ReviewVoices } from "@/components/ReviewVoices";
import { RichText } from "@/components/RichText";
import type { Product, ReviewStats } from "@/data/types";

// キャンペーン期間の判定をリクエスト時刻ベースにするため、ビルド時に固定されないよう定期再生成する
export const revalidate = 3600;

interface ArticleBody {
  intro?: string;
  reviewDetail?: string;
  summary?: string;
  faq?: { q: string; a: string }[];
  sources?: string[];
  reviewStats?: ReviewStats;
  sections?: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
}

// 楽天レビュー収集は既定で無効（方針B）。true のときだけ「みんなの評判」を表示する
const SHOW_REVIEW_VOICES = process.env.ENABLE_REVIEW_COLLECTION === "true";
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
  const body = loadBody(p.slug);
  const hasReviewSummary = Boolean((SHOW_REVIEW_VOICES && body.reviewStats) ||body.reviewDetail || p.reviewSummary);
  const reviewPart = hasReviewSummary ? "、口コミ要約" : "";
  return buildMetadata({
    title: `${p.name}のレビュー・評価｜スペックと良い点・気になる点を整理`,
    description: `${p.name}（${p.priceRange}）を編集部が評価。スペック、メリット・デメリット${reviewPart}、競合比較、向き不向きまで解説します。`,
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
      { q: `${p.name}の価格帯は？`, a: `価格は時期・販売店・契約条件により変動します。リンク先で最新の価格と送料をご確認ください。` },
      { q: `${p.name}はどんな人向け？`, a: p.bestFor.join("／") },
    ];

  // 内部リンク判定
  const showFoodDeliveryLink =
    p.category === "cooking" && !p.slug.includes("dishwasher");
  const showWaterServerLink = p.slug.includes("dishwasher");
  const HOTCOOK_SLUGS = ["sharp-kn-hw24h-hotkook", "sharp-kn-hw16h-hotkook", "sharp-kn-hw10g-hotkook"];
  const showHotcookGuideLink = HOTCOOK_SLUGS.includes(p.slug);

  const reviewText = body.reviewDetail ?? (p.reviewSummary || undefined);

  // 結論ボックスにCTAを表示するか
  const hasCta =
    !!(p.affiliate.ctaLabel) ||
    !!(p.affiliate.amazonAsin) ||
    !!(p.affiliate.rakutenUrl) ||
    !!(p.affiliate.moshimoUrl);

  return (
    <article className="prose-article max-w-none pb-20">
      <JsonLd data={reviewJsonLd(p, `/reviews/${p.slug}`)} />
      <JsonLd data={faqJsonLd(faq.map((x) => ({ q: x.q, a: x.a.replace(/\*\*/g, "") })))} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: cat.name, path: `/category/${p.category}` },
          { name: p.name, path: `/reviews/${p.slug}` },
        ]}
      />

      <CampaignBanner slug={p.slug} />

      {/* Title */}
      <h1 className="font-serif text-3xl font-bold leading-tight">{p.name}のレビュー・評価</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink/55">
        {p.rating != null && <Rating value={p.rating} />}
        <span>価格帯：<strong className="text-accent">{p.priceRange}</strong></span>
        <span>更新日：{p.updatedAt}</span>
      </div>

      {p.image ? <><ProductGlance p={p} link={false}/><ReadingSteps category={p.category} slug={p.slug}/></> : <ArticleWelcome category={p.category} slug={p.slug} />}
      {p.slug === "lenovo-ideapad-slim5i-gen9" && <aside className="rounded-xl border border-ink/15 bg-white p-4 text-sm not-prose"><strong>掲載仕様を訂正しました（2026年11月2日）</strong><p>以前の15.6型・Core i5-1334Uの表記を訂正し、メーカー公式の15.3型・15IRU9シリーズの情報を掲載しています。特定の製品番号を示すページではありません。メモリやSSD、Officeの有無は購入先の製品番号でご確認ください。</p></aside>}
      {p.slug === "iris-woozoo-stf-dc15tec" && <aside className="rounded-xl border border-ink/15 bg-white p-4 text-sm not-prose"><strong>購入時は「ベーシックモデル STF-DC15TEC」を確認</strong><p>販売先には上位モデルSTF-SDC15TECもあります。このページの写真・仕様はSTF-DC15TECです。確認できなかった旧掲載商品DCF-JM151Tの紹介は終了し、公式情報と販売先を確認できる本商品へ案内を統合しました。旧商品の評価・体験を引き継いだものではありません。</p></aside>}
      <div className="quick-match not-prose"><span>こんな暮らしに</span><p>{p.bestFor[0] || "使いたい場面と仕様を確認して選びましょう。"}</p></div>
      <h2>はじめに</h2>
      <p>{body.intro ? <RichText text={body.intro} /> : p.slug === "lenovo-ideapad-slim5i-gen9" ? "15.3型の画面を備えた15IRU9シリーズについて、メーカー公開情報から仕様と選ぶ際の確認点を整理しました。CPU・メモリ・SSDは構成で異なります。使うアプリの要件、持ち運ぶ頻度、Officeの有無を確認して選びましょう。" : `${p.name}を、${cat.selectionPoints.slice(0, 3).join("・")}の観点で評価しました。結論から言うと、${p.bestFor[0]}に向いた選択肢です。`}</p>

      {/* 自動生成記事の追加セクション（空のセクションは出力されない） */}
      {body.sections?.map((s, i) => (
        <section key={i}>
          <h2>{s.heading}</h2>
          {s.paragraphs?.map((x, j) => (
            <p key={j}><RichText text={x} /></p>
          ))}
          {s.bullets && s.bullets.length > 0 && (
            <ul>{s.bullets.map((x, j) => <li key={j}><RichText text={x} /></li>)}</ul>
          )}
        </section>
      ))}

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

      {p.source && (
        <p className="mt-2 text-xs text-ink/50">
          出典：
          <a href={p.source.url} target="_blank" rel="noopener noreferrer nofollow">{p.source.label}</a>
          （{p.source.checkedAt}確認）。価格・仕様は変更される場合があります。
        </p>
      )}

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

      {SHOW_REVIEW_VOICES && body.reviewStats ? (
        <ReviewVoices stats={body.reviewStats} />
      ) : reviewText && (
        <>
          <h2>口コミ・評判の要約</h2>
          <p>{reviewText}</p>
          {body.sources && body.sources.length > 0 && (
            <p className="text-xs text-ink/45">出典：{body.sources.join("、")}</p>
          )}
        </>
      )}

      {showHotcookGuideLink && (
        <div className="not-prose my-6 rounded-xl border-2 border-accent/30 bg-blush/40 p-4">
          <p className="text-sm font-bold text-ink">📖 型番選びで後悔したくない方へ</p>
          <p className="mt-1 text-xs text-ink/60">
            KN-HW24H/16H/10Gの型番の違いや、購入前に知っておきたい後悔しやすいポイントを実店舗での取材も交えて詳しく解説しています。
          </p>
          <Link
            href="/reviews/hotcook-koukai"
            className="mt-2 inline-block text-sm font-bold text-accent hover:underline"
          >
            ホットクックで後悔しないための選び方ガイドを見る →
          </Link>
        </div>
      )}

      {competitors.length > 0 && (
        <>
          <h2>競合商品との比較</h2>
          <ComparisonTable items={[p, ...competitors]} hideMainOnlyRows />
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
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. <RichText text={x.a} /></p>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink/55">修正履歴：2026-11-01 価格・比較対象・比較優位の表現と利用条件の案内を見直しました。</p>
      <h2>まとめ</h2>
      <p>{body.summary ? <RichText text={body.summary} /> : `${p.name}は${p.bestFor.join("・")}におすすめできる選択肢です。一方で${p.notFor[0]}には別の選択肢も検討しましょう。`}</p>

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
        <p className="mb-1 text-sm font-bold text-ink">{p.name} {p.affiliate.informationOnly ? "の公式製品情報" : "の購入・申し込みはこちら"}</p>
        <p className="mb-4 text-xs text-ink/55">
          {p.affiliate.informationOnly ? "一致する新品の購入先は確認できていません。公式の仕様・サポート情報をご案内します。" : "価格は変動します。リンク先で最新価格・購入条件をご確認ください。"}
        </p>
        <AffiliateButtons aff={p.affiliate} productName={p.name} />
      </div>

      <RelatedArticles items={related} />

      {/* Sticky bottom CTA */}
      <StickyCta productName={p.name} priceRange={p.priceRange} aff={p.affiliate} />
    </article>
  );
}
