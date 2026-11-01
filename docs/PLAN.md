# Plan de projet : Boutique Forever (dépôt `yekola-shop`)

Dernière mise à jour : 1er novembre 2026. Propriétaire : Alvine YOKA (Pointe-Noire). Interface, textes et commentaires en français.

## 0. À lire en premier (reprise par une autre personne)

- **Source de vérité :** le dépôt de l'utilisateur (`D:\DeepWork\Projets dev\Yekola Shop\yekola-shop`), pas les zips générés pendant la conversation.
- **Avant tout commit :** `npx tsc --noEmit`, `npx vitest run`, `npm run build`. Les trois doivent passer.
- **Environnement de l'utilisateur :** Windows, terminal **Git Bash** (pas PowerShell : `cp`, pas `Copy-Item`). Port de dev : **3001** (`next dev -p 3001`). Disque lent : la première compilation peut prendre plus d'une minute.
- **Collaboration :** réponses courtes et directes ; **demander confirmation avant tout gros chantier** (code, fichiers, artefacts).
- **Version de Next :** 16.4.x avec *Cache Components* et *Partial Prefetching* activés dans `next.config.ts` (généré par `create-next-app`). Toute donnée dynamique doit respecter les règles de Suspense de cette version. Vérifier la documentation de la version installée avant d'utiliser `use cache`, `cacheTag`, `cacheLife`, `updateTag` ou `proxy.ts` (ancien `middleware.ts`).

## 1. Objectif

Boutique en ligne rapide et rassurante pour vendre les produits Forever Living Products à Brazzaville, Pointe-Noire et en province. Pas de paiement en ligne : la commande part par WhatsApp. Objectif suivant : un **back-office** (`/admin`) pour gérer produits, promos, packs, offres et réglages sans toucher au code, et une **PWA** installable sur iOS et Android.

Direction visuelle (références fournies : NovaTrend, NimbleCart) : bandeau d'annonce vert foncé, héros, bande de garanties, rangée de besoins, grilles produits, packs, bannières, pied de page vert foncé. Palette : vert émeraude `#059669` (texte en 700/800 pour le contraste), ambre `#D97706`, fond `#F9FAFB`. Maquette Design : https://claude.ai/artifact/L1uZDUABRvoqKWcGWn2rhA

## 2. Règles métier (ne pas modifier sans accord du propriétaire)

| # | Règle |
|---|---|
| R1 | Monnaie : FCFA, **entiers**. Format d'affichage `65 000 F` avec espaces insécables. |
| R2 | **Remise VIP 5 %** : prix VIP = prix de vente × 95 %, arrondi au franc. Elle s'applique à **toute la commande** si le total atteint **65 000 F**, **jamais en dessous**. |
| R3 | **Une promo ne bloque pas la remise VIP** (décision du 31/10/2026). Le VIP se calcule sur le prix promo. **Hypothèse A1, à confirmer :** le palier de 65 000 F se mesure sur le total aux **prix de vente** (promo comprise, avant VIP). |
| R4 | Commande par message WhatsApp pré-formaté vers le numéro du distributeur (+242…). Aucun paiement en ligne. |
| R5 | Règlement proposé : Espèces à la livraison, MTN Mobile Money, Airtel Money. La mention de réassurance est « **Paiement mobile accepté** ». L'ancienne mention « Paiement à la réception après vérification du colis » a été **retirée volontairement** : ne pas la remettre. |
| R6 | Mention obligatoire : « Entrepreneur Forever Indépendant Agréé ». Vocabulaire bien-être, **aucune allégation de guérison médicale**. |
| R7 | 7 catégories, dans cet ordre : Combo / Packs, Boissons, Produits de la Ruche, Compléments Alimentaires, Gestion du Poids, Soins Personnels, Soins de la Peau. 6 besoins santé (voir `src/lib/types.ts`). |
| R8 | Livraison express 24 h à Brazzaville et Pointe-Noire ; province via agences de transport ; retrait sur rendez-vous. |
| R9 | **Slugs d'URL figés** (utilisés par les publicités) : `digestion`, `articulations`, `vitalite`, `peau`, `detox`, `immunite`. Ne pas les renommer. |

## 3. Stack

