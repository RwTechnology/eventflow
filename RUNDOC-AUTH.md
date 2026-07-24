# RUNDOC-AUTH.md — Page d'authentification apps/console (fidèle à la maquette Page 6)

> Run doc de la tâche. Source de vérité pour reprendre à tout moment.
> Objectif : page d'auth de `apps/console` fidèle à la maquette
> `eventflow-prototype/Page 6 - Auth.html`, composée UNIQUEMENT à partir du
> design system publié `@rwtechnology/eventflow-design-system`.

## 0. Décisions (validées avec l'utilisateur — 2026-07-24)
| # | Décision |
|---|---|
| Publication | Je code le DS + commit + tag `v0.1.2` + push ; **l'utilisateur / la CI publient** (pas de npm publish local possible). Version/CI/install = **à vérifier** (non exécutés par moi). |
| Intégration | `apps/console` branché **directement** sur `@rwtechnology` (tokens.css + styles.css dans globals.css ; preset DS ajouté à Tailwind). |
| Composants manquants | Créés dans le DS : **Alert**, **PasswordInput**, **PasswordStrength**, **AuthLayout**. Version **0.1.2** (patch). |
| Emplacement UI | **`@ef/shell`** (comme la référence `cp-admin-console` où LoginForm vit dans shell) — `@ef/auth` reste serveur-only. Fichier : `packages/shell/auth-page.tsx`. |
| Comportement | **Visuel seul** (fidèle maquette) — pas de `signIn` câblé (« ne pas traiter le backend auth »). États démo via query params `?vue=`/`?etat=`. |

## 1. Blocage publication (CONSTAT VÉRIFIÉ)
- Pas de `GITHUB_TOKEN` en env. `.npmrc` du monorepo = `//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}`.
- `npm whoami` (GitHub Packages) → **403** ; `npm view @rwtechnology/... ` → **401**. Impossible de publier/lire le registre d'ici.
- `gh` loggé en `Full-Stack-Ninja` (scopes repo/workflow) mais **sans accès API** au repo privé RwTechnology (cf. RUNDOC du DS).
- Publication réelle = **CI sur tag `v*`** (`.github/workflows/publish.yml`). Chemin : commit → tag `v0.1.2` → push → Actions publie → `npm install` la nouvelle version dans eventflow.
- **Conséquence** : le build complet de `apps/console` NE PEUT PAS réussir tant que `0.1.2` n'est pas publié+installé (les 4 nouveaux sous-chemins ne résolvent pas sur `0.1.1`). Aucun résultat de build app inventé.

## 2. Tableau d'analyse (élément maquette → composant DS → statut → action)
| Élément maquette | Composant @rwtechnology | Statut | Action |
|---|---|---|---|
| Layout split (panneau marque gray-950 + form max-w-400) | **AuthLayout** | à créer | **créé** (`auth-layout`) |
| Panneau marque : trame points + 3 billets 3D en dérive + accroche | intégré à AuthLayout (`ef-auth-*` + `animate-drift`) | à créer | **créé** |
| Logo (ticket + wordmark) | slot `brand` (contenu app, pas un composant DS) | n/a | composé dans AuthPage |
| Champ e-mail / prénom / nom | **Field + Input** | conforme (0.1.1) | utilisé tel quel (keyline S4 déjà dans Input) |
| Champ mot de passe + œil afficher/masquer | **PasswordInput** | à créer | **créé** (`password-input`) |
| Jauge de robustesse (4 segments) | **PasswordStrength** | à créer | **créé** (`password-strength`) |
| Case « Rester connectée » | **Checkbox** | conforme | utilisé tel quel |
| Bouton primaire 48px (loading possible) | **Button** (`size="lg"`) | conforme | utilisé tel quel (relief S5 déjà dans Button) |
| Bandeau erreur global `role=alert` | **Alert** (tone danger) | à créer | **créé** (`alert`) |
| Note succès `role=status` (oubli) | **Alert** (tone success, role=status) | à créer | **créé** |
| Lien « Retour au site » | **Button asChild variant=ghost** | conforme | composé dans AuthPage |
| Liens bascule connexion⇄inscription⇄oubli | boutons texte accent (contenu app) | conforme | composé (state `vue`) |

