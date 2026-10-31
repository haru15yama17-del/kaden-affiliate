// 方針B：seedの事実だけで書かせた記事本文の検証
//  - 数値は seed に存在するものだけ
//  - 一人称の体験談なし
//  - 効果効能の断定なし（効果に触れる段落は「メーカーは〜と公表」形式）
//  - 太字は数値のみ・1段落2個まで

const FIRST_PERSON = /(使ってみ|使ってい|使い始め|私は|私が|私の|わたし|僕|自分で|実際に使|購入してみ|買ってみ|試してみ|レビューします|感じました|驚きました)/;
const ASSERTIVE = /(消える|消えます|若返|治る|治ります|完治|必ず|絶対|間違いなく|100%|確実に|効果が出|効果があります|改善します|解消します|お墨付き|ナンバーワン|最強|最安)/;
const EFFECT_WORD = /(効果|効能|改善|作用|美肌|ダイエット|若々しく)/;
const NUMBER = /\d+(?:[.,]\d+)*/g;

const toHalf = (s) => s.replace(/[０-９．，]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
const numbersIn = (s) => (toHalf(s).match(NUMBER) ?? []).map((n) => n.replace(/,/g, ""));

export function allowedNumbers(product) {
  const set = baseAllowedNumbers(product);
  // 出典で未確認の spec にしか出てこない数値（例：根拠不明の「約28円/回」）は本文に書かせない
  const labels = product.source?.verifiedLabels;
  if (labels) {
    const verified = new Set([
      ...numbersIn(product.name),
      ...numbersIn(product.priceRange ?? ""),
      ...product.specs.filter((s) => labels.includes(s.label)).flatMap((s) => numbersIn(`${s.label}${s.value}`))
    ]);
    for (const s of product.specs.filter((x) => !labels.includes(x.label))) {
      for (const n of numbersIn(s.value)) if (!verified.has(n)) set.delete(n);
    }
  }
  return set;
}

function baseAllowedNumbers(product) {
  const src = JSON.stringify({
    name: product.name,
    priceRange: product.priceRange,
    specs: product.specs,
    pros: product.pros,
    cons: product.cons,
    bestFor: product.bestFor,
    notFor: product.notFor
  });
  return new Set(numbersIn(src));
}

/** 本文中の全文字列（段落単位）を取り出す */
export function paragraphsOf(article) {
  const out = [article.intro, article.summary];
  for (const s of article.sections ?? []) out.push(...(s.paragraphs ?? []), ...(s.bullets ?? []));
  for (const f of article.faq ?? []) out.push(f.a);
  return out.filter((x) => typeof x === "string" && x.trim());
}

// ---- 他モデル・比較表現（seedに根拠がなければ止める）----
const COMPARE_TERMS =
  /(他モデル|他機種|他社|他の(?:モデル|機種|製品|商品)|上位(?:モデル|機種|シリーズ)|下位(?:モデル|機種)|(?:pro|プロ)シリーズ|従来(?:モデル|品)|旧(?:モデル|型)|前(?:モデル|作)|新(?:モデル|型)|競合|ライバル|一般的な(?:モデル|製品)|比べ|比較して|より(?:も)?[^。、]{0,12}(?:高|安|軽|重|大き|小さ|多|少な|優れ|強|弱|抑え))/i;

const norm = (s) => s.replace(/\*\*/g, "").replace(/[\s　、。，．,.!！?？「」『』（）()・\-〜~／/:：]/g, "").toLowerCase();
const sentencesOf = (text) => text.replace(/\*\*/g, "").split(/(?<=[。！？])/).map((x) => x.trim()).filter(Boolean);

/** 最長共通部分文字列の長さ */
function lcsLen(a, b) {
  let best = 0;
  let prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1] + 1;
        if (cur[j] > best) best = cur[j];
      }
    }
    prev = cur;
  }
  return best;
}

/** seedに書かれている文（比較表現を含むものだけ根拠として使う） */
function seedStrings(product) {
  return [
    ...product.specs.map((s) => `${s.label}${s.value}`),
    ...product.pros, ...product.cons, ...product.bestFor, ...product.notFor
  ].map((x) => String(x));
}

// 「メーカー／公式サイトによると」と述べる文は、出典で確認済みの spec にだけ根拠を持てる
const CLAIMS_OFFICIAL = /メーカー(は|が)|公式サイトによると|公表(され|し)て/;

function verifiedSentence(sentence, product) {
  const labels = product.source.verifiedLabels;
  const rows = product.specs
    .filter((s) => s.value && (!labels || labels.includes(s.label)))
    .map((s) => `${s.label}${s.value}`);
  const nums = new Set(rows.flatMap((r) => numbersIn(r)));
  if (!numbersIn(sentence.replace(/\*\*/g, "")).every((n) => nums.has(n))) return false;
  const ns = norm(sentence);
  return rows.some((r) => lcsLen(ns, norm(r)) >= 4);
}

const EVIDENCE_LEN = 10; // 比較文と seed の文が連続この文字数以上一致して初めて「根拠あり」
const OVERLAP_LEN = 12;  // 既存ページの項目と連続この文字数以上一致したら重複とみなす

