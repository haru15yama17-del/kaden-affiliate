import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecommendBox } from "@/components/RecommendBox";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { StickyCta } from "@/components/StickyCta";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AffiliateLinks } from "@/data/types";

const IMG_BASE = "/images/reviews/aircon-2027-koukai";

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

/** 比較表の楽天購入ボタン（コンパクト） */
function MiniRakutenBtn({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="inline-flex items-center gap-1 rounded-lg bg-[#bf0000] px-2.5 py-1.5 text-xs font-bold text-white transition-all hover:brightness-110"
    >
      🏪 楽天
    </a>
  );
}

/** 中段・末尾用の大きめCTAリンク行 */
function CtaRow({
  label,
  sub,
  aff,
}: {
  label: string;
  sub: string;
  aff: AffiliateLinks;
}) {
  const href = aff.rakutenUrl ?? "";
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="flex items-center justify-between gap-3 rounded-xl bg-[#bf0000] px-4 py-3 text-left text-white transition-all hover:brightness-110"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold leading-snug">{label}</p>
        <p className="mt-0.5 text-xs text-white/75">{sub}</p>
      </div>
      <span className="shrink-0 text-sm font-bold">楽天 →</span>
    </a>
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

const PATH = "/reviews/aircon-2027-koukai";
const TITLE =
  "エアコンは2027年問題で値上がり前に？工事費込みで安いうちに選ぶおすすめモデル【2026年】";

const faq = [
  {
    q: "エアコンの2027年問題とは？",
    a: "2027年4月から省エネ法のトップランナー制度においてエアコンのAPF（通年エネルギー消費効率）の目標基準値が引き上げられる予定です。制度はメーカーが年度ごとに出荷台数の加重平均で基準達成を求める仕組みで、現行基準を大きく下回る低価格モデルは事実上、製造・出荷継続が難しくなり市場から減ると予想・指摘されています。",
  },
  {
    q: "エアコンは2027年に値上がりする？",
    a: "2026年〜2027年にかけて低価格帯エアコンの品薄や価格上昇の可能性が指摘されています。ただし「絶対に値上がりする」とは断言できません。価格・在庫状況は各ストアで最新情報をご確認ください。",
  },
  {
    q: "2027年以降、今のエアコンは使えなくなる？",
    a: "いいえ。現在使用中・すでに設置済みのエアコンを買い替える法的な義務はありません。使えなくなるわけではありません。今回の基準はメーカーの製造・出荷に関わる制度です。",
  },
  {
    q: "エアコンは安いうちに買うべき？",
    a: "今のエアコンが10年以上経っている・不調があるなら早めの検討が一案です。一方、現在のエアコンが十分に動いているなら急いで買い替える必要はありません。新居への設置や故障での買い替えが必要な場合は、2026年のうちに余裕をもって工事予約を進めるのが得策とも言えます。",
  },
  {
    q: "工事費込みエアコンセットの注意点は？",
    a: "工事費込みは「標準工事」の範囲内の費用です。配管延長・隠蔽配管・コンセント増設など標準工事外の作業は追加費用が発生する場合があります。メーカーおまかせセットは届く機種・メーカーを指定できません。また「本体のみ（工事なし）」として安く売られている商品もあるため、工事費込みかどうかを購入前に必ずご確認ください。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "2027年4月の省エネ基準引き上げ（2027年問題）でエアコン低価格帯の市場縮小・値上がりが予想されています。工事費込みで今選べるモデルを安さ重視・省エネ重視の2グループ、畳数別に比較・紹介します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-06-29",
  });
}

