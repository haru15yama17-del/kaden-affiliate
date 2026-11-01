import { Ruler, Clock3, ListChecks, ArrowRight, Home, ShieldCheck, Mail, Search } from "lucide-react";
import { EditorialImage } from "./EditorialImage";
import { categoryImage, editorialImages } from "@/data/editorial";
import type { Product } from "@/data/types";

const checks: Record<string, [string, string, string]> = {
  cooking: ["作りたい料理・使いたい場面", "置き場所と家族の人数", "準備から片付けまでの手間"],
  washer: ["洗濯と乾燥、それぞれの容量", "搬入経路と防水パンの寸法", "洗剤の補充・フィルター掃除"],
  vacuum: ["床材・段差・家具のすき間", "収納や充電に必要な場所", "ゴミ捨て・ブラシの掃除"],
  seasonal: ["使う季節と部屋の広さ", "音・置き場所・持ち運び", "運転時間とお手入れ"],
  aircon: ["部屋の広さと冷暖房の用途", "設置条件と標準工事の範囲", "消費電力とお手入れ"],
  "food-delivery": ["調理するタイプ？温めるタイプ？", "人数分・配達地域・配達日", "送料を含む費用と休止条件"],
  "water-server": ["使う水の量と水の種類", "設置場所とボトル交換", "月々の費用・契約期間・解約"],
  "personal-care": ["毎日の使い方と持ちやすさ", "付属品・収納・コードの長さ", "使用条件とお手入れ"],
  beauty: ["使える部位と使用できない条件", "1回の手順と使う頻度", "消耗品・保証・購入条件"],
  refrigerator: ["家族の人数と保存したい量", "搬入経路・扉を開ける余裕", "庫内の配置とお手入れ"],
  microwave: ["温め中心？調理にも使う？", "庫内の広さと設置スペース", "操作方法と庫内の掃除"],
  "rice-cooker": ["普段炊く量と作り置きの量", "炊きたいお米とメニュー", "内釜・内ぶたのお手入れ"],
  tv: ["画面サイズと見る距離", "設置場所とつなぐ機器", "見たい配信サービスへの対応"],
  gadget: ["使うアプリと作業内容", "持ち運び・重さ・画面サイズ", "端子・保証・サポート"],
};

export function ReadingSteps({category="cooking", slug=""}: {category?:string; slug?:string}) {
  const points = slug.includes("dishwasher")
    ? ["洗いたい食器の量と大きさ", "給水・排水・扉を開ける場所", "洗浄時間と毎日のお手入れ"]
    : checks[category] ?? checks.cooking;
  const icons = [ListChecks, Ruler, Clock3];
  return <div className="reading-steps not-prose" aria-label="購入前に確認したい3つのこと">
    {points.map((point,i)=>{const Icon=icons[i];return <div key={point} className="reading-step"><span className="reading-step-icon"><Icon size={25} aria-hidden="true"/></span><div><small>CHECK 0{i+1}</small><strong>{point}</strong></div></div>})}
  </div>;
}

export function ArticleWelcome({category,slug=""}: {category:string;slug?:string}) {
  return <aside className="article-welcome not-prose" aria-label="読む前の確認ポイント">
    <EditorialImage {...categoryImage(category,slug)} priority />
    <div className="article-welcome-copy"><p className="eyebrow">わが家に合う選び方</p><p className="welcome-title">欲しいのは、<br/>暮らしにちょうどいい選択。</p><p className="welcome-description">サービスも家電も、使う場面から考えると選びやすくなります。まずはこの3つを確認。</p><ReadingSteps category={category} slug={slug}/></div>
  </aside>;
}

export function ReadingPause({category,slug=""}: {category:string;slug?:string}) {
  return <aside className="reading-pause not-prose"><div className="reading-pause-heading"><span><Home size={25} aria-hidden="true"/></span><div><small>暮らしに置き換えてみる</small><p>わが家なら、どう使う？</p></div><ArrowRight size={23} aria-hidden="true"/></div><ReadingSteps category={category} slug={slug}/></aside>;
}

export function ProductGlance({p, link=true}: {p:Product; link?:boolean}) {
  return <div className="product-glance not-prose">
    {p.image ? <div className="product-glance-image"><img src={p.image} alt={p.name} width={480} height={320} loading="lazy"/></div> : <EditorialImage {...categoryImage(p.category,p.slug)}/>}
    <div><p className="eyebrow">{p.brand}</p><p className="glance-name">{p.name}</p><dl>{p.specs.slice(0,3).map(s=><div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>{link && <a className="text-link" href={'/reviews/'+p.slug}>詳しいレビューへ <ArrowRight size={16} aria-hidden="true"/></a>}</div>
  </div>;
}

export function SupportBanner({kind}: {kind:"about"|"privacy"|"disclaimer"|"contact"|"search"|"guides"|"notfound"}) {
  const text={about:["このサイトについて","暮らし目線で、選ぶお手伝い。"],privacy:["情報の取り扱い","必要な項目からご確認ください。"],disclaimer:["ご利用の前に","掲載情報と購入時の確認について。"],contact:["お問い合わせ","気になることを、お聞かせください。"],search:["探したいものから","商品名でも、家事の名前でも。"],guides:["選び方の道しるべ","比べる前に、暮らしを思い浮かべて。"],notfound:["道案内","トップや検索から探せます。"]}[kind];
  const Icon=kind==='contact'?Mail:kind==='search'?Search:kind==='privacy'||kind==='disclaimer'?ShieldCheck:Home;
  return <aside className="support-banner not-prose"><div><Icon size={34} aria-hidden="true"/><small>{text[0]}</small><p>{text[1]}</p></div><EditorialImage {...editorialImages.hero}/></aside>;
}
