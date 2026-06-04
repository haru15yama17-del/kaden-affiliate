import type { AffiliateLinks } from "@/data/types";

// 環境変数からアフィリエイトID等を読む（無ければボタン非表示）
const AMAZON_TAG = process.env.AFF_AMAZON_TAG ?? "";

export interface StoreButton {
  store: "amazon" | "rakuten" | "yahoo" | "moshimo" | "a8";
  label: string;
  href: string;
}

// ASIN + アソシエイトタグから正規のAmazon商品URLを生成（捏造リンク不可）
function amazonUrl(asin: string): string {
  const base = `https://www.amazon.co.jp/dp/${asin}`;
  return AMAZON_TAG ? `${base}?tag=${AMAZON_TAG}` : base;
}

export function buildStoreButtons(aff: AffiliateLinks): StoreButton[] {
  const out: StoreButton[] = [];
  if (aff.amazonAsin)
    out.push({ store: "amazon", label: "Amazonで見る", href: amazonUrl(aff.amazonAsin) });
  if (aff.rakutenUrl)
    out.push({ store: "rakuten", label: "楽天で見る", href: aff.rakutenUrl });
  if (aff.yahooUrl)
    out.push({ store: "yahoo", label: "Yahoo!で見る", href: aff.yahooUrl });
  if (aff.moshimoUrl)
    out.push({ store: "moshimo", label: "各ショップを見る", href: aff.moshimoUrl });
  if (aff.a8Url)
    out.push({ store: "a8", label: "公式ストアで見る", href: aff.a8Url });
  return out;
}
