import type { AffiliateLinks } from "@/data/types";
import { buildStoreButtons } from "@/lib/affiliate";

type StoreKey = "amazon" | "rakuten" | "yahoo" | "moshimo" | "a8";

const storeConfig: Record<StoreKey, { cls: string; icon: string; primary: boolean }> = {
  amazon:  { cls: "btn-amazon text-[#111] font-bold",               icon: "🛒", primary: true },
  rakuten: { cls: "bg-[#bf0000] text-white hover:brightness-110",   icon: "🏪", primary: false },
  yahoo:   { cls: "bg-[#ff0033] text-white hover:brightness-110",   icon: "🔍", primary: false },
  moshimo: { cls: "bg-sub text-white hover:brightness-110",         icon: "💡", primary: false },
  a8:      { cls: "bg-ink text-white hover:brightness-125",         icon: "🏬", primary: false },
};

export function AffiliateButtons({ aff }: { aff: AffiliateLinks }) {
  // サービス系商品（officialUrl or ctaLabel が定義されている）はCTAモード
  const isServiceType = aff.ctaLabel !== undefined || aff.officialUrl !== undefined;

  if (isServiceType) {
    const label = aff.ctaLabel ?? "公式サイトで確認";
    if (aff.officialUrl) {
      return (
        <div className="rounded-2xl border border-accent/25 bg-blush/50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent/75">
            ▼ 公式サイトで詳細を確認
          </p>
          <a
            href={aff.officialUrl}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-base font-bold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:brightness-110 sm:text-lg"
          >
            <span>✨</span>
            <span>{label}</span>
            <svg className="ml-1 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="mt-3 text-center text-xs text-ink/40">
            ※アフィリエイト広告を利用しています
          </p>
        </div>
      );
    }
    // officialUrl が未設定の場合は「準備中」
    return (
      <div className="rounded-2xl border border-ink/15 bg-ink/3 p-4 text-center">
        <p className="mb-2 text-xs text-ink/45">{label}</p>
        <button
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-ink/15 px-5 py-4 text-base font-bold text-ink/35 sm:text-lg"
        >
          準備中
        </button>
      </div>
    );
  }

  // 通常の物販商品：Amazon / 楽天 / Yahoo ボタン
  const buttons = buildStoreButtons(aff);

  if (buttons.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-ink/15 p-5 text-center">
        <p className="text-sm text-ink/45">アフィリエイトリンクを設定すると購入ボタンが表示されます</p>
        <p className="mt-1 text-xs text-ink/30">data/products.ts の affiliate フィールドに ASIN 等を入力してください</p>
      </div>
    );
  }

  const primary = buttons.filter((b) => storeConfig[b.store as StoreKey]?.primary);
  const secondary = buttons.filter((b) => !storeConfig[b.store as StoreKey]?.primary);

  return (
    <div className="rounded-2xl border border-accent/25 bg-blush/50 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent/75">
        ▼ 最安値をストアで確認
      </p>

      {primary.map((b) => {
        const cfg = storeConfig[b.store as StoreKey];
        return (
          <a
            key={b.store}
            href={b.href}
            target="_blank"
            rel="nofollow sponsored noopener"
            className={`mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold transition-all hover:-translate-y-0.5 hover:brightness-105 ${cfg.cls}`}
          >
            <span className="text-lg">{cfg.icon}</span>
            <span>{b.label}</span>
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        );
      })}

      {secondary.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {secondary.map((b) => {
            const cfg = storeConfig[b.store as StoreKey];
            return (
              <a
                key={b.store}
                href={b.href}
                target="_blank"
                rel="nofollow sponsored noopener"
                className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold transition-all hover:brightness-105 ${cfg?.cls ?? "bg-ink/10 text-ink"}`}
              >
                <span>{cfg?.icon}</span>
                <span>{b.label}</span>
              </a>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-center text-xs text-ink/40">
        ※価格は頻繁に変動します。各ストアで最新価格をご確認ください。
      </p>
    </div>
  );
}
