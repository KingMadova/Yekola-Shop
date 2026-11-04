# Plan de projet : Boutique Forever (dépôt `yekola-shop`)

Dernière mise à jour : 3 novembre 2026 (back-office et expérience boutique mobile-first). Propriétaire : Alvine YOKA (Pointe-Noire). Interface, textes et commentaires en français.

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
| R2 | **Prix publics et prix client privilégié :** les prix publics sont affichés normalement. Le tarif client privilégié exact provient de la grille officielle ; il n'est pas affiché systématiquement à tous les visiteurs. L'accès VIP est présenté par une invitation dédiée en plein écran. |
| R3 | **Accès VIP :** un client devient VIP à vie après une commande d'au moins **65 000 F effectivement payée**, une fois le paiement confirmé par l'administrateur. La simple création ou l'envoi d'une commande ne donne pas le statut VIP. Le seuil et la confirmation sont évalués côté serveur. |
| R4 | Commande par message WhatsApp pré-formaté vers le numéro du distributeur (+242…). Aucun paiement en ligne. |
| R5 | Règlement proposé : Espèces à la livraison, MTN Mobile Money, Airtel Money. La mention de réassurance est « **Paiement mobile accepté** ». L'ancienne mention « Paiement à la réception après vérification du colis » a été **retirée volontairement** : ne pas la remettre. |
| R6 | Mention obligatoire : « Entrepreneur Forever Indépendant Agréé ». Vocabulaire bien-être, **aucune allégation de guérison médicale**. |
| R7 | 7 catégories, dans cet ordre : Combo / Packs, Boissons, Produits de la Ruche, Compléments Alimentaires, Gestion du Poids, Soins Personnels, Soins de la Peau. 6 besoins santé (voir `src/lib/types.ts`). |
| R8 | Livraison express 24 h à Brazzaville et Pointe-Noire ; province via agences de transport ; retrait sur rendez-vous. |
| R9 | **Slugs d'URL figés** (utilisés par les publicités) : `digestion`, `articulations`, `vitalite`, `peau`, `detox`, `immunite`. Ne pas les renommer. |
| R10 | **Une boutique par partenaire**, mêmes produits, mêmes tarifs officiels, mêmes promos et même seuil client privilégié. Ces données sont gérées **uniquement par l'admin**. |
| R11 | Chaque boutique envoie ses messages WhatsApp **uniquement au numéro de son partenaire**. Aucun numéro par défaut implicite. |
| R12 | Un partenaire ne voit **que ses propres** leads et commandes. Jamais ceux d'un autre. |
| R13 | *(Hypothèse à confirmer, Q-P2)* Un partenaire est un FBO Forever agréé ; son numéro FBO est affiché et la mention « Entrepreneur Forever Indépendant Agréé » s'applique à lui. |
| R14 | *(Hypothèse à confirmer, Q-P8)* Le site **ne calcule aucune commission** : la rémunération relève de Forever. |
| R15 | Slug d'un partenaire : 3 à 30 caractères, minuscules, chiffres et tirets ; mots réservés interdits (annexe F). |
| R16 | **Localisation des visiteurs : GPS facultatif uniquement.** Aucun champ ville/quartier, aucune géolocalisation par adresse IP. Le GPS n'est demandé qu'après une action explicite ; le refus n'empêche jamais l'envoi du formulaire ni le téléchargement du catalogue. |
| R17 | **Codes promo partenaires :** un code créé par un partenaire est valable exclusivement dans la boutique de ce partenaire, et dans aucune autre boutique. Il ne peut jamais être utilisé sur la boutique d'un autre partenaire. |
| R18 | **Réduction des codes partenaires :** réduction en pourcentage comprise entre 1 % et 20 % maximum, appliquée au prix public. Le code possède une période de validité, une limite d'utilisations et un périmètre de produits configurable. Le partenaire peut gérer ses codes ; l'administrateur peut également les désactiver. Chaque utilisation est enregistrée et attribuée au partenaire propriétaire. |
| R19 | **Non-cumul :** un code promo partenaire ne se cumule pas avec une promotion globale déjà appliquée. Les promotions, packs et offres configurés par l'administrateur restent globaux à toutes les boutiques ; les codes partenaires constituent un mécanisme distinct et limité à une seule boutique. |
| R20 | **Pas de commission automatique :** Yekola Shop enregistre l'utilisation des codes et l'attribution, mais ne calcule ni ne verse de commission. |
| R21 | **Validation commerciale :** le paiement et la commande sont confirmés manuellement par l'administrateur après le parcours WhatsApp. Le statut VIP et les compteurs d'utilisation concernés ne doivent être validés qu'après confirmation du paiement. |

## Décisions commerciales confirmées — 2 novembre 2026

Cette section complète les règles R2, R3 et R17 à R21. Elle doit être lue avant toute implémentation des promotions, codes promo, commandes ou du statut VIP.

- **Prix affichés :** les visiteurs voient les prix publics. Les prix client privilégié ne sont pas affichés systématiquement dans le catalogue.
- **Invitation VIP :** présenter l'accès VIP au moyen d'une invitation dédiée en plein écran, plutôt que d'afficher en permanence les tarifs VIP à tous les visiteurs.
- **Obtention du VIP :** le client obtient le statut VIP à vie après une commande d'au moins 65 000 F effectivement payée et confirmée manuellement par l'administrateur.
- **Codes promo partenaires :** chaque partenaire peut créer des codes promotionnels pour sa propre boutique. Un code est strictement limité à cette boutique : il est invalide sur toute autre boutique, même si le client connaît le code.
- **Paramètres des codes :** remise de 1 à 20 % maximum, période de validité, nombre maximal d'utilisations, périmètre de produits configurable, activation/désactivation et historique des utilisations attribué au partenaire propriétaire.
- **Base de réduction :** le code partenaire réduit le prix public, pas le tarif VIP.
- **Non-cumul :** un code partenaire n'est pas cumulable avec une promotion globale. Les promotions, packs et offres créés par l'administrateur restent globaux à toutes les boutiques.
- **Gestion des commandes :** le parcours client reste une commande WhatsApp sans paiement en ligne. L'administrateur vérifie et confirme manuellement le paiement ; la confirmation déclenche les traitements métier qui en dépendent, notamment l'attribution du VIP.
- **Commissions :** le site ne calcule ni ne verse automatiquement de commission ; il conserve les informations d'utilisation et d'attribution des codes.

**À ne pas inventer lors du développement :** la base de calcul des 65 000 F en présence d'une réduction reste à trancher (montant réellement payé après remise ou total avant remise). La priorité technique entre promotion globale et code doit respecter le non-cumul et être définie sans appliquer deux remises.

---

## 3. Stack

