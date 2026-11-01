import { SupportBanner } from "@/components/ReadingGuide";
import {articles} from '@/data/articles';
import {categories} from '@/data/categories';
import {ArticleCard} from '@/components/ArticleCard';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {JsonLd} from '@/components/JsonLd';
import {itemListJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';
export const metadata=buildMetadata({title:'家電の比較・選び方ガイド｜型番の違いと購入前の確認ポイント',description:'ホットクック、ドラム式洗濯機、食洗機、ドライヤーなど、型番の違いと気になる点を主婦目線で整理した比較記事の一覧です。',path:'/guides'});
export default function GuidesPage(){return <div><Breadcrumbs items={[{name:'トップ',path:'/'},{name:'比較・選び方',path:'/guides'}]}/><JsonLd data={itemListJsonLd(articles.map(a=>({name:a.title,path:'/reviews/'+a.slug})))}/><div className="guide-intro"><p className="eyebrow">BEFORE YOU BUY</p><h1>買う前に、知っておきたいこと。</h1><p>型番の違い、置き場所、お手入れ。わが家に合う一台を探すための比較・選び方ガイド。</p></div><SupportBanner kind="guides"/><nav aria-label="記事カテゴリ" className="category-jumps">{categories.filter(c=>articles.some(a=>a.category===c.slug)).map(c=><a key={c.slug} href={'#'+c.slug}>{c.name}</a>)}</nav>{categories.filter(c=>articles.some(a=>a.category===c.slug)).map(c=><section className="home-section" key={c.slug} id={c.slug}><div className="section-heading"><h2>{c.name}の比較と選び方</h2></div><div className="story-grid">{articles.filter(a=>a.category===c.slug).map(a=><ArticleCard key={a.slug} a={a}/>)}</div></section>)}</div>}
