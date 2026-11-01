-- Yekola Shop — phase 3 : leads stockés directement dans Supabase.
-- GPS visiteur facultatif : les quatre colonnes GPS restent NULL sans coordonnées consenties.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners on delete cascade,
  first_name text not null,
  phone text not null check (phone ~ '^242[0-9]{9}$'),
  need text,
  need_origin text,
  other_needs text[] not null default '{}',
  viewed_products text[] not null default '{}',
  cart_total integer not null default 0 check (cart_total >= 0),
  campaign text,
  source text,
  referrer text,
  landing_path text,
  page_path text,
  first_visit_at timestamptz,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  location_accuracy_m double precision check (location_accuracy_m >= 0),
  location_consent_at timestamptz,
  status text not null default 'Nouveau'
    check (status in ('Nouveau','Contacté','Intéressé','Client','Perdu')),
  note text,
  requests_count integer not null default 1 check (requests_count > 0),
  created_at timestamptz not null default now(),
  last_request_at timestamptz not null default now(),
  constraint leads_location_complete check (
    (latitude is null and longitude is null and location_accuracy_m is null and location_consent_at is null)
    or (latitude is not null and longitude is not null and location_consent_at is not null)
  ),
  constraint leads_partner_phone_unique unique (partner_id, phone)
);

create index leads_partner_created_idx on public.leads (partner_id, created_at desc);
create index leads_need_idx on public.leads (need);
create index leads_status_idx on public.leads (status);

alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select on public.leads to authenticated;
grant update (status, note) on public.leads to authenticated;

create or replace function public.current_partner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.partners
  where user_id = (select auth.uid())
  limit 1
$$;

grant execute on function public.current_partner_id() to authenticated;

create policy "leads: admin read all" on public.leads
  for select to authenticated
  using (public.is_admin());

create policy "leads: partner read own" on public.leads
  for select to authenticated
  using (partner_id = (select public.current_partner_id()));

create policy "leads: partner update own" on public.leads
  for update to authenticated
  using (partner_id = (select public.current_partner_id()))
  with check (partner_id = (select public.current_partner_id()));

-- Seule l'API serveur munie de SUPABASE_SERVICE_ROLE_KEY peut appeler cette fonction.
-- created_at reste géré par PostgreSQL ; first_visit_at est indicatif et fourni par le navigateur.
create or replace function public.upsert_lead(
  p_partner_id uuid,
  p_first_name text,
  p_phone text,
  p_need text,
  p_need_origin text,
  p_other_needs text[],
  p_viewed_products text[],
  p_cart_total integer,
  p_campaign text,
  p_source text,
  p_referrer text,
  p_landing_path text,
  p_page_path text,
  p_first_visit_at timestamptz,
  p_latitude double precision,
  p_longitude double precision,
  p_location_accuracy_m double precision
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_id uuid;
begin
  insert into public.leads as stored_lead (
    partner_id, first_name, phone, need, need_origin, other_needs,
    viewed_products, cart_total, campaign, source, referrer,
    landing_path, page_path, first_visit_at, latitude, longitude,
    location_accuracy_m, location_consent_at
  ) values (
    p_partner_id, p_first_name, p_phone, p_need, p_need_origin, coalesce(p_other_needs, '{}'),
    coalesce(p_viewed_products, '{}'), greatest(coalesce(p_cart_total, 0), 0),
    p_campaign, p_source, p_referrer, p_landing_path, p_page_path, p_first_visit_at,
    p_latitude, p_longitude, p_location_accuracy_m,
    case when p_latitude is not null and p_longitude is not null then now() else null end
  )
  on conflict (partner_id, phone) do update set
    first_name = excluded.first_name,
    need = excluded.need,
    need_origin = excluded.need_origin,
    other_needs = excluded.other_needs,
    viewed_products = excluded.viewed_products,
    cart_total = excluded.cart_total,
    campaign = excluded.campaign,
    source = excluded.source,
    referrer = excluded.referrer,
    landing_path = excluded.landing_path,
    page_path = excluded.page_path,
    first_visit_at = coalesce(stored_lead.first_visit_at, excluded.first_visit_at),
    latitude = coalesce(excluded.latitude, stored_lead.latitude),
    longitude = coalesce(excluded.longitude, stored_lead.longitude),
    location_accuracy_m = coalesce(excluded.location_accuracy_m, stored_lead.location_accuracy_m),
    location_consent_at = case
      when excluded.latitude is not null and excluded.longitude is not null then now()
      else stored_lead.location_consent_at
    end,
    requests_count = stored_lead.requests_count + 1,
    last_request_at = now()
  returning id into saved_id;

  return saved_id;
end;
$$;

revoke all on function public.upsert_lead(
  uuid,text,text,text,text,text[],text[],integer,text,text,text,text,text,timestamptz,
  double precision,double precision,double precision
) from public, anon, authenticated;
grant execute on function public.upsert_lead(
  uuid,text,text,text,text,text[],text[],integer,text,text,text,text,text,timestamptz,
  double precision,double precision,double precision
) to service_role;
