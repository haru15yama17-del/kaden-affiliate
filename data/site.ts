export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "家電えらび研究室",
  description:
    "実機チェックと公開スペックをもとに、家電を横並びで比較・評価するレビューメディア。価格や口コミは出典と更新日を明記しています。",
  // E-E-A-T: 運営者情報
  operator: {
    name: "家電えらび研究室 編集部",
    profile:
      "家電販売・EC運用の実務経験をもとに、忖度なしの比較基準で各製品を評価しています。",
    contactPath: "/contact"
  },
  // 各記事の評価軸を統一（比較基準の透明性）
  ratingPolicy:
    "評価は『価格性能比』『静音性』『使い勝手』『省エネ』『サポート』の5軸を基準にしています。"
};
