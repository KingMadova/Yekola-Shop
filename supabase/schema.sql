-- Yekola Shop : schéma Supabase (phase 1).
-- À exécuter une fois dans Supabase > SQL Editor, puis exécuter seed.sql.

create table admins (user_id uuid primary key references auth.users on delete cascade);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

create table products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Combo / Packs','Boissons','Produits de la Ruche',
    'Compléments Alimentaires','Gestion du Poids','Soins Personnels','Soins de la Peau')),
  health_goals text[] not null default '{}',
  price_public integer not null check (price_public >= 0),  -- prix catalogue, hors promo
  short_desc text not null default '',
  duration text,
  usage_advice text,
  benefits text[] not null default '{}',
  images text[] not null default '{}',
  is_best_seller boolean not null default false,
  is_pack boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger products_updated_at before update on products
  for each row execute function public.set_updated_at();

create table promotions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products on delete cascade,
  promo_price integer check (promo_price >= 0),
  percent_off integer check (percent_off between 1 and 90),
  badge text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  check ((promo_price is not null) <> (percent_off is not null)),
  check (ends_at > starts_at)
);
create index promotions_product_idx on promotions (product_id, starts_at, ends_at);

create table pack_items (
  pack_id uuid references products on delete cascade,
  product_id uuid references products,
  quantity integer not null check (quantity > 0),
  primary key (pack_id, product_id)
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image text,
  link text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table settings (key text primary key, value jsonb not null);  -- clés publiques uniquement

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  image text not null,
  caption text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

-- Sécurité (RLS) : lecture publique du catalogue, écriture réservée aux administrateurs.
alter table admins enable row level security;
alter table products enable row level security;
alter table promotions enable row level security;
alter table pack_items enable row level security;
alter table offers enable row level security;
alter table settings enable row level security;
alter table testimonials enable row level security;

create policy "admins: lire sa propre ligne" on admins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "products: lecture" on products for select to anon, authenticated
  using (is_active or public.is_admin());
create policy "products: écriture admin" on products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "promotions: lecture" on promotions for select to anon, authenticated
  using (is_active or public.is_admin());
create policy "promotions: écriture admin" on promotions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "pack_items: lecture" on pack_items for select to anon, authenticated using (true);
create policy "pack_items: écriture admin" on pack_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "offers: lecture" on offers for select to anon, authenticated
  using (is_active or public.is_admin());
create policy "offers: écriture admin" on offers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "settings: lecture" on settings for select to anon, authenticated using (true);
create policy "settings: écriture admin" on settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "testimonials: lecture" on testimonials for select to anon, authenticated
  using (is_active or public.is_admin());
create policy "testimonials: écriture admin" on testimonials for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Images : bucket public en lecture, écriture réservée aux administrateurs.
insert into storage.buckets (id, name, public) values ('site-images', 'site-images', true)
  on conflict (id) do nothing;
create policy "site-images: lecture" on storage.objects for select
  using (bucket_id = 'site-images');
create policy "site-images: écriture admin" on storage.objects for all to authenticated
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

-- Phase 2 : après avoir créé votre compte (Authentication > Users), devenez administrateur :
-- insert into admins (user_id) select id from auth.users where email = 'votre@email.com';
