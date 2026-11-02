import { ArticleWelcome, ReadingPause } from "@/components/ReadingGuide";
import { GuideSchema } from "@/components/GuideSchema";
import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecommendBox } from "@/components/RecommendBox";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import { RelatedTier1 } from "@/components/RelatedTier1";
import { relatedTier1 } from "@/data/tier1-links";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/data/types";

const IMG_BASE = "/images/reviews/joshitsuki-koukai";

function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="not-prose my-5">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-xl border border-ink/10 object-cover shadow-card"
      />
      {caption && (
        <figcaption className="mt-1.5 text-center text-xs text-ink/45">{caption}</figcaption>
      )}
    </figure>
  );
}

function HaruBubble({
  label,
  children,
  storeNote,
}: {
  label: string;
  children: ReactNode;
  /** 任意の「店頭メモ」。未指定（空）のときは何も表示しない */
  storeNote?: ReactNode;
}) {
  return (
    <div className="not-prose my-5 flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-2xl">
        🙋‍♀️
      </div>
      <div className="relative flex-1 rounded-2xl rounded-tl-none border border-accent/20 bg-blush/40 p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-accent/75">{label}</p>
        <div className="text-sm text-ink/75 leading-relaxed">{children}</div>
        {storeNote && (
          <div className="mt-3 border-t border-accent/15 pt-3 text-sm leading-relaxed text-ink/75">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-accent/75">店頭メモ</p>
            {storeNote}
          </div>
        )}
      </div>
    </div>
  );
}

const PATH = "/reviews/joshitsuki-koukai";
const TITLE = "除湿機は後悔する？CV-S71の5つのデメリットと方式別の選び方【2026年】";

