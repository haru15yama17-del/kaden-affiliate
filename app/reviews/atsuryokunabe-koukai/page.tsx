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

const IMG_BASE = "/images/reviews/atsuryokunabe-koukai";

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

const PATH = "/reviews/atsuryokunabe-koukai";
const TITLE = "電気圧力鍋で後悔しない？アイリスオーヤマ KPC-MA4の弱点と、ホットクックとの方式の違いを正直に解説";

/** ざっくり比較表用に「容量・調理方式・得意料理・最大の強み」だけへ絞ったスペック */
const compactSpecs: Record<string, { label: string; value: string }[]> = {
  "iris-kpc-ma4-pressurecooker": [
    { label: "容量", value: "4.0L（最大4人分）" },
    { label: "調理方式", value: "加圧・無水・蒸し・低温・発酵・炊飯" },
    { label: "得意料理", value: "角煮・チャーシュー・カレー・豆類・煮込み料理" },
    { label: "最大の強み", value: "価格を抑えて加圧調理を試せること" },
  ],
  "sharp-kn-hw24h-hotkook": [
    { label: "容量", value: "2.4L（2〜6人向け）" },
    { label: "調理方式", value: "水なし自動調理・蒸し・低温調理・強火調理（加圧なし）" },
    { label: "得意料理", value: "無水カレー・炒め煮・蒸し料理・低温調理" },
    { label: "最大の強み", value: "無水調理と自動かきまぜでほったらかし調理できること" },
  ],
};

const faq = [
  {
    q: "電気圧力鍋とホットクックの違いは何ですか？",
    a: "大きな方向性の違いは「調理方式」です。電気圧力鍋（KPC-MA4など）は密閉して圧力をかけ、硬い肉や角煮をやわらかく仕上げる加圧調理が得意です。一方ホットクックは圧力をかけず、無水調理と自動かきまぜ（まぜ技ユニット）で煮物・無水カレーなどを作るのが得意です。どちらが上ということではなく、作りたい料理と使い方で選ぶのが基本です。",
  },
  {
    q: "KPC-MA4の4.0Lは何人分が目安ですか？",
    a: "容量は4.0Lで、メーカーは最大4人分を目安としています。ただし圧力調理では満水まで入れられず、実際に調理に使える量はこれより少なくなります。カレーで大人4人＋少々が一つの目安で、育ち盛りのお子さんが複数いる家庭ではやや物足りなく感じることもあります。分量は作る料理によって変わります。",
  },
  {
    q: "予約調理はできますか？注意点はありますか？",
    a: "KPC-MA4は予約タイマーに対応しています。ただし電気圧力鍋の予約機能は機種により方式が異なり、「調理の開始時刻を遅らせるだけ」のタイプの場合、生肉や生魚を入れて長時間常温で待たせることになり、特に夏場は衛生面の不安があります。生ものを使う予約調理を考えている場合は、購入前に保温・腐敗防止に関する仕様や注意書きを必ず確認してください。",
  },
  {
    q: "電気圧力鍋のデメリットは何ですか？",
    a: "主に4点です。(1)予熱・加圧・減圧を含めると総調理時間は短くならず「すぐ食べられる」家電ではないこと、(2)炒め物は水分が出やすく煮込み中心になりやすいこと、(3)調理中のにおいが部屋に広がる・パッキンへのにおい移りの手入れが必要なこと、(4)本体が大きく消費電力も高めで設置場所と単独コンセントが必要なこと。メリットとあわせて理解しておくと後悔を防ぎやすくなります。",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: `${TITLE}｜主婦の家電と暮らし研究室`,
    description:
      "アイリスオーヤマ 電気圧力鍋 KPC-MA4で後悔しやすいポイントを、加圧式のメリット・デメリットとあわせて中立に解説。ホットクック（KN-HW24H）との調理方式の違いや選び方も比較表で紹介します。",
    path: PATH,
    type: "article",
    modifiedTime: "2026-06-04",
  });
}

