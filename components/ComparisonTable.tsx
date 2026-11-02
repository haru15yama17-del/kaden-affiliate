"use client";
import { useState } from "react";
import { ProductPhoto } from "./ProductPhoto";
import { comparisonSpecs } from "@/lib/comparisonSpecs";
import { PRICE_NOTICE, publishProduct } from "@/lib/publication";
import type { Product } from "@/data/types";
import { Rating } from "./Rating";

export function ComparisonTable({
  items,
  highlightBest = false,
  hideMainOnlyRows = false,
}: {
  items: Product[];
  /** trueの場合、競合列がすべて「—」の行（メイン商品だけが持つ項目）を表示しない。スペック表が別にあるページで使う */
  hideMainOnlyRows?: boolean;
  /** falseの場合「おすすめ」バッジと該当列のハイライトを表示しない（優劣ではなく用途別に選ぶ記事向け） */
  highlightBest?: boolean;
}) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  items = items.map(publishProduct);
  const labels = Array.from(
    new Set(items.flatMap((p) => comparisonSpecs(p).map((s) => s.label)))
  );
  const get = (p: Product, label: string) =>
    comparisonSpecs(p).find((s) => s.label === label)?.value ?? "—";

  // hideMainOnlyRows: 先頭（メイン商品）以外の列がすべて「—」の行は、比較にならないので表示しない。
  // メイン商品だけが持つ項目は、ページ側のスペック表で見せる前提（スペック表のあるページ向け）。
  const baseLabels =
    !hideMainOnlyRows || items.length < 2
      ? labels
      : labels.filter((label) => items.slice(1).some((p) => get(p, label) !== "—"));

  const visibleLabels = baseLabels.filter(label => !differencesOnly || new Set(items.map(p=>get(p,label))).size > 1);

  const bestIdx = highlightBest
    ? items.reduce(
        (best, p, i) => ((p.rating ?? 0) > (items[best].rating ?? 0) ? i : best),
        0
      )
    : -1;

  return (
    <div className="photo-comparison not-prose">
      <div className="comparison-toolbar"><strong>写真と項目で見比べる</strong><button type="button" aria-pressed={differencesOnly} onClick={()=>setDifferencesOnly(!differencesOnly)}>{differencesOnly ? "すべての項目を表示" : "仕様の違いだけ表示"}</button></div>
      <div className="comparison-scroll" role="region" aria-label="商品比較表（横スクロールできます）" tabIndex={0}>
      <p className="comparison-scroll-note">横にスワイプして見比べられます。写真は同じ縮尺ではありません。「—」は未確認・未掲載です。</p>
      <table style={{minWidth:Math.max(640,120+items.length*240)}} className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-ink/5">
            <th className="w-1/4 p-3 text-left text-xs font-semibold text-ink/50">比較項目</th>
            {items.map((p, i) => (
              <th key={p.slug} className={`p-3 text-left font-semibold ${i === bestIdx ? "bg-accent/10 text-accent" : "text-ink"}`}>
                {i === bestIdx && (
                  <span className="mb-1 mr-1.5 inline-block rounded bg-accent px-1.5 py-0.5 text-xs text-white">
                    おすすめ
                  </span>
                )}
                <ProductPhoto slug={p.slug} name={p.name} compact/>
                <a className="comparison-product-link" href={`/reviews/${p.slug}`}>{p.name} →</a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="comparison-fit"><th scope="row">こんな使い方に</th>{items.map(p=><td key={p.slug}>{p.bestFor[0] ?? "使い方・仕様をご確認ください"}</td>)}</tr>
          <tr className="comparison-caution"><th scope="row">選ぶ前の確認</th>{items.map(p=><td key={p.slug}>{p.cons[0] ?? "設置条件・購入条件をご確認ください"}</td>)}</tr>
          {items.some(p => p.rating != null) && <tr className="border-t border-ink/10">
            <td className="p-3 font-medium text-ink/60">編集部評価</td>
            {items.map((p, i) => (
              <td key={p.slug} className={`p-3 ${i === bestIdx ? "bg-accent/5" : ""}`}>
                {p.rating != null ? <Rating value={p.rating} /> : "—"}
              </td>
            ))}
          </tr>}
          <tr className="border-t border-ink/10">
            <td className="p-3 font-medium text-ink/60">購入時の価格</td>
            {items.map((p, i) => (
              <td key={p.slug} className={`p-3 font-bold ${i === bestIdx ? "bg-accent/5 text-accent" : ""}`}>
                {PRICE_NOTICE}
              </td>
            ))}
          </tr>
          {visibleLabels.map((label) => (
            <tr key={label} className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">{label}</td>
              {items.map((p, i) => (
                <td key={p.slug} className={`p-3 ${i === bestIdx ? "bg-accent/5" : ""}`}>
                  {get(p, label)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="comparison-footnote">数値は各商品の掲載条件に基づきます。運転モード・測定条件・付属品が異なる場合があるため、数値の大小だけで優劣は決めていません。</p>
    </div>
  );
}