function comparisonIssues(article, product) {
  const issues = [];
  const evidence = seedStrings(product).filter((x) => COMPARE_TERMS.test(x)).map(norm);
  // 質問文は主張ではないので対象外（回答側の文で検査する）
  for (const text of paragraphsOf(article)) {
    for (const sentence of sentencesOf(text)) {
      const m = sentence.match(COMPARE_TERMS);
      if (!m) continue;
      const ns = norm(sentence);
      if (!evidence.some((e) => lcsLen(ns, e) >= EVIDENCE_LEN)) {
        issues.push(`seedに根拠のない比較表現「${m[0]}」: ${sentence.slice(0, 40)}…`);
      }
    }
  }
  return issues;
}

const OVERLAP_HEADING = /(おすすめ|向いて|向かない|良い点|気になる点|メリット|デメリット|スペック|主な特長|特長|仕様|こんな(?:人|方))/;

/** 既存ページが持つ項目（スペック・良い点・気になる点・おすすめ/できない人）と重複する見出し・項目を除外 */
export function dropOverlap(article, product) {
  const dropped = [];
  const existing = seedStrings(product).map(norm).filter((x) => x.length >= 6);
  const dup = (item) => {
    const n = norm(item);
    return existing.some((e) => lcsLen(n, e) >= Math.min(OVERLAP_LEN, e.length));
  };
  const sections = [];
  for (const s of article.sections) {
    if (OVERLAP_HEADING.test(s.heading)) {
      dropped.push(`セクション「${s.heading}」`);
      continue;
    }
    const paragraphs = s.paragraphs.filter((x) => !dup(x) || (dropped.push(x.slice(0, 20) + "…"), false));
    const bullets = s.bullets.filter((x) => !dup(x) || (dropped.push(x.slice(0, 20) + "…"), false));
    if (paragraphs.length || bullets.length) sections.push({ ...s, paragraphs, bullets });
  }
  return { article: { ...article, sections }, dropped };
}

export function validateSeedArticle(article, product) {
  const issues = comparisonIssues(article, product);
  const allowed = allowedNumbers(product);
  const heads = [...(article.sections ?? []).map((s) => s.heading), ...(article.faq ?? []).map((f) => f.q)];

  for (const text of [...paragraphsOf(article), ...heads.filter(Boolean)]) {
    const stripped = text.replace(/\*\*/g, "");
    for (const n of numbersIn(stripped)) {
      if (!allowed.has(n)) {
        const at = toHalf(stripped).indexOf(n);
        issues.push(`seedにない数値「${n}」が含まれている（…${stripped.slice(Math.max(0, at - 8), at + 8)}…）`);
      }
    }
  }
  for (const text of paragraphsOf(article)) {
    if (FIRST_PERSON.test(text)) issues.push(`体験談の一人称表現: ${text.slice(0, 30)}…`);
    const m = text.match(ASSERTIVE);
    if (m) issues.push(`断定的な表現「${m[0]}」`);
    const attributed = /メーカー(は|が).*(公表|案内|説明)|公式サイトによると/.test(text);
    if (CLAIMS_OFFICIAL.test(text)) {
      if (!product.source) {
        issues.push(`出典(source)がないのに「メーカー／公式サイトによると」と書いている: ${text.slice(0, 30)}…`);
      } else {
        for (const sentence of sentencesOf(text).filter((x) => CLAIMS_OFFICIAL.test(x))) {
          if (!verifiedSentence(sentence, product)) {
            issues.push(`出典で確認済みでない内容をメーカー公表として書いている: ${sentence.slice(0, 40)}…`);
          }
        }
      }
    }
    if (EFFECT_WORD.test(text) && !attributed) {
      issues.push(`効果に触れる段落が「メーカーは〜と公表しています」形式でない: ${text.slice(0, 30)}…`);
    }
    const bolds = [...text.matchAll(/\*\*([^*]+)\*\*/g)].map((b) => b[1]);
    if (bolds.length > 2) issues.push(`太字が1段落に${bolds.length}個ある（最大2個）`);
    for (const b of bolds) if (!/\d/.test(toHalf(b))) issues.push(`太字が数値ではない「${b}」`);
  }
  return [...new Set(issues)];
}

/** 1段落の太字が2個を超えた分は、太字記号だけ外す（体裁の機械的な補正。内容は変えない） */
export function limitBold(article) {
  const fix = (text) => {
    if (typeof text !== "string") return text;
    let n = 0;
    return text.replace(/\*\*([^*]+)\*\*/g, (m, inner) => (++n <= 2 ? m : inner));
  };
  return {
    intro: fix(article.intro),
    summary: fix(article.summary),
    sections: article.sections.map((s) => ({
      ...s,
      paragraphs: s.paragraphs.map(fix),
      bullets: s.bullets.map(fix)
    })),
    faq: article.faq.map((f) => ({ ...f, a: fix(f.a) }))
  };
}

/** 空のセクション・空の項目を落とす */
export function pruneArticle(article) {
  const sections = (article.sections ?? [])
    .map((s) => ({
      heading: (s.heading ?? "").trim(),
      paragraphs: (s.paragraphs ?? []).map((x) => x.trim()).filter(Boolean),
      bullets: (s.bullets ?? []).map((x) => x.trim()).filter(Boolean)
    }))
    .filter((s) => s.heading && (s.paragraphs.length || s.bullets.length));
  const faq = (article.faq ?? []).filter((f) => f.q?.trim() && f.a?.trim());
  return {
    intro: (article.intro ?? "").trim(),
    sections,
    faq,
    summary: (article.summary ?? "").trim()
  };
}
