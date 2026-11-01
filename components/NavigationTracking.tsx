"use client";
import {useEffect} from 'react';
export function NavigationTracking(){
 useEffect(()=>{
  function track(event:MouseEvent){
   const target=event.target instanceof Element?event.target.closest('a'):null;
   if(!target)return;
   const href=target.getAttribute('href')||'';
   if(!href.startsWith('/reviews/')&&!href.startsWith('/category/')&&href!='/guides')return;
   const section=target.closest('section');
   const dataLayer=(window as unknown as {dataLayer?:unknown[]}).dataLayer;
   // GA4 uses the gtag arguments-array command format.
   function gtag(..._args:unknown[]){dataLayer?.push(arguments)}
   gtag('event','content_navigation',{link_path:href,source_path:window.location.pathname,section_id:section?.id||'navigation'});
  }
  document.addEventListener('click',track);return()=>document.removeEventListener('click',track);
 },[]);
 return null;
}
