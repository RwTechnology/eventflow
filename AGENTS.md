# AGENTS.md — Instructions pour les agents IA (EventFlow)

Ce dépôt est un **monorepo npm-workspaces** (pas Turborepo, pas Nx, pas pnpm).
Namespace des packages internes : **`@ef/*`**. Référence d'architecture complète :
[`MONOREPO-GUIDE.md`](../MONOREPO-GUIDE.md) (à la racine du dossier de travail).

## 1. Règles de fond (à ne JAMAIS violer)

- **Un module = un package `@ef/<id>` dans `packages/`. Une app = une composition
  dans `apps/`.** Ne jamais écrire de logique produit directement dans une app.
- **Les corps de page vivent UNIQUEMENT dans `packages/<m>/pages/`.** Dans une app,
  une route est toujours un re-export **généré** — ne jamais l'écrire à la main
  ni y mettre de logique. Fichiers portant la bannière `// GENERATED …` = **ne pas éditer**.
- **La frontière IP est le `package.json` de l'app.** Ne jamais faire importer à une
  app (ou à ses modules) un package absent de ses `dependencies`. Ne jamais suggérer
  d'importer directement entre modules produits.
- **Ne jamais introduire Turbo/Nx/pnpm** : l'outillage est **npm workspaces** uniquement.
  Un seul lockfile à la racine.
- **Packages consommés en TS source** : pas d'étape de build par package, pas de `dist/`.
  Tout nouveau package `@ef/*` embarqué par une app doit être ajouté à son
  `transpilePackages` (dans `next.config.ts`).

## 2. Workflow à imposer

- **Créer un module** : `npm run gen:module` (puis `gen:register` pour l'attacher à une app).
- **Créer une app** : `npm run gen:app`.
- **(Dé)brancher un module d'une app** : `npm run gen:register` / `gen:unregister`.
  Ces générateurs éditent `modules.json`, `registry.ts` et le `package.json` de l'app
  par **parsing JSON** — ne pas éditer ces fichiers à la main quand un générateur existe.
- Après tout ajout/retrait de module : `npm install` puis
  `npm run build -w apps/<app>` (le `prebuild` régénère et prune les routes).
- **Module à backend** : 3 câblages manuels après `gen:module --variant auth` :
  1. ajouter le `<camel>AuthDescriptor` à `auth-options.ts` de l'app ;
  2. ajouter `../../packages/<id>/next-auth.d.ts` au `include` du `tsconfig.json` de l'app ;
  3. ajouter `<camel>NextConfig` aux `moduleConfigs` de `next.config.ts` de l'app.

## 3. Conventions à faire respecter

- id module `kebab-case` ; export nav `<camel>Module` ; export de page `<Pascal>Page` ;
  package `@ef/<id>`.
- `registry.ts` : ordre = ordre des eyebrows ; `systemModule` en dernier.
- Tailwind `content` : scoper aux **seuls** packages embarqués — ne jamais élargir
  à `packages/**` global.
- `proxy.ts` : `export const config` doit rester un **littéral inline** (Next 16 le parse
  statiquement) — ne pas le remplacer par un import.

## 4. Avant de valider une réponse (vérification)

1. Le nouveau code produit est-il dans `packages/`, jamais dans `apps/` ?
2. L'app cible liste-t-elle le module dans `package.json` **et** `modules.json`
   **et** `registry.ts` ?
3. Le module a-t-il un `routes.manifest.json` cohérent avec ses `pages/` ?
4. `transpilePackages` et le `content` Tailwind de l'app incluent-ils le nouveau package ?
5. Aucun import ne traverse la frontière IP (module→module, ou app→package non déclaré) ?

## 5. Contrainte projet particulière (OBLIGATOIRE)

Ce dépôt tourne sur **Next.js 16** (breaking changes vs. connaissances d'entraînement).
**Avant d'écrire du code Next.js, lire le guide pertinent dans
`node_modules/next/dist/docs/`** et respecter les avis de dépréciation. Points saillants
déjà pris en compte dans ce socle :

- **`middleware.ts` → `proxy.ts`** : le fichier s'appelle `proxy.ts`, la fonction `proxy`.
  Runtime `nodejs` (edge non supporté).
- **Turbopack par défaut** pour `next dev`/`next build` : ne pas ajouter de config `webpack`
  (le build échouerait).
- **APIs de requête asynchrones** : `cookies()`, `headers()`, `params`, `searchParams`
  sont des Promises — toujours `await`.
- **`next lint` supprimé** : le lint passe par `eslint` directement (script racine `lint`).
- **Config ESLint plate** (flat config) unique à la racine.
