import { notFound } from "next/navigation";
import { categories, categoryMap } from "@/data/categories";
import { getRanking } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { Rating } from "@/components/Rating";
import Link from "next/link";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = categoryMap[params.slug];
  if (!c) return {};
  return buildMetadata({
    title: `${c.name}おすすめランキング｜編集部が比較して厳選`,
    description: `${c.name}のおすすめを編集部評価でランキング。価格帯・主要スペック・向き不向きを比較して紹介します。`,
    path: `/ranking/${c.slug}`,
  });
}

const rankMeta = [
  null,
  { badge: "rank-badge-1", border: "border-gold/50",   bg: "bg-amber-50"   },
  { badge: "rank-badge-2", border: "border-slate-300", bg: "bg-slate-50"   },
  { badge: "rank-badge-3", border: "border-orange-700/30", bg: "bg-orange-50/60" },
];

export default async function RankingPage({ params }: { params: { slug: string } }) {
  const c = categoryMap[params.slug];
  if (!c) notFound();
  const items = await getRanking(c.slug);

  return (
    <div>
      <JsonLd data={itemListJsonLd(items.map((p) => ({ name: p.name, path: `/reviews/${p.slug}` })))} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: c.name, path: `/category/${c.slug}` },
          { name: "ランキング", path: `/ranking/${c.slug}` },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold">{c.name}おすすめランキング</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/65">
        評価軸：{c.selectionPoints.join("・")}。編集部評価の高い順に紹介します。
      </p>

      {/* Selection checklist */}
      <div className="my-6 rounded-xl border border-sub/25 bg-sub/5 p-4">
        <p className="mb-2.5 text-sm font-bold text-sub">✅ 選び方のチェックポイント</p>
        <ul className="flex flex-wrap gap-2">
          {c.selectionPoints.map((s) => (
            <li key={s} className="rounded-full border border-sub/20 bg-white px-3 py-1 text-xs text-ink/70">
              {s}
            </li>
          ))}
        </ul>
      </div>

      <ol className="space-y-5">
        {items.map((p, i) => {
          const rank = i + 1;
          const meta = rank <= 3 ? rankMeta[rank] : null;

          return (
            <li
              key={p.slug}
              className={`overflow-hidden rounded-2xl border-2 transition-shadow hover:shadow-card-hover ${
                meta ? `${meta.border} ${meta.bg}` : "border-ink/10 bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Rank badge */}
                <div
                  className={`flex items-center justify-center py-5 sm:w-20 ${
                    meta ? meta.badge : "bg-ink/8"
                  }`}
                >
                  <div className="text-center">
                    <span className={`block font-serif text-3xl font-black leading-none ${meta ? "text-white" : "text-ink/50"}`}>
                      {rank}
                    </span>
                    <span className={`text-xs ${meta ? "text-white/80" : "text-ink/40"}`}>位</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/55">
                        <span className="rounded-full bg-sub/10 px-2 py-0.5 text-sub font-medium">{p.brand}</span>
                        <span>更新: {p.updatedAt}</span>
                      </div>
                      <Link
                        href={`/reviews/${p.slug}`}
                        className="mt-1 block font-serif text-lg font-bold text-ink transition-colors hover:text-accent"
                      >
                        {p.name}
                      </Link>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        {p.rating != null && <Rating value={p.rating} size="sm" />}
                        <span className="text-sm font-bold text-accent">{p.priceRange}</span>
                      </div>
                    </div>
                    <Link
                      href={`/reviews/${p.slug}`}
                      className="shrink-0 rounded-lg border border-accent px-3 py-1.5 text-sm font-bold text-accent transition-all hover:bg-accent hover:text-white"
                    >
                      詳細を見る
                    </Link>
                  </div>

                  {/* Quick pros */}
                  <div className="mt-3 grid gap-1 sm:grid-cols-2">
                    {p.pros.slice(0, 2).map((pro, pi) => (
                      <p key={pi} className="flex items-start gap-1.5 text-sm">
                        <span className="mt-0.5 shrink-0 font-bold text-ok">✓</span>
                        <span className="text-ink/80">{pro.replace(/（※編集部記述）/g, "")}</span>
                      </p>
                    ))}
                    {p.cons[0] && (
                      <p className="flex items-start gap-1.5 text-sm">
                        <span className="mt-0.5 shrink-0 font-bold text-ng">✗</span>
                        <span className="text-ink/65">{p.cons[0].replace(/（※編集部記述）/g, "")}</span>
                      </p>
                    )}
                  </div>

                  {/* Buy buttons */}
                  <div className="mt-4">
                    <AffiliateButtons aff={p.affiliate} productName={p.name} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
