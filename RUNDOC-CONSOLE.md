# RUNDOC-CONSOLE.md, etat du depot eventflow pour apps/console

> Run doc d'etat. Il porte l'etat, pas les exigences. Les exigences sont dans le
> cahier des charges (PDF racine) et les maquettes. Lire ce fichier en debut de
> session, le mettre a jour en fin de lot.
> Modeles repris : `RUNDOC-AUTH.md` (ce depot), `RUNDOC.md` (design system).

## 0. Source de verite de la maquette, acquise

`backoffice/pages/*.html` porte les valeurs visuelles, avec
`backoffice/pages/shell.css` pour les primitives partagees.
`backoffice/Ecran N - *.html` porte les etats, interactions, durees, responsive.
Preuve : les fiches embarquent les rendus par `iframe`, divergence impossible.
`eventflow-prototype` n'est pas un depot git, aucun arbitrage par historique
n'est possible. Point clos, ne pas rouvrir.

## 1. Lot courant

**Lot 11b, fiche Organisation TERMINE (CSM-2). En attente de validation.**

Route `/partenaires/[slug]` rendue dans l'application reelle. `0.1.9` installee,
typecheck 0 erreur, `npm run build -w apps/console` **reussi** (6 routes,
`/partenaires/[slug]` en dynamique), capture comparee a
`backoffice/pages/partenaires.html`, vue fiche : en-tete avec identite, plan-tag
et statut, bloc Activite en 6 paires cle/valeur, 3 `PlanMeter` du plan Free tous
en warning a leur limite, bloc de changement de plan avec sa note. Conforme.

`PlanMeter` cree dans le design system et publie en `0.1.9` (lot R du RUNDOC
design system). Les lignes de la liste menent desormais a la fiche.

Deux ecarts constates a la premiere capture et corriges **dans le consommateur** :
- boutons d'en-tete desalignes, icone soulignee : l'icone etait passee en enfant
  alors que `Button` expose `leftIcon`, qui gere espacement et alignement ;
- premiere ligne d'Activite repliee sur deux lignes : `flex-wrap` remplace par un
  libelle non retrecissable et une valeur alignee a droite.

**Hors perimetre de ce lot, a traiter ensuite** :
- **Lot 11c** : zone sensible, modale de suspension avec confirmation par saisie
  du slug, reactivation.
- **CSM-5**, vue « en tant que » : le bouton est present mais non cable ; le
  bandeau persistant touche le shell, pas cette page.
- Le changement de plan est presente, non applique : il passera par l'API (CSM-2).

## 2. Lots termines

- **Lot Auth** (2026-07-24, `RUNDOC-AUTH.md`). Page `/login` composee depuis
  `@ef/shell`. 4 composants crees : `alert`, `password-input`,
  `password-strength`, `auth-layout`. Version `0.1.2` publiee et installee.
- **Passe de verification 1** (2026-07-30). Source de verite arretee.
  8 composants requalifies par rendu.
- **Passe de verification 2** (2026-07-30). Preuve git declaree impossible.
  Chargement effectif des polices constate. Cause de l'absence de
  `preset.d.ts` prouvee.
- **Correction tsup** (2026-07-30). Conflit de `clean` corrige, build complet
  verifie par `ls`. Publie en `0.1.3`.
- **Lot Shell Maitre** (2026-07-30). Prop `master` sur `AppShell`, marqueur actif
  detache sur `Sidebar`, shell monte dans `apps/console`. `0.1.4`.
- **Lot Dashboard plateforme** (2026-07-31, CSM-1). `StatCard` et `TrendChart`
  crees, route `/`. `0.1.5` puis `0.1.6` (correctif D9), `0.1.7` (correctif
  `'use client'`).
- **Lot 11a, liste des partenaires** (2026-07-31, CSM-2). `StatusBadge` etendu
  aux statuts d'Organisation, route `/partenaires`. `0.1.8`.
- **Lot 11b, fiche Organisation** (2026-07-31, CSM-2). `PlanMeter` cree, route
  `/partenaires/[slug]`. `0.1.9`.

## 3. Lots restants

Perimetre `apps/console` = Console Maitre.

- **Lot 11c, suspension**, ecran 11, exigence CSM-2. **Prochain lot.** Zone
  sensible avec consequences chiffrees, modale de confirmation par saisie du
  slug, reactivation. Tous les composants existent (`Modal`, `Input`, `Button`,
  `Alert`) : aucune intervention design system prevue.
