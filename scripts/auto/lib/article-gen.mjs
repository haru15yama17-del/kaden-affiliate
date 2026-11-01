// 方針B：seedの事実だけから記事本文（導入・セクション・FAQ・まとめ）を Gemini で生成する
import { callGemini } from "./gemini.mjs";
import { validateSeedArticle, pruneArticle, dropOverlap, limitBold } from "./validate-seed.mjs";

const RULES = [
  "あなたは主婦向け家電ブログの編集者です。下記の商品データ（JSON）に書かれている事実だけを使って、記事本文を書いてください。",
  "",
  "【厳守ルール】",
  "1. 数値は商品データに書かれている値のみ使う。データにない数値（割合・件数・年数・順位・金額・口コミ件数など）は一切書かない。「1回」「1日」「3つ」「2倍」のような数え方・回数の数字もデータにない限り書かない。",
  "2. 一人称の体験談（使ってみた・私は・実際に使って 等）は書かない。編集部解説として第三者の視点で書く。",
  "3. 効果・効能は断定しない。触れる場合は必ず「メーカーは〜と公表しています」の形式にする。データにない効果は書かない。",
  "4. 表記基準や測定条件が違う数値（例：風量と風速、税込と税別、出力と波長）を、同じ文や同じ行で比べない。",
  "5. 商品データにない事実・競合商品名・他社比較・口コミ・ランキング・評価は書かない。推測もしない。",
  "6. 主婦が読みやすいよう、1段落は2〜3文以内。長い説明は箇条書きに分ける。見出しは具体的に。",
  "7. 太字は **数値** の形で、数値の部分だけに使う。1段落につき1〜2個まで。太字にする数値は商品データにあるものだけ。",
  "8. 書くことがないセクションは作らない。空のセクション・空の配列は出力しない。",
  "9. 金額・割引率・最安値を本文に書かない。価格は「要確認（時期により変動）」とし、販売店・公式サイトで確認するよう案内する。",
  "10. 商品データに書かれていない他モデルの機能・比較は書かない（例：「proシリーズにはある」「上位モデルは〜」「他社より〜」）。比較に触れてよいのは、商品データの文言にそのまま書かれている内容だけ。",
  "11. 既存ページがすでに持つ項目（主なスペック表・良い点・気になる点・おすすめできる人・おすすめできない人）と重複させない。pros / cons / bestFor / notFor / specs の言い換えや再掲のセクションは作らない。",
  "12. 「メーカー公式サイトによると」「メーカーは〜と公表」「公表されています」と書いてよいのは、商品データに source があり、かつ verifiedBySource が true の specs 項目の内容だけ。verifiedBySource が false の項目、および pros / cons / bestFor / notFor（編集部の記述）は、メーカーの公表として書かない。source がなければこれらの表現は一切使わない。",
  "",
  "【構成】",
  "- intro: 導入。結論を先に、2〜3文。",
  "- sections: 0〜3個。ルール11と重ならない、新しい整理の切り口があるときだけ書く（例：「選ぶときの視点」「購入前に確認したい設置・使い方の前提」）。切り口がなければ空配列でよい。",
  "- faq: 3〜4件。商品データから答えられる質問だけ。",
  "- summary: まとめ。2〜3文。"
].join("\n");

const schema = {
  type: "OBJECT",
  properties: {
    intro: { type: "STRING" },
    sections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          paragraphs: { type: "ARRAY", items: { type: "STRING" } },
          bullets: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["heading"]
      }
    },
    faq: {
      type: "ARRAY",
      items: { type: "OBJECT", properties: { q: { type: "STRING" }, a: { type: "STRING" } }, required: ["q", "a"] }
    },
    summary: { type: "STRING" }
  },
  required: ["intro", "sections", "faq", "summary"]
};

const clean = (arr) => arr.map((x) => String(x).replace(/（※編集部記述）/g, "").trim()).filter(Boolean);

function productFacts(p) {
  return {
    name: p.name,
    brand: p.brand,
    category: p.category,
    priceRange: p.priceRange,
    specs: p.specs
      .filter((s) => s.value)
      .map((s) => (p.source ? { ...s, verifiedBySource: !p.source.verifiedLabels || p.source.verifiedLabels.includes(s.label) } : s)),
    ...(p.source && { source: { label: p.source.label, checkedAt: p.source.checkedAt } }),
    pros: clean(p.pros),
    cons: clean(p.cons),
    bestFor: clean(p.bestFor),
    notFor: clean(p.notFor)
  };
}

export async function generateSeedArticle(product, { maxAttempts = 3 } = {}) {
  const facts = productFacts(product);
  // 検証は整形後の事実に対して行う（source は verifiedLabels を含む元の値を使う）
  const check = { ...product, ...facts, source: product.source };
  let feedback = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const prompt = [
      RULES,
      feedback ? `\n【前回の出力は次の理由で不合格でした。必ず直してください】\n${feedback}` : "",
      "\n【商品データ】",
      JSON.stringify(facts, null, 2)
    ].join("\n");
    const raw = await callGemini(prompt, schema);
    const { article: overlapFree, dropped } = dropOverlap(pruneArticle(raw), check);
    const article = limitBold(overlapFree);
    if (dropped.length) console.log(`  既存ページと重複のため除外: ${dropped.join(" / ")}`);
    const issues = validateSeedArticle(article, check);
    if (!article.intro) issues.push("intro が空");
    if (!issues.length) return article;
    feedback = issues.map((i) => `- ${i}`).join("\n");
    console.warn(`  検証NG(試行${attempt}/${maxAttempts}):\n${feedback}`);
  }
  throw new Error("本文が検証を通過しませんでした。記事を生成しません。");
}
