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

const PATH = "/reviews/robot-cleaner-koukai";
const TITLE = "ロボット掃除機は後悔する？DEEBOT N20 PRO PLUSとルンバ205の違いを比較";

/**
 * ざっくり比較表用に絞ったスペック。
 * 吸引力はDEEBOT（絶対値：Pa）とルンバ（相対値：旧機種比の倍率）で測定基準が異なるため、
 * あえてラベルを分けて別々の行にし、同じ行で数値を並べて誤認させないようにしている。
 */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "ecovacs-deebot-n20-proplus-cleaner": [
    { label: "タイプ", value: "自動ゴミ収集ステーション付き" },
    { label: "吸引力（絶対値表記）", value: "8,000Pa" },
    { label: "ダストボックス", value: "400ml" },
  ],
  "irobot-roomba-205-cleaner": [
    { label: "タイプ", value: "ゴミ収集ステーション不要（本体内でゴミを圧縮）" },
    { label: "吸引力（旧機種比の倍率表記）", value: "最大70倍（Roomba 600シリーズ比・2025年2月時点）" },
    { label: "ゴミ捨て", value: "最大60日間不要（すべての家庭環境で期間を保証するものではありません）" },
  ],
};

const faq = [
  {
    q: "DEEBOT N20 PRO PLUSとルンバ205の一番大きな違いは何ですか？",
    a: "設計思想の違いです。DEEBOT N20 PRO PLUSは自動ゴミ収集ステーション付きで、本体のダストボックスのゴミをステーションに自動で集めます。ルンバ205 DustCompactor Comboはステーションを使わず、本体内でゴミを圧縮する仕組みです。「ステーションを置くか置かないか」が選び方の分かれ目になります。",
  },
  {
    q: "ルンバ205は本当に60日間ゴミ捨てが不要ですか？",
    a: "ルンバ205はDustCompactorという機構で本体内のゴミを圧縮し、メーカーは最大60日間ゴミ捨て不要と公表しています。ただしこれはすべての家庭環境において期間を保証するものではなく、部屋の広さやゴミの量によって変わります。",
  },
  {
    q: "DEEBOTとルンバ、吸引力はどちらが強いですか？",
    a: "この2機種は吸引力の表記基準がまったく異なるため、単純比較はできません。DEEBOT N20 PRO PLUSは「8,000Pa」という絶対値、ルンバ205は「最大70倍（旧機種であるRoomba 600シリーズとの比較、2025年2月時点）」という相対値で公表されています。どちらが強いかを数値だけで判断することはできないため、参考程度にとどめてください。",
  },
  {
    q: "ゴミ収集ステーションを置くスペースがない場合はどうすればいいですか？",
    a: "設置スペースの確保が難しい場合は、ステーションが不要なルンバ205 DustCompactor Comboが選択肢になります。本体内でゴミを圧縮する仕組みのため、ステーション分の設置スペースを考えずに済みます。",
  },
  {
    q: "段差や家具の下も掃除できますか？",
    a: "DEEBOT N20 PRO PLUSは20mmのしきい値までの段差を乗り越えられるとメーカーが公表しています。ルンバ205の具体的な乗り越え段差の数値は公表情報の範囲では確認できなかったため、この記事では言及していません。お使いの家具の高さ・段差は購入前にメーカー公式サイトでご確認ください。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "エコバックス DEEBOT N20 PRO PLUS（自動ゴミ収集ステーション付き）とルンバ205 DustCompactor Combo（ステーション不要）を徹底比較。ロボット掃除機で後悔しやすい5つのポイントと、それぞれが向いている人を編集部が解説します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-07-19",
  });
}

