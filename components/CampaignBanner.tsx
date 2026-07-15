import { getActiveCampaign } from "@/data/campaigns";
import { productMap } from "@/data/products";
import { TrackedLink } from "@/components/TrackedLink";

/** 対象商品にキャンペーン期間中のみ表示される告知ボックス。期間外は自動的に何も描画しない。 */
export function CampaignBanner({ slug }: { slug: string }) {
  const campaign = getActiveCampaign(slug);
  if (!campaign) return null;

  const product = productMap[slug];
  const href = product?.affiliate.officialUrl;
  if (!product || !href) return null;

  const isAffiliateLink = product.affiliate.isAffiliateLink ?? true;
  const [, endMonth, endDay] = campaign.endDate.split("-");

  return (
    <div className="not-prose my-6 rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 via-blush/40 to-white p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-white">期間限定</span>
        <span className="text-xs font-bold text-gold">{Number(endMonth)}/{Number(endDay)}まで</span>
        <span className="ml-auto rounded border border-ink/20 px-1.5 py-0.5 text-[10px] font-bold text-ink/40">PR</span>
      </div>

      <p className="font-serif text-lg font-bold leading-snug text-ink">🎁 {campaign.title}</p>

      <ul className="mt-3 space-y-1.5">
        {campaign.points.map((pt) => (
          <li key={pt} className="flex items-start gap-1.5 text-sm text-ink/80">
            <span className="mt-0.5 shrink-0 font-bold text-gold">✓</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>

      <TrackedLink
        href={href}
        productName={product.name}
        affiliateType="official"
        rel={isAffiliateLink ? "nofollow sponsored noopener" : "noopener"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:brightness-110"
      >
        <span>キャンペーン詳細を見る（公式サイト）</span>
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </TrackedLink>

      {isAffiliateLink && (
        <p className="mt-2.5 text-center text-xs text-ink/40">※アフィリエイト広告を利用しています</p>
      )}
    </div>
  );
}
