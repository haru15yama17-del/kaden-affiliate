import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/data/types";

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

/** 各商品の構造化データ（price不明のためoffers含めない） */
function productJsonLd(name: string, brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: brand },
  };
}

const PATH = "/reviews/drum-washer-koukai";
const TITLE =
  "ドラム式洗濯機おすすめ5選比較【2026年】低価格グループと人気ブランドグループで選ぶ乾燥方式の違い";

/** ざっくり比較表用に「洗濯容量・乾燥容量・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "iris-flk842-washer": [
    { label: "洗濯容量", value: "8kg" },
    { label: "乾燥容量", value: "4kg" },
    { label: "最大の強み", value: "低価格でドラム式に手が届く導入のしやすさ" },
  ],
  "nitori-nd60ul1-washer": [
    { label: "洗濯容量", value: "6kg" },
    { label: "乾燥容量", value: "なし（乾燥機能非搭載）" },
    { label: "最大の強み", value: "乾燥機能なしのシンプル設計・省スペースで一人暮らし向け" },
  ],
  "panasonic-na-sd10hbl-washer": [
    { label: "洗濯容量", value: "10kg" },
    { label: "乾燥容量", value: "5kg" },
    { label: "最大の強み", value: "温水泡洗浄と液体洗剤自動投入による手間軽減" },
  ],
  "sharp-es11k1-washer": [
    { label: "洗濯容量", value: "11kg" },
    { label: "乾燥容量", value: "6kg" },
    { label: "最大の強み", value: "無排気乾燥と自動お掃除、業界最高水準の静音・節水" },
  ],
  "toshiba-tw127xm4l-washer": [
    { label: "洗濯容量", value: "12kg" },
    { label: "乾燥容量", value: "7kg（業界トップクラス）" },
    { label: "最大の強み", value: "唯一のヒートポンプ乾燥による長期的な電気代の安さ" },
  ],
};

const faq = [
  {
    q: "ヒーター式とヒートポンプ式の乾燥、どちらを選べばいいですか？",
    a: "乾燥電気代を長期的に抑えたいならヒートポンプ式がおすすめです。ただし本体価格が高めになります。初期費用を抑えたい場合やコンパクトな設置スペースを優先する場合はヒーター式が現実的な選択肢になります。乾燥の頻度・家族の人数・設置環境を踏まえて判断するのがポイントです。",
  },
  {
    q: "乾燥機能が無い洗濯機（ニトリ ND60UL1）を選ぶメリットは何ですか？",
    a: "乾燥機能を省くことで本体をコンパクトにでき、洗濯専用モデルとして設置スペースを抑えやすくなります。部屋干しや除湿機・サーキュレーターとの組み合わせで乾燥をまかなえる方や、洗濯機能だけをシンプルに使いたい一人暮らしの方には有力な選択肢です。ただし乾燥までまとめて自動化したい方は、他の4台（ヒーター式・無排気式・ヒートポンプ式）を検討してください。",
  },
  {
    q: "シャープの無排気乾燥とは何ですか？賃貸でも使えますか？",
    a: "シャープ ES-11K1の無排気乾燥方式は、乾燥時に発生した湿気を室外に排気せず機内で処理する方式です。一般的なヒーター乾燥（排気式）では洗面所が蒸し暑くなりやすいのに対し、無排気方式では室内への湿気放出を抑えられます。賃貸・マンションで排気口の設置が難しい環境でも使いやすい点が特徴です。",
  },
  {
    q: "ドラム式洗濯機の防水パンのサイズ確認は何に注意すればいいですか？",
    a: "各機種のスペック表に記載されている「設置目安（防水パン奥行内寸）」と、ご自宅の防水パン内寸を事前に照合してください。搬入経路（廊下・ドア幅）の確認も必要です。機種ごとに本体奥行・ホース含む寸法が異なるため、購入前に必ずメーカー公式の設置寸法をご確認ください。",
  },
  {
    q: "東芝 ZABOON TW-127XM4Lのヒートポンプ乾燥はなぜ省エネなのですか？",
    a: "ヒートポンプ乾燥は、空気中の熱を利用して低温の温風で衣類を乾かす仕組みです。電熱ヒーターで高温の風を作るヒーター式に比べ、消費電力が少なくて済む傾向があります。東芝 TW-127XM4Lの公表値では洗濯〜乾燥時の消費電力量が約1330Wh（乾燥節電モードでは約720Wh）で、ヒーター式機種（一般的に1800〜2000Wh前後）より低い設計です。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "ドラム式洗濯乾燥機を低価格グループ（アイリス・ニトリ）と人気ブランドグループ（パナソニック・シャープ・東芝）の2グループに分けて比較。乾燥方式（ヒーター式・無排気式・ヒートポンプ式）の違いをわかりやすく解説します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-07-05",
  });
}

export default async function DrumWasherKoukaiPage() {
  const all = await getAllProducts();

  const lowPriceSlugs = ["iris-flk842-washer", "nitori-nd60ul1-washer"];
  const popularSlugs = [
    "panasonic-na-sd10hbl-washer",
    "sharp-es11k1-washer",
    "toshiba-tw127xm4l-washer",
  ];

  const lowPrice = lowPriceSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const popular = popularSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const allWashers = [...lowPrice, ...popular];
  const cv = allWashers[0];

  const compactItems = allWashers.map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  const dryMethodLabel: Record<string, string> = {
    "iris-flk842-washer":           "ヒーター乾燥",
    "nitori-nd60ul1-washer":        "乾燥機能なし・洗濯専用",
    "panasonic-na-sd10hbl-washer":   "ヒーター乾燥（排気式）",
    "sharp-es11k1-washer":           "無排気乾燥",
    "toshiba-tw127xm4l-washer":      "ヒートポンプ乾燥",
  };

  const haruContents: Record<string, ReactNode> = {
    "iris-flk842-washer": (
      <>
        <p className="mb-0.5 text-xs font-bold text-ink/60">▶ 店員さんに聞いた話</p>
        <p>
          「乾燥機能付きドラム式としては破格の安さです。温水ヒーターで皮脂汚れやニオイ対策に強く、
          この価格帯でここまで洗浄力があるのは珍しい」とのことでした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 見た印象・使い勝手</p>
        <p>
          コンパクトでシンプル・直線的なデザイン。操作パネルは物理ボタン中心で、
          タッチパネルほどの華やかさはありませんが、どのボタンで何が操作できるかが直感的に分かりやすく感じました。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 気になった点</p>
        <p>
          乾燥方式がヒーター式のため、ヒートポンプ式の上位機種と比べると
          <strong>乾燥1回あたりの電気代はやや高め</strong>になりやすい傾向があります。
          高温の温風で乾かす仕組みのため、衣類の縮み・傷みが出やすい点も長期目線では考慮しておくのが安心です。
          第三者の比較データでも「ヒーター式は衣類へのダメージがヒートポンプ式より大きい」という指摘があります。
        </p>
        <p className="mt-2">
          👉 初めてのドラム式・予算を抑えたい方の入門機として検討する価値がある1台です。
        </p>
      </>
    ),
    "nitori-nd60ul1-washer": (
      <>
        <p className="mb-0.5 text-xs font-bold text-ink/60">▶ 店員さんに聞いた話</p>
        <p>
          「乾燥機能をあえて省き、洗濯専用に機能を絞ったモデルです。ワンルームや一人暮らしの洗面所に置きやすいサイズ感で、
          『乾燥は部屋干しや除湿機でまかなえる』という方に選ばれています」とのことでした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 見た印象・使い勝手</p>
        <p>
          白を基調とした極めてシンプルなデザイン。ボタン類が少なく直感的に操作できます。
          洗濯容量6kgとコンパクトなので、一人暮らし向けの洗面所にもすっきり収まりそうな印象でした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 気になった点（正直に記載）</p>
        <p>
          そもそも<strong>乾燥機能が搭載されていない</strong>ため、洗濯後は部屋干しや別途の乾燥機・除湿機での乾燥が前提になります。
          洗濯容量も6kgのため、大人数分の洗濯物や毛布などの大物をまとめて洗うのには向きません。
        </p>
        <p className="mt-2">
          👉 洗濯機能だけでシンプルに使いたい一人暮らしの方、乾燥は別の方法で行いたい方に向いています。
        </p>
      </>
    ),
    "panasonic-na-sd10hbl-washer": (
      <>
        <p className="mb-0.5 text-xs font-bold text-ink/60">▶ 店員さんに聞いた話</p>
        <p>
          「パナソニックのドラム式は『温水泡洗浄』による洗浄力の高さと、
          空間になじむデザイン性が評価されています。毎日のお手入れのしやすさも考えられているモデルです」
          とのことでした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 見た印象・使い勝手</p>
        <p>
          扉がフラットで操作パネルも洗練されたデザイン。サニタリールームに置いたときに
          「家電っぽい主張」が薄く、スッキリして見えるのが印象的でした。
          本体高さが低めに設計されているため、設置時に圧迫感が少ない点もよいと感じました。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 気になった点</p>
        <p>
          乾燥は低温の大風量ヒーター乾燥（排気式）です。ヒートポンプ式と比べると電気代がかかりやすく、
          乾燥時に洗面所へ湿気が排気されるため、<strong>換気を意識した運用</strong>が必要です。
          柔軟剤は自動投入ではなく手動投入になる点も購入前に確認しておくとよいです。
        </p>
        <p className="mt-2">
          👉 デザイン・洗浄力・補充手間の軽減を重視する方に向いています。
        </p>
      </>
    ),
    "sharp-es11k1-washer": (
      <>
        <p className="mb-0.5 text-xs font-bold text-ink/60">▶ 店員さんに聞いた話</p>
        <p>
          「プラズマクラスター搭載で、水洗いできない衣類や槽内の除菌・消臭ができるのが強みです。
          独自センサーによる省エネ性能も高く、節水面でも業界最高水準の機種です」とのことでした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 見た印象・使い勝手</p>
        <p>
          ガラスドアを採用しており、電源を入れたときの高級感は5台の中でも際立って感じました。
          扉の開閉もスムーズで、ドラムが大口径なのでアクセスしやすい印象です。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 気になった点</p>
        <p>
          プラズマクラスターは制服・スーツ・ぬいぐるみなど「洗えないものの消臭・除菌」に便利な機能ですが、
          この機能を積極的に使わない方には<strong>オーバースペックに感じる可能性</strong>があります。
          乾燥方式はヒーター式のためヒートポンプ式よりは電気代が高め、という点は他のヒーター式機種と同様です。
        </p>
        <p className="mt-2">
          👉 マンション・賃貸で湿気を気にする方・消臭除菌にこだわる方に特に向いています。
        </p>
      </>
    ),
    "toshiba-tw127xm4l-washer": (
      <>
        <p className="mb-0.5 text-xs font-bold text-ink/60">▶ 店員さんに聞いた話</p>
        <p>
          「東芝といえば『抗菌ウルトラファインバブル洗浄』です。ナノサイズの泡で繊維の奥の汚れまで落とし、
          黄ばみ防止に効果的。振動吸収クッションを搭載しているため静音性にも定評があります」とのことでした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 見た印象・使い勝手</p>
        <p>
          12kgクラスだけあって本体の存在感・奥行きはそれなりにあります。
          大口径ドラムで毛布などの大物も出し入れしやすく、ファミリー向けの余裕を感じました。
          排水が3方向から選べる設計で、設置の自由度が高い点も好印象でした。
        </p>
        <p className="mt-3 mb-0.5 text-xs font-bold text-ink/60">▶ 気になった点</p>
        <p>
          大容量ゆえに<strong>設置スペースの事前確認が必須</strong>です。
          防水パン奥行内寸520mm以上・本体奥行722mm（ホース含む）・質量約88kgと重いため、
          搬入経路（廊下・ドア幅）も購入前に必ずメーカー公式の設置寸法と照合してください。
          本体価格も5台中もっとも高くなります。
        </p>
        <p className="mt-2">
          👉 乾燥電気代を長期的に抑えたい・大家族で洗濯量が多い方・完全自動化を目指す方に向いています。
        </p>
      </>
    ),
  };

  function ProductCard({ p }: { p: Product }) {
    const isNitori = p.slug === "nitori-nd60ul1-washer";
    return (
      <div className="rounded-2xl border border-ink/15 bg-white p-5 shadow-card">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
          {dryMethodLabel[p.slug] ?? "ドラム式"}
        </span>
        <h3 className="mt-2 text-base font-bold text-ink">{p.name}</h3>
        <ul className="mt-3 space-y-1 text-sm text-ink/75">
          {p.specs
            .filter((s) => s.label !== "特徴タグ" && s.value !== "")
            .map((s, i) => (
              <li key={i}>
                <span className="text-ink/50">{s.label}：</span>
                {s.value}
              </li>
            ))}
        </ul>

        <div className="mt-4 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
          <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
          <ul className="space-y-1 text-sm text-ink/80">
            {p.bestFor.map((x, i) => (
              <li key={i}>・{x}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 rounded-lg bg-ink/5 p-3">
          <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
          <ul className="space-y-0.5 text-xs text-ink/55">
            {p.notFor.map((x, i) => (
              <li key={i}>・{x}</li>
            ))}
          </ul>
        </div>

        {isNitori && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-ink/75">
            <p className="font-bold text-amber-700">⚠ 正直な注意点</p>
            <p className="mt-1">
              ND60UL1は<strong>乾燥機能を搭載していない洗濯専用モデル</strong>です。他の4台とは異なり「乾燥方式」の比較対象にはなりません。
              洗濯後の乾燥は部屋干し・除湿機・サーキュレーターなどと組み合わせる前提で検討してください。
            </p>
          </div>
        )}

        {haruContents[p.slug] && (
          <HaruBubble label="はるの店頭レポート">
            {haruContents[p.slug]}
          </HaruBubble>
        )}

        <AffiliateButtons aff={p.affiliate} />
      </div>
    );
  }

  return (
    <article className="prose-article max-w-none pb-20">
      {/* ── 構造化データ ── */}
      <JsonLd data={reviewJsonLd(cv, PATH, { includeReview: false })} />
      <JsonLd data={faqJsonLd(faq)} />
      {allWashers.map((p) => (
        <JsonLd key={p.slug} data={productJsonLd(p.name, p.brand)} />
      ))}

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "洗濯機", path: "/category/washer" },
          { name: "ドラム式洗濯機比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-07-05</p>

      {/* ── 結論ファースト：2グループ振り分け案内 ── */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          どちらのグループが自分に合う？
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            💰{" "}
            <strong>まず価格を抑えてドラム式を試したい・コスト重視</strong>
            　→{" "}
            <span className="text-accent">
              低価格グループ（アイリスオーヤマ FLK842 ／ ニトリ ND60UL1・乾燥機能なし）
            </span>
          </li>
          <li>
            ✨{" "}
            <strong>
              機能・静音・乾燥電気代にこだわりたい・長く使いたい
            </strong>
            　→{" "}
            <span className="text-accent">
              人気ブランドグループ（パナソニック／シャープ／東芝）
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-ink/55">
          ※「乾燥方式」によって長期の電気代・衣類へのやさしさが大きく変わります。下の比較表も参考にしてください。
        </p>
      </div>

      <p>
        ドラム式洗濯機はモデルによって価格・乾燥方式・機能が大きく異なります。
        この記事では<strong>低価格グループ2台</strong>と<strong>人気ブランドグループ3台</strong>に分けて、
        スペックと選び方のポイントを整理しました。
      </p>
      <p>
        スペックはメーカー公表値のみを記載しています。価格・在庫は時期によって変動するため、
        最新情報は各ストアでご確認ください。
      </p>

      {/* ── 乾燥方式の解説 ── */}
      <h2>乾燥方式の違いを知れば選択肢が絞れる</h2>
      <p>
        ドラム式洗濯乾燥機の「後悔しやすいポイント」として最もよく挙がるのが<strong>乾燥時の電気代</strong>です。
        乾燥方式によって電気代・衣類へのやさしさ・本体価格が変わるため、まず方式を理解してから機種を選ぶのが近道です。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">乾燥方式</th>
              <th className="p-3 text-ink">ヒーター式</th>
              <th className="p-3 text-ink">無排気乾燥式（シャープ独自）</th>
              <th className="p-3 text-ink">ヒートポンプ式</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">この記事での該当機種</td>
              <td className="p-3">アイリス・パナソニック</td>
              <td className="p-3">シャープ ES-11K1</td>
              <td className="p-3">東芝 TW-127XM4L</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">乾燥の電気代傾向</td>
              <td className="p-3">高め（電熱ヒーター使用）</td>
              <td className="p-3">高め（電熱ヒーター使用）</td>
              <td className="p-3">低め（空気の熱を利用）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">衣類へのやさしさ</td>
              <td className="p-3">高温のため繊維に負荷がかかりやすい</td>
              <td className="p-3">ヒーター使用だが風の設計で対策</td>
              <td className="p-3">低温乾燥で繊維にやさしい</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">室内への湿気</td>
              <td className="p-3">排気口から湿気が出る機種が多い</td>
              <td className="p-3">無排気で室内に湿気が出ない</td>
              <td className="p-3">機種による（要確認）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">本体価格の傾向</td>
              <td className="p-3">比較的手頃</td>
              <td className="p-3">中〜高価格帯</td>
              <td className="p-3">高価格帯</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※方式の一般的な傾向を示した比較表です。具体的なスペックは各メーカー公式ページでご確認ください。
          ニトリ ND60UL1は乾燥機能を搭載していないため、この比較には含まれません（洗濯専用モデル）。
        </p>
      </div>

      <p>
        <strong>ヒーター式</strong>は電熱で高温の風を作るため消費電力が大きい一方、本体価格が抑えられる傾向があります。
        パナソニック NA-SD10HBLは「低温の大風量」という設計でヒーター式ながら衣類へのダメージ軽減を意識した作りになっています。
      </p>
      <p>
        <strong>無排気乾燥式（シャープ ES-11K1）</strong>は、乾燥時の湿気を洗面所に出さない設計が最大の特徴です。
        マンション・賃貸で排気を気にしている方や、洗面所が蒸し暑くなるのを避けたい方に向いています。
      </p>
      <p>
        <strong>ヒートポンプ式（東芝 ZABOON TW-127XM4L）</strong>は、この記事で紹介する5台の中で唯一のヒートポンプ乾燥搭載機です。
        空気中の熱を使って低温で乾かすため、電気代・衣類へのやさしさの両面で優位性があります。
        ただし本体価格は高めになる傾向があります。
      </p>
      <p>
        なお、低価格グループの<strong>ニトリ ND60UL1</strong>は今回唯一乾燥機能を搭載していない「洗濯専用モデル」です。
        乾燥方式の比較には含まれませんが、洗濯機能に絞って価格・設置スペースを抑えたい方には検討の価値があります。
      </p>

      <h2>5台をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「低価格グループか人気ブランドグループか、乾燥方式は何を優先するか」を軸にしているため、おすすめバッジは表示していません。
        洗濯・乾燥容量はメーカー公表値です（ニトリ ND60UL1は乾燥機能非搭載のため「乾燥容量」は「なし」と記載）。詳しい仕様は各商品の見出し以降で解説します。
      </p>

      {/* ── 低価格グループ ── */}
      <h2>低価格グループ——まずコストを抑えてドラム式を導入したい方に</h2>
      <p>
        アイリスオーヤマは乾燥機能付き、ニトリは乾燥機能を省いた洗濯専用モデルと方向性は異なりますが、
        どちらも本体価格を抑えつつドラム式の使いやすさを取り入れられる2台です。
        <strong>洗濯をメインに使いつつドラム式の使いやすさを試してみたい</strong>方や、
        設置スペース・予算の都合でまず手が届く1台を選びたい方に向いています。
      </p>
      <div className="not-prose space-y-6">
        {lowPrice.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>

      {/* ── 人気ブランドグループ ── */}
      <h2>人気ブランドグループ——機能・乾燥性能・長期コストにこだわりたい方に</h2>
      <p>
        洗浄力・乾燥方式・省エネ性・自動化機能など、<strong>毎日の洗濯をより快適に・ラクにしたい方</strong>向けの3台です。
        本体価格は高価格帯になりますが、乾燥電気代の差・手入れの手間軽減・衣類へのやさしさなど、
        長期で見たときのメリットも大きくなります。
      </p>
      <div className="not-prose space-y-6">
        {popular.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>

      {/* ── まとめ ── */}
      <h2>まとめ：乾燥方式とグループで選択肢を絞るのが近道</h2>
      <p>
        ドラム式洗濯機を選ぶときは、まず「乾燥機能が必要かどうか」「乾燥をどのくらい使うか」「乾燥の電気代を長期的に気にするか」を確認するのがポイントです。
      </p>
      <ul>
        <li>
          <strong>価格重視・乾燥はたまに使う</strong>
          　→ アイリスオーヤマ FLK842（低価格・温水洗浄・Ag+抗菌）
        </li>
        <li>
          <strong>洗濯専用でシンプル・省スペース重視</strong>（乾燥機能は非搭載）
          　→ ニトリ ND60UL1
        </li>
        <li>
          <strong>液体洗剤自動投入・設置しやすさ・パナソニックブランド</strong>
          　→ パナソニック NA-SD10HBL
        </li>
        <li>
          <strong>マンション・賃貸で湿気・静音を重視</strong>
          　→ シャープ ES-11K1（無排気乾燥・超静音26dB）
        </li>
        <li>
          <strong>乾燥電気代を長期的に抑えたい・大容量・完全自動化</strong>
          　→ 東芝 ZABOON TW-127XM4L（ヒートポンプ・唯一の選択肢）
        </li>
      </ul>
      <p>
        設置スペース（防水パン奥行内寸）と搬入経路の確認は、購入前に必ずメーカー公式の設置寸法で照合してください。
      </p>

      {/* ── FAQ ── */}
      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="text-sm font-bold text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/75">A. {x.a}</p>
          </div>
        ))}
      </div>

      {/* ── あわせて読みたい ── */}
      <h2>あわせて読みたい——洗濯まわりの暮らしをもっとラクに</h2>
      <p>
        ドラム式洗濯機と合わせて、部屋干しをサポートする除湿機や
        エアコンとの組み合わせも検討すると、梅雨・冬の洗濯ストレスをまとめて解消しやすくなります。
      </p>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/joshitsuki-koukai" className="font-bold text-accent hover:underline">
            除湿機は後悔する？コンプレッサー式・デシカント式の違いと部屋干し向け4選
          </Link>
          （ドラム式と除湿機を併用して部屋干しを最速で乾かしたい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/senpuki-koukai" className="font-bold text-accent hover:underline">
            扇風機とサーキュレーターの違いは？主婦目線でおすすめ3台を比較
          </Link>
          （部屋干しの乾燥をサーキュレーターでさらに時短したい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/aircon-2027-koukai" className="font-bold text-accent hover:underline">
            エアコンは2027年問題で値上がり前に？工事費込みで安いうちに選ぶおすすめモデル
          </Link>
          （エアコンの除湿運転と除湿機・洗濯乾燥機の使い分けが気になる方に）
        </li>
      </ul>
    </article>
  );
}
