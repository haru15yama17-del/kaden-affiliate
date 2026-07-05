import { getAllProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { reviewJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecommendBox } from "@/components/RecommendBox";
import { AffiliateButtons } from "@/components/AffiliateButtons";
import { ComparisonTable } from "@/components/ComparisonTable";
import Link from "next/link";
import type { ReactNode } from "react";

const IMG_BASE = "/images/reviews/hotcook-koukai";

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

const PATH = "/reviews/hotcook-koukai";
const TITLE = "ホットクックで後悔しない？店頭で聞いた5つのデメリットと、それでも共働き家庭に選ばれる理由";

/** ざっくり比較表用に「容量・かきまぜ機能・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "sharp-kn-hw24h-hotkook": [
    { label: "容量", value: "2.4L（2〜6人向け）" },
    { label: "かきまぜ機能", value: "あり（まぜ技ユニット搭載・自動かき混ぜ）" },
    { label: "最大の強み", value: "3モデル中最大容量で作り置き・大家族向き、強火調理にも対応" },
  ],
  "sharp-kn-hw16h-hotkook": [
    { label: "容量", value: "1.6L（2〜4人向け）" },
    { label: "かきまぜ機能", value: "あり（まぜ技ユニット搭載・自動かき混ぜ）" },
    { label: "最大の強み", value: "価格と容量のバランスが良く、夫婦+子ども1〜2人にちょうど良いサイズ" },
  ],
  "sharp-kn-hw10g-hotkook": [
    { label: "容量", value: "1.0L（1〜2人向け）" },
    { label: "かきまぜ機能", value: "あり（まぜ技ユニット搭載・自動かき混ぜ、proシリーズ共通機能）" },
    { label: "最大の強み", value: "3モデル中もっとも価格が安く小型、持ち手がなく置きやすい" },
  ],
};

const faq = [
  {
    q: "ホットクックの型番（KN-HW24H/16H/10G）の違いは何ですか？",
    a: "型番の数字は容量を表します（24＝2.4L／16＝1.6L／10＝1.0L）。末尾のアルファベットは発売世代で、Hが2024年モデル、Gが2021年モデルです。容量が大きいほど対応人数が増え、価格も上がります。",
  },
  {
    q: "ホットクックを置くにはどれくらいのスペースが必要ですか？",
    a: "2.4Lモデルは横幅約35cm×奥行31cmが目安です。左右の持ち手が張り出すぶん横幅を取るので、購入前に必ず設置場所をメジャーで確認してください。",
  },
  {
    q: "ホットクックは時短家電ですか？",
    a: "加熱自体は30〜60分かかるため、コンロのような「すぐできる」家電ではありません。朝に予約調理をセットしておき、帰宅後すぐ食べられるようにする使い方が本来の強みです。",
  },
  {
    q: "迷ったらどのモデルを選べばいいですか？",
    a: "容量・価格・置きやすさのバランスが良いKN-HW16H（1.6L）が、夫婦＋子ども1〜2人の家庭には無難な選択です。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "ホットクックで後悔しやすい5つのポイントと、KN-HW24H/16H/10Gの選び方を主婦目線で解説。店頭で聞いたリアルな声と実機レビューも掲載。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-06-18",
  });
}

export default async function HotcookKoukaiPage() {
  const all = await getAllProducts();
  const hw24h = all.find((p) => p.slug === "sharp-kn-hw24h-hotkook")!;
  const hw16h = all.find((p) => p.slug === "sharp-kn-hw16h-hotkook")!;
  const hw10g = all.find((p) => p.slug === "sharp-kn-hw10g-hotkook")!;

  const compactItems = [hw24h, hw16h, hw10g].map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  return (
    <article className="prose-article max-w-none pb-20">
      <JsonLd data={reviewJsonLd(hw24h, PATH)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "調理家電", path: "/category/cooking" },
          { name: "ホットクックは後悔する？", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-06-18</p>

      <ArticleImage
        src={`${IMG_BASE}/hero.svg`}
        alt="ホットクック本体のシルエットと、無水調理・予約調理・自動かきまぜ・保温の機能アイコンを示す図解"
        caption="無水調理・予約調理・自動かきまぜ・保温——材料を入れてボタンを押すだけの理由"
      />

      <RecommendBox
        name="ホットクック（ヘルシオ）"
        bestFor={["帰宅後すぐ温かいご飯を食べたい共働き・子育て家庭"]}
        aff={hw16h.affiliate}
      />

      <h2>最初に結論：ホットクックは「人を選ぶ」家電です</h2>
      <p>
        材料を入れてボタンを押すだけで、煮込み・無水調理・低温調理までほったらかしでできるシャープの「ヘルシオ
        ホットクック」。共働き家庭の救世主と言われる一方で、「後悔した」「やめた」という声も一定数あります。
      </p>
      <p>
        先に結論をお伝えすると、ホットクックは
        <strong>合う人にはこれ以上ない時短家電、合わない人には“大きな置き物”</strong>
        になります。下の早見表で、まず自分が向いているか確認してみてください。
      </p>

      <div className="not-prose grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-ok/20 bg-ok/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ こんな人には向いています</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            <li>帰宅後すぐ温かいご飯を食べたい（＝予約調理を使いたい）共働き・子育て家庭</li>
            <li>火のそばに立ちたくない、その間に別のことをしたい</li>
            <li>毎日の献立を考えるのがしんどい</li>
          </ul>
        </div>
        <div className="rounded-xl border border-ng/20 bg-ng/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ こんな人には向きません</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            <li>買い物してきて「今すぐパッと」作って食べたい人</li>
            <li>キッチンに置く場所の余裕がほとんどない人</li>
            <li>コンロで手早く作るのが好き・苦じゃない人</li>
          </ul>
        </div>
      </div>

      <div className="not-prose my-5 rounded-xl border border-accent/20 bg-blush/40 p-4">
        <p className="mb-1 text-sm font-bold text-ink">【はるのワンポイント】</p>
        <p className="text-sm text-ink/75 leading-relaxed">
          実は私、家電量販店の店頭で店員さんに「正直、どんな人が返品したり後悔しがちですか？」とこっそり聞いてみたんです。すると店員さんは苦笑いしながら、「電子レンジのような『すぐ温まるスピード』を期待していた方と、サイズを測らずに買ってしまって『台所に置けなかった』という方ですね」と教えてくれました。このリアルな声を聞いて、ホットクックは「魔法の箱」ではなく、自分の生活スタイルやキッチンの環境に合うかどうかが一番重要なのだと痛感しました。
        </p>
      </div>

      <h2>ホットクックで後悔しやすい5つのデメリット</h2>
      <p>ここからは、実際に購入者が「後悔した」と感じやすいポイントを、対策とセットで正直にお伝えします。</p>

      <h3>① とにかく大きい・置き場所に困る</h3>
      <p>
        一番多い後悔がこれです。2.4Lサイズは5合炊きの炊飯器より大きく、左右の持ち手が張り出しているぶん横幅をとります。「想像以上に大きかった」「置き場所がなくて出し入れが面倒になり、結局使わなくなった」という声はSNSでも定番です。
      </p>
      <p>
        <strong>対策</strong>
        ：購入前に必ず設置場所の幅・奥行き・高さを測ること。2021年以降のモデルは横幅がコンパクトになり、1.0Lモデルは持ち手がなくさらにすっきりします。置き場所に不安があるなら、まずはレンタルで実物の大きさを確かめてから買うのが一番失敗しません。
      </p>

      <ArticleImage
        src={`${IMG_BASE}/size-comparison.svg`}
        alt="ホットクック2.4Lと5合炊き炊飯器の大きさを比較した図解イラスト"
        caption="2.4Lモデルは5合炊き炊飯器よりひと回り大きいサイズ感（目安）"
      />

      <HaruBubble label="はるの実機レビュー">
        <p>
          実際に店頭で2.4Lモデルを見たときの第一印象は、「えっ、炊飯器より全然デカい！」でした（笑）。念のため持参したメジャーで測ってみると、2.4Lモデルは横幅が約35cm。左右の持ち手がガッツリ張り出しているので、我が家の5合炊き炊飯器と並べたらキッチンの作業スペースが完全に消滅するサイズ感でした。購入前は「何となく置けそう」ではなく、必ず
          <strong>横幅35cm×奥行31cm</strong>
          のスペースが確保できるか、巻き尺でしっかり確認してくださいね！
        </p>
      </HaruBubble>

      <h3>② 「時短家電」と思って買うと裏切られる</h3>
      <p>
        ホットクックは“ほったらかし家電”であって、“スピード家電”ではありません。たとえばカレーの加熱は約50分かかります。コンロ感覚で「すぐできる」と思って使うと、「まだ？」とイライラする原因になります。
      </p>
      <p>
        <strong>対策</strong>
        ：朝に材料をセットして予約調理にしておけば、帰宅時に出来たてが完成しています。この「予約調理」こそホットクックの本領です。逆に“即・食べたい”人には電気圧力鍋のほうが向きます。
      </p>

      <h3>③ 価格が高い（本体4〜5万円台）</h3>
      <p>
        現行モデルは4〜5万円台が中心で、決して安い買い物ではありません。「高かったのに使わなくなった」が最大の後悔パターンです。
      </p>
      <p>
        <strong>対策</strong>
        ：いきなり買わず、月数千円のレンタルで「自分の生活に定着するか」を試すのが堅実です。型落ちモデル（後述）を狙えば1万円前後安く買えることもあります。
      </p>

      <h3>④ 型番がわかりにくく、世代で機能差がある</h3>
      <p>
        「KN-HW24H」のような型番は、はじめて見ると暗号のようです。さらに新しい世代でしか作れないメニュー（強火調理など）も増えているため、「安い旧型を買ったら欲しい機能がなかった」という後悔も起きます。
      </p>
      <p>
        <strong>型番の読み方はシンプルです</strong>：
      </p>
      <ul>
        <li><code>24 / 16 / 10</code> ＝ 容量（2.4L / 1.6L / 1.0L）</li>
        <li>末尾のアルファベット ＝ 発売年（<strong>H＝2024年 / G＝2021年 / F＝2020年</strong>）</li>
        <li><code>KN-HW</code> ＝ 自動かきまぜ＋Wi-Fi対応の上位「proシリーズ」</li>
        <li><code>KN-MN</code> ＝ Wi-Fi非搭載・手動かきまぜの入門「withシリーズ」</li>
      </ul>

      <h3>⑤ 慣れとレシピの“最適化”が必要</h3>
      <p>
        最初は「思った味にならない」と感じる人もいます。これは多くが分量や加熱設定への慣れの問題で、公式レシピやレシピ本で勘所をつかむと一気に世界が変わります。
      </p>
      <p>
        <strong>対策</strong>
        ：最初の1〜2週間は公式アプリのレシピ通りに作るのがおすすめ。Wi-Fi対応モデルならメニューを追加ダウンロードしてレパートリーを増やせます。
      </p>

      <h2>後悔しないモデルの選び方（2026年・現行モデル）</h2>
      <p>容量＝家族の人数で選ぶのが基本です。</p>

      <div className="not-prose my-5 grid grid-cols-3 gap-3">
        <figure>
          <img
            src={`${IMG_BASE}/model-hw24h.svg`}
            alt="シャープ ヘルシオ ホットクック KN-HW24H（2.4L）の容量と価格を示すイラスト"
            loading="lazy"
            className="aspect-square w-full rounded-xl border border-ink/10 object-cover shadow-card"
          />
          <figcaption className="mt-1.5 text-center text-xs font-bold text-ink/55">KN-HW24H（2.4L）</figcaption>
        </figure>
        <figure>
          <img
            src={`${IMG_BASE}/model-hw16h.svg`}
            alt="シャープ ヘルシオ ホットクック KN-HW16H（1.6L）の容量と価格を示すイラスト"
            loading="lazy"
            className="aspect-square w-full rounded-xl border border-ink/10 object-cover shadow-card"
          />
          <figcaption className="mt-1.5 text-center text-xs font-bold text-ink/55">KN-HW16H（1.6L）</figcaption>
        </figure>
        <figure>
          <img
            src={`${IMG_BASE}/model-hw10g.svg`}
            alt="シャープ ヘルシオ ホットクック KN-HW10G（1.0L）の容量と価格を示すイラスト"
            loading="lazy"
            className="aspect-square w-full rounded-xl border border-ink/10 object-cover shadow-card"
          />
          <figcaption className="mt-1.5 text-center text-xs font-bold text-ink/55">KN-HW10G（1.0L）</figcaption>
        </figure>
      </div>

      <ComparisonTable items={compactItems} highlightBest={false} />
      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「容量・価格・置きやすさのどれを優先するか」を軸にしているため、おすすめバッジは表示していません。
        3モデルとも自動かきまぜ（まぜ技ユニット）を搭載しています。より詳しい仕様は各商品の見出し以降で解説します。
      </p>

      <p>
        迷ったら、容量と価格と置きやすさのバランスが良い <strong>KN-HW16H</strong> が無難です。
      </p>

      <div className="not-prose my-6 space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <img
              src={`${IMG_BASE}/model-hw24h.svg`}
              alt="ホットクック KN-HW24H（2.4L）の容量を示すイラスト"
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-lg border border-ink/10 object-cover"
            />
            <p className="text-sm font-bold text-ink">▶ 楽天市場で KN-HW24H（2.4L）の最安値を見る</p>
          </div>
          <div className="mb-3 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
            <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
            <ul className="space-y-1 text-sm text-ink/80">
              {hw24h.bestFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <div className="mb-3 rounded-lg bg-ink/5 p-3">
            <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
            <ul className="space-y-0.5 text-xs text-ink/55">
              {hw24h.notFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <AffiliateButtons aff={hw24h.affiliate} productName={hw24h.name} />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-3">
            <img
              src={`${IMG_BASE}/model-hw16h.svg`}
              alt="ホットクック KN-HW16H（1.6L）の容量を示すイラスト"
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-lg border border-ink/10 object-cover"
            />
            <p className="text-sm font-bold text-ink">▶ 楽天市場で KN-HW16H（1.6L）の最安値を見る</p>
          </div>
          <div className="mb-3 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
            <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
            <ul className="space-y-1 text-sm text-ink/80">
              {hw16h.bestFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <div className="mb-3 rounded-lg bg-ink/5 p-3">
            <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
            <ul className="space-y-0.5 text-xs text-ink/55">
              {hw16h.notFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <AffiliateButtons aff={hw16h.affiliate} productName={hw16h.name} />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-3">
            <img
              src={`${IMG_BASE}/model-hw10g.svg`}
              alt="ホットクック KN-HW10G（1.0L）の容量を示すイラスト"
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-lg border border-ink/10 object-cover"
            />
            <p className="text-sm font-bold text-ink">▶ 楽天市場で KN-HW10G（1.0L）の最安値を見る</p>
          </div>
          <div className="mb-3 rounded-xl border-2 border-ok/30 bg-ok/10 p-3.5">
            <p className="mb-1.5 text-sm font-bold text-ink">🎯 こんな人におすすめ</p>
            <ul className="space-y-1 text-sm text-ink/80">
              {hw10g.bestFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <div className="mb-3 rounded-lg bg-ink/5 p-3">
            <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
            <ul className="space-y-0.5 text-xs text-ink/55">
              {hw10g.notFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <AffiliateButtons aff={hw10g.affiliate} productName={hw10g.name} />
        </div>
      </div>

      <h2>ホットクック×食材宅配で「後悔ゼロ」に近づける</h2>
      <p>
        ホットクック最大の弱点は「結局、献立を考えて材料を切る手間は残る」こと。ここを解決すると、満足度が一気に上がります。
      </p>
      <p>
        おすすめは、<strong>カット済み食材やミールキットを“入れるだけ”にできる食材宅配との組み合わせ</strong>
        です。献立を考える時間も、買い物も、下ごしらえも省けるので、「材料を入れてボタンを押すだけ」というホットクック本来のラクさを毎日味わえます。
      </p>

      <ArticleImage
        src={`${IMG_BASE}/meal-kit.svg`}
        alt="ホットクックの鍋アイコンとカット済み食材のアイコンを組み合わせた図解イラスト"
        caption="カット済み食材を入れるだけにすれば、献立も下ごしらえも手放せる"
      />

      <ul>
        <li>
          <strong>オイシックスの「Kit Oisix」</strong>
          ：必要な食材とレシピが2人前20分でセット。ホットクック対応に置き換えやすく、献立に悩みません。
          <br />
          ▶ <Link href="/reviews/oisix" className="font-bold text-accent hover:underline">はるのオイシックス（Kit Oisix）体験レビュー記事はこちら</Link>
        </li>
        <li>
          <strong>ヨシケイのミールキット</strong>
          ：毎日届くから買い物が不要。共働きの平日にぴったり。
          <br />
          ▶ <Link href="/reviews/yoshikei" className="font-bold text-accent hover:underline">はるのヨシケイ体験レビュー記事はこちら</Link>
        </li>
      </ul>
      <p>「ホットクックを買ったのに結局使わない」を防ぐ一番の近道は、“材料の準備すら手放す”ことです。</p>

      <h2>まとめ：ホットクックは「予約調理を使う人」なら後悔しない</h2>
      <p>
        ホットクックの後悔ポイントは、大きさ・スピード・価格・型番・慣れの5つ。でもそのほとんどは「予約調理を前提に使う」「置き場所を先に決める」「容量を正しく選ぶ」で回避できます。
      </p>
      <p>
        火のそばに立たずに、帰宅したら温かいご飯ができている——その生活に価値を感じる共働き・子育て家庭なら、ホットクックは間違いなく“買ってよかった家電”になります。置き場所とサイズだけ確認して、まずは自分の暮らしに合う1台を選んでみてください。
      </p>

      <HaruBubble label="最後にはるから">
        <p>
          私自身、一番「買ってよかった！」と救われているのは、仕事でクタクタな平日夕方です。中学生の子どもがサッカーの練習から「お腹空いたー！」と帰ってきた瞬間、すでにアツアツのカレーやホロホロの牛すじ煮込みが完成している安心感たるや……！コンロの前に立ちっぱなしで調理する時間がゼロになるだけで、心と体力にものすごい余裕が生まれました。
        </p>
        <p className="mt-2">
          最初は操作に戸惑うかもしれませんが、一度「予約調理」のラクさを覚えてしまえば、主婦にとってこれ以上ない最強の相棒になってくれますよ。気になっている方は、まずはご自宅のキッチンのサイズを測ることから始めてみてくださいね！
        </p>
      </HaruBubble>

      <h2>よくある質問</h2>
      <div className="not-prose space-y-3">
        {faq.map((x, i) => (
          <div key={i} className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
            <p className="font-bold text-sm text-ink">Q. {x.q}</p>
            <p className="mt-1.5 text-sm text-ink/75 leading-relaxed">A. {x.a}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
