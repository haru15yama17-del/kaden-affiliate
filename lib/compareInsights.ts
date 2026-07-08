import type { Product } from "@/data/types";

type Polarity = "lower" | "higher";

interface SpecRule {
  keywords: string[];
  polarity: Polarity;
  // 有利な方向（lower→小さい方、higher→大きい方）の値を形容する直接的な比較語。
  // 「省エネ」「軽量」「コンパクト」等の評価・宣伝的な言い回しは避ける。
  adjective: string;
  // 「6〜9畳」のような範囲表記のとき、上限値を代表値として使うか（省略時は先頭の数値をそのまま使う＝従来どおり）。
  // 「容量」ラベルはホットクックの「1.6L（2〜4人向け）」等、本来の数値と無関係な範囲を含むため対象外にする
  rangeValue?: "upper";
}

// ラベルに含まれるキーワードから「数値が小さい/大きい方が有利か」を判定する
// 「価格」「工事」は金額を扱うため、下のcostKind判定と合わせて工事費込み/本体のみの混同を防ぐ
const SPEC_RULES: SpecRule[] = [
  { keywords: ["価格", "工事"], polarity: "lower", adjective: "安い" },
  { keywords: ["運転音"], polarity: "lower", adjective: "静か" },
  { keywords: ["消費電力"], polarity: "lower", adjective: "少ない" },
  { keywords: ["質量", "重さ"], polarity: "lower", adjective: "軽い" },
  { keywords: ["容量"], polarity: "higher", adjective: "大きい" },
  { keywords: ["畳数"], polarity: "higher", adjective: "大きい", rangeValue: "upper" }
];

// 価格・工事関連のラベルか（込み/本体の混同チェックが必要かどうかの判定に使う）
const COST_KEYWORDS = ["価格", "工事"];
function isCostLabel(label: string): boolean {
  return COST_KEYWORDS.some((k) => label.includes(k));
}

type CostKind = "included" | "standalone" | "unknown";

// 値の文言から「工事費込み（総額）」か「本体のみ（工事費別）」かを判定する。
// どちらとも取れない/言及が無い場合はunknownとし、既存カテゴリ（洗濯機の価格帯等）の挙動を変えない
function detectCostKind(raw: string): CostKind {
  if (/工事費?込み|込み|セット/.test(raw)) return "included";
  if (/本体(のみ|価格)?|別途|工事.?別/.test(raw)) return "standalone";
  return "unknown";
}

function findRule(label: string): SpecRule | undefined {
  return SPEC_RULES.find((rule) => rule.keywords.some((k) => label.includes(k)));
}

// 単位として拾ってよい文字の除外セット。数値・区切り記号に加え、
// 「1.6L（2〜4人向け）」のような括弧書きの補足情報を単位に含めないよう（/(も除外する
const UNIT_STOP_CHARS = "[^\\d,\\s／/×〜~（(-]*";

// 文字列から先頭の数値と、それに続く単位（kg/dB/円 等）を抜き出す。括弧「（」以降の補足情報は単位に含めない。
// rangeValue==="upper"のときのみ「6〜9畳」のような範囲表記を上限値(9)として扱う。
// 単一値（例：「18畳用」）はrangeValueの指定に関わらずそのまま数値として扱う。
function parseMetric(raw: string, rangeValue?: "upper"): { value: number; unit: string } | null {
  if (rangeValue === "upper") {
    const rangeMatch = raw.match(
      new RegExp(`[\\d,]+(?:\\.\\d+)?\\s*[〜~]\\s*([\\d,]+(?:\\.\\d+)?)\\s*(${UNIT_STOP_CHARS})`)
    );
    if (rangeMatch) {
      const upper = parseFloat(rangeMatch[1].replace(/,/g, ""));
      if (!Number.isNaN(upper)) return { value: upper, unit: rangeMatch[2] ?? "" };
    }
  }

  const numMatch = raw.match(/[\d,]+(?:\.\d+)?/);
  if (!numMatch) return null;
  const value = parseFloat(numMatch[0].replace(/,/g, ""));
  if (Number.isNaN(value)) return null;
  const rest = raw.slice((numMatch.index ?? 0) + numMatch[0].length);
  const unitMatch = rest.match(new RegExp(`^${UNIT_STOP_CHARS}`));
  return { value, unit: unitMatch ? unitMatch[0] : "" };
}

function formatVal(value: number, unit: string): string {
  return `${value.toLocaleString("ja-JP")}${unit}`;
}

interface DiffEntry {
  label: string;
  aVal: number;
  aUnit: string;
  bVal: number;
  bUnit: string;
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
    const va = parseMetric(rawA, rule.rangeValue);
    const vb = parseMetric(rawB, rule.rangeValue);
    if (!va || !vb || va.value === vb.value) return;

    let displayLabel = label;
    if (isCostLabel(label)) {
      const kindA = detectCostKind(rawA);
      const kindB = detectCostKind(rawB);
      // 「工事費込み」と「本体のみ」など基準が異なる金額同士は比較しない
      if (kindA !== kindB) return;
      if (kindA === "included") displayLabel = "工事費込みの価格";
      else if (kindA === "standalone") displayLabel = "本体価格";
      // unknown同士（洗濯機の価格帯など）は元のラベルのまま、従来どおり比較する
    }

    const aBetter = rule.polarity === "lower" ? va.value < vb.value : va.value > vb.value;
    const magnitude = Math.abs(va.value - vb.value) / Math.max(va.value, vb.value, 1);
    entries.push({
      label: displayLabel,
      aVal: va.value,
      aUnit: va.unit,
      bVal: vb.value,
      bUnit: vb.unit,
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
    `${a.name}は${d.label}が${formatVal(d.aVal, d.aUnit)}、${b.name}は${d.label}が${formatVal(d.bVal, d.bUnit)}で、` +
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
