import type { Product } from "@/data/types";

type Polarity = "lower" | "higher";

interface SpecRule {
  keywords: string[];
  polarity: Polarity;
  // 有利な方向（lower→小さい方、higher→大きい方）の値を形容する直接的な比較語。
  // 「省エネ」「軽量」「コンパクト」等の評価・宣伝的な言い回しは避ける。
  adjective: string;
}

// ラベルに含まれるキーワードから「数値が小さい/大きい方が有利か」を判定する
const SPEC_RULES: SpecRule[] = [
  { keywords: ["価格"], polarity: "lower", adjective: "安い" },
  { keywords: ["運転音"], polarity: "lower", adjective: "静か" },
  { keywords: ["消費電力"], polarity: "lower", adjective: "少ない" },
  { keywords: ["質量", "重さ"], polarity: "lower", adjective: "軽い" },
  { keywords: ["容量"], polarity: "higher", adjective: "大きい" }
];

function findRule(label: string): SpecRule | undefined {
  return SPEC_RULES.find((rule) => rule.keywords.some((k) => label.includes(k)));
}

// 文字列から先頭の数値と、それに続く単位（kg/dB/円 等）を抜き出す
function parseMetric(raw: string): { value: number; unit: string } | null {
  const numMatch = raw.match(/[\d,]+(?:\.\d+)?/);
  if (!numMatch) return null;
  const value = parseFloat(numMatch[0].replace(/,/g, ""));
  if (Number.isNaN(value)) return null;
  const rest = raw.slice((numMatch.index ?? 0) + numMatch[0].length);
  const unitMatch = rest.match(/^[^\d,\s／/×〜~-]*/);
  return { value, unit: unitMatch ? unitMatch[0] : "" };
}

function formatVal(value: number, unit: string): string {
  return `${value.toLocaleString("ja-JP")}${unit}`;
}

interface DiffEntry {
  label: string;
  unit: string;
  aVal: number;
  bVal: number;
  aBetter: boolean;
  magnitude: number; // 差の大きさ（相対値）。段落に使う差分の優先順位付けに使う
  adjective: string;
}

function buildDiffEntries(a: Product, b: Product): DiffEntry[] {
  const entries: DiffEntry[] = [];

  const tryPush = (label: string, rawA?: string, rawB?: string) => {
    if (rawA == null || rawB == null) return;
    const rule = findRule(label);
    if (!rule) return;
    const va = parseMetric(rawA);
    const vb = parseMetric(rawB);
    if (!va || !vb || va.value === vb.value) return;
    const aBetter = rule.polarity === "lower" ? va.value < vb.value : va.value > vb.value;
    const magnitude = Math.abs(va.value - vb.value) / Math.max(va.value, vb.value, 1);
    entries.push({
      label,
      unit: va.unit || vb.unit,
      aVal: va.value,
      bVal: vb.value,
      aBetter,
      magnitude,
      adjective: rule.adjective
    });
  };

  tryPush("価格帯", a.priceRange, b.priceRange);

  const sharedLabels = a.specs.map((s) => s.label).filter((label) => b.specs.some((s) => s.label === label));
  for (const label of sharedLabels) {
    tryPush(label, a.specs.find((s) => s.label === label)?.value, b.specs.find((s) => s.label === label)?.value);
  }

  return entries;
}

// 「Aは○○が◯◯、Bは○○が◯◯で、Aの方が(比較語)」という事実ベースの比較文を1件作る
function describeDiff(a: Product, b: Product, d: DiffEntry): string {
  const winnerName = d.aBetter ? a.name : b.name;
  return (
    `${a.name}は${d.label}が${formatVal(d.aVal, d.unit)}、${b.name}は${d.label}が${formatVal(d.bVal, d.unit)}で、` +
    `${winnerName}の方が${d.adjective}です。`
  );
}

/**
 * 2商品のspecs差分から「Aは◯◯、Bは◯◯で、Aの方が軽い」のような事実ベースの比較文の段落を生成する。
 * 比較できる数値差分が無ければ空配列を返す（=セクション非表示）。
 */
export function buildSpecDiffParagraphs(items: Product[]): string[] {
  if (items.length !== 2) return [];
  const [a, b] = items;
  const diffs = buildDiffEntries(a, b).sort((x, y) => y.magnitude - x.magnitude);
  if (diffs.length === 0) return [];

  const aWins = diffs.filter((d) => d.aBetter);
  const bWins = diffs.filter((d) => !d.aBetter);

  const paragraphs: string[] = [];

  const firstSentences: string[] = [];
  if (aWins[0]) firstSentences.push(describeDiff(a, b, aWins[0]));
  if (bWins[0]) firstSentences.push(describeDiff(a, b, bWins[0]));
  if (firstSentences.length > 0) paragraphs.push(firstSentences.join(" "));

  const extraSentences: string[] = [];
  if (aWins[1]) extraSentences.push(describeDiff(a, b, aWins[1]));
  if (bWins[1]) extraSentences.push(describeDiff(a, b, bWins[1]));
  if (extraSentences.length > 0) paragraphs.push(extraSentences.join(" "));

  return paragraphs;
}
