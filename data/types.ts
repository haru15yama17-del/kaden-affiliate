// ---- 共通の型定義 ----

export type CategorySlug =
  | "refrigerator"   // 冷蔵庫
  | "washer"         // 洗濯機
  | "vacuum"         // 掃除機
  | "microwave"      // 電子レンジ
  | "rice-cooker"    // 炊飯器
  | "tv"             // テレビ
  | "aircon"         // エアコン
  | "beauty"         // 美容家電（美顔器・脱毛器・LEDマスク等）
  | "personal-care"  // パーソナルケア（ドライヤー・電動歯ブラシ・マッサージ器等）
  | "gadget"         // ガジェット家電
  | "cooking"        // 調理家電（ホットクック・電気圧力鍋・食洗機等）
  | "seasonal"       // 季節家電（除湿機・扇風機・サーキュレーター・布団乾燥機等）
  | "water-server"   // ウォーターサーバー（天然水・RO水）
  | "food-delivery"; // 食材宅配・ミールキット

export interface Category {
  slug: CategorySlug;
  name: string;          // 表示名（例：冷蔵庫）
  intro: string;         // カテゴリ説明（独自文章）
  selectionPoints: string[]; // 「選び方」の軸（比較基準＝E-E-A-Tの核）
}

export interface AffiliateLinks {
  selectionNote?: string; // 型番・セット・工事など購入先で確認する条件
  informationOnly?: boolean; // 購入先を確認できず、製品情報のみ案内する場合
  amazonAsin?: string;   // ASINからリンク生成（捏造しない・実物のみ）
  rakutenUrl?: string;
  yahooUrl?: string;
  moshimoUrl?: string;
  a8Url?: string;
  officialUrl?: string;  // サービス系商品の公式サイトCTAリンク
  ctaLabel?: string;     // ボタン文言（例："無料お試しに申し込む"）
  isAffiliateLink?: boolean; // officialUrlが提携リンクか（未設定=true）。提携否認等で素のURLを入れる場合はfalse
}

export interface SpecRow {
  label: string;  // 例：容量
  value: string;  // 例：455L
}

// 楽天レビューの集計結果（scripts/auto が生成。件数はコードで集計し、本文は保存しない）
export interface ReviewStatItem {
  theme: string;
  label: string;
  count: number;
}
export interface ReviewStats {
  total: number;       // 分析したレビュー件数
  fetchedAt: string;   // 取得日 YYYY-MM-DD
  sourceUrl: string;   // 出典（楽天レビューページ）
  positive: ReviewStatItem[];
  negative: ReviewStatItem[];
  goodTrend: string;
  concernTrend: string;
}

export interface Product {
  slug: string;             // URL用（例：mitsubishi-mr-wz50k）
  name: string;             // 商品名（実在の型番ベース）
  brand: string;
  category: CategorySlug;
  releaseYear?: number;
  priceRange: string;       // 例：「8万〜11万円」※断定価格は避ける
  image?: string;           // 公式/EC提供の画像URL（自前撮影 or 許諾済み）
  specs: SpecRow[];
  // スペックの確認元（メーカー公式サイトなど）。あれば記事に出典を表示し、自動記事で「公式サイトによると」と書ける
  // verifiedLabels: 出典で確認できた spec の label 一覧（省略時は全 spec を確認済みとみなす）
  source?: { label: string; url: string; checkedAt: string; verifiedLabels?: string[] };
  // 編集部の一次評価（実機 or 公開情報に基づく自分の言葉。捏造レビュー不可）
  pros: string[];
  cons: string[];
  bestFor: string[];        // おすすめできる人
  notFor: string[];         // おすすめできない人
  // 口コミは「要約」のみ。原文転載・捏造は不可。出典は記事側に明記。
  reviewSummary: string;
  rating?: number;          // 編集部評価 1.0〜5.0（省略時は★非表示）
  affiliate: AffiliateLinks;
  competitors: string[];    // 比較対象の product.slug
  updatedAt: string;        // ISO日付（更新日＝E-E-A-T）
}
