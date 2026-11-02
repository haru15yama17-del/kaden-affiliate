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
    const retiredFan = "iris-dcf-jm151t-fan";
    const replacement = "iris-woozoo-stf-dc15tec";
    const fanRedirects = [{source:`/reviews/${retiredFan}`,destination:`/reviews/${replacement}`,permanent:true}];
    for (const partner of ["balmuda-egf1800-fan","balmuda-egf3400-cirq",replacement]) {
      for (const pair of [[retiredFan,partner],[partner,retiredFan]]) fanRedirects.push({source:`/compare/${pair.join("-vs-")}`,destination:partner===replacement?`/reviews/${replacement}`:`/compare/${[partner,replacement].sort().join("-vs-")}`,permanent:true});
    }
    const productRedirects = [
      {source: "/reviews/panasonic-nr-b14fw-fridge", destination: "/reviews/panasonic-nr-b16c3-fridge", permanent: true},
      {source: "/reviews/lenovo-ideapad-slim5i-gen9", destination: "/reviews/lenovo-ideapad-slim3-83ka006vjp", permanent: true},
    ];
    return [...productRedirects, ...fanRedirects, ...retiredFoodDeliveryCompareSlugs.map((slug) => ({
      source: `/compare/${slug}`,
      destination: "/category/food-delivery",
      permanent: true,
    }))];
  }
};
export default nextConfig;
