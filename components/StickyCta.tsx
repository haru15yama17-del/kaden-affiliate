"use client";

import { useEffect, useState } from "react";
import type { AffiliateLinks } from "@/data/types";
import { buildStoreButtons } from "@/lib/affiliate";

export function StickyCta({
  productName,
  priceRange,
  aff,
}: {
  productName: string;
  priceRange: string;
  aff: AffiliateLinks;
}) {
  const [visible, setVisible] = useState(false);
  const buttons = buildStoreButtons(aff);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // officialUrl または通常ストアボタンのどちらかがあれば表示
  const ctaHref = aff.officialUrl || buttons[0]?.href;
  const ctaLabel = aff.officialUrl
    ? (aff.ctaLabel ?? "公式サイトで確認")
    : "🛒 最安値を確認";

  if (!ctaHref) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="shadow-sticky-top border-t border-ink/10 bg-white/96 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{productName}</p>
            <p className="text-xs text-accent font-medium">{priceRange}</p>
          </div>
          <a
            href={ctaHref}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
