import { site } from "@/data/site";
import type { Product } from "@/data/types";

// パンくずの構造化データ
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`
    }))
  };
}

// レビュー記事の Product + Review 構造化データ
// ※ ratingは編集部の一次評価。架空のaggregateRatingは付けない。
export function reviewJsonLd(p: Product, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    ...(p.image && { image: p.image }),
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: p.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: { "@type": "Organization", name: site.operator.name },
      datePublished: p.updatedAt
    },
    url: `${site.url}${path}`
  };
}

// FAQ構造化データ
export function faqJsonLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a }
    }))
  };
}

// ItemList（ランキング・比較）
export function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.path}`
    }))
  };
}
