# Plan de projet : Boutique Forever (dépôt `yekola-shop`)

Dernière mise à jour : 1er novembre 2026. Propriétaire : Alvine YOKA (Pointe-Noire). Interface, textes et commentaires en français.

## 0. À lire en premier (reprise par une autre personne)

- **Source de vérité :** le dépôt de l'utilisateur (`D:\DeepWork\Projets dev\Yekola Shop\yekola-shop`), pas les zips générés pendant la conversation.
- **Avant tout commit :** `npx tsc --noEmit`, `npx vitest run`, `npm run build`. Les trois doivent passer.
- **Environnement de l'utilisateur :** Windows, terminal **Git Bash** (pas PowerShell : `cp`, pas `Copy-Item`). Port de dev : **3001** (`next dev -p 3001`). Disque lent : la première compilation peut prendre plus d'une minute.
- **Collaboration :** réponses courtes et directes ; **demander confirmation avant tout gros chantier** (code, fichiers, artefacts).
- **Modèle multi-boutiques (partenaires/filleuls) :** voir la **section 6 bis**. Elle change l'ordre des phases (section 7) : lire avant de coder.
- **Version de Next :** 16.4.x avec *Cache Components* et *Partial Prefetching* activés dans `next.config.ts` (généré par `create-next-app`). Toute donnée dynamique doit respecter les règles de Suspense de cette version. Vérifier la documentation de la version installée avant d'utiliser `use cache`, `cacheTag`, `cacheLife`, `updateTag` ou `proxy.ts` (ancien `middleware.ts`).

## 1. Objectif

Boutique en ligne rapide et rassurante pour vendre les produits Forever Living Products à Brazzaville, Pointe-Noire et en province. Pas de paiement en ligne : la commande part par WhatsApp. Objectif suivant : un **back-office** (`/admin`) pour gérer produits, promos, packs, offres et réglages sans toucher au code, et une **PWA** installable sur iOS et Android.

Direction visuelle (références fournies : NovaTrend, NimbleCart) : bandeau d'annonce vert foncé, héros, bande de garanties, rangée de besoins, grilles produits, packs, bannières, pied de page vert foncé. Palette : vert émeraude `#059669` (texte en 700/800 pour le contraste), ambre `#D97706`, fond `#F9FAFB`. Maquette Design : https://claude.ai/artifact/L1uZDUABRvoqKWcGWn2rhA

**Évolution du 01/11/2026 : modèle MLM.** Les filleuls d'Alvine sont des **partenaires** (pas des administrateurs). Chacun a sa **boutique identique** (mêmes produits, prix, promos) accessible par **son lien**, avec **son numéro WhatsApp** et **son espace** pour suivre ses leads. Détails : section 6 bis.

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
| R10 | **Une boutique par partenaire**, mêmes produits, mêmes prix, mêmes promos, même règle VIP. Ces données sont gérées **uniquement par l'admin**. |
| R11 | Chaque boutique envoie ses messages WhatsApp **uniquement au numéro de son partenaire**. Aucun numéro par défaut implicite. |
| R12 | Un partenaire ne voit **que ses propres** leads et commandes. Jamais ceux d'un autre. |
| R13 | *(Hypothèse à confirmer, Q-P2)* Un partenaire est un FBO Forever agréé ; son numéro FBO est affiché et la mention « Entrepreneur Forever Indépendant Agréé » s'applique à lui. |
| R14 | *(Hypothèse à confirmer, Q-P8)* Le site **ne calcule aucune commission** : la rémunération relève de Forever. |
| R15 | Slug d'un partenaire : 3 à 30 caractères, minuscules, chiffres et tirets ; mots réservés interdits (annexe F). |
| R16 | **Localisation des visiteurs : GPS facultatif uniquement.** Aucun champ ville/quartier, aucune géolocalisation par adresse IP. Le GPS n'est demandé qu'après une action explicite ; le refus n'empêche jamais l'envoi du formulaire ni le téléchargement du catalogue. |

## 3. Stack

