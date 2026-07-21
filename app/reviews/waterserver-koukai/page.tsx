import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { CampaignBanner } from "@/components/CampaignBanner";
import { ComparisonTable } from "@/components/ComparisonTable";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/data/types";

// キャンペーン期間の判定をリクエスト時刻ベースにするため、ビルド時に固定されないよう定期再生成する
export const revalidate = 3600;

function HaruBubble({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="not-prose my-5 flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-2xl">
        🙋‍♀️
      </div>
      <div className="relative flex-1 rounded-2xl rounded-tl-none border border-accent/20 bg-blush/40 p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-accent/75">{label}</p>
        <div className="text-sm text-ink/75 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/** 各商品の Product 構造化データ（price不明のためoffersは含めない） */
function productJsonLd(name: string, brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: brand },
  };
}

const PATH = "/reviews/waterserver-koukai";
const TITLE = "ウォーターサーバーは共働き世帯に必要？アクアクララ・フレシャス・プレミアムウォーターを比較";

/** ざっくり比較表用に「水の種類・電気代目安・卓上型の有無・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "aquaclara": [
    { label: "水の種類", value: "RO水（純水にミネラル添加）" },
    { label: "電気代目安", value: "月475〜1,000円（機種による）" },
    { label: "卓上型の有無", value: "あり（AQUA SLIM S）" },
    { label: "最大の強み", value: "注文ノルマなしで気軽に始められること" },
  ],
  "frecious": [
    { label: "水の種類", value: "天然水（軽量パック式）" },
    { label: "電気代目安", value: "月330〜600円" },
    { label: "卓上型の有無", value: "あり（dewo mini）" },
    { label: "最大の強み", value: "軽量パックで交換がラク・エコ機能が豊富" },
  ],
  "premium-water": [
    { label: "水の種類", value: "天然水（全国8採水地）" },
    { label: "電気代目安", value: "月500〜630円" },
    { label: "卓上型の有無", value: "あり（スリムサーバー）" },
    { label: "最大の強み", value: "シリーズが豊富で長期契約ほどお得になること" },
  ],
};

const faq = [
  {
    q: "ウォーターサーバーの月額料金に含まれるものは何ですか？",
    a: "一般的にサーバーのレンタル料金と水代が中心で、電気代は別途かかることが多いです。電気代の目安は機種によって幅があり、アクアクララ月475〜1,000円、フレシャス月330〜600円、プレミアムウォーター月500〜630円ほどとされています（いずれも機種・使い方により変動）。契約前に対象機種の電気代目安を各社公式サイトで確認してください。",
  },
  {
    q: "解約金はかかりますか？",
    a: "3社とも最低利用期間が設定されている場合が多く、期間内に解約すると解約金が発生することがあります。契約前に最低利用期間・解約条件を必ず公式サイトで確認してください。",
  },
  {
    q: "赤ちゃんのミルクに使えますか？",
    a: "プレミアムウォーターには子育てプラン（設置料無料・割引）、アクアクララには子育て応援プランが用意されています。ただし水の種類（天然水かRO水か）やミネラル量への考え方はご家庭や小児科医の方針によって異なるため、具体的な使用可否は各社の公式情報を確認したうえで判断してください。",
  },
  {
    q: "卓上型と据え置き型、どちらを選べばいいですか？",
    a: "3社とも卓上型（アクアクララ AQUA SLIM S／フレシャス dewo mini／プレミアムウォーター スリムサーバー）を用意しています。キッチンの設置スペースが限られる家庭は卓上型、家族の人数が多く使用量が多い家庭は据え置き型を検討するのが基本です。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "共働き・子育て世帯がウォーターサーバーを検討する際の悩み別に、アクアクララ・フレシャス・プレミアムウォーターを水の種類・電気代目安・卓上型の有無で比較します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-07-05",
  });
}

export default async function WaterserverKoukaiPage() {
  const all = await getAllProducts();
  const servers = ["aquaclara", "frecious", "premium-water"]
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const [aquaclara, frecious, premiumWater] = servers;
  const cv = servers[0];

  const compactItems = servers.map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  const haruContents: Record<string, ReactNode> = {
    "aquaclara": (
      <>
        <p>子育て中の友人に勧められて調べたのが最初のきっかけでした。一番ホッとしたのは「注文ノルマがない」という点。水を頼み忘れて余らせがちな私には合っていそうだと感じました。</p>
        <p className="mt-2">RO水なので天然水特有のミネラル感は控えめですが、そのぶん品質が安定しているとのことで、赤ちゃんのミルク用に選ぶ家庭が多いというのも納得でした。</p>
      </>
    ),
    "frecious": (
      <>
        <p>店頭で実際にボトルを持たせてもらったとき、想像より軽くて驚きました。上部に持ち上げず交換できるタイプもあり、非力な私でも扱えそうな安心感がありました。</p>
        <p className="mt-2">天然水の飲みやすさとデザイン性の高さも魅力で、リビングに置いても生活感が出にくいのは地味に嬉しいポイントでした。</p>
      </>
    ),
    "premium-water": (
      <>
        <p>シリーズ・デザインの選択肢が多く、インテリアに合わせて選べるのが印象的でした。長く使うほど料金が下がっていくプランもあり、「とりあえず1年は続けるつもり」という人には検討しやすそうです。</p>
        <p className="mt-2">子育てプランでは設置料が無料になるなど、赤ちゃんがいる家庭向けの配慮がある点も好印象でした。</p>
      </>
    ),
  };

  return (
    <article className="prose-article max-w-none pb-20">
      {/* ── 構造化データ ── */}
      <JsonLd data={reviewJsonLd(cv, PATH, { includeReview: false })} />
      <JsonLd data={faqJsonLd(faq)} />
      {servers.map((p) => (
        <JsonLd key={p.slug} data={productJsonLd(p.name, p.brand)} />
      ))}

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "ウォーターサーバー", path: "/category/water-server" },
          { name: "ウォーターサーバー徹底比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-07-05</p>

      <p>
        共働き・子育て世帯では、家事の時短だけでなく「赤ちゃんのミルクに使う水」「水道水のまま飲むことへの漠然とした不安」を理由に、
        ウォーターサーバーを検討するご家庭が増えています。とはいえ、月額費用や解約条件が会社によって異なるため、
        「結局どれが自分の家庭に合うのか分からない」という声もよく聞きます。
      </p>
      <p>
        この記事では、注文ノルマの有無・水の交換のしやすさ・長期的なお得さという3つの悩みを軸に、
        アクアクララ・フレシャス・プレミアムウォーターの3社を比較します。効果を誇張せず、公表されている情報のみで比較していますので、
        検討の材料としてお使いください。
      </p>

      {/* ── 診断ブロック：3つの悩みから選ぶ ── */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          3つの悩みから選ぶ
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            📦 <strong>注文ノルマなしで気軽に始めたい</strong>
            　→ <span className="text-accent">アクアクララ</span>
          </li>
          <li>
            🪶 <strong>水の交換を軽くラクにしたい・天然水がいい</strong>
            　→ <span className="text-accent">フレシャス</span>
          </li>
          <li>
            💰 <strong>長く使うなら一番お得にしたい・デザイン重視</strong>
            　→ <span className="text-accent">プレミアムウォーター</span>
          </li>
        </ul>
      </div>

      <h2>3社をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「どの悩みを解決したいか」を軸にしているため、おすすめバッジは表示していません。
        電気代目安は各社公表の機種別レンジであり、実際の電気代は使用状況によって変動します。
        価格は変動するため、各社公式サイトで最新情報をご確認ください。
      </p>

      {/* ================================================================
          各社詳細セクション
      ================================================================ */}
      <h2>① アクアクララ——注文ノルマなしで気軽に始めたい方に</h2>
      <p>
        アクアクララはRO水（純水にミネラルを添加した水）を採用し、無料お試しから始められるのが特徴です。
        <strong>注文ノルマがなく、使うペースに合わせて続けられる</strong>ため、水の消費量が読みにくい家庭でも始めやすい選択肢です。
      </p>

      <div className="mt-4 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
        <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
        <ul className="space-y-1 text-sm text-ink/80">
          {aquaclara.bestFor.map((x, i) => (
            <li key={i}>・{x}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2 rounded-lg bg-ink/5 p-3">
        <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
        <ul className="space-y-0.5 text-xs text-ink/55">
          {aquaclara.notFor.map((x, i) => (
            <li key={i}>・{x}</li>
          ))}
        </ul>
      </div>

      <HaruBubble label="はるの店頭レポート">{haruContents["aquaclara"]}</HaruBubble>

      <AffiliateButtons aff={aquaclara.affiliate} productName={aquaclara.name} />

      <h2>② フレシャス——水の交換を軽くラクにしたい・天然水がいい方に</h2>
      <p>
        フレシャスは富士・朝霧高原などの天然水を、軽量パック（使い捨て）で届けてくれるのが特徴です。
        <strong>ボトルの上げ下ろしが負担になりやすい方</strong>や、天然水の飲みやすさを重視したい方に向いています。
        静音設計のモデルもあり、寝室近くに置きたい場合にも検討しやすい選択肢です。
      </p>

      <div className="mt-4 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
        <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
        <ul className="space-y-1 text-sm text-ink/80">
          {frecious.bestFor.map((x, i) => (
            <li key={i}>・{x}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2 rounded-lg bg-ink/5 p-3">
        <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
        <ul className="space-y-0.5 text-xs text-ink/55">
          {frecious.notFor.map((x, i) => (
            <li key={i}>・{x}</li>
          ))}
        </ul>
      </div>

      <HaruBubble label="はるの店頭レポート">{haruContents["frecious"]}</HaruBubble>

      <AffiliateButtons aff={frecious.affiliate} productName={frecious.name} />
      <CampaignBanner slug={frecious.slug} />

      <h2>③ プレミアムウォーター——長く使うなら一番お得にしたい・デザイン重視の方に</h2>
      <p>
        プレミアムウォーターは全国8採水地の天然水を扱い、nendoコラボモデルなどデザイン性の高いシリーズが豊富です。
        <strong>長期契約になるほど料金がお得になるプランや子育てプラン</strong>もあり、
        長く使い続ける前提で検討している方に向いています。
      </p>

      <div className="mt-4 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
        <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
        <ul className="space-y-1 text-sm text-ink/80">
          {premiumWater.bestFor.map((x, i) => (
            <li key={i}>・{x}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2 rounded-lg bg-ink/5 p-3">
        <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
        <ul className="space-y-0.5 text-xs text-ink/55">
          {premiumWater.notFor.map((x, i) => (
            <li key={i}>・{x}</li>
          ))}
        </ul>
      </div>

      <HaruBubble label="はるの店頭レポート">{haruContents["premium-water"]}</HaruBubble>

      <AffiliateButtons aff={premiumWater.affiliate} productName={premiumWater.name} />

      {/* ================================================================
          まとめ
      ================================================================ */}
      <h2>まとめ：悩みの種類で選べば後悔しにくい</h2>
      <p>
        ウォーターサーバーは「どれが一番良いか」ではなく、<strong>何を一番解決したいか</strong>で選ぶと後悔しにくくなります。
      </p>
      <ul>
        <li>
          <strong>注文ノルマなしで気軽に始めたい</strong> → アクアクララ
        </li>
        <li>
          <strong>水の交換を軽くラクにしたい・天然水がいい</strong> → フレシャス
        </li>
        <li>
          <strong>長く使うなら一番お得にしたい・デザイン重視</strong> → プレミアムウォーター
        </li>
      </ul>
      <p>
        3社とも卓上型を用意しているため、設置スペースに不安がある家庭でも検討しやすくなっています。
        価格・キャンペーン内容は変動するため、契約前に各社公式サイトで最新情報をご確認ください。
      </p>

      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
          </div>
        ))}
      </div>

      <h2>あわせて読みたい——共働き世帯の時短をもっとラクに</h2>
      <p>
        ウォーターサーバーと合わせて、調理の時短・食材準備の負担も見直すと、暮らし全体がさらにラクになりやすくなります。
      </p>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/hotcook-koukai" className="font-bold text-accent hover:underline">
            ホットクックで後悔しない？店頭で聞いた5つのデメリットと選び方
          </Link>
          （火のそばに立たずに調理を済ませたい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/yoshikei" className="font-bold text-accent hover:underline">
            はるのヨシケイ体験レビュー記事はこちら
          </Link>
          （毎日届くミールキットで買い物を減らしたい方に）
        </li>
      </ul>
    </article>
  );
}
