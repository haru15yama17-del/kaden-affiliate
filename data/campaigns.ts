// 期間限定キャンペーン情報。CampaignBanner が対象ページでのみ表示する。
// 期間外になったら getActiveCampaign が undefined を返し、コード修正なしで自動的に非表示になる。

export interface Campaign {
  slug: string; // 対象商品の slug（data/products.seed.json の slug と一致させる）
  title: string;
  points: string[]; // 特典の箇条書き
  startDate: string; // "YYYY-MM-DD"（Asia/Tokyo基準・当日を含む）
  endDate: string; // "YYYY-MM-DD"（Asia/Tokyo基準・当日を含む）
  campaignUrl: string; // 参考表示用の公式キャンペーンページURL（A8計測のため実際のリンク遷移には使わない）
}

export const campaigns: Campaign[] = [
  {
    slug: "frecious",
    title: "フレシャス『水1箱分無料キャンペーン』",
    points: [
      "初回の天然水1箱を無料プレゼント",
      "抽選でアラジントースター（4枚焼き）が当たる",
      "オリジナルグッズを全員プレゼント",
      "Slat+cafeはさらにUCCドリップポッド2箱の初回特典付き",
    ],
    startDate: "2026-07-13",
    endDate: "2026-07-20",
    campaignUrl: "https://www.frecious.jp/campaign/present/",
  },
];

function jstDateString(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** 現在時刻（JST基準）が期間内のキャンペーンだけを返す。 */
export function getActiveCampaign(slug: string, now: Date = new Date()): Campaign | undefined {
  const today = jstDateString(now);
  return campaigns.find((c) => c.slug === slug && today >= c.startDate && today <= c.endDate);
}