- **Lot CSM-5**, vue « en tant que » : bandeau persistant en lecture seule,
  touche le shell.
- **Lot Moderation**, ecran 12, exigence CSM-3.
- **Lot Audit**, ecran 13, exigence CSM-4.
- **Lot Etats systeme**, ecran 9, gabarits vide, erreur, skeletons.

Ecrans 2 a 8 : cible `apps/partner`, application absente de ce depot. Hors perimetre.

## 4. Etat des fichiers

Aucun fichier en cours de modification. Les depots sont propres, tout est
commite et pousse.

### Routes de `apps/console`

| Chemin | Role |
|---|---|
| `app/layout.tsx` | layout racine |
| `app/globals.css` | importe `tokens.css` et `styles.css` du design system |
| `app/login/page.tsx` | monte `AuthPage` depuis `@ef/shell` |
| `app/(app)/layout.tsx` | monte `MasterShell`, compteurs 128 et 3 |
| `app/(app)/page.tsx` | tableau de bord plateforme, CSM-1 |
| `app/(app)/partenaires/page.tsx` | liste des Organisations, CSM-2 |
| `app/(app)/partenaires/[slug]/page.tsx` | fiche Organisation, CSM-2 |
| `app/api/auth/[...nextauth]/route.ts` | route NextAuth |

Aucune de ces routes ne definit de composant : chacune monte un corps de page
venu de `@ef/shell` (P9).

### Corps de page dans `packages/shell`

| Chemin | Role |
|---|---|
| `master-shell.tsx` | coquille Console Maitre, compose `AppShell` |
| `platform-dashboard.tsx` | ecran 10 |
| `partners-list.tsx` | ecran 11, vue liste |
| `partner-detail.tsx` | ecran 11, vue fiche |
| `auth-page.tsx` | page d'auth, lot Auth |
| `app-shell-layout.tsx` | coquille anterieure au design system, plus montee |

### Configuration

| Chemin | Etat |
|---|---|
| `package.json` racine, `packages/shell/package.json` | tous deux en `^0.1.9` |
| `apps/console/registry.ts`, `modules.json` | vides : la nav Maitre est portee par `MasterShell`, pas par le registry |
| `apps/console/tailwind.config.ts` | presets design system puis interne |

## 5. Commandes de verification

Sorties reelles du dernier lot (11b, 2026-07-31).

| Commande | Resultat reel |
|---|---|
| `npx tsc -p apps/console --noEmit` | **0 erreur** |
| `npm run build -w apps/console` | **reussi**, 6 routes |
| `npm run lint` | 1 erreur preexistante, `packages/shell/auth-page.tsx:167` |
| design system : `npx tsc --noEmit` | 0 erreur |
| design system : `npm test` | **139 tests**, 38 fichiers |
| design system : `npm run build` | 25 composants client, `dist/preset.d.ts` present |
| design system : grep hex dans `src/components` | 0 |
| version installee | `0.1.9`, plages racine et `packages/shell` alignees |
| captures headless comparees aux rendus de maquette | ecrans 1, 10, 11 liste et fiche : conformes |
| `npm run dev:console` | `/`, `/partenaires`, `/partenaires/[slug]`, `/login` : 200 |

## 6. Defauts ouverts

1. **Lint : entite non echappee dans `packages/shell/auth-page.tsx` ligne 167.**
   `react/no-unescaped-entities`. Fichier du lot Auth, jamais touche depuis.
   Non corrige : hors perimetre de chaque lot ouvert depuis. Correction triviale
   (`&rsquo;`), a faire lors d'un passage sur ce fichier.

2. **Publication non verifiable depuis cette machine.**
   `npm view` renvoie `E401` et `gh run list` `HTTP 404` dans l'environnement de
   l'assistant : pas de `GITHUB_TOKEN`. Chaque publication est declenchee par un
   tag pousse, puis confirmee par l'utilisateur qui execute `npm i`. La reussite
   d'une CI n'est jamais affirmee sans cette confirmation.

### Defauts clos, conserves pour memoire

