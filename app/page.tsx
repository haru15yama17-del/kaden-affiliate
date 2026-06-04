import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: site.description,
  alternates: { canonical: site.url },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "ja_JP",
    images: [{ url: `${site.url}/api/og`, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [`${site.url}/api/og`],
  },
};

const catEmoji: Record<string, string> = {
  refrigerator: "❄️", washer: "🌀", vacuum: "🌪️",
  microwave: "📡", "rice-cooker": "🍚", tv: "📺",
  aircon: "🌡️", beauty: "✨", gadget: "📱",
  "personal-care": "💆",
};

const trustItems = [
  { icon: "🔍", text: "編集部が評価基準を明示" },
  { icon: "📅", text: "更新日を全記事に記載" },
  { icon: "⚖️", text: "広告主優遇なし" },
];

const hotCategories = ["refrigerator", "washer", "vacuum", "beauty", "personal-care"];

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-blush via-white to-moss px-6 py-12 sm:px-10 sm:py-14">
        <p className="mb-2.5 text-xs font-bold tracking-widest text-accent/80">
          女性のくらしを、家電から豊かに
        </p>
        <h1 className="font-serif text-3xl font-bold leading-snug text-ink sm:text-4xl">
          自分にぴったりの家電を、<br className="hidden sm:inline" />
          横並びで見つける。
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
          {site.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {trustItems.map((b) => (
            <span
              key={b.text}
              className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-white/70 px-3 py-1.5 text-xs text-ink/70 backdrop-blur-sm"
            >
              <span>{b.icon}</span>
              {b.text}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Category grid ─── */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-bold">カテゴリから探す</h2>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-white px-2 py-4 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-blush/30 hover:shadow-card-hover"
            >
              <span className="text-2xl">{catEmoji[c.slug]}</span>
              <span className="text-xs font-medium text-ink/70 transition-colors group-hover:text-accent">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Ranking CTA strip ─── */}
      <section className="mb-10 rounded-2xl border border-accent/20 bg-blush/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-ink">人気カテゴリのランキングを見る</p>
            <p className="mt-0.5 text-xs text-ink/55">編集部評価の高い順に厳選</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotCategories.map((slug) => {
              const c = categories.find((x) => x.slug === slug);
              if (!c) return null;
              return (
                <Link
                  key={slug}
                  href={`/ranking/${slug}`}
                  className="rounded-xl bg-accent px-3.5 py-1.5 text-xs font-bold text-white shadow-cta transition-all hover:brightness-110"
                >
                  {c.name}ランキング
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured reviews ─── */}
      <section className="mb-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-bold">注目のレビュー</h2>
          <Link href="/search" className="text-sm text-accent hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* ─── Trust / editorial policy ─── */}
      <section className="border-t border-ink/10 pt-10">
        <h2 className="mb-4 text-center font-serif text-xl font-bold">このサイトの評価方針</h2>
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed text-ink/60">
          {site.ratingPolicy}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: "📋", title: "評価軸を公開", body: "比較の軸を事前に明示し、恣意的な採点を排除しています。" },
            { icon: "📅", title: "更新日を明記", body: "価格・仕様の変更に合わせてページを更新し、更新日を記載しています。" },
            { icon: "⚖️", title: "独立した編集方針", body: "アフィリエイト収益は掲載・評価結果に一切影響しません。" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
              <p className="mb-1.5 font-bold text-ink">
                <span className="mr-1.5">{item.icon}</span>
                {item.title}
              </p>
              <p className="text-xs leading-relaxed text-ink/55">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
