import type { Metadata } from 'next';
import Link from 'next/link';
import {ArrowRight,CookingPot,WashingMachine,Sparkles,Droplets,Utensils,Search,Check} from 'lucide-react';
import {categories} from '@/data/categories';
import {articles} from '@/data/articles';
import {editorialImages,homeFaq} from '@/data/editorial';
import {EditorialImage} from '@/components/EditorialImage';
import {ArticleCard} from '@/components/ArticleCard';
import {JsonLd} from '@/components/JsonLd';
import {faqJsonLd,itemListJsonLd} from '@/lib/jsonld';
import {site} from '@/data/site';
const description='料理、洗濯、掃除をもっと自分らしく。主婦・共働き家庭のための家電と暮らしの比較メディア。ホットクックやドラム式洗濯機の型番比較、食材宅配の選び方を、家事の悩みから探せます。';
export const metadata:Metadata={title:{absolute:'家事に、少しの余白を。家電・食材宅配の選び方｜主婦の家電と暮らし研究室'},description,alternates:{canonical:site.url},openGraph:{title:'家事に、少しの余白を。',description,url:site.url,siteName:site.name,type:'website',locale:'ja_JP',images:[{url:site.url+'/images/editorial/hero.jpg',width:1536,height:1024,alt:'明るいキッチンとダイニングのイメージ'}]},twitter:{card:'summary_large_image',title:site.name,description,images:[site.url+'/images/editorial/hero.jpg']}};
const concerns=[
 {icon:CookingPot,title:'夕飯づくりをラクに',sub:'調理家電・食材宅配',href:'/category/cooking'},
 {icon:WashingMachine,title:'洗濯をためこまない',sub:'洗濯機・部屋干し',href:'/category/washer'},
 {icon:Sparkles,title:'掃除に追われない',sub:'掃除機・ロボット掃除機',href:'/category/vacuum'},
 {icon:Droplets,title:'水の準備を見直す',sub:'ウォーターサーバー',href:'/category/water-server'},
 {icon:Utensils,title:'献立を考えたくない',sub:'ミールキット・冷凍おかず',href:'/category/food-delivery'},
 {icon:Sparkles,title:'自分のケアも大切に',sub:'美容家電・ドライヤー',href:'/category/beauty'},
];
const selected=['hotcook-koukai','drum-washer-koukai','robot-cleaner-koukai','hairdryer-koukai','joshitsuki-koukai','personal-dishwasher-koukai'].map(slug=>articles.find(a=>a.slug===slug)!);
export default function HomePage(){return <div className="home-page">
 <JsonLd data={{'@context':'https://schema.org','@type':'WebSite','@id':site.url+'/#website',name:site.name,url:site.url,inLanguage:'ja',description}}/>
 <JsonLd data={itemListJsonLd(selected.map(a=>({name:a.title,path:'/reviews/'+a.slug})))}/>
 <JsonLd data={faqJsonLd(homeFaq)}/>
 <section className="home-hero"><div className="hero-copy"><p className="eyebrow">暮らしを選ぶ、小さな研究室。</p><h1>家事に、<br/>少しの<span>余白</span>を。</h1><p className="hero-description">毎日がんばるあなたに、<br/>ちょうどいい家電と、暮らしの選択を。</p><p className="hero-small">料理も、洗濯も、自分の時間も。<br/>「わが家に合う」が見つかる比較と選び方。</p><Link href="#concerns" className="primary-button">わたしの悩みから探す <ArrowRight size={18}/></Link><p className="hero-note">主婦・共働き家庭のための家電と暮らしのメディア</p></div><div className="hero-photo"><EditorialImage {...editorialImages.hero} priority/><div className="hero-stamp">もっと、<br/><b>わたしらしい</b><br/>毎日へ。</div></div></section>
 <div className="editorial-strip"><span><Check size={15}/>向いている人・いない人まで</span><span><Check size={15}/>型番の違いを横並びに</span><span><Check size={15}/>買う前の気になる点も</span><small>アフィリエイト広告を利用しています</small></div>
 <section id="concerns" className="home-section"><div className="section-heading"><div><p className="eyebrow">FIND YOUR EVERYDAY</p><h2>いま、どの家事をラクにしたい？</h2></div><p>気になる悩みから、ひとつずつ。</p></div><div className="concern-grid">{concerns.map(({icon:Icon,...c})=><Link key={c.title} href={c.href} className="concern-card"><Icon size={29} strokeWidth={1.4}/><strong>{c.title}</strong><small>{c.sub}</small><ArrowRight size={16}/></Link>)}</div></section>
 <section className="feature-section"><div className="feature-photo"><EditorialImage {...editorialImages.cooking}/></div><div className="feature-copy"><p className="eyebrow">今、見直したい暮らしのこと</p><span className="pill">料理の時間を、わたしの時間に。</span><h2>「ホットクック、<br/>わが家にはどう？」</h2><p>便利そう。でも、置き場所は？容量は？<br/>買ってから迷わないために、<br/>KN-HW24H・16H・10Gの違いを整理。</p><div className="feature-tags"><span>家族の人数</span><span>置き場所</span><span>調理スタイル</span></div><Link className="primary-button" href="/reviews/hotcook-koukai">3つの型番と選び方を見る <ArrowRight size={18}/></Link></div></section>
 <section id="guides" className="home-section"><div className="section-heading"><div><p className="eyebrow">BEFORE YOU BUY</p><h2>買う前に、知っておきたいこと。</h2></div><Link className="text-link" href="/guides">比較・選び方をすべて見る ↗</Link></div><div className="story-grid">{selected.map(a=><ArticleCard key={a.slug} a={a}/>)}</div></section>
 <section className="meal-feature"><div className="meal-intro"><p className="eyebrow">家電だけが、答えじゃない。</p><h2>「今日、何つくろう？」<br/>その悩みにも、選択肢を。</h2><p>つくる時間を楽しみたい日も、<br/>温めるだけにしたい日も。<br/>家族と自分に合った食事のスタイルを探してみませんか。</p><Link className="text-link" href="/category/food-delivery">食材宅配・ミールキットを比べる <ArrowRight size={16}/></Link></div><div><EditorialImage {...editorialImages.meal}/><div className="meal-options"><Link href="/reviews/yoshikei"><small>献立や買い物の負担を見直したい</small><strong>ミールキットを検討する ↗</strong><span>ヨシケイの特徴を読む</span></Link><Link href="/reviews/watami-takushoku-direct"><small>調理の工程を減らしたい</small><strong>冷凍おかずを検討する ↗</strong><span>ワタミの宅食ダイレクトを読む</span></Link></div></div></section>
 <section className="home-section"><div className="section-heading"><div><p className="eyebrow">LITTLE MOMENTS</p><h2>暮らしの、こんなところにも。</h2></div></div><div className="lifestyle-grid">{[{image:'water',href:'/category/water-server',label:'毎日の水を、もっと心地よく。',sub:'ウォーターサーバーの選び方'},{image:'beauty',href:'/category/personal-care',label:'忙しい朝にも、自分をいたわる時間。',sub:'ドライヤー・パーソナルケア'}].map(c=><Link className="lifestyle-card" key={c.image} href={c.href}><EditorialImage {...editorialImages[c.image]}/><div><h3>{c.label}</h3><p>{c.sub} <span>↗</span></p></div></Link>)}</div></section>
 <section id="categories" className="category-directory"><div><p className="eyebrow">CATEGORY</p><h2>探したいものが、決まっているなら。</h2></div><div>{categories.map(c=><Link key={c.slug} href={'/category/'+c.slug}>{c.name}<span>→</span></Link>)}</div></section>
 <section className="home-section choose-steps"><div><p className="eyebrow">OUR GUIDE</p><h2>わが家に合う、を<br/>見つける3つのステップ。</h2><Link className="text-link" href="/about">このサイトについて ↗</Link></div><ol>{[{n:'01',title:'減らしたい家事を決める',body:'毎日の「ちょっと大変」を入口に、必要な機能を考えます。'},{n:'02',title:'違いと気になる点を比べる',body:'サイズ、手入れ、家族の人数。いいところだけでなく、向かない条件も確認。'},{n:'03',title:'最新の条件を確認して選ぶ',body:'販売店・公式サイトで、価格や送料、申し込み条件を確認しましょう。'}].map(s=><li key={s.n}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}</ol></section>
 <section className="home-section home-faq"><div className="section-heading"><div><p className="eyebrow">QUESTIONS</p><h2>選び始める前の、小さな疑問。</h2></div></div>{homeFaq.map(f=><details key={f.q}><summary><span>Q</span>{f.q}</summary><p>{f.a}</p></details>)}</section>
 <section className="search-banner"><div><p className="eyebrow">気になる型番はありますか？</p><h2>名前が分かれば、もっと近道。</h2></div><Link href="/search" className="primary-button"><Search size={18}/>型番・商品名・記事で探す</Link></section>
 </div>;}
