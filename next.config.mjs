/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 商品画像を外部CDN/ECの公式画像URLで使う場合はここに許可ドメインを追加
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  },
  async redirects() {
    // A8提携否認済みの食材宅配3社（パルシステム・コープデリ・オイシックス）が絡む
    // 比較ページは内部リンクから除外済み（lib/links.ts のゲート）。
    // 2026-06-05〜07-08に生成されていた旧URLをカテゴリページへ308リダイレクト。
    const retiredFoodDeliveryCompareSlugs = [
      "coopdeli-vs-oisix",
      "coopdeli-vs-palsystem",
      "coopdeli-vs-yoshikei",
      "oisix-vs-palsystem",
      "oisix-vs-yoshikei",
      "palsystem-vs-seikatsu-club",
    ];
    return retiredFoodDeliveryCompareSlugs.map((slug) => ({
      source: `/compare/${slug}`,
      destination: "/category/food-delivery",
      permanent: true,
    }));
  }
};
export default nextConfig;
