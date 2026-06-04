import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="パンくず" className="text-sm text-ink/60 mb-6">
      <JsonLd data={breadcrumbJsonLd(items)} />
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i < items.length - 1 ? (
              <Link href={it.path} className="hover:text-accent underline-offset-2 hover:underline">
                {it.name}
              </Link>
            ) : (
              <span className="text-ink/80">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
