import Link from 'next/link';
import { Search,House } from 'lucide-react';
export function SiteHeader() {
 return <header className="site-header"><div className="header-top"><Link href="/" className="brand"><span className="brand-icon"><House size={25}/></span><span><small>毎日に、ちょうどいい選択を。</small><strong>主婦の家電と暮らし研究室</strong></span></Link><Link href="/search" aria-label="型番・記事を探す" className="search-link"><Search size={18}/><span>型番・記事を探す</span></Link></div><nav aria-label="メインナビゲーション" className="main-nav"><Link href="/#concerns">家事の悩みから探す</Link><Link href="/category/cooking">料理・キッチン</Link><Link href="/category/washer">洗濯・部屋干し</Link><Link href="/category/food-delivery">食材宅配</Link><Link href="/category/water-server">水のある暮らし</Link><Link href="/category/beauty">美容・自分時間</Link><Link href="/guides">比較・選び方</Link></nav></header>;
}
