// ============================================================
// 検索意図レジストリ：カニバリゼーション（記事重複）を防ぐ要
// 1つの (target, intent) の組み合わせに対し記事は1本だけ許可する。
// generate-article がここを参照し、登録済みなら生成を拒否する。
// ============================================================

export type SearchIntent =
  | "review"      // 商品名+レビュー／評価
  | "kuchikomi"   // 商品名+口コミ／評判
  | "compare"     // 商品名/カテゴリ+比較
  | "osusume"     // カテゴリ+おすすめ
  | "ranking";    // カテゴリ+ランキング

export const intentLabel: Record<SearchIntent, string> = {
  review: "レビュー・評価",
  kuchikomi: "口コミ・評判",
  compare: "比較",
  osusume: "おすすめ",
  ranking: "ランキング"
};

// 商品名+口コミ／評判／レビューは検索意図がほぼ同一 → 1記事に統合する。
// canonicalIntent でまとめ先を定義（重複生成の主因をここで吸収）。
export const canonicalIntent: Record<SearchIntent, SearchIntent> = {
  review: "review",
  kuchikomi: "review",   // 「口コミ」「評判」は review 記事へ集約
  compare: "compare",
  osusume: "osusume",
  ranking: "ranking"
};

export interface IntentRecord {
  target: string;        // product.slug または category.slug
  intent: SearchIntent;  // 正規化後の意図
  url: string;           // 生成済み記事URL
  primaryKeyword: string;
}

// 既存記事の台帳（生成時に追記。ビルド時の重複チェックにも使う）
export const intentRegistry: IntentRecord[] = [
  // 例：
  // { target: "sample-fridge-a455", intent: "review", url: "/reviews/sample-fridge-a455", primaryKeyword: "サンプル冷蔵庫A455 レビュー" }
];

export function isIntentTaken(target: string, intent: SearchIntent): boolean {
  const norm = canonicalIntent[intent];
  return intentRegistry.some((r) => r.target === target && r.intent === norm);
}
