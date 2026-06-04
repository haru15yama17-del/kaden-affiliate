import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({
  title: "免責事項", description: "掲載情報・価格・リンク先に関する免責事項。", path: "/disclaimer"
});
export default function DisclaimerPage() {
  return (
    <div className="prose-article max-w-none">
      <h1 className="font-serif text-3xl font-bold">免責事項</h1>
      <p>当サイトの情報は更新時点のものであり、価格・在庫・仕様は変動します。最新かつ正確な情報は各販売店・メーカー公式でご確認ください。</p>
      <p>当サイトはアフィリエイトプログラムを利用し、リンク経由の購入により報酬を得る場合があります。掲載順位や評価は報酬額で操作していません。</p>
      <p>掲載情報の利用により生じた損害について、当サイトは責任を負いかねます。</p>
    </div>
  );
}
