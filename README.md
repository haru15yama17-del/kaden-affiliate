# 家電アフィリエイト比較・レビューサイト（スキャフォールド）

実機・公開スペックをもとに家電を横並びで比較するレビューメディアの土台です。
Next.js 14 (App Router) + TypeScript + Tailwind で構築し、`npm run build` が通る状態で出荷しています。

---

## 1. 全体設計

### サイトの役割
「家電を横並びで比較して、自分に合う一台を選べる」ことに特化したレビューメディア。
量産記事ではなく、選び方の軸・比較表・向き不向きを各記事に必ず入れて差別化します。

### ページ種別とURL設計
| ページ | URL | 役割 |
|---|---|---|
| トップ | `/` | カテゴリ入口＋注目レビュー |
| カテゴリ | `/category/{slug}` | 選び方＋商品一覧 |
| レビュー記事 | `/reviews/{product-slug}` | 商品単体の評価（口コミ・評判も集約） |
| 比較記事 | `/compare/{a}-vs-{b}` | 2商品以上の横並び比較 |
| ランキング | `/ranking/{category-slug}` | カテゴリ内おすすめ順 |
| 検索 | `/search` | サイト内検索 |
| 運営者情報 | `/about` | E-E-A-T（誰が評価したか） |
| プライバシー | `/privacy` | 個人情報・広告開示 |
| 免責事項 | `/disclaimer` | 価格変動・PR表記 |
| お問い合わせ | `/contact` | 修正依頼の受付 |

カテゴリslug：`refrigerator / washer / vacuum / microwave / rice-cooker / tv / aircon / beauty / gadget`

### 内部リンク設計
- レビュー記事 → 同カテゴリの関連レビュー（`relatedReviews`）
- レビュー記事 → 競合との比較記事（`competitorProducts` → `/compare/...`）
- カテゴリ → ランキング、ランキング → 各レビュー
- パンくず（構造化データ付き）で階層を明示

---

## 2. 技術スタック

| 領域 | 採用 | 理由 |
|---|---|---|
| フレームワーク | Next.js 14 App Router | SSG中心で高速・SEOに強い |
| 言語 | TypeScript | データ構造を型で守る |
| スタイル | Tailwind CSS | 軽量・保守容易 |
| 記事本文 | 構造化データ + JSON本文 | 量産より「型に沿った独自記事」を担保（MDXへの移行も容易） |
| データ | TS/JSONファイル（→将来Supabase） | まず低コスト、規模拡大時にDBへ |
| ホスティング | Vercel | Next.jsと相性が良くプレビューも簡単 |

> セキュリティ：Next は `14.2.35`（パッチ適用版）で固定。定期的に `npm audit` と更新を。

---

## 3. ディレクトリ構成

```
kaden-affiliate/
├ app/
│  ├ layout.tsx / page.tsx / globals.css
│  ├ category/[slug]/page.tsx     # カテゴリ
│  ├ reviews/[slug]/page.tsx      # レビュー（記事テンプレ本体）
│  ├ compare/[slug]/page.tsx      # 比較（competitorsから自動生成）
│  ├ ranking/[slug]/page.tsx      # ランキング
│  ├ search/page.tsx              # サイト内検索（クライアント）
│  ├ about / privacy / disclaimer / contact
│  ├ sitemap.ts / robots.ts / not-found.tsx
├ components/                     # UI（ボタン・比較表・パンくず 等）
├ lib/                            # data取得 / SEO / JSON-LD / affiliate / 内部リンク
├ data/                           # types / categories / products / 検索意図レジストリ
├ content/reviews/<slug>.json     # 生成された記事本文（任意）
└ scripts/                        # 記事生成（カニバリ防止つき）
```

---

## 4. データ設計

中心は `data/types.ts` の `Product` 型。1商品 = 1レコードで、レビュー・比較・ランキングすべてがこのデータから組み上がります。

- `specs`：比較表の行（共通ラベルは自動マージ）
- `pros / cons / bestFor / notFor`：記事の各セクションに対応
- `reviewSummary`：口コミ「要約」のみ。**原文転載・捏造は禁止**。出典は記事側 `sources` に明記
- `rating`：編集部の一次評価（架空のaggregateRatingは付けない）
- `affiliate`：ASIN等から正規リンクを生成。未設定ならボタン非表示
- `competitors`：比較記事を自動生成する相手
- `updatedAt`：更新日（E-E-A-T）

> **データの一元管理（実装済み）**：本番の唯一の正は **Supabase の `products` テーブル**。
> `lib/data.ts` がSupabaseを読み、env未設定時は `data/products.seed.json` に自動フォールバックします。
> ローカルの正は `products.seed.json` の1ファイルのみ（`products.ts` はそれを読むだけ）。重複は解消済み。

