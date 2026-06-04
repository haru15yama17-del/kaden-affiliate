import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({
  title: "運営者情報", description: `${site.name}の運営方針・評価基準・運営者について。`, path: "/about"
});
export default function AboutPage() {
  return (
    <div className="prose-article max-w-none">
      <h1 className="font-serif text-3xl font-bold">運営者情報</h1>
      <h2>運営方針</h2>
      <p>{site.operator.profile}</p>
      <h2>評価基準</h2>
      <p>{site.ratingPolicy}実機確認または公式の公開スペックに基づき、編集部が自分の言葉で評価しています。</p>
      <h2>運営者</h2>
      <p>{site.operator.name}</p>
      <p>ご連絡は<a href="/contact" className="text-accent underline">お問い合わせ</a>から。</p>
    </div>
  );
}
