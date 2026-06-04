import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-serif text-3xl font-bold">ページが見つかりません</h1>
      <p className="mt-3 text-ink/60">お探しのページは移動または削除された可能性があります。</p>
      <Link href="/" className="mt-6 inline-block rounded-md bg-accent px-5 py-2 font-bold text-white">トップへ戻る</Link>
    </div>
  );
}
