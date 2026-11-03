# Provisionnement du premier administrateur

Cette procédure est réservée au propriétaire du projet. Il n'existe volontairement aucune inscription administrateur publique.

## 1. Installer les dépendances

Après récupération des changements :

```bash
npm install
```

Cela met à jour `package-lock.json` et installe `@supabase/ssr`.

## 2. Créer le compte Auth

Dans le tableau de bord Supabase du projet :

1. Ouvrir **Authentication → Users**.
2. Choisir **Add user** puis **Create new user**.
3. Saisir l'adresse e-mail du propriétaire et définir un mot de passe fort.
4. Confirmer l'adresse e-mail si l'option de confirmation est activée.
5. Ouvrir la fiche de l'utilisateur créé et copier son **User UID**.

Ne jamais communiquer le mot de passe, la clé anon ou la clé service_role dans une conversation ou un dépôt Git.

## 3. Accorder le rôle administrateur

Dans **SQL Editor**, exécuter la requête suivante en remplaçant uniquement l'UUID par le User UID copié à l'étape précédente :

```sql
INSERT INTO public.admins (user_id)
VALUES ('REMPLACER_PAR_LE_USER_UID')
ON CONFLICT (user_id) DO NOTHING;
```

Vérifier le rattachement :

```sql
SELECT user_id FROM public.admins
WHERE user_id = 'REMPLACER_PAR_LE_USER_UID';
```

La requête doit retourner exactement une ligne. Ne jamais insérer un e-mail à la place de l'UUID.

## 4. Se connecter

1. Démarrer l'application avec `npm run dev`.
2. Ouvrir [http://localhost:3001/admin/connexion](http://localhost:3001/admin/connexion).
3. Se connecter avec l'adresse e-mail et le mot de passe du compte Auth créé.
4. L'application vérifie le compte auprès de Supabase Auth puis vérifie sa présence dans `public.admins`.

Un compte Auth absent de `public.admins` n'a aucun accès administrateur. La route `/admin` vérifie le rôle côté serveur ; la vérification dans le formulaire ne sert qu'à améliorer le retour utilisateur.

## 5. Retirer un accès administrateur

Pour révoquer le rôle sans supprimer le compte Auth :

```sql
DELETE FROM public.admins
WHERE user_id = 'UUID_DE_L_ADMIN';
```

La prochaine requête serveur refusera l'accès. Pour révoquer aussi toutes les sessions, utiliser les commandes de gestion de session dans Supabase Auth.

## Sécurité

- Aucun secret n'est stocké dans le code.
- La clé `SUPABASE_SERVICE_ROLE_KEY` n'est pas utilisée par le navigateur.
- L'interface n'offre aucun formulaire d'inscription admin.
- Les actions sensibles doivent vérifier le rôle dans le serveur ou dans les politiques RLS ; cacher un bouton ne suffit pas.
