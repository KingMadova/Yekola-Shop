-- Yekola Shop — migration 005 : durcissement des privilèges SQL publics.
-- Reproduit les corrections appliquées et vérifiées dans le projet Supabase réel.
-- Réexécutable : REVOKE/GRANT et ALTER DEFAULT PRIVILEGES sont idempotents.
--
-- Principe :
--   - anon : lecture publique strictement nécessaire au catalogue ;
--   - authenticated : lecture publique + mises à jour limitées pour partenaires/leads ;
--   - service_role : opérations serveur privilégiées ;
--   - aucune écriture directe anon/authenticated sur les tables métier.

BEGIN;

-- 1. Retirer tous les privilèges de table aux rôles navigateur.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public
FROM anon, authenticated;

-- 2. Les privilèges accordés au niveau des colonnes sont indépendants
--    des privilèges de table : les retirer également.
DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT
      table_schema,
      table_name,
      grantee,
      privilege_type,
      string_agg(quote_ident(column_name), ', ' ORDER BY column_name) AS column_list
    FROM information_schema.column_privileges
    WHERE table_schema = 'public'
      AND grantee IN ('anon', 'authenticated')
    GROUP BY table_schema, table_name, grantee, privilege_type
  LOOP
    EXECUTE format(
      'REVOKE %s (%s) ON TABLE %I.%I FROM %I',
      item.privilege_type,
      item.column_list,
      item.table_schema,
      item.table_name,
      item.grantee
    );
  END LOOP;
END
$$;

-- 3. Aucune séquence ne doit être manipulable directement depuis le navigateur.
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public
FROM anon, authenticated;

-- 4. Restaurer uniquement les lectures publiques nécessaires au site.
GRANT SELECT ON TABLE
  public.offers,
  public.pack_items,
  public.products,
  public.promotions,
  public.settings,
  public.testimonials,
  public.partners_public
TO anon, authenticated;

-- 5. Profil partenaire : lecture, puis mise à jour de cinq champs non sensibles.
GRANT SELECT ON TABLE public.partners TO authenticated;
GRANT UPDATE (
  display_name,
  photo_url,
  welcome_text,
  delivery_note,
  whatsapp_number
) ON TABLE public.partners TO authenticated;

-- 6. Leads : lecture du périmètre RLS et mise à jour du statut/de la note seulement.
GRANT SELECT ON TABLE public.leads TO authenticated;
GRANT UPDATE (status, note) ON TABLE public.leads TO authenticated;

-- 7. Retirer l'exécution publique des fonctions du schéma public.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public
FROM PUBLIC, anon, authenticated;

-- is_admin() est appelée par les politiques RLS du catalogue, y compris
-- lors des lectures anonymes. Elle renvoie false sans utilisateur authentifié.
GRANT EXECUTE ON FUNCTION public.is_admin()
TO anon, authenticated, service_role;

-- Fonction de périmètre partenaire, utilisée par les politiques RLS des leads.
GRANT EXECUTE ON FUNCTION public.current_partner_id()
TO authenticated, service_role;

-- La fonction d'upsert des leads est réservée à l'API serveur.
GRANT EXECUTE ON FUNCTION public.upsert_lead(
  uuid,
  text,
  text,
  text,
  text,
  text[],
  text[],
  integer,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  double precision,
  double precision,
  double precision
) TO service_role;

-- Fonction trigger : conserver l'exécution pour le rôle serveur.
GRANT EXECUTE ON FUNCTION public.set_updated_at()
TO service_role;

-- 8. Durcir les privilèges par défaut des objets créés par postgres
--    dans public. Les droits de service_role sont conservés.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

COMMIT;

-- Limite connue :
-- Les privilèges par défaut de supabase_admin ne sont pas modifiés ici.
-- Le SQL Editor a refusé ALTER DEFAULT PRIVILEGES pour ce rôle
-- (permission denied) ; ce point reste à traiter avec un rôle autorisé.
