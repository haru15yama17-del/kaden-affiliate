"use client";

import type { ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export function TrackedLink({
  href,
  className,
  children,
  productName,
  affiliateType,
  store,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  productName?: string;
  affiliateType: "rakuten" | "official";
  store?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={className}
      onClick={() => {
        const article = typeof window !== "undefined" ? window.location.pathname : undefined;
        sendGAEvent("event", "affiliate_click", {
          article,
          product_name: productName ?? "",
          affiliate_type: affiliateType,
          store: store ?? "",
        });
      }}
    >
      {children}
    </a>
  );
}
