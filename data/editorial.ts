export const editorialImages: Record<string, { src: string; alt: string }> = {
 cleaning: {src:'/images/editorial/cleaning.jpg',alt:'ロボット掃除機のあるリビングのイメージ'},
 dishwasher: {src:'/images/editorial/dishwasher.jpg',alt:'小型食洗機のあるキッチンのイメージ'},
 cooking: {src:'/images/editorial/cooking.jpg',alt:'調理家電と野菜のあるキッチンのイメージ'},
 laundry: {src:'/images/editorial/laundry.jpg',alt:'洗濯機とタオルを置いた洗面室のイメージ'},
 meal: {src:'/images/editorial/meal.jpg',alt:'ごはんとおかずを並べた毎日の食卓のイメージ'},
 beauty: {src:'/images/editorial/beauty.jpg',alt:'ドライヤーとタオルを置いた身支度の空間のイメージ'},
 water: {src:'/images/editorial/water.jpg',alt:'水のピッチャーとグラスのある食卓のイメージ'},
 hero: {src:'/images/editorial/hero.jpg',alt:'自然光が入る木のキッチンとダイニングのイメージ'},
};
export function categoryImage(category: string, slug = '') {
 if(slug.includes('dishwasher')) return editorialImages.dishwasher;
 const key = ({'food-delivery':'meal','water-server':'water',washer:'laundry',seasonal:'laundry',beauty:'beauty','personal-care':'beauty',vacuum:'cleaning',aircon:'hero',tv:'hero',gadget:'hero'} as Record<string,string>)[category] || 'cooking';
 return editorialImages[key];
}
export const homeFaq = [
 {q:'家電選びは、何から始めればいい？',a:'まず減らしたい家事を一つ決め、置き場所と家族の人数を確認しましょう。そのうえで、比較記事の向いている人・向いていない人を読み、型番ごとの仕様を確認すると選びやすくなります。'},
 {q:'調理家電と食材宅配、どう選べばいい？',a:'調理中の手間を減らしたいなら調理家電、献立や買い物の負担を見直したいなら食材宅配が検討の入口です。食材宅配にも調理が必要なミールキットと、温めて食べる冷凍おかずがあるので、残したい家事と減らしたい家事で比べてみてください。'},
 {q:'掲載商品は、どこで購入・申し込みできますか？',a:'各レビューにある販売店・公式サイトへのリンクから確認できます。価格、送料、対象地域、お試しや継続の条件は、申し込み前にリンク先で最新情報をご確認ください。'},
];
