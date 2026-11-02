import type { Product } from "@/data/types";
const aliases:Record<string,string>={重量:'重さ',質量:'重さ',本体質量:'重さ',手入れ:'お手入れ',標準収納容量:'食器容量'};
export function comparisonSpecs(p:Product){
  const rows=p.specs.filter(s=>s.label!=='特徴タグ').map(s=>({...s,label:aliases[s.label]??s.label}));
  const combined=rows.find(s=>s.label==='洗濯/乾燥容量');
  if(combined){
    const wash=combined.value.match(/洗濯\s*([\d.]+kg)/);
    const dry=combined.value.match(/乾燥\s*([\d.]+kg)/);
    if(wash&&dry){rows.splice(rows.indexOf(combined),1,{label:'洗濯容量',value:wash[1]},{label:'乾燥容量',value:dry[1]});}
  }
  return rows;
}
