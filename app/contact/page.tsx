import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({
  title: "お問い合わせ", description: "ご質問・修正依頼・取材のお問い合わせはこちら。", path: "/contact"
});
export default function ContactPage() {
  return (
    <div className="prose-article max-w-none">
      <h1 className="font-serif text-3xl font-bold">お問い合わせ</h1>
      <p>ご質問・記事内容の修正依頼・取材のご依頼などは、下記フォームよりご連絡ください。</p>
      <div className="mt-8 mb-12 rounded-xl bg-blush/40 p-4 sm:p-6">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf_BSUuZYD1yAtqljgBDtlsCPRw86m63wU468akpQMsdhHH5w/viewform?embedded=true"
          title="お問い合わせフォーム"
          width="100%"
          height="860"
          className="block w-full border-0"
          style={{ minHeight: 860 }}
        >
          読み込んでいます…
        </iframe>
      </div>
    </div>
  );
}
