import Link from "next/link";
import { site } from "@/data/site";
import { categories } from "@/data/categories";

const catEmoji: Record<string, string> = {
  "water-server": "💧",
  "food-delivery": "🥘",
  cooking: "🍳",
  seasonal: "🌤️",
  refrigerator: "❄️",
  washer: "🌀",
  vacuum: "🌪️",
  microwave: "📡",
  "rice-cooker": "🍚",
  tv: "📺",
  aircon: "🌡️",
  beauty: "✨",
  gadget: "📱",
  "personal-care": "💆",
};

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur shadow-sm">
      {/* Accent line */}
      <div className="h-1.5 bg-gradient-to-r from-accent via-rose-300 to-gold" />

      <div className="mx-auto flex max-w-5xl items-center gap-x-5 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-serif text-xl font-bold text-ink">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            家
          </span>
          <span className="hidden sm:inline">{site.name}</span>
          <span className="sm:hidden">主婦研究室</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap text-ink/65 transition-colors hover:text-accent"
            >
              <span className="mr-0.5 text-xs">{catEmoji[c.slug]}</span>
              {c.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <Link
          href="/search"
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 text-sm text-ink/65 transition-colors hover:border-accent hover:text-accent"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          検索
        </Link>
      </div>

      {/* Mobile category scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto border-t border-ink/8 px-4 py-2 text-xs scrollbar-hide">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap text-ink/60 hover:text-accent"
          >
            <span>{catEmoji[c.slug]}</span>
            {c.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
