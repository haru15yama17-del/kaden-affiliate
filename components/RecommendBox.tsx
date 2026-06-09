import type { AffiliateLinks } from "@/data/types";
import { buildStoreButtons } from "@/lib/affiliate";

export function RecommendBox({
  name,
  bestFor,
  aff,
}: {
  name: string;
  bestFor: string[];
  aff: AffiliateLinks;
}) {
  const buttons = buildStoreButtons(aff).filter(
    (b) => b.store === "amazon" || b.store === "rakuten"
  );

  return (
    <div className="not-prose my-5 rounded-2xl border-2 border-accent/30 bg-blush p-5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent/70">
        この記事の結論
      </p>
      <p className="mb-4 text-sm font-medium leading-relaxed text-ink">
        ✅ <strong>{name}</strong>は<strong>{bestFor[0]}</strong>の方に最もおすすめです。
      </p>
      {buttons.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {buttons.map((b) => (
            <a
              key={b.store}
              href={b.href}
              target="_blank"
              rel="nofollow sponsored noopener"
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all hover:brightness-105 ${
                b.store === "amazon"
                  ? "btn-amazon text-[#111]"
                  : "bg-[#bf0000] text-white"
              }`}
            >
              {b.store === "amazon" ? "🛒" : "🏪"}
              <span>{b.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
