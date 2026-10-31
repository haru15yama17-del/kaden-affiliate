// Gemini 呼び出し（REST）。レビュー分類と傾向文の生成。
// 件数・数字はここでは扱わない（aggregate.mjs がコードで集計する）。
const MODEL = () => process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// 一時的なエラー（429/5xx）は間隔を空けて最大3回まで再試行する
export async function callGemini(prompt, responseSchema) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await callGeminiOnce(prompt, responseSchema);
    } catch (e) {
      const transient = /HTTP (429|500|502|503|504)/.test(e.message);
      if (!transient || attempt >= 5) throw e;
      const wait = attempt * 8000;
      console.warn(`  Gemini 一時エラー（${e.message}）。${wait / 1000}秒後に再試行 (${attempt}/5)`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function callGeminiOnce(prompt, responseSchema) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY が未設定です（.env.local または GitHub Secrets）");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL()}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, responseMimeType: "application/json", responseSchema }
      })
    }
  );
  if (!res.ok) throw new Error(`Gemini API エラー: HTTP ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return JSON.parse(text);
}

// 1) 各レビューにテーマ×評価のタグを付ける（固定テーマから選ばせる）
export async function classifyReviews(reviews, themes) {
  const prompt = [
    "次の購入者レビューを分析し、各レビューにテーマと評価(pos=好意的 / neg=不満・懸念)のタグを付けてください。",
    `テーマは次の ID からのみ選ぶこと: ${themes.map((t) => `${t.id}(${t.label})`).join(", ")}`,
    "商品そのものに関係しない内容（配送・梱包・ショップ対応など）にはタグを付けない。",
    "1つのレビューに複数タグを付けてよい。該当なしなら tags は空配列。",
    "レビューの文章を出力に含めないこと。出力は index とタグのみ。",
    "",
    ...reviews.map((r, i) => `[${i}] ${r.slice(0, 600).replace(/\s+/g, " ")}`)
  ].join("\n");
  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        index: { type: "INTEGER" },
        tags: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { theme: { type: "STRING", enum: themes.map((t) => t.id) }, sentiment: { type: "STRING", enum: ["pos", "neg"] } },
            required: ["theme", "sentiment"]
          }
        }
      },
      required: ["index", "tags"]
    }
  };
  return callGemini(prompt, schema);
}

// 2) 集計済みテーマ名だけを渡して傾向文を書かせる（原文は渡さない＝引用不可能）
export async function writeTrends({ productName, goodLabels, concernLabels, feedback = "" }) {
  const prompt = [
    "あなたは家電レビューサイトの編集者です。購入者レビューの集計結果から、傾向を説明する短い文章を書いてください。",
    `商品: ${productName}`,
    `好意的な評価が多かったテーマ（多い順）: ${goodLabels.join("、") || "なし"}`,
    `不満・懸念が多かったテーマ（多い順）: ${concernLabels.join("、") || "なし"}`,
    "",
    "ルール:",
    "- 各2〜3文。です・ます調。『〜という声が目立ちます』『〜と感じる人もいます』のように第三者視点で書く。",
    "- 体験談の一人称（私は、使ってみた、実際に使って等）は使わない。",
    "- 数字（件数・割合・スペック値）は一切書かない。",
    "- 具体的な製品仕様や性能の断定は書かない。テーマの傾向のみ述べる。",
    "- テーマが『なし』の場合、その項目は空文字にする。",
    feedback ? `- 前回の出力は次の理由で不合格でした。直してください: ${feedback}` : ""
  ].filter(Boolean).join("\n");
  const schema = {
    type: "OBJECT",
    properties: { goodTrend: { type: "STRING" }, concernTrend: { type: "STRING" } },
    required: ["goodTrend", "concernTrend"]
  };
  return callGemini(prompt, schema);
}
