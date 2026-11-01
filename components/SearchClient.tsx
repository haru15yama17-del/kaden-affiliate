"use client";
import {useMemo,useState} from 'react';
import Link from 'next/link';
import type {Product} from '@/data/types';
import {articles} from '@/data/articles';
import {categories} from '@/data/categories';
export function SearchClient({products}:{products:Pick<Product,'slug'|'name'|'brand'|'category'>[]}){
 const [q,setQ]=useState('');
 const normalize=(v:string)=>v.normalize('NFKC').toLowerCase().replace(/[\sー－−‐-]/g,'');
 const results=useMemo(()=>{
  const key=normalize(q.trim());if(!key)return [];
  const entries=[...articles.map(a=>({slug:a.slug,name:a.title,kind:'比較・選び方',search:a.title+' '+a.description+' '+(categories.find(c=>c.slug===a.category)?.name||'')})),...products.map(p=>({slug:p.slug,name:p.name,kind:'商品・サービス',search:p.name+' '+p.brand+' '+(categories.find(c=>c.slug===p.category)?.name||p.category)}))];
  return entries.filter(p=>normalize(p.search).includes(key));
 },[q,products]);
 return <div><label htmlFor="site-search" className="mt-6 block text-sm font-semibold">型番・商品名・暮らしの悩みを入力</label><input id="site-search" type="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="例：KN-HW16H、洗濯機、食材宅配" className="mt-3 w-full rounded-lg border border-ink/20 bg-white px-4 py-4"/><div className="category-jumps" aria-label="検索例">{['ホットクック','洗濯機','食材宅配','ドライヤー'].map(word=><button className="rounded-full border border-ink/20 px-4 py-2 text-xs" key={word} onClick={()=>setQ(word)}>{word}</button>)}</div><p aria-live="polite" role="status" className="text-sm text-ink/70">{q?results.length+'件見つかりました':'型番のハイフンや全角・半角を気にせず探せます。'}</p><ul className="mt-5 space-y-3">{results.map(p=><li key={p.slug}><Link className="search-result" href={'/reviews/'+p.slug}><small>{p.kind}</small><strong>{p.name} ↗</strong></Link></li>)}</ul>{q&&results.length===0&&<p className="mt-5">短い型番やカテゴリ名でもお試しください。<Link className="text-link" href="/guides">比較・選び方の一覧を見る →</Link></p>}</div>
}
