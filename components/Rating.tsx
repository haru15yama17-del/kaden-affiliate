export function Rating({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const full = Math.round(value);
  const s = {
    sm: { star: "text-sm leading-none", num: "text-sm font-semibold" },
    md: { star: "text-base leading-none", num: "text-base font-semibold" },
    lg: { star: "text-2xl leading-none", num: "text-2xl font-bold" },
  }[size];

  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`評価 ${value} / 5`}>
      <span className={`${s.star} text-gold tracking-tight`} aria-hidden>
        {"★".repeat(full)}
        <span className="text-ink/20">{"★".repeat(5 - full)}</span>
      </span>
      <span className={`${s.num} tabular-nums text-ink`}>{value.toFixed(1)}</span>
    </span>
  );
}
