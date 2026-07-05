import type { Product } from "@/data/types";
import { Rating } from "./Rating";

export function ComparisonTable({
  items,
  highlightBest = true,
}: {
  items: Product[];
  /** falseの場合「おすすめ」バッジと該当列のハイライトを表示しない（優劣ではなく用途別に選ぶ記事向け） */
  highlightBest?: boolean;
}) {
  const labels = Array.from(
    new Set(items.flatMap((p) => p.specs.map((s) => s.label)))
  );
  const get = (p: Product, label: string) =>
    p.specs.find((s) => s.label === label)?.value ?? "—";

  const bestIdx = highlightBest
    ? items.reduce(
        (best, p, i) => ((p.rating ?? 0) > (items[best].rating ?? 0) ? i : best),
        0
      )
    : -1;

  return (
    <div className="overflow-x-auto rounded-xl border border-ink/15 shadow-card">
      <table className="w-full min-w-[580px] border-collapse text-sm">
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
                <span className="block">{p.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-ink/10">
            <td className="p-3 font-medium text-ink/60">編集部評価</td>
            {items.map((p, i) => (
              <td key={p.slug} className={`p-3 ${i === bestIdx ? "bg-accent/5" : ""}`}>
                {p.rating != null ? <Rating value={p.rating} /> : "—"}
              </td>
            ))}
          </tr>
          <tr className="border-t border-ink/10">
            <td className="p-3 font-medium text-ink/60">価格帯</td>
            {items.map((p, i) => (
              <td key={p.slug} className={`p-3 font-bold ${i === bestIdx ? "bg-accent/5 text-accent" : ""}`}>
                {p.priceRange}
              </td>
            ))}
          </tr>
          {labels.map((label) => (
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
  );
}
