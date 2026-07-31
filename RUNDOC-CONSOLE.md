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

## 1bis. Lot precedent

**Lot 11a, liste des partenaires TERMINE (CSM-2).**

Route `/partenaires` rendue dans l'application reelle. `0.1.8` installee,
typecheck 0 erreur, `npm run build -w apps/console` **reussi** (5 routes,
`/partenaires` en statique), capture comparee a `backoffice/pages/partenaires.html` :
5 Organisations avec leurs vraies valeurs, plan-tags Free gris / Pro indigo /
Business noir, colonne « Actifs » en ambre a la limite, badge de suspension date,
note de signalement croisee, toolbar en ligne. Conforme.

`StatusBadge` etendu aux statuts d'Organisation dans le design system, publie en
`0.1.8` (lot Q du RUNDOC design system).

Trois ecarts constates a la premiere capture et corriges **dans le consommateur**,
car ils venaient de mon appel et non du composant :
- initiales « S » au lieu de « ST » : `Avatar` derive les initiales par mot ;
  la prop `fallback` existait pour ca, elle est desormais utilisee ;
- plan-tag Business sans son noir plein : rendu par roles de surface
  (`bg-text-primary text-surface-card`), aucune couleur litterale ;
- toolbar sur trois lignes : bornee (`max-w-sm` sur la recherche, `w-44` sur les
  filtres). Le `Select` du design system est `w-full` par conception, adapte aux
  formulaires : il est borne au point d'appel, pas modifie.

**Lot 11b non ouvert** : fiche Organisation `/partenaires/[slug]`, modale de
suspension, vue « en tant que » (CSM-5). Necessite **PlanMeter**, a creer dans le
design system.

## 1bis. Lot precedent

**Lot Dashboard plateforme TERMINE (CSM-1).**

Ecran 10 rendu dans l'application reelle. `0.1.7` installee, typecheck 0 erreur,
`npm run build -w apps/console` **reussi** (4 routes, `/` en statique), capture de
`http://localhost:3000/` comparee a `backoffice/pages/console-dashboard.html` :
4 tuiles, tendance 30 jours avec pics, panneaux Moderation et Nouveaux
partenaires, compteurs de nav 128 et 3. Conforme.

Le **marqueur d'item actif est enfin observable** sur « Plateforme » : `/`
correspond desormais a un item de la nav.

Donnees fictives du prototype, aucun appel API. Le backend est un chantier separe
(CdC §9.4, depot `eventflow-api`).

**Defaut du design system corrige en cours de lot** : `'use client'` etait retire
par tsup a la publication, les 25 composants interactifs etaient donc inutilisables
depuis une page serveur. Corrige et publie en `0.1.7`. Voir le RUNDOC du design
system, journal du 2026-07-31.

## 1bis. Lot precedent

**Lot Shell Maitre TERMINE, etapes 1 a 12.**

Toute la chaine est validee de bout en bout, pour la premiere fois :
`0.1.4` publiee et installee, `master` expose par le paquet,
`npx tsc -p apps/console --noEmit` renvoie **0 erreur**, et
`npm run build -w apps/console` **reussit** (4 routes generees).

Le shell Maitre est monte et rendu dans l'application reelle. Capture headless
sur `http://localhost:3000` comparee a `backoffice/pages/shell.html?console=master` :
lisere ambre en haut du viewport, badge mono « CONSOLE MAITRE » sous la marque,
sections Plateforme et Controle avec leurs 4 items et leurs icones. Conforme.

Aucun composant ecrit dans `apps/console` : la coquille vit dans
`packages/shell/master-shell.tsx`, composee depuis le design system publie.

## 1bis. Ce qui reste a cabler, hors lot

- Compteurs de nav (`partnerCount`, `moderationCount`) : props presentes sur
  `MasterShell`, non alimentees. Elles viendront de l'API (CSM-2, CSM-3).
- Marqueur d'item actif non observable tant qu'aucune route du groupe `(app)`
  n'existe : `activeHref` vaut le chemin courant, et le registry est vide.
  Il s'affichera des la premiere route reelle, ecran 10.

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
  verifie par `ls`. Publication non effectuee, voir defaut ouvert 1.

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
- **Lot Partenaires**, ecran 11, exigences CSM-2 et CSM-5.
- **Lot Moderation**, ecran 12, exigence CSM-3.
- **Lot Audit**, ecran 13, exigence CSM-4.
- **Lot Etats systeme**, ecran 9, gabarits vide, erreur, skeletons.

