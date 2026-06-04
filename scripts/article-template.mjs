// ============================================================
// 記事生成テンプレート（プロンプト設計）
// 低品質な量産記事を避けるため、以下を必須にする:
//  - 独自の選び方・比較・注意点を必ず含める
//  - 口コミは「要約」のみ。原文転載・捏造の禁止を明示
//  - 出典(sources)が無い場合は口コミ要約を空にする
// ============================================================

export const INTENT_GUIDE = {
  review: "商品名+レビュー/評価。実機目線の一次評価と根拠を重視。",
  compare: "商品名orカテゴリ+比較。違いと向き不向きを表で明確化。",
  osusume: "カテゴリ+おすすめ。選び方の軸→候補→使い分けの順。",
  ranking: "カテゴリ+ランキング。評価軸を明示し順位の根拠を書く。"
};

// LLMに渡すシステムプロンプト
export function systemPrompt() {
  return [
    "あなたは家電に詳しい日本語のレビュー編集者です。",
    "次の制約を厳守してください:",
    "1) 実在しない口コミ・レビュー・数値を捏造しない。",
    "2) 他サイトの文章を転載・言い換えコピーしない。自分の言葉で書く。",
    "3) 口コミ要約は与えられた sources がある場合のみ書く。無ければ reviewDetail は空文字にする。",
    "4) 断定的な価格や『検索1位保証』のような表現は使わない。",
    "5) 独自の『選び方の軸』『競合との違い』『購入前の注意点』を必ず含める。",
    "出力は指定のJSONのみ。前置き・コードフェンスは付けない。"
  ].join("\n");
}

// LLMに渡すユーザープロンプト（商品データを構造的に渡す）
export function userPrompt(product, intent, sources) {
  return JSON.stringify({
    task: "次の商品データから記事本文をJSONで生成",
    intent,
    intentGuide: INTENT_GUIDE[intent] ?? "",
    product: {
      name: product.name,
      brand: product.brand,
      category: product.category,
      priceRange: product.priceRange,
      specs: product.specs,
      pros: product.pros,
      cons: product.cons,
      bestFor: product.bestFor,
      notFor: product.notFor
    },
    sources: sources ?? [],
    outputSchema: {
      intro: "導入文(150〜250字)。結論を先に。",
      reviewDetail: "口コミ・評判の要約(sourcesが無ければ空文字)。出典は捏造しない。",
      summary: "まとめ(150字前後)。向き不向きを再掲。",
      faq: "[{q,a}] 3〜5件。検索意図に沿った実用的な質問。",
      sources: "与えられたsourcesをそのまま返す"
    }
  });
}
