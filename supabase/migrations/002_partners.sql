-- Yekola Shop — phase 2 : partenaires et boutique maison.
-- À exécuter après supabase/schema.sql. Ne pas modifier le schéma déjà appliqué.

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users on delete set null,
  parent_id uuid references public.partners on delete set null,
  slug text unique not null check (slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'),
  display_name text not null,
  email text,
  whatsapp_number text not null check (whatsapp_number ~ '^242[0-9]{9}$'),
  fbo_id text,
  city text,
  photo_url text,
  welcome_text text check (char_length(welcome_text) <= 300),
  delivery_note text check (char_length(delivery_note) <= 200),
  is_house boolean not null default false,
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partners_slug_reserved check (slug not in (
    'admin','api','p','espace','partenaire','catalogue','produit','connexion','login','logout',
    'hors-ligne','confidentialite','livraison-paiement','sitemap','robots','manifest','www'
  ))
);

create unique index partners_one_house on public.partners (is_house) where is_house;
create index partners_status_idx on public.partners (status);
create trigger partners_updated_at before update on public.partners
  for each row execute function public.set_updated_at();

alter table public.partners enable row level security;
revoke all on public.partners from anon, authenticated;
grant all on public.partners to service_role;
grant select on public.partners to authenticated;
grant update (display_name, photo_url, welcome_text, delivery_note, whatsapp_number)
  on public.partners to authenticated;

create policy "partners: admin full access" on public.partners
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "partners: own row read" on public.partners
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "partners: own profile update" on public.partners
  for update to authenticated
  using (user_id = (select auth.uid()) and not is_house)
  with check (user_id = (select auth.uid()) and not is_house);

-- Vue publique limitée aux informations nécessaires à l'affichage d'une boutique.
create or replace view public.partners_public
with (security_barrier = true) as
select slug, display_name, whatsapp_number, fbo_id, city, photo_url,
       welcome_text, delivery_note, is_house
from public.partners
where status = 'active';

grant select on public.partners_public to anon, authenticated;
