-- ============================================================
-- Supabase スキーマ：products テーブル（本番の単一の正）
-- Supabase の SQL Editor に貼って実行してください。
-- ============================================================

create table if not exists public.products (
  slug          text primary key,
  name          text not null,
  brand         text,
  category      text not null,
  release_year  int,
  price_range   text,
  image         text,
  specs         jsonb default '[]',
  pros          jsonb default '[]',
  cons          jsonb default '[]',
  best_for      jsonb default '[]',
  not_for       jsonb default '[]',
  review_summary text,
  rating        numeric default 0,
  affiliate     jsonb default '{}',
  competitors   jsonb default '[]',
  updated_at    date
);

create index if not exists products_category_idx on public.products (category);

-- 公開読み取りのみ許可（書き込みはservice roleのみ）
alter table public.products enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select
  using (true);
