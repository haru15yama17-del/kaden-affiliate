// 件数の集計は必ずコードで行う（LLMに数字を書かせない）
const MIN_COUNT = 2; // 1件だけの意見は「傾向」として扱わない
const TOP = 4;

export function aggregate(classified, themes, total) {
  const label = Object.fromEntries(themes.map((t) => [t.id, t.label]));
  const pos = new Map();
  const neg = new Map();
  for (const row of classified) {
    if (!Number.isInteger(row.index) || row.index < 0 || row.index >= total) continue;
    const seenPos = new Set();
    const seenNeg = new Set();
    for (const t of row.tags ?? []) {
      if (!label[t.theme]) continue;
      (t.sentiment === "pos" ? seenPos : seenNeg).add(t.theme);
    }
    seenPos.forEach((id) => pos.set(id, (pos.get(id) ?? 0) + 1));
    seenNeg.forEach((id) => neg.set(id, (neg.get(id) ?? 0) + 1));
  }
  const top = (m) =>
    [...m.entries()]
      .filter(([, c]) => c >= MIN_COUNT)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP)
      .map(([id, count]) => ({ theme: id, label: label[id], count }));
  return { total, positive: top(pos), negative: top(neg) };
}
