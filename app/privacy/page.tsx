import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({
  title: "プライバシーポリシー", description: "個人情報の取り扱い・アクセス解析・広告について。", path: "/privacy"
});
export default function PrivacyPage() {
  return (
    <div className="prose-article max-w-none">
      <h1 className="font-serif text-3xl font-bold">プライバシーポリシー</h1>
      <h2>個人情報の利用目的</h2>
      <p>お問い合わせ対応のためにのみ利用し、第三者へ提供しません。</p>
      <h2>アクセス解析ツール</h2>
      <p>当サイトはGoogle Analytics等を利用する場合があります。データは匿名で収集され個人を特定しません。</p>
      <h2>広告（アフィリエイト）について</h2>
      <p>当サイトはAmazonアソシエイト、楽天アフィリエイト等の第三者配信を利用しています。Cookieを使用して適切な広告配信が行われる場合があります。</p>
      <h2>免責</h2>
      <p>詳細は<a href="/disclaimer" className="text-accent underline">免責事項</a>をご確認ください。</p>
    </div>
  );
}