export default async function AirconKoukaiPage() {
  const all       = await getAllProducts();
  const omakase   = all.find((p) => p.slug === "aircon-set-6jo-omakase")!;
  const iris      = all.find((p) => p.slug === "iris-g-aircon-set")!;
  const daikin    = all.find((p) => p.slug === "daikin-s285ates-aircon")!;
  const mitsu     = all.find((p) => p.slug === "mitsubishi-msz-zw5625s-aircon")!;
  const panasonic = all.find((p) => p.slug === "panasonic-cs-635dex2-aircon")!;

  return (
    <article className="prose-article max-w-none pb-20">
      {/* ── 構造化データ ── */}
      <JsonLd data={reviewJsonLd(omakase, PATH)} />
      <JsonLd data={faqJsonLd(faq)} />
      {/* 各商品の Product 構造化データ（omakase は reviewJsonLd で兼用） */}
      <JsonLd data={productJsonLd(iris.name,      iris.brand)} />
      <JsonLd data={productJsonLd(daikin.name,    daikin.brand)} />
      <JsonLd data={productJsonLd(mitsu.name,     mitsu.brand)} />
      <JsonLd data={productJsonLd(panasonic.name, panasonic.brand)} />

      {/* ── スティッキーCTA（スクロール500px後に表示） ── */}
      <StickyCta
        productName="工事費込みエアコン 楽天で最安値を確認"
        priceRange="2027年問題で需要増加中・在庫状況は要確認"
        aff={omakase.affiliate}
      />

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "季節家電", path: "/category/seasonal" },
          { name: "エアコン2027年問題・工事費込み比較", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-06-29</p>

      <ArticleImage
        src={`${IMG_BASE}/hero.svg`}
        alt="壁掛けエアコンのシルエットと、工事費込み・2027省エネ基準・畳数で選ぶ・安さまたは省エネ重視の選び方を示す図解"
        caption="2027年の省エネ基準引き上げを前に、工事費込みエアコンを「安さ」か「省エネ・メーカー」かで選ぶ方法を整理した図解"
      />

      {/* ── 結論ファースト（3行） ── CV-1 */}
      <div className="not-prose my-5 rounded-xl border-2 border-accent/40 bg-blush/60 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-accent/70">
          この記事の結論（3行まとめ）
        </p>
        <ul className="space-y-2 text-sm font-medium text-ink">
          <li>
            💴 <strong>費用を最優先</strong>したい
            → 工事費込み最安（6畳おまかせ）またはアイリスオーヤマGシリーズ
          </li>
          <li>
            🌿 <strong>メーカー・省エネ重視</strong>
            → ダイキン10畳 / 三菱霧ヶ峰18畳 / パナソニックエオリア20畳
          </li>
          <li>
            📐 まず<strong>部屋の畳数</strong>を確認してから上記グループで絞り込むとスムーズ
          </li>
        </ul>
      </div>

      {/* ── RecommendBox（安さ重視の代表として） ── CV-2 */}
      <RecommendBox
        name="エアコン 6畳 工事費込みセット（メーカーおまかせ）"
        bestFor={["費用を最大限に抑えて6畳用エアコンを工事費込みで導入したい方"]}
        aff={omakase.affiliate}
      />

      <p>
        2027年4月の省エネ基準引き上げを受け、低価格帯エアコンの市場縮小や価格上昇が予想・指摘されています。
        「2026年のうちに選んでおくのが一手」という声もありますが、<strong>今のエアコンが問題なく使えているなら急ぐ必要はありません</strong>。
        新居設置・老朽化・故障が理由なら、工事予約が混む前に余裕をもって動くのが得策ともいえます。
      </p>
      <p>
        選び方は2ステップ。まず<strong>「費用優先」か「メーカー・省エネ優先」か</strong>を決め、
        次に<strong>部屋の畳数</strong>で絞り込む——これだけです。
      </p>

      <div className="not-prose grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-ok/20 bg-ok/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ 安さ重視グループが向いている方</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            <li>寝室・子供部屋・1人暮らしに費用を抑えたい</li>
            <li>6〜20畳の幅広い畳数でコストを優先したい</li>
            <li>メーカー・機種にこだわりがない</li>
          </ul>
        </div>
        <div className="rounded-xl border border-accent/20 bg-blush/20 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ 省エネ・メーカー重視グループが向いている方</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            <li>大手メーカーで長く安心して使いたい</li>
            <li>省エネ上位機でランニングコストを意識したい</li>
            <li>10〜20畳の広いリビングに対応機種が必要</li>
          </ul>
        </div>
      </div>

      {/* ================================================================
          2027年問題 解説
      ================================================================ */}
      <h2>エアコン2027年問題とは？省エネ基準引き上げの仕組みをわかりやすく解説</h2>
      <p>
        「2027年問題」と呼ばれる背景には、省エネ法のトップランナー制度における
        <strong>APF（通年エネルギー消費効率）の目標基準値引き上げ</strong>があります。
        2027年4月から新しい目標基準値が適用される予定で、たとえば冷房能力2.2kWクラス（6畳用）では
        APF基準が約5.8→6.6（冷房能力によっては最大34.7%改善が必要）と報じられています
        （経済産業省審議会資料等に基づく報道による）。
      </p>
      <p>
        注意が必要なのはこの制度の仕組みです。
        <strong>「法律で安いエアコンの製造販売が禁止される」わけではありません。</strong>
        メーカーが年度ごとに出荷台数の加重平均で基準達成を求められる制度であり、
        結果として基準を大きく下回る低価格モデルは事実上、製造・出荷継続が難しくなり
        <strong>市場から減る見込みと予想・指摘されています</strong>。
      </p>

      <div className="not-prose my-5 rounded-xl border border-ink/15 bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-bold text-ink">▼ 2027年問題のポイントまとめ</p>
        <ul className="space-y-2 text-sm text-ink/75">
          <li>✅ 2027年4月〜 省エネ法トップランナー制度でAPF基準値が引き上げ予定</li>
          <li>✅ 6畳用2.2kWでAPF約5.8→6.6（冷房能力により最大34.7%改善が必要と報道）</li>
          <li>✅ 基準を下回る低価格モデルが市場から減ると予想・指摘されている</li>
          <li>✅ 2026年は駆け込み需要で品薄・価格高騰の可能性も指摘されている（断定ではない）</li>
          <li>⚠️ 現在使用中・設置済みのエアコンは<strong>使えなくなるわけではない</strong>（買い替え義務なし）</li>
        </ul>
      </div>

      <h3>2027年に値上がりする？——「可能性の指摘」と「断言できないこと」</h3>
      <p>
        「2027年問題で値上がりする」という声は多く聞かれますが、具体的な値上がり幅や時期を断言できる情報はありません。
        価格動向は需給・為替・各メーカーの戦略にも左右されます。
        ただし<strong>2026年のうちに工事費込みで動く人が増えている</strong>のは事実として指摘されており、
        工事予約が混雑する前に計画を立てるメリットはあります。
      </p>

      <h3>今のエアコンは使えなくなる？——公式Q&A準拠の回答</h3>
      <p>
        <strong>現在使用中・すでに設置済みのエアコンが使えなくなるわけではありません。</strong>
        買い替えの法的義務もありません。「古いエアコンを撤去しなければならない」という情報は正確ではないため注意してください。
        買い替えが必要になるのは、老朽化・故障・新居設置などの通常のタイミングです。
      </p>

      <ArticleImage
        src={`${IMG_BASE}/comparison.svg`}
        alt="エアコンの選び方：安さ重視グループとメーカー・省エネ重視グループの2グループを示す図解"
        caption="「安さ重視」と「省エネ・メーカー重視」の2グループ——まず方向性を決めてから畳数で絞り込む"
      />

      {/* ── 中段CTA（2027問題→商品へのブリッジ） ── CV-3 */}
      <div className="not-prose my-6 rounded-2xl border-2 border-accent/30 bg-blush p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent/70">
          ▼ おすすめモデルを今すぐ確認したい方へ
        </p>
        <div className="space-y-2">
          <CtaRow
            label="💴 安さ重視：工事費込み最安セット（6畳おまかせ）"
            sub="全国工事対応・メーカーおまかせ・費用を抑えたい方に"
            aff={omakase.affiliate}
          />
          <CtaRow
            label="🌿 省エネ重視：ダイキン・三菱・パナソニックをまとめて確認"
            sub="10〜20畳・大手メーカー・省エネ上位機・工事費込み"
            aff={daikin.affiliate}
          />
        </div>
        <p className="mt-3 text-center text-xs text-ink/40">
          ※アフィリエイト広告を利用しています。価格・在庫は各ストアでご確認ください。
        </p>
      </div>

      {/* ================================================================
          グループ1: 安さ重視
      ================================================================ */}
      <h2 id="group-yasui">工事費込みで安いのはどれ？安さ重視グループ2選</h2>
      <p>
        工事費込みで費用を抑えたい場合の2選です。
        メーカーにこだわりがなくスタンダードな性能で十分という方に向いています。
      </p>

      <h3>① エアコン 6畳 工事費込みセット（メーカーおまかせ）——最安クラスで工事まで完結</h3>
      <p>
        工事費込みセットの中でも最安クラスに位置するのが「メーカーおまかせ」タイプです。
        <strong>寝室・子供部屋・1人暮らしの1Kなど6畳用エアコンを費用最優先で手配したい場合</strong>の第一選択肢です。
      </p>

      <div className="not-prose my-4 rounded-xl border border-ink/15 bg-white p-4 shadow-card">
        <p className="mb-2 text-sm font-bold text-ink">▼ このセットのポイント</p>
        <ul className="space-y-1.5 text-sm text-ink/75">
          <li>✅ 6畳用 / 100V / 工事費込み / 全国工事対応</li>
          <li>✅ 工事費込み最安クラス・費用を一番抑えたい方向け</li>
          <li>⚠️ <strong>届くメーカー・型番は選べません</strong>（メーカーおまかせ）</li>
          <li>⚠️ 省エネ性能は大手上位機より劣る傾向があります</li>
          <li>⚠️ 標準工事範囲外（配管延長等）は追加費用が発生する場合があります</li>
        </ul>
      </div>

      {/* CV-4 */}
      <AffiliateButtons aff={omakase.affiliate} />

      <h3>② アイリスオーヤマ エアコン Gシリーズ（工事費込み・施工ありセット）——メーカー指定で安く・畳数展開が広い</h3>
      <p>
        メーカーを指定しつつ費用を抑えたい場合の選択肢がアイリスオーヤマのGシリーズ（工事費込みセット）です。
        <strong>6〜20畳と畳数展開が広く</strong>、部屋の大きさに合わせて選びやすいのが特徴です。
        スタンダードモデルとして内部清浄機能も搭載しています。
      </p>
      <p>
        大手メーカーと比べると省エネ性能・上位機能は控えめな傾向がありますが、
        「アイリスオーヤマでOK・工事費込みで費用を抑えたい」という方に向いています。
      </p>

      <HaruBubble label="はるの店頭レポート">
        <p>大手のエントリー機より、さらに1〜2万円ほど安い価格設定。そのぶん本体のプラは少し薄く感じ、リモコンは大きな文字で最低限のボタンだけ。</p>
        <p className="mt-2">店員さんは正直に「冷やす・暖めるだけの<strong>単機能</strong>。省エネは大手に劣るので、毎日長時間使うと電気代で逆転することも。室外機の音も少し大きめ」と。</p>
        <p className="mt-2">来客用の和室や1日1〜2時間だけ使う部屋、急ぎで安く揃えたいときの間に合わせ向き。メインのLDKには不向きという印象でした。</p>
      </HaruBubble>

      {/* CV-5 */}
      <AffiliateButtons aff={iris.affiliate} />

      {/* ================================================================
          グループ2: メーカー・省エネ重視
      ================================================================ */}
      <h2 id="group-eco">何畳用を選べばいい？メーカー・省エネ重視グループ3選</h2>
      <p>
        大手メーカーの信頼性や省エネ上位機を重視する方向けの3選です。
        2027年基準引き上げを前提に、今から省エネ性能の高い機種を選びたい方にも向いています。
      </p>

      <h3>③ ダイキン エアコン S285ATES-W（10畳用・工事費込み）——リビング・ファミリー向けスタンダード</h3>
      <p>
        ダイキンのスタンダードモデル（Eシリーズ）の10畳用・工事費込みセットです。
        <strong>10畳のリビングやファミリースペースでダイキンブランドを選びたい方</strong>向けの入門的な選択肢。
        自動掃除などの上位機能はありませんが、全国工事対応でスムーズに導入できます。
      </p>

      <HaruBubble label="はるの店頭レポート">
        <p>店員さんいわく「Eシリーズは一番ベーシックだけど、コンプレッサーと室外機が頑丈で猛暑でも冷えが落ちにくい。だから<strong>指名買いが多い</strong>」とのこと。</p>
        <p className="mt-2">実機はデザインこそ無骨ですが、奥行きが薄めで壁付けの圧迫感は少なめ。自動お掃除機能が無いぶん中がシンプルで、自分で手入れする派には扱いやすそうでした。</p>
        <p className="mt-2">寝室・子ども部屋・書斎など、夏に長時間つけっぱなしにする個室にちょうど良い印象です。</p>
      </HaruBubble>

      {/* CV-6 */}
      <AffiliateButtons aff={daikin.affiliate} />

      <h3>④ 三菱 霧ヶ峰 MSZ-ZW5625S-W（18畳用・工事費込み・省エネ上位機）——広いリビングに省エネ重視</h3>
      <p>
        三菱電機の霧ヶ峰Zシリーズは省エネ上位機として位置づけられるシリーズです。
        18畳用・単相200Vで<strong>広めのリビングに省エネ性能の高いエアコンを入れたい方</strong>向け。
        単相200Vのため、既存コンセントが100Vの場合は電気工事が別途必要になる場合があります（購入前に確認を）。
      </p>

      <HaruBubble label="はるの店頭レポート">
        <p>上位機を下位モデルの後に見ると、壁からの"張り出し"の厚みにまず驚きます。</p>
        <p className="mt-2">霧ヶ峰のムーブアイは動きが細かく、左右のフラップが独立してウネウネ。暑がりさんと寒がりさんに別々の風を当てるデモが分かりやすかったです。</p>
        <p className="mt-2">店員さん談：「足元までしっかり暖めたい、間取りが複雑なリビングなら<strong>ムーブアイが強い</strong>」。</p>
      </HaruBubble>

      {/* CV-7 */}
      <AffiliateButtons aff={mitsu.affiliate} />

      <h3>⑤ パナソニック エオリア CS-635DEX2-W（20畳用・工事費込み・省エネ上位機）——広いLDKに省エネ最重視</h3>
      <p>
        パナソニックのエオリアEXシリーズは省エネ上位機として位置づけられるシリーズです。
        20畳用・単相200Vで<strong>大きなLDKに省エネ性能を最重視して導入したい方</strong>向け。
        こちらも単相200V対応のため、コンセント環境の事前確認をおすすめします。
      </p>

      <HaruBubble label="はるの店頭レポート">
        <p>私が見た範囲でいちばん印象的だったのは<strong>動作音の静かさ</strong>。風が直接体に当たらないよう、天井や壁を這わせるような気流でした。</p>
        <p className="mt-2">ナノイーX搭載のためか、デモ機の風はニオイを感じずすっきり。</p>
        <p className="mt-2">店員さん談：「キッチンの油やペットのニオイが気になるLDKならパナソニック。内部の自動洗浄も強力」。</p>
      </HaruBubble>

      {/* CV-8 */}
      <AffiliateButtons aff={panasonic.affiliate} />

      {/* ================================================================
          比較表（購入ボタン付き）
      ================================================================ */}
      <h2>5モデル一覧比較表——畳数・グループ別に選ぶ</h2>
      <p>
        グループ / 畳数 / 省エネ傾向 / こんな人向けを横断比較します。
        価格・在庫は時期によって変動するため各ストアで最新情報を確認してください。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">グループ</th>
              <th className="p-3 text-ink">メーカー・商品</th>
              <th className="p-3 text-ink">畳数</th>
              <th className="p-3 text-ink">タイプ</th>
              <th className="p-3 text-ink">省エネ傾向</th>
              <th className="p-3 text-ink">工事費</th>
              <th className="p-3 text-ink">こんな人向け</th>
              <th className="p-3 text-ink">購入</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 text-xs font-semibold text-blue-600">安さ重視</td>
              <td className="p-3 font-medium text-ink">おまかせ（各メーカー）</td>
              <td className="p-3">6畳</td>
              <td className="p-3">スタンダード</td>
              <td className="p-3">標準</td>
              <td className="p-3">込み</td>
              <td className="p-3">最安・寝室・1人暮らし</td>
              <td className="p-3">
                {omakase.affiliate.rakutenUrl && (
                  <MiniRakutenBtn href={omakase.affiliate.rakutenUrl} />
                )}
              </td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 text-xs font-semibold text-blue-600">安さ重視</td>
              <td className="p-3 font-medium text-ink">アイリスオーヤマ Gシリーズ</td>
              <td className="p-3">6〜20畳</td>
              <td className="p-3">スタンダード</td>
              <td className="p-3">標準</td>
              <td className="p-3">込み</td>
              <td className="p-3">メーカー指定・畳数幅広</td>
              <td className="p-3">
                {iris.affiliate.rakutenUrl && (
                  <MiniRakutenBtn href={iris.affiliate.rakutenUrl} />
                )}
              </td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 text-xs font-semibold text-green-700">省エネ重視</td>
              <td className="p-3 font-medium text-ink">ダイキン S285ATES（10畳）</td>
              <td className="p-3">10畳</td>
              <td className="p-3">スタンダード</td>
              <td className="p-3">標準〜上位</td>
              <td className="p-3">込み</td>
              <td className="p-3">ダイキン・リビング</td>
              <td className="p-3">
                {daikin.affiliate.rakutenUrl && (
                  <MiniRakutenBtn href={daikin.affiliate.rakutenUrl} />
                )}
              </td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 text-xs font-semibold text-green-700">省エネ重視</td>
              <td className="p-3 font-medium text-ink">三菱 霧ヶ峰 Z（18畳）</td>
              <td className="p-3">18畳</td>
              <td className="p-3">省エネ上位</td>
              <td className="p-3">上位</td>
              <td className="p-3">込み</td>
              <td className="p-3">広いリビング・省エネ</td>
              <td className="p-3">
                {mitsu.affiliate.rakutenUrl && (
                  <MiniRakutenBtn href={mitsu.affiliate.rakutenUrl} />
                )}
              </td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 text-xs font-semibold text-green-700">省エネ重視</td>
              <td className="p-3 font-medium text-ink">パナソニック エオリアEX（20畳）</td>
              <td className="p-3">20畳</td>
              <td className="p-3">省エネ上位</td>
              <td className="p-3">上位</td>
              <td className="p-3">込み</td>
              <td className="p-3">広いLDK・省エネ最重視</td>
              <td className="p-3">
                {panasonic.affiliate.rakutenUrl && (
                  <MiniRakutenBtn href={panasonic.affiliate.rakutenUrl} />
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※省エネ傾向は各グループ内での相対比較です。具体的なAPF値は各商品ページでご確認ください。単相200Vモデルはコンセント工事が必要な場合があります。
        </p>
      </div>

      {/* ================================================================
          デメリット・注意点
      ================================================================ */}
      <h2>工事費込みエアコンで後悔しない注意点・デメリット5つ</h2>
      <p>
        工事費込みセットを選ぶ前に知っておくと後悔しにくくなるポイントをまとめます。
      </p>
      <ul>
        <li>工事費込みでも<strong>標準工事の範囲外は追加費用</strong>がかかる場合がある</li>
        <li>メーカーおまかせセットは<strong>機種・メーカーを選べない</strong></li>
        <li>2027年基準対応の新型は<strong>室外機が大型化・重量増の傾向</strong>があり設置スペース確認が必要</li>
        <li>駆け込み需要期は<strong>工事予約が取りにくくなる</strong>可能性がある</li>
        <li>「本体のみ（工事なし）」の商品は<strong>別途工事費が必要</strong>（誤購入に注意）</li>
      </ul>

      <h3>① 標準工事外は追加費用——事前確認で防げるトラブル</h3>
      <p>
        「工事費込み」は<strong>標準工事の範囲内の費用</strong>が含まれるという意味です。
        配管延長・隠蔽配管・コンセント増設・電圧変更工事など標準外の作業は別途追加費用が発生します。
        不安な場合は購入前に工事業者へ現地見積りを依頼しておくとトラブルを防げます。
      </p>

      <h3>② メーカーおまかせは機種・メーカーを指定できない</h3>
      <p>
        メーカーおまかせタイプは費用を抑えられますが、<strong>届くメーカーや型番はお任せ</strong>です。
        特定メーカーの機能（空気清浄・自動掃除など）にこだわりがある場合はメーカー指定のセットを選んでください。
      </p>

      <h3>③ 2027年基準の新型は室外機が大型化する可能性</h3>
      <p>
        省エネ基準引き上げへの対応で、新型モデルの<strong>室外機は大型化・重量増の傾向</strong>があると指摘されています。
        設置スペースが限られているマンション・狭小住宅では事前にサイズを確認しておくことをおすすめします。
      </p>

      <h3>④ 工事予約の混雑——早めに動くと余裕が生まれる</h3>
      <p>
        2027年問題の認知が広がるにつれ、工事予約が集中して<strong>希望時期に工事が取れなくなる可能性</strong>があります。
        繁忙期（夏直前など）も重なると状況がさらに混みやすいため、余裕をもって計画するのが賢明です。
      </p>

      <h3>⑤ 「本体のみ（工事なし）」との混同に注意</h3>
      <p>
        通販サイトでは「本体のみ（工事なし）」と「工事費込みセット」が同じ商品名で別々に掲載されていることがあります。
        本体のみを選んだ場合は別途工事費が必要です。<strong>購入前に商品ページで工事費込みかどうかを必ずご確認ください</strong>。
      </p>

      {/* ── 末尾サマリーCTA ── CV-9 */}
      <div className="not-prose my-8 rounded-2xl border-2 border-accent/30 bg-blush p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent/70">
          ▼ この記事で紹介したモデルを楽天で確認する
        </p>
        <p className="mb-4 text-xs text-ink/55">※価格・在庫は時期により変動します。最新情報は各ストアでご確認ください。</p>
        <div className="space-y-2">
          <CtaRow
            label="エアコン 6畳 工事費込みセット（メーカーおまかせ）"
            sub="安さ重視 / 6畳 / 100V / 全国工事対応"
            aff={omakase.affiliate}
          />
          <CtaRow
            label="アイリスオーヤマ エアコン Gシリーズ（工事費込み）"
            sub="安さ重視 / 6〜20畳展開 / メーカー指定"
            aff={iris.affiliate}
          />
          <CtaRow
            label="ダイキン S285ATES-W（10畳・工事費込み）"
            sub="省エネ重視 / 10畳 / ダイキン スタンダード"
            aff={daikin.affiliate}
          />
          <CtaRow
            label="三菱 霧ヶ峰 MSZ-ZW5625S-W（18畳・工事費込み）"
            sub="省エネ重視 / 18畳 / 霧ヶ峰Zシリーズ 省エネ上位機"
            aff={mitsu.affiliate}
          />
          <CtaRow
            label="パナソニック エオリア CS-635DEX2-W（20畳・工事費込み）"
            sub="省エネ重視 / 20畳 / エオリアEX 省エネ上位機"
            aff={panasonic.affiliate}
          />
        </div>
        <p className="mt-3 text-center text-xs text-ink/40">
          ※アフィリエイト広告を利用しています
        </p>
      </div>

      {/* ================================================================
          FAQ
      ================================================================ */}
      <h2>よくある質問（エアコン2027年問題・工事費込みセット）</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="text-sm font-bold text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/75">A. {x.a}</p>
          </div>
        ))}
      </div>

      {/* ================================================================
          内部リンク
      ================================================================ */}
      <h2>あわせて読みたい——夏の暮らしをもっとラクにする</h2>
      <p>
        エアコンで夏の快適さを確保しつつ、除湿やお水まわりも一緒に見直すと暮らし全体の満足度が上がりやすくなります。
      </p>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/joshitsuki-koukai" className="font-bold text-accent hover:underline">
            除湿機は後悔する？コンプレッサー式・デシカント式の違いとシャープ CV-S71を正直解説
          </Link>
          （エアコンと併用して梅雨の部屋干し・カビ対策をしたい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/premium-water" className="font-bold text-accent hover:underline">
            プレミアムウォーターのレビュー・料金まとめ
          </Link>
          （夏の水分補給・赤ちゃんのミルクに天然水ウォーターサーバーを検討している方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/drum-washer-koukai" className="font-bold text-accent hover:underline">
            ドラム式洗濯機おすすめ5選比較——乾燥方式（ヒーター・無排気・ヒートポンプ）の違いで選ぶ
          </Link>
          （エアコンで夏の環境を整えつつ洗濯乾燥まで自動化したい方に）
        </li>
      </ul>
    </article>
  );
}