Next.js 16 (App Router), React 19, TypeScript strict **sans `any`**, Tailwind CSS 4 (classes seules, **pas de Shadcn installé**), Zustand 5 (panier persistant), lucide-react, Vitest. Node 20 ou plus. Prévu : Supabase (Postgres, Auth, Storage), `sharp` (script d'images), `zod` (validation des formulaires admin).

Variables d'environnement actuelles (`.env.example`) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro du distributeur, format international sans « + » (ex. `242061234567`) |
| `NEXT_PUBLIC_SITE_URL` | URL publique (métadonnées, données structurées). En dev : `http://localhost:3001` |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL du déploiement Apps Script (serveur uniquement) |
| `LEADS_WEBHOOK_SECRET` | Secret partagé, identique à `LEADS_SECRET` du script (serveur uniquement) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon ou publishable (publique, protégée par RLS) |
| `CATALOG_FALLBACK` | `seed` : autorise le catalogue de secours **hors développement** (essai local d'un build de production sans Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | Script d'import uniquement. **Secret : jamais dans le dépôt ni côté client** |


## 4. État d'avancement

### FAIT

| Bloc | Contenu | Fichiers clés |
|---|---|---|
| Types et règles | Catégories, besoins, produit, lignes de panier, totaux, lead | `src/lib/types.ts`, `src/lib/config.ts` |
| Moteur de prix | Prix VIP, palier strict, formatage FCFA, bornes de quantité | `src/lib/pricing.ts` |
| Panier | Zustand persistant, ne stocke que `code` + `quantité`, hydratation manuelle | `src/store/useCartStore.ts`, `components/providers/CartHydrator.tsx` |
| WhatsApp | Commande panier, commande 1 clic, demande de catalogue, conseil, VIP, distributeur | `src/lib/whatsapp.ts`, `src/lib/phone.ts` |
| Composants | Galerie, barre VIP, bouton WhatsApp flottant, fiche produit à double bouton, tiroir panier + formulaire | `src/components/product/*`, `cart/*`, `layout/FloatingWhatsAppButton.tsx` |
| Pages | Accueil, catalogue filtrable (catégorie, besoin, recherche), fiche produit (SEO + JSON-LD), layout | `src/app/*` |
| Leads | Pop-up à 7 s, besoin déduit du parcours, envoi vers Google Sheets, reprise si réseau coupé | `components/lead/*`, `src/lib/interest.ts`, `leadClient.ts`, `leads.ts`, `app/api/leads/route.ts`, `store/useInterestStore.ts` |
| Google Sheets | Script Apps Script (déduplication par numéro, statut en liste) | `scripts/google-sheets-leads.gs` |
| Liens publicitaires | 6 liens, un par besoin (annexe B) | cette page |
| Qualité | 25 tests unitaires (prix, panier, leads, catalogue, promos), typage strict, `next build` OK, API des leads testée contre un faux webhook | `src/lib/__tests__/` |
| Correctif | `globals.css` minimal (le fichier généré écrasait les couleurs en mode sombre) | `src/app/globals.css` |
| Exécution locale | Le site tourne chez l'utilisateur (Windows, port 3001) | n/a |
| Phase 0 — Pages légales | `/confidentialite`, `/livraison-paiement`, liens depuis le pied de page | `src/app/confidentialite/page.tsx`, `src/app/livraison-paiement/page.tsx`, `src/components/layout/Footer.tsx` |
| Phase 0 — SEO technique | `sitemap.ts` ; `robots.ts` exclut `/admin`, `/api/`, `/hors-ligne` | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Phase 0 — Page 404 | 404 personnalisée : accueil, catalogue, contact WhatsApp | `src/app/not-found.tsx` |
| Phase 0 — Marque et textes | `SITE_NAME` = « Yekola Shop » ; `SITE_URL` par défaut `http://localhost:3001` ; textes du pied de page et des pages légales dans `COPY.legal` et `COPY.footer` | `src/lib/config.ts` |
| Correctif Next 16 | `/catalogue` : lecture de `searchParams` dans `CatalogueContent`, enveloppé par `<Suspense>`. Route en Partial Prerender | `src/app/catalogue/page.tsx` |
| Correctif Next 16 | `Footer` en composant client, année du copyright calculée dans `useEffect` (`new Date()` interdit au prérendu, y compris côté client) | `src/components/layout/Footer.tsx` |
| **Phase 1 — Base de données (code)** | Schéma SQL + RLS + bucket, jeu de départ, client public, couche de données validée, produit « effectif » (promo comprise), `getCatalog()` en cache, `CatalogProvider`, nettoyage du panier, affichage promo et composition des packs, script d'import, sitemap avec produits, `error.tsx` | `supabase/*.sql`, `src/lib/data/*`, `src/lib/supabase/public.ts`, `src/components/providers/Catalog*.tsx`, `scripts/import-products.mjs` |

**Phase 0 — état au 01/11/2026 :** `npx tsc --noEmit`, `npx vitest run` (18 tests) et `npm run build` (13 routes) passent. **Reste à valider : le test manuel sur téléphone.**

**Phase 1 — état au 01/11/2026 (code) :** typage strict OK, **25 tests** OK, `next build` OK avec Cache Components contre un faux serveur Supabase (promo -10 % appliquée, promo expirée ignorée, ligne invalide ignorée, composition de pack, sitemap avec produits). **Jamais testé contre un vrai projet Supabase** : voir « Reste à faire par le propriétaire » en phase 1.

### PAS ENCORE FAIT (résumé, détail en section 6)

Création et branchement du projet Supabase (actions manuelles), import de la vraie liste de prix, back-office `/admin`, interface de gestion des promos/packs/offres, compression d'images, PWA, page « Conditions générales de vente », photos, mise en production.

### Limites actuelles à connaître

- Catalogue **statique** : `src/data/products.ts` ne contient que 2 packs (Articulaire 68 543 F, C9 97 166 F). Les besoins Digestion, Vitalité, Peau et Immunité n'ont aucun produit (le catalogue affiche « Nous préparons la sélection »).
- Aucune photo : `SafeImage` affiche un emplacement neutre. Chemins attendus : `public/images/products/pack-articulaire-1.jpg`, `pack-c9-1.jpg`.
- `src/data/testimonials.ts` est vide (section masquée) : il faut de vraies captures WhatsApp, avec l'accord des clients.
- Prix du Pack Ventre Plat inconnu. Durée et posologie du Pack Articulaire à renseigner.
- Pas de page « Conditions générales de vente ». Seules « Confidentialité » et « Livraison et paiement » existent. Un consentement court figure sous le pop-up.
- Le pied de page est un composant client : l'année du copyright s'affiche après hydratation (valeur de repli 2026).
- **Sans projet Supabase configuré**, le site utilise le catalogue de secours (2 packs) en développement ; **en production il refuse de démarrer** (voulu : jamais de prix périmés).
- Deux décisions restent à confirmer par le propriétaire : l'hypothèse **A1** et la possibilité de mettre un pack en promo (questions 1 et 6 de la section 9). Les questions 2, 3 et 4 sont tranchées.

## 5. Carte du code

```
.env.example
docs/PLAN.md                         ce document
scripts/google-sheets-leads.gs       script Apps Script (leads -> Sheets)
src/app/  layout.tsx · page.tsx · globals.css
          catalogue/page.tsx · produit/[slug]/page.tsx · api/leads/route.ts
src/components/
  cart/       CartButton · CartDrawer · CartLineItem · CheckoutForm · VipProgressBar
  catalogue/  AddToCartButton · CatalogueFilters · ProductCard · ProductGrid
  home/       DualConversion · HealthGoalPicker · Hero · PackSolutions · Testimonials · TrustBand
  layout/     AnnouncementBar · FloatingWhatsAppButton · Footer · Header
  lead/       InterestSignal · InterestTracker · LeadCaptureModal · ProductViewSignal
  product/    ProductAccordion · ProductActions · ProductDetail · ProductImageGallery
  providers/  CartHydrator
  ui/         SafeImage · styles.ts
src/data/     products.ts · testimonials.ts
src/lib/      catalogue · config · interest · leadClient · leads · phone · pricing · types · whatsapp
src/store/    useCartStore · useInterestStore
```

Ajouts de la phase 1 : `supabase/{schema,seed}.sql` · `scripts/import-products.mjs` · `src/lib/supabase/public.ts` · `src/lib/data/{rows,mapper,source,catalog}.ts` · `src/components/providers/{CatalogContext,CatalogProvider}.tsx` · `src/app/{error,sitemap}.ts(x)` · `src/lib/__tests__/catalog-mapper.test.ts`. `src/data/products.ts` n'exporte plus que `SEED_PRODUCTS`.

## 6. Décisions d'architecture (à respecter)

1. **Tous les textes partagés** (annonces, réassurance, badges) vivent dans `COPY` de `src/lib/config.ts`. Un changement de formulation se fait en un seul endroit.
2. **Le panier ne stocke jamais de prix**, seulement `code` + `quantité`. Les prix sont relus dans le catalogue courant : un changement de tarif ne laisse pas de prix périmé.
3. **Hydratation :** `persist` en `skipHydration` + `CartHydrator` + drapeau `hydrated`. Les composants n'affichent le panier qu'après hydratation (pas d'erreur d'hydratation).
4. **Filtres du catalogue = liens** (`/catalogue?categorie=…&besoin=…&q=…`) : fonctionne sans JavaScript, partageable, utilisable dans les publicités.
5. **Besoin du lead déduit sans question :** score par signal (`choix` 100, `pub` 5, `catalogue` 3, `panier` 2, `produit` 1), stocké dans `useInterestStore`. Le visiteur peut corriger en un geste. Le lead part en arrière-plan (`keepalive`), copie locale jusqu'à confirmation, puis WhatsApp s'ouvre.
6. **Modales = `<dialog>` natif** (focus piégé, Échap). Pas de bibliothèque.
7. **Accessibilité :** cibles tactiles ≥ 44 px, texte de saisie 16 px, contrastes AA (texte vert en 700/800), pas d'émojis dans l'interface, mouvement désactivé si l'utilisateur le demande.
8. **`SafeImage`** remplace `next/image` partout : une photo absente ne casse jamais l'affichage.
9. **Catalogue = `getCatalog()`** (`use cache`, étiquette `catalog`, 5 min). Les promos expirent donc au plus 5 minutes en retard. Le back-office appellera `updateTag("catalog")` après chaque enregistrement.
10. **Jamais de prix périmés :** le catalogue de secours n'est autorisé qu'hors production ou avec `CATALOG_FALLBACK=seed`. Si Supabase est configuré mais répond en erreur, le build ou la page échoue (`error.tsx`) plutôt que d'afficher de faux prix.
11. **Lignes invalides ignorées** (catégorie inconnue, prix négatif…) avec un avertissement `[catalogue]` dans les journaux.
12. **`new Date()` interdit dans le rendu** (Cache Components) : l'heure n'est lue que dans `getCatalog()` et dans les effets.

## 7. À FAIRE : phases

Ordre conseillé : 0, 1, 2, 3, 4, 5, 6. La phase 5 (PWA) est indépendante et peut passer plus tôt. **Chaque phase se termine par :** typage, tests, build, test manuel sur téléphone, mise à jour de ce document (section 4).

### Phase 0 : Préparation — FAIT le 01/11/2026 (test manuel sur téléphone à valider)
- Confirmer l'hypothèse **A1** et le **nom de marque** (section 9).
- Pages `/confidentialite`, `/livraison-paiement`, liens dans le pied de page.
- `sitemap.ts`, `robots.ts`, `not-found.tsx`.
- **Fait quand :** les pages existent et sont liées depuis le pied de page.

### Phase 1 : Base de données et lecture du catalogue — CODE TERMINÉ le 01/11/2026 ; actions du propriétaire en attente

**Fait (code) :**
1. `supabase/schema.sql` (tables, RLS, bucket `site-images`, fonction `is_admin()`) et `supabase/seed.sql` (les 2 packs).
2. Client public `src/lib/supabase/public.ts` (lecture anonyme, sans cookies). Les clients `server`/`browser` avec session viendront en **phase 2**.
3. Couche de données `src/lib/data/` : `rows.ts` (validation des lignes), `mapper.ts` (produit « effectif »), `source.ts` (lecture), `catalog.ts` (`getCatalog()` en `use cache`, étiquette `catalog`, revalidation 5 min).
4. **Produit effectif :** `pricePublic` = prix de vente (promo comprise), `priceVip` = prix de vente -5 %, `compareAtPrice` = prix barré, `promoBadge`. Le moteur de prix (`pricing.ts`) n'a pas changé : l'hypothèse A1 s'applique d'elle-même.
5. `CatalogProvider` + `useCatalog()` remplacent `getProductByCode` côté navigateur ; le panier retire les produits disparus (`prune`).
6. Prix barré, badge promo et composition des packs affichés (`ProductCard`, `ProductDetail`, `CartLineItem`).
7. `scripts/import-products.mjs` (essai à blanc par défaut, `--apply` pour écrire).
8. `sitemap.ts` liste les produits actifs ; `src/app/error.tsx`.

**Reste à faire par le propriétaire (aucun code) :**
1. Créer le projet Supabase (région Europe ou Afrique du Sud).
2. SQL Editor : exécuter `supabase/schema.sql`, puis `supabase/seed.sql`.
3. Project Settings > API : copier l'URL et la clé anon/publishable dans `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) ; `npm i @supabase/supabase-js` ; redémarrer.
4. Vérifier : le site affiche les mêmes 2 packs ; modifier un prix dans Table Editor, il change sur le site en 5 minutes au plus.
5. Importer la vraie liste de prix : `node --env-file=.env.local scripts/import-products.mjs liste.json` (essai à blanc), puis `--apply`. **Si le JSON nettoyé n'a pas le format attendu** (en tête du script), fournir un échantillon et adapter le script.
6. Au déploiement : reporter les variables dans Vercel.

**Fait quand :** le site lit Supabase, la liste de prix est importée, le build passe. `SEED_PRODUCTS` (`src/data/products.ts`) reste comme catalogue de secours de développement.

### Phase 2 : Back-office : connexion et produits
1. Auth Supabase : **mot de passe et lien magique**, un seul compte au départ. Table `admins` : seuls les identifiants listés peuvent écrire.
2. Routes : `/admin/login`, `/admin` (tableau de bord), `/admin/produits`, `/admin/produits/nouveau`, `/admin/produits/[id]`.
3. **Protection à deux niveaux :** `proxy.ts` (renouvelle la session, redirige) **et** `requireAdmin()` au début de **chaque** Server Action. L'interface seule ne suffit jamais. `/admin` en `noindex`.
4. Formulaire produit (validation `zod`) : nom, slug (auto, modifiable), catégorie, besoins (cases), prix public, textes, bienfaits (liste), visible/masqué, meilleure vente. Le **prix VIP s'affiche en lecture seule** (calculé). Aperçu de la carte.
5. **Images :** compression dans le navigateur avant envoi (annexe D), envoi direct vers Supabase Storage par URL signée, réordonner, supprimer.
6. Après chaque enregistrement : invalider le cache (étiquettes).
- **Fait quand :** l'admin crée, modifie, masque un produit et ses photos, et le site public change en moins d'une minute.

### Phase 3 : Promos, packs et offres
1. **Promos :** par produit, prix promo **ou** pourcentage, dates de début et de fin, badge (« -15 % »), interrupteur. Expiration à la lecture (aucune tâche planifiée). Liste des promos actives et à venir.
2. **Packs :** un pack est un produit (`is_pack`) avec composition (`pack_items`) et son **propre prix**. Fiche pack : liste des produits inclus. Badge « Ce pack active automatiquement votre remise VIP de 5 % » affiché quand le prix du pack ≥ 65 000 F.
3. **Offres :** bannières d'accueil (titre, sous-titre, image, lien, dates, ordre). Composant `OfferBanners` sur l'accueil.
4. Tests : promo + palier (ex. total 64 000 F sans promo, 70 000 F avec produits à prix promo, VIP appliqué sur le prix promo).
- **Fait quand :** l'admin lance une promo datée, elle s'affiche, s'applique au panier et disparaît seule.

### Phase 4 : Réglages et contenu
- Table `settings` (clés publiques uniquement) : numéro WhatsApp, lignes du bandeau d'annonces, textes de réassurance. `config.ts` lit la base avec repli sur les valeurs actuelles.
- Témoignages : liste, envoi d'image (même compression), visible/masqué.
- Lien vers le Google Sheet des leads depuis le tableau de bord.
- **Fait quand :** changer le numéro WhatsApp ou une annonce se fait depuis `/admin` sans redéploiement.

### Phase 5 : PWA (iOS et Android)
1. `src/app/manifest.ts` : `name`, `short_name`, `start_url: "/?source=pwa"`, `scope: "/"`, `display: "standalone"`, `lang: "fr"`, `theme_color: "#059669"`, `background_color: "#F9FAFB"`, icônes (annexe E).
2. **Icônes provisoires** (le propriétaire fournira les logos plus tard) : 192, 512, 512 *maskable*, `apple-touch-icon` 180. Les remplacer ne demande que de déposer les fichiers au même nom.
3. Service worker `public/sw.js` + `PwaRegister` : pages en « réseau d'abord », images et fichiers statiques en « cache d'abord », **page de repli hors ligne** `/hors-ligne`. **Exclure du cache : `/admin`, `/api`, Supabase.**
4. Métadonnées iOS : `appleWebApp` (capable, titre, style de barre), `apple-touch-icon`.
5. Invite d'installation : Android avec `beforeinstallprompt` ; iOS (pas d'événement) avec un encart « Partager puis Sur l'écran d'accueil », affiché une fois, fermable, mémorisé.
6. **HTTPS obligatoire** (service worker) : testable sur `localhost`, puis sur le domaine déployé. Tester sur un vrai iPhone (Safari) et un vrai Android (Chrome). Audit Lighthouse.
- **Fait quand :** l'application s'installe sur les deux systèmes, s'ouvre hors ligne sur la page de repli, et `/admin` n'est jamais mis en cache.

### Phase 6 : Mise en production
- Hébergement (Vercel conseillé pour Next 16), domaine, HTTPS, variables d'environnement, projet Supabase de production, déploiement du script Apps Script.
- Remplacer `NEXT_PUBLIC_SITE_URL`, vérifier `sitemap`, `robots`, données structurées.
- Sauvegarde régulière de la base ; surveillance des erreurs.
- **Fait quand :** un parcours complet (annonce, besoin, panier, WhatsApp, lead dans Sheets) est validé sur le domaine réel.

### Phase 7 (optionnelle)
Journal des commandes à la confirmation (statuts Nouveau, Payé, Livré), notifications push (iOS exige l'application installée), rôles multiples, gestion de stock.

## 8. Définition de « terminé » commune

Typage strict sans `any` · tests ajoutés pour toute règle de prix · aucun texte de réassurance en dur (tout passe par `COPY` ou les réglages) · cibles ≥ 44 px · testé sur téléphone · `docs/PLAN.md` mis à jour.

## 9. Questions ouvertes (à trancher avec le propriétaire)

1. **A1 :** le palier de 65 000 F se mesure-t-il sur le total aux prix de vente promo comprise ? (hypothèse retenue : oui)
2. ~~Nom de marque~~ : **Yekola Shop** (tranché le 01/11/2026).
3. Connexion admin : **mot de passe et lien magique** (tranché). Reste à fournir : adresse(s) e-mail des administrateurs.
4. Hébergement : **Vercel** (tranché). Nom de domaine : à acheter plus tard.
5. Garder « Espèces à la livraison » dans le formulaire ? (conservé pour l'instant)
6. Un pack peut-il être en promo en plus de son prix de pack ? (prévu : oui, comme tout produit)

## 10. Pièges connus

- **Next 16 + Cache Components :** une page qui lit `searchParams`, des cookies ou l'heure hors d'un `<Suspense>` peut échouer. Les pages actuelles passent en build ; revérifier à chaque ajout de données dynamiques.
- `globals.css` : ne pas remettre la règle `body { background… }` du modèle de départ (elle prend le dessus sur les classes Tailwind).
- Format des numéros congolais : 9 chiffres avec le 0 initial après `242` (ex. `242061234567`).
- Les messages WhatsApp utilisent des espaces insécables dans les montants ; les tests normalisent avant de comparer.
- Les liens WhatsApp ouverts après un `await` peuvent être bloqués par le navigateur : ouvrir `window.open` **dans le gestionnaire du clic**, avant tout appel réseau.
- Un `localhost:3000` déjà utilisé par une autre application peut laisser des données et des erreurs (ex. `manifest.webmanifest` 404) : utiliser le port 3001.
- Ne jamais préfixer par `NEXT_PUBLIC_` une clé secrète (Sheets, service role).
- Un build de production sans Supabase configuré **échoue volontairement** (voir décision 10). Pour essayer un build local sans base : `CATALOG_FALLBACK=seed`.
- Une nouvelle ligne de la table `products` doit respecter `category` (les 7 valeurs exactes) : sinon la base la refuse (contrainte `check`).

---

## Annexe A : Dépendances à installer au fil des phases

`npm i @supabase/supabase-js @supabase/ssr zod` · `npm i -D sharp` (script d'images, utilisation hors navigateur) · bibliothèque de compression navigateur au choix (`browser-image-compression`) ou `canvas` natif.

## Annexe B : Liens publicitaires (un par besoin)

Format : `https://DOMAINE/?besoin=SLUG&utm_source=facebook&utm_medium=cpc&utm_campaign=CAMPAGNE&utm_content=video-1`

| Besoin (colonne « Besoin principal ») | `besoin=` | `utm_campaign=` |
|---|---|---|
| Digestion & Ventre plat | `digestion` | `digestion-30-jours` |
| Articulations & Mobilité | `articulations` | `articulations-confort` |
| Vitalité & Forme Masculine | `vitalite` | `vitalite-masculine` |
| Peau & Teint Éclatant | `peau` | `peau-eclatante` |
| Détox & Perte de Poids | `detox` | `detox-c9` |
| Défenses Immunitaires | `immunite` | `immunite-tonus` |

`besoin=` est le signal fiable ; le nom de campagne sert de repli (mots-clés reconnus dans `src/lib/interest.ts`). Changer `utm_source` (`instagram`, `tiktok`, `whatsapp`) et `utm_medium` (`cpc`, `statut`) selon la plateforme. Quand le catalogue sera complet, remplacer `/?besoin=` par `/catalogue?besoin=`.

## Annexe C : Schéma cible Supabase (à créer en phase 1)

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Combo / Packs','Boissons','Produits de la Ruche',
    'Compléments Alimentaires','Gestion du Poids','Soins Personnels','Soins de la Peau')),
  health_goals text[] not null default '{}',
  price_public integer not null check (price_public >= 0),   -- prix catalogue, hors promo
  short_desc text not null default '',
  duration text, usage_advice text,
  benefits text[] not null default '{}',
  images text[] not null default '{}',
  is_best_seller boolean not null default false,
  is_pack boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table pack_items (
  pack_id uuid references products on delete cascade,
  product_id uuid references products,
  quantity integer not null check (quantity > 0),
  primary key (pack_id, product_id)
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  title text not null, subtitle text, image text, link text,
  starts_at timestamptz, ends_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table settings (key text primary key, value jsonb not null);   -- clés publiques uniquement

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null, city text, image text not null, caption text,
  is_active boolean not null default true, sort_order integer not null default 0
);

create table admins (user_id uuid primary key references auth.users on delete cascade);
```

**RLS :** activée partout. Lecture publique : `products` (si `is_active`), `promotions`, `pack_items`, `offers` (si `is_active`), `settings`, `testimonials` (si `is_active`). Écriture : uniquement si `exists (select 1 from admins where user_id = auth.uid())`. `admins` : aucune lecture publique. Bucket Storage `site-images` : lecture publique, écriture réservée aux admins.

## Annexe D : Spécification de compression des images

- **Objectif :** ne pas saturer le stockage Supabase, sans perte visible.
- **Dans l'admin (automatique, avant envoi) :** redimensionner à **1600 px** maximum sur le grand côté, convertir en **WebP qualité 88** (visuellement sans perte), supprimer les métadonnées EXIF, viser **≤ 300 Ko** par image. Refuser les fichiers non image ou > 15 Mo à l'entrée.
- **Script par lots `scripts/compress-images.mjs` (Node + `sharp`) :** mêmes réglages pour les images déjà sur disque (`public/images`) ; ne jamais écraser l'original (sortie dans un dossier séparé) ; afficher le poids avant et après.
- Le rendu public passe par `next/image`, qui sert déjà des tailles adaptées.

## Annexe E : Spécification PWA

| Élément | Valeur |
|---|---|
| Icônes | `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (zone de sécurité de 80 %), `apple-touch-icon.png` (180×180), `favicon` |
| Couleurs | `theme_color` `#059669` ; `background_color` `#F9FAFB` |
| Affichage | `standalone`, orientation libre, `lang` `fr` |
| Mise en cache | Pages : réseau d'abord. Images/statiques : cache d'abord. Jamais : `/admin`, `/api`, Supabase |
| Hors ligne | Page `/hors-ligne` avec bouton WhatsApp |
| iOS | Pas d'événement d'installation : encart d'aide « Partager, puis Sur l'écran d'accueil » |
| Test | iPhone réel (Safari), Android réel (Chrome), Lighthouse |
