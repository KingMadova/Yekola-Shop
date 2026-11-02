-- Yekola Shop — migration 006 : suspension totale des partenaires.
-- Un partenaire suspendu ne peut plus lire/modifier son profil ni accéder
-- à ses leads via les politiques RLS existantes.
-- Les politiques administrateur sont volontairement conservées.

BEGIN;

-- 1. Une identité partenaire n'est retournée que si le compte est actif.
--    search_path vide : toutes les relations/fonctions sont qualifiées.
CREATE OR REPLACE FUNCTION public.current_partner_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT p.id
  FROM public.partners AS p
  WHERE p.user_id = (SELECT auth.uid())
    AND p.status = 'active'
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_partner_id()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.current_partner_id()
TO authenticated, service_role;

-- 2. Un partenaire ne peut lire que son profil lorsqu'il est actif.
DROP POLICY IF EXISTS "partners: own row read"
ON public.partners;

CREATE POLICY "partners: own row read"
ON public.partners
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  AND status = 'active'
);

-- 3. Un partenaire ne peut modifier son profil que lorsqu'il est actif.
--    NOT is_house et les privilèges de colonnes existants sont conservés.
DROP POLICY IF EXISTS "partners: own profile update"
ON public.partners;

CREATE POLICY "partners: own profile update"
ON public.partners
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  AND NOT is_house
  AND status = 'active'
)
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND NOT is_house
  AND status = 'active'
);

-- 4. Les politiques "partners: admin full access" et les politiques RLS
--    des leads ne sont pas modifiées. Les politiques des leads s'appuient
--    déjà sur current_partner_id(), qui renvoie désormais NULL si suspendu.

COMMIT;

-- Important : service_role contourne RLS. Toute API Next.js utilisant cette
-- clé doit authentifier l'appelant et vérifier son statut/son rôle elle-même.