Ecrans 2 a 8 : cible `apps/partner`, application absente de ce depot. Hors perimetre.

## 4. Fichiers en cours

### Design system, modifies et non commites

| Chemin | Modification |
|---|---|
| `eventflow-design-system/tsup.config.ts` | ligne 53, `clean: true` remplace par `clean: false` plus commentaire d'explication |
| `eventflow-design-system/package.json` | ajout du script `prebuild` qui vide `dist` avant `tsup` |

### Monorepo, aucun fichier applicatif modifie

| Chemin | Role |
|---|---|
| `apps/console/app/layout.tsx` | layout racine |
| `apps/console/app/globals.css` | importe `tokens.css` et `styles.css` du design system |
| `apps/console/app/page.tsx` | redirige vers `/login`, registry vide |
| `apps/console/app/login/page.tsx` | monte `AuthPage` depuis `@ef/shell` |
| `apps/console/app/(app)/layout.tsx` | groupe applicatif, sans route enfant |
| `apps/console/app/api/auth/[...nextauth]/route.ts` | route NextAuth |
| `apps/console/registry.ts` | tableau vide, genere par `gen:register` |
| `apps/console/modules.json` | `modules: []` |
| `apps/console/tailwind.config.ts` | presets design system puis interne, porte l'erreur TS7016 |
| `package.json` racine | plage `^0.1.1`, **non alignee**, voir defaut ouvert 2 |

## 5. Commandes de verification

| Commande | Resultat reel |
|---|---|
| `git diff tsup.config.ts package.json` | 2 fichiers, 6 insertions, 1 suppression |
| `npm run build` du design system, run complet | `Done in 1694ms`, aucune erreur |
| `ls -la dist/preset*` apres run complet | `preset.d.ts` **present, 6835 octets**, plus `.d.cts`, `.js`, `.cjs`, `.map` |
| `ls dist/components/*/index.d.ts` | 36 fichiers |
| `ls dist/components/*/index.js` | 36 fichiers |
| `ls dist/index.d.ts dist/index.js dist/styles.css dist/tokens.css` | les 4 presents |
| `npm test` du design system | **36 fichiers, 123 tests, tous passes**, duree 47 s |
| `npm run typecheck` du design system | **2 erreurs TS2322**, `src/components/auth-layout/auth-layout.stories.tsx` lignes 37 et 67 |
| `npx tsc --noEmit` avec mes modifs mises de cote | **2 erreurs**, identiques : les erreurs preexistent a la correction |
| `git diff --name-only` | `package.json`, `tsup.config.ts` seulement, aucune story modifiee |
| `npm view @rwtechnology/eventflow-design-system version` | `E401 Unauthorized`, registre inaccessible |
| `gh run list` | `HTTP 404: Not Found`, pas d'acces API au depot prive |
| `grep Typecheck .github/workflows/publish.yml` | etape ligne 28, `npm run typecheck`, avant `Build` et `Publish` |
| `npx tsc -p apps/console --noEmit` | **1 erreur TS7016** sur le sous-chemin `preset`, etat inchange |
| version publiee du design system | `0.1.2`, **non bumpee**, aucun tag `v0.1.3` cree |
| `npm run build -w apps/console` | NON EXECUTE |
| `npm run lint` du monorepo | NON EXECUTE |

## 6. Defauts ouverts

1. **RESOLU. `preset.d.ts` absent du paquet publie `0.1.2`.**
   `tsup.config.ts` declarait deux blocs dans le meme run : le bloc 1 portait
   `clean: true`, le bloc 2 `clean: false`. Le `clean` du bloc 1 effacait le
   `dist/preset.d.ts` emis par le bloc 2. Corrige dans `a4b03c8` : `clean: false`
   sur le bloc 1 plus un script `prebuild` qui vide `dist`.
   Verifie apres publication et installation de `0.1.3` : `dist/preset.d.ts`
   present dans le paquet installe, `npx tsc -p apps/console --noEmit` renvoie
   0 erreur. Defaut clos.

