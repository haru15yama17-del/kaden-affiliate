import type { SpecRow } from "@/data/types";
import { Tag, Zap, Paintbrush } from "lucide-react";

export function SpecHighlights({
  priceRange,
  specs,
}: {
  priceRange: string;
  specs: SpecRow[];
}) {
  const findSpec = (keywords: string[]) =>
    specs.find((s) => keywords.some((k) => s.label.includes(k)));

  const electricSpec = findSpec(["電気代"]);
  const careSpec = findSpec(["お手入れ", "掃除", "クリーン"]);

  const items = [
    { Icon: Tag, label: "価格帯", value: priceRange },
    electricSpec ? { Icon: Zap, label: "電気代目安", value: electricSpec.value } : null,
    careSpec ? { Icon: Paintbrush, label: "お手入れ", value: careSpec.value } : null,
  ].filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="not-prose mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {items.map(({ Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3 rounded-xl bg-moss p-3.5">
          <Icon size={18} className="mt-0.5 shrink-0 text-sub" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-sub/70">{label}</p>
            <p className="text-sm font-semibold text-ink">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
