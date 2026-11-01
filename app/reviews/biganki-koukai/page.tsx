import { GuideSchema } from "@/components/GuideSchema";
import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import type { ReactNode } from "react";
import type { Product } from "@/data/types";

/** 各商品の構造化データ（price不明のためoffers含めない／aggregateRatingは付けない） */
function productJsonLd(name: string, brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: brand },
  };
}

const PATH = "/reviews/biganki-koukai";
const TITLE =
  "美顔器は後悔する？トリアFRXとRe・De Suhadaのデメリットと選び方";

const featureTags: Record<string, string[]> = {
  "tria-frx-beautydevice": ["フラクショナルレーザー方式", "顔専用", "USB-C充電", "1年保証"],
  "rede-suhada-fm01a": ["EMS", "LED（赤・青）", "温熱・振動", "約50g"],
};

/** 方式が異なるため、出力・波長など表記基準の違う数値は載せない。公式で確認できない項目は空欄 */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "tria-frx-beautydevice": [
    { label: "方式", value: "フラクショナルレーザー" },
    { label: "使用部位", value: "顔専用" },
    { label: "本体質量", value: "" },
    { label: "保証", value: "1年保証" },
  ],
  "rede-suhada-fm01a": [
    { label: "方式", value: "EMS・LED・振動・温熱" },
    { label: "使用部位", value: "顔〜首（のど・まぶた等は不可）" },
    { label: "本体質量", value: "約50g" },
    { label: "保証", value: "" },
  ],
};

const editorialNotes: Record<string, ReactNode> = {
  "tria-frx-beautydevice": (
    <>
      <p>
        トリア FRXは、メーカーが「フラクショナルレーザー」方式の家庭用美顔器として案内している製品です。
        メーカーは、使用者を対象とした調査で肌のトーンや質感の変化を実感した人がいたと公表しています（効果には個人差があります）。
        また、メーカーは「アメリカFDA認可」と公表しています。これはアメリカでの認可についての表記で、日本国内での効能効果を示すものではありません。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        購入価格は要確認（時期により変動）です。公式サイトで最新の購入条件を確認してください。
        メーカー案内の使い方は「まず12週間・週5回使い、4週間休む」というサイクルのため、続ける前提で検討するのがおすすめです。
        使用時は「温かくピリピリとした感覚がある」とメーカーが案内しており、水ぶくれ・痛み・かさぶたなどの反応が出た場合はすぐに使用を中止するよう案内されています。
      </p>
    </>
  ),
  "rede-suhada-fm01a": (
    <>
      <p>
        Re・De Suhada（型名FM01A）は、EMS・LED（赤・青）・振動・温熱を搭載したスティック型の美顔器です。
        メーカーは「独自の周波数で動かしづらい筋肉を刺激し、気になる部分をリフトケアする」と説明しています。
        なお、公式の注釈ではここでの「リフトケア」は「肌を引き上げるように機器を動かすこと」を指しています。
        本体質量は約50gで、コスメポーチに収まるサイズとメーカーが案内しています。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        公式サイトによると、使える部位が限られ、のど・粘膜・まぶたには使用できません。
        防水構造ではないため浴室など湿気の多い場所での使用・保管は避ける必要があり、メイクを落として化粧水などで肌を整えた状態で使うよう案内されています。
        Lift care RED/BLUEの使用時に歯へ刺激を感じる場合があるとされ、歯に詰め物がある人は注意が必要です。
      </p>
    </>
  ),
};

export async function generateMetadata() {
  return buildMetadata({
    title: TITLE,
    description:
      "トリア FRX（フラクショナルレーザー）とRe・De Suhada（EMS・LED・温熱）の2台を、方式・価格・使用条件・デメリットで比較。メーカー公式サイトで確認できた情報のみをもとに、向き不向きと選び方を編集部が解説します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-11-01",
  });
}

