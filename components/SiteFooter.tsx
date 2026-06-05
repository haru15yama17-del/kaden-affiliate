import Link from "next/link";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      {/* ステマ規制対応：アフィリエイト広告表示（目立つ位置に配置） */}
      <div className="border-b border-accent/15 bg-blush/40 px-4 py-3 text-center">
        <p className="text-xs text-ink/65">
          本サイトはアフィリエイト広告（Amazonアソシエイト・もしもアフィリエイト等）を利用しています
        </p>
      </div>

      {/* Trust strip */}
      <div className="border-b border-ink/8 bg-ink/3">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-2 px-4 py-4 text-xs text-ink/60">
          <span className="flex items-center gap-1.5">
            <span className="text-ok">✓</span> 評価軸を事前に公開
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-ok">✓</span> 更新日を全記事に記載
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-ok">✓</span> 広告主による評価変更なし
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-ok">✓</span> アフィリエイト広告利用あり
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-ink/70">
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">主</span>
          <span className="font-serif font-bold text-ink">{site.name}</span>
        </div>
        <p className="mb-4 max-w-2xl text-xs leading-relaxed text-ink/60">
          当サイトはアフィリエイト広告（Amazonアソシエイト・楽天アフィリエイト・もしもアフィリエイト等）を利用しています。
          掲載の価格・仕様は更新時点のものです。最新情報は各販売店・公式サイトでご確認ください。
        </p>
        <nav className="flex flex-wrap gap-4 text-xs">
          <Link href="/about" className="hover:text-accent">運営者情報</Link>
          <Link href="/privacy" className="hover:text-accent">プライバシーポリシー</Link>
          <Link href="/disclaimer" className="hover:text-accent">免責事項</Link>
          <Link href="/contact" className="hover:text-accent">お問い合わせ</Link>
        </nav>
        <p className="mt-6 text-xs text-ink/40">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
