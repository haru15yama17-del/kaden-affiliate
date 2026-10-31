import type { ReviewStats } from "@/data/types";

// 「みんなの評判」：楽天レビューの件数ベース要約。原文は載せない。
export function ReviewVoices({ stats }: { stats: ReviewStats }) {
  return (
    <section>
      <h2>みんなの評判（楽天レビュー{stats.total}件をもとに編集部が要約・{stats.fetchedAt}取得）</h2>

      <h3>良い評価の傾向</h3>
      {stats.positive.length > 0 ? (
        <>
          <ul>
            {stats.positive.map((x) => (
              <li key={x.theme}>{stats.total}件中{x.count}件が「{x.label}」を好意的に評価</li>
            ))}
          </ul>
          {stats.goodTrend && <p>{stats.goodTrend}</p>}
        </>
      ) : (
        <p>特定のテーマに偏った好意的な評価は、今回の集計では目立ちませんでした。</p>
      )}

      <h3>気になる評価の傾向</h3>
      {stats.negative.length > 0 ? (
        <>
          <ul>
            {stats.negative.map((x) => (
              <li key={x.theme}>{stats.total}件中{x.count}件が「{x.label}」に不満・懸念を指摘</li>
            ))}
          </ul>
          {stats.concernTrend && <p>{stats.concernTrend}</p>}
        </>
      ) : (
        <p>特定のテーマに偏った不満の声は、今回の集計では目立ちませんでした。</p>
      )}

      <p className="text-xs text-ink/50">
        出典：
        <a href={stats.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">楽天市場 商品レビュー</a>
        （{stats.fetchedAt}取得）。購入者の投稿を編集部が分類・集計し、文章は言い換えて掲載しています。件数は取得時点のもので、評価は個人の感想です。
      </p>
    </section>
  );
}
