import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({
  title: "お問い合わせ", description: "ご質問・修正依頼・取材のお問い合わせはこちら。", path: "/contact"
});
export default function ContactPage() {
  return (
    <div className="prose-article max-w-none">
      <h1 className="font-serif text-3xl font-bold">お問い合わせ</h1>
      <p>ご質問・記事内容の修正依頼・取材のご依頼などは、下記フォームよりご連絡ください。</p>
      <p className="rounded-md border border-dashed border-ink/30 p-4 text-sm text-ink/60">
        ※ ここにGoogleフォームの埋め込み、またはお問い合わせフォーム（Resend/Formspree等）を設置してください。
      </p>
    </div>
  );
}