export default async function AtsuryokunabeKoukaiPage() {
  const all = await getAllProducts();
  const kpc = all.find((p) => p.slug === "iris-kpc-ma4-pressurecooker")!;
  const hw24h = all.find((p) => p.slug === "sharp-kn-hw24h-hotkook")!;
  const yoshikei = all.find((p) => p.slug === "yoshikei")!;

  const compactItems = [kpc, hw24h].map((p) => ({
    ...p,
    rating: undefined,
    specs: compactSpecs[p.slug] ?? [],
  }));

  return (
    <article className="prose-article max-w-none pb-20">
      <JsonLd data={reviewJsonLd(kpc, PATH)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs
        items={[
          { name: "トップ", path: "/" },
          { name: "調理家電", path: "/category/cooking" },
          { name: "電気圧力鍋は後悔する？", path: PATH },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-2 text-sm text-ink/55">更新日：2026-06-04</p>

      <ArticleImage
        src={`${IMG_BASE}/hero.svg`}
        alt="電気圧力鍋本体のシルエットと、加圧調理・予約調理・ほったらかし・煮込みの機能アイコンを示す図解"
        caption="加圧調理・予約調理・ほったらかし・煮込み——材料を入れてボタンを押すスタイルの調理家電"
      />

      <RecommendBox
        name="アイリスオーヤマ 電気圧力鍋 KPC-MA4"
        bestFor={["角煮やチャーシューなど硬い肉をやわらかく煮込みたい家庭"]}
        aff={kpc.affiliate}
      />

      <h2>最初に結論：電気圧力鍋とホットクックは「方式」で選ぶ家電です</h2>
      <p>
        アイリスオーヤマの電気圧力鍋「KPC-MA4」は、密閉して圧力をかける
        <strong>加圧調理</strong>
        が得意な調理家電です。角煮やチャーシューなど、コンロでは時間のかかる硬い肉を短い加圧時間でやわらかく仕上げられるのが特長で、本体価格もホットクックより手が届きやすい傾向があります。
      </p>
      <p>
        一方で、無水カレーや煮物を自動かきまぜでほったらかし調理したいなら、圧力をかけない
        <strong>ホットクック</strong>
        のほうが向く場面もあります。どちらが優れているという話ではなく、作りたい料理と使い方で選ぶのが失敗しないコツです。下の早見表で、まず自分がどちら寄りかを確認してみてください。
      </p>

      <div className="not-prose grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-ok/20 bg-ok/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ 電気圧力鍋（KPC-MA4）が向いている人</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            <li>角煮・チャーシュー・煮豆など、硬い食材をやわらかく仕上げたい</li>
            <li>調理は休日や帰宅後にまとめて行うことが多い</li>
            <li>本体価格をできるだけ抑えて始めたい</li>
          </ul>
        </div>
        <div className="rounded-xl border border-ng/20 bg-ng/5 p-4">
          <p className="mb-2 text-sm font-bold text-ink">▼ ホットクックのほうが向いている人</p>
          <ul className="space-y-1.5 text-sm text-ink/75">
            <li>朝に仕込んで、帰宅後すぐ食べたい（加熱後も適温キープしたい）</li>
            <li>無水カレーや煮物を、自動かきまぜでほったらかしにしたい</li>
            <li>圧力をかけずに作れるメニュー中心で考えている</li>
          </ul>
        </div>
      </div>

      <HaruBubble label="はるの取材メモから">
        <p>
          家電量販店で店員さんに話を聞いたところ、ファミリーで人気の容量はホットクックが2.4L、電気圧力鍋は4L前後が売れ筋とのことでした。我が家でもKPC-MA4でカレーを作ってみましたが、私の環境では予熱・加圧・減圧をあわせて約50分ほどかかりました（分量や機種で変わります）。圧力調理そのものは15分ほどでも、すぐにフタを開けられないのが正直「盲点だったな」という印象です。
        </p>
        <p className="mt-2">
          角煮は予熱・減圧込みで1時間ほどかかったものの、箸で切れるやわらかさになったのは加圧式ならではだと感じました。一方で、4Lでも実際に使える量は2.6L程度で、育ち盛りの子ども2人だと「もう少し欲しい」と感じる場面もありました。あくまで私の使い方での感想なので、ご家庭の人数や作る料理に置き換えて読んでくださいね。
        </p>
      </HaruBubble>

      <h2>電気圧力鍋のデメリット・後悔しやすい5つのポイント</h2>
      <p>
        加圧調理の便利さは確かですが、「思っていたのと違った」と後悔しやすいポイントもあります。メリットと並べて、正直にお伝えします。
      </p>

      <h3>① 「時短」と「総調理時間」は別物（すぐには食べられない）</h3>
      <p>
        圧力調理の時間だけを見ると短く感じますが、実際には
        <strong>予熱→加圧→減圧</strong>
        の工程が前後に加わります。私の環境ではカレーで合計約50分かかりました（分量・機種で変わります）。減圧が終わるまでフタを開けられないため、「ボタンを押せばすぐ食べられる」と思って買うと、ここで肩透かしを感じやすいです。
      </p>
      <p>
        <strong>考え方</strong>
        ：電気圧力鍋は“スピード家電”というより、火のそばを離れて他のことをしている間に仕上がる“ほったらかし家電”として捉えると、後悔しにくくなります。
      </p>

      <h3>② 炒め物は苦手で、煮込み中心になりやすい</h3>
      <p>
        密閉して加熱する構造のため、炒め物は水分が出やすく、シャキッと仕上げるのは得意ではありません。結果として「煮込み専用機」として使うことが多くなりがちです。カレー・角煮・煮物・スープなどが中心の家庭なら相性が良い一方、炒め調理を重視する人には物足りなく感じられることがあります。
      </p>

      <h3>③ においが部屋に広がる・パッキンへのにおい移り</h3>
      <p>
        調理中や減圧時に蒸気が出るため、料理のにおいが部屋に広がりやすい点も知っておきたいところです。さらに、フタのパッキン（ゴムパッキン）にカレーなどのにおいが移りやすく、放置すると次の料理に影響することがあります。重曹を入れて煮洗いするなど、定期的なお手入れが必要です。
      </p>

      <h3>④ サイズと置き場所・消費電力（炊飯器がもう一台増える感覚）</h3>
      <p>
        フタを閉めた状態の本体はやや大きく、キッチンに「炊飯器がもう一台増える」ような感覚になります。加えて消費電力が高めなので、電子レンジなど他の家電と同じ系統で同時に使うとブレーカーが落ちやすいことがあります。設置場所の寸法を測るとともに、できれば単独のコンセントで使うのがおすすめです。
      </p>

      <ArticleImage
        src={`${IMG_BASE}/comparison.svg`}
        alt="電気圧力鍋の「加圧式」と、ホットクックの「無水・自動かきまぜ式」の調理方式の違いを示す図解"
        caption="加圧式（密閉して圧力をかける）と、無水・自動かきまぜ式の方向性の違い（一般的な図解）"
      />

      <h3>⑤ 予約調理は「食中毒リスク」に注意（購入前に要確認）</h3>
      <p>
        電気圧力鍋の予約機能は、機種によって方式が異なります。
        <strong>「調理の開始時刻を遅らせるだけ」のタイマー式</strong>
        の場合、生肉や生魚を入れたまま長時間常温で待つことになり、特に気温の高い夏場は衛生面のリスクがあります。
      </p>
      <p>
        <strong>注意点</strong>
        ：生ものを使う予約調理を考えている場合は、購入前に「保温しながら待つ仕様か」「腐敗・食中毒防止に関する注意書き」があるかを必ず確認してください。心配な場合は、加熱後に適温キープする方式のホットクックなど、別の選択肢も検討に入れると安心です。これは読者の方の安全に関わるため、メリットだけでなく必ず知っておいてほしいポイントです。
      </p>

      <h2>KPC-MA4とホットクック（KN-HW24H）を比較</h2>
      <p>
        ここで、電気圧力鍋の代表としてアイリスオーヤマ KPC-MA4、無水・自動かきまぜ式の代表としてシャープのホットクック KN-HW24H をスペックで並べてみます。
      </p>

      <ComparisonTable items={compactItems} highlightBest={false} />

      <p className="text-sm text-ink/55">
        ※「優劣」ではなく「加圧式か、無水・自動かきまぜ式か」を軸にしているため、おすすめバッジは表示していません。
        価格を抑えて加圧調理をしたいなら KPC-MA4、無水・自動かきまぜや加熱後の適温キープを重視するなら KN-HW24H、というように
        <strong>得意分野で選ぶ</strong>
        のがポイントです。より詳しい仕様は下の「方式での違い」表もあわせてご確認ください。
      </p>

      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-ink/15 shadow-card">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-xs font-semibold text-ink/50">
              <th className="p-3">方式での違い</th>
              <th className="p-3 text-ink">電気圧力鍋 KPC-MA4</th>
              <th className="p-3 text-ink">ホットクック KN-HW24H</th>
            </tr>
          </thead>
          <tbody className="text-ink/75">
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">調理方式</td>
              <td className="p-3">加圧・無水・蒸し・低温・発酵・炊飯</td>
              <td className="p-3">無水自動調理・蒸し・低温（圧力はかけない）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">自動かきまぜ</td>
              <td className="p-3">なし（手動でまぜる）</td>
              <td className="p-3">あり（まぜ技ユニット）</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">予約調理の方式</td>
              <td className="p-3">予約タイマーあり（機種により開始を遅らせる方式は要確認）</td>
              <td className="p-3">加熱後に適温キープ</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">得意な料理</td>
              <td className="p-3">角煮・チャーシュー・煮豆など加圧でやわらかくする料理</td>
              <td className="p-3">無水カレー・煮物などかきまぜ・無水調理</td>
            </tr>
            <tr className="border-t border-ink/10">
              <td className="p-3 font-medium text-ink/60">手入れ</td>
              <td className="p-3">圧力ピン・バルブ・パッキンなど洗う部品が多め</td>
              <td className="p-3">内鍋・まぜ技ユニットなどを洗う</td>
            </tr>
          </tbody>
        </table>
        <p className="px-3 pb-3 pt-1 text-xs text-ink/45">
          ※方式の特長を中立にまとめた一覧です。詳細な仕様・最新情報は各メーカーの公式ページでご確認ください。
        </p>
      </div>

      <h2>2台を購入できるストア——比較して選ぶ</h2>
      <p>
        価格は変動するため、最新の価格は各ストアでご確認ください。
      </p>
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
          <p className="mb-3 text-sm font-bold text-ink">電気圧力鍋 KPC-MA4</p>
          <div className="mb-3 rounded-lg border-2 border-ok/30 bg-ok/10 p-3">
            <p className="mb-1.5 text-xs font-bold text-ink">🎯 こんな人におすすめ</p>
            <ul className="space-y-1 text-xs text-ink/80">
              {kpc.bestFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <div className="mb-3 rounded-lg bg-ink/5 p-3">
            <p className="mb-1 text-xs font-bold text-ink/50">⚠️ こんな人には向かないかも</p>
            <ul className="space-y-0.5 text-xs text-ink/55">
              {kpc.notFor.map((x, i) => (
                <li key={i}>・{x}</li>
              ))}
            </ul>
          </div>
          <AffiliateButtons aff={kpc.affiliate} productName={kpc.name} />
        </div>
        <div className="rounded-xl border border-ink/15 bg-white p-4 shadow-card">
          <p className="mb-3 text-sm font-bold text-ink">ホットクック KN-HW24H</p>
          <div className="mb-3 rounded-lg border-2 border-ok/30 bg-ok/10 p-3">
            <p className="mb-1.5 text-xs font-bold text-ink">🎯 こんな人におすすめ</p>
            <ul className="space-y-1 text-xs text-ink/80">
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
      </div>

      <h2>あわせて読みたい・暮らしをラクにする組み合わせ</h2>
      <p>
        電気圧力鍋でもホットクックでも、共通の弱点は「結局、献立を考えて材料を準備する手間は残る」こと。ここを軽くすると、調理家電の満足度はさらに上がりやすくなります。
      </p>
      <ul>
        <li>
          ▶{" "}
          <Link href="/reviews/hotcook-koukai" className="font-bold text-accent hover:underline">
            ホットクックで後悔しない？店頭で聞いた5つのデメリットと選び方
          </Link>
          （無水・自動かきまぜ式と迷っている方はこちら）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/oisix" className="font-bold text-accent hover:underline">
            はるのオイシックス（Kit Oisix）体験レビュー記事はこちら
          </Link>
          （カット済み食材で下ごしらえを軽くしたい方に）
        </li>
        <li>
          ▶{" "}
          <Link href="/reviews/yoshikei" className="font-bold text-accent hover:underline">
            はるのヨシケイ体験レビュー記事はこちら
          </Link>
          （毎日届くミールキットで買い物を減らしたい方に）
        </li>
      </ul>

      <h2>まとめ：電気圧力鍋は「加圧調理を活かす人」なら後悔しにくい</h2>
      <p>
        KPC-MA4の後悔ポイントは、総調理時間・炒め物の苦手さ・におい・サイズと消費電力・予約調理の衛生面の5つ。いずれも「加圧式の特性」を理解して使えば、多くは対策できます。
      </p>
      <p>
        角煮やチャーシューなど、硬い肉をやわらかく仕上げたい家庭で、価格を抑えて加圧調理を始めたいなら、KPC-MA4は有力な選択肢です。逆に、朝に仕込んで帰宅後すぐ食べたい・無水カレーや自動かきまぜ中心という人は、ホットクックも比較してから決めると後悔しにくくなります。自分の作りたい料理と使い方に、どちらの方式が合うかを基準に選んでみてください。
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

      <div className="not-prose my-8 rounded-2xl border-2 border-accent/30 bg-blush p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent/70">
          ▼ 材料を切る手間まで減らしたい方へ
        </p>
        <p className="mb-4 text-sm leading-relaxed text-ink/75">
          電気圧力鍋もホットクックも、加熱そのものはほったらかしにできますが、「材料を切って揃える」下ごしらえの手間は残ります。
          ここまで軽くしたい方には、カット済み食材が届くヨシケイのミールキットとの組み合わせも一案です。
          私自身、忙しい平日はミールキットをそのまま入れるだけで済ませる日が増え、下ごしらえの負担が減った実感があります。
        </p>
        <AffiliateButtons aff={yoshikei.affiliate} productName={yoshikei.name} />
      </div>
    </article>
  );
}
