"use client";
import { useState } from "react";
import { Camera } from "lucide-react";
import { productPhoto } from "@/lib/productPhotos";
export function ProductPhoto({slug,name,compact=false,credit=true}:{slug:string;name:string;compact?:boolean;credit?:boolean}) {
  const photo=productPhoto(slug);
  const [failed,setFailed]=useState(false);
  return <figure className={`real-product-photo not-prose ${compact?'is-compact':''}`}>
    {photo && !failed ? <img src={photo.src} alt={`${name}：${photo.caption}`} width={480} height={360} loading="lazy" decoding="async" onError={()=>setFailed(true)}/> : <div className="product-photo-empty"><Camera size={30} aria-hidden="true"/><span>{slug.includes('omakase')?'メーカー・型番おまかせ':slug==='iris-dcf-jm151t-fan'||slug.includes('lenovo')?'型番を確認できる商品写真は未掲載':'外観は販売先でご確認ください'}</span></div>}
    {photo && !failed && photo.kind && photo.kind !== "product" && <span className="photo-example-label">{photo.kind === "food-example" ? "食品・調理例" : "掲載機種の一例"}</span>}
    {credit && photo && <figcaption>{photo.caption}<br/><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">写真出典：{photo.sourceLabel} ↗</a></figcaption>}
  </figure>;
}
