import { getAllProducts } from "@/lib/data";
import { SearchClient } from "@/components/SearchClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "サイト内検索", description: "商品名・ブランド・カテゴリで検索できます。", path: "/search"
});

export default async function SearchPage() {
  const all = await getAllProducts();
  const index = all.map((p) => ({ slug: p.slug, name: p.name, brand: p.brand, category: p.category }));
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">サイト内検索</h1>
      <SearchClient products={index} />
    </div>
  );
}