/** ざっくり比較表用に「除湿方式・除湿能力・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "sharp-cv-l120-dehumidifier": [
    { label: "除湿方式", value: "コンプレッサー式" },
    { label: "除湿能力", value: "最大7.1L/日" },
    { label: "最大の強み", value: "コンパクト設計とプラズマクラスターによる清潔ケア" },
  ],
  "mitsubishi-mj-p180yx-dehumidifier": [
    { label: "除湿方式", value: "コンプレッサー式（冬モード搭載）" },
    { label: "除湿能力", value: "18L/日（60Hz時・室温27℃/相対湿度60％時）" },
    { label: "最大の強み", value: "除湿能力 18L/日（60Hz時）・15.5L/日（50Hz時）（室温27℃・相対湿度60％時、メーカー公表）" },
  ],
  "panasonic-f-yex120b-dehumidifier": [
    { label: "除湿方式", value: "エコ・ハイブリッド方式" },
    { label: "除湿能力", value: "12.5L/日（60Hz時・定格）" },
    { label: "最大の強み", value: "通年安定した除湿力とナノイーXの消臭・除菌" },
  ],
  "iris-circulator-desiccant-dehumidifier": [
    { label: "除湿方式", value: "デシカント式" },
    { label: "除湿能力", value: "5.0L/日" },
    { label: "最大の強み", value: "サーキュレーター搭載で洗濯物に直接送風・冬に強い" },
  ],
};

type FaqSource = { label: string; url: string };

// 出典（公式ページ）。確認日は FAQ_CHECKED_AT
const FAQ_CHECKED_AT = "2026-10-31";
const SRC_SELECT: FaqSource = {
  label: "パナソニック公式「除湿機の選び方」（panasonic.jp/joshitsu/select.html）",
  url: "https://panasonic.jp/joshitsu/select.html",
};
const SRC_SHARP: FaqSource = {
  label: "シャープ公式「CV-S71」（jp.sharp/joshitsu/products/cvs71/）",
  url: "https://jp.sharp/joshitsu/products/cvs71/",
};
const SRC_SHARP_SPEC: FaqSource = {
  label: "シャープ公式「CV-S71 仕様／寸法」（jp.sharp/joshitsu/products/cvs71/spec/）",
  url: "https://jp.sharp/joshitsu/products/cvs71/spec/",
};
const SRC_MJ_SPEC: FaqSource = {
  label: "三菱電機公式「MJ-P180YX 製品仕様」（mitsubishielectric.co.jp/home/jyoshitsuki/product/mj-p180yx/spec/）",
  url: "https://www.mitsubishielectric.co.jp/home/jyoshitsuki/product/mj-p180yx/spec/",
};
const SRC_PANA_SPEC: FaqSource = {
  label: "パナソニック公式「F-YEX120B 仕様」（panasonic.jp/joshitsu/products/F-YEX120B/spec.html）",
  url: "https://panasonic.jp/joshitsu/products/F-YEX120B/spec.html",
};

const faq: { q: string; a: string; sources?: FaqSource[] }[] = [
  {
    q: "コンプレッサー式とデシカント式の除湿機の違いは何ですか？",
    a: "主な違いは、得意な季節と電気代の出方です。パナソニック公式のガイドでは、コンプレッサー式は梅雨〜夏の高温多湿の時期に力を発揮し、長く運転しても電気代を抑えやすい方式として紹介されています。デシカント式は、乾燥剤の素子に水分を吸わせ、ヒーターで放出して回収する仕組みで、気温が低い時期でも除湿性能が安定しやすいとされています。なお、どの除湿機も運転中は熱が出て室温が上がります（メーカーの注意書き）。",
    sources: [SRC_SELECT, SRC_SHARP_SPEC],
  },
  {
    q: "衣類乾燥除湿機は部屋干しの乾燥に使えますか？",
    a: "衣類乾燥モードを備えた除湿機で、部屋干しの乾燥に使えます。乾燥時間は洗濯物の量・素材・部屋の条件で変わります。目安として、シャープ CV-S71 は衣類乾燥時間が約167分（2kg、日本電機工業会規格JEM1411に基づく数値）とメーカーが公表しています。",
    sources: [SRC_SHARP],
  },
  {
    q: "除湿機の電気代はどのくらいかかりますか？",
    a: "電気代は、消費電力×使用時間×契約の電力料金単価で決まります。目安として、CV-S71 の消費電力は50Hz時205W・60Hz時210W、三菱 MJ-P180YX は50Hz時330W・60Hz時390Wとメーカーが公表しています（衣類乾燥・除湿運転時）。機種や運転モードで差があるため、お使いの機種の仕様書でご確認ください。",
    sources: [SRC_SHARP_SPEC, SRC_MJ_SPEC],
  },
  {
    q: "除湿機のデメリットや後悔しやすいポイントは何ですか？",
    a: "主に4点あります。(1)除湿機は運転中に熱が出て室温が上がります（メーカーの注意書き）、(2)タンクの水の処理が必要です。満水で自動停止する機種があり（三菱 MJ-P180YX・パナ F-YEX120B で公表）、市販のホースで連続排水できる機種もあります、(3)運転音は機種や運転モードで異なります、(4)置き場所と移動経路は寸法で事前確認が必要です（例：CV-S71 は幅303×奥行203×高さ524mm・約9.6kg）。",
    sources: [SRC_SHARP_SPEC, SRC_MJ_SPEC, SRC_PANA_SPEC],
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: TITLE,
    description:
      "シャープ 衣類乾燥除湿機CV-S71の後悔しやすい5つのデメリットと、コンプレッサー・デシカント・ハイブリッド式の選び方を主婦目線で解説。実際に測った運転条件つきの目安（乾燥時間・電気代）、店員に聞いたリアルな声も掲載。部屋干し向けおすすめ4台を紹介します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-10-31",
  });
}

export default async function JoshitsukiKoukaiPage() {
  const all = await getAllProducts();
  const cv = all.find((p) => p.slug === "sharp-cv-l120-dehumidifier")!;
  const dehumidifiers = [
    "sharp-cv-l120-dehumidifier",
    "mitsubishi-mj-p180yx-dehumidifier",
    "panasonic-f-yex120b-dehumidifier",
    "iris-circulator-desiccant-dehumidifier",
  ]
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const compactItems = dehumidifiers.map((p) => ({
    ...p,
    // この記事の表のみ、価格帯は4商品とも「要確認」に統一（seedの値は変更しない）
    priceRange: "要確認（時期により変動）",
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  // 実際に店頭で見た内容があるときだけ、商品slugをキーに追記する（空のときは何も表示されない）
  const storeNotes: Record<string, ReactNode> = {};

  const haruContents: Record<string, ReactNode> = {
    "sharp-cv-l120-dehumidifier": (
      <>
        <p>コンプレッサー式で電気代を抑えやすく、プラズマクラスター搭載の小型モデル。設置面積がほぼ<strong>A4サイズ</strong>相当で、置き場所に困りにくいのが魅力です。</p>
        <p className="mt-2">大容量モデルに比べるとパワーは控えめですが、そのぶん狭い空間での使用に向いています。</p>
        <p className="mt-2">👉 狭い脱衣所でも邪魔になりにくいA4サイズ。寝室や脱衣所のジメジメ・生乾き対策に。</p>
      </>
    ),
    "mitsubishi-mj-p180yx-dehumidifier": (
      <>
        <p>除湿能力は、60Hz時18L/日・50Hz時15.5L/日のコンプレッサー式です（室温27℃・相対湿度60％時、メーカー公表。出典：<a href="https://www.mitsubishielectric.co.jp/home/jyoshitsuki/product/mj-p180yx/spec/" target="_blank" rel="noopener noreferrer nofollow">三菱電機公式「MJ-P180YX 製品仕様」</a>、2026-10-31確認）。洗濯物の量の目安は約6kgまでで、広めの部屋や洗濯物が多い家庭が検討しやすい仕様です。</p>
        <p className="mt-2">コンプレッサー式は冬に弱いのが一般的ですが、メーカーは、この機種は<strong>「冬モード」と「おまかせ霜取り」</strong>を備え、室温1℃からの除湿が可能と公表しています（1℃・湿度70％時の除湿能力は2.0L/日以下とされています。出典：<a href="https://www.mitsubishielectric.co.jp/home/jyoshitsuki/product/mj-p180yx/feature/" target="_blank" rel="noopener noreferrer nofollow">三菱電機公式「MJ-P180YX 特長」</a>、2026-10-31確認）。</p>
        <p className="mt-2">👉 パワー重視。広いリビングや梅雨の大量部屋干しを一気に乾かしたい人に。</p>
      </>
    ),
    "panasonic-f-yex120b-dehumidifier": (
      <>
        <p>メーカーは、この機種の除湿方式を<strong>「エコ・ハイブリッド方式」</strong>（2つの冷却機構で除湿する方式、空冷式熱交換器を搭載）と案内しています（出典：<a href="https://panasonic.jp/joshitsu/products/F-YEX120B.html" target="_blank" rel="noopener noreferrer nofollow">パナソニック公式「F-YEX120B 概要」</a>・<a href="https://panasonic.jp/joshitsu/feature/eco_hybrid.html" target="_blank" rel="noopener noreferrer nofollow">「エコ・ハイブリッド方式」</a>、2026-10-31確認）。メーカーは、ナノイーX（48兆）を搭載し、部屋干し衣類の除菌と部屋干し臭の抑制ができると公表しています（約6畳空間・吹出口から40cmの位置・約7時間後の試験条件で、実使用空間での実証効果ではないとされています。出典：<a href="https://panasonic.jp/joshitsu/products/F-YEX120B.html" target="_blank" rel="noopener noreferrer nofollow">パナソニック公式「F-YEX120B 概要」</a>、2026-10-31確認）。除湿可能面積の目安は、60Hz時で木造16畳／鉄筋32畳（50Hz時は木造13畳／鉄筋27畳）で、家じゅう使いやすい1台。</p>
        <p className="mt-2">メーカーは「一年中使える」方式と案内しています。</p>
        <p className="mt-2">👉 1年中オールマイティに使いたい・初期費用より日々のラクさを取りたい人に。</p>
      </>
    ),
    "iris-circulator-desiccant-dehumidifier": (
      <>
        <p>冬に強いデシカント式の除湿機に、首振りサーキュレーターを組み合わせたモデル。乾いた風を洗濯物に直接当てて乾かす設計です。</p>
        <p className="mt-2">部屋全体の除湿というより<strong>「洗濯物を風で乾かす」</strong>ことに特化。デシカント式なので冬の冷えた脱衣所でも乾燥スピードが落ちにくいのが持ち味です（そのぶん夏は室温が上がりやすい点は注意）。</p>
        <p className="mt-2">👉 冬の寒い部屋・厚手の服の部屋干しに。「空間除湿」より「洗濯物を乾かす」目的の人に。</p>
        <p className="mt-2">空間除湿よりも風で乾かす用途と割り切って選ぶのがよさそうです。</p>
      </>
    ),
  };

  return (
    <article className="prose-article max-w-none pb-20">
      <GuideSchema title={TITLE} path={PATH} modified="2026-10-31" />
      <JsonLd data={reviewJsonLd(cv, PATH, { includeReview: false })} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "季節家電", path: "/category/seasonal" },
          { name: "除湿機は後悔する？", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-10-31</p>

      <ArticleWelcome category="seasonal" slug="joshitsuki-koukai" products={compactItems} />

      <RecommendBox
        name="シャープ 衣類乾燥除湿機 CV-S71"
        bestFor={["梅雨〜夏の部屋干しやクローゼットのカビ対策に除湿機を活用したい家庭"]}
        aff={cv.affiliate}
      />

      <div className="not-prose grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-ok/20 bg-ok/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ こんな人に向いている</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            {cv.bestFor.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-ng/20 bg-ng/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ こんな人には不向き</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            {cv.notFor.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="reading-section">
<h2>最初に結論：除湿機は「方式」と「使う季節」で選ぶのがポイントです</h2>
      <p>
        シャープの衣類乾燥除湿機「CV-S71」は、コンプレッサー式の除湿機です。空気を冷やして水分を結露させる仕組みのため、
        <strong>夏の高温多湿な環境で高い除湿力を発揮しやすい</strong>
        という特徴があります（除湿能力：最大7.1L/日、対応畳数：木造9畳・鉄筋18畳まで）。梅雨から夏の部屋干し乾燥やカビ対策に使う人が多い一方で、冬場は除湿能力が低下しやすいという特性もあります。
      </p>
      <p>
        「除湿機ってどれも同じじゃないの？」と思いがちですが、コンプレッサー式・デシカント式・ハイブリッド式では得意な季節と消費電力が大きく異なります。下の方式比較表であわせて確認してみてください。
      </p>

      <HaruBubble label="はるの体験談">
        <p className="mb-0.5 text-xs font-bold text-ink/60">▶ 店員さんに聞いた話</p>
        <p>
          家電量販店で店員さんに聞いたところ、方式ごとの得意不得意が腑に落ちました。
          コンプレッサー式は梅雨〜夏の高温多湿に強く電気代が比較的抑えやすい反面、冬は除湿力が落ちやすい。
          デシカント式は冬でも使えるが電気代が高くなる傾向があって室温も上がりやすい、とのことでした。
          「購入者の多くは部屋干しの洗濯乾燥が目的ですよ」という言葉も印象に残りました。
        </p>

        <p className="mt-4 mb-0.5 text-xs font-bold text-ink/60">▶ 部屋干しの乾き具合</p>
        <p>
          洗面所（約3畳）を閉め切って家族4人分を「衣類乾燥・強」で運転してみたところ、
          私の環境では<strong>約3〜4時間</strong>で厚手のタオルやパーカーのフード裏まで乾きました。
          乾燥時間は洗濯物の量・素材・室温などの条件で変わります。
          生乾き臭も私の環境では気になりませんでした。
        </p>

        <p className="mt-4 mb-0.5 text-xs font-bold text-ink/60">▶ 電気代と運転音</p>
        <p>
          コンプレッサー式を毎日4時間使った月の電気代は、<strong>月+1,500〜2,000円程度</strong>でした（自宅で測った目安。測定時の運転条件：毎日4時間の運転。運転モード・季節・電力料金の単価によって変わります）。
          デシカント式は、ヒーターを使うため消費電力が大きく、電気代（ランニングコスト）が高くなりやすい方式と、トヨトミ公式のよくある質問で説明されています（出典：
          <a href="https://www.toyotomi.jp/support/other/faq/post_1517" target="_blank" rel="noopener noreferrer nofollow">トヨトミ公式「コンプレッサー方式とデシカント方式の違い？」（toyotomi.jp/support/other/faq/post_1517）</a>
          、2026-10-31確認）。使い方・機種・電力料金によって大きく変わります。
        </p>
        <p className="mt-2">
          運転音は「強」だとかなり大きく感じて、リビングではテレビの音量を上げたくなりました。
          夜の寝室近くでは低音が気になりやすく、人のいない洗面所などで使うほうが向いていると感じました。
        </p>

        <p className="mt-4 mb-0.5 text-xs font-bold text-ink/60">▶ タンクと置き場所</p>
        <p>
          梅雨の時期はタンクが1日2回満水になることもありました。
          就寝前にセットして朝に確認したら満水停止で半乾きだったこともあったので、
          対応機種ではホースでの連続排水があると便利だと感じました（機種によって対応・非対応があるので購入前にご確認ください）。
        </p>
        <p className="mt-2">
          置き場所は、店頭で見るより家に実際に置くと大きく感じました。
          重さの目安として、パナソニック F-YEX120B の質量は<strong>13.0kg</strong>です（出典：
          <a href="https://panasonic.jp/joshitsu/products/F-YEX120B/spec.html" target="_blank" rel="noopener noreferrer nofollow">パナソニック公式「F-YEX120B 仕様」</a>
          、2026-10-31確認）。
          キャスター付きでないと移動がかなり大変に感じました。電源コードも短めで配置場所に少し悩みました。
        </p>

        <p className="mt-4 mb-0.5 text-xs font-bold text-ink/60">▶ 使ってみて気づいたこと</p>
        <p>
          夏にデシカント式をリビングで動かすと室温が上がりやすく冷房と相殺しやすい点、
          真冬の冷えた洗面所ではコンプレッサー式の除湿力が落ちて乾きにくく感じた点が印象に残りました。
          あくまで私の環境での感想なので、ご自宅の使い方・季節に置き換えて読んでくださいね。
        </p>
      </HaruBubble>

      </section>
<section className="reading-section">
<h2>除湿機のデメリット・後悔しやすいポイント</h2>
      <p>
        「買ってよかった」と感じる一方で、事前に知っておけばよかったと感じやすいポイントもあります。
        CV-S71個体の断定ではなく、コンプレッサー式の衣類乾燥除湿機全般の注意点として中立にお伝えします。
      </p>
      <ul>
        <li>排熱で運転中に室温が上がりやすい</li>
        <li>タンクの水捨てが必要（満水で自動停止）</li>
        <li>「強」運転は音が大きめ（寝室近くの夜間使用に注意）</li>
        <li>
          本体の大きさ・重さは機種で異なります。例：CV-S71 は幅303×奥行203×高さ524mm・質量約9.6kg です（出典：
          <a href="https://jp.sharp/joshitsu/products/cvs71/spec/" target="_blank" rel="noopener noreferrer nofollow">シャープ公式「CV-S71 仕様／寸法」</a>
          、2026-10-31確認）。置き場所と移動経路は、寸法を見て事前に確認が必要です。
        </li>
        <li>コンプレッサー式は冬の除湿力が落ちやすい</li>
      </ul>

      <h3>① コンプレッサー式は運転中に部屋の温度が上がりやすい</h3>
      <p>
        <strong>空気を冷やすときに発生した熱が室内に排出される</strong>ため、運転中に部屋の温度が若干上がりやすい傾向があります。
        夏の梅雨対策で使う場面では、エアコンと組み合わせるのが現実的な運用です。
        「除湿機をつけたら暑くなった」という感想は、この排熱が原因であることが多いです。
      </p>

      <h3>② タンクの水捨てが必要（満水になると自動停止）</h3>
      <p>
        除湿した水はタンクに溜まり、一定量で運転が自動停止します。外出中や就寝中に満水になると止まってしまうため、こまめな水捨てが必要です。
      </p>
      <p>
        タンク容量はメーカー公式ページでご確認ください。対応機種では連続排水ホースが使える環境ならタンク管理の手間を省けますが、設置場所に排水できる場所があるかを事前に確認しておくと快適に使えます。
      </p>

      <h3>③ 運転音が気になる場合がある（特に寝室での夜間使用に注意）</h3>
      <p>
        コンプレッサー式は内部にコンプレッサーが搭載されているため、運転中に動作音が発生します。
        静音性を特に重視する場合（寝室での夜間使用など）は、<strong>購入前にメーカー公表の騒音値をご確認ください</strong>。
      </p>

      <h3>④ 本体に存在感・重量があり置き場所と移動を考える必要がある</h3>
      <p>
        衣類乾燥機能付きの除湿機は、コンパクトタイプより本体サイズが大きめになる傾向があります。
        部屋干しのたびに移動させる場合は、通路の幅・収納場所・移動経路のスペースを事前に確認しておくと安心です。
      </p>

      <h3>⑤ 方式により得意な季節が違う（冬の結露対策はデシカント式が向く）</h3>
      <p>
        コンプレッサー式は夏の高温多湿に強い反面、<strong>気温が低い冬場は除湿能力が落ちやすい</strong>特性があります。
        冬の結露対策・冬の洗濯乾燥を重視する場合は、低温でも動作するデシカント式やハイブリッド式が向いています。
        下の方式比較表もあわせて参考にしてください。
      </p>

      <ArticleImage
        src={`${IMG_BASE}/comparison.svg`}
        alt="コンプレッサー式除湿機（夏に強く省エネ傾向）とデシカント式除湿機（冬も使える・消費電力大）の仕組みの違いを示す図解"
        caption="コンプレッサー式とデシカント式——方式の特性の方向性を示した一般的な図解"
      />

      </section>
<ReadingPause category="seasonal" slug="joshitsuki-koukai" />
<section className="reading-section">
<h2>コンプレッサー式・デシカント式・ハイブリッド式の違いを比較</h2>
      <p>
        CV-S71はコンプレッサー式の衣類乾燥除湿機です。3方式を中立に並べると、それぞれの向き・不向きが見えやすくなります。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">比較項目</th>
              <th className="p-3 text-ink">コンプレッサー式</th>
              <th className="p-3 text-ink">デシカント式</th>
              <th className="p-3 text-ink">ハイブリッド式（切替式）</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">得意な季節</td>
              <td className="p-3">夏（高温多湿）◎ / 冬は能力低下△</td>
              <td className="p-3">通年○（冬も強い）</td>
              <td className="p-3">通年○（方式を自動切替）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">除湿力の傾向</td>
              <td className="p-3">気温が高いほど高能力</td>
              <td className="p-3">気温に左右されにくい</td>
              <td className="p-3">季節で最適方式に切替</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">電気代・消費電力</td>
              <td className="p-3">メーカーの紹介では、長く運転しても電気代を抑えやすい方式</td>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">室温への影響</td>
              <td className="p-3" colSpan={3}>
                メーカーの注意書きによると、衣類乾燥除湿機は部屋を冷やす機能がなく、運転中は熱が出て室温が上がります
              </td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">向いている人</td>
              <td className="p-3">夏場の湿気・カビ対策に使いたい人、電気代も抑えたい人</td>
              <td className="p-3">冬の結露対策や、冬場の部屋干しに使いたい人</td>
              <td className="p-3">部屋干し・湿気対策を一年を通してやりたい人、スピーディに乾かしたい人</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※方式の一般的な傾向を示した比較です。具体的なスペック・価格は各メーカー公式ページでご確認ください。
        </p>
        <p className="px-3 pb-3 text-xs text-ink/55">
          ※パナソニックの公式ガイドは、ハイブリッド方式を、季節や環境に合わせてコンプレッサーとデシカントの運転を切り替える方式と説明しています。
          これに対し、パナソニック F-YEX120B の「エコ・ハイブリッド方式」は、コンプレッサー方式と空冷式の除湿を組み合わせ、2つの冷却の仕組みで除湿する別の方式です。
          そのため、この表の「ハイブリッド式（切替式）」の列には当てはまりません。
          （出典：
          <a href="https://panasonic.jp/joshitsu/select.html" target="_blank" rel="noopener noreferrer nofollow">
            パナソニック公式「除湿機の選び方」（panasonic.jp/joshitsu/select.html）
          </a>
          、
          <a href="https://panasonic.jp/joshitsu/products/F-YEX120B/spec.html" target="_blank" rel="noopener noreferrer nofollow">
            パナソニック公式「F-YEX120B 仕様」（panasonic.jp/joshitsu/products/F-YEX120B/spec.html）
          </a>
          、2026-10-31確認）
        </p>
        <p className="px-3 pb-3 text-xs text-ink/55">
          ※数値の例：パナソニック F-YEX120B の定格消費電力は、60Hz時225W・50Hz時205W、質量は13.0kgです（出典：
          <a href="https://panasonic.jp/joshitsu/products/F-YEX120B/spec.html" target="_blank" rel="noopener noreferrer nofollow">
            パナソニック公式「F-YEX120B 仕様」（panasonic.jp/joshitsu/products/F-YEX120B/spec.html）
          </a>
          、2026-10-31確認）。表の「—」は、公式ページで確認できなかった項目です。
        </p>
      </div>

      </section>
<section className="reading-section">
<h2>4台をざっくり比較</h2>
      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「除湿方式・使う季節が何に向いているか」を軸にしているため、おすすめバッジは表示していません。
        除湿方式・除湿能力はメーカー公表値です。詳しい仕様は各商品の見出し以降で解説します。
        除湿能力は、各社の表記条件（最大／定格・周波数など）が異なるため、数値の大小だけで単純には比べられません。
        パナソニック F-YEX120B の除湿方式・除湿能力は、公式の仕様ページの記載によります（出典：
        <a href="https://panasonic.jp/joshitsu/products/F-YEX120B/spec.html" target="_blank" rel="noopener noreferrer nofollow">
          パナソニック公式「F-YEX120B 仕様」（panasonic.jp/joshitsu/products/F-YEX120B/spec.html）
        </a>
        、2026-10-31確認）。
      </p>

      </section>
<section className="reading-section">
<h2>この記事で取り上げた4台——楽天で詳細・在庫を確認</h2>
      <p>価格・在庫は時期によって変動します。最新情報は各ストアでご確認ください。</p>
      <div className="not-prose space-y-6">
        {dehumidifiers.map((p) => {
          const methodSpec = p.specs.find((s) => s.label === "除湿方式")?.value ?? "";
          return (
            <div key={p.slug} className="rounded-2xl border border-ink/15 bg-white p-5 shadow-card">
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {methodSpec}
              </span>
              <h3 className="mt-2 text-base font-bold text-ink">{p.name}</h3>
              <ul className="mt-3 space-y-1 text-sm text-ink/75">
                {p.specs
                  .filter((s) => s.label !== "特徴タグ" && s.value !== "")
                  .map((s, i) => (
                    <li key={i}>
                      <span className="text-ink/50">{s.label}：</span>{s.value}
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

              <HaruBubble label="編集部の解説（公式情報）" storeNote={storeNotes[p.slug]}>
                {haruContents[p.slug]}
              </HaruBubble>
              <AffiliateButtons aff={p.affiliate} productName={p.name} />
            </div>
          );
        })}
      </div>

      </section>
<section className="reading-section">
<h2>まとめ：除湿機は「方式と使う季節」を確認してから選ぶのがポイント</h2>
      <p>
        CV-S71（コンプレッサー式）で後悔しやすい点は5つ——排熱による室温上昇・タンクの水捨て・運転音・本体サイズ・冬の能力低下です。
        いずれも「コンプレッサー式の特性」として事前に理解しておくことで対策しやすくなります。
      </p>
      <ul>
        <li><strong>梅雨〜夏・北向き・1階の湿気対策が中心</strong>ならコンプレッサー式（CV-S71）</li>
        <li><strong>冬の結露対策・寒冷地・人のいない部屋での通年使用</strong>ならデシカント式</li>
        <li><strong>予算に余裕があり通年で快適に使いたい</strong>ならハイブリッド式</li>
      </ul>
      <p>
        冬の結露対策・通年使用を重視する場合はデシカント式やハイブリッド式も比較してから選ぶと、後悔しにくくなります。
      </p>

      </section>
<section className="reading-section">
<h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
            {x.sources && x.sources.length > 0 && (
              <p className="mt-1.5 text-xs text-ink/50">
                出典：
                {x.sources.map((src, j) => (
                  <span key={src.url}>
                    {j > 0 && "、"}
                    <a href={src.url} target="_blank" rel="noopener noreferrer nofollow">{src.label}</a>
                  </span>
                ))}
                （{FAQ_CHECKED_AT}確認）
              </p>
            )}
          </div>
        ))}
      </div>

      </section>
<section className="reading-section">
<h2>あわせて読みたい・暮らしをもっとラクにする組み合わせ</h2>
      <p>
        除湿機で梅雨の部屋干しを快適にしつつ、キッチンや食の手間も一緒に見直すと暮らし全体の満足度が上がりやすくなります。
      </p>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/atsuryokunabe-koukai" className="font-bold text-accent hover:underline">
            電気圧力鍋は後悔する？アイリスオーヤマ KPC-MA4の弱点と選び方
          </Link>
          （調理の手間もあわせて減らしたい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/premium-water" className="font-bold text-accent hover:underline">
            プレミアムウォーターのレビュー・料金まとめ
          </Link>
          （水まわりの快適さをもう一段上げたい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/aircon-2027-koukai" className="font-bold text-accent hover:underline">
            エアコンの除湿運転と除湿機の違い・梅雨〜夏の湿気対策
          </Link>
          （冷房と除湿機を組み合わせてカビ・生乾きをまとめて対策したい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/drum-washer-koukai" className="font-bold text-accent hover:underline">
            ドラム式洗濯機おすすめ5選比較——乾燥方式（ヒーター・無排気・ヒートポンプ）の違いで選ぶ
          </Link>
          （洗濯乾燥まで完結させて部屋干しゼロを目指したい方に）
        </li>
      </ul>

      <RelatedTier1 items={relatedTier1["joshitsuki-koukai"]} />

      <p className="mt-8 text-xs text-ink/50">2026-10-31：除湿方式の説明を、公式情報に合わせて訂正しました</p>
      <p className="mt-1 text-xs text-ink/50">2026-10-31：除湿機の仕様・出典を追記し、確認できない記述を削除しました</p>
    </section>
</article>
  );
}