### Supabase セットアップ
```bash
# 1) Supabaseでプロジェクト作成 → SQL Editor で supabase/schema.sql を実行
# 2) .env.local に3つのキーを設定
#    NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
# 3) サンプルを投入
node scripts/seed-supabase.mjs
# 以後は Supabase のテーブルUIで商品・アフィリエイトリンクを管理（コード変更不要）
```
env未設定でも `npm run build` は通ります（seedフォールバック）。

---

## 5. SEO設計

- **検索意図の分類**（`data/intent-registry.ts`）：`review / kuchikomi / compare / osusume / ranking`
- **カニバリ防止**：`商品名+口コミ`・`商品名+評判`・`商品名+レビュー` は意図が同じなので **review 記事に集約**（`canonicalIntent`）。生成スクリプトが台帳を見て重複を拒否します。
- **メタ最適化**：`lib/seo.ts` が title / description / canonical / OGP / Twitter を全ページに付与
- **構造化データ**（`lib/jsonld.ts`）：Breadcrumb / Product+Review / FAQPage / ItemList
- **sitemap.xml / robots.txt**：`app/sitemap.ts` `app/robots.ts` で自動生成
- **禁止事項**：「検索1位保証」等の表現は使わない。価格は断定せず「価格帯」で扱う

---

## 6. 記事生成テンプレート

レビュー記事は次の順で構成（`app/reviews/[slug]/page.tsx`）：

導入文 → 主なスペック → 良い点 → 気になる点 → 口コミ・評判の要約 → 競合比較 → おすすめできる人 → おすすめできない人 → 最安値・購入先 → FAQ → まとめ

生成プロンプト（`scripts/article-template.mjs`）に組み込んだ品質ガード：
1. 口コミ・数値を**捏造しない**
2. 他サイト文章を**転載・言い換えコピーしない**
3. 口コミ要約は **`sources` がある時だけ** 書く（無ければ空）
4. 「価格断定」「順位保証」表現を使わない
5. **選び方の軸・競合との違い・購入前の注意点を必ず含める**（量産対策）

---

## 7. 実装コード

本リポジトリ全体が実装です。`npm install && npm run build` で全ページ（カテゴリ9種・ランキング・レビュー・比較・サイトマップ）が生成されることを確認済み。

---

## 8. 運用手順

```bash
# 初回
cp .env.example .env.local   # サイトURL・アフィリエイトID・APIキーを設定
npm install
npm run dev                  # http://localhost:3000

# 公開
npm run build && npm run start   # もしくは Vercel に push して自動デプロイ

# 記事本文の自動生成（カニバリ防止つき）
node scripts/generate-article.mjs sample-fridge-a455 review "価格.com,メーカー公式"
#  → content/reviews/<slug>.json を生成し台帳に登録。重複意図は自動で拒否。
```

運用フロー：①`data/products.(ts/json)` に検証済みの商品を追加 → ②`competitors` を設定（比較記事が自動生成）→ ③必要なら生成スクリプトで本文を作成 → ④`updatedAt` を更新してデプロイ。

---

## 仮定した点（要確認）

- 商品データ・スペック・価格はすべて**サンプル（ダミー）**。実機確認または公式の公開情報に差し替え必須。
- 記事本文は「構造化データ＋JSON本文」方式を採用（MDX指定に対し、量産防止と保守性を優先した判断）。MDXに寄せる場合は `@next/mdx` を追加し `content/reviews/*.mdx` を読む形に変更可能。
- データソースは **Supabaseを本番の正** とし、`products.seed.json` をフォールバック兼初期投入元に一本化（二重管理は解消）。
- 口コミ要約は `sources` 未設定のため空。出典なしでは生成しない設計。

## 次に人間が設定すべき項目

1. `.env.local`：`NEXT_PUBLIC_SITE_URL`、各アフィリエイトID（Amazonアソシエイト等）、`OPENAI_API_KEY`（任意）
2. `data/site.ts`：運営者名・プロフィール（E-E-A-Tの肝）
3. 商品データの投入と `affiliate`（ASIN/各ストアURL）の入力 ※実在リンクのみ
4. 口コミ要約の `sources`（出典）を明記
5. `/contact` にフォーム設置（Googleフォーム埋め込み等）
6. Supabase：`supabase/schema.sql` 実行 → `.env.local` にキー設定 → `node scripts/seed-supabase.mjs` で投入
7. アナリティクス（GA4）と Search Console 登録、`og-default.png` を `public/` に配置
8. 各アフィリエイトプログラムの規約（表記義務・リンク形式）の最終確認
