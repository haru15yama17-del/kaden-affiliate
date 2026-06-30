import Link from "next/link";
import type { Product } from "@/data/types";
import { Rating } from "./Rating";

const catEmoji: Record<string, string> = {
  "water-server": "💧", "food-delivery": "🥘",
  cooking: "🍳", seasonal: "🌤️",
  refrigerator: "❄️", washer: "🌀", vacuum: "🌪️",
  microwave: "📡", "rice-cooker": "🍚", tv: "📺",
  aircon: "🌡️", beauty: "✨", gadget: "📱",
  "personal-care": "💆",
};

export function ProductCard({ p }: { p: Product }) {
  const firstPro = p.pros[0]?.replace(/（※編集部記述）/g, "") ?? "";
  return (
    <Link
      href={`/reviews/${p.slug}`}
      className="group flex flex-col rounded-2xl border border-ink/8 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card-hover"
    >
      {/* Image / placeholder */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-blush to-moss/40">
        {p.image ? (
          <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
        ) : (
          <span className="select-none text-5xl opacity-30">{catEmoji[p.category] ?? "📦"}</span>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-accent/85 px-2 py-0.5 text-xs font-medium text-white">
          {p.brand}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {p.rating != null && <Rating value={p.rating} size="sm" />}
        <h3 className="mt-1.5 line-clamp-2 font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent">
          {p.name}
        </h3>
        <p className="mt-1 text-sm font-bold text-accent">{p.priceRange}</p>
        {firstPro && (
          <p className="mt-2 line-clamp-2 text-xs text-ink/60">
            <span className="font-bold text-ok">✓ </span>{firstPro}
          </p>
        )}
        <span className="mt-auto block pt-3 text-right text-sm font-bold text-accent transition-all group-hover:underline">
          詳しく見る →
        </span>
      </div>
    </Link>
  );
}
