import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecommendBox } from "@/components/RecommendBox";
import { AffiliateButtons } from "@/components/AffiliateButtons";
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

const PATH = "/reviews/joshitsuki-koukai";
const TITLE = "除湿機おすすめ比較【2026年】コンプレッサー・デシカント・ハイブリッド式の違いと部屋干し向け4選";

const faq = [
  {
    q: "コンプレッサー式とデシカント式の除湿機の違いは何ですか？",
    a: "大きな方向性の違いは「得意な季節」と「消費電力」です。コンプレッサー式は夏の高温多湿に強く、消費電力が比較的少ない傾向があります。一方デシカント式は電熱ヒーターを使うため冬など低温時でも除湿できますが、消費電力が大きく室温が上がりやすいという特性があります。どちらが優れているのではなく、使う季節と環境で選ぶのが基本です。",
  },
  {
    q: "衣類乾燥除湿機は部屋干しの乾燥に使えますか？",
    a: "衣類乾燥除湿機は部屋干しの乾燥用途に使う方が多いです。ただし実際の乾燥時間は洗濯物の量・素材・部屋の広さ・気温などの条件によって大きく変わるため、具体的な時間の断言は難しい状況です。メーカー公式が示す目安とご自宅の環境を照らし合わせてご確認ください。",
  },
  {
    q: "除湿機の電気代はどのくらいかかりますか？",
    a: "除湿機の電気代は、除湿方式・消費電力・1日あたりの使用時間・ご契約の電力料金によって大きく異なります。コンプレッサー式はデシカント式より消費電力が少ない傾向がありますが、機種や運転モードによって差があります。具体的な金額はメーカー仕様書の消費電力値と電力会社の料金単価を参考に計算されることをおすすめします。",
  },
  {
    q: "除湿機のデメリットや後悔しやすいポイントは何ですか？",
    a: "主に4点あります。(1)コンプレッサー式は排熱で運転中に部屋の温度が上がりやすい、(2)タンクに溜まった水を定期的に捨てる必要がある（満水で自動停止する）、(3)運転音が気になる場合がある（特に寝室での夜間使用）、(4)本体に存在感・重量があり置き場所と移動経路の事前確認が必要、です。メリットとあわせて理解しておくと後悔しにくくなります。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "コンプレッサー式・デシカント式・ハイブリッド式の特徴と選び方を比較表で解説。部屋干し・梅雨・結露対策に向くおすすめ4台をスペック・用途別に紹介します。主婦目線のレポートつき。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-06-30",
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
        <p>除湿能力は最大18L/日（60Hz時／50Hzは15.5L/日）と家庭用でもトップクラスのコンプレッサー式。広いリビングや大量の洗濯物をスピーディに乾かしたい人向け。</p>
        <p className="mt-2">コンプレッサー式は冬に弱いのが一般的ですが、この機種は<strong>「冬モード」＋自動霜取り</strong>で室温1℃でも運転できるのが他のコンプレッサー機との違いです。</p>
        <p className="mt-2">👉 パワー重視。広いリビングや梅雨の大量部屋干しを一気に乾かしたい人に。</p>
      </>
    ),
    "panasonic-f-yex120b-dehumidifier": (
      <>
        <p>夏に強いコンプレッサー式と、冬に強いデシカント式を切り替える<strong>ハイブリッド方式</strong>。ナノイーX搭載で部屋干し臭のケアも期待できます。木造16畳／鉄筋32畳までの対応で、家じゅう使いやすい1台。</p>
        <p className="mt-2">季節による乾きにくさのムラが出にくいのが強みですが、そのぶん本体価格は高めです。</p>
        <p className="mt-2">👉 1年中オールマイティに使いたい・初期費用より日々のラクさを取りたい人に。</p>
      </>
    ),
    "iris-circulator-desiccant-dehumidifier": (
      <>
        <p>冬に強いデシカント式の除湿機に、首振りサーキュレーターを組み合わせたモデル。乾いた風を洗濯物に直接当てて乾かす設計です。</p>
        <p className="mt-2">部屋全体の除湿というより<strong>「洗濯物を風で乾かす」</strong>ことに特化。デシカント式なので冬の冷えた脱衣所でも乾燥スピードが落ちにくいのが持ち味です（そのぶん夏は室温が上がりやすい点は注意）。</p>
        <p className="mt-2">👉 冬の寒い部屋・厚手の服の部屋干しに。「空間除湿」より「洗濯物を乾かす」目的の人に。</p>
        <p className="mt-2">なお第三者の検証では、デシカント式ゆえに電気代はやや高め（1時間あたり目安10円台）、衣類の乾燥力は控えめという指摘もあります。空間除湿よりも風で乾かす用途と割り切って選ぶのがよさそうです。</p>
      </>
    ),
  };

  return (
    <article className="prose-article max-w-none pb-20">
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
      <p className="mt-2 text-sm text-ink/55">更新日：2026-06-30</p>

      <ArticleImage
        src={`${IMG_BASE}/hero.svg`}
        alt="除湿機のシルエットと、部屋干し乾燥・カビ対策・タンク式・夏梅雨に強いの機能アイコンを示す図解"
        caption="部屋干し乾燥・カビ対策・タンク式水捨て・梅雨〜夏向け——衣類乾燥除湿機の特徴を示した図解"
      />

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
          コンプレッサー式を毎日4時間使った月の電気代は、私の感覚で<strong>月+1,500〜2,000円程度</strong>の体感でした。
          デシカント式はさらに高くなる傾向があると言われており、使い方・機種・電力料金によって大きく変わります。
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
          コンプレッサー式やハイブリッド式は大容量機種では<strong>重め（12〜15kg程度の機種も多い）</strong>で、
          キャスター付きでないと移動がかなり大変に感じました。電源コードも短めで配置場所に少し悩みました。
        </p>

        <p className="mt-4 mb-0.5 text-xs font-bold text-ink/60">▶ 使ってみて気づいたこと</p>
        <p>
          夏にデシカント式をリビングで動かすと室温が上がりやすく冷房と相殺しやすい点、
          真冬の冷えた洗面所ではコンプレッサー式の除湿力が落ちて乾きにくく感じた点が印象に残りました。
          あくまで私の環境での感想なので、ご自宅の使い方・季節に置き換えて読んでくださいね。
        </p>
      </HaruBubble>

      <h2>除湿機のデメリット・後悔しやすいポイント</h2>
      <p>
        「買ってよかった」と感じる一方で、事前に知っておけばよかったと感じやすいポイントもあります。
        CV-S71個体の断定ではなく、コンプレッサー式の衣類乾燥除湿機全般の注意点として中立にお伝えします。
      </p>
      <ul>
        <li>排熱で運転中に室温が上がりやすい</li>
        <li>タンクの水捨てが必要（満水で自動停止）</li>
        <li>「強」運転は音が大きめ（寝室近くの夜間使用に注意）</li>
        <li>本体が大きく・重め（置き場所と移動経路の事前確認が必要）</li>
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
              <th className="p-3 text-ink">ハイブリッド式</th>
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
              <td className="p-3 font-medium text-ink/60">消費電力の傾向</td>
              <td className="p-3">比較的少ない傾向</td>
              <td className="p-3">電熱ヒーター使用で大きい傾向</td>
              <td className="p-3">中程度（方式による）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">室温への影響</td>
              <td className="p-3">排熱で室温が上がりやすい</td>
              <td className="p-3">ヒーター熱で室温が上がりやすい</td>
              <td className="p-3">方式により異なる</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">本体価格の傾向</td>
              <td className="p-3">比較的手頃な傾向</td>
              <td className="p-3">比較的手頃な傾向</td>
              <td className="p-3">高価な傾向</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">向いている人</td>
              <td className="p-3">梅雨〜夏の部屋干し・カビ対策中心の人</td>
              <td className="p-3">冬の結露対策・年間通じて使いたい人</td>
              <td className="p-3">季節を問わず使いたい・機能重視の人</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※方式の一般的な傾向を示した比較です。具体的なスペック・価格は各メーカー公式ページでご確認ください。
        </p>
      </div>

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
              <HaruBubble label="はるの店頭レポート">
                {haruContents[p.slug]}
              </HaruBubble>
              <AffiliateButtons aff={p.affiliate} />
            </div>
          );
        })}
      </div>

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

      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
          </div>
        ))}
      </div>

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
    </article>
  );
}
