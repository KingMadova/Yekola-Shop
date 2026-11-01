-- Jeu de départ : les deux packs au prix confirmé. Idempotent (peut être relancé).
insert into products (code, slug, name, category, health_goals, price_public, short_desc, benefits, is_best_seller, is_pack, sort_order)
values
 ('PACK-ARTICULAIRE', 'pack-confort-articulaire', 'Pack Confort Articulaire', 'Combo / Packs',
  array['Articulations & Mobilité'], 68543,
  'Forever Freedom + Active HA + Aloe Heat Lotion, pour le confort au quotidien.',
  array['Trois produits complémentaires réunis dans un seul pack','Accompagne le confort articulaire au quotidien','Active automatiquement la remise VIP de 5 %'],
  true, true, 10),
 ('PACK-C9', 'pack-detox-minceur-c9', 'Pack Détox Minceur C9', 'Combo / Packs',
  array['Détox & Perte de Poids'], 97166,
  'Programme Clean 9, au choix Vanille ou Chocolat.',
  array['Programme structuré pour repartir sur de bonnes habitudes','Saveur au choix : Vanille ou Chocolat','Active automatiquement la remise VIP de 5 %'],
  false, true, 20)
on conflict (code) do update set
  name = excluded.name, category = excluded.category, health_goals = excluded.health_goals,
  price_public = excluded.price_public, short_desc = excluded.short_desc, benefits = excluded.benefits,
  is_best_seller = excluded.is_best_seller, is_pack = excluded.is_pack;
update products set duration = 'Programme de 9 jours (Clean 9)' where code = 'PACK-C9';
