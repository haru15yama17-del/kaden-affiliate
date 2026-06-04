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
  | "gadget";        // ガジェット家電

export interface Category {
  slug: CategorySlug;
  name: string;          // 表示名（例：冷蔵庫）
  intro: string;         // カテゴリ説明（独自文章）
  selectionPoints: string[]; // 「選び方」の軸（比較基準＝E-E-A-Tの核）
}

export interface AffiliateLinks {
  amazonAsin?: string;   // ASINからリンク生成（捏造しない・実物のみ）
  rakutenUrl?: string;
  yahooUrl?: string;
  moshimoUrl?: string;
  a8Url?: string;
}

export interface SpecRow {
  label: string;  // 例：容量
  value: string;  // 例：455L
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
  // 編集部の一次評価（実機 or 公開情報に基づく自分の言葉。捏造レビュー不可）
  pros: string[];
  cons: string[];
  bestFor: string[];        // おすすめできる人
  notFor: string[];         // おすすめできない人
  // 口コミは「要約」のみ。原文転載・捏造は不可。出典は記事側に明記。
  reviewSummary: string;
  rating: number;           // 編集部評価 1.0〜5.0
  affiliate: AffiliateLinks;
  competitors: string[];    // 比較対象の product.slug
  updatedAt: string;        // ISO日付（更新日＝E-E-A-T）
}