export default async function BigankiKoukaiPage() {
  const all = await getAllProducts();
  const tria = all.find((p) => p.slug === "tria-frx-beautydevice")!;
  const rede = all.find((p) => p.slug === "rede-suhada-fm01a")!;
  const items = [tria, rede];
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
            <p className="mb-1 text-xs font-bold text-ink/60">気になる点（デメリット）</p>
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
      <GuideSchema title={TITLE} path={PATH} modified="2026-11-01" />
      {/* ── 構造化データ（aggregateRatingは付けない） ── */}
      <JsonLd data={reviewJsonLd(tria, PATH, { includeReview: false })} />
      {items.map((p) => (
        <JsonLd key={p.slug} data={productJsonLd(p.name, p.brand)} />
      ))}

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "美容家電", path: "/category/beauty" },
          { name: "美顔器比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-11-01</p>
      <p className="text-xs text-ink/55">修正履歴：2026-11-01 固定の価格表示を最新条件の確認案内へ変更。使用体験・店頭での記録は保持しています。</p>

      {/* ── 結論ファースト：優先度別の振り分け案内 ── */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          優先度で選ぶなら
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            💴 <strong>まずは手の届きやすい価格・軽さで始めたい</strong>　→{" "}
            <span className="text-accent">Re・De Suhada</span>
          </li>
          <li>
            🔬 <strong>初期費用がかかっても、レーザー方式のケアを検討したい</strong>　→{" "}
            <span className="text-accent">トリア FRX</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-ink/55">
          価格は時期・ストアにより変動します。購入前に必ず公式サイトで最新の価格・在庫・使用条件をご確認ください。
        </p>
      </div>

      <h2>2台をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※この記事は優劣ではなく「どちらが自分の優先順位に合うか」を軸にしているため、おすすめバッジは表示していません。
        空欄は、公式サイトで記載を確認できなかった項目です。
        2台は方式が異なる（FRXはレーザー、SuhadaはEMS・LED・温熱）ため、出力や波長などの数値は表記基準が揃わず、比較していません。
      </p>

      <p>
        美顔器は「買ったあとに使わなくなった」「思っていた使い方と違った」と後悔しやすい家電です。
        この記事では、方式も価格帯も異なる<strong>トリア FRX</strong>と<strong>Re・De Suhada</strong>の2台について、
        メーカー公式サイトで確認できた事実をもとに、デメリットと選び方を整理します。
      </p>
      <p>
        掲載内容は公式サイトの記載に基づく編集部の解説であり、実機を使った体験談ではありません。
        効果や感じ方には個人差があり、効果を保証するものではありません。
        肌の状態に不安がある場合は、使用前に医師などの専門家へご相談ください。
      </p>

      {/* ── 商品1：トリア ── */}
      <h2>トリア 美顔器 FRX</h2>
      <ProductCard p={tria} />

      <h3>トリア FRXの使い方（メーカー案内）</h3>
      <p>
        公式サイトの案内では、まず腕の外側でテストしてから顔に使用します。
        使用ペースは「12週間・週に5回」を目安とし、その後4週間休むサイクルを繰り返すとされています。
        顔専用で、18歳未満の使用は認められていません。
        妊娠中、専門的な美容治療を受けている最中、重篤な持病や服薬中の場合は医師へ相談するよう案内されています。
        また、アートメイク・タトゥー・傷や感染のある部位には使用できません。
      </p>

      {/* ── 商品2：Re・De ── */}
      <h2>Re・De Suhada スティック美顔器（FM01A）</h2>
      <ProductCard p={rede} />

      <h3>Re・De Suhadaの使い方（メーカー案内）</h3>
      <p>
        公式サイトの案内では、メイク落としと洗顔のあと、お手持ちの化粧水で肌を整えてから使用します。
        強さとモードは2つのボタンで切り替え、モードは「Lift care RED」「Lift care BLUE」「Daily care」の3つです。
        EMSのレベルは3段階で、Daily careはEMSなしのモードです。約5分で自動的に電源が切れます。
        肌に傷・湿疹・はれもの・炎症がある場合や、日焼け直後などは使用を避けるよう案内されています。
      </p>

      {/* ── 比較の軸 ── */}
      <h2>選び方の軸：方式・価格・使い続けやすさ</h2>
      <p>
        <strong>方式：</strong>
        FRXはフラクショナルレーザー、SuhadaはEMS・LED・振動・温熱を組み合わせたタイプです。
        同じ「美顔器」でも仕組みも使い方もまったく別物なので、スペックの数値だけで優劣はつけられません。
      </p>
      <p>
        <strong>価格：</strong>
        両商品の価格は要確認（時期により変動）です。
        定期契約などを選ぶ場合は、支払総額・契約期間・解約条件も公式サイトで確認してください。
        予算に合わせて選べますが、安さだけでなく使用条件や続けやすさも合わせて検討してください。
      </p>
      <p>
        <strong>続けやすさ：</strong>
        FRXは「週5回×12週間＋4週間の休止」というサイクルが案内されており、継続する時間を確保できるかが後悔しないポイントです。
        Suhadaは軽量で持ち運びやすいものの、使える部位・場所（防水ではない）・メイクの有無といった条件があります。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">比較項目</th>
              <th className="p-3 text-ink">トリア FRX</th>
              <th className="p-3 text-ink">Re・De Suhada</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">公式サイト表示価格</td>
              <td className="p-3">要確認（時期により変動）</td>
              <td className="p-3">要確認（時期により変動）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">方式</td>
              <td className="p-3">フラクショナルレーザー</td>
              <td className="p-3">EMS・LED（赤・青）・振動・温熱</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">使用部位</td>
              <td className="p-3">顔専用</td>
              <td className="p-3">顔〜首（のど・粘膜・まぶたは不可）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">本体質量</td>
              <td className="p-3"></td>
              <td className="p-3">約50g</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">保証</td>
              <td className="p-3">1年保証</td>
              <td className="p-3"></td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">メーカー案内の使用ペース</td>
              <td className="p-3">12週間・週5回→4週間休止の繰り返し</td>
              <td className="p-3"></td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※メーカー公式サイトの記載をもとにした表です。空欄は記載を確認できなかった項目です。
          ※FRXの価格は、公式サイトで税込の明記を確認できていません。
          方式が異なるため、出力・波長などの数値は比較していません。最新情報は必ず公式サイトでご確認ください。
        </p>
      </div>

      <div className="not-prose my-5 rounded-xl border border-accent/25 bg-blush/40 p-4 text-sm text-ink/75">
        <p className="font-bold text-accent">2台は「別の選択肢」</p>
        <p className="mt-1">
          レーザー方式でじっくり続けるFRXと、軽量で気軽に使えるSuhada。
          どちらが上というより、予算・継続できる時間・使いたい部位で選び分ける2台です。
        </p>
      </div>

      {/* ── まとめ ── */}
      <h2>まとめ：予算と続けやすさから逆算して選ぶ</h2>
      <p>
        初期費用がかかっても、12週間単位でじっくり続けられるならレーザー方式の<strong>トリア FRX</strong>、
        まずは価格を抑えて軽く始めたいなら<strong>Re・De Suhada</strong>という選び分けになります。
        どちらも使用できない条件・部位が公式に示されているため、購入前に必ず公式サイトで最新の条件と価格をご確認ください。
      </p>

      {/* ── あわせて読みたい ── */}
      <h2>あわせて読みたい——毎日のセルフケアをもっとラクに</h2>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/hairdryer-koukai" className="font-bold text-accent hover:underline">
            ヘアドライヤーおすすめ5台を比較
          </Link>
          （毎日のヘアケア家電も見直したい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/category/beauty" className="font-bold text-accent hover:underline">
            美容家電の記事一覧
          </Link>
          （ほかの美容家電もまとめてチェックしたい方に）
        </li>
      </ul>
    </article>
  );
}
