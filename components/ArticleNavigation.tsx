"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
// Existing hand-authored articles stay intact. Build an accessible table of
// contents from their rendered headings without changing the article copy.
export function ArticleNavigation(){
 const pathname=usePathname();
 useEffect(()=>{
  if(!/^\/(reviews|compare|about|privacy|disclaimer)/.test(pathname))return;
  const article=document.querySelector('.prose-article');
  if(!article)return;
  const headings=Array.from(article.querySelectorAll('h2'));
  if(headings.length<3)return;
  const previous=headings.map(h=>h.id);
  const details=document.createElement('details');details.className='article-toc';details.open=false;
  const summary=document.createElement('summary');summary.textContent='この記事でわかること';details.appendChild(summary);
  const list=document.createElement('ol');
  headings.forEach((h,i)=>{if(!h.id)h.id='section-'+(i+1);const li=document.createElement('li');const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;li.appendChild(a);list.appendChild(li)});
  details.appendChild(list);(headings[0].closest('.reading-section') || headings[0]).before(details);
  return()=>{details.remove();headings.forEach((h,i)=>{if(!previous[i])h.removeAttribute('id')})};
 },[pathname]);
 return null;
}
