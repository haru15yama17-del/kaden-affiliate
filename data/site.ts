export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shufu-kaden.com",
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "主婦の家電と暮らし研究室",
  description:
    "主婦目線で家電・暮らしのサービスを比べるメディア。ウォーターサーバー・食材宅配から白物家電まで、忖度なしの比較と評価で失敗しない選び方をお届けします。",
  // E-E-A-T: 運営者情報
  operator: {
    name: "主婦の家電と暮らし研究室 編集部",
    profile:
      "家電販売・暮らし改善の実務経験をもとに、主婦の日々の暮らしをラクにする家電とサービスを忖度なしで比較・評価しています。",
    contactPath: "/contact"
  },
  // 各記事の評価軸を統一（比較基準の透明性）
  ratingPolicy:
    "評価は『コストパフォーマンス』『使いやすさ』『時短効果』『安全性』『サポート』の5軸を基準にしています。"
};