Next.js 16 (App Router), React 19, TypeScript strict **sans `any`**, Tailwind CSS 4 (classes seules, **pas de Shadcn installé**), Zustand 5 (panier persistant), lucide-react, Vitest. Node 20 ou plus. Prévu : Supabase (Postgres, Auth, Storage), `sharp` (script d'images), `zod` (validation des formulaires admin).

Variables d'environnement actuelles (`.env.example`) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro de la boutique maison, format international sans « + » (ex. `242061234567`). **Transitoire : disparaît en phase 2** (le numéro vient de la base, par partenaire) |
| `NEXT_PUBLIC_SITE_URL` | URL publique (métadonnées, données structurées). En dev : `http://localhost:3001` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon ou publishable (publique, protégée par RLS) |
| `CATALOG_FALLBACK` | `seed` : autorise le catalogue de secours **hors développement** (essai local d'un build de production sans Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | Script d'import et API serveur des leads. **Secret : jamais dans le dépôt ni côté client** |
| `NEXT_PUBLIC_CATALOG_PDF_PATH` | Chemin du PDF dans `/public` (ex. `/catalogue-forever.pdf`) ; à renseigner uniquement après ajout et vérification du vrai fichier |


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
| Leads (en cours) | API serveur Supabase, dédoublonnage par boutique + numéro, dates de visite/soumission, GPS explicitement facultatif, formulaire avec confirmation API avant succès | `src/app/api/leads/route.ts`, `src/lib/supabase/admin.ts`, `src/lib/leads.ts`, `src/lib/leadClient.ts`, `src/components/lead/LeadCaptureModal.tsx` |
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

**Phase 0 — état au 01/11/2026 :** code, typage, tests et build validés lors de la réalisation. Le test manuel sur téléphone reste à consigner.

**Phase 1 — état au 01/11/2026 (code) :** typage strict et build validés ; les tests globaux du dépôt sont désormais à **31 tests réussis**. La configuration Supabase réelle a été renseignée par le propriétaire. La vérification des données réelles du catalogue et du rafraîchissement après modification reste à effectuer.

**Phases 2 et 3 — état après fusion du 01/11/2026 :** la capture des leads et ses migrations sont fusionnées dans `main` (PR #1). Les migrations `002_partners.sql` et `003_leads.sql` ainsi que les variables Supabase/Vercel ont été configurées par le propriétaire. L'API serveur, la validation, l'upsert/dédoublonnage par boutique et numéro, le GPS facultatif déclenché après clic et le formulaire asynchrone sont intégrés. Le catalogue réel est présent dans `public/catalogue-forever.pdf` ; une copie documentaire est conservée dans `docs/catalogue-forever.pdf`. Le téléchargement automatique doit encore être vérifié dans un parcours utilisateur complet. Le routage public multi-boutiques et les espaces `/admin` et `/espace` ne sont pas encore implémentés.

### PAS ENCORE FAIT (résumé, détail en sections 6 bis et 7)

À terminer : validation fonctionnelle complète contre Supabase réel (création/dédoublonnage des leads, RLS et parcours PDF), initialisation et routage public multi-boutiques, tests de bout en bout sur téléphone, exports CSV/PDF et espace partenaire, back-office `/admin`, interface de gestion des promos/packs/offres, compression d'images, PWA, page « Conditions générales de vente », photos et préparation de la mise en production.

### Limites actuelles à connaître

- Catalogue **statique** : `src/data/products.ts` ne contient que 2 packs (Articulaire 68 543 F, C9 97 166 F). Les besoins Digestion, Vitalité, Peau et Immunité n'ont aucun produit (le catalogue affiche « Nous préparons la sélection »).
- Aucune photo : `SafeImage` affiche un emplacement neutre. Chemins attendus : `public/images/products/pack-articulaire-1.jpg`, `pack-c9-1.jpg`.
- `src/data/testimonials.ts` est vide (section masquée) : il faut de vraies captures WhatsApp, avec l'accord des clients.
- Prix du Pack Ventre Plat inconnu. Durée et posologie du Pack Articulaire à renseigner.
- Pas de page « Conditions générales de vente ». Seules « Confidentialité » et « Livraison et paiement » existent. Un consentement court figure sous le pop-up.
- Le pied de page est un composant client : l'année du copyright s'affiche après hydratation (valeur de repli 2026).
- **Sans projet Supabase configuré**, le site utilise le catalogue de secours (2 packs) en développement ; **en production il refuse de démarrer** (voulu : jamais de prix périmés).
- Deux décisions restent à confirmer par le propriétaire : l'hypothèse **A1** et la possibilité de mettre un pack en promo (questions 1 et 6 de la section 9). Les questions 2, 3 et 4 sont tranchées.

- **Un seul numéro WhatsApp** (variable d'environnement) pour tout le site : à remplacer par un numéro par partenaire (phase 2).
- Textes de livraison (« 24 h à Brazzaville et Pointe-Noire ») identiques partout : à rendre propres à chaque partenaire.



### Point de contrôle technique — 01/11/2026

- Correction du conflit de dépendances Vercel : `@types/node` est passé à `^22.20.5`, compatible avec Vite 8 et Vitest 5 (PR #3 fusionnée).
- Contrôles exécutés après correction : `npx tsc --noEmit` OK ; `npx vitest run` : **31 tests réussis** ; `npm run build` OK.
- Déploiement Vercel : statut vert confirmé par le propriétaire.
- PR #3 a également conservé `docs/catalogue-forever.pdf`. Le fichier de diffusion reste `public/catalogue-forever.pdf`.
- Ces contrôles techniques ne remplacent pas les tests fonctionnels du parcours visiteur sur téléphone et contre le projet Supabase réel.

## 5. Carte du code

```
.env.example
docs/PLAN.md                         ce document
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
5. **Parcours de capture du lead :** le besoin est déduit du parcours (score `choix` 100, `pub` 5, `catalogue` 3, `panier` 2, `produit` 1) et reste corrigeable. Après validation, l'API enregistre le lead directement dans Supabase. En cas de succès, le catalogue PDF se télécharge automatiquement sans redirection, puis une fenêtre de remerciement s'affiche. À sa fermeture, la page défile jusqu'à la section « Que recherchez-vous ? Choisissez votre besoin, nous affichons les produits adaptés. ». Aucun lancement automatique de WhatsApp. En cas d'échec API, ne pas prétendre que le lead est enregistré et proposer une nouvelle tentative.
6. **Modales = `<dialog>` natif** (focus piégé, Échap). Pas de bibliothèque.
7. **Accessibilité :** cibles tactiles ≥ 44 px, texte de saisie 16 px, contrastes AA (texte vert en 700/800), pas d'émojis dans l'interface, mouvement désactivé si l'utilisateur le demande.
8. **`SafeImage`** remplace `next/image` partout : une photo absente ne casse jamais l'affichage.
9. **Catalogue = `getCatalog()`** (`use cache`, étiquette `catalog`, 5 min). Les promos expirent donc au plus 5 minutes en retard. Le back-office appellera `updateTag("catalog")` après chaque enregistrement.
10. **Jamais de prix périmés :** le catalogue de secours n'est autorisé qu'hors production ou avec `CATALOG_FALLBACK=seed`. Si Supabase est configuré mais répond en erreur, le build ou la page échoue (`error.tsx`) plutôt que d'afficher de faux prix.
11. **Lignes invalides ignorées** (catégorie inconnue, prix négatif…) avec un avertissement `[catalogue]` dans les journaux.
12. **`new Date()` interdit dans le rendu** (Cache Components) : l'heure n'est lue que dans `getCatalog()` et dans les effets.

## 6 bis. Modèle multi-boutiques (partenaires / filleuls)

*Statut : conception décidée le 01/11/2026. Fondation SQL partenaires/leads et premier parcours de capture en cours sur `feat/supabase-lead-capture` ; routage multi-boutiques et espace partenaire non implémentés. Hypothèses sur les points marqués Q-P : section 9.*

**Vocabulaire.** *Admin* = Alvine. *Boutique maison* = la boutique d'Alvine (aussi un partenaire, avec `is_house`). *Partenaire* = un filleul. *Client* = visiteur final.

### Droits

| Action | Admin | Partenaire | Client |
|---|---|---|---|
| Produits, prix, promos, packs, offres, réglages | oui | non (lecture) | lecture |
| Inviter, activer, suspendre un partenaire | oui | non | non |
| Modifier son profil (nom, photo, texte d'accueil, note de livraison) | tous | le sien | non |
| Modifier son numéro WhatsApp | oui | oui, avec journal (Q-P3) | non |
| Voir leads et commandes | tous | **seulement les siens** | non |

### Adresses

- `/` et les pages actuelles = **boutique maison** (réécriture par `proxy.ts` vers `/p/{slug maison}` ; les URL publiques ne changent pas).
- `/p/{slug}`, `/p/{slug}/catalogue`, `/p/{slug}/produit/{produit}` = **boutique d'un partenaire**. Les pages boutique n'existent **qu'une fois**, dans `src/app/p/[partner]/…`.
- `/espace/*` = espace partenaire (connexion). `/admin/*` = back-office.
- **Pourquoi un chemin et non un sous-domaine :** pas de domaine acheté, et un chemin marche partout (aperçus Vercel). Un sous-domaine `awa.domaine.com` pourra être ajouté plus tard par simple réécriture, sans refonte.

### Contexte de boutique

`ShopContext` fourni par `app/p/[partner]/layout.tsx` : partenaire (slug, nom, WhatsApp, n° FBO, photo, texte d'accueil, note de livraison), `href(path)` (préfixe `/p/{slug}`, vide pour la maison) et `whatsappUrl(message)`. Les composants n'utilisent plus **jamais** un numéro global : `buildWhatsAppUrl(message, number)` rend le numéro **obligatoire** (un oubli devient une erreur de compilation).

| Commun à toutes les boutiques | Propre à chaque boutique |
|---|---|
| Produits, prix, promos, packs, offres, textes légaux, design | Numéro WhatsApp, nom, photo, texte d'accueil, note de livraison, n° FBO, leads, commandes, panier du navigateur, état du pop-up |

- **Attribution (v1) :** la boutique visitée = le partenaire. Aucune ambiguïté possible. Cookie « parrain » plus tard (Q-P4).
- **Panier et pop-up par boutique :** clés `forever-cart-v1:{slug}` et `forever-lead-status-v1:{slug}`.
- **Messages WhatsApp :** commencent par « Bonjour {nom du partenaire} » ; le message de commande indique la boutique.
- **« Devenir distributeur » et « Client VIP »** mènent au **partenaire** de la boutique (c'est lui qui parraine).
- **SEO :** boutiques partenaires en `noindex` avec `canonical` vers la boutique maison ; le sitemap ne liste que la maison.
- **Cache :** les données du partenaire sont en cache par étiquette `partner:{slug}`. **Ne jamais mettre en cache de données propres à un utilisateur connecté.**

### WhatsApp et gestion des leads : problèmes et solutions

| Problème constaté | Solution retenue |
|---|---|
| Un seul numéro WhatsApp pour tout le site | Numéro **par partenaire** en base, obligatoire dans toutes les fonctions de lien (R11) |
| Les leads sont dispersés dans un tableur et difficiles à isoler par partenaire | **Supabase est l'unique source de vérité** ; chaque partenaire voit uniquement ses propres leads dans `/espace/leads` (RLS), l'admin voit l'ensemble. Aucun Google Sheet ni miroir externe |
| Dédoublonnage par numéro seul : une personne qui écrit à deux partenaires serait fusionnée | Clé unique **(partenaire, numéro)** en base |
| Une panne réseau ou API peut empêcher l'enregistrement | Écriture directe dans Supabase côté serveur ; réponse de succès seulement après confirmation de la base. Le formulaire permet une nouvelle tentative sans annoncer un succès fictif |
| Aucun suivi des commandes | Journal `orders` (phase 7) : volume et historique par partenaire |
| Confidentialité | Page « Confidentialité » à mettre à jour : les données sont transmises au partenaire dont la boutique a été utilisée (Q-P9) |

**Parcours d'un lead (cible) :** visiteur dans `/p/awa` → pop-up → GPS proposé uniquement après clic explicite (facultatif) → `POST /api/leads` avec `partnerSlug` et métadonnées → validation et vérification du partenaire actif → upsert direct dans Supabase (clé `(partner_id, phone)`) → téléchargement automatique du catalogue PDF, sans redirection → fenêtre de remerciement → fermeture : défilement vers « Que recherchez-vous ? Choisissez votre besoin, nous affichons les produits adaptés. » → le partenaire retrouve le lead dans `/espace/leads`. WhatsApp reste une action manuelle distincte.

### Gouvernance et conformité (à valider avant d'ouvrir aux partenaires)

- **Vérifier le règlement de conduite des distributeurs Forever Living** (usage du nom et des visuels, vente en ligne, zone Congo). Le propriétaire doit confirmer ce qui est autorisé.
- **Charte partenaire** à rédiger : pas d'allégation médicale, textes d'accueil courts, respect des prix, signalement. L'admin peut suspendre une boutique à tout moment.
- **Livraison et encaissement** : chaque partenaire promet ses propres délais (note de livraison par partenaire) ; les promesses « 24 h » deviennent des textes par défaut modifiables.
- **Données personnelles** : le partenaire est responsable des leads de sa boutique ; faire valider les textes au regard de la loi congolaise sur les données personnelles.
- **Coûts d'exploitation (à vérifier sur les pages de tarifs) :** l'offre gratuite de Vercel est réservée à un usage non commercial (prévoir l'offre Pro) ; l'offre gratuite de Supabase met un projet en pause après une semaine sans activité (prévoir l'offre Pro en production).

## 7. À FAIRE : phases

Ordre conseillé : 0, 1, **2, 3, 4, 5, 6, 7, 8, 9**. La phase 8 (PWA) est indépendante et peut passer plus tôt. Les phases 2 et 3 passent **avant** le back-office parce que le modèle partenaires change les routes, les liens et le format des leads : il vaut mieux le poser avant d'écrire l'interface d'administration. **Chaque phase se termine par :** typage, tests, build, test manuel sur téléphone, mise à jour de ce document (section 4).

### Phase 0 : Préparation — FAIT le 01/11/2026 (test manuel sur téléphone à valider)
- Confirmer l'hypothèse **A1** et le **nom de marque** (section 9).
- Pages `/confidentialite`, `/livraison-paiement`, liens dans le pied de page.
- `sitemap.ts`, `robots.ts`, `not-found.tsx`.
- **Fait quand :** les pages existent et sont liées depuis le pied de page.

### Phase 1 : Base de données et lecture du catalogue — CODE TERMINÉ le 01/11/2026 ; actions du propriétaire en attente

**Fait (code) :**
1. `supabase/schema.sql` (tables, RLS, bucket `site-images`, fonction `is_admin()`) et `supabase/seed.sql` (les 2 packs).
2. Client public `src/lib/supabase/public.ts` (lecture anonyme, sans cookies). Les clients `server`/`browser` avec session viendront en **phase 4**.
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

### Phase 2 : Multi-boutiques, côté public (NOUVELLE)
1. Migration `supabase/migrations/002_partners.sql` (annexe F) fusionnée dans `main` et déclarée configurée par le propriétaire : table `partners`, vue publique `partners_public`, slugs réservés et RLS. **À valider :** vérifier les politiques et les données dans le projet Supabase réel. Ne pas modifier `schema.sql` (déjà exécuté chez le propriétaire).
2. `src/lib/data/partners.ts` : `getPartner(slug)` (`use cache`, étiquette `partner:{slug}`, 5 min), `getActivePartnerSlugs()`.
3. **Restructurer les routes :** déplacer accueil, catalogue, produit, confidentialité, livraison-paiement sous `src/app/p/[partner]/…` ; le `layout` racine ne garde que `html`/`body`/police et `CatalogProvider` ; `app/p/[partner]/layout.tsx` porte le « chrome » boutique (bandeau, en-tête, pied de page, tiroir panier, WhatsApp flottant, pop-up, suivi) et `ShopProvider`. `proxy.ts` réécrit les chemins publics vers la boutique maison. Slug inconnu ou suspendu : `notFound()`.
4. `ShopContext` et `<ShopLink>` ; remplacer **tous** les liens internes et tous les usages du numéro global (liste en annexe F).
5. Panier et pop-up par boutique (clés avec slug) ; `CartHydrator` reçoit le slug.
6. Métadonnées : `noindex` + `canonical` pour les partenaires. Sitemap : maison seulement.
7. Textes dépendants du partenaire : note de livraison, annonces, « Devenir distributeur », « Client VIP », mention FBO dans le pied de page.
8. Tests : construction des liens, messages WhatsApp avec le numéro du partenaire, validation des slugs, réécriture de `proxy.ts`.
9. En attendant l'admin, Alvine crée les partenaires dans le Table Editor (exemple SQL en annexe F).
- **Fait quand :** `/p/test` affiche la boutique du partenaire « test » avec **son** numéro partout (flottant, commande, 1 clic, pop-up, distributeur, VIP) ; `/` est inchangé ; les paniers sont distincts par boutique ; build OK ; test manuel sur téléphone.

### Phase 3 : Leads dans Supabase + parcours catalogue (NOUVELLE)
1. Migration `supabase/migrations/003_leads.sql` fusionnée dans `main` et déclarée configurée par le propriétaire : table `leads`, clé unique `(partner_id, phone)`, horodatages, champs GPS et RLS. **Supabase est l'unique source de vérité** : aucun Google Sheets, Apps Script, webhook ou miroir externe. Le script `scripts/google-sheets-leads.gs` a été supprimé de la branche ; les variables du webhook ont disparu.
2. Implémentation sur la branche : `src/lib/leads.ts` valide le slug de boutique, le besoin, les métadonnées, `firstVisitAt` et les coordonnées. `src/app/api/leads/route.ts` résout le partenaire actif et appelle `upsert_lead` avec `SUPABASE_SERVICE_ROLE_KEY` côté serveur. La boutique maison `yekola` peut être initialisée depuis `NEXT_PUBLIC_WHATSAPP_NUMBER` si aucune ligne maison n'existe. Un lead existant conserve `created_at` et sa première `first_visit_at` ; les informations récentes et `last_request_at` sont actualisés.
3. **Horodatage :** `created_at` est l'heure de soumission générée par PostgreSQL (référence fiable). `first_visit_at` est l'heure de première visite fournie par le navigateur, si disponible ; elle est considérée comme une donnée indicative fournie par le client. Les exports affichent les dates/heures en fuseau `Africa/Brazzaville`.
4. **GPS facultatif uniquement (R16) — implémenté dans le formulaire de la branche :** aucun champ ville/quartier et aucune géolocalisation par IP. `navigator.geolocation` est appelé uniquement après clic sur « Partager ma position ». Refus, erreur ou indisponibilité : le formulaire continue sans GPS. Le visiteur peut retirer sa position avant l'envoi. `location_consent_at` est généré par PostgreSQL à la réception des coordonnées.
5. **Après enregistrement réussi — parcours partiellement branché :** l'API est attendue avant d'afficher le remerciement ; si elle échoue, le visiteur voit une erreur et peut réessayer. Le composant déclenche le téléchargement uniquement si `NEXT_PUBLIC_CATALOG_PDF_PATH` désigne un fichier réel dans `/public`, puis affiche le remerciement et défile vers `#besoins` à sa fermeture. Aucun lancement automatique de WhatsApp. **Le PDF n'est pas présent dans le dépôt** : ne pas renseigner la variable avant d'avoir ajouté et vérifié le fichier.
6. `/confidentialite` mise à jour dans la branche pour expliquer Supabase, le GPS facultatif, les finalités, les destinataires et le traitement temporaire de l'IP pour limiter les abus. La durée exacte de conservation reste à définir avant la mise en production.
7. Tests : `src/lib/__tests__/leads.test.ts` couvre la validation, le numéro, la première visite et les coordonnées GPS. Après fusion, `npx tsc --noEmit`, `npx vitest run` (**31 tests**) et `npm run build` ont tous réussi ; le déploiement Vercel est également au vert. Restent à vérifier manuellement : RLS, upsert/dédoublonnage sur la base réelle, API, GPS refusé/indisponible et parcours complet avec téléchargement du PDF.
- **Fait quand :** un lead est enregistré dans Supabase et rattaché au bon partenaire ; le même numéro sur deux boutiques crée deux fiches distinctes ; le GPS refusé n'empêche rien ; le catalogue PDF se télécharge après succès ; la fenêtre de remerciement puis le défilement fonctionnent ; aucune dépendance Google Sheets n'existe.

### Phase 4 : Back-office admin (ancienne phase 2) + gestion des partenaires
1. Auth Supabase : **mot de passe et lien magique**, un seul compte admin au départ. Table `admins`.
2. Routes : `/admin/login`, `/admin`, `/admin/produits`, `/admin/produits/nouveau`, `/admin/produits/[id]`, **`/admin/partenaires`** (liste, invitation par e-mail, activation/suspension, parrain, numéro WhatsApp, n° FBO, lien de la boutique, aperçu des leads).
   - Ajouter `/admin/leads` : liste filtrable, détail, dates/heures de première visite et de soumission, statut, notes, filtres par partenaire/période/besoin/source ; export CSV propre et PDF lisible, réservé à l'admin.
3. **Protection à deux niveaux :** `proxy.ts` (renouvelle la session, redirige) **et** `requireAdmin()` au début de **chaque** Server Action. L'interface seule ne suffit jamais. `/admin` en `noindex`. Les clients Supabase `server`/`browser` (cookies) sont créés ici.
4. Formulaire produit (validation `zod`) : nom, slug, catégorie, besoins, prix public, textes, bienfaits, visible/masqué, meilleure vente. **Prix VIP en lecture seule.** Aperçu de la carte.
5. **Images :** compression dans le navigateur (annexe D), envoi direct vers Supabase Storage par URL signée, réordonner, supprimer.
6. Après chaque enregistrement : `updateTag("catalog")` (ou `partner:{slug}`).
- **Fait quand :** l'admin crée un produit avec photos et invite un partenaire ; le site public change en moins d'une minute.

### Phase 5 : Promos, packs et offres (ancienne phase 3)
Inchangé, avec une précision : **les promos, packs et offres sont globaux** et s'appliquent à toutes les boutiques (R10).
1. **Promos :** par produit, prix promo **ou** pourcentage, dates de début et de fin, badge, interrupteur. Expiration à la lecture. Liste des promos actives et à venir.
2. **Packs :** un pack est un produit (`is_pack`) avec composition (`pack_items`) et son **propre prix**.
3. **Offres :** bannières d'accueil (titre, sous-titre, image, lien, dates, ordre) : composant `OfferBanners`.
4. Tests : promo + palier (A1).
- **Fait quand :** l'admin lance une promo datée ; elle s'affiche dans **toutes** les boutiques, s'applique au panier et disparaît seule.

### Phase 6 : Espace partenaire (NOUVELLE)
1. Connexion partenaire (mot de passe ou lien magique) via l'invitation de l'admin ; `requirePartner()` dans chaque Server Action ; RLS en seconde barrière.
2. `/espace` (tableau de bord) : lien de la boutique avec bouton « Copier » et **QR code**, nombre de leads, derniers leads, commandes (phase 7).
3. `/espace/leads` : liste filtrable (besoin, statut), changement de **statut** (Nouveau, Contacté, Intéressé, Client, Perdu), **note**, bouton WhatsApp vers le lead, export CSV et PDF. Les partenaires ne voient **que leurs leads** (R12) ; l'export applique exactement le même périmètre d'accès.
4. `/espace/profil` : nom affiché, photo (compression, annexe D), texte d'accueil (300 caractères), note de livraison, numéro WhatsApp (avec journal et alerte à l'admin, Q-P3). Aucune modification de produits ni de prix.
5. `/espace/liens` : **liens publicitaires générés** pour les 6 besoins avec leur slug et des paramètres `utm_*` (annexe B).
6. Tests d'isolation : un partenaire ne peut ni lire ni modifier les données d'un autre (requêtes avec deux comptes).
- **Fait quand :** deux partenaires de test se connectent, voient chacun uniquement leurs leads, modifient leur profil, et la boutique publique reflète ces changements en moins de 5 minutes.

### Phase 7 : Réglages, contenu et journal des commandes (ancienne phase 4 + commandes)
- Table `settings` (clés publiques) : annonces par défaut, textes de réassurance. `config.ts` lit la base avec repli.
- Témoignages : liste, envoi d'image, visible/masqué (globaux).
- **Journal `orders`** (annexe F) : à « Confirmer ma commande », enregistrer l'instantané (articles, prix unitaires, total, VIP appliqué) rattaché au partenaire **avant** d'ouvrir WhatsApp ; statuts Nouveau, Confirmé, Livré, Annulé ; vue partenaire (`/espace/commandes`) et vue admin (tout).
- **Fait quand :** changer une annonce se fait sans redéploiement ; chaque commande WhatsApp laisse une trace chez le bon partenaire.

### Phase 8 : PWA (iOS et Android) (ancienne phase 5)
1. **Un manifeste par boutique** : route `/p/{slug}/manifest.webmanifest` : `name` = « {Nom du partenaire} · Yekola Shop », `start_url: "/p/{slug}?source=pwa"`, `scope: "/p/{slug}/"` (boutique maison : `/`). `display: "standalone"`, `lang: "fr"`, `theme_color: "#059669"`, `background_color: "#F9FAFB"`, icônes (annexe E).
2. Icônes provisoires (logos fournis plus tard) : 192, 512, 512 *maskable*, `apple-touch-icon` 180.
3. Service worker `public/sw.js` + `PwaRegister` : pages « réseau d'abord », images et statiques « cache d'abord », repli `/hors-ligne`. **Exclure du cache : `/admin`, `/espace`, `/api`, Supabase.**
4. Métadonnées iOS : `appleWebApp`, `apple-touch-icon`.
5. Invite d'installation : Android avec `beforeinstallprompt` ; iOS avec un encart « Partager puis Sur l'écran d'accueil », affiché une fois, mémorisé **par boutique**.
6. HTTPS obligatoire. Test sur un vrai iPhone (Safari) et un vrai Android (Chrome), Lighthouse.
- **Fait quand :** la boutique d'un partenaire s'installe et s'ouvre sur **sa** boutique ; hors ligne, la page de repli s'affiche ; `/admin` et `/espace` ne sont jamais mis en cache.

### Phase 9 : Mise en production (ancienne phase 6)
- Vercel (offre Pro pour usage commercial), domaine (à acheter), HTTPS, variables d'environnement (dont la clé de service, **serveur seulement**), projet Supabase de production (offre Pro). Aucun déploiement Google Sheets ou Apps Script.
- `NEXT_PUBLIC_SITE_URL`, sitemap, robots, données structurées. Sauvegarde régulière de la base. Surveillance des erreurs.
- **Fait quand :** un parcours complet (annonce d'un partenaire, besoin, formulaire, GPS facultatif, lead dans Supabase, téléchargement PDF, remerciement, défilement, panier et WhatsApp vers **son** numéro) est validé sur le domaine réel.

### Phase 10 (optionnelle)
Arbre des filleuls (un partenaire voit son équipe), cookie « parrain » de 30 jours, sous-domaines `awa.domaine.com`, notifications push (iOS exige l'application installée), rôles multiples, gestion de stock, candidature de partenaire par formulaire.

**Correspondance avec l'ancienne numérotation :** ancienne 2 → **4** ; ancienne 3 → **5** ; ancienne 4 → **7** ; ancienne 5 (PWA) → **8** ; ancienne 6 → **9** ; ancienne 7 → **10** (commandes → 7). Nouvelles phases : **2, 3, 6**.

## 8. Définition de « terminé » commune

Typage strict sans `any` · tests ajoutés pour toute règle de prix · aucun texte de réassurance en dur (tout passe par `COPY` ou les réglages) · cibles ≥ 44 px · testé sur téléphone · `docs/PLAN.md` mis à jour.

## 9. Questions ouvertes (à trancher avec le propriétaire)

**Générales**
1. **A1 :** le palier de 65 000 F se mesure-t-il sur le total aux prix de vente promo comprise ? (hypothèse retenue : oui)
2. Résolu : marque **Yekola Shop** ; connexion admin **mot de passe et lien magique** ; hébergement **Vercel** ; domaine **à acheter plus tard**.
3. Adresse(s) e-mail des administrateurs (au minimum celle d'Alvine).
4. Garder « Espèces à la livraison » dans le formulaire ? (conservé pour l'instant)
5. Un pack peut-il être en promo en plus de son prix de pack ? (prévu : oui, comme tout produit)

**Partenaires** (hypothèses de travail entre parenthèses ; elles guident les phases 2 à 6)
- **Q-P1.** Qui livre et encaisse ? (chaque partenaire, pour les commandes reçues sur sa boutique)
- **Q-P2.** Conditions pour devenir partenaire : FBO agréé obligatoire, numéro FBO affiché, validation par l'admin ? Que permet le règlement de Forever Living pour une boutique en ligne par distributeur ? (oui, oui, oui ; **à vérifier auprès de Forever**)
- **Q-P3.** Le partenaire peut-il changer seul son numéro WhatsApp ? (oui, avec journal et alerte à l'admin)
- **Q-P4.** Attribution si un client a déjà visité la boutique d'un autre partenaire. (v1 : la boutique visitée fait foi ; plus tard, cookie « parrain » de 30 jours)
- **Q-P5.** Personnalisation : photo et texte d'accueil de 300 caractères, modération après coup ? (oui)
- **Q-P6.** Inscription : sur invitation de l'admin seulement, ou formulaire de candidature ? (invitation seule au départ)
- **Q-P7.** Un partenaire voit-il son équipe (ses propres filleuls) ? (plus tard, phase 10)
- **Q-P8.** Rémunération et commissions : gérées par Forever, hors site ? (oui : aucun calcul de commission dans le site)
- **Q-P9.** Charte partenaire et textes de confidentialité (loi congolaise sur les données personnelles) : qui les rédige et les fait valider ?
- **Q-P10.** Nombre de partenaires attendus à 6 et 12 mois ? (dimensionne les offres payantes de Vercel et Supabase)

## 10. Pièges connus

- **Next 16 + Cache Components :** une page qui lit `searchParams`, des cookies ou l'heure hors d'un `<Suspense>` peut échouer. Les pages actuelles passent en build ; revérifier à chaque ajout de données dynamiques.
- `globals.css` : ne pas remettre la règle `body { background… }` du modèle de départ (elle prend le dessus sur les classes Tailwind).
- Format des numéros congolais : 9 chiffres avec le 0 initial après `242` (ex. `242061234567`).
- Les messages WhatsApp utilisent des espaces insécables dans les montants ; les tests normalisent avant de comparer.
- Les liens WhatsApp ouverts après un `await` peuvent être bloqués par le navigateur : ouvrir `window.open` **dans le gestionnaire du clic**, avant tout appel réseau.
- Un `localhost:3000` déjà utilisé par une autre application peut laisser des données et des erreurs (ex. `manifest.webmanifest` 404) : utiliser le port 3001.
- Ne jamais préfixer par `NEXT_PUBLIC_` une clé secrète (notamment `SUPABASE_SERVICE_ROLE_KEY`).
- Un build de production sans Supabase configuré **échoue volontairement** (voir décision 10). Pour essayer un build local sans base : `CATALOG_FALLBACK=seed`.
- Une nouvelle ligne de la table `products` doit respecter `category` (les 7 valeurs exactes) : sinon la base la refuse (contrainte `check`).

- **Fuite entre boutiques :** ne jamais lire une donnée de partenaire sans filtrer par `partner_id` côté serveur **et** par RLS côté base. Les tests d'isolation (phase 6) sont obligatoires.
- **Cache Components et pages par partenaire :** `generateStaticParams` ne liste que les partenaires connus au build ; un partenaire créé ensuite est rendu à la demande. Toujours garder au moins la boutique maison dans la liste.
- **Panier partagé par erreur :** si le panier n'est pas namespacé par boutique, une commande pourrait partir vers le mauvais partenaire.
- **Clé de service :** réservée au serveur (API des leads, invitations). Les exports utilisent le client serveur authentifié et la RLS, pas la clé `service_role`. Ne jamais importer cette clé dans un composant client.
- **GPS :** la géolocalisation du visiteur est facultative et déclenchée uniquement par un clic explicite. Ne jamais collecter de coordonnées en arrière-plan ni déduire une position depuis l'adresse IP.
- **Exports :** les routes CSV/PDF doivent vérifier l'identité et le rôle côté serveur ; un partenaire ne peut exporter que ses propres leads. Le PDF/CSV ne doit jamais exposer les données GPS à un rôle non autorisé.

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

## Annexe F : Schéma multi-boutiques (migrations 002 et 003 préparées sur la branche de travail)

```sql
-- 002_partners.sql
create table partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users on delete set null,   -- compte de connexion (phase 6)
  parent_id uuid references partners on delete set null,           -- parrain (arbre, phase 10)
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
    'hors-ligne','confidentialite','livraison-paiement','sitemap','robots','manifest','www'))
);
create unique index partners_one_house on partners (is_house) where is_house;

-- Vue publique : uniquement les colonnes affichables, uniquement les boutiques actives.
create view partners_public as
  select slug, display_name, whatsapp_number, fbo_id, city, photo_url, welcome_text, delivery_note, is_house
  from partners where status = 'active';
grant select on partners_public to anon, authenticated;

-- Exemple (boutique maison puis un partenaire de test) :
-- insert into partners (slug, display_name, whatsapp_number, is_house, status) values ('yekola','Yekola Shop','242061234567',true,'active');
-- insert into partners (slug, display_name, whatsapp_number, status) values ('test','Partenaire test','242060000000','active');

-- 003_leads.sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners,
  first_name text not null,
  phone text not null check (phone ~ '^242[0-9]{9}$'),
  need text, need_origin text,
  other_needs text[] not null default '{}',
  viewed_products text[] not null default '{}',
  cart_total integer not null default 0,
  campaign text, source text, referrer text, landing_path text, page_path text,
  first_visit_at timestamptz, -- horodatage indicatif transmis par le navigateur
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  location_accuracy_m double precision check (location_accuracy_m >= 0),
  location_consent_at timestamptz, -- présent uniquement après autorisation explicite
  status text not null default 'Nouveau' check (status in ('Nouveau','Contacté','Intéressé','Client','Perdu')),
  note text,
  requests_count integer not null default 1,
  created_at timestamptz not null default now(), -- date/heure serveur de soumission initiale
  last_request_at timestamptz not null default now(),
  check ((latitude is null and longitude is null and location_accuracy_m is null and location_consent_at is null)
      or (latitude is not null and longitude is not null and location_consent_at is not null)),
  unique (partner_id, phone)
);

-- (phase 7) orders : instantané de la commande envoyée par WhatsApp
create table orders (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners,
  customer_name text, customer_phone text, zone text, neighborhood text, payment text,
  items jsonb not null,                       -- [{code, name, quantity, unit_price}]
  subtotal integer not null, vip_applied boolean not null, total integer not null,
  status text not null default 'Nouveau' check (status in ('Nouveau','Confirmé','Livré','Annulé')),
  created_at timestamptz not null default now()
);
```

**RLS à écrire dans les migrations :**
- `partners` : table **non lisible publiquement** (lecture publique via `partners_public`). Un partenaire lit et met à jour **sa** ligne (`user_id = auth.uid()`) **sauf** `status`, `is_house`, `parent_id`, `slug` (colonnes protégées : mise à jour via fonction ou trigger). L'admin lit et écrit tout.
- `leads` et `orders` : **aucune insertion publique** (écriture par l'API serveur avec la clé de service). Un partenaire lit ses lignes et met à jour `status` et `note` des leads. L'admin lit tout.
- Fonction utilitaire `current_partner_id()` (security definer) pour écrire les politiques simplement.

**Fichiers à modifier en phase 2 (liens internes et numéro WhatsApp) :** `src/lib/whatsapp.ts` (numéro obligatoire), `src/lib/config.ts` (`WHATSAPP_NUMBER`), `components/layout/{Header,Footer,AnnouncementBar,FloatingWhatsAppButton}.tsx`, `components/home/{Hero,DualConversion,TrustBand,HealthGoalPicker,PackSolutions}.tsx`, `components/catalogue/{CatalogueFilters,ProductCard}.tsx`, `components/product/{ProductActions,ProductDetail}.tsx`, `components/cart/{CartDrawer,CheckoutForm}.tsx`, `components/lead/LeadCaptureModal.tsx`, `components/providers/CartHydrator.tsx`, `store/useCartStore.ts` (nom de stockage par boutique), `app/{layout,page,error,not-found,sitemap,robots}.tsx`, `app/catalogue`, `app/produit/[slug]`, pages légales, `lib/catalogue.ts` (`buildCatalogueHref` avec préfixe).

## Annexe G : Spécification leads, localisation GPS, catalogue et exports

### Données de visite et localisation

- `created_at` : horodatage serveur de la première soumission, généré par PostgreSQL ; c'est la référence pour dater l'entrée du lead.
- `first_visit_at` : horodatage de première visite transmis par le navigateur, facultatif et indicatif. Ne jamais le présenter comme une preuve serveur.
- GPS visiteur : `latitude`, `longitude`, `location_accuracy_m`, `location_consent_at`, tous `NULL` si le visiteur n'a pas autorisé ou si le navigateur ne fournit pas la position. `location_consent_at` est généré côté serveur à réception des coordonnées.
- **GPS facultatif uniquement :** demande déclenchée après clic explicite ; aucun champ ville/quartier, aucune géolocalisation IP, aucun blocage du formulaire en cas de refus.
- Fuseau d'affichage des dates/heures : `Africa/Brazzaville`. Stockage des timestamps en `timestamptz` (UTC côté base).

### Téléchargement du catalogue

- Le téléchargement intervient uniquement après confirmation de l'enregistrement du lead dans Supabase.
- Le téléchargement se fait sans navigation vers une autre page ; afficher ensuite le remerciement.
- À la fermeture du remerciement, défiler jusqu'au titre exact : « Que recherchez-vous ? Choisissez votre besoin, nous affichons les produits adaptés. »
- Le PDF de diffusion est versionné dans `public/catalogue-forever.pdf` et le chemin public attendu est `/catalogue-forever.pdf`. La copie `docs/catalogue-forever.pdf` sert d'archive documentaire. Vérifier le téléchargement réel après enregistrement réussi du lead ; aucun faux succès.

### Exports CSV et PDF

- Disponibles dans `/admin/leads` pour l'admin et `/espace/leads` pour chaque partenaire.
- L'API d'export vérifie l'authentification et le périmètre d'accès côté serveur ; partenaire = ses propres leads seulement. Utiliser le client Supabase serveur authentifié et la RLS ; ne pas employer la clé `service_role` pour contourner les droits.
- Filtres exportables : période, partenaire (admin), besoin, statut et source.
- Colonnes minimales : prénom, téléphone, besoin, statut, source/campagne, partenaire, première visite, soumission, dernière demande. Coordonnées GPS accessibles uniquement à l'admin et au partenaire propriétaire du lead ; elles sont exclues des exports CSV/PDF par défaut.
- CSV : UTF-8 avec BOM, séparateur `;` (Excel en configuration française), dates/heures en `Africa/Brazzaville`.
- PDF : document paginé, lisible, identité Yekola Shop, période et filtres appliqués, date d'export et fuseau horaire.
- L'export respecte les filtres et ne doit jamais permettre de contourner la RLS ou l'isolation entre partenaires.

## Annexe H : Liens publicitaires par partenaire

Même format que l'annexe B avec le chemin de la boutique : `https://DOMAINE/p/SLUG/?besoin=SLUG_BESOIN&utm_source=facebook&utm_medium=cpc&utm_campaign=CAMPAGNE&utm_content=video-1`. Pour la boutique maison, le chemin reste `https://DOMAINE/?besoin=…`. Les slugs de besoins (R9) ne changent pas. L'espace partenaire (phase 6) génère ces liens automatiquement.