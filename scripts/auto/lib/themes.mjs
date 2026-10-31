// 分類に使う固定テーマ（件数を安定して集計するため、Geminiには自由記述させない）
const COMMON = [
  { id: "usability", label: "使いやすさ" },
  { id: "performance", label: "性能・効果" },
  { id: "noise", label: "動作音" },
  { id: "design", label: "デザイン・見た目" },
  { id: "size", label: "サイズ・設置性" },
  { id: "maintenance", label: "お手入れのしやすさ" },
  { id: "value", label: "価格に対する満足度" },
  { id: "quality", label: "作りの良さ・耐久性" },
  { id: "setup", label: "設定・操作の分かりやすさ" }
];

const BY_CATEGORY = {
  refrigerator: [{ id: "capacity", label: "収納力・容量" }, { id: "cooling", label: "冷え具合" }, { id: "energy", label: "省エネ性" }],
  washer: [{ id: "capacity", label: "洗濯容量" }, { id: "cleaning", label: "洗い上がり" }, { id: "dry", label: "乾燥の仕上がり" }],
  vacuum: [{ id: "suction", label: "吸引力" }, { id: "battery", label: "バッテリーの持ち" }, { id: "weight", label: "軽さ・取り回し" }],
  "rice-cooker": [{ id: "taste", label: "炊き上がりの味" }, { id: "capacity", label: "容量" }, { id: "keepwarm", label: "保温" }],
  microwave: [{ id: "heating", label: "加熱のムラ" }, { id: "capacity", label: "庫内の広さ" }],
  aircon: [{ id: "cooling", label: "冷暖房の効き" }, { id: "energy", label: "省エネ性" }],
  tv: [{ id: "picture", label: "画質" }, { id: "sound", label: "音質" }],
  beauty: [{ id: "effect", label: "使用感・仕上がり" }],
  gadget: []
};

export function themesFor(category) {
  return [...COMMON, ...(BY_CATEGORY[category] ?? [])];
}