Next.js 16 (App Router), React 19, TypeScript strict **sans `any`**, Tailwind CSS 4 (classes seules, **pas de Shadcn installé**), Zustand 5 (panier persistant), lucide-react, Vitest. Node 20 ou plus. Prévu : Supabase (Postgres, Auth, Storage), `sharp` (script d'images), `zod` (validation des formulaires admin).

Variables d'environnement actuelles (`.env.example`) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique (métadonnées, données structurées). En dev : `http://localhost:3001` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon ou publishable (publique, protégée par RLS) |
| `CATALOG_FALLBACK` | `seed` : autorise le catalogue de secours **hors développement** (essai local d'un build de production sans Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | Script d'import et API serveur des leads. **Secret : jamais dans le dépôt ni côté client** |
| `NEXT_PUBLIC_CATALOG_PDF_PATH` | Chemin du PDF dans `/public` ; fichier présent : `public/catalogue-forever.pdf`, valeur attendue `/catalogue-forever.pdf`. Le téléchargement après soumission du formulaire reste à tester en conditions réelles |


## 4. État d'avancement

### FAIT

| Bloc | Contenu | Fichiers clés |
|---|---|---|
| Types et règles | Catégories, besoins, produit, lignes de panier, totaux, lead | `src/lib/types.ts`, `src/lib/config.ts` |
| Moteur de prix | Tarifs client privilégié officiels, seuil strict, formatage FCFA, bornes de quantité | `src/lib/pricing.ts` |
| Panier | Zustand persistant, ne stocke que `code` + `quantité`, hydratation manuelle | `src/store/useCartStore.ts`, `components/providers/CartHydrator.tsx` |
| WhatsApp | Commande panier, commande 1 clic, demande de catalogue, conseil, VIP, distributeur | `src/lib/whatsapp.ts`, `src/lib/phone.ts` |
| Composants | Galerie, barre VIP, bouton WhatsApp flottant, fiche produit à double bouton, tiroir panier + formulaire | `src/components/product/*`, `cart/*`, `layout/FloatingWhatsAppButton.tsx` |
| Pages | Accueil, catalogue filtrable (catégorie, besoin, recherche), fiche produit (SEO + JSON-LD), layout | `src/app/*` |
| Leads Supabase | API serveur Supabase, dédoublonnage par boutique + numéro, dates de visite/soumission, GPS explicitement facultatif, formulaire avec confirmation API avant succès | `src/app/api/leads/route.ts`, `src/lib/supabase/admin.ts`, `src/lib/leads.ts`, `src/lib/leadClient.ts`, `src/components/lead/LeadCaptureModal.tsx` |
| Liens publicitaires | 6 liens, un par besoin (annexe B) | cette page |
| Qualité | 31 tests unitaires réussis (prix, panier, leads, catalogue, promos), typage strict, `next build` OK | `src/lib/__tests__/` |
| Correctif | `globals.css` minimal (le fichier généré écrasait les couleurs en mode sombre) | `src/app/globals.css` |
| Exécution locale | Le site tourne chez l'utilisateur (Windows, port 3001) | n/a |
| Phase 0 — Pages légales | `/confidentialite`, `/livraison-paiement`, liens depuis le pied de page | `src/app/confidentialite/page.tsx`, `src/app/livraison-paiement/page.tsx`, `src/components/layout/Footer.tsx` |
| Phase 0 — SEO technique | `sitemap.ts` ; `robots.ts` exclut `/admin`, `/api/`, `/hors-ligne` | `src/app/sitemap.ts`, `src/app/robots.ts` || Phase 0 — Page 404 | 404 personnalisée : accueil, catalogue, contact WhatsApp | `src/app/not-found.tsx` |
| Phase 0 — Marque et textes | `SITE_NAME` = « Yekola Shop » ; `SITE_URL` par défaut `http://localhost:3001` ; textes du pied de page et des pages légales dans `COPY.legal` et `COPY.footer` | `src/lib/config.ts` |
| Correctif Next 16 | `/catalogue` : lecture de `searchParams` dans `CatalogueContent`, enveloppé par `<Suspense>`. Route en Partial Prerender | `src/app/catalogue/page.tsx` |
| Correctif Next 16 | `Footer` en composant client, année du copyright calculée dans `useEffect` (`new Date()` interdit au prérendu, y compris côté client) | `src/components/layout/Footer.tsx` |
| **Phase 1 — Base de données (code)** | Schéma SQL + RLS + bucket, jeu de départ, client public, couche de données validée, produit « effectif » (promo comprise), `getCatalog()` en cache, `CatalogProvider`, nettoyage du panier, affichage promo et composition des packs, script d'import, sitemap avec produits, `error.tsx` | `supabase/*.sql`, `src/lib/data/*`, `src/lib/supabase/public.ts`, `src/components/providers/Catalog*.tsx`, `scripts/import-products.mjs` |

**Phase 0 — état au 01/11/2026 :** code, typage, tests et build validés lors de la réalisation. Le test manuel sur téléphone reste à consigner.

**Phase 1 — état au 01/11/2026 (code) :** typage strict et build validés ; les tests globaux du dépôt sont désormais à **31 tests réussis**. La configuration Supabase réelle a été renseignée par le propriétaire. La vérification des données réelles du catalogue et du rafraîchissement après modification reste à effectuer.

**Phases 2 et 3 — état après fusion du 01/11/2026 :** la capture des leads et ses migrations sont fusionnées dans `main` (PR #1). Les migrations `002_partners.sql` et `003_leads.sql` ainsi que les variables Supabase/Vercel ont été configurées par le propriétaire. L'API serveur, la validation, l'upsert/dédoublonnage par boutique et numéro, le GPS facultatif déclenché après clic et le formulaire asynchrone sont intégrés. Le catalogue réel est présent dans `public/catalogue-forever.pdf` ; la grille de prix clients fournie est structurée dans `data/liste-prix-officielle.json` (53 références). Le téléchargement automatique doit encore être vérifié dans un parcours utilisateur complet. Le routage public multi-boutiques et les espaces `/admin` et `/espace` ne sont pas encore implémentés.

### Correctif Next 16 — catalogue du layout (validation locale requise)

- `RootLayout` reste synchrone. `getCatalog()` est appelé dans `CatalogApp`, sous un `Suspense` explicite.
- Le `CatalogProvider` englobe tous les consommateurs du contexte : en-tête/recherche, pages, tiroir panier et modale de capture. Cette portée évite l'erreur `useCatalog doit être utilisé sous <CatalogProvider>`.
- Le fallback affiche une structure de chargement de la boutique pendant la récupération du catalogue. Le build et le rendu navigateur restent à vérifier localement.
- `/packs` : le titre et l'introduction restent dans le shell ; `PacksContent` charge le catalogue sous un `<Suspense>` local avec un squelette de grille, conformément au correctif Stream de l'Insight `instant-shell-url-data`. Le comportement en navigation doit encore être confirmé dans le navigateur.

### EN COURS — refonte UX/UI mobile-first

- Première passe intégrée sur la branche `feat/mobile-first-natural-redesign` : palette vert forêt / ivoire / or doux, en-tête mobile compact, bandeau d'annonce masqué sur petit écran, Hero raccourci, copywriting principal, sections d'accueil, cartes produits et bouton WhatsApp flottant plus discret.- Le Hero a été conçu pour tenir dans le premier écran mobile sans hauteur fixe artificielle. **La conformité réelle à 360 × 800 et 390 × 844 reste à mesurer dans un navigateur** ; ne pas considérer ce critère comme validé avant test.- Les contrôles `npx tsc --noEmit`, `npx vitest run` et `npm run build` n'ont pas encore été exécutés sur cette branche. La documentation Next.js installée sous `node_modules/next/dist/docs/` n'était pas accessible depuis l'édition GitHub ; aucune API Next.js n'a été modifiée.### EN COURS — pages commerciales et tarifs officiels

- La grille `data/liste-prix-officielle.json` contient 53 références avec prix public et prix client privilégié exacts.
- Le modèle de données, la migration `004_official_vip_prices.sql` et le script d'import acceptent le tarif privilégié explicite.
- Pages ajoutées : `/packs`, `/besoins`, `/panier`, `/devenir-partenaire` ; suggestions de produits dans la recherche du catalogue et de l'en-tête desktop.
- **Reste à faire :** exécuter la migration puis l'import sur le projet Supabase réel, vérifier les pages dans le navigateur, compléter les descriptions/photos et associer les produits aux besoins après validation des informations produit.

### PAS ENCORE FAIT (résumé, détail en sections 6 bis et 7)

À terminer : **back-office `/admin` (priorité immédiate : accès administrateur sécurisé puis gestion des boutiques partenaires)**, validation fonctionnelle complète contre Supabase réel (création/dédoublonnage des leads, RLS et parcours PDF), validation locale du routage public multi-boutiques, tests de bout en bout sur téléphone, exports CSV/PDF et espace partenaire, interface de gestion des promos/packs/offres, compression d'images, PWA, page « Conditions générales de vente », photos et préparation de la mise en production.

### Limites actuelles à connaître

- Catalogue **statique** : `src/data/products.ts` ne contient que 2 packs (Articulaire 68 543 F, C9 97 166 F). Les besoins Digestion, Vitalité, Peau et Immunité n'ont aucun produit (le catalogue affiche « Nous préparons la sélection »).
- Aucune photo : `SafeImage` affiche un emplacement neutre. Chemins attendus : `public/images/products/pack-articulaire-1.jpg`, `pack-c9-1.jpg`.
- `src/data/testimonials.ts` est vide (section masquée) : il faut de vraies captures WhatsApp, avec l'accord des clients.
- Prix du Pack Ventre Plat inconnu. Durée et posologie du Pack Articulaire à renseigner.
- Pas de page « Conditions générales de vente ». Seules « Confidentialité » et « Livraison et paiement » existent. Un consentement court figure sous le pop-up.
- Le pied de page est un composant client : l'année du copyright s'affiche après hydratation (valeur de repli 2026).
- **Sans projet Supabase configuré**, le site utilise le catalogue de secours (2 packs) en développement ; **en production il refuse de démarrer** (voulu : jamais de prix périmés).
- Les règles VIP, les codes promo partenaires, le non-cumul avec les promotions globales et la confirmation manuelle des paiements sont consignés en R2, R3 et R17 à R21. Le montant exact à prendre en compte pour le seuil VIP lorsqu'une remise a été appliquée reste à confirmer (section 9). La possibilité de mettre un pack en promotion reste également à confirmer.

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

*Statut au 01/11/2026 : conception décidée ; migrations partenaires/leads et capture initiale fusionnées dans `main`, configuration Supabase/Vercel déclarée terminée. Le routage public multi-boutiques et l'espace partenaire ne sont pas encore implémentés. Hypothèses sur les points marqués Q-P : section 9.*

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
| Commun à toutes les boutiques | Propre à chaque boutique ||---|---|
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
4. **Produit effectif :** `pricePublic` = prix public effectif (promo comprise), `priceVip` = tarif client privilégié effectif, `compareAtPrice` = prix barré, `promoBadge`. Une promotion réduit les deux tarifs dans la même proportion ; le tarif privilégié de base reste celui de la grille officielle.
5. `CatalogProvider` + `useCatalog()` remplacent `getProductByCode` côté navigateur ; le panier retire les produits disparus (`prune`).
6. Prix barré, badge promo et composition des packs affichés (`ProductCard`, `ProductDetail`, `CartLineItem`).
7. `scripts/import-products.mjs` (essai à blanc par défaut, `--apply` pour écrire).
8. `sitemap.ts` liste les produits actifs ; `src/app/error.tsx`.

**Reste à faire par le propriétaire (aucun code) :**
1. Créer le projet Supabase (région Europe ou Afrique du Sud).
2. SQL Editor : exécuter `supabase/schema.sql`, puis `supabase/seed.sql`.
3. Project Settings > API : copier l'URL et la clé anon/publishable dans `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) ; `npm i @supabase/supabase-js` ; redémarrer.
4. Vérifier : le site affiche les mêmes 2 packs ; modifier un prix dans Table Editor, il change sur le site en 5 minutes au plus.
5. Exécuter `supabase/migrations/004_official_vip_prices.sql`, puis importer les 53 références officielles : `node --env-file=.env.local scripts/import-products.mjs data/liste-prix-officielle.json` (essai à blanc), puis ajouter `--apply` pour écrire dans Supabase. Les deux tarifs sont importés tels qu'indiqués dans le PDF ; le script réactive les références de la grille et ne recalcule pas le prix client privilégié.
6. Au déploiement : reporter les variables dans Vercel.

**Fait quand :** le site lit Supabase, la liste de prix est importée, le build passe. `SEED_PRODUCTS` (`src/data/products.ts`) reste comme catalogue de secours de développement.

### Phase 2 : Multi-boutiques, côté public (NOUVELLE)
1. Migration `supabase/migrations/002_partners.sql` (annexe F) fusionnée dans `main` et déclarée configurée par le propriétaire : table `partners`, vue publique `partners_public`, slugs réservés et RLS. **À valider :** vérifier les politiques et les données dans le projet Supabase réel. Ne pas modifier `schema.sql` (déjà exécuté chez le propriétaire).
2. `src/lib/data/partners.ts` : `getPartner(slug)` (`use cache`, étiquette `partner:{slug}`, 5 min), `getActivePartnerSlugs()`.

**Avancement du 02/11/2026 — première brique de phase 2 :**
- [x] Audit Supabase réel : boutique maison `yekola` active ; RLS activée ; politiques de lecture/modification propres au partenaire ; permissions de la vue publique limitées à SELECT pour `anon` et `authenticated`.
- [x] `src/lib/partner-slug.ts` : validation stricte des slugs (3 à 30 caractères, minuscules/chiffres/tirets) et rejet des chemins réservés.
- [x] `src/lib/data/partners.ts` : lecture de `partners_public` uniquement ; `getPartner(slug)` avec cache isolé par `partner:{slug}` ; `getActivePartnerSlugs()` ; validation défensive des champs publics et du numéro WhatsApp.
- [x] `src/lib/__tests__/partners.test.ts` : tests unitaires des slugs valides, invalides et réservés.
- [x] `src/lib/shop-path.ts` : génération des chemins propres à chaque boutique ; les URL de la boutique maison restent inchangées.
- [x] `src/components/providers/ShopContext.tsx` : `ShopProvider`, `useShop()` et `ShopLink`, avec numéro WhatsApp explicite provenant du partenaire.
- [x] `src/lib/__tests__/shop-path.test.ts` : tests des chemins maison/partenaire et rejet des chemins externes.
- [ ] Validation locale à faire par le propriétaire : `npx tsc --noEmit`, `npx vitest run`, `npm run build`. Ces commandes n'ont pas été exécutées dans cet environnement.
- **Important :** le fournisseur n'est pas encore monté dans les routes et les composants existants n'utilisent pas encore `ShopLink`. Aucune route, page, donnée Supabase ou interface existante n'a été modifiée. La restructuration du routage est la prochaine étape.
3. **Restructurer les routes :** déplacer accueil, catalogue, produit, confidentialité, livraison-paiement sous `src/app/p/[partner]/…` ; le `layout` racine ne garde que `html`/`body`/police et `CatalogProvider` ; `app/p/[partner]/layout.tsx` porte le « chrome » boutique (bandeau, en-tête, pied de page, tiroir panier, WhatsApp flottant, pop-up, suivi) et `ShopProvider`. `proxy.ts` réécrit les chemins publics vers la boutique maison. Slug inconnu ou suspendu : `notFound()`.
4. `ShopContext`, `<ShopLink>` et `buildShopHref()` sont créés ; **reste à faire** : monter le fournisseur dans le layout boutique, remplacer tous les liens internes et tous les usages du numéro global (liste en annexe F).
5. Panier et pop-up par boutique (clés avec slug) ; `CartHydrator` reçoit le slug.
6. Métadonnées : `noindex` + `canonical` pour les partenaires. Sitemap : maison seulement.
7. Textes dépendants du partenaire : note de livraison, annonces, « Devenir distributeur », « Client VIP », mention FBO dans le pied de page.8. Tests : construction des liens, messages WhatsApp avec le numéro du partenaire, validation des slugs, réécriture de `proxy.ts`.
9. En attendant l'admin, Alvine crée les partenaires dans le Table Editor (exemple SQL en annexe F).
- **Fait quand :** `/p/test` affiche la boutique du partenaire « test » avec **son** numéro partout (flottant, commande, 1 clic, pop-up, distributeur, VIP) ; `/` est inchangé ; les paniers sont distincts par boutique ; build OK ; test manuel sur téléphone.

### Phase 3 : Leads dans Supabase + parcours catalogue (NOUVELLE)
1. Migration `supabase/migrations/003_leads.sql` fusionnée dans `main` et déclarée configurée par le propriétaire : table `leads`, clé unique `(partner_id, phone)`, horodatages, champs GPS et RLS. **Supabase est l'unique source de vérité** : aucun Google Sheets, Apps Script, webhook ou miroir externe. Le script `scripts/google-sheets-leads.gs` a été supprimé de la branche ; les variables du webhook ont disparu.
2. Implémentation fusionnée dans `main` : `src/lib/leads.ts` valide le slug de boutique, le besoin, les métadonnées, `firstVisitAt` et les coordonnées. `src/app/api/leads/route.ts` résout le partenaire actif et appelle `upsert_lead` avec `SUPABASE_SERVICE_ROLE_KEY` côté serveur. La boutique maison `yekola` peut être initialisée depuis `NEXT_PUBLIC_WHATSAPP_NUMBER` si aucune ligne maison n'existe. Un lead existant conserve `created_at` et sa première `first_visit_at` ; les informations récentes et `last_request_at` sont actualisés.
3. **Horodatage :** `created_at` est l'heure de soumission générée par PostgreSQL (référence fiable). `first_visit_at` est l'heure de première visite fournie par le navigateur, si disponible ; elle est considérée comme une donnée indicative fournie par le client. Les exports affichent les dates/heures en fuseau `Africa/Brazzaville`.
4. **GPS facultatif uniquement (R16) — implémenté dans le formulaire fusionné dans `main` :** aucun champ ville/quartier et aucune géolocalisation par IP. `navigator.geolocation` est appelé uniquement après clic sur « Partager ma position ». Refus, erreur ou indisponibilité : le formulaire continue sans GPS. Le visiteur peut retirer sa position avant l'envoi. `location_consent_at` est généré par PostgreSQL à la réception des coordonnées.
5. **Après enregistrement réussi — parcours partiellement branché :** l'API est attendue avant d'afficher le remerciement ; si elle échoue, le visiteur voit une erreur et peut réessayer. Le composant déclenche le téléchargement uniquement si `NEXT_PUBLIC_CATALOG_PDF_PATH` désigne un fichier réel dans `/public`, puis affiche le remerciement et défile vers `#besoins` à sa fermeture. Aucun lancement automatique de WhatsApp. **Le PDF n'est pas présent dans le dépôt** : ne pas renseigner la variable avant d'avoir ajouté et vérifié le fichier.
6. `/confidentialite` mise à jour pour expliquer Supabase, le GPS facultatif, les finalités, les destinataires et le traitement temporaire de l'IP pour limiter les abus. La durée exacte de conservation reste à définir avant la mise en production.
7. Tests : `src/lib/__tests__/leads.test.ts` couvre la validation, le numéro, la première visite et les coordonnées GPS. Après fusion, `npx tsc --noEmit`, `npx vitest run` (**31 tests**) et `npm run build` ont tous réussi ; le déploiement Vercel est également au vert. Restent à vérifier manuellement : RLS, upsert/dédoublonnage sur la base réelle, API, GPS refusé/indisponible et parcours complet avec téléchargement du PDF.
- **Fait quand :** un lead est enregistré dans Supabase et rattaché au bon partenaire ; le même numéro sur deux boutiques crée deux fiches distinctes ; le GPS refusé n'empêche rien ; le catalogue PDF se télécharge après succès ; la fenêtre de remerciement puis le défilement fonctionnent ; aucune dépendance Google Sheets n'existe.

### Phase 4 : Back-office admin (ancienne phase 2) + gestion des partenaires
1. Auth Supabase : **mot de passe et lien magique**, un seul compte admin au départ. Table `admins`.
2. Routes : `/admin/login`, `/admin`, `/admin/produits`, `/admin/produits/nouveau`, `/admin/produits/[id]`, **`/admin/partenaires`** (liste, invitation par e-mail, activation/suspension, parrain, numéro WhatsApp, n° FBO, lien de la boutique, aperçu des leads).
   - Ajouter `/admin/leads` : liste filtrable, détail, dates/heures de première visite et de soumission, statut, notes, filtres par partenaire/période/besoin/source ; export CSV propre et PDF lisible, réservé à l'admin.
3. **Protection à deux niveaux :** `proxy.ts` (renouvelle la session, redirige) **et** `requireAdmin()` au début de **chaque** Server Action. L'interface seule ne suffit jamais. `/admin` en `noindex`. Les clients Supabase `server`/`browser` (cookies) sont créés ici.
4. Formulaire produit (validation `zod`) : nom, slug, catégorie, besoins, prix public, textes, bienfaits, visible/masqué, meilleure vente. **Prix client privilégié en lecture seule, saisi selon la grille officielle.** Aperçu de la carte.
5. **Images :** compression dans le navigateur (annexe D), envoi direct vers Supabase Storage par URL signée, réordonner, supprimer.
6. Après chaque enregistrement : `updateTag("catalog")` (ou `partner:{slug}`).
- **Fait quand :** l'admin crée un produit avec photos et invite un partenaire ; le site public change en moins d'une minute.

### Phase 5 : Promos, packs et offres (globales — administrateur)
Les promotions, packs et offres configurés par l'administrateur sont **globaux** et s'appliquent à toutes les boutiques. Les codes promo créés par les partenaires sont un mécanisme séparé, strictement limité à la boutique de leur créateur (R17 à R20).
1. **Promotions globales :** par produit, prix promo ou pourcentage, dates de début et de fin, badge et activation/désactivation. Expiration vérifiée côté serveur. Elles s'appliquent à toutes les boutiques.
2. **Packs :** un pack est un produit (`is_pack`) avec composition (`pack_items`) et son propre prix. Les packs et leur gestion restent sous le contrôle de l'administrateur.
3. **Offres :** bannières d'accueil (titre, sous-titre, image, lien, dates, ordre) : composant `OfferBanners`.
4. **Non-cumul :** un code promo partenaire ne s'ajoute pas à une promotion globale. Définir et tester explicitement la règle de priorité au calcul du panier ; ne jamais appliquer deux réductions sur la même ligne.
5. **Tests :** dates, activation, périmètre global, code partenaire limité à son partenaire, limite d'utilisations, produits éligibles, non-cumul et prix VIP.
- **Fait quand :** l'administrateur crée une promotion datée visible dans toutes les boutiques ; elle s'applique au panier et expire seule ; un code partenaire ne fonctionne que dans sa boutique et respecte ses limites.
### Phase 6 : Espace partenaire (NOUVELLE)
1. Connexion partenaire (mot de passe ou lien magique) via l'invitation de l'admin ; `requirePartner()` dans chaque Server Action ; RLS en seconde barrière.2. `/espace` (tableau de bord) : lien de la boutique avec bouton « Copier » et **QR code**, nombre de leads, derniers leads, commandes (phase 7).
3. `/espace/leads` : liste filtrable (besoin, statut), changement de **statut** (Nouveau, Contacté, Intéressé, Client, Perdu), **note**, bouton WhatsApp vers le lead, export CSV et PDF. Les partenaires ne voient **que leurs leads** (R12) ; l'export applique exactement le même périmètre d'accès.
4. `/espace/profil` : nom affiché, photo (compression, annexe D), texte d'accueil (300 caractères), note de livraison, numéro WhatsApp (avec journal et alerte à l'admin, Q-P3). Aucune modification de produits ni de prix.
5. `/espace/liens` : **liens publicitaires générés** pour les 6 besoins avec leur slug et des paramètres `utm_*` (annexe B).
6. **Codes promo du partenaire :** création et gestion de codes réservés à sa boutique ; remise de 1 à 20 % sur le prix public, dates de validité, nombre maximal d'utilisations, produits éligibles et activation/désactivation. Historique des utilisations et attribution au partenaire. Le code d'un partenaire doit être refusé sur toutes les autres boutiques, y compris côté API.
7. Tests d'isolation : un partenaire ne peut ni lire ni modifier les données d'un autre (requêtes avec deux comptes), ni utiliser ou administrer les codes promo d'un autre partenaire.
- **Fait quand :** deux partenaires de test se connectent, voient chacun uniquement leurs leads, modifient leur profil, et la boutique publique reflète ces changements en moins de 5 minutes.

### Phase 7 : Réglages, contenu et journal des commandes (ancienne phase 4 + commandes)
- Table `settings` (clés publiques) : annonces par défaut, textes de réassurance. `config.ts` lit la base avec repli.
- Témoignages : liste, envoi d'image, visible/masqué (globaux).
- **Journal `orders`** (annexe F) : enregistrer l'instantané (articles, prix unitaires, total, réduction, code promo éventuel, partenaire propriétaire du code, VIP appliqué) avant d'ouvrir WhatsApp ; statuts Nouveau, Confirmé, Livré, Annulé ; vue partenaire (`/espace/commandes`) et vue admin (tout).
- **Confirmation manuelle :** l'administrateur confirme le paiement et la commande après vérification. Conserver la date, l'identité de l'administrateur et le montant effectivement payé. Ne pas accorder le statut VIP sur une commande simplement créée ou envoyée.
- **Qualification VIP :** après confirmation d'un paiement d'au moins 65 000 F, attribuer au client le statut VIP à vie. Le montant de référence (avant ou après remise) doit être confirmé dans les questions ouvertes avant d'implémenter cette règle.
- **Fait quand :** chaque commande WhatsApp laisse une trace chez le bon partenaire ; l'administrateur confirme le paiement ; le statut VIP n'est attribué qu'après confirmation et respecte le seuil convenu.

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
1. **Seuil VIP après remise :** pour qualifier un client VIP, les 65 000 F minimum correspondent-ils au montant effectivement payé après application éventuelle d'un code promo ou d'une promotion globale, ou au total avant remise ? La règle confirmée est « commande d'au moins 65 000 F payée », mais cette base de calcul doit être précisée.
2. Résolu : marque **Yekola Shop** ; connexion admin **mot de passe et lien magique** ; hébergement **Vercel** ; domaine **à acheter plus tard**.
3. Adresse(s) e-mail des administrateurs (au minimum celle d'Alvine).
4. Garder « Espèces à la livraison » dans le formulaire ? (conservé pour l'instant)
5. Un pack peut-il être en promo en plus de son prix de pack ? (à confirmer avant implémentation).

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
- Les liens WhatsApp ouverts après un `await` peuvent être bloqués par le navigateur : ouvrir `window.open` **dans le gestionnaire du clic**, avant tout appel réseau.- Un `localhost:3000` déjà utilisé par une autre application peut laisser des données et des erreurs (ex. `manifest.webmanifest` 404) : utiliser le port 3001.
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
| Vitalité & Forme Masculine | `vitalite` | `vitalite-masculine` || Peau & Teint Éclatant | `peau` | `peau-eclatante` |
| Détox & Perte de Poids | `detox` | `detox-c9` |
| Défenses Immunitaires | `immunite` | `immunite-tonus` |
`besoin=` est le signal fiable ; le nom de campagne sert de repli (mots-clés reconnus dans `src/lib/interest.ts`). Changer `utm_source` (`instagram`, `tiktok`, `whatsapp`) et `utm_medium` (`cpc`, `statut`) selon la plateforme. Quand le catalogue sera complet, remplacer `/?besoin=` par `/catalogue?besoin=`.

## Annexe C : Schéma cible Supabase (à créer en phase 1)
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,  slug text unique not null,
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
  display_name text not null,  email text,
  whatsapp_number text not null check (whatsapp_number ~ '^242[0-9]{9}$'),
  fbo_id text,
  city text,
  photo_url text,  welcome_text text check (char_length(welcome_text) <= 300),
  delivery_note text check (char_length(delivery_note) <= 200),
  is_house boolean not null default false,
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  created_at timestamptz not null default now(),  updated_at timestamptz not null default now(),
  constraint partners_slug_reserved check (slug not in (
    'admin','api','p','espace','partenaire','catalogue','produit','connexion','login','logout',
    'hors-ligne','confidentialite','livraison-paiement','sitemap','robots','manifest','www'))
);create unique index partners_one_house on partners (is_house) where is_house;

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

## 8 bis. Refonte UX/UI mobile-first — Yekola Shop (priorité immédiate)

**Statut : première passe de refonte intégrée sur `feat/mobile-first-natural-redesign` ; validation visuelle et contrôles techniques encore à effectuer.** Cette section reste le brief de référence. Le Hero, l'en-tête, la palette, les textes principaux, les sections d'accueil, les cartes produits et les éléments flottants ont reçu une première adaptation mobile-first.
### Direction artistique

Créer un langage visuel original qui combine :
- **A — Luxe minimaliste :** hiérarchie typographique nette, composition éditoriale, espaces maîtrisés, détails sobres et finitions soignées.
- **B — E-commerce premium :** produits et prix immédiatement compréhensibles, visuels forts, promotions lisibles, actions d'achat évidentes et parcours sans friction.- **C — Wellness naturel :** chaleur, sérénité, matière organique et univers végétal, sans tomber dans le cliché « feuille verte partout ».

La direction finale est un **premium wellness naturel et commercial** : élégante et épurée, mais clairement conçue pour vendre et conseiller.

### Palette et principes graphiques
Palette de départ à appliquer de façon cohérente (à vérifier en contraste WCAG AA avant validation) :
- Vert forêt : `#123D32` — marque, titres forts, navigation et actions principales.
- Ivoire naturel : `#F6F3EA` — fonds doux et grandes surfaces.
- Or doux : `#D5A84B` — accent ponctuel pour offres et détails premium, jamais pour du petit texte peu contrasté.
- Blanc : `#FFFFFF` — cartes, formulaires et surfaces de lecture.
- Neutres chauds : gamme de gris/beiges pour texte secondaire, séparateurs et bordures.

Éviter les aplats verts excessifs, les dégradés décoratifs sans fonction, les ombres lourdes, les rayons uniformément énormes et l'accumulation de badges. Les photographies produits doivent être prioritaires dès qu'elles sont disponibles ; ne pas inventer de témoignages, d'images de clients ou de preuves sociales.

### Règle non négociable : Hero visible entièrement sans scroll

Sur la page d'accueil mobile, **la section Hero doit être entièrement visible dans le premier écran, sans défilement vertical**. Cela comprend le titre, le texte d'accroche, les actions principales, le visuel/produit mis en avant et les éléments de réassurance essentiels choisis pour le Hero.

- Concevoir et mesurer le Hero en tenant compte de la hauteur réelle de l'en-tête et de l'éventuel bandeau d'annonce ; ne pas raisonner sur la hauteur du viewport seule.
- Cible de validation : écrans mobiles de référence 360 × 800 et 390 × 844 CSS px, puis vérification sur un petit écran et avec les barres du navigateur mobile visibles.
- Aucun élément essentiel du Hero ne doit être coupé, masqué derrière une barre fixe ou repoussé sous la ligne de flottaison. Pas de scroll nécessaire pour découvrir le CTA principal ou le produit vedette.
- Adapter la composition au viewport : réduire les espacements et tailles de façon maîtrisée, organiser texte et visuel intelligemment, et privilégier une image cadrée/compacte. Ne pas résoudre le problème en réduisant le texte jusqu'à le rendre illisible.
- Si l'ensemble ne tient pas dans les conditions de test, simplifier le contenu du Hero et déplacer les éléments secondaires sous le Hero. Ne jamais tricher avec une hauteur fixe qui déborde.
- Sur desktop, conserver une composition plus ample et équilibrée ; la contrainte « entièrement visible sans scroll » vise le premier écran mobile.

### Copywriting : réécriture complète orientée client

Réécrire les textes de l'accueil et des composants de conversion avec une voix :
- claire, humaine, chaleureuse, crédible et professionnelle ;
- orientée bénéfices d'usage et besoins du client, sans promesse miraculeuse ;
- concrète sur les prix en FCFA, les modalités de commande, la livraison et le conseil ;
- courte sur mobile : titres spécifiques, paragraphes courts, CTA explicites et libellés cohérents.

Le Hero doit répondre immédiatement à trois questions : **qu'est-ce que je trouve ici ?**, **comment cela peut m'aider à choisir ?**, **comment commander ?** Préférer un titre distinctif et concret à une formule générique. Le sous-titre doit expliquer l'accompagnement et l'accès aux produits ; les CTA doivent distinguer clairement « Voir les produits » et « Être conseillé sur WhatsApp ».

Réviser aussi les titres de sections, descriptions des besoins, cartes produits, badges promotionnels, messages vides, réassurance, panier, formulaire de commande et pied de page. Éviter les répétitions, le jargon, les majuscules inutiles et les promesses vagues.

**Contraintes métier et éditoriales inchangées :**
- aucune allégation de guérison, de prévention ou de traitement médical ;
- ne pas présenter un complément comme substitut à un avis médical ;
- ne pas inventer de résultats, d'avis clients, de certifications, de délais ou de zones de livraison ;
- conserver les règles de prix client privilégié, promotions, commande WhatsApp et paiement définies en section 2 ;
- conserver la mention légale « Entrepreneur Forever Indépendant Agréé » au bon endroit ;
- textes partagés et réutilisés centralisés dans `COPY` de `src/lib/config.ts` lorsque pertinent.

### Parcours et composants mobiles

1. **En-tête compact :** une seule ligne utile, marque, panier et accès recherche/navigation ; supprimer la double rangée mobile actuelle si elle encombre le premier écran. Prévoir une navigation basse uniquement si elle améliore réellement l'accès aux destinations principales et ne masque pas le contenu.
2. **Accueil :** Hero complet au premier écran, puis réassurance, besoins/catégories, meilleures ventes, packs, témoignages authentiques (section masquée si aucune preuve réelle), conseil et pied de page.
3. **Catalogue :** recherche facilement accessible, filtres mobiles compacts (panneau ou tiroir si nécessaire), nombre de résultats lisible et grille adaptée aux petits écrans.
4. **Cartes produits :** photo cohérente, nom lisible, prix public/promo/client privilégié sans ambiguïté, action tactile claire ; pas de densité excessive.
5. **Fiche produit :** galerie adaptée au mobile, informations et prix hiérarchisés, contenu scannable, quantité simple, CTA d'achat accessible sans masquer les informations.
6. **Panier/commande :** récapitulatif clair, contrôle des quantités facile, formulaire lisible et CTA WhatsApp évident ; respecter les règles métier existantes.
7. **Éléments flottants :** WhatsApp, tiroirs, modales et éventuelle navigation fixe ne doivent jamais recouvrir les actions, champs ou contenus importants.

### Responsive, accessibilité et performance

- Mobile-first : définir les styles de base pour 320–390 px, puis enrichir progressivement tablette et desktop.
- Cibles tactiles ≥ 44 px, champs de saisie ≥ 16 px, focus visible, labels explicites, ordre clavier logique, contrastes WCAG AA.
- Respecter `prefers-reduced-motion`, éviter les animations non essentielles et les défilements horizontaux involontaires.
- Images responsives, dimensions réservées pour éviter les sauts de mise en page, chargement optimisé ; ne pas ajouter de dépendance UI sans justification.
- Préserver SEO, navigation sans JavaScript quand elle existe, URLs publicitaires, règles métier, capture des leads, Supabase et isolation multi-boutiques.
- Ne pas supprimer ni réécrire une fonctionnalité métier au seul motif de simplifier le visuel.

### Périmètre et ordre d'exécution

**Étape 1 — audit et inventaire :** relever les composants partagés, les styles globaux, les états mobiles et les textes actuels. Repérer les contraintes de données réelles (photos absentes, catalogue incomplet, témoignages vides) et ne pas maquiller ces lacunes par du contenu fictif.

**Étape 2 — système visuel :** définir tokens de couleurs, typographie, espacements, rayons, bordures, boutons, champs, cartes et états interactifs.

**Étape 3 — accueil et Hero :** refondre en premier l'en-tête et le Hero, puis vérifier impérativement l'intégralité du premier écran sur 360 × 800 et 390 × 844.
**Étape 4 — parcours d'achat :** catalogue, cartes, fiche produit, panier et commande WhatsApp.

**Étape 5 — finition :** autres sections de l'accueil, pages légales, états vides/erreur, navigation, footer, tablette et desktop.

### Critères d'acceptation

- Le Hero et son CTA principal sont entièrement visibles au premier écran mobile, sans scroll, sur les deux formats de référence.
- L'en-tête ne consomme pas une hauteur disproportionnée et ne crée pas de double navigation encombrante.
- Les parcours accueil → catalogue → fiche produit → panier → WhatsApp fonctionnent toujours.
- Aucun contenu essentiel n'est masqué par un élément fixe ou flottant.
- Les prix, promotions, seuil VIP, numéro WhatsApp, mentions légales et règles de livraison restent exacts.
- Les textes sont cohérents, concrets, sans allégations médicales ni preuves inventées.
- Vérifier manuellement les vues 320 px, 360 px, 390 px, tablette et desktop.
- Avant toute fusion : `npx tsc --noEmit`, `npx vitest run`, `npm run build` ; ajouter/adapter des tests si une logique change.
- À la fin de la session de code, actualiser la section 4 « État d'avancement » et les phases concernées.

## Journal de suivi — 2 novembre 2026

### Audit et durcissement Supabase

- Audit des neuf tables du schéma public : RLS activé sur toutes. Les privilèges SQL navigateur ont été réduits ; les rôles `anon` et `authenticated` n'ont pas de droits d'écriture généraux sur les tables métier.- Lecture publique conservée uniquement pour `offers`, `pack_items`, `products`, `promotions`, `settings`, `testimonials` et la vue `partners_public`.
- `authenticated` conserve la lecture de son profil partenaire et des leads selon RLS, avec mise à jour limitée aux colonnes `partners` autorisées et à `leads.status/note`.
- Les privilèges de colonnes et de séquences ont également été contrôlés. Les privilèges par défaut des objets créés par `postgres` dans `public` ont été durcis pour `anon` et `authenticated`.
- **Limite non résolue :** les privilèges par défaut de `supabase_admin` n'ont pas pu être modifiés depuis le SQL Editor (permission refusée). Ne pas considérer ce point comme corrigé.
- `partners_public` est techniquement une vue automatiquement modifiable, mais les rôles navigateur ne disposent pas des privilèges INSERT/UPDATE/DELETE ; seule la lecture est accordée.
- `is_admin()` reste exécutable par `anon`, car les politiques RLS du catalogue l'appellent ; sans utilisateur authentifié, elle renvoie false. `upsert_lead()` reste réservée à `service_role`.
### Suspension totale des partenaires

- `current_partner_id()` ne retourne désormais que l'identifiant d'un partenaire dont le statut est `active` ; son `search_path` est vide et les objets sont qualifiés.
- Les politiques de lecture et de modification du profil partenaire exigent aussi `status = 'active'`.
- Les politiques administrateur restent inchangées. Les politiques des leads continuent de s'appuyer sur `current_partner_id()` : un partenaire suspendu ne peut donc plus lire ou modifier ses leads via ces politiques.
- La contrainte `partners_status_check` autorise déjà `pending`, `active` et `suspended`. Au moment du contrôle, un seul partenaire était actif et aucun partenaire suspendu n'était présent.
- La table `settings` était vide au moment de l'audit ; ne stocker dans cette table que des paramètres destinés à être publics.
### Migrations versionnées sur la branche de travail

- `supabase/migrations/005_harden_public_privileges.sql` : enregistre les corrections des privilèges de tables, colonnes, séquences, fonctions et privilèges par défaut de `postgres`.
- `supabase/migrations/006_enforce_suspended_partner_access.sql` : enregistre la suspension totale et le durcissement de `current_partner_id()`.
- Ces corrections avaient été exécutées par le propriétaire depuis le SQL Editor Supabase avant l'ajout des fichiers. Les migrations sont réexécutables ; vérifier l'historique `supabase_migrations.schema_migrations` avant toute commande de déploiement de migrations afin de savoir si ces versions sont déjà enregistrées.
- Les scripts 005/006 ne modifient pas les privilèges par défaut de `supabase_admin`.

### Points de sécurité restant à traiter

- **API Next.js utilisant `service_role` :** cette clé contourne RLS. Chaque route serveur privilégiée doit authentifier l'appelant et vérifier son rôle/statut avant toute opération. La revue complète des routes API reste à faire.
- Vérifier en particulier que les endpoints partenaires refusent un partenaire suspendu, même lorsqu'ils utilisent le client admin Supabase.
- Les fonctions SECURITY DEFINER `is_admin()` et `upsert_lead()` utilisent encore `search_path = public` ; examiner leur durcissement dans une migration dédiée, sans modifier leur comportement métier.
- Les privilèges par défaut de `supabase_admin` restent à traiter avec un rôle autorisé.

### État Git et validations

- Branche de travail : `feat/mobile-first-natural-redesign`. Elle est en avance de plus de 100 commits sur `main`, sans commit en retard au moment de la comparaison.
- `feat/supabase-lead-capture` n'apporte pas de changement fonctionnel supplémentaire à la branche de refonte : le PDF catalogue et la correction de la route leads sont déjà présents. Ne pas fusionner cette ancienne branche séparément.
- La PR #4 de refonte reste un brouillon. La fusion dans `main` attend les validations techniques, visuelles et fonctionnelles. Le dernier statut Vercel vérifié sur le commit de tête `0d0f031` est en échec ; consulter les logs du déploiement avant toute fusion.
- Les contrôles `npx tsc --noEmit`, `npx vitest run` et `npm run build` n'ont pas été exécutés dans cette session après les ajouts des migrations. Ils restent obligatoires avant fusion.
- Le parcours réel d'import des 53 références, le test mobile du Hero et les parcours visiteur contre Supabase restent à valider.

## Journal de développement — 3 novembre 2026

### Phase 2 — première implémentation du routage public multi-boutiques

- Ajout de `proxy.ts` : les URL publiques historiques sont réécrites vers la boutique maison `/p/yekola`, tandis que `/p/:slug`, `/api`, `/admin`, `/espace` et les ressources statiques sont préservés.
- Déplacement des pages publiques (accueil, catalogue, produit, packs, besoins, panier, devenir partenaire et pages légales) sous `src/app/p/[partner]/`. Le contenu n'est plus dupliqué dans les routes racine.
- Le layout partenaire charge le profil public Supabase, refuse les boutiques inconnues/inactives et monte le `ShopProvider` avec l'en-tête, le pied de page et les composants de boutique.
- Les liens internes et les actions WhatsApp utilisent le contexte de la boutique ; les messages de commande commencent par le nom de la boutique.
- Les clés locales du panier, du suivi d'intérêt et des états de capture de lead sont séparées par slug. Les anciennes clés du panier et du suivi d'intérêt sont migrées vers la boutique maison ; les anciennes clés de lead restent lues pour préserver l'état des visiteurs existants.
- Les boutiques partenaires reçoivent les métadonnées `noindex, follow` et un canonical vers le site maison. Le sitemap reste limité aux URL publiques de la boutique maison.
- Le numéro WhatsApp n'est plus une variable d'environnement globale : il provient du profil public du partenaire.

**Statut : code préparé sur la branche de travail, validation locale obligatoire avant de considérer cette étape comme terminée.** À exécuter sur le poste du propriétaire : `npx tsc --noEmit`, `npx vitest run`, `npm run build`, puis vérifier `/`, `/p/yekola`, une boutique partenaire active, le numéro WhatsApp, l'isolation des paniers et le parcours mobile. Ne pas fusionner la PR avant ces vérifications et l'accord explicite du propriétaire.

## Journal de développement — 3 novembre 2026 (correctifs de validation)

- Correction du test `src/lib/__tests__/pricing.test.ts` : `buildSingleProductMessage` exige désormais explicitement `product`, `quantity` et `partnerName`. Le test de commande 1 clic passe ces trois arguments et vérifie aussi le nom du partenaire dans le message. Aucun calcul ni tarif de production n'a été modifié.
- Le contrôle local fourni par le propriétaire indique 40 tests réussis sur 41 ; le test WhatsApp échouait à cause de l'ancien appel de test incomplet. Le résultat après correction reste à confirmer localement.
- Les erreurs TypeScript concernent des fichiers générés dans `.next/dev/types/` avec du contenu syntaxiquement tronqué. Hypothèse à vérifier : cache Next.js local corrompu/incomplet. Ne pas modifier ni versionner ces fichiers générés et ne pas contourner le contrôle en excluant les types Next.js. Procédure de vérification locale : arrêter `next dev`, supprimer `.next` avec `rm -rf .next`, puis relancer typage, tests et build.
- **État :** correctif du test poussé sur `feat/mobile-first-natural-redesign`. Les commandes `npx tsc --noEmit`, `npx vitest run` et `npm run build` doivent encore être exécutées sur le poste du propriétaire ; aucune fusion dans `main` n'est autorisée avant leur réussite.

## Journal de développement — 3 novembre 2026 (correction de la page d'erreur)

- Les contrôles locaux du propriétaire confirment désormais **41 tests réussis sur 41** après la correction du test de commande 1 clic.
- La suppression de `.next` a éliminé les erreurs de syntaxe des types générés. Le typage et le build ont ensuite révélé deux erreurs réelles dans `src/app/error.tsx` : cet écran global appelait `buildAdviceMessage()` sans nom de partenaire et `buildWhatsAppUrl()` sans numéro.
- Correction poussée : la page d'erreur globale ne propose plus un contact WhatsApp sans contexte de boutique. Elle propose de réessayer ou de revenir à l'accueil. Le parcours WhatsApp des boutiques reste géré par `ShopContext`, qui utilise le nom et le numéro de la boutique active.
- **À revalider localement après récupération du commit :** `npx tsc --noEmit`, `npx vitest run` et `npm run build`. Le succès des tests est confirmé avant ce dernier correctif ; le typage et le build après correction restent à confirmer par le propriétaire. Ne pas fusionner dans `main` avant les trois validations.

## Journal de développement — 3 novembre 2026 (validation technique réussie)

- Après récupération des commits de correction, le propriétaire a exécuté les trois contrôles sur son poste.
- `npx tsc --noEmit` : **réussi**, sans erreur TypeScript.
- `npx vitest run` : **7 fichiers de test réussis, 41 tests sur 41**.
- `npm run build` : **réussi** avec Next.js 16.4.3 (Turbopack). Compilation, vérification TypeScript, collecte des données et génération des 77 pages terminées sans erreur.
- Les erreurs de types générés dans `.next/dev/types` ont disparu après suppression du cache ; les deux erreurs de paramètres dans `src/app/error.tsx` ont été corrigées.
- **État : validation technique locale réussie pour le commit récupéré.** Cela ne remplace pas les tests fonctionnels et visuels : vérifier les URL historiques, `/p/yekola`, une boutique partenaire active, les coordonnées WhatsApp propres à chaque boutique, l'isolation des paniers et le parcours mobile. La fusion dans `main` reste soumise à ces vérifications et à l'accord explicite du propriétaire.


## Journal de développement — 3 novembre 2026 (correction du proxy multi-boutiques)

- Le propriétaire a confirmé que le commit local était `954763d`, que l'arbre Git était propre et que `proxy.ts` était suivi à la racine du dépôt.
- Les tests HTTP montrent que `/p/yekola` et `/p/yekola/catalogue` répondent `200 OK`, tandis que `/` et `/catalogue` répondent `404`.
- Diagnostic : les routes App Router sont dans `src/app/`, mais le proxy était à la racine du dépôt. La convention Next.js exige que `proxy.ts` soit au même niveau que `app` lorsqu'on utilise le dossier `src`. Le proxy n'était donc pas placé à l'emplacement conventionnel reconnu pour cette structure.
- Correction appliquée sur `feat/mobile-first-natural-redesign` : déplacement logique du proxy vers `src/proxy.ts`, avec import ajusté de `./src/lib/config` vers `./lib/config`, puis suppression de l'ancien `proxy.ts` racine.
- Commits de correction : `13663bc` (création de `src/proxy.ts`) puis `7ee8e2d` (suppression de `proxy.ts` racine).
- **À valider localement après pull :** `/` doit répondre `200` et afficher la boutique Yekola ; `/catalogue` doit répondre `200) ; les routes explicites `/p/yekola` et `/p/yekola/catalogue` doivent rester fonctionnelles. Vérifier aussi qu'une route réservée telle que `/api/leads` n'est pas réécrite.
- **Point restant distinct :** Next.js 16.4.3 affiche en développement un avertissement d'instant navigation dans `src/app/p/[partner]/layout.tsx` lors de `await params`. Il n'a pas été modifié dans ce correctif de routage. Examiner séparément l'option documentée `export const instant = false` ou une architecture Suspense adaptée, sans confondre cet avertissement avec le 404 des anciennes URL.
- Ne pas fusionner dans `main` avant validation locale et tests fonctionnels/mobile, avec accord explicite du propriétaire.


## Journal de développement — 3 novembre 2026 (navigation du layout partenaire)

- Le propriétaire a confirmé par tests HTTP que les quatre URL `/`, `/catalogue`, `/p/yekola` et `/p/yekola/catalogue` répondent toutes `200 OK`. Les deux anciennes URL sont bien réécrites vers la boutique maison par `src/proxy.ts`.
- Un avertissement distinct Next.js 16.4.3 subsiste dans `src/app/p/[partner]/layout.tsx` : le layout doit lire `params.partner` pour charger le partenaire et construire le `ShopProvider`, indispensable à l'isolation du catalogue, du panier et du numéro WhatsApp.
- Correction appliquée : ajout de `export const instant = false` au layout partenaire. Ce choix assume explicitement un rendu bloquant pour ce segment, plutôt que de promettre un shell instantané qui ne peut pas être construit correctement avant de connaître le partenaire. Il ne désactive pas le prérendu des routes.
- Commit de correction : `22ba61e9abb47171f5ce4b9ba5ccae8baec6da85`.
- **Validation locale encore requise :** arrêter puis relancer le serveur de développement, ouvrir `/`, `/catalogue`, `/p/yekola` et `/p/yekola/catalogue`, puis vérifier que l'avertissement `instant-shell-url-data` a disparu et que le contexte de chaque boutique reste correct. Le comportement de navigation client et les performances doivent être contrôlés dans le navigateur.
- Ne pas considérer ce correctif comme validé avant ces tests ; ne pas fusionner dans `main` sans les validations techniques, fonctionnelles et l'accord explicite du propriétaire.


## Journal de développement — 3 novembre 2026 (métadonnées multi-boutiques)

- Après le correctif `instant = false`, les pages testées par le propriétaire répondent `200 OK` et l'avertissement du layout principal n'apparaît plus.
- Un avertissement distinct a été observé dans `generateMetadata()` : la fonction lit `params.partner` pour décider si la boutique est la boutique maison ou une boutique partenaire. Cette distinction est nécessaire pour préserver l'indexation de Yekola et le `noindex` des boutiques partenaires.
- Correction appliquée : ajout de la directive `"use cache"` au début de `generateMetadata()`. Les paramètres de route déterminent la clé de cache ; les métadonnées sont donc calculées séparément par slug. La fonction `getPartner(slug)` utilise déjà le cache Next.js et son tag `partner:<slug>`.
- Commit : `823f4b0acef912a75dd4dc5b7782fe6f3cb8eb94`.
- **Validation locale requise :** `git pull --ff-only`, redémarrer `npm run dev`, ouvrir les routes maison et partenaire, vérifier l'absence de l'avertissement `blocking-prerender-metadata-runtime`, puis inspecter les balises robots/canonical : Yekola doit rester indexable ; les partenaires doivent rester `noindex, follow` avec canonical vers le site maison.
- Ne pas fusionner dans `main` avant validations techniques et SEO réelles.


## Réorientation du plan — 3 novembre 2026 : priorité au back-office

### Décision du propriétaire

Le développement public multi-boutiques ne peut pas avancer correctement tant que le propriétaire ne dispose pas d'un moyen clair et sécurisé de se connecter à l'administration. À ce jour, le propriétaire ne sait pas comment accéder à l'espace admin ; la base Supabase contient la table `admins`, mais aucun parcours d'administration utilisable n'a encore été confirmé.

**La prochaine phase de développement est donc le back-office.** La correction secondaire de l'avertissement de métadonnées Next.js est mise en attente, sans abandon des exigences SEO déjà définies.

### Objectif de la phase

Depuis une interface protégée, le propriétaire doit pouvoir se connecter à l'administration et créer, consulter, modifier, activer ou suspendre les boutiques partenaires, sans éditer directement les tables Supabase.

### Ordre obligatoire des travaux

1. **Audit de l'existant, sans modification préalable :**
   - inventorier les routes `/admin`, les composants et les API déjà présents ou absents ;
   - examiner la table `admins`, les migrations, les politiques RLS, la fonction `is_admin()` et les mécanismes Supabase Auth ;
   - vérifier comment un administrateur est actuellement identifié et comment un premier compte peut être provisionné ;
   - repérer toutes les routes serveur qui utilisent `SUPABASE_SERVICE_ROLE_KEY` et vérifier leur authentification/autorisation.
2. **Définir et mettre en place l'accès initial de manière sécurisée :**
   - page de connexion admin, gestion de session, protection serveur de toutes les pages et actions admin, déconnexion ;
   - procédure documentée de création ou d'invitation du premier administrateur ;
   - aucun mot de passe, jeton ou secret codé en dur ; aucune clé `service_role` dans le navigateur ; aucune inscription admin publique.
3. **Livrer un tableau de bord admin minimal :**
   - accès évident à la gestion des boutiques ;
   - états de chargement, erreurs, absence de données et confirmation des actions ;
   - interface responsive et en français.
4. **Livrer la gestion des boutiques partenaires :**
   - liste avec recherche et statut ;
   - création avec validation du slug unique, nom public et numéro WhatsApp obligatoire, puis champs facultatifs selon le modèle existant ;
   - modification des informations autorisées ;
   - activation et suspension avec confirmation ;
   - aucune modification des règles métier, du catalogue global ou des prix sans décision explicite du propriétaire.
5. **Vérifier les autorisations et l'isolation :**
   - visiteur non connecté : accès admin refusé ;
   - partenaire connecté : accès admin refusé ;
   - administrateur autorisé : actions permises selon son rôle ;
   - une boutique ne peut pas modifier les données d'une autre boutique ;
   - les routes API vérifient elles-mêmes les droits côté serveur, même si l'interface masque les boutons.
6. **Valider dans le navigateur et avec Supabase réel**, puis mettre à jour ce plan avant de passer aux autres modules du back-office.

### Dépendance obligatoire : espace partenaire après le back-office

Le propriétaire précise l'ordre de livraison suivant : **l'espace partenaire ne commence qu'après la livraison complète du back-office**, lorsque le propriétaire peut s'y connecter et que toutes les fonctionnalités administrateur prévues sont opérationnelles.

En conséquence :
- La phase back-office doit être terminée et validée avant d'ouvrir le chantier partenaire.
- La phase suivante sera la connexion sécurisée des partenaires à leur propre espace `/espace`, associé à leur boutique.
- Chaque partenaire pourra accéder uniquement aux fonctionnalités qui lui sont attribuées et aux données de sa boutique (notamment ses leads et, selon le périmètre validé, les informations de sa boutique).
- Les contrôles d'accès doivent être vérifiés côté serveur et par RLS ; masquer une page ou un bouton ne constitue jamais une protection suffisante.
- Un partenaire ne doit jamais pouvoir consulter ou modifier les leads, commandes, paramètres ou données d'un autre partenaire.
- Le parcours de connexion partenaire, la récupération d'accès et la procédure d'activation du compte seront définis à partir du modèle Supabase Auth et des données partenaires existants, sans création de comptes fictifs en production.

**Ordre global confirmé :**
1. Back-office administrateur complet et opérationnel (connexion, tableau de bord, gestion des boutiques et autres fonctionnalités prévues).
2. Espace partenaire complet (connexion, accès à sa boutique et à ses données, fonctionnalités autorisées).
3. Validation de bout en bout du modèle multi-boutiques, puis poursuite des modules secondaires et préparation de la mise en production.

### Hors périmètre de la première livraison

- L'espace partenaire `/espace` et le suivi des leads par les partenaires.
- La gestion des produits, prix, promotions, packs et offres.
- Les exports CSV/PDF, la PWA et les autres fonctionnalités secondaires.

Ces modules viendront après la connexion admin et la gestion fiable des boutiques.

### État de départ confirmé le 3 novembre 2026

- La table `public.partners` contient uniquement la boutique maison `yekola`, avec `is_house = true` et `status = active`.
- La vue `public.partners_public` retourne ce même enregistrement unique.
- Aucun partenaire secondaire n'est actuellement enregistré ; il n'existe donc pas encore de boutique partenaire réelle pour tester son SEO.
- Le propriétaire a confirmé ne pas savoir comment se connecter au back-office. Le premier livrable doit résoudre ce blocage avant de demander la création de boutiques dans Supabase.
- Ne créer aucune donnée partenaire fictive pour les besoins des tests ; utiliser des données de test isolées ou un environnement dédié si nécessaire.

### Critères d'acceptation de la première livraison

- Le propriétaire dispose d'une procédure de connexion et de récupération/provisionnement initiale compréhensible et testée.
- `/admin` redirige ou refuse proprement l'accès lorsqu'aucune session administrateur valide n'existe.
- Un administrateur connecté peut consulter et gérer les boutiques partenaires depuis l'interface.
- Les contrôles d'accès sont appliqués côté serveur et couverts par des tests.
- Les migrations SQL, politiques RLS et éventuelles procédures d'amorçage sont documentées et réexécutables sans exposer de secret.
- Les commandes `npx tsc --noEmit`, `npx vitest run` et `npm run build` passent avant toute fusion ; les tests manuels Supabase et navigateur sont consignés séparément.
- Tout le travail reste sur `feat/mobile-first-natural-redesign`. Aucune fusion dans `main` sans l'accord explicite du propriétaire.


## Journal de développement — 3 novembre 2026 (socle initial du back-office)

- Création de la page de connexion `/admin/connexion` avec authentification e-mail/mot de passe via Supabase Auth ; aucun parcours d'inscription publique n'est exposé.
- Ajout des clients Supabase SSR serveur/navigateur et actualisation des cookies de session dans `src/proxy.ts`.
- Ajout de `requireAdmin()` : les pages protégées valident l'utilisateur avec `auth.getUser()`, puis vérifient son rattachement à `public.admins` côté serveur.
- Création du premier tableau de bord `/admin` : compteurs et liste des boutiques, avec les données lues via le client serveur authentifié soumis aux politiques RLS.
- Ajout de `docs/ADMIN_SETUP.md` décrivant la création du premier compte Auth et son rattachement à `public.admins`, sans exposer de secret.
- Dépendance `@supabase/ssr` ajoutée à `package.json`. **Le fichier `package-lock.json` doit être régénéré localement par `npm install`** après récupération des changements.
- Limites de ce premier lot : la gestion CRUD des boutiques, les modules produits/offres/promotions/commandes/clients, la récupération de mot de passe et les tests automatisés dédiés ne sont pas encore livrés.
- **Validation non exécutée depuis GitHub :** TypeScript, Vitest, build et parcours réel Supabase restent à vérifier sur le poste du propriétaire. Ne pas considérer la connexion comme opérationnelle tant que le premier compte n'a pas été provisionné et testé.
- Les changements restent sur `feat/mobile-first-natural-redesign`. Aucun merge dans `main`.

### État du back-office

1. [x] Socle initial de connexion et vérification du rôle côté serveur.
2. [x] Tableau de bord initial et lecture de la liste des boutiques.
3. [ ] Création, modification, activation et suspension des boutiques — **première implémentation ajoutée sur la branche, validation locale et navigateur en attente**.
4. [ ] Modules de gestion du catalogue, des prix, packs, promotions, offres et témoignages.
5. [ ] Gestion des leads, commandes et paramètres.
6. [ ] Tests sécurité, RLS, parcours navigateur et validation bout en bout.

**Lot livré dans cette session (validation requise avant de cocher l'étape) :**
- Ajout de `/admin/boutiques` pour lister les boutiques, voir leur URL et changer leur statut.
- Ajout de `/admin/boutiques/nouvelle` et `/admin/boutiques/[id]` pour créer et modifier les boutiques partenaires.
- Le formulaire valide le slug réservé/format, le numéro WhatsApp congolais et l'adresse e-mail.
- Les mutations serveur appellent d'abord `requireAdmin()`, puis utilisent le client privilégié uniquement côté serveur. La boutique maison est exclue des modifications et changements de statut.
- Le tableau de bord pointe vers le module de gestion des boutiques.
- **À valider localement :** TypeScript, Vitest, build, création/modification/activation/suspension sur Supabase réel, unicité des slugs et comportement RLS. Aucune création de boutique réelle n'a été effectuée par l'assistant.

**L'espace partenaire `/espace` reste bloqué jusqu'à la livraison et validation de tous les modules administrateur prévus.**


## Journal de développement — 3 novembre 2026 (correction de compatibilité Cache Components)

- Les premières vérifications locales du module de gestion des boutiques ont confirmé 41 tests Vitest réussis, mais ont révélé des erreurs TypeScript sur la validation du formulaire et des types de routes générés dans .next/dev/types.
- Le build a identifié une incompatibilité certaine : les exports de segment dynamic = force-dynamic ne sont pas autorisés lorsque cacheComponents: true est activé. Ces exports ont été retirés des pages admin ; leur contenu reste protégé par requireAdmin() et les données utilisateur ne sont pas mises en cache publiquement.
- Le type de retour de la validation des boutiques est désormais une union discriminée explicite. Les expressions régulières du numéro WhatsApp et de l'adresse e-mail ont également été corrigées pour reconnaître les espaces et caractères attendus.
- À valider localement après récupération : arrêter le serveur Next.js, supprimer le cache généré avec rm -rf .next, puis exécuter npx tsc --noEmit, npx vitest run et npm run build. Cette suppression est destinée uniquement aux fichiers générés, pas aux sources.
- Les contrôles précédents montrent 41 tests réussis ; ils ne valident pas encore le correctif présent. Aucun test navigateur ni mutation Supabase réelle n'a été effectué.
- Les modifications restent sur feat/mobile-first-natural-redesign. Aucun merge dans main. L'espace partenaire /espace demeure bloqué jusqu'à la validation complète du back-office.


## Journal de développement — 3 novembre 2026 (métadonnées dynamiques des boutiques)

- Le propriétaire a signalé l'erreur Next.js `blocking-prerender-metadata-runtime` sur `/p/[partner]/devenir-partenaire`. La fonction `generateMetadata()` lit `params.partner` pour préserver les règles SEO distinctes entre la boutique maison et les boutiques partenaires.
- Le correctif choisi est le marqueur dynamique officiel : un composant serveur dédié appelle `connection()` et est placé dans une frontière `<Suspense>` dans le layout partagé. Le contenu visuel existant reste hors de cette frontière ; elle ne remplace ni n'enveloppe le corps de page. Les métadonnées conditionnelles (Yekola indexable, partenaires `noindex, follow` avec canonical maison) sont conservées.
- Le choix dynamique est volontaire : remplacer ces métadonnées par un objet statique unique risquerait d'appliquer la mauvaise règle d'indexation à l'une des catégories de boutiques.
- **Validation navigateur non effectuée dans cette session** : aucun navigateur pilotable n'est disponible dans l'environnement d'édition GitHub. Après récupération, recharger `/p/yekola/devenir-partenaire` et contrôler le rendu visible ainsi que l'absence de l'Insight ; vérifier également une route sœur du layout, notamment `/p/yekola` et `/p/yekola/catalogue`. Ne pas considérer le correctif comme validé visuellement avant ce contrôle.
- Les contrôles TypeScript, Vitest et build doivent être relancés après récupération. Les changements restent sur `feat/mobile-first-natural-redesign` ; aucun merge dans `main`.


## Journal de développement — 3 novembre 2026 (placement du marqueur de métadonnées)

- Le premier essai avait placé `DynamicMarker` dans le layout partagé `src/app/p/[partner]/layout.tsx`. Le navigateur du propriétaire a montré que l'Insight `blocking-prerender-metadata-runtime` persistait sur `generateMetadata()` de ce layout.
- Relecture du guide officiel : le pattern « Mark the route as dynamic » demande un composant serveur qui appelle `await connection()`, rendu dans une frontière `<Suspense>` **dans le corps de la page concernée**. Le marqueur a donc été déplacé vers `src/app/p/[partner]/devenir-partenaire/page.tsx`. Le contenu principal reste directement dans le shell ; seule la sortie nulle du marqueur est sous `<Suspense>`.
- Le marqueur mal placé a été retiré du layout partagé. Aucun changement aux règles SEO de `generateMetadata()` (boutique maison indexable ; partenaires `noindex, follow` avec canonical maison).
- **Limite de validation :** aucun navigateur local pilotable n'est disponible depuis cette session. Il faut récupérer les commits, redémarrer le serveur Next, recharger `/p/yekola/devenir-partenaire` et confirmer que l'Insight disparaît et que le contenu est visible. Puis exécuter TypeScript, Vitest et build. Le rendu visuel n'est pas déclaré vérifié.
- Seule la route signalée a été ciblée. Si le même Insight apparaît sur une autre route enfant du layout, appliquer le pattern à cette page précise après confirmation, sans envelopper tout son contenu dans `<Suspense>`.

## Journal de développement — 3 novembre 2026 (rendu dynamique et Suspense du back-office)

- À partir des logs Next.js 16.4.3, deux erreurs distinctes ont été isolées : `Date.now()` pendant le prérendu de `/admin` et `/admin/boutiques`, puis lecture de `searchParams` hors de `<Suspense>` sur `/admin/boutiques/nouvelle`.
- `/admin` appelle désormais `await connection()` avant l'authentification et les lectures Supabase. Le tableau de bord est rendu à la requête, ce qui correspond à sa nature privée et personnalisée.
- `/admin/boutiques` place le composant qui lit `searchParams` sous une frontière `<Suspense>` et utilise également `connection()` avant l'accès à la session et aux données. Le shell de chargement reste limité à cette page.
- `/admin/boutiques/nouvelle` place également la lecture de `searchParams` sous `<Suspense>`. La page vérifie désormais explicitement `requireAdmin()` côté serveur avant d'afficher le formulaire, y compris en accès direct par URL.
- Modifications poussées sur `feat/mobile-first-natural-redesign` : `d1fb1332`, `f570552c`, `73b2b2da`. Aucun merge dans `main`.
- **Validation non effectuée depuis l'environnement GitHub.** Après récupération locale, arrêter le serveur, exécuter `rm -rf .next`, redémarrer `npm run dev`, puis recharger `/admin`, `/admin/boutiques` et `/admin/boutiques/nouvelle`. Vérifier que les deux erreurs signalées ont disparu, que l'accès direct à la création redirige un non-admin et que le formulaire reste visible pour l'administrateur.
- Relancer ensuite `npx tsc --noEmit`, `npx vitest run` et `npm run build`. Aucun résultat de test n'est présumé ni déclaré réussi. L'espace partenaire `/espace` reste bloqué jusqu'à la livraison et validation complète du back-office.

## Journal de développement — 3 novembre 2026 (stabilisation Suspense et refonte mobile premium du back-office)

- Le propriétaire a remonté l'Insight `blocking-prerender-dynamic` sur `/admin` après l'ajout de `connection()`. La cause était l'absence d'une frontière `<Suspense>` au-dessus de l'appel. La page `/admin` est maintenant un composant synchrone qui place le composant serveur asynchrone `AdminDashboard` (appelant `connection()`, puis `requireAdmin()` et les requêtes Supabase) sous `<Suspense>`. Le fallback affiche une structure de chargement de l'application.
- La page `/admin/boutiques` conserve son composant asynchrone sous `<Suspense>` ; `/admin/boutiques/nouvelle` conserve la lecture de `searchParams` et la vérification `requireAdmin()` dans le sous-arbre suspendu.
- Refonte responsive : création de `src/app/admin/admin-shell.tsx` avec identité visuelle Yekola Shop, navigation desktop et barre de navigation mobile fixe, prise en compte de la zone de sécurité iOS, surfaces claires et accents vert profond.
- Refonte du tableau de bord : panneau d'accueil, indicateurs hiérarchisés, cartes boutiques adaptées au tactile et affichage responsive.
- Refonte de `/admin/boutiques` : cartes de boutiques sur mobile, tableau sur écran large, boutons tactiles et statuts plus lisibles.
- Refonte du formulaire de création : champs hauts et tactiles, regroupement des informations, contraste et actions adaptées aux petits écrans. Le flux métier et les validations existantes sont conservés.
- Le composant de déconnexion propose désormais une présentation compacte pour la barre mobile. Tous les changements restent sur `feat/mobile-first-natural-redesign`; aucun merge dans `main`.
- Commits du lot : `b2550692`, `714d3769`, `23007ee7`, `c0c84dc5`, `80641d4a`, `fb46116f`, `472b27c6`.
- **Non vérifié à ce stade :** aucune exécution locale de TypeScript, Vitest, build ni inspection navigateur n'a été faite par l'assistant. Après récupération, exécuter les contrôles et vérifier `/admin`, `/admin/boutiques` et `/admin/boutiques/nouvelle` en largeur mobile (environ 390 px) et desktop. Confirmer notamment l'absence de `blocking-prerender-dynamic`, la visibilité du shell, la barre mobile et l'absence de débordement horizontal.
- Ne pas démarrer l'espace partenaire `/espace` avant validation complète du back-office par le propriétaire.


## Journal de développement — 3 novembre 2026 (première passe mobile-first de la boutique publique)

- Le propriétaire confirme que l'expérience principale doit être conçue pour les smartphones, en tenant compte d'une audience majoritairement mobile en Afrique. Le chiffre de 83 % est une hypothèse d'audience communiquée par le propriétaire, pas une mesure analytique vérifiée dans ce dépôt.
- Ajout de `src/components/layout/MobileShopNav.tsx` : barre de navigation mobile persistante avec Accueil, Catalogue, Packs et Panier, état actif, compteur de panier après hydratation et respect de la zone de sécurité.
- Le header mobile a été simplifié : marque de la boutique, accès rapide à la recherche/catalogue et panier. La navigation complète reste disponible sur desktop ; la barre mobile devient le moyen principal de navigation au pouce.
- Le layout public des boutiques monte cette navigation, réserve de l'espace sous le contenu et garde la barre hors de la zone de lecture. Le pied de page reçoit également une marge basse mobile pour ne pas être masqué.
- Le bouton WhatsApp flottant est positionné au-dessus de la barre mobile. Il continue d'utiliser le numéro de la boutique active via `ShopContext`, sans numéro global ni mélange entre partenaires. Les offsets et espacements du contenu/footer utilisent la zone de sécurité du terminal.
- Le lien WhatsApp accepte désormais un libellé accessible `aria-label`, utilisé par le bouton flottant.
- Les cartes produits, le catalogue, le panier et le formulaire de commande existants ont été audités à la lecture. Ils comportent déjà des éléments tactiles et une grille mobile à deux colonnes ; ils nécessitent encore une vérification réelle sur petits écrans et des tests de parcours complets.
- **Validation non effectuée dans cette session :** aucune exécution locale de TypeScript, Vitest, build ou navigateur n'a été possible depuis l'édition GitHub. Le propriétaire doit récupérer les commits, vérifier le rendu à 320/360/390/430 px et sur desktop, puis exécuter les contrôles du dépôt.
- **Prochaine étape UX :** tester l'ensemble du parcours Accueil → recherche/filtre → fiche produit → panier → formulaire → WhatsApp, contrôler les performances sur réseau lent et corriger les irritants observés avant d'étendre les changements aux autres pages publiques.
- Les modifications restent sur `feat/mobile-first-natural-redesign`. Aucun merge dans `main`. Le chantier back-office garde sa priorité de validation ; l'espace partenaire `/espace` ne démarre pas avant cette validation.


## Direction artistique Yekola Business — 3 novembre 2026 (brief validé)

- Nouvelle charte officielle fournie par le propriétaire : orange solaire `#F9A825`, orange vif `#FF6A1A`, orange profond `#C1440E`, ivoire `#FFF9F3`. Dégradé principal de `#F9A825` vers `#C1440E`.
- Typographies de marque : Montserrat pour titres et accents, Poppins pour le corps. Conserver des solutions de repli locales/système afin de ne pas bloquer le rendu sur connexion lente.
- **Logo Yekola Business fourni : intouchable.** Ne pas redessiner, recolorer, retaper, vectoriser, déformer ni altérer le ratio. Réutiliser le visuel original tel quel. La version « icon only » fournie dans la planche sert aux petites surfaces (favicon / icône PWA) sans recréer le symbole.
- La marque Yekola Business remplace l'ancienne direction vert forêt / ivoire / or dans la boutique. Tous les composants publics (header, navigation mobile, boutons, badges, cartes, hero, footer, états vides, focus) devront être harmonisés à cette charte ; préserver le contraste et la lisibilité.
- Sur une boutique partenaire, afficher au-dessus du header un message de bienvenue explicite : « Bienvenue dans la boutique de [nom du partenaire] ». Le nom doit venir du profil partenaire actif, jamais d'une valeur codée en dur. Ne pas afficher cette formule sur la boutique maison sauf demande ultérieure.
- Le hero doit agrandir visuellement le visuel du pack sans augmenter artificiellement la hauteur de la section ; privilégier un cadrage `object-contain` et une mise à l'échelle interne dans un conteneur de dimensions stables.
- Remplacer la mise en avant statique d'un seul pack par un carrousel horizontal « Nos offres du moment », prioritairement alimenté par les références ayant une promotion réelle (prix barré / badge promo) puis par les packs ou sélections réellement disponibles. Ne jamais inventer une remise, une urgence ou une date de fin.
- Ajouter l'onglet « Nos offres » dans les navigations mobile et desktop, ainsi qu'une page boutique dédiée `/offres`. Les offres doivent être filtrables/consultables au toucher, sans dépendance à un carrousel lourd.
- Mobile-first renforcé : réduire les espaces verticaux excessifs sur mobile, préserver les zones tactiles, la navigation au pouce et les safe areas. Ne pas agrandir le hero pour compenser un visuel trop petit.
- Vérification obligatoire après intégration : 320/360/390/430 px, desktop, parcours offre → produit → panier → WhatsApp, isolation des données partenaire, accessibilité clavier et réduction des animations.
- Les actifs de marque doivent être utilisés pour favicon, icône d'installation et PWA. Les formats/tailles requis doivent être produits à partir du logo source sans retoucher le dessin ; si un format binaire ne peut pas être généré via l'édition GitHub, documenter cette limite et demander un commit local plutôt que fabriquer une version approximative.

### Journal — refonte Yekola Business
- Brief visuel source : planche « Yekola Business » fournie le 3 novembre 2026.
- Priorité : appliquer la nouvelle identité visuelle et améliorer le parcours d'achat mobile. Cette évolution ne change pas les règles de prix, de commandes WhatsApp ni l'isolation multi-boutiques.
- Tests locaux et vérification visuelle non exécutés par l'assistant ; validation par le propriétaire requise avant de considérer cette refonte comme terminée.

## Journal de développement — 3 novembre 2026 (reprise du brief hero, offres et identité visuelle)

- Reprise du brief existant : la charte Yekola Business orange/ivoire, les polices Montserrat/Poppins, l'interdiction absolue de modifier le logo, l'agrandissement interne du visuel du hero, le carrousel d'offres, le message de bienvenue partenaire et les exigences mobile-first restent les références.
- Audit du code sur `feat/mobile-first-natural-redesign` : la page `/offres`, l'onglet mobile « Offres », le lien desktop « Nos offres », le composant `OffersCarousel` et `PartnerWelcomeBar` existent déjà. Le message de bienvenue utilise bien le nom du partenaire actif et ne s'affiche pas sur la boutique maison.
- Le hero affiche encore une seule carte produit compacte ; c'est le point d'interface prioritaire à remplacer/faire évoluer. La palette orange/ivoire et les polices de la charte sont déjà présentes dans `globals.css` et le layout, mais plusieurs composants ont encore des couleurs écrites en dur : harmonisation à poursuivre.
- Aucun fichier logo source ni icône favicon/PWA de marque n'a pu être localisé parmi les chemins publics habituels du dépôt. Ne pas fabriquer de logo de remplacement et ne pas modifier les fichiers de marque sans disposer du fichier original. L'utilisateur devra joindre à cette conversation le logo original (idéalement PNG transparent ou SVG) et la planche de charte si elle n'est pas déjà présente dans le dépôt.
- Le travail doit conserver les règles multi-boutiques, les liens via `ShopLink`, les numéros WhatsApp propres à chaque partenaire et les offres réelles issues du catalogue. Aucune remise, urgence ou date de fin ne doit être inventée.
- Validation locale et visuelle non effectuée depuis GitHub. Après récupération, exécuter TypeScript, Vitest et build, puis vérifier 320/360/390/430 px et desktop. Aucun merge dans `main`.

### Mise en œuvre — 3 novembre 2026

- Création de `src/components/home/HeroOffersCarousel.tsx` : carrousel tactile dans le hero, avec image agrandie à l'intérieur d'un conteneur de hauteur stable, prix, badge réel et navigation par balayage sur mobile / flèches sur desktop. Les indicateurs suivent la diapositive active.
- Mise à jour de `src/components/home/Hero.tsx` : le visuel produit unique est remplacé par les promotions réelles du catalogue ; en l'absence de promotions, le carrousel utilise les packs et meilleures ventes disponibles. Le hero mobile réduit ses espacements sans augmenter la hauteur pour agrandir le visuel.
- Mise à jour de `src/app/p/[partner]/page.tsx` : suppression du carrousel d'offres dupliqué sous le hero ; la mise en avant est désormais intégrée au hero. La page dédiée `/offres` et les onglets de navigation existants sont conservés.
- Le bandeau de bienvenue partenaire et la page dédiée « Nos offres du moment » étaient déjà présents ; ils ont été vérifiés à la lecture et conservés. Le bandeau utilise le nom du partenaire actif et reste masqué pour la boutique maison.
- Palette de marque existante : orange solaire `#F9A825`, orange vif `#FF6A1A`, orange profond `#C1440E`, ivoire `#FFF9F3` ; polices Montserrat/Poppins. Harmonisation visuelle complémentaire à poursuivre après contrôle des écrans.
- **Blocage des actifs de marque :** le logo original et sa déclinaison icon-only ne sont pas présents dans les chemins publics vérifiés. Aucun favicon ni icône PWA ne sera inventé. Demander à l'utilisateur de joindre le logo original et la planche de charte dans la conversation pour pouvoir les installer à l'identique.
- Modifications poussées sur `feat/mobile-first-natural-redesign`. Aucune validation TypeScript/Vitest/build ni inspection navigateur n'a été exécutée depuis GitHub. Le propriétaire doit récupérer les changements et lancer les contrôles locaux avant validation. Aucun merge dans `main`.


## État effectif après mise en œuvre — 3 novembre 2026

- **Hero mobile :** le composant actif est `HeroOffersCarousel` intégré directement au hero. Il donne priorité aux promotions réelles (prix comparé supérieur au prix actif) ; s'il n'y en a pas, il affiche les packs/meilleures ventes réellement présents. Le visuel produit est agrandi par mise à l'échelle interne dans un conteneur fixe ; la hauteur du hero reste compacte. Les interactions sont tactiles sur mobile et des flèches sont disponibles sur écran plus large.
- **Offres :** page dédiée `/offres`, onglet « Nos offres » dans la navigation desktop et « Offres » dans la barre inférieure mobile. Le pied de page inclut aussi ce lien. Les réductions ne sont jamais inventées. Le carrousel de doublon hors du hero a été supprimé pour éviter de répéter la même section.
- **Accueil partenaire :** `PartnerWelcomeBar` affiche « Bienvenue dans la boutique de [nom] » au-dessus de l'en-tête, à partir de `partner.displayName`. Le bandeau ne s'affiche pas sur la boutique maison.
- **Charte :** variables globales et composants principaux harmonisés sur `#F9A825`, `#FF6A1A`, `#C1440E`, `#FFF9F3`, dégradé orange et typographies Montserrat/Poppins. Header, navigation mobile, hero, garanties, sélecteur de besoins, cartes produits, fiche produit, panier, actions d'ajout, pied de page et boutons de conversion ont été harmonisés. Le vert WhatsApp reste conservé uniquement pour identifier ce canal de communication.
- **Logo :** le lockup primaire fourni est utilisé sur la boutique maison ; la déclinaison « icon only » fournie sert au favicon et aux icônes PWA. Les fichiers SVG encapsulent les visuels issus de la planche fournie ; aucun symbole n'a été redessiné ni recoloré. Le canevas de l'icône PWA est carré pour la compatibilité d'installation.
- **PWA :** manifeste racine pour la boutique maison et manifeste dynamique `/p/[partner]/manifest.webmanifest` pour que l'installation d'une boutique partenaire ouvre son propre lien. Couleurs de thème et de fond alignées à la marque.
- **Mobile :** navigation à cinq entrées, safe areas, espacements réduits dans le hero et les sections hautes, défilement horizontal avec snap pour les offres. Le parcours garde les routes `ShopLink` et les coordonnées WhatsApp propres à chaque boutique.
- **Limite connue :** l'icône fournie est un SVG contenant le visuel raster issu de la planche. Une icône Apple dédiée PNG et les déclinaisons PNG 192/512 px pourront être ajoutées si l'installation iOS/Android sur appareils réels les exige ; ne pas recréer le logo pour les produire.
- **Validation :** les fichiers ont été édités via GitHub. TypeScript, Vitest, build et inspection navigateur ne sont pas exécutés dans cette session. Il faut valider localement, surtout les polices `next/font/google`, les manifests et les dimensions 320/360/390/430 px. Aucun merge dans `main`.

## Correctifs UX — carrousel et harmonisation des pages (3 novembre 2026)

- Retour utilisateur : le carrousel ne tournait pas automatiquement et la carte était trop petite. Correctif : `HeroOffersCarousel` fait maintenant défiler les offres toutes les 3 secondes, boucle à la fin, expose des contrôles accessibles et des indicateurs cliquables. La rotation se suspend au survol, au focus et pendant le toucher ; elle respecte `prefers-reduced-motion`.
- Les cartes du carrousel ont désormais un ratio carré sur mobile avec visuel produit occupant la surface principale en `object-contain`, et une zone d'information contrastée en bas. Sur desktop, le format passe en paysage. Les dimensions restent indépendantes de la hauteur du hero.
- Les anciennes couleurs vertes ont été retirées des pages partenaires `/besoins` et `/devenir-partenaire`, au profit des couleurs orange/ivoire de la charte Yekola Business. Les états actifs, boutons, textes, fonds, bordures et skeletons concernés ont été harmonisés.
- Vérification par recherche de chaînes dans le dépôt : les anciennes teintes exactes `#173f35`, `#315d47`, `#edf1e9` ne sont plus retrouvées. Cela ne remplace pas une inspection visuelle de toutes les pages.
- Modifications poussées sur `feat/mobile-first-natural-redesign`. **TypeScript, Vitest, build et navigateur non exécutés par l'assistant** ; validation locale nécessaire, notamment pour la rotation à 3 secondes, le rendu des images carrées, le tactile et les largeurs 320/360/390/430 px. Aucun merge dans `main`.

## Ajustements UX — bandeau d'informations et bouton panier (3 novembre 2026)

- Sur mobile, le bandeau « Informations pratiques » sous le hero affiche désormais les quatre icônes sur une seule rangée compacte. Les intitulés et descriptions sont visuellement masqués sur petit écran mais restent accessibles aux technologies d'assistance ; ils réapparaissent à partir du breakpoint tablette.
- Le bouton « Confirmer ma commande sur WhatsApp » du panier utilise maintenant l'orange profond de la charte Yekola Business (#C1440E), avec un état hover plus sombre et un contour de focus assorti. Le vert WhatsApp n'est plus utilisé comme couleur de fond de ce bouton.
- Fichiers modifiés : `src/components/home/TrustBand.tsx` et `src/components/cart/CheckoutForm.tsx`.
- Commits sur `feat/mobile-first-natural-redesign` : `10dfc2a2` et `619c7eeb`. Aucun merge dans `main`.
- Validation locale non effectuée depuis cette session GitHub : après récupération, vérifier le bandeau à 320/360/390 px et sur desktop, puis confirmer la couleur du bouton dans le panier. Exécuter `npx tsc --noEmit`, `npx vitest run` et `npm run build`. Aucun résultat de test n'est présumé.

## Refonte de la fiche produit — 3 novembre 2026

- La fiche produit utilise désormais une grille à deux colonnes sur grand écran : galerie média à gauche, informations et actions d'achat à droite. Sur mobile, les blocs s'empilent naturellement sans réduire la zone utile de lecture.
- Galerie : ratio vertical 4:5, image principale en `object-contain`, badge Bestseller conditionnel, commande d'agrandissement en plein écran, navigation précédente/suivante et cinq vignettes carrées visibles avec état actif.
- Bloc d'achat : catégorie et référence en sur-titre, titre serif, description courte, prix public/promotionnel et prix client privilégié issus du catalogue, points forts issus exclusivement des données produit, composition des packs, informations d'utilisation et de durée si renseignées.
- Quantité et actions : stepper tactile, total calculé, bouton principal « Ajouter au panier » orange de marque et action secondaire WhatsApp conservant le vert comme code du canal. Les liens et numéros restent résolus via la boutique active.
- Rassurance : conseils personnalisés, paiement mobile et livraison selon la zone.
- Les éléments propres à la maquette de jardinerie (tailles de pots, guide de tailles, avis/notes clients, « pet friendly », « air purifying », livraison gratuite et garantie 30 jours) ne sont pas repris : ces données ne figurent pas dans le modèle produit et ne doivent pas être inventées pour les produits Forever.
- Fichiers modifiés : `ProductDetail.tsx`, `ProductImageGallery.tsx`, `ProductActions.tsx`, `ProductAccordion.tsx`. Commits : `757f97d2`, `3c0d3502`, `c88ada92`, `1123123f`.
- Validation locale non effectuée depuis cette session GitHub : récupérer la branche, lancer TypeScript, Vitest et build, puis tester la galerie (y compris plein écran/échappement), l'ajout au panier, la commande WhatsApp et le rendu à 320/360/390/430 px et desktop. Aucun test n'est déclaré réussi. Aucun merge dans `main`.
- Correctif complémentaire : la navigation clavier de l'aperçu plein écran (Échap, flèches gauche/droite) utilise désormais directement les mises à jour d'état dans l'effet, sans dépendances de fonctions recréées à chaque rendu. Commit : `45c495fb`.


## Correctifs fiche produit et état vide du panier — 4 novembre 2026

- Galerie produit mobile compactée : l'image principale reste visible dans un bloc de hauteur maîtrisée (jusqu'à 300 px), afin de laisser apparaître dès le chargement le nom, la description et le prix sans imposer un long défilement.
- Les vignettes sont maintenant intégrées en bas de la zone image et restent visibles même lorsqu'une seule image est renseignée (une vignette réelle, sans duplication artificielle). Jusqu'à cinq vignettes sont affichées ; les photos défilent automatiquement toutes les 4 secondes, avec navigation manuelle et arrêt de la rotation en plein écran. La préférence système « réduire les animations » désactive la rotation.
- La description catalogue est désormais identifiée explicitement par le titre « Description » et placée juste sous le nom du produit, avant le prix. Les espacements et tailles typographiques mobiles ont été resserrés.
- Correction de l'état panier vide : suppression des dernières couleurs vertes (titre, icône, texte, surface, bordures et bouton) au profit de la palette orange/ivoire Yekola Business. Les autres informations de récapitulatif du panier ont également été harmonisées.
- Fichiers modifiés : `ProductImageGallery.tsx`, `ProductDetail.tsx`, `CartPageContent.tsx`.
- Commits : `fdb4e205`, `76c76c5e`, `abc14aad`. Changements conservés sur `feat/mobile-first-natural-redesign` ; aucun merge dans `main`.
- **Validation à effectuer localement :** `npx tsc --noEmit`, `npx vitest run`, `npm run build`, puis contrôle visuel à 320/360/390/430 px. Vérifier la rotation 4 s, la présence des vignettes avec 1 et plusieurs images, la description et le prix dans le premier écran, ainsi que l'état vide après avoir vidé le panier. Aucun résultat de test ni contrôle navigateur n'est présumé.


## Correctif d'affichage des vignettes produit — 4 novembre 2026

- Retour sur la galerie après signalement utilisateur : l'intégration des vignettes en superposition dans la zone image ne garantissait pas une visibilité suffisante sur mobile.
- Les vignettes sont désormais rendues dans une rangée distincte, immédiatement sous l'image principale, hors du conteneur avec débordement masqué. Elles ne peuvent donc plus être recouvertes par la photo principale.
- Rangée responsive en grille de cinq colonnes, avec état actif orange, compteur de photos et boutons accessibles. Les cinq premières images sont visibles ; la navigation par flèches et la rotation automatique de 4 secondes continuent de parcourir la galerie.
- Ajout d'un sélecteur stable `data-testid="product-thumbnails"` pour faciliter les tests automatisés.
- Fichier modifié : `src/components/product/ProductImageGallery.tsx`.
- Commit : `a175a1d3`, toujours sur `feat/mobile-first-natural-redesign`, sans fusion dans `main`.
- Validation à effectuer : TypeScript, tests, build et contrôle navigateur mobile. Si aucune vignette ne s'affiche après ce changement, vérifier le contenu réel de `products.images` dans Supabase : la galerie ne peut présenter que les images réellement enregistrées pour ce produit.
