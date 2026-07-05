export interface Article {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export const articles: Article[] = [
  {
    slug: "hotcook-koukai",
    title: "ホットクックで後悔しない？型番別の選び方",
    category: "cooking",
    description: "KN-HW24H/16H/10Gの3型番を比較し、後悔しやすい5つのポイントを主婦目線で解説",
  },
  {
    slug: "atsuryokunabe-koukai",
    title: "電気圧力鍋とホットクックを徹底比較",
    category: "cooking",
    description: "アイリスオーヤマ KPC-MA4の弱点と、ホットクックとの調理方式の違いを正直に解説",
  },
  {
    slug: "personal-dishwasher-koukai",
    title: "工事不要のパーソナル食洗機を比較",
    category: "cooking",
    description: "パナソニックSOLOTA NP-TML1とサンコー ラクアmini colorをスペックで比較",
  },
  {
    slug: "joshitsuki-koukai",
    title: "除湿機おすすめ4台を比較",
    category: "seasonal",
    description: "コンプレッサー式・デシカント式・ハイブリッド式の違いと部屋干し向け4選",
  },
  {
    slug: "senpuki-koukai",
    title: "扇風機とサーキュレーターの違いを比較",
    category: "seasonal",
    description: "バルミューダ2機種とアイリスWOOZOOを主婦目線で比較",
  },
  {
    slug: "drum-washer-koukai",
    title: "ドラム式洗濯機おすすめ5選を比較",
    category: "washer",
    description: "低価格グループ2台・人気ブランドグループ3台を乾燥方式で比較",
  },
  {
    slug: "aircon-2027-koukai",
    title: "エアコン2027年問題とおすすめ5機種",
    category: "aircon",
    description: "2027年の省エネ基準引き上げを踏まえ、工事費込みで選べるモデルを比較",
  },
  {
    slug: "hairdryer-koukai",
    title: "ヘアドライヤーおすすめ4台を比較",
    category: "personal-care",
    description: "ブライト・ReFa・KINUJO・パナソニックEH-NA0Kを風量・重量・価格帯で比較",
  },
];
