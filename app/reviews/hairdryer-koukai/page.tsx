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

const PATH = "/reviews/hairdryer-koukai";
const TITLE =
  "ヘアドライヤーおすすめ4台を比較【2026年】KINUJO KH301とKH302の違いも解説";

const featureTags: Record<string, string[]> = {
  "brighte-shower-dryer": ["ナノミスト", "美容液成分配合", "大風量", "速乾"],
  "refa-beautech-dryer-splus": ["センシングプログラム", "自動温度調整", "コンパクト", "速乾"],
  "kinujo-kh301-dryer": ["超遠赤外線", "超軽量", "大風量", "折りたたみ可"],
  "panasonic-eh-na0k-dryer": ["高浸透ナノイー", "大風量", "速乾", "小型軽量化"],
};

/** ざっくり比較表用に「風量・重量・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "brighte-shower-dryer": [
    { label: "風量", value: "2.58㎥/分" },
    { label: "重量", value: "約357g" },
    { label: "最大の強み", value: "ナノミスト美容液成分" },
  ],
  "refa-beautech-dryer-splus": [
    { label: "風量", value: "非公表" },
    { label: "重量", value: "非公表" },
    { label: "最大の強み", value: "センシングプログラム自動温度調整" },
  ],
  "kinujo-kh301-dryer": [
    { label: "風量", value: "2.2㎥/分" },
    { label: "重量", value: "約348g" },
    { label: "最大の強み", value: "超遠赤外線・軽量・折りたたみ可" },
  ],
  "panasonic-eh-na0k-dryer": [
    { label: "風量", value: "1.6㎥/分" },
    { label: "重量", value: "約560g" },
    { label: "最大の強み", value: "高浸透ナノイー・実績No.1" },
  ],
};

const editorialNotes: Record<string, ReactNode> = {
  "brighte-shower-dryer": (
    <>
      <p>
        「ナノミスト」の名の通り、1μm以下に微粒子化した美容液成分を温風とともに噴射しながら乾かせるのが最大の特徴です。
        ブーストアタッチメント装着時（強）で2.58㎥/分という大風量も備えており、美容ケアと速乾を両立させたいコンセプトのドライヤーです。
        グラフェンによる遠赤外線効果も謳われています。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        4商品の中でもっとも価格帯が高く（約3.2万〜3.6万円）、本体重量も約357gとミスト機構を積んでいる分、
        シンプルなドライヤーよりやや重めです。ナノミスト機能を使いこなしたい人向けの1台と言えます。
      </p>
    </>
  ),
  "refa-beautech-dryer-splus": (
    <>
      <p>
        「センシングプログラム」により、頭皮アンダー50℃・毛先アンダー60℃を目指して温風と冷風を自動で切り替える設計が特徴です。
        ハイドロイオン発生量は従来品から30%アップしているとされ、ワンタッチで使えるクールボタンも搭載しています。
        2024年10月16日発売のモデルです。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        4商品の中で唯一、風量の具体的な数値（㎥/分）が公表されていません。
        また海外対応（マルチボルテージ）ではないため、海外旅行に持って行きたい人は注意が必要です。
      </p>
    </>
  ),
  "kinujo-kh301-dryer": (
    <>
      <p>
        「超遠赤外線」を発生させる特殊天然鉱石を採用し、髪の内部から熱を生み出す設計がコンセプトのモデルです。
        GLOSS/SCULP/SWINGの3モードとマイナスイオンを搭載し、約348gという4商品中もっとも軽い本体重量と
        折りたたみ機構により、携帯性を重視したい人に向いています。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        ナノミストや美容液成分配合といった特殊なケア機能は無く、乾燥・速乾に特化したシンプル設計です。
        ミスト系の美容ケアを求める場合は他の選択肢を検討してください。
      </p>
    </>
  ),
  "panasonic-eh-na0k-dryer": (
    <>
      <p>
        高浸透ナノイーを搭載した、パナソニックの定番ヘアドライヤーです。
        大風量で速乾性が高く、前モデルより小型・軽量化されている点も特長です。
        4商品の中では発売から一定期間が経ち、実績・口コミの蓄積がある安心感のあるモデルです。
      </p>
      <p className="mt-2">
        <strong>気になる点：</strong>
        固定ノズルで折りたためないため携帯には不向きです。また長期耐久性について一部口コミで指摘があります。
      </p>
    </>
  ),
};

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "ブライト シャワードライヤー、ReFa ビューテック ドライヤー S+、KINUJO 絹女KH301/KH302、パナソニック ナノケア EH-NA0Kの4台を風量・重量・価格帯で比較。KH301とKH302の違い（カラー違い）や、悩み・優先度別の選び方も解説します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-07-01",
  });
}

export default async function HairdryerKoukaiPage() {
  const all = await getAllProducts();
  const brighte = all.find((p) => p.slug === "brighte-shower-dryer")!;
  const refa = all.find((p) => p.slug === "refa-beautech-dryer-splus")!;
  const kinujo = all.find((p) => p.slug === "kinujo-kh301-dryer")!;
  const naZeroK = all.find((p) => p.slug === "panasonic-eh-na0k-dryer")!;
  const items = [brighte, refa, kinujo, naZeroK];
  const cv = brighte;
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
          { name: "パーソナルケア", path: "/category/personal-care" },
          { name: "ヘアドライヤー比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-07-01</p>

      {/* ── 結論ファースト：悩み・優先度別の振り分け案内 ── */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          悩み・優先度で選ぶなら
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            💧 <strong>髪のダメージケア・美容液成分も欲しい</strong>　→{" "}
            <span className="text-accent">ブライト シャワードライヤー</span>
          </li>
          <li>
            🌡️ <strong>熱ダメージを抑えて自動で温度管理したい</strong>　→{" "}
            <span className="text-accent">ReFa ビューテック ドライヤー S+</span>
          </li>
          <li>
            🪶 <strong>とにかく軽さ・携帯性重視</strong>　→{" "}
            <span className="text-accent">KINUJO 絹女 KH301/KH302</span>
          </li>
          <li>
            🛡️ <strong>定番の安心感・コスパ重視</strong>　→{" "}
            <span className="text-accent">パナソニック ナノケア EH-NA0K</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-ink/55">
          4台とも1〜2万円台の入門機ではなく、3万円前後の本格派モデルです。違いは下の比較で詳しく解説します。
        </p>
      </div>

      <h2>4台をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※この記事は「優劣」ではなく「悩み・優先度別にどれを選ぶか」を軸にしているため、おすすめバッジは表示していません。
        風量・重量はメーカー公表値、非公表の項目は「非公表」と記載しています。詳しい仕様は各商品の見出し以降で解説します。
      </p>

      <p>
        ヘアドライヤーは風量・重量・機能によって毎日の使い心地が大きく変わります。
        この記事では、美容液成分を配合した<strong>ブライト シャワードライヤー</strong>、
        自動温度管理が特徴の<strong>ReFa ビューテック ドライヤー S+</strong>、
        軽さと携帯性に優れた<strong>KINUJO 絹女</strong>、
        定番の安心感がある<strong>パナソニック ナノケア EH-NA0K</strong>の4台を比較します。
      </p>
      <p>
        スペックはメーカー公表値のみを記載しています。価格・在庫は時期によって変動するため、最新情報は各ストアでご確認ください。
      </p>

      {/* ── 商品1：ブライト ── */}
      <h2>ブライト シャワードライヤー BRT-SD173</h2>
      <ProductCard p={brighte} />

      {/* ── 商品2：ReFa ── */}
      <h2>ReFa ビューテック ドライヤー S+</h2>
      <ProductCard p={refa} />

      {/* ── 商品3：KINUJO ── */}
      <h2>KINUJO ヘアドライヤー 絹女 KH301/KH302</h2>
      <ProductCard p={kinujo} />

      <h3>KH301とKH302の違いは？</h3>
      <p>
        KH301（ホワイト）とKH302（モカ）は<strong>カラーが異なるだけ</strong>で、風量・重量・モード構成などのスペックは同一です。性能に差はないため、インテリアや好みに合わせてカラーを選んで問題ありません。
      </p>

      {/* ── 商品4：パナソニック ── */}
      <h2>パナソニック ヘアードライヤー ナノケア EH-NA0K</h2>
      <ProductCard p={naZeroK} />

      {/* ── 比較の軸 ── */}
      <h2>比較の軸：風量・重量・価格帯</h2>
      <p>
        風量で比較すると、ブライト（2.58㎥/分・ブーストアタッチメント装着時）がもっとも大きく、
        次いでKINUJO（2.2㎥/分）、パナソニック EH-NA0K（1.6㎥/分）の順です。
        ReFa S+は風量の具体的な数値を公表していません。
      </p>
      <p>
        重量比較ではKINUJO（約348g）とブライト（約357g）が軽量級で、
        特にKINUJOは折りたたみ機構も備えているため携帯性を重視するなら有力候補です。
        EH-NA0Kは約560gとやや重めで、固定ノズルのため持ち運びには不向きです。
      </p>
      <p>
        価格帯はEH-NA0K（3万〜4万円）が下限価格でもっとも手頃な水準に位置し、
        他の3商品（ブライト約3.2万〜3.6万円、KINUJO約3.1万〜3.5万円、ReFa 39,600円）は
        いずれも3万円台後半に近い価格帯です。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">比較項目</th>
              <th className="p-3 text-ink">ブライト</th>
              <th className="p-3 text-ink">ReFa S+</th>
              <th className="p-3 text-ink">KINUJO</th>
              <th className="p-3 text-ink">EH-NA0K</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">風量</td>
              <td className="p-3">2.58㎥/分（ブースト時）</td>
              <td className="p-3">非公表</td>
              <td className="p-3">2.2㎥/分</td>
              <td className="p-3">1.6㎥/分</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">重量</td>
              <td className="p-3">約357g</td>
              <td className="p-3">非公表</td>
              <td className="p-3">約348g</td>
              <td className="p-3">約560g</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">価格帯</td>
              <td className="p-3">{brighte.priceRange}</td>
              <td className="p-3">{refa.priceRange}</td>
              <td className="p-3">{kinujo.priceRange}</td>
              <td className="p-3">{naZeroK.priceRange}</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">最大の強み</td>
              <td className="p-3">ナノミストによる美容液ケア</td>
              <td className="p-3">センシングプログラムによる自動温度管理</td>
              <td className="p-3">軽さ・折りたたみによる携帯性</td>
              <td className="p-3">実績と評判の安心感</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※メーカー公表値をもとにした比較表です。詳細な仕様・最新情報は各メーカーの公式ページでご確認ください。
        </p>
      </div>

      <div className="not-prose my-5 rounded-xl border border-accent/25 bg-blush/40 p-4 text-sm text-ink/75">
        <p className="font-bold text-accent">4者4様の強み</p>
        <p className="mt-1">
          「美容液ミストのブライト」「自動温度管理のReFa」「軽さのKINUJO」「実績と評判のEH-NA0K」——
          4台はそれぞれ違う優先順位に応える設計になっています。
          風量・重量・価格帯だけでなく、自分がどの悩みを一番解消したいかで選ぶのがポイントです。
        </p>
      </div>

      {/* ── まとめ ── */}
      <h2>まとめ：優先したい悩みから逆算して選ぶ</h2>
      <p>
        乾かしながら髪の保湿・美容ケアもしたいなら<strong>ブライト シャワードライヤー</strong>、
        熱ダメージを抑えたいなら<strong>ReFa ビューテック ドライヤー S+</strong>、
        軽さ・携帯性を最優先するなら<strong>KINUJO 絹女</strong>、
        定番の安心感とコスパを重視するなら<strong>パナソニック ナノケア EH-NA0K</strong>という選び分けになります。
        価格・在庫は変動するため、購入前に各ストアで最新情報をご確認ください。
      </p>
    </article>
  );
}
