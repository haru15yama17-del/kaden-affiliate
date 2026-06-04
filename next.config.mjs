/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 商品画像を外部CDN/ECの公式画像URLで使う場合はここに許可ドメインを追加
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};
export default nextConfig;