2. **2 erreurs de typecheck bloquant la CI. Cause prouvee, corrigee dans
   `ad60c79`.**
   `src/components/auth-layout/auth-layout.stories.tsx` lignes 37 et 67
   declaraient `export const X: Story = { render: () => ... }` sans `args`, alors
   que `AuthLayout` declare `children` requis, ce qui rend `args` obligatoire
   pour `StoryObj<typeof meta>`. Erreur `TS2322`, `Property 'args' is missing`.
   Introduites par `bc6531e`, posterieur au tag `v0.1.2`, donc jamais passees en
   CI. Prouvees preexistantes a la correction `tsup` en mettant celle-ci de cote.
   Corrige par `args: { children: null }` sur les deux stories ; le rendu reste
   porte par `render`. `npm run typecheck` renvoie desormais 0 erreur.

3. **Plages alignees sur `^0.1.3`, installation non effectuee.**
   `package.json` racine et `packages/shell/package.json` declarent desormais
   `^0.1.3`. Le desaccord anterieur, `^0.1.1` contre `^0.1.2`, est resorbe ; sa
   cause d'origine n'a jamais ete prouvee.
   `npm install` n'a pas ete execute depuis cette machine : `GITHUB_TOKEN` est
   absent de l'environnement et `.npmrc` en depend
   (`//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}`). Le compte `gh` porte les
   scopes `gist`, `read:org`, `repo`, `workflow`, sans `read:packages`.
   Tant que l'installation n'a pas eu lieu, `package-lock.json` epingle `0.1.2`
   et `apps/console` conserve son erreur `TS7016`.

4. **Publication non verifiable depuis cette machine.**
   `npm view` renvoie `E401`, `gh run list` renvoie `HTTP 404`. Toute
   publication passe par la CI sur tag et ne peut etre confirmee que par
   l'utilisateur, onglet Actions.

## 7. Statut de conformite des composants, acquis

Etabli en passe 1 par comparaison story contre rendu de maquette. Non requalifie
depuis. Les polices `Inter` et `Space Mono` etaient chargees depuis le reseau
pendant les captures, constate par sonde `document.fonts`.

| Composant | Statut | Ecart |
|---|---|---|
| `Card` | conforme verifie par rendu, polices chargees depuis le reseau | aucun |
| `DataTable` | conforme verifie par rendu, polices chargees depuis le reseau | aucun sur la structure. Cellules riches composables par `cell` |
| `Avatar` | conforme verifie par rendu, polices chargees depuis le reseau | aucun |
| `Skeleton` | conforme verifie par rendu, polices chargees depuis le reseau | aucun |
| `EmptyState` | conforme verifie par rendu, polices chargees depuis le reseau | aucun |
| `Sidebar` | a corriger dans le design system | marqueur actif en `border-l` colle au bord ; la maquette pose une barre 2 px detachee, `left: -8px`, `top: 8px`, `bottom: 8px`, `radius-full`. Compteur `trailing` sans fond `primary-100` sur item actif |
| `Badge` | a corriger dans le design system | les 6 badges de cycle de vie `draft live full done cancel archived` non couverts comme jeu nomme |
| `StatusBadge` | a corriger dans le design system | expose `ReservationStatus` seulement ; l'ecran 11 exige les statuts d'Organisation |
| `AppShell` | a corriger dans le design system | prop `master` absente, badge ambre et lisere `warning-500` 2 px absents |
| StatCard | a creer dans le design system | 4 tuiles de l'ecran 10 : libelle, valeur, delta mono 30 jours |
| TrendChart | a creer dans le design system | barres 30 jours, pics week-end pleine opacite, autres a 55 pour cent. Rendu SVG pilote par tokens, aucune librairie requise |

## 8. Perimetre non couvert

Distinct des defauts ouverts. Ces points ne sont pas des defauts, ils n'ont pas
ete traites.

- Ecrans 9, 12 et 13 : aucun composant qualifie, hors lot.
- Ecrans 2 a 8 : hors perimetre de `apps/console`.
- `npm run lint` du monorepo et `npm run build -w apps/console` : non executes.
- Correction des 2 stories `auth-layout` : identifiee, non appliquee.

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
