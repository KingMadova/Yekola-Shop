-- Tarifs client privilégié officiels issus de la grille tarifaire du 01/11/2026.
-- Les produits sans prix VIP confirmé sont désactivés jusqu'à l'import de la liste officielle.
alter table public.products add column if not exists price_vip integer;

alter table public.products drop constraint if exists products_price_vip_nonnegative;
alter table public.products add constraint products_price_vip_nonnegative
  check (price_vip is null or (price_vip >= 0 and price_vip <= price_public));

update public.products set is_active = false where price_vip is null;

alter table public.products drop constraint if exists products_active_requires_vip_price;
alter table public.products add constraint products_active_requires_vip_price
  check (not is_active or price_vip is not null);

-- Les anciens packs de démonstration ne figurent pas dans la grille tarifaire fournie.
update public.products set is_active = false where code in ('PACK-ARTICULAIRE', 'PACK-C9');
