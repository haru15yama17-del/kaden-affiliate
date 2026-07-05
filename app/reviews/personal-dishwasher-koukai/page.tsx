import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import type { ReactNode } from "react";
import type { Product } from "@/data/types";

/** 各商品の構造化データ（price不明のためoffers含めない） */
function productJsonLd(name: string, brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: brand },
  };
}

const PATH = "/reviews/personal-dishwasher-koukai";
const TITLE =
  "工事不要のパーソナル食洗機を比較【2026年】パナソニックSOLOTAとサンコー ラクアmini colorはどちらを選ぶ？";

const featureTags: Record<string, string[]> = {
  "panasonic-np-tml1-solota-dishwasher": [
    "工事不要",
    "タンク式",
    "ストリーム除菌洗浄",
    "コンパクト設計",
  ],
  "sanko-rakua-mini-color-dishwasher": [
    "工事不要",
    "くすみカラー",
    "大容量収納",
    "ダブルノズル洗浄",
  ],
};

/** ざっくり比較表用に「対象人数・収納容量・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "panasonic-np-tml1-solota-dishwasher": [
    { label: "対象人数", value: "1人用" },
    { label: "収納容量", value: "食器点数6点（1人分）" },
    { label: "最大の強み", value: "大手メーカーの安心感・ストリーム除菌洗浄" },
  ],
  "sanko-rakua-mini-color-dishwasher": [
    { label: "対象人数", value: "1〜2人用" },
    { label: "収納容量", value: "11〜12点" },
    { label: "最大の強み", value: "収納力とくすみカラーのデザイン性" },
  ],
};

const editorialNotes: Record<string, ReactNode> = {
  "panasonic-np-tml1-solota-dishwasher": (
    <>
      <p>
        「A4ファイルサイズのスペースに置ける」が特徴の、パナソニック初のパーソナル食洗機です。
        奥行きはわずか22.5cmで、本当にファイルボックスのような薄さが最大の武器。
        前面・背面がクリア窓になっており、キッチンに置いても圧迫感が少ないのが魅力です。
        操作パネルはボタン1つのみとシンプルで、給水タンクは本体下部にあり引き出して注水するため、
        上から水を入れるタイプに比べて腕を高く上げる必要がなく楽に給水できます。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        食器点数は6点までと、文字通り「1人分の1食分」しか入りません。
        フライパンや小鍋、少し大きめの皿・どんぶりを入れるとそれだけで庫内がいっぱいになります。
        乾燥機能は送風のみのため、運転終了直後は水滴が残りやすい点も留意しておきたいところです。
      </p>
    </>
  ),
  "sanko-rakua-mini-color-dishwasher": (
    <>
      <p>
        サンコーの人気食洗機「ラクア」をコンパクトにした1〜2人用モデルです。
        colorシリーズはくすみカラー展開でインテリアに合わせやすく、
        SOLOTAよりは奥行きがあるぶん庫内が広く、どんぶりや大きめの皿も洗えます。
        給水は本体上部からピッチャーで注ぐタイプで、操作パネルは上部にあり、
        通常・強力・スピードなど複数の洗浄モードを選べます。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        食器12点まで入る余裕がある反面、本体上部から給水するため、
        設置場所が高いと水を注ぐ動作がやや負担になる場合があります。
        奥行きは約31.5cmあり、SOLOTAほどの薄さはありません。
      </p>
    </>
  ),
};

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "工事不要・タンク式のパーソナル食洗機2台、パナソニック SOLOTA NP-TML1とサンコー ラクアmini colorをスペックで比較。安心感・除菌を取るか、収納力・デザインを取るか、選び方のポイントを正直に解説します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-07-01",
  });
}

export default async function PersonalDishwasherKoukaiPage() {
  const all = await getAllProducts();
  const solota = all.find((p) => p.slug === "panasonic-np-tml1-solota-dishwasher")!;
  const rakua = all.find((p) => p.slug === "sanko-rakua-mini-color-dishwasher")!;
  const items = [solota, rakua];
  const cv = solota;
  const compactItems = items.map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  function ProductCard({ p }: { p: Product }) {
    return (
      <div className="rounded-2xl border border-ink/15 bg-white p-5 shadow-card">
        <div className="flex flex-wrap gap-1.5">
          {(featureTags[p.slug] ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-2 text-base font-bold text-ink">{p.name}</h3>
        <p className="mt-1 text-sm font-bold text-accent">{p.priceRange}</p>
        <ul className="mt-3 space-y-1 text-sm text-ink/75">
          {p.specs
            .filter((s) => s.value !== "")
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

        <div className="not-prose mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-bold text-ink/60">良い点</p>
            <ul className="space-y-1 text-sm text-ink/75">
              {p.pros.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold text-ink/60">気になる点</p>
            <ul className="space-y-1 text-sm text-ink/75">
              {p.cons.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
        </div>

        {editorialNotes[p.slug] && (
          <div className="mt-4 border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink/75">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink/40">編集部解説</p>
            {editorialNotes[p.slug]}
          </div>
        )}

        <div className="mt-4">
          <AffiliateButtons aff={p.affiliate} productName={p.name} />
        </div>
      </div>
    );
  }

  return (
    <article className="prose-article max-w-none pb-20">
      {/* ── 構造化データ ── */}
      <JsonLd data={reviewJsonLd(cv, PATH, { includeReview: false })} />
      {items.map((p) => (
        <JsonLd key={p.slug} data={productJsonLd(p.name, p.brand)} />
      ))}

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "調理家電", path: "/category/cooking" },
          { name: "パーソナル食洗機比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-07-01</p>

      {/* ── 結論ファースト：振り分け案内 ── */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          どちらが自分に合う？
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            🛡️ <strong>1人暮らしで安心感重視</strong>　→{" "}
            <span className="text-accent">パナソニック SOLOTA NP-TML1</span>
          </li>
          <li>
            🎨 <strong>1〜2人で容量とデザイン重視</strong>　→{" "}
            <span className="text-accent">サンコー ラクアmini color</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-ink/55">
          どちらも工事不要・タンク式で賃貸でも使えます。違いは下の比較で詳しく解説します。
        </p>
      </div>

      <h2>2台をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※優劣ではなく用途（1人用か1〜2人用か）で選ぶ記事のため、おすすめバッジは表示していません。
        詳しい仕様は各商品の見出し以降で解説します。
      </p>

      <p>
        パーソナル食洗機は分岐水栓の工事が不要な<strong>タンク式</strong>が主流ですが、モデルによって収納力・洗浄方式・デザインが異なります。
        この記事では、大手メーカーの安心感で選ぶなら<strong>パナソニック SOLOTA NP-TML1</strong>、収納力とデザインで選ぶなら<strong>サンコー ラクアmini color</strong>という2台を比較します。
      </p>
      <p>
        スペックはメーカー公表値のみを記載しています。価格・在庫は時期によって変動するため、最新情報は各ストアでご確認ください。
      </p>

      {/* ── 商品1：SOLOTA ── */}
      <h2>パナソニック SOLOTA NP-TML1</h2>
      <ProductCard p={solota} />

      {/* ── 商品2：ラクアmini color ── */}
      <h2>サンコー ラクアmini color</h2>
      <ProductCard p={rakua} />

      {/* ── 比較の軸 ── */}
      <h2>比較の軸：安心感か、収納力とデザインか</h2>
      <p>
        SOLOTAは大手メーカーならではの安心感と、50℃以上の高圧水流で洗う<strong>ストリーム除菌洗浄</strong>が強みです。
        1人分の食器点数にちょうど良いコンパクトさで、狭いキッチンにも置きやすいのが特長です。
      </p>
      <p>
        一方ラクアmini colorは<strong>11〜12点</strong>という収納力の多さと、くすみカラー展開によるインテリア性の高さが魅力です。
        価格もSOLOTAよりやや抑えめです。
      </p>
      <p>
        どちらも<strong>工事不要・タンク式</strong>で、分岐水栓が無い賃貸でも使える点は共通しています。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">比較項目</th>
              <th className="p-3 text-ink">SOLOTA NP-TML1</th>
              <th className="p-3 text-ink">ラクアmini color</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">標準収納容量</td>
              <td className="p-3">食器点数6点（1人分）</td>
              <td className="p-3">11〜12点</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">洗浄・除菌</td>
              <td className="p-3">ストリーム除菌洗浄（50℃以上の高圧水流）</td>
              <td className="p-3">ダブルノズル噴射式（上下から高温洗浄）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">デザイン</td>
              <td className="p-3">コンパクトなホワイト基調</td>
              <td className="p-3">くすみカラー展開でインテリア性が高い</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">価格帯</td>
              <td className="p-3">{solota.priceRange}</td>
              <td className="p-3">{rakua.priceRange}</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">工事の要否</td>
              <td className="p-3" colSpan={2}>
                どちらも工事不要・分岐水栓不要のタンク式
              </td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※方式の特長を中立にまとめた一覧です。詳細な仕様・最新情報は各メーカーの公式ページでご確認ください。
        </p>
      </div>

      <div className="not-prose my-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/75">
        <p className="font-bold text-amber-700">⚠ ラクアmini colorの正直な注意点</p>
        <p className="mt-1">
          収納力・デザインの魅力がある一方、洗浄+乾燥で合計約145分と時間がかかります。
          また使用水量約3.2Lを給水カップでタンクに注ぐ手間があり、SOLOTAのような自動給水ではありません。
          時間・手間よりも収納力とデザインを優先したい人向けの1台です。
        </p>
      </div>

      {/* ── まとめ ── */}
      <h2>まとめ：安心感のSOLOTA、収納力とデザインのラクアmini color</h2>
      <p>
        デザイン・省スペース（薄さ）・給水のしやすさを優先するなら<strong>SOLOTA NP-TML1</strong>、
        収納容量や温風乾燥・価格の手頃さを優先するなら<strong>ラクアmini color</strong>という選び分けになります。
        どちらも工事不要のタンク式なので、賃貸・ワンルームでも導入しやすい点は共通です。
      </p>
    </article>
  );
}
