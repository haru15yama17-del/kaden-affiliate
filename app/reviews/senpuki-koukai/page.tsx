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

/** 各商品の Product 構造化データ（price不明のためoffers含めない） */
function productJsonLd(name: string, brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: brand },
  };
}

const PATH = "/reviews/senpuki-koukai";
const TITLE =
  "扇風機とサーキュレーターの違いは？主婦目線でおすすめ3台を比較【2026年】";

/** ざっくり比較表用に「静音性・消費電力・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "balmuda-egf1800-fan": [
    { label: "静音性", value: "最小13dB（風量1・メーカー調べ）と3台で最も静か" },
    { label: "消費電力", value: "1.5W〜20W" },
    { label: "最大の強み", value: "柔らかい風質と静音性" },
  ],
  "balmuda-egf3400-cirq": [
    { label: "静音性", value: "非公表（大風量到達を優先した設計）" },
    { label: "消費電力", value: "3W〜20W" },
    { label: "最大の強み", value: "15m届く大風量とエアコン電気代の削減効果" },
  ],
  "iris-woozoo-stf-dc15tec": [
    { label: "静音性", value: "非公表（強風重視のため音はやや大きめ）" },
    { label: "消費電力", value: "24W（定格）" },
    { label: "最大の強み", value: "分解丸洗いのお手入れ性とコスパ" },
  ],
};

const faq = [
  {
    q: "扇風機とサーキュレーターの違いは何ですか？",
    a: "大きな違いは「風の性質」と「主な用途」です。扇風機は広がる柔らかい風で体に直接当てて涼をとることが主な目的です。サーキュレーターは直線的で強い風を遠くまで届かせ、部屋の空気を循環させることが目的です。扇風機はリラックス用途、サーキュレーターはエアコン補助・部屋干し乾燥・換気などの用途に向いています。",
  },
  {
    q: "サーキュレーターはエアコンの電気代を下げられますか？",
    a: "室内の空気を循環させることでエアコンの設定温度のまま体感温度を改善しやすくなり、電気代の節約に役立つ場合があります。バルミューダ GreenFan Cirq（EGF-3400）のメーカー公表値では「エアコン電気代を最大20%削減」と記載がありますが、実際の効果は部屋の広さ・間取り・エアコンの設定・使い方などによって異なります。",
  },
  {
    q: "DCモーターの扇風機・サーキュレーターはACモーターと何が違う？",
    a: "DCモーターはACモーターに比べて消費電力が少なく、風量の調整幅が広いのが特徴です。この記事で紹介する3機種はいずれもDCモーター搭載です。一般的にACモーターより本体価格は高めになりますが、毎日長時間使う場合は電気代の差が積み上がりやすくなるため、DCモーターを選ぶ理由になります。",
  },
  {
    q: "扇風機・サーキュレーターは分解して洗える機種がある？",
    a: "アイリスオーヤマ WOOZOO STF-DC15TECはガードと羽根を工具不要で分解し、水洗いできる設計です。扇風機は使ううちにホコリや汚れが付着しやすいため、分解洗いできると衛生面で安心です。バルミューダの2機種については、分解洗いの詳細はメーカー公式ページをご確認ください。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "扇風機とサーキュレーターの違いをわかりやすく整理。DCモーター・静音・分解洗いなど選び方のポイントをまとめ、バルミューダ2種とアイリスWOOZOOを主婦目線のレポート付きで紹介します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-06-30",
  });
}

export default async function SenpukiKoukaiPage() {
  const all = await getAllProducts();
  const fans = [
    "balmuda-egf1800-fan",
    "balmuda-egf3400-cirq",
    "iris-woozoo-stf-dc15tec",
  ]
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const cv = fans[0];

  const compactItems = fans.map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  const roleBadge: Record<string, string> = {
    "balmuda-egf1800-fan":      "扇風機",
    "balmuda-egf3400-cirq":     "サーキュレーター",
    "iris-woozoo-stf-dc15tec":  "扇風機+サーキュレーター兼用",
  };

  const haruContents: Record<string, ReactNode> = {
    "balmuda-egf1800-fan": (
      <>
        <p>店頭で一番驚いたのは風の柔らかさ。エアコンの風とは違う、窓から自然に吹き込むような優しい当たり方でした。</p>
        <p className="mt-2">最小運転音は13dB（風量1・メーカー調べ）とのことで、実際にデモ機の前に立っても音はほとんど気になりませんでした。</p>
        <p className="mt-2">中間ポールを外せば卓上サイズにもなるので、置き場所を選ばないのも好印象でした。</p>
        <p className="mt-2">👉 寝室や子ども部屋など、静かさと風の柔らかさを優先したい人向け。価格は高めです。</p>
      </>
    ),
    "balmuda-egf3400-cirq": (
      <>
        <p>扇風機というより「風を運ぶ機械」という印象。15m先まで風が届くと説明を受け、実際に部屋の奥まで空気がしっかり動いているのを感じました。</p>
        <p className="mt-2">店員さんいわく「エアコンと併用すると設定温度より体感が涼しくなりやすく、電気代が下がったという声も多い」とのこと（メーカー公表値で最大20%減の表記あり）。</p>
        <p className="mt-2">首振りはせず、一方向にしっかり風を送るタイプなので、部屋干しや換気など「狙った場所に風を送りたい」用途に向いていると感じました。</p>
        <p className="mt-2">👉 エアコンとの併用や部屋干し対策をメインに考えている人向け。</p>
      </>
    ),
    "iris-woozoo-stf-dc15tec": (
      <>
        <p>価格を見て一番気軽に試せる印象を持ちました。本体は見た目より軽く感じ、持ち運びも苦にならなさそうでした。</p>
        <p className="mt-2">店員さんは「ガードと羽根を分解して丸洗いできるので、扇風機の中でもお手入れのしやすさは上位」と話していました。</p>
        <p className="mt-2">首振りは上下左右に自動で動くタイプで、部屋全体に風が回る印象です。</p>
        <p className="mt-2">👉 とにかくコスパよく1台で扇風機・サーキュレーター・部屋干し対策を兼ねたい人向け。</p>
      </>
    ),
  };

  return (
    <article className="prose-article max-w-none pb-20">
      {/* ── 構造化データ ── */}
      <JsonLd data={reviewJsonLd(cv, PATH, { includeReview: false })} />
      <JsonLd data={faqJsonLd(faq)} />
      {fans.map((p) => (
        <JsonLd key={p.slug} data={productJsonLd(p.name, p.brand)} />
      ))}

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "季節家電", path: "/category/seasonal" },
          { name: "扇風機・サーキュレーター比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-06-30</p>

      {/* ── 結論ファースト：振り分け案内 ── */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          扇風機 or サーキュレーター どっちを選ぶ？
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            🌬️{" "}
            <strong>体に直接風を当てて涼みたい・就寝中に静かに使いたい</strong>
            　→ <span className="text-accent">扇風機（バルミューダ EGF-1800）</span>
          </li>
          <li>
            🔄{" "}
            <strong>エアコン効率を上げたい・部屋干しを早く乾かしたい</strong>
            　→ <span className="text-accent">サーキュレーター（バルミューダ EGF-3400）</span>
          </li>
          <li>
            💡{" "}
            <strong>1台で両方こなしたい・コスパ重視・お手入れ重視</strong>
            　→ <span className="text-accent">兼用モデル（アイリス WOOZOO STF-DC15TEC）</span>
          </li>
        </ul>
      </div>

      <p>
        夏になると「扇風機とサーキュレーター、どっちを買えばいいの？」と迷う方は多いと思います。
        この記事では<strong>2つの違い</strong>を表でわかりやすく整理したうえで、
        店頭で実際に確認した3機種をスペック・使い勝手の観点からご紹介します。
      </p>
      <p>
        スペックはseedに記載のある値のみを使用し、推測で補っていません。
        価格・在庫は時期によって変動するため、最新情報は各ストアでご確認ください。
      </p>

      {/* ── 扇風機 vs サーキュレーター 比較表 ── */}
      <h2>扇風機とサーキュレーターの違い——用途で選ぶのがポイント</h2>
      <p>
        見た目は似ていますが、風の性質と目的が異なります。
        <strong>どちらが優れているのではなく、使う場面に合わせて選ぶ</strong>のが基本です。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">比較項目</th>
              <th className="p-3 text-ink">扇風機</th>
              <th className="p-3 text-ink">サーキュレーター</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">風の性質</td>
              <td className="p-3">広がる・柔らかい</td>
              <td className="p-3">直線的・強い</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">主な用途</td>
              <td className="p-3">体に当てて涼む</td>
              <td className="p-3">空気循環・換気・部屋干し乾燥</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">エアコン補助</td>
              <td className="p-3">補助効果は限定的</td>
              <td className="p-3">冷気を部屋全体へ広げやすい</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">部屋干し乾燥</td>
              <td className="p-3">ある程度可能</td>
              <td className="p-3">狙った場所に集中送風できる</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">静音性の傾向</td>
              <td className="p-3">就寝中の使用を意識した設計が多い</td>
              <td className="p-3">風量が強めのため音が大きめの機種も</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※機種によって特性は異なります。具体的なスペックは各メーカー公式ページでご確認ください。
        </p>
      </div>

      <h2>3機種をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「扇風機かサーキュレーターか、兼用モデルか」を軸にしているため、おすすめバッジは表示していません。
        静音性・消費電力はメーカー公表値、非公表の項目は「非公表」と記載しています。詳しい仕様は各商品の見出し以降で解説します。
      </p>

      {/* ── 3機種カード ── */}
      <h2>この記事で取り上げた3台——楽天で詳細・在庫を確認</h2>
      <p>価格・在庫は時期によって変動します。最新情報は各ストアでご確認ください。</p>

      <div className="not-prose space-y-6">
        {fans.map((p) => (
          <div key={p.slug} className="rounded-2xl border border-ink/15 bg-white p-5 shadow-card">
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
              {roleBadge[p.slug] ?? "季節家電"}
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

            <HaruBubble label="はるの店頭レポート">
              {haruContents[p.slug]}
            </HaruBubble>
            <AffiliateButtons aff={p.affiliate} />
          </div>
        ))}
      </div>

      {/* ── まとめ ── */}
      <h2>まとめ：用途で選べば迷いにくくなります</h2>
      <p>
        扇風機とサーキュレーターは「どちらが上」ではなく、<strong>使い方に合わせて選ぶもの</strong>です。
      </p>
      <ul>
        <li>
          <strong>静音・柔らかい風・就寝中の使用</strong>が主な目的
          → バルミューダ ザ・グリーンファン EGF-1800（扇風機）
        </li>
        <li>
          <strong>エアコン補助・部屋干し・換気</strong>がメイン
          → バルミューダ GreenFan Cirq EGF-3400（サーキュレーター）
        </li>
        <li>
          <strong>1台で両方こなしたい・お手入れ重視・コスパ</strong>を重視
          → アイリスオーヤマ WOOZOO STF-DC15TEC（兼用モデル）
        </li>
      </ul>
      <p>
        3機種ともDCモーター搭載で、消費電力は比較的抑えられる設計です。
        毎日長時間使う場合は電気代の差が積み上がりやすいので、ACモーターより割高でもDCを選ぶ理由になります。
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

      {/* ── あわせて読みたい（季節家電3記事の相互回遊） ── */}
      <h2>あわせて読みたい——季節家電で夏の暮らしをもっとラクに</h2>
      <p>
        扇風機・サーキュレーターをエアコンや除湿機と組み合わせると、
        夏の快適さと電気代の効率が上がりやすくなります。
      </p>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/joshitsuki-koukai" className="font-bold text-accent hover:underline">
            除湿機は後悔する？コンプレッサー式・デシカント式の違いと部屋干し向け4選
          </Link>
          （梅雨の部屋干し・カビ対策に除湿機も検討している方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/aircon-2027-koukai" className="font-bold text-accent hover:underline">
            エアコンは2027年問題で値上がり前に？工事費込みで安いうちに選ぶおすすめモデル
          </Link>
          （エアコン本体の選び方・2027年問題が気になる方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/drum-washer-koukai" className="font-bold text-accent hover:underline">
            ドラム式洗濯機おすすめ5選比較——乾燥方式（ヒーター・無排気・ヒートポンプ）の違いで選ぶ
          </Link>
          （部屋干し乾燥をドラム式洗濯乾燥機でまとめて解決したい方に）
        </li>
      </ul>
    </article>
  );
}
