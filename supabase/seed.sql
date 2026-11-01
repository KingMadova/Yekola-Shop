-- Jeu de départ : les packs officiels et programmes C9 de la grille tarifaire.
-- Les 49 autres références sont importées avec data/liste-prix-officielle.json.
insert into products (code, slug, name, category, health_goals, price_public, price_vip, short_desc, benefits, is_best_seller, is_pack, sort_order)
values
 ('456', 'vital-5-pulpe', 'VITAL 5 - PULPE', 'Combo / Packs', '{}', 201581, 193238,
  '', '{}', false, true, 10),
 ('634', 'start-your-journey', 'START YOUR JOURNEY', 'Combo / Packs', '{}', 309271, 296471,
  '', '{}', false, true, 20),
 ('547', 'c9-vanilla', 'C9 - VANILLA', 'Gestion du Poids', '{}', 97166, 93145,
  '', '{}', false, true, 370),
 ('548', 'c9-chocolate', 'C9 - CHOCOLATE', 'Gestion du Poids', '{}', 97166, 93145,
  '', '{}', false, true, 380)
on conflict (code) do update set
  slug = excluded.slug, name = excluded.name, category = excluded.category,
  price_public = excluded.price_public, price_vip = excluded.price_vip,
  is_pack = excluded.is_pack, is_active = true, sort_order = excluded.sort_order;