## 3. Fichiers créés/modifiés
### Design system (`eventflow-design-system`)
- **NOUVEAU** `src/components/alert/{alert.tsx,index.ts}`
- **NOUVEAU** `src/components/password-input/{password-input.tsx,index.ts}`
- **NOUVEAU** `src/components/password-strength/{password-strength.tsx,index.ts}`
- **NOUVEAU** `src/components/auth-layout/{auth-layout.tsx,index.ts}`
- `src/index.ts` (+4 exports barrel), `tsup.config.ts` (+4 entrées), `package.json` (+4 exports, version 0.1.1→**0.1.2**)
- `src/preset.ts` (+ keyframes/animations `drift`, `rise`)
- `src/styles.css` (+ utilities `ef-auth-*` ; reduced-motion pour drift/rise)
- `src/tokens/tokens.css` (Space Mono — hérité de la tâche d'alignement précédente, inclus dans ce commit)
- **Vérifs réelles** : `npm run typecheck` OK ; `npm run build` OK (4 composants → dist JS+d.ts, styles.css compilé avec ef-auth-*, tokens.css avec Space Mono) ; grep hex sources composants = 0.

### Monorepo (`eventflow`)
- **NOUVEAU** `packages/shell/auth-page.tsx` (AuthPage, 3 vues, 100% composants DS)
- `packages/shell/index.tsx` (+ export AuthPage), `packages/shell/package.json` (+ dep `@rwtechnology/...@^0.1.2`, + peer `lucide-react`)
- `apps/console/app/login/page.tsx` (re-export `AuthPage` depuis `@ef/shell` ; lit `?vue`/`?etat` async — Next 16)
- `apps/console/app/globals.css` (+ `@import` tokens.css + styles.css du DS)
- `apps/console/tailwind.config.ts` (presets = [dsPreset, efPreset] ; content + dist du DS)

## 4. Points à valider / à faire (NON exécutés par moi)
1. **Publier `0.1.2`** : dans `eventflow-design-system`, `git push` du commit + `git push origin v0.1.2` (tag annoté) → CI Actions publie. À VÉRIFIER par l'utilisateur (onglet Actions).
2. **Installer** dans eventflow : `npm install` (bump `^0.1.1`→`^0.1.2` dans root package.json + shell dep). À faire après publication.
3. **Build app** : `npm run build -w apps/console` — ne réussira qu'après 1+2. NON exécuté ici.
4. **Écart de fidélité connu** : champ e-mail inscription = message **succès vert** dans la maquette ; le `Field` du DS n'a qu'un état neutre (`description`) ou erreur (`danger`). Rendu ici en `description` neutre. Décision : enrichir `Field` d'un état succès, ou l'assumer. À valider.
5. **Comportement submit** : boutons `type="button"` sans `signIn` (visuel seul, décidé). À câbler quand le backend auth sera traité.

## 4bis. Sandbox retiré — login = page d'entrée (2026-07-24)
- Demande : la page **login** devient l'entrée de l'app console ; **sandbox supprimé**.
- `npm run gen:unregister` (via `npx plop unregister console sandbox`) → `@ef/sandbox` retiré de
  `package.json` + `modules.json` + `registry.ts` (registry désormais **vide**).
- **Suppression disque** (destructif, confirmé) : `packages/sandbox/` + route générée `app/(app)/sandbox/`.
- Nettoyage des références source : `next.config.ts` (retiré de `SHARED_INTERNAL_PACKAGES`),
  `tailwind.config.ts` (glob `packages/sandbox/**` retiré), commentaires `auth-options.ts`/`next.config.ts`.
- Résultat : `app/page.tsx` (racine) redirige vers `/login` car `registry` est vide (logique déjà en place).
  Groupe `(app)` laissé tel quel (nav réapparaîtra si un module est réembarqué). `.next` purgé ;
  `scaffold-routes` → « 0 route(s) » (cohérent). Reste `packages/` = auth, module-kit, shell.
- **Vérif** : `tsc -p apps/console` → **aucune** erreur liée à sandbox/registry/page/config ; les seules
  erreurs restantes sont celles (déjà connues) du `@rwtechnology@0.1.2` non encore installé. Rien inventé.

## 5. Journal
### 2026-07-24
- Maquette lue, apps/console + packages + DS inventoriés. Blocage publication constaté (401/403, pas de token).
- 4 composants DS créés (Alert/PasswordInput/PasswordStrength/AuthLayout) + 3 enregistrements + v0.1.2. typecheck+build DS OK.
- Référence `cp-admin-console` consultée → UI d'auth placée dans shell (comme LoginForm là-bas), submit visuel-seul.
- AuthPage composée dans `@ef/shell` ; apps/console branché (globals, tailwind 2 presets, page re-export).
- Feu vert utilisateur → **commit `767fdf0`** sur `main` + **tag annoté `v0.1.2`** créés et **poussés** sur
  `origin` (`e087ac3..767fdf0 main` ; `[new tag] v0.1.2`). Le push du tag déclenche `publish.yml`.
- **NON VÉRIFIABLE d'ici** (limitation d'accès confirmée) : `gh run list` → **404** (compte `Full-Stack-Ninja`
  sans accès API au repo privé) ; `npm view @rwtechnology/...@0.1.2` → **401** (pas d'auth registre).
  → **La réussite de la CI et la publication effective de 0.1.2 restent À VÉRIFIER par l'utilisateur**
  (onglet Actions GitHub). Aucun résultat de publication inventé.
- RESTE À FAIRE après publication confirmée : bump `^0.1.1`→`^0.1.2` (root + shell déjà en `^0.1.2`) puis
  `npm install`, puis `npm run build -w apps/console`.
