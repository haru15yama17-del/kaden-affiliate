import {JsonLd} from './JsonLd';
import {site} from '@/data/site';
export function GuideSchema({title,path,modified}:{title:string;path:string;modified?:string}){
 return <JsonLd data={{'@context':'https://schema.org','@type':'Article',headline:title,mainEntityOfPage:site.url+path,url:site.url+path,inLanguage:'ja',...(modified?{dateModified:modified}:{}),publisher:{'@type':'Organization',name:site.name,url:site.url}}}/>;
}