- **`preset.d.ts` absent du paquet publie** (jusqu'a `0.1.2`). Conflit de `clean`
  entre les deux blocs `tsup`. Corrige, publie en `0.1.3`, verifie par `ls` et par
  le typecheck du consommateur.
- **2 erreurs `TS2322` bloquant la CI** (`auth-layout.stories.tsx`). Stories sans
  `args` alors que `children` est requis. Corrige, publie en `0.1.3`.
- **`'use client'` retire a la publication** (jusqu'a `0.1.6`). tsup retirait la
  directive ; les 25 composants interactifs cassaient toute page serveur les
  important. Reinjectee fichier par fichier apres build, publie en `0.1.7`.
- **Desaccord de plages de version** (`^0.1.1` contre `^0.1.2`). Resorbe ; les
  deux plages sont alignees a chaque lot depuis.

## 7. Statut de conformite des composants

Etabli par comparaison story ou page rendue contre rendu de maquette, captures
headless. Les polices `Inter` et `Space Mono` sont chargees depuis le reseau
pendant les captures, constate par sonde `document.fonts`.

| Composant | Statut | Note |
|---|---|---|
| `Card`, `DataTable`, `Avatar`, `Skeleton`, `EmptyState` | conformes | verifies par rendu, passe 1 |
| `Sidebar` | **corrige**, `0.1.4` | marqueur actif en barre detachee 2 px, compteur renforce sur l'actif |
| `AppShell` | **corrige**, `0.1.4` | prop `master` : lisere warning 2 px, badge mono |
| `StatusBadge` | **corrige**, `0.1.8` | `OrganizationStatus` ajoute, extension additive |
| `StatCard` | **cree**, `0.1.5` | 4 tuiles de l'ecran 10 |
| `TrendChart` | **cree**, `0.1.5` puis `0.1.6` | barres SVG pilotees par tokens, aucune librairie |
| `PlanMeter` | **cree**, `0.1.9` | limite de plan, distinct de `CapacityGauge` |
| `Badge` | **ecart ouvert** | les 6 badges de cycle de vie d'evenement (`draft live full done cancel archived`) ne sont pas couverts comme jeu nomme. Non requis par les ecrans livres ; le sera par les ecrans 4 et 6, cible `apps/partner`, hors perimetre de ce depot |

## 8. Perimetre non couvert

Distinct des defauts ouverts : ces points ne sont pas des defauts, ils n'ont pas
ete traites.

- **Ecrans 9, 12, 13** : aucun composant qualifie, hors lot.
- **Ecrans 2 a 8** : cible `apps/partner`, application absente de ce depot.
- **Backend** : aucun appel API. Toutes les pages rendent le jeu fictif du
  prototype. Chantier separe (CdC §9.4, depot `eventflow-api`).
- **Theme sombre et responsive** : les classes sont posees sur toutes les pages
  livrees, aucune capture n'a ete faite pour les verifier.
- **Comportements non cables** : `signIn` sur `/login`, changement de plan sur la
  fiche, bouton « Voir en tant que » (CSM-5).

## 9. Decisions prises

| Decision | Raison |
|---|---|
| `clean: false` sur le bloc 1 plus `prebuild` explicite | le `clean` du bloc 1 effacait le `preset.d.ts` du bloc 2 ; le nettoyage explicite conserve le comportement voulu sans la course entre blocs |
| La presence de `preset.d.ts` est constatee par `ls`, pas par la ligne `DTS` de tsup | la ligne `DTS` s'etait deja revelee trompeuse : elle annonce l'emission, pas la survie du fichier |
| Aucun tag `v0.1.3` cree | `publish.yml` execute `typecheck` avant `publish` ; avec 2 erreurs preexistantes la CI echouerait sans publier. Pousser un tag voue a l'echec serait un faux signal |
| Plage racine non alignee dans cette passe | elle doit viser `^0.1.3`, version non encore publiee |
| Les 2 erreurs de stories ne sont pas corrigees ici | le mandat interdit de modifier les composants et limite la passe au conflit `clean` ; la correction est proposee, pas appliquee |
| Aucun composant ecrit dans `apps/console` | regle 1, tenue depuis le lot Auth |

## 10. Journal

### 2026-07-31, lot 11b, fiche Organisation (CSM-2) clos
- Design system : **PlanMeter** cree (libelle, ratio mono, barre fine, warning a
  la limite, pas de barre si limite nulle). Distinct de `CapacityGauge` qui mesure
  des places d'evenement. 139 tests, publie `v0.1.9`.
- **NOUVEAU** `packages/shell/partner-detail.tsx` : en-tete, Activite, 3
  PlanMeter, changement de plan.
- **NOUVEAU** `apps/console/app/(app)/partenaires/[slug]/page.tsx` : monte la
  fiche, `params` awaite (Next 16).
- `partners-list.tsx` : lignes cliquables vers la fiche.
- Plages alignees sur `^0.1.9`.
- **Verifications reelles** : typecheck **0 erreur** ; build **reussi**, 6 routes ;
  capture conforme apres 2 corrections d'appel ; slug inconnu rend un message
  explicite plutot que les donnees d'une autre Organisation.
- `npm run lint` : seule erreur preexistante dans `auth-page.tsx`.

### 2026-07-31, lot 11a, liste des partenaires (CSM-2) clos
- Design system : `StatusBadge` etendu (`OrganizationStatus`, `EntityStatus`),
  extension additive. 135 tests, publie `v0.1.8`.
- **NOUVEAU** `packages/shell/partners-list.tsx` : table des 5 Organisations,
  toolbar recherche + filtres plan et statut, filtrage en memoire.
- **NOUVEAU** `apps/console/app/(app)/partenaires/page.tsx` : monte la liste (P9).
- Plages alignees sur `^0.1.8`, racine et `packages/shell`.
- **Verifications reelles** : `npx tsc -p apps/console --noEmit` **0 erreur** ;
  `npm run build -w apps/console` **reussi**, 5 routes ; capture comparee a la
  maquette, conforme apres 3 corrections d'appel (initiales, plan-tag Business,
  toolbar).
- `npm run lint` : toujours la seule erreur preexistante dans `auth-page.tsx`.

### 2026-07-31, lot Dashboard plateforme (CSM-1) clos
- **NOUVEAU** `packages/shell/platform-dashboard.tsx` : 4 tuiles `StatCard`,
  `TrendChart` 30 jours, panneaux Moderation et Nouveaux partenaires. Compose a
  100 % depuis le design system publie.
- **NOUVEAU** `apps/console/app/(app)/page.tsx` : monte le tableau de bord (P9).
- **SUPPRIME** `apps/console/app/page.tsx` : il redirigeait vers `/login` faute de
  module enregistre et entrait en conflit de route avec `/` du groupe `(app)`.
- Compteurs de nav cables a 128 et 3 dans `(app)/layout.tsx`.
- **Defaut design system rencontre et corrige** : `npm run build -w apps/console`
  echouait sur `TypeError: c.useState is not a function`. Cause prouvee : tsup
  retire `'use client'` des sources et rien ne la reinjectait ; les 25 composants
  interactifs etaient publies sans elle depuis la premiere version. Corrige par
  une passe `onSuccess` fichier par fichier, publie en `0.1.7`. Plages alignees
  sur `^0.1.7`.
- **Verifications reelles** : `npx tsc -p apps/console --noEmit` **0 erreur** ;
  `npm run build -w apps/console` **reussi**, `/` en statique ; serveur de
  developpement `/` 200 ; capture comparee a `console-dashboard.html`, conforme ;
  marqueur d'item actif desormais visible sur « Plateforme ».
- `npm run lint` : toujours la seule erreur preexistante dans `auth-page.tsx`
  ligne 167, fichier du lot Auth non modifie ici.

### 2026-07-30, etapes 10 a 12, lot Shell Maitre clos
- `0.1.4` installee, `master?: boolean` et `masterLabel` exposes par le paquet.
  Plage de `packages/shell` alignee sur `^0.1.4`.
- **NOUVEAU** `packages/shell/master-shell.tsx` : `MasterShell`, coquille de la
  Console Maitre composee a 100 % depuis le design system. Nav a deux sections,
  compteurs optionnels, navigation par `router.push`, `activeHref` = `pathname`.
- `packages/shell/index.tsx` : export de `MasterShell` et `MasterShellProps`.
- `apps/console/app/(app)/layout.tsx` : monte `MasterShell`. L'ancien
  `AppShellLayout`, anterieur au design system, reste exporte mais n'est plus
  monte par la console.
- **Verifications reelles** : `npx tsc -p apps/console --noEmit` **0 erreur** ;
  `npm run build -w apps/console` **reussi**, 4 routes ; `npm run dev:console`
  demarre, `/login` 200 ; capture headless du shell rendu comparee a la maquette,
  conforme sur les 4 signatures.
- `npm run lint` : 1 erreur `react/no-unescaped-entities` dans
  `packages/shell/auth-page.tsx` ligne 167, fichier du lot Auth non modifie ici.
  Lint cible sur `master-shell.tsx` et `(app)/layout.tsx` : aucune erreur.
- Page temporaire `(app)/verif-shell/` creee pour la capture puis **supprimee**.
  Serveur de developpement arrete. Arbre `(app)` : `layout.tsx` seul.

### 2026-07-30, deblocage et etapes 6 a 9
- Cause de l'echec d'installation identifiee : `.npmrc` lit `${GITHUB_TOKEN}`
  depuis l'environnement, variable non exportee. Un premier essai depuis le
  repertoire parent visait `registry.npmjs.org` faute de `.npmrc` applicable.
  Resolu par l'utilisateur avec un token portant `read:packages`.
- `0.1.3` installee. Constate : version `0.1.3`, lock `0.1.3`,
  `dist/preset.d.ts` present. `npx tsc -p apps/console --noEmit` : **0 erreur**,
  contre 1 auparavant. Defaut `preset.d.ts` clos.
- Etapes 6 a 8 : prop `master` sur `AppShell` (lisere warning 2px, badge mono,
  desktop et tiroir mobile), marqueur actif detache sur `Sidebar`, compteur
  renforce en actif. Story `Maitre`, 3 tests. Valeurs issues des tokens.
  Typecheck 0, 126 tests passes, capture comparee a `pages/shell.html`.
  Commit `0d44705`.
- Etape 9 : version `0.1.4`, commit `1904af2`, `git push origin main`
  (`ad60c79..1904af2`) et `git push origin v0.1.4` (`[new tag]`).
- **NON VERIFIABLE d'ici** : `npm view` renvoie `E401` dans cet environnement.
  La CI `v0.1.4` reste a confirmer par l'utilisateur.

### 2026-07-30, correction des stories et publication 0.1.3
- `args: { children: null }` ajoute aux stories `Connexion` et `Erreur` de
  `auth-layout.stories.tsx`. Cause : `children` requis par `AuthLayout` rend
  `args` obligatoire. Aucun composant modifie.
- Sequence CI rejouee localement : `npm run typecheck` 0 erreur, `npm test`
  36 fichiers et 123 tests passes, `npm run build` termine.
- `ls dist/preset.d.ts` : present, 6835 octets. 36 `.d.ts` composants, `index`,
  `styles.css`, `tokens.css` intacts.
- Version bumpee a `0.1.3`. Commit `ad60c79`.
- `git push origin main` : `bc6531e..ad60c79`. `git push origin v0.1.3` :
  `[new tag] v0.1.3`. Le push du tag declenche `publish.yml`.
- **NON VERIFIABLE d'ici** : `gh run list` renvoie `HTTP 404`, `npm view` renvoie
  `E401`. La reussite de la CI et la publication effective de `0.1.3` restent a
  verifier par l'utilisateur. Aucun resultat de publication invente.

### 2026-07-30, correction tsup
- `clean: true` retire du bloc 1 de `tsup.config.ts`, script `prebuild` ajoute.
- `npm run build` complet : `Done in 1694ms`. `ls dist/preset*` montre
  `preset.d.ts` present, 6835 octets. 36 composants `.d.ts` et `.js` intacts.
- `npm test` : 36 fichiers, 123 tests passes.
- `npm run typecheck` : 2 erreurs `TS2322` dans `auth-layout.stories.tsx`,
  lignes 37 et 67. Prouve preexistantes en mettant mes modifications de cote.
- `publish.yml` execute `typecheck` avant `publish`. Publication de `0.1.3`
  abandonnee en l'etat, aucun tag cree, version laissee a `0.1.2`.
- `npm view` : `E401`. `gh run list` : `HTTP 404`. Registre et CI inaccessibles.
- `npx tsc -p apps/console --noEmit` : toujours 1 erreur `TS7016`, inchangee.
- Trois etiquettes fautives corrigees dans ce RUNDOC, sections 6 et 7.

### 2026-07-30, passes de verification 1 et 2
- Source de verite arretee. 8 composants requalifies : 5 conformes, 3 a corriger.
- Preuve git impossible, prototype hors git. Polices constatees chargees.
- Cause de l'absence de `preset.d.ts` prouvee par isolement du bloc preset.

### 2026-07-24, lot Auth
- Voir `RUNDOC-AUTH.md`.
