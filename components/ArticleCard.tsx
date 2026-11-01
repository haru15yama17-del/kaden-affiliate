import Link from 'next/link';
import type { Article } from '@/data/articles';
import { categoryImage } from '@/data/editorial';
import { EditorialImage } from './EditorialImage';
export function ArticleCard({a}:{a:Article}) {
 return <Link href={'/reviews/'+a.slug} className="story-card"><EditorialImage {...categoryImage(a.category, a.slug)}/><div className="story-copy"><span className="eyebrow">購入前に読みたい</span><h3>{a.title}</h3><p>{a.description}</p><span className="text-link">違いと選び方を読む ↗</span></div></Link>;
}
