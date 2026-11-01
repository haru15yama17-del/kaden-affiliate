export function EditorialImage({src,alt,priority=false,className=''}:{src:string;alt:string;priority?:boolean;className?:string}) {
 return <div className={'editorial-image '+className}><img src={src} alt={alt} width={1536} height={1024} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async"/><span>暮らしのイメージ・AI生成</span></div>;
}
