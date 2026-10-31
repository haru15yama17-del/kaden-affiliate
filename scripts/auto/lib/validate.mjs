// 生成文の検証：数字・一人称・原文との近似一致
const FIRST_PERSON = /(使ってみ|使ってい|使い始め|私は|私が|私の|わたし|僕|自分で|実際に使|購入してみ|買ってみ|試してみ|レビューします)/;
const NGRAM = 10;

const normalize = (s) => s.replace(/[\s　、。，．,.!！?？「」『』（）()・\-〜~]/g, "");

export function validateGenerated(text, { reviews, labels }) {
  const issues = [];
  if (!text) return issues;
  if (/[0-9０-９]/.test(text)) issues.push("数字が含まれている（数字は書かない）");
  if (FIRST_PERSON.test(text)) issues.push("体験談の一人称表現が含まれている");

  // テーマ名自体は原文にも出るため、検査前に取り除く
  let t = text;
  for (const l of labels) t = t.split(l).join("");
  const body = normalize(t);
  const corpus = normalize(reviews.join("\n"));
  for (let i = 0; i + NGRAM <= body.length; i++) {
    if (corpus.includes(body.slice(i, i + NGRAM))) {
      issues.push(`原文と連続${NGRAM}文字以上一致（引用の疑い）: 「${body.slice(i, i + NGRAM)}」`);
      break;
    }
  }
  return issues;
}
