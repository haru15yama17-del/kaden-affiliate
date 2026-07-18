import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import type { Product } from "@/data/types";

/** 各商品の Product 構造化データ（offersは含めない） */
function productJsonLd(name: string, brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: brand },
  };
}

const PATH = "/reviews/futon-dryer-koukai";
const TITLE = "布団乾燥機は後悔する？カラリエFK-D2とcado FOEHN PROの違いを比較";

/** ざっくり比較表用に「タイプ・重量・最大消費電力」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "iris-fk-d2-futondryer": [
    { label: "タイプ", value: "据置きホース式（マットなし）" },
    { label: "重量", value: "約4kg" },
    { label: "最大消費電力", value: "約870W" },
  ],
  "cado-foehn-pro-futondryer": [
    { label: "タイプ", value: "スティック型（マットなし）" },
    { label: "重量", value: "約720g（電源コード除く）" },
    { label: "最大消費電力", value: "620W" },
  ],
};

const faq = [
  {
    q: "布団乾燥機の「ダニモード」はダニを完全に駆除できますか？",
    a: "「ダニモード」は温風でふとん内部の温度を上げる運転モードです。ダニの死滅・除去を保証するものではなく、効果は使用環境やふとんの状態によって異なります。過度な期待はせず、あくまで対策の一つとして捉えるのがおすすめです。",
  },
  {
    q: "カラリエFK-D2とcado FOEHN PROの一番大きな違いは何ですか？",
    a: "本体の形状です。FK-D2は本体からホースを伸ばしてノズルをふとんに入れる「据置きホース式」、FOEHN PROは本体（スティック）を直接ふとんに差し込む「スティック型」です。設置・収納の仕方が根本的に異なります。",
  },
  {
    q: "布団乾燥機は収納場所を取りますか？",
    a: "FK-D2は幅15×奥行27×高さ34.5cm（ホース折りたたみ時）・約4kg、FOEHN PROは直径5.4×高さ34.2cm・約720gです。収納スペースやクローゼットの奥行きに合わせて、購入前にサイズを確認しておくと安心です。",
  },
  {
    q: "どんな布団にも使えますか？",
    a: "cado FOEHN PROは、ふとんの耐熱温度が70℃以上であることの確認が必要とされています。低反発素材など機能性寝具をお使いの場合は、寝具メーカーへの確認が推奨されています。購入前にお使いの布団の耐熱表示をご確認ください。",
  },
  {
    q: "電気代はどのくらいかかりますか？",
    a: "最大消費電力はFK-D2が約870W、FOEHN PROが620Wです（メーカー公表値）。実際の電気代は運転時間やご契約の電力料金単価によって異なるため、断定はできません。消費電力の数値をもとにご自身でご確認ください。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "アイリスオーヤマ カラリエFK-D2（据置きホース式）とcado FOEHN PRO（スティック型）を徹底比較。布団乾燥機で後悔しやすい5つのポイントと、それぞれが向いている人を編集部が解説します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-07-19",
  });
}

export default async function FutonDryerKoukaiPage() {
  const all = await getAllProducts();
  const karari = all.find((p) => p.slug === "iris-fk-d2-futondryer")!;
  const cado = all.find((p) => p.slug === "cado-foehn-pro-futondryer")!;
  const items = [karari, cado];

  const compactItems = items.map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  function ProductCard({ p }: { p: Product }) {
    return (
      <div className="rounded-2xl border border-ink/15 bg-white p-5 shadow-card">
        <h3 className="text-base font-bold text-ink">{p.name}</h3>
        <ul className="mt-3 space-y-1 text-sm text-ink/75">
          {p.specs.map((s, i) => (
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

        <div className="mt-4 border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink/75">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink/40">編集部解説</p>
          <div className="not-prose space-y-2">
            <div>
              <p className="mb-1 text-xs font-bold text-ink/60">良い点</p>
              <ul className="space-y-1">
                {p.pros.map((x, i) => (
                  <li key={i}>・{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-ink/60">気になる点</p>
              <ul className="space-y-1">
                {p.cons.map((x, i) => (
                  <li key={i}>・{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <AffiliateButtons aff={p.affiliate} productName={p.name} />
        </div>
      </div>
    );
  }

  return (
    <article className="prose-article max-w-none pb-20">
      {/* ── 構造化データ ── */}
      <JsonLd data={reviewJsonLd(karari, PATH, { includeReview: false })} />
      <JsonLd data={productJsonLd(cado.name, cado.brand)} />
      <JsonLd data={faqJsonLd(faq)} />

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "季節家電", path: "/category/seasonal" },
          { name: "布団乾燥機は後悔する？", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-07-19</p>

      <p>
        「思ったほど乾かなかった」「毎回セットするのが面倒」「置き場所に困って結局使わなくなった」——布団乾燥機は買ってよかったという声も多い一方で、こうした後悔の声も見かけます。
      </p>
      <p>
        この記事では、据置きホース式の<strong>アイリスオーヤマ カラリエ FK-D2</strong>と、スティック型の<strong>cado FOEHN PRO</strong>を例に、後悔しやすいポイントと、2つのタイプの根本的な違いを整理します。
      </p>

      <h2>布団乾燥機で後悔しやすい5つのポイント</h2>
      <p>購入前に知っておくと後悔しにくくなるポイントを5つにまとめました。</p>

      <h3>① 収納場所を考えずに買う</h3>
      <p>
        据置きホース式・スティック型どちらも、想像より収納スペースを取ることがあります。
        FK-D2は幅15×奥行27×高さ34.5cm（ホース折りたたみ時）・約4kg、FOEHN PROは直径5.4×高さ34.2cm・約720gです。
        <strong>クローゼットや押し入れの奥行き・高さ</strong>を先に確認しておくと安心です。
      </p>

      <h3>② ホースの届く範囲</h3>
      <p>
        FK-D2はホース長800mmの据置きホース式のため、<strong>本体を置く位置とふとんまでの距離</strong>を事前にイメージしておく必要があります。
        一方、FOEHN PROはスティック型で本体を直接ふとんに差し込むため、ホースの取り回しを考える必要はありません。
      </p>

      <h3>③ マット式とマットなし式の違い</h3>
      <p>
        布団乾燥機には、ふとんの間に敷く「マット式」と、ホースやスティックを差し込むだけの「マットなし式」があります。
        今回比較するFK-D2・FOEHN PROは<strong>どちらもマットなし式</strong>で、マットの敷き直しは不要です。
        マットなし式は準備が手早い一方、マット式に比べて温風の広がり方が異なるため、乾かしたい範囲や使い方に合わせて選ぶのがポイントです。
      </p>

      <h3>④ ダニ対策の考え方</h3>
      <p>
        FK-D2・FOEHN PROともに「ダニ」を意識した運転モード（コース）を備えています。
        ただしこれらは<strong>温風でふとん内部の温度を上げる運転モード</strong>であり、ダニの死滅・除去を保証するものではありません。
        効果は使用環境やふとんの状態によって異なるため、過度な期待はせず対策の一つとして考えるのがおすすめです。
      </p>

      <h3>⑤ 電気代と運転時間</h3>
      <p>
        最大消費電力はFK-D2が約870W、FOEHN PROが620Wです（メーカー公表値）。
        運転コースの長さも、FK-D2はタイマー15〜180分、FOEHN PROは送風120分・乾燥/ダニ対策80分・あたため10分と異なります。
        実際の電気代は運転時間とご契約の電力料金単価によって変わるため、<strong>消費電力の数値をもとにご自身で確認</strong>することをおすすめします。
      </p>

      <h2>カラリエFK-D2とcado FOEHN PROの違い</h2>
      <p>
        2機種の根本的な違いは<strong>「据置きホース式」か「スティック型」か</strong>という本体の形状です。
      </p>
      <p>
        FK-D2は本体を布団のそばに置き、ホースの先のノズルをふとんに入れて温風を送るタイプです。
        ノズルハンガーが付属しており、衣類乾燥やスポット暖房にも転用できる汎用性があります。
        安全装置として温度センサー・サーモスタット・温度ヒューズを備えています。
      </p>
      <p>
        一方FOEHN PROは、スティック状の本体を直接ふとんに差し込んで使うタイプです。
        重量は約720g（電源コード除く）と非常に軽く、ホースがないぶん収納・持ち運びがしやすいのが特徴です。
        メーカーは従来機FOEHN 001比で風量が約50%向上（急速モード）、運転音が約36%減（SONE値比較）と公表しています。
        安全装置として温度過昇防止装置（サーモスタット・温度ヒューズ・サーミスタ）を備えています。
        なお、ふとんの耐熱温度が70℃以上であることの確認が必要で、機能性寝具は寝具メーカーへの確認が推奨されています。
      </p>

      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「据置きホース式かスティック型か」を軸にしているため、おすすめバッジは表示していません。
        スペックはメーカー公表値です。詳しい仕様は各商品の見出し以降で解説します。
      </p>

      <h2>カラリエFK-D2が向いている人</h2>
      <ProductCard p={karari} />

      <h2>cado FOEHN PROが向いている人</h2>
      <ProductCard p={cado} />

      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
          </div>
        ))}
      </div>

      <h2>まとめ：形状と使い方の違いで選ぶ</h2>
      <p>
        カラリエFK-D2とFOEHN PROはどちらも「マットなし式」ですが、
        <strong>据置きホース式かスティック型か</strong>で使い勝手が大きく変わります。
      </p>
      <ul>
        <li><strong>衣類乾燥やスポット暖房にも使いたい・自動モードの多さを重視する</strong>ならカラリエFK-D2</li>
        <li><strong>とにかく軽さ・収納のしやすさ・運転音の静かさを重視する</strong>ならcado FOEHN PRO</li>
      </ul>
      <p>
        いずれもダニ対策モードは死滅・除去を保証するものではないため、過度な期待をせず、ご自宅の収納スペースやふとんの耐熱表示を確認したうえで選ぶと後悔しにくくなります。
      </p>
    </article>
  );
}
