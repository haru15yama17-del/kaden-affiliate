import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "運営者情報",
  description: "「主婦の家電と暮らし研究室」の運営者・はるのプロフィールと運営方針。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="prose-article max-w-none">
      <h1 className="font-serif text-3xl font-bold">運営者情報</h1>

      {/* プロフィールカード */}
      <div className="not-prose my-8 rounded-2xl border border-accent/20 bg-blush/50 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white font-serif shadow-cta">
            は
          </div>
          <div>
            <p className="font-serif text-xl font-bold text-ink">はる</p>
            <p className="mt-0.5 text-sm text-ink/60">主婦の家電と暮らし研究室 運営者</p>
            <p className="mt-0.5 text-xs text-ink/50">運営開始：2026年</p>
          </div>
        </div>
      </div>

      <h2>プロフィール</h2>
      <p>
        はじめまして。当サイト「主婦の家電と暮らし研究室」を運営している、はると申します。きっかけは単純で、ただの家電好き。新製品が出たと聞けば家電量販店に足を運び、店員さんを質問攻めにして「カタログには書いていない本当の使い勝手」を聞き出すのが何よりの楽しみです。
      </p>
      <p>
        このサイトでは、そうやって集めた店頭のリアルな情報と、自分や周りの家庭で実際に使ってみた感想をもとに、家電だけでなくウォーターサーバーや食材宅配など「暮らしをラクにするモノ・サービス」を、忙しい主婦・共働き家庭の目線で比較・紹介しています。
      </p>
      <p>「結局どれを選べばいいの？」に迷ったときの参考になれば嬉しいです。</p>

      <h2>評価基準・運営方針</h2>
      <ul>
        <li>評価は「コストパフォーマンス」「使いやすさ」「時短効果」「安全性」「サポート」の5軸を基準にしています</li>
        <li>実機確認または公式の公開スペックに基づき、自分の言葉で評価しています</li>
        <li>掲載順位・評価内容は広告主から操作を受けません</li>
        <li>当サイトはアフィリエイト広告を利用しており、リンク経由の購入により報酬を得る場合があります</li>
      </ul>

      <h2>広告・アフィリエイトについて</h2>
      <p>
        当サイトはもしもアフィリエイト・A8.net・Amazonアソシエイトなどのアフィリエイトプログラムに参加しています。
        記事内のリンクから商品を購入いただいた際、当サイトに報酬が発生する場合があります。
        ただし、報酬の有無によって評価内容・掲載順位が変わることはありません。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        記事内容の修正依頼・取材のご依頼などは<Link href="/contact" className="text-accent underline">お問い合わせページ</Link>からお気軽にご連絡ください。
      </p>
      <div className="not-prose mt-2 inline-flex items-center gap-2 rounded-lg bg-moss/60 px-4 py-2 text-sm text-ink/70">
        <span className="text-sub">✉</span>
        <span>harukaden.kurashi@gmail.com</span>
      </div>
    </div>
  );
}
