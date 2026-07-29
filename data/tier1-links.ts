// 家電記事（集客）からTier1収益記事への内部導線。
// 誘導先は収益化済みの記事のみ（食材宅配はヨシケイ・ワタミの宅食ダイレクトのみ・
// パルシステム/コープデリ/オイシックスは対象外）。
// water-serverは本文中に自然につながる文脈（お湯・水質等）を持つ記事が見当たらなかったため見送り。
// 該当記事が増えたら tier1Destinations に追加検討。

export interface Tier1Destination {
  href: string;
  title: string;
}

export const tier1Destinations = {
  "food-delivery": {
    href: "/reviews/yoshikei",
    title: "はるのヨシケイ体験レビュー",
  },
  "food-delivery-watami": {
    href: "/reviews/watami-takushoku-direct",
    title: "はるのワタミの宅食ダイレクト体験レビュー",
  },
} as const satisfies Record<string, Tier1Destination>;

export type Tier1DestinationKey = keyof typeof tier1Destinations;

export interface Tier1Link {
  to: Tier1DestinationKey;
  reason: string;
}

// 記事slug ごとの紐付け（1〜2件・文脈が自然につながる場合のみ）
export const relatedTier1: Record<string, Tier1Link[]> = {
  "personal-dishwasher-koukai": [
    {
      to: "food-delivery",
      reason: "食後の片付けがラクになったら、次は献立を考える手間も減らしてみませんか",
    },
    {
      to: "food-delivery-watami",
      reason: "洗い物をもっと減らしたいなら、レンジで温めるだけの冷凍おかずも選択肢です",
    },
  ],
  "futon-dryer-koukai": [
    {
      to: "food-delivery",
      reason: "布団まわりの家事がラクになったら、毎日の献立準備もまとめて時短できます",
    },
    {
      to: "food-delivery-watami",
      reason: "忙しい日のストックに、レンジで温めるだけの冷凍おかずがあると安心です",
    },
  ],
  "robot-cleaner-koukai": [
    {
      to: "food-delivery",
      reason: "掃除の自動化で生まれた時間を、献立準備の時短にも使ってみませんか",
    },
    {
      to: "food-delivery-watami",
      reason: "掃除を自動化した分、食事づくりも冷凍ストックのおかずで手放してみませんか",
    },
  ],
  "hotcook-koukai": [
    {
      to: "food-delivery",
      reason: "献立を考える手間まで手放したいなら、毎日届くミールキットとの組み合わせも一案です",
    },
    {
      to: "food-delivery-watami",
      reason: "調理の工程ごと減らしたい日は、レンジで温めるだけの冷凍おかずも便利です",
    },
  ],
  "atsuryokunabe-koukai": [
    {
      to: "food-delivery",
      reason: "加熱はほったらかしにできても、下ごしらえの手間はミールキットで手放せます",
    },
    {
      to: "food-delivery-watami",
      reason: "下ごしらえも調理も省きたい日は、冷凍のおかずをストックしておくと安心です",
    },
  ],
  "joshitsuki-koukai": [
    {
      to: "food-delivery",
      reason: "部屋干しの家事がラクになったら、毎日の献立準備も時短したい方に",
    },
    {
      to: "food-delivery-watami",
      reason: "家事の負担を減らしたい方には、ストックできる冷凍おかずも心強い味方です",
    },
  ],
  "drum-washer-koukai": [
    {
      to: "food-delivery",
      reason: "洗濯の時短ができたら、毎日の献立準備もまとめて時短したい方に",
    },
    {
      to: "food-delivery-watami",
      reason: "洗濯の手間が減った分、食事づくりも冷凍ストックのおかずで手放してみませんか",
    },
  ],
};
