import modelCorrections from "@/data/verified-model-corrections.json";
import purchaseCorrections from "@/data/purchase-link-corrections.json";
import { productPhoto } from "@/lib/productPhotos";
import correctedSlugs from "@/data/editorial-correction-products.json";
import corrections from "@/data/editorial-corrections.json";
import type { Product } from "@/data/types";

export const PRICE_NOTICE = "要確認（時期により変動）";
const money = /[0-9０-９][0-9０-９,.，．〜～万千百\s+-]*円/;

// DB・ローカルどちらにも適用。個人の体験談本文には適用しない。
export function publishProduct(p: Product): Product {
  const modelCorrection = (modelCorrections as Record<string, Partial<Product>>)[p.slug];
  if (modelCorrection) p = {...p, ...modelCorrection, rating: undefined};
  const purchaseCorrection = (purchaseCorrections as Record<string, Partial<Product["affiliate"]>>)[p.slug];
  if (purchaseCorrection) p = {...p, affiliate: {...p.affiliate, ...purchaseCorrection}};
  if (p.slug === "daikin-s285ates-aircon") p = {...p, specs: p.specs.map(s => s.label === "工事" ? {...s, value: "標準工事付き（対応地域・追加費用は販売店で確認）"} : s)};
  if (p.slug === "panasonic-cs-635dex2-aircon") p = {
    ...p,
    name: p.name.replace("工事費込み", "工事別"),
    specs: p.specs.map(s => s.label === "工事" ? {...s, value: "本体販売・工事別（施工費と手配を別途確認）"} : s),
    pros: p.pros.filter(s => !s.includes("工事費込み")),
    cons: p.cons.map(s => s === "本体・工事込みで高価格帯" ? "本体代とは別に施工費の確認・手配が必要" : s),
  };
  const correct = (text: string) => (corrections as Record<string, string>)[text] ?? text;
  // 完全一致の編集修正のみを適用し、URL・型番・体験談本文は書き換えない。
  p = {
    ...p,
    specs: p.specs.map(s => ({ ...s, value: correct(s.value) })),
    pros: p.pros.map(correct),
    cons: p.cons.map(correct),
    bestFor: p.bestFor.map(correct),
    notFor: p.notFor.map(correct),
    reviewSummary: correct(p.reviewSummary),
    affiliate: {
      ...p.affiliate,
      ...(p.affiliate.ctaLabel === "無料お試しを見る" ? { ctaLabel: "お試しの条件を見る" } : {}),
    },
  };
  if (p.slug === "iris-rc-ik50-ricecooker") p = {...p, name: p.name.replace("（5合）", "（5.5合）"), specs:p.specs.map(s=>s.label==="容量" ? {...s,value:"5.5合（白米）"}:s), pros:p.pros.map(s=>s.replace(/^5合で/, "5.5合で"))};
  // 掲載中のA8広告は新規入会向け。無料お試しとは申込条件が異なる。
  if (p.slug === "aquaclara") p = {
    ...p,
    specs: p.specs.map(s => s.label === "お試し" ? {label: "リンク先の申込", value: "新規入会キャンペーン（無料お試しとは異なります）"} : s),
    pros: p.pros.filter(s => s !== "お試しを検討する場合は、利用条件を確認してから申し込む"),
    bestFor: p.bestFor.map(s => s === "お試しの条件を確認してから導入を決めたい人" ? "RO水とサポート内容を確認して導入したい人" : s),
  };
  return {
    ...p,
    updatedAt: correctedSlugs.includes(p.slug) && p.updatedAt.slice(0,10) < "2026-11-01" ? "2026-11-01" : p.updatedAt,
    priceRange: PRICE_NOTICE,
    image: productPhoto(p.slug)?.src ?? p.image,
    specs: p.specs.map(s => money.test(s.value) ? { ...s, value: /電気代/.test(s.label) ? "使用条件・電力契約により異なります" : PRICE_NOTICE } : s),
    pros: p.pros.filter(s => !money.test(s)),
    cons: p.cons.filter(s => !money.test(s)),
    bestFor: p.bestFor.filter(s => !money.test(s)),
    notFor: p.notFor.filter(s => !money.test(s)),
    reviewSummary: money.test(p.reviewSummary) ? "" : p.reviewSummary,
  };
}
