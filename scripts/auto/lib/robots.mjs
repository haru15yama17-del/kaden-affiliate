// robots.txt 確認（fail-closed）
// robots.txt を正常に取得・解釈できない場合は「許可なし」として取得を中止する。
import { BOT_UA } from "./common.mjs";

const UA_TOKEN = BOT_UA.split("/")[0].toLowerCase();

function parseGroups(text) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === "user-agent") {
      if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else if ((key === "allow" || key === "disallow") && cur) {
      cur.rules.push({ allow: key === "allow", pattern: val });
      lastWasAgent = false;
    } else lastWasAgent = false;
  }
  return groups;
}

function patternToRegex(p) {
  const esc = p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp("^" + esc.replace(/\\\$$/, "$"));
}

export function isPathAllowed(robotsText, pathWithQuery) {
  const groups = parseGroups(robotsText);
  const group = groups.find((g) => g.agents.includes(UA_TOKEN)) ?? groups.find((g) => g.agents.includes("*"));
  if (!group) return true; // 該当グループなし＝制限なしと明示的に読める場合のみ
  let best = null;
  for (const r of group.rules) {
    if (!r.pattern) continue; // 空のDisallowは制限なし
    if (patternToRegex(r.pattern).test(pathWithQuery)) {
      if (!best || r.pattern.length > best.pattern.length || (r.pattern.length === best.pattern.length && r.allow)) best = r;
    }
  }
  return best ? best.allow : true;
}

const cache = new Map();

export async function checkRobots(targetUrl) {
  const u = new URL(targetUrl);
  const robotsUrl = `${u.origin}/robots.txt`;
  if (!cache.has(robotsUrl)) {
    try {
      const res = await fetch(robotsUrl, { headers: { "User-Agent": BOT_UA }, redirect: "follow" });
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || !type.includes("text/plain")) {
        cache.set(robotsUrl, { error: `robots.txt を取得できません（HTTP ${res.status}, ${type || "content-type不明"}）` });
      } else cache.set(robotsUrl, { text: await res.text() });
    } catch (e) {
      cache.set(robotsUrl, { error: `robots.txt の取得に失敗: ${e.message}` });
    }
  }
  const c = cache.get(robotsUrl);
  if (c.error) return { allowed: false, reason: `${c.error}。許可を確認できないため取得を中止します。` };
  const ok = isPathAllowed(c.text, u.pathname + u.search);
  return ok ? { allowed: true } : { allowed: false, reason: `robots.txt で禁止されたパスです: ${u.pathname}` };
}
