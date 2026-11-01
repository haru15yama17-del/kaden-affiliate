import type { Product } from "@/data/types";
/** 測定条件の一致を検証できるまでは、数値だけから優劣の文章を自動生成しない。 */
export function buildSpecDiffParagraphs(_items: Product[]): string[] { return []; }