export default async function RobotCleanerKoukaiPage() {
  const all = await getAllProducts();
  const deebot = all.find((p) => p.slug === "ecovacs-deebot-n20-proplus-cleaner")!;
  const roomba = all.find((p) => p.slug === "irobot-roomba-205-cleaner")!;
  const items = [deebot, roomba];

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
      <JsonLd data={reviewJsonLd(deebot, PATH, { includeReview: false })} />
      <JsonLd data={productJsonLd(roomba.name, roomba.brand)} />
      <JsonLd data={faqJsonLd(faq)} />

      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "掃除機", path: "/category/vacuum" },
          { name: "ロボット掃除機は後悔する？", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-07-19</p>

      <p>
        「ゴミ収集ステーションが思ったより大きくて置き場所に困った」「充電ドックの配線がごちゃついた」——ロボット掃除機は毎日の掃除がラクになる一方で、こうした後悔の声も見かけます。
      </p>
      <p>
        この記事では、自動ゴミ収集ステーション付きの<strong>エコバックス DEEBOT N20 PRO PLUS</strong>と、ステーションを使わず本体内でゴミを圧縮する<strong>ルンバ205 DustCompactor Combo</strong>を例に、後悔しやすいポイントと2機種の設計思想の違いを整理します。
      </p>

      <h2>ロボット掃除機で後悔しやすい5つのポイント</h2>
      <p>購入前に知っておくと後悔しにくくなるポイントを5つにまとめました。</p>

      <h3>① ゴミ収集ステーションの置き場所</h3>
      <p>
        自動ゴミ収集ステーション付きのモデルは、<strong>ステーション本体の設置スペース</strong>を事前に確保しておく必要があります。
        DEEBOT N20 PRO PLUSはステーション付きのため、コンセント位置や壁際のスペースを購入前にイメージしておくと安心です。
        一方、ルンバ205 DustCompactor Comboはステーションを使わず本体内でゴミを圧縮する仕組みのため、充電ステーションのみ（奥行13.4×幅14.6×高さ8.8cm）を置くスペースで済みます。
      </p>

      <h3>② 家具の下に入らない高さ</h3>
      <p>
        ロボット掃除機は本体の高さによって、ソファやベッドの下に入れるかどうかが変わります。
        購入前に、お使いの家具の下の隙間の高さと本体サイズを見比べておくと後悔しにくくなります。
        ルンバ205の本体サイズは奥行35.9×幅35.8×高さ10.1cmです。DEEBOT N20 PRO PLUSの本体の高さは、この記事で確認できた公表情報の範囲には含まれていないため、購入前にメーカー公式サイトでご確認ください。
      </p>

      <h3>③ 段差・コード類</h3>
      <p>
        段差の乗り越え性能やコード類への対応は機種によって差があります。
        DEEBOT N20 PRO PLUSは20mmのしきい値までの段差を乗り越えられるとメーカーが公表しています。
        ルンバ205の具体的な乗り越え段差の数値は、この記事で確認できた公表情報の範囲には含まれていません。
        いずれの機種も、掃除する部屋にコード類が這っていると引っかかりの原因になるため、事前に片付けておくのがおすすめです。
      </p>

      <h3>④ 水拭き機能の使い勝手</h3>
      <p>
        DEEBOT N20 PRO PLUSは「OZMO Pro 2.0」という高周波振動モップシステムを搭載し、水タンク180mlで水拭きします。
        ルンバ205 DustCompactor Comboはマイクロファイバーモップパッドを使い、スマートスクラブに対応。カーペットを自動検知してラグを避けて拭き掃除ができます。
        <strong>水拭き機能の仕組みが異なる</strong>ため、ラグやカーペットが多いお部屋かどうかで選び方が変わります。
      </p>

      <h3>⑤ メンテナンスの手間</h3>
      <p>
        DEEBOT N20 PRO PLUSは4段階ろ過システムとダストバッグ不要のダストコンテナ設計、ZeroTangle Anti-Tangleテクノロジーでローラーブラシへの髪の絡まりを防ぐ設計です。
        ルンバ205はゴム製シングルアクションブラシとエッジクリーニングブラシを採用しています。
        どちらの機種も、ブラシやフィルターなどの消耗パーツは<strong>定期的な確認・お手入れ</strong>が必要です。交換時期の目安はメーカー公式サイトでご確認ください。
      </p>

      <h2>DEEBOT N20 PRO PLUSとルンバ205の違い</h2>
      <p>
        2機種の根本的な違いは<strong>「自動ゴミ収集ステーション付き」か「ステーション不要」か</strong>という設計思想です。
      </p>
      <p>
        DEEBOT N20 PRO PLUSは、本体が集めたゴミを自動ゴミ収集ステーションに送り込む仕組みです。
        本体のダストボックスは400mlで、ステーションにゴミがまとまることでダストボックスの手動処理の頻度を減らせます。
        バッテリーは5200mAh、段差は20mmのしきい値まで乗り越え可能です。
      </p>
      <p>
        一方ルンバ205 DustCompactor Comboは、ステーションを使わず<strong>本体内でゴミを圧縮する「DustCompactor」</strong>という機構を採用しています。
        メーカーは条件が揃えば最大60日間ゴミ捨て不要と公表していますが、<strong>すべての家庭環境において期間を保証するものではありません</strong>。
        充電ステーションのサイズは奥行13.4×幅14.6×高さ8.8cmとコンパクトで、ClearView LiDARによるマッピング、進入禁止・拭き掃除禁止エリアの設定にも対応しています。
      </p>

      <div className="not-prose my-5 rounded-xl border-2 border-accent/30 bg-blush/40 p-4">
        <p className="mb-1.5 text-sm font-bold text-ink">⚠️ 吸引力の数値について（表記基準が異なります）</p>
        <p className="text-sm leading-relaxed text-ink/75">
          DEEBOT N20 PRO PLUSの「8,000Pa」は吸引力そのものを示す<strong>絶対値</strong>です。
          一方ルンバ205の「最大70倍」は、国内累計出荷台数トップのRoomba 600シリーズとの比較（2025年2月時点）による<strong>相対値（倍率）</strong>で、測定の基準がまったく異なります。
          この2つの数値を並べて「どちらが強い」と単純比較することはできません。あくまで各メーカーが公表した測定条件の範囲での数値としてご参照ください。
        </p>
      </div>

      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「ステーション付きかステーション不要か」を軸にしているため、おすすめバッジは表示していません。
        吸引力は測定基準が異なるため、あえて別の行に分けて掲載しています（上記の注記もあわせてご確認ください）。
        スペックはメーカー公表値です。詳しい仕様は各商品の見出し以降で解説します。
      </p>

      <h2>DEEBOT N20 PRO PLUSが向いている人</h2>
      <ProductCard p={deebot} />

      <h2>ルンバ205 DustCompactor Comboが向いている人</h2>
      <ProductCard p={roomba} />

      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
          </div>
        ))}
      </div>

      <h2>まとめ：住まいのタイプで選ぶ</h2>
      <p>
        DEEBOT N20 PRO PLUSとルンバ205 DustCompactor Comboは、
        <strong>「ゴミ収集ステーションを置くスペースがあるかどうか」</strong>で選び方が大きく変わります。
      </p>
      <ul>
        <li><strong>ダストボックスの手動処理をできるだけ減らしたい、ステーションを置くスペースがある</strong>ならDEEBOT N20 PRO PLUS</li>
        <li><strong>ステーションを置くスペースを確保しにくい、細かいエリア設定をしたい</strong>ならルンバ205 DustCompactor Combo</li>
      </ul>
      <p>
        吸引力の数値は表記基準が異なるため単純比較はできません。ご自宅の間取り・設置スペース・家具の高さを確認したうえで選ぶと後悔しにくくなります。
      </p>
    </article>
  );
}
